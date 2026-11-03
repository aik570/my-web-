#!/usr/bin/env python3
"""Collect exact product images for every catalogue model, check them and report the result.

    python3 scripts/collect-product-images.py                       # full run (resumes from cache)
    python3 scripts/collect-product-images.py --brand Samsung       # one brand
    python3 scripts/collect-product-images.py --report-only         # rebuild CSV/sheets/ZIP from cache

Input : project-audit/handy-chirurg-image-workflow.csv (brand, model, slug, asset_filename, ...)
Output: product-images/
          assets/img/produkte/<asset_filename>   normalized 600x800 WebP, white canvas, no EXIF
          originals/<asset_filename stem>.<ext>  file as downloaded (for re-processing)
          contact-sheets/<brand>-<n>.png         thumbnails with model, catalogue ID, source, status
          manifest.json                          one record per model
          REPORT.md                              exact counts
          handy-chirurg-product-images.zip       images + manifest + sheets + CSV
        project-audit/handy-chirurg-image-workflow.csv  (updated in place; no column is removed)

Images are NOT published by this script. product-images/ is outside src/, so nothing here reaches
the website. A file goes live only after a person confirms model and licence and registers it in
/admin/ (Laden & Kontakt > Produktfotos) or with scripts/photos/normalize.py.

Sources, in this order:
  1. Wikimedia Commons (API): files in the model's own category, else an exact title search.
     Only free licences (CC0, CC BY, CC BY-SA, public domain) are accepted; imageinfo gives
     the original URL, MIME, size and licence metadata.
  2. Samsung Mobile Press (official manufacturer media page per model). Its terms allow personal,
     informational, non-commercial use only, so every file from there is RIGHTS_REVIEW_REQUIRED.
Apple's design resources only offer front bezel frames (iPhone 16-18) under an app-marketing
licence, and Apple/Google newsroom images are for news use; they are not collected.

Statuses (download_result):
  DOWNLOADED_CANDIDATE    free licence, packshot checks passed, waiting for a visual check
  VISUALLY_VERIFIED       a person looked at the sheet and confirmed the exact model
                          (scripts/photos/visual-review.json); never set automatically
  RIGHTS_REVIEW_REQUIRED  exact model from the manufacturer, licence does not cover the shop site
  DUPLICATE               same file / near-identical image as another model
  MISSING                 no exact, clean image found in the sources
  FAILED                  network or file error (see notes); re-run to retry
"""
import argparse, csv, hashlib, html, io, json, os, pathlib, random, re, sys, time, urllib.error, urllib.parse, urllib.request, zipfile

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont
try:
    import imagehash
except ImportError:  # pip install imagehash
    imagehash = None

ROOT = pathlib.Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / 'project-audit/handy-chirurg-image-workflow.csv'
OUT = ROOT / 'product-images'
CACHE = ROOT / '.cache/image-collect'
REVIEW = ROOT / 'scripts/photos/visual-review.json'
SITE_PHOTOS = ROOT / 'src/_data/modelImages.json'
UA = 'HandyChirurgImageCollector/1.0 (https://www.handychirurg.de; product image licence research)'
W, H, PAD = 600, 800, 0.08
FREE = re.compile(r'^(cc0|cc[ -]by(-sa)?([ -]\d\.\d)?|public domain|pd\b|pd-|attribution)', re.I)
BAD_WORDS = re.compile(r'box|packag|screenshot|screen ?shot|teardown|disassembl|inside|interior|repair|logo|hand|held|holding|user|people|person|store|shop|booth|mwc|ifa|expo|event|launch|ad\b|advert|billboard|poster|case|cover|charger|cable|dock|stand|keyboard|chart|diagram|icon|svg|screen\b|display\b|lcd|oled|battery|akku|part\b|spare|replacement|simulator|docs|wallpaper|ui\b|interface|camera ?sample|sample|photo taken|taken with|shot on|render(ing)? of', re.I)
VARIANTS = {'pro', 'max', 'plus', 'mini', 'lite', 'ultra', 'fe', 'edge', 'neo', 'prime', 'note', 'xl', 'xr', 'xs', 'x', 'se', 'fold', 'flip', 'active', 'compact', 'premium', 'play', 'power', 'go', 'core', 'nord', 'mate', 'nova', 'redmi', 'poco', 'honor', 'smart', 'e', 's', 't', 'r', 'a', 'c', 'y', 'm', 'j'}

# ------------------------------------------------------------------ HTTP with cache + backoff
WM = {'log': [], 'until': 0, 'off': False}   # Wikimedia hosts: recent outcomes (True = 429) and pause end
def is_wm(url): return (urllib.parse.urlsplit(url).hostname or '').endswith('wikimedia.org')
def commons_down():
    if WM['off']: return True
    if time.time() < WM['until']: return True
    return False
def wm_note(limited):
    WM['log'] = (WM['log'] + [limited])[-10:]
    if sum(WM['log']) >= 5: WM['until'] = time.time() + 1200; WM['log'] = []   # pause Commons for 20 minutes

def http(url, binary=False, accept=None):
    key = hashlib.sha1(url.encode()).hexdigest()
    p = CACHE / ('bin' if binary else 'txt') / key
    if p.exists():
        return 200, p.read_bytes() if binary else p.read_text('utf8'), json.loads((p.with_suffix('.h')).read_text()) if p.with_suffix('.h').exists() else {}
    last = 0
    wm = is_wm(url)
    if wm and commons_down(): return 429, None, {}
    for i in range(2 if wm else 6):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA, **({'Accept': accept} if accept else {})})
            r = urllib.request.urlopen(req, timeout=40)
            body = r.read(); hdr = {'status': r.status, 'type': r.headers.get('Content-Type', ''), 'disposition': r.headers.get('Content-Disposition', '')}
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(body) if binary else p.write_text(body.decode('utf8', 'ignore'), 'utf8')
            p.with_suffix('.h').write_text(json.dumps(hdr))
            if wm: wm_note(False)
            time.sleep(1.0 + random.random())
            return 200, body if binary else body.decode('utf8', 'ignore'), hdr
        except urllib.error.HTTPError as e:
            last = e.code
            if e.code in (404, 403, 410): return e.code, None, {}
            if e.code == 429 or e.code >= 500:
                wait = int(e.headers.get('Retry-After') or 0) or 10 * (i + 1)
                time.sleep(min(wait, 15 if wm else 60) + random.random() * 3); continue
            return e.code, None, {}
        except Exception as e:
            last = str(e)[:60]; time.sleep(4 * (i + 1))
    if wm and last == 429: wm_note(True)
    return last or 0, None, {}

# ------------------------------------------------------------------ model names
def norm(s):
    s = s.lower().replace('+', ' plus ').replace('iphone', 'iphone ')
    s = re.sub(r'\(.*?\)', ' ', s)
    s = re.sub(r'\d{4}[-_.]\d{2}[-_.]\d{2}', ' ', s)
    s = re.sub(r'\.(jpe?g|png|webp|tiff?)$', ' ', s)
    s = re.sub(r'(\d)(gb|tb|mp)\b', ' ', s)
    s = re.sub(r'[^a-z0-9]+', ' ', s)
    s = re.sub(r'\b(\d+)([a-z]{1,2})\b', lambda m: m.group(1) + ' ' + m.group(2) if m.group(2) in VARIANTS else m.group(0), s)  # 13pro -> 13 pro
    return s.split()

def model_tokens(brand, model):
    t = [x for x in norm(model) if x not in ('galaxy', 'iphone', 'pixel', 'xperia', 'xiaomi', 'mi', 'huawei', 'oneplus', '5g', '4g', 'lte')]
    return set(t)

def title_matches(brand, model, title):
    """The file title must not name another variant or number than the model; it may say less."""
    mt = model_tokens(brand, model)
    tt = [x for x in norm(title) if not re.fullmatch(r'\d{3,}', x)]
    nums_m = {x for x in mt if x.isdigit()}
    # a title that names the model number must also name its variant ("iPhone 15" is not the 15 Pro Max)
    if nums_m & set(tt) and any(v in VARIANTS and v not in tt for v in mt): return False
    for x in tt:
        if x.isdigit() and len(x) <= 2 and x not in nums_m: return False
        if x in VARIANTS and x not in mt: return False
        if re.fullmatch(r'[a-z]\d{1,3}', x) and x not in mt and len(mt) and any(re.fullmatch(r'[a-z]\d{1,3}', y) for y in mt): return False
    return True

def title_names_model(brand, model, title):
    mt = model_tokens(brand, model); tt = set(norm(title))
    return mt and mt <= tt

def commons_names(brand, model):
    n = model; out = []
    base = [n, re.sub(r' (5G|4G)$', '', n)]
    for x in dict.fromkeys(base):
        if brand == 'Apple':
            se = {'iPhone SE (2020)': 'IPhone SE (2nd generation)', 'iPhone SE (2022)': 'IPhone SE (3rd generation)', 'iPhone SE (2016)': 'IPhone SE (1st generation)', 'iPhone SE': 'IPhone SE (1st generation)'}
            if x in se: out.append(se[x]); continue
            out += ['I' + x[1:], ('I' + x[1:]).replace(' mini', ' Mini')] if x.startswith('iPhone') else [x[0].upper() + x[1:]]
        elif brand == 'Samsung':
            out += ['Samsung ' + x, 'Samsung ' + x.replace(' Plus', '+'), 'Samsung Galaxy ' + x.replace('Galaxy ', '')]
        elif brand == 'Huawei':
            out += ([x, 'Huawei ' + x] if x.startswith('Honor') else ['Huawei ' + x])
        elif brand == 'Xiaomi':
            out += [x] + ([] if x.startswith('Xiaomi') else ['Xiaomi ' + x]) + ([x.replace('Mi ', 'Xiaomi Mi ')] if x.startswith('Mi ') else [])
        elif brand == 'Sony':
            out.append(x if x.startswith('Sony') else 'Sony ' + x)
        elif brand == 'Google':
            out.append(x if x.startswith('Google') else 'Google ' + x)
        else:
            out += [x, brand + ' ' + x if not x.startswith(brand) else x]
    return list(dict.fromkeys(out))

# ------------------------------------------------------------------ image checks
def isolate(im, official=False):
    """Return the device cropped from a light, even background, or raise ValueError.
    official=True (manufacturer identification / press images): these are often cropped tight to the
    devices on white, so a white margin is added before the checks; the contact sheet review still applies."""
    im = im.convert('RGBA')
    a = im.getchannel('A'); cutout = a.getextrema()[0] < 10
    if official and not cutout:
        m = max(8, round(max(im.size) * .03)); padded = Image.new('RGBA', (im.width + 2 * m, im.height + 2 * m), (255, 255, 255, 255)); padded.paste(im, (m, m)); im = padded
    if cutout:   # transparent background: cut-out packshot, often cropped tight -> add a margin
        m = max(8, round(max(im.size) * .03)); padded = Image.new('RGBA', (im.width + 2 * m, im.height + 2 * m), (255, 255, 255, 0)); padded.paste(im, (m, m)); im = padded
    flat = Image.new('RGB', im.size, (255, 255, 255)); flat.paste(im, mask=im.getchannel('A'))
    w, h = flat.size; px = flat.load()
    edge = [px[x, y] for x in range(0, w, max(1, w // 60)) for y in (0, h - 1)] + [px[x, y] for y in range(0, h, max(1, h // 60)) for x in (0, w - 1)]
    light = sum(1 for p in edge if min(p) > 225) / len(edge)
    spread = max(max(p) - min(p) for p in edge)
    if light < 0.95: raise ValueError(f'background not light and even ({light:.0%} of the edge)')
    bgc = tuple(sorted(p[i] for p in edge)[len(edge) // 2] for i in range(3))
    diff = ImageChops.difference(flat, Image.new('RGB', flat.size, bgc)).convert('L')
    mask = diff.point(lambda v: 255 if v > 26 else 0).filter(ImageFilter.MedianFilter(9))
    if cutout: mask = im.getchannel('A').point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MedianFilter(5))   # the alpha channel is the exact outline
    box = mask.getbbox()
    if not box: raise ValueError('empty image')
    if min(box[0], box[1], w - box[2], h - box[3]) < 2: raise ValueError('device touches the edge (cropped or scene)')
    # a lineup (several colours, front + back) is split at empty columns; the largest device is kept
    cols = [any(v > 127 for v in mask.crop((x, box[1], x + 1, box[3])).get_flattened_data()) for x in range(box[0], box[2])]
    gap = max(3, w // 150); segs = []; start = None; empty = 0
    for i, c in enumerate(cols + [False] * (gap + 1)):
        if c:
            if start is None: start = i
            empty = 0
        elif start is not None:
            empty += 1
            if empty > gap: segs.append((start, i - empty + 1)); start = None; empty = 0
    if len(segs) > 1:
        area = lambda sg: sum(1 for v in mask.crop((box[0] + sg[0], box[1], box[0] + sg[1], box[3])).get_flattened_data() if v > 127)
        a, b = max(segs, key=area)
        sub = mask.crop((box[0] + a, box[1], box[0] + b, box[3])).getbbox()
        box = (box[0] + a + sub[0], box[1] + sub[1], box[0] + a + sub[2], box[1] + sub[3])
        lineup = len(segs)
    else:
        lineup = 1
    bw, bh = box[2] - box[0], box[3] - box[1]
    if bw * bh < 0.01 * w * h: raise ValueError('device too small in the frame')
    ratio = bh / max(bw, 1)
    if ratio < 0.35: raise ValueError('object far wider than a phone (group or banner)')
    cover = sum(1 for v in mask.crop(box).resize((60, 60)).get_flattened_data() if v > 127) / 3600
    if cover < 0.55: raise ValueError(f'not a solid device outline ({cover:.0%} filled – drawing, text or scene)')
    if not (official or cutout):   # grey photo backdrop -> white; official images are kept pixel for pixel
        soft = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2))
        flat = Image.composite(flat, Image.new('RGB', flat.size, (255, 255, 255)), soft)
    out = flat.crop(box); out.info['lineup'] = lineup
    return out

def normalize(dev):
    s = min(W * (1 - 2 * PAD) / dev.width, H * (1 - 2 * PAD) / dev.height)
    dev = dev.resize((max(1, round(dev.width * s)), max(1, round(dev.height * s))), Image.LANCZOS)  # same factor both axes: no distortion
    can = Image.new('RGB', (W, H), (255, 255, 255)); can.paste(dev, ((W - dev.width) // 2, (H - dev.height) // 2))
    return can

def phash(im):
    if imagehash: return str(imagehash.phash(im))
    g = im.convert('L').resize((8, 8)); v = list(g.get_flattened_data()); a = sum(v) / 64
    return '%016x' % sum(1 << i for i, x in enumerate(v) if x > a)

def hamming(a, b): return bin(int(a, 16) ^ int(b, 16)).count('1')

# ------------------------------------------------------------------ sources
API = 'https://commons.wikimedia.org/w/api.php?'
def commons_files(brand, model):
    """Yield (title, info, via) for files of the model's category, then for an exact title search."""
    seen = set()
    for cat in commons_names(brand, model):
        q = API + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'categorymembers', 'gcmtitle': 'Category:' + cat, 'gcmtype': 'file', 'gcmlimit': 40, 'prop': 'imageinfo', 'iiprop': 'url|mime|size|extmetadata|sha1', 'iiurlwidth': 900, 'redirects': 1})
        st, body, _ = http(q)
        if st != 200 or not body:
            if st not in (200, 404): yield ('__error__', {'status': st}, 'category')
            continue
        pages = (json.loads(body).get('query') or {}).get('pages') or {}
        for p in sorted(pages.values(), key=lambda p: p.get('title', '')):
            if p['title'] in seen: continue
            seen.add(p['title']); yield (p['title'], (p.get('imageinfo') or [{}])[0], 'category ' + cat)
        if pages: return
    q = API + urllib.parse.urlencode({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': f'intitle:"{commons_names(brand, model)[0]}"', 'gsrnamespace': 6, 'gsrlimit': 20, 'prop': 'imageinfo', 'iiprop': 'url|mime|size|extmetadata|sha1', 'iiurlwidth': 900})
    st, body, _ = http(q)
    if st != 200 or not body:
        yield ('__error__', {'status': st}, 'search'); return
    for p in ((json.loads(body).get('query') or {}).get('pages') or {}).values():
        if p['title'] not in seen and title_names_model(brand, model, p['title']):
            yield (p['title'], (p.get('imageinfo') or [{}])[0], 'search')

def meta(info, k): return re.sub(r'<[^>]+>', '', str(((info.get('extmetadata') or {}).get(k) or {}).get('value', ''))).strip()

SMP_SLUGS = None
def smp_slug(row):
    global SMP_SLUGS
    if SMP_SLUGS is None:
        st, body, _ = http('https://www.samsungmobilepress.com/sitemap.xml')
        SMP_SLUGS = sorted(set(re.findall(r'/media-assets/(galaxy-[a-z0-9-]+)<', body or '')))
    key = lambda s: s.replace('-', '').replace('plus', 'plus')
    want = key(row['slug']); table = {key(s): s for s in SMP_SLUGS}
    if want in table: return table[want]
    if not row['slug'].endswith('5g') and want + '5g' in table and not row.get('_has5g'): return table[want + '5g']
    return None

def smp_image(slug):
    st, body, _ = http('https://www.samsungmobilepress.com/media-assets/' + slug)
    if st != 200 or not body: return None, st
    s = body.replace('\\\\"', '"').replace('\\"', '"')
    m = re.search(r'"@type":"Product","name":"([^"]+)","image":"(https://api\.samsungmobilepress\.com/api/v1/file/[0-9A-F]+)"', s)
    return (m.group(2), m.group(1)) if m else (None, 'no product image on page')

APPLE_PAGES = ['https://support.apple.com/en-us/108044', 'https://support.apple.com/en-us/108043', 'https://support.apple.com/en-us/108056']
# catalogue name -> heading on Apple's "Identify your model" pages (same device, Apple's naming)
APPLE_ALIAS = {
    'iPhone SE (2022)': 'iPhone SE (3rd generation)', 'iPhone SE (2020)': 'iPhone SE (2nd generation)',
    'iPhone SE (2016)': 'iPhone SE (1st generation)', 'iPhone SE': 'iPhone SE (1st generation)',
    'iPad Pro 13 Zoll 1. Gen': 'iPad Pro 13-inch (M4)', 'iPad Pro 12.9 Zoll 1. Gen': 'iPad Pro (12.9-inch)',
    **{f'iPad Pro 12.9 Zoll {n}. Gen': f'iPad Pro 12.9-inch ({o} generation)' for n, o in [(2, '2nd'), (3, '3rd'), (4, '4th'), (5, '5th'), (6, '6th')]},
    'iPad Pro 11 Zoll 1. Gen': 'iPad Pro 11-inch',
    **{f'iPad Pro 11 Zoll {n}. Gen': f'iPad Pro 11-inch ({o} generation)' for n, o in [(2, '2nd'), (3, '3rd'), (4, '4th')]},
    'iPad Pro 10.5 Zoll': 'iPad Pro (10.5-inch)', 'iPad Pro 9.7 Zoll': 'iPad Pro (9.7-inch)',
    'iPad Mini 7': 'iPad mini (A17 Pro)', 'iPad Mini 6': 'iPad mini (6th generation)', 'iPad Mini 5': 'iPad mini (5th generation)',
    'iPad Air 13 Zoll 1. Gen': 'iPad Air 13-inch (M2)', 'iPad Air 11 Zoll 1. Gen': 'iPad Air 11-inch (M2)',
    'iPad Air 5': 'iPad Air (5th generation)', 'iPad Air 4': 'iPad Air (4th generation)', 'iPad Air 3': 'iPad Air (3rd generation)', 'iPad Air 2': 'iPad Air 2',
    'iPad 10 (2022 10.9 Zoll)': 'iPad (10th generation)', 'iPad 9 (2021 10.2 Zoll)': 'iPad (9th generation)', 'iPad 8 (2020 10.2 Zoll)': 'iPad (8th generation)',
    'iPad 7. Gen': 'iPad (7th generation)', 'iPad 6. Gen': 'iPad (6th generation)', 'iPad 5. Gen': 'iPad (5th generation)',
    'Apple Watch Series SE 40/44mm': 'Apple Watch SE', 'Apple Watch SE 2. Gen 40/44 mm': 'Apple Watch SE 2',
    **{f'Apple Watch Series {n} {s}': f'Apple Watch Series {n}' for n, s in [(9, '41/45mm'), (8, '41/45mm'), (7, '41/45mm'), (6, '40/44mm'), (5, '40/44 mm'), (4, '40 mm'), (4, '44 mm'), (3, '38/42 mm'), (2, '38 mm'), (2, '42 mm'), (1, '38 mm'), (1, '42 mm')]},
}
APPLE_IMGS = None
def apple_image(model):
    """Official product image from Apple's support page that identifies this exact model."""
    global APPLE_IMGS
    if APPLE_IMGS is None:
        APPLE_IMGS = {}
        for page in APPLE_PAGES:
            st, body, _ = http(page)
            for m in re.finditer(r'<h2[^>]*>(.*?)</h2>(.*?)(?=<h2|$)', body or '', re.S):
                head = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).replace('\u2011', '-').strip()
                img = re.search(r'<img[^>]+src="(https://cdsassets\.apple\.com/[^"]+\.(?:png|jpe?g))"', m.group(2))
                if img: APPLE_IMGS[head] = (img.group(1), page)
    want = APPLE_ALIAS.get(model, model)
    return (want,) + APPLE_IMGS[want] if want in APPLE_IMGS else (want, None, None)

SITE = None
def site_photo(row):
    """A photo already registered for the website (licence recorded in src/_data/modelImages.json)."""
    global SITE
    if SITE is None:
        SITE = {}
        if SITE_PHOTOS.exists():
            for e in json.loads(SITE_PHOTOS.read_text()).get('photos', []): SITE[e.get('model')] = e
    return SITE.get(row['model']) or SITE.get(key_of(row))

# ------------------------------------------------------------------ per model
def fetch_image(url):
    st, data, hdr = http(url, binary=True)
    if st != 200 or not data: return None, f'HTTP {st}', hdr
    if not (hdr.get('type', '').startswith('image/') or hdr.get('type', '') in ('', 'application/octet-stream')): return None, f'not an image ({hdr.get("type")})', hdr
    try:
        im = Image.open(io.BytesIO(data)); im.load()
    except Exception as e:
        return None, f'unreadable image ({e})', hdr
    if im.format not in ('JPEG', 'PNG', 'WEBP'): return None, f'format {im.format}', hdr
    if min(im.size) < 300: return None, f'too small {im.size}', hdr
    return (im, data), 'ok', hdr

def process(row, rec):
    brand, model = row['brand'], row['model']
    stem = row['asset_filename'].rsplit('.', 1)[0]
    tried, errors = [], []
    found = None; downloads = 0; got = None
    sp = site_photo(row)
    if sp and (ROOT / 'src' / sp['image'].lstrip('/')).exists():
        data = (ROOT / 'src' / sp['image'].lstrip('/')).read_bytes(); im = Image.open(io.BytesIO(data)); im.load()
        got = (im, data); dev = isolate(im)
        found = dict(source='Website (registered photo)', via='src/_data/modelImages.json', file_page=sp.get('source', ''), direct_image_url=sp.get('source', ''),
                     downloaded_url='', license=sp.get('license', ''), licenseUrl=sp.get('licenseUrl', ''), credit=sp.get('credit', ''), mime='image/webp',
                     original_size=list(im.size), rights='free licence, already registered for the website (' + sp.get('license', '') + ')', status='DOWNLOADED_CANDIDATE')
    for title, info, via in ([] if found or commons_down() else commons_files(brand, model)):
        if title == '__error__': errors.append(f'Commons {via}: HTTP {info["status"]}'); continue
        lic = meta(info, 'LicenseShortName')
        if info.get('mime') not in ('image/jpeg', 'image/png', 'image/webp'): continue
        if BAD_WORDS.search(title): tried.append(f'{title}: scene/accessory in title'); continue
        if not title_matches(brand, model, title): tried.append(f'{title}: other model/variant in title'); continue
        if not FREE.search(lic or ''): tried.append(f'{title}: licence {lic or "unknown"}'); continue
        downloads += 1
        if downloads > 10: tried.append('stopped after 10 downloads for this model'); break
        url = info.get('thumburl') or info.get('url')
        got, why, hdr = fetch_image(url)
        if not got:
            tried.append(f'{title}: {why}')
            if why.startswith('HTTP') and why not in ('HTTP 404', 'HTTP 403'): errors.append(f'{title}: {why}')
            continue
        try:
            dev = isolate(got[0])
        except ValueError as e:
            tried.append(f'{title}: {e}'); continue
        found = dict(source='Wikimedia Commons', via=via, file_page='https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                     direct_image_url=info.get('url'), downloaded_url=url, license=lic, licenseUrl=meta(info, 'LicenseUrl'),
                     credit=(meta(info, 'Artist') or '')[:120], mime=info.get('mime'), original_size=[info.get('width'), info.get('height')],
                     rights='free licence – attribution as stated', status='DOWNLOADED_CANDIDATE')
        break
    if not found and commons_down(): errors.append('Commons: skipped in this run (--no-commons)' if WM['off'] else 'Commons: HTTP 429 (rate limit for this network) – not checked in this run')
    if not found and brand == 'Apple':
        name, url, page = apple_image(model)
        if url:
            got, why, hdr = fetch_image(url)
            if got:
                try:
                    dev = isolate(got[0], official=True)
                    found = dict(source='Apple Support (official)', via=f'{page} – „{name}"', file_page=page, direct_image_url=url, downloaded_url=url,
                                 license='Apple Inc. – all rights reserved (support page image)', licenseUrl='https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html',
                                 credit='Apple Inc.', mime=hdr.get('type', '').split(';')[0], original_size=list(got[0].size), press_name=name,
                                 rights='RIGHTS_REVIEW_REQUIRED – Apple images need Apple\'s permission for use on a shop website', status='RIGHTS_REVIEW_REQUIRED')
                except ValueError as e:
                    tried.append(f'Apple support „{name}": {e}')
            else:
                tried.append(f'Apple support „{name}": {why}')
        else:
            tried.append(f'Apple support: no section „{name}" on the identify-your-model pages')
    if not found and brand == 'Samsung':
        slug = smp_slug(row)
        if slug:
            url, name = smp_image(slug)
            if url:
                got, why, hdr = fetch_image(url)
                if got:
                    try:
                        dev = isolate(got[0], official=True)
                        found = dict(source='Samsung Mobile Press', via='media-assets/' + slug, file_page='https://www.samsungmobilepress.com/media-assets/' + slug,
                                     direct_image_url=url, downloaded_url=url, license='Samsung Mobile Press terms: personal, informational, non-commercial use',
                                     licenseUrl='https://www.samsungmobilepress.com/terms-of-use', credit='Samsung Electronics', mime=hdr.get('type', '').split(';')[0],
                                     original_size=list(got[0].size), press_name=name, original_name=(re.search(r'fileName=([^;]+)', hdr.get('disposition', '')) or [None, ''])[1],
                                     rights='RIGHTS_REVIEW_REQUIRED – needs written permission or a licence for commercial use', status='RIGHTS_REVIEW_REQUIRED')
                    except ValueError as e:
                        tried.append(f'Samsung press {slug}: {e}')
                else:
                    tried.append(f'Samsung press {slug}: {why}')
            else:
                tried.append(f'Samsung press {slug}: {name}')
        else:
            tried.append('Samsung press: no media page for this model')
    if not found and not tried and not errors: tried.append('Commons: no file in the model category or exact title search')
    if not found:
        commons_unchecked = any('not checked' in e or 'HTTP 429' in e or 'skipped' in e for e in errors)
        rec.update(status='FAILED' if commons_unchecked or (errors and not tried) else 'MISSING', tried=tried[-12:], errors=errors[-5:]); return rec
    ext = {'image/png': 'png', 'image/webp': 'webp'}.get(found['mime'], 'jpg')
    (OUT / 'originals').mkdir(parents=True, exist_ok=True)
    orig = OUT / 'originals' / f'{stem}.{ext}'; orig.write_bytes(got[1])
    img = normalize(dev)
    dest = OUT / 'assets/img/produkte' / row['asset_filename']; dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, 'WEBP', quality=86, method=6)        # re-encoded: no EXIF/XMP is carried over
    if commons_down() and found['source'] == 'Samsung Mobile Press' or commons_down() and found['source'].startswith('Apple'): errors.append('Commons: free-licence alternative not checked in this run (' + ('--no-commons' if WM['off'] else 'HTTP 429') + ')')
    found['lineup'] = dev.info.get('lineup', 1); found['base_status'] = found['status']
    rec.update(found, tried=tried[-12:], errors=errors[-3:], local_image_path=str(dest.relative_to(OUT)), original_path=str(orig.relative_to(OUT)),
               sha256=hashlib.sha256(dest.read_bytes()).hexdigest(), sha256_original=hashlib.sha256(got[1]).hexdigest(), perceptual_hash=phash(img))
    return rec

# ------------------------------------------------------------------ duplicates, review, outputs
def dedupe(recs):
    """Same source file for two models = DUPLICATE. Near-identical images from different files are only noted:
    sibling models (e.g. Pro / Pro Max) can look alike, which proves nothing either way."""
    have = [r for r in recs if r.get('sha256')]
    for i, a in enumerate(have):
        same = next((b for b in have[:i] if a['sha256_original'] == b['sha256_original'] or (a.get('direct_image_url') and a.get('direct_image_url') == b.get('direct_image_url'))), None)
        near = [b['key'] for b in have if b is not a and hamming(a['perceptual_hash'], b['perceptual_hash']) <= 6]
        if same:
            a['duplicate_of'] = same['key']; a['status'] = 'DUPLICATE'
            a['duplicate_check'] = f"same source file as {same['key']}"
        else:
            a['duplicate_check'] = 'unique file (SHA-256)' + (f"; looks similar to {', '.join(near[:3])} (different source file)" if near else '; no similar image (pHash distance > 6)')

def apply_review(recs):
    rv = json.loads(REVIEW.read_text()) if REVIEW.exists() else {}
    for r in recs:
        v = rv.get(r['key'])
        if not v or not r.get('sha256'): continue
        if v.get('sha256') and v['sha256'] != r['sha256']: r['visual_match'] = 'review is for another file – look again'; continue
        r['visual_match'] = f"{v['verdict']} ({v.get('by', 'reviewer')}, {v.get('date', '')}): {v.get('note', '')}".strip()
        if v['verdict'] == 'EXACT' and r['status'] == 'DOWNLOADED_CANDIDATE': r['status'] = 'VISUALLY_VERIFIED'
        if v['verdict'] == 'REJECT': r['status'] = 'MISSING'; r['rejected'] = v.get('note', '')

def font(sz):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/usr/share/fonts/dejavu/DejaVuSans.ttf'):
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()

COL = {'VISUALLY_VERIFIED': (22, 128, 60), 'DOWNLOADED_CANDIDATE': (30, 90, 200), 'RIGHTS_REVIEW_REQUIRED': (200, 120, 0), 'DUPLICATE': (150, 60, 160), 'MISSING': (170, 170, 170), 'FAILED': (200, 30, 30)}
def sheets(recs):
    d = OUT / 'contact-sheets'; d.mkdir(parents=True, exist_ok=True)
    for f in d.glob('*.png'): f.unlink()
    f1, f2 = font(13), font(11)
    tw, th, cols, per = 200, 300, 6, 36
    out = []
    for brand in dict.fromkeys(r['brand'] for r in recs):
        rows = [r for r in recs if r['brand'] == brand]
        for page in range(0, len(rows), per):
            chunk = rows[page:page + per]; n = (len(chunk) + cols - 1) // cols
            sheet = Image.new('RGB', (cols * tw, 40 + n * th), (245, 245, 245)); dr = ImageDraw.Draw(sheet)
            dr.text((10, 10), f'{brand} – models {page + 1}–{page + len(chunk)} of {len(rows)}   (blue = candidate, orange = rights review, grey = missing)', fill=(0, 0, 0), font=f1)
            for i, r in enumerate(chunk):
                x, y = (i % cols) * tw, 40 + (i // cols) * th
                dr.rectangle([x + 4, y + 4, x + tw - 4, y + th - 4], fill=(255, 255, 255), outline=COL[r['status']], width=3)
                if r.get('local_image_path'):
                    t = Image.open(OUT / r['local_image_path']); t.thumbnail((tw - 20, 200)); sheet.paste(t, (x + (tw - t.width) // 2, y + 10))
                else:
                    dr.text((x + 60, y + 95), 'no image', fill=(150, 150, 150), font=f1)
                lines = [r['model'][:26], r['slug'][:30], (r.get('source') or '—')[:30], r['status']]
                for j, t in enumerate(lines): dr.text((x + 10, y + 216 + j * 18), t, fill=COL[r['status']] if j == 3 else (20, 20, 20), font=f1 if j == 0 else f2)
            p = d / f'{brand.lower()}-{page // per + 1}.png'; sheet.save(p, optimize=True); out.append(p)
    return out

def write_csv(rows, recs):
    by = {r['key']: r for r in recs}
    fields = list(rows[0].keys())
    for extra in ('source', 'license', 'notes'):
        if extra not in fields: fields.append(extra)
    for row in rows:
        r = by.get(key_of(row))
        if not r: continue
        ok = bool(r.get('local_image_path')) and (OUT / r['local_image_path']).exists()
        row['direct_image_url'] = r.get('direct_image_url', '') if ok else ''
        row['local_image_path'] = ('product-images/' + r['local_image_path']) if ok else ''
        row['candidate_file_path'] = row['local_image_path'] or row.get('candidate_file_path', '')
        row['download_result'] = r['status']
        row['sha256'] = r.get('sha256', '') if ok else ''
        row['perceptual_hash'] = r.get('perceptual_hash', '') if ok else ''
        row['duplicate_check'] = r.get('duplicate_check', 'n/a – no image') if ok else 'n/a – no image'
        row['visual_match'] = r.get('visual_match') or ('PENDING – check contact sheet' if ok else 'n/a – no image')
        row['rights_review'] = (r.get('rights') or '') if ok else 'n/a – no image'
        row['verification_status'] = r['status']
        row['source'] = r.get('file_page', '')
        row['license'] = r.get('license', '')
        row['notes'] = ' | '.join((r.get('tried') or [])[-3:] + (r.get('errors') or [])[-1:])[:500] if not ok or r['status'] == 'DUPLICATE' else (r.get('via') or '')
    with open(CSV_PATH, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.DictWriter(f, fieldnames=fields); w.writeheader(); w.writerows(rows)

def key_of(row): return row['brand'].lower() + '/' + row['slug']

def verify(recs):
    """Every file the CSV names exists and opens; no file is used twice."""
    problems = []
    names = {}
    for r in recs:
        if r.get('local_image_path'):
            p = OUT / r['local_image_path']
            if not p.exists(): problems.append(f'{r["key"]}: file missing'); continue
            try: Image.open(p).verify()
            except Exception as e: problems.append(f'{r["key"]}: does not open ({e})')
            names.setdefault(r['local_image_path'], []).append(r['key'])
    problems += [f'{k} used by {v}' for k, v in names.items() if len(v) > 1]
    return problems

def failed_reasons(recs):
    from collections import Counter
    c = Counter()
    for r in recs:
        if r['status'] != 'FAILED': continue
        t = ' '.join(r.get('tried') or [])
        c['Samsung: no Mobile Press page for this model' if 'no media page' in t else
          'Samsung: press image rejected (thumbnail only 306 × 240 px, or not a clean single packshot)' if 'Samsung press' in t else
          'Apple: not on the identify-your-model pages (MacBook, Watch Ultra/Ultra 2)' if 'Apple support' in t else
          'no official manufacturer image source available (Xiaomi, Huawei, Sony, OnePlus, Google)'] += 1
    return c.most_common()

def report(recs, sheet_files, problems):
    from collections import Counter
    c = Counter(r['status'] for r in recs); b = {}
    for r in recs: b.setdefault(r['brand'], Counter())[r['status']] += 1
    order = ['DOWNLOADED_CANDIDATE', 'VISUALLY_VERIFIED', 'RIGHTS_REVIEW_REQUIRED', 'DUPLICATE', 'MISSING', 'FAILED']
    with_file = sum(1 for r in recs if r.get('local_image_path'))
    L = ['# Product image collection – report', '', f'Run: {time.strftime("%Y-%m-%d %H:%M")} · models: {len(recs)} · files on disk: {with_file}', '',
         '| Status | Models |', '|---|---|'] + [f'| {s} | {c.get(s, 0)} |' for s in order] + ['',
         '**Usable on the website without further rights work: VISUALLY_VERIFIED (free licence, exact model confirmed). '
         'DOWNLOADED_CANDIDATE still needs the visual check; RIGHTS_REVIEW_REQUIRED needs permission or a commercial licence first.**', '',
         '| Brand | ' + ' | '.join(order) + ' |', '|---|' + '---|' * len(order)] + \
        [f'| {br} | ' + ' | '.join(str(v.get(s, 0)) for s in order) + ' |' for br, v in b.items()] + ['',
         '## What FAILED means here', '',
         'FAILED = the model could not be checked completely in this run, not "no image exists". '
         'Wikimedia Commons answered this network with HTTP 429 (rate limit) for most requests, so the free-licence check is still open. '
         'Re-run with `python3 scripts/collect-product-images.py --retry-failed` from another network or with a Wikimedia API token.', ''] + \
        [f'- {n} × {why}' for why, n in failed_reasons(recs)] + ['',
         '## File checks', '', ('All listed files exist, open as images and are used once.' if not problems else '\n'.join('- ' + p for p in problems)), '',
         '## Sources and limits', '',
         '- Wikimedia Commons API: category of the exact model, then exact title search. Free licences only; licence, author and file page are stored per model.',
         '- Samsung Mobile Press: official packshot from the model\'s media page. Terms of use: personal, informational, non-commercial – therefore RIGHTS_REVIEW_REQUIRED and not used on the site.',
         '- Apple Design Resources: only front bezel frames (iPhone 16–18) under an app-marketing licence; Apple/Google newsroom images are for news use. Not collected.',
         '- Rejected automatically: titles naming another model or variant, scenes/accessories/boxes in the title, unknown or non-free licences, uneven or dark backgrounds, devices touching the frame.',
         '- Automatic checks never confirm the model. VISUALLY_VERIFIED is only set from scripts/photos/visual-review.json.', '',
         '## Contact sheets', ''] + [f'- contact-sheets/{p.name}' for p in sheet_files] + ['',
         '## Models with an image', '', '| Brand | Model | Status | Source | Licence |', '|---|---|---|---|---|'] + \
        [f'| {r["brand"]} | {r["model"]} | {r["status"]} | {r.get("file_page", "")} | {r.get("license", "")} |' for r in recs if r.get('local_image_path')]
    (OUT / 'REPORT.md').write_text('\n'.join(L) + '\n')
    return c

def bundle(sheet_files):
    z = OUT / 'handy-chirurg-product-images.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for p in sorted((OUT / 'assets').rglob('*.webp')): zf.write(p, str(p.relative_to(OUT)))
        for p in sheet_files: zf.write(p, 'contact-sheets/' + p.name)
        for n in ('manifest.json', 'REPORT.md'): zf.write(OUT / n, n)
        zf.write(CSV_PATH, 'handy-chirurg-image-workflow.csv')
    return z

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--brand'); ap.add_argument('--limit', type=int); ap.add_argument('--report-only', action='store_true'); ap.add_argument('--retry-failed', action='store_true'); ap.add_argument('--no-commons', action='store_true')
    a = ap.parse_args()
    WM['off'] = a.no_commons
    rows = list(csv.DictReader(open(CSV_PATH, encoding='utf-8-sig')))
    slugs = {key_of(r) for r in rows}
    for r in rows: r['_has5g'] = key_of(r) + '-5g' in slugs
    man_p = OUT / 'manifest.json'
    man = {m['key']: m for m in json.loads(man_p.read_text())} if man_p.exists() else {}
    todo = [r for r in rows if (not a.brand or r['brand'] == a.brand)]
    n = 0
    if not a.report_only:
        for r in todo:
            k = key_of(r)
            if k in man and not (a.retry_failed and (man[k]['status'] == 'FAILED' or any(('not checked' in e or 'skipped' in e) for e in man[k].get('errors') or []))): continue
            if a.limit and n >= a.limit: break
            rec = {'key': k, 'brand': r['brand'], 'model': r['model'], 'slug': r['slug'], 'asset_filename': r['asset_filename']}
            try: rec = process(r, rec)
            except Exception as e: rec.update(status='FAILED', errors=[f'{type(e).__name__}: {e}'[:200]])
            man[k] = rec; n += 1
            print(f'{len(man):3d} {k:40s} {rec["status"]:24s} {rec.get("source", "")}', flush=True)
            if n % 5 == 0: man_p.parent.mkdir(parents=True, exist_ok=True); man_p.write_text(json.dumps(list(man.values()), indent=1, ensure_ascii=False))
    for r in rows: r.pop('_has5g', None)
    recs = [man[key_of(r)] for r in rows if key_of(r) in man]
    for r in recs:  # statuses that dedupe/review derive are recomputed every time
        if r['status'] in ('DUPLICATE', 'VISUALLY_VERIFIED'): r['status'] = r.get('base_status') or ('DOWNLOADED_CANDIDATE' if r.get('source') in ('Wikimedia Commons', 'Website (registered photo)') else 'RIGHTS_REVIEW_REQUIRED')
        r.pop('visual_match', None)
    dedupe(recs); apply_review(recs)
    OUT.mkdir(exist_ok=True); man_p.write_text(json.dumps(recs, indent=1, ensure_ascii=False))
    write_csv(rows, recs)
    sh = sheets(recs); problems = verify(recs); c = report(recs, sh, problems); z = bundle(sh)
    print(dict(c), 'problems:', len(problems), '->', z.relative_to(ROOT))

if __name__ == '__main__':
    main()
