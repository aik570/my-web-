"""Fetch the chosen Commons files: licence + author from the file page, a 640 px rendition -> WebP in the project.
Usage: python3 -I commons_fetch.py <found.json> <picks.json> <outdir> <meta.json>
picks.json: { "brand/slug": index-in-sheet | "File:Name.jpg" }"""
import json, re, sys, os, time, html, urllib.request, urllib.parse, io
from PIL import Image
UA = 'HandyChirurgSiteBuilder/1.0 (image licence research; contact potsdam@handy-chirurg.de)'
sys.path.insert(0, os.path.dirname(__file__))
found = json.load(open(sys.argv[1])); picks = json.load(open(sys.argv[2])); OUT = sys.argv[3]; MF = sys.argv[4]
meta = json.load(open(MF)) if os.path.exists(MF) else {}
BAD = re.compile(r'box|logo|screen ?shot|screenshot|teardown|ifixit|packag|case|cover|wallpaper|camera ?sample|sample|photo taken|shot on|taken with|\(app\)|icon|keynote|event|store|mockup|vector|render', re.I)
OK = re.compile(r'^(CC0|Public domain|PD|CC BY(-SA)? \d\.\d( [a-z]+)?|CC BY(-SA)? \d\.\d)$', re.I)
def get(u):
    for i in range(4):
        try: return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=30).read()
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(10 * (i + 1)); continue
            raise
        except Exception: time.sleep(4)
    raise RuntimeError('fetch failed ' + u)
def text(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()
os.makedirs(OUT, exist_ok=True)
for key, pick in picks.items():
    if key in meta: continue
    if isinstance(pick, int): fname = [f for f in found[key]['files'] if not BAD.search(f['file'])][pick]['file']
    else: fname = pick
    page = get('https://commons.wikimedia.org/wiki/' + urllib.parse.quote(fname.replace(' ', '_'))).decode('utf8', 'ignore').replace('&#95;', '_'); time.sleep(1.2)
    lic = [text(x) for x in re.findall(r'<span class="licensetpl_short"[^>]*>(.*?)</span>', page, re.S)]
    links = re.findall(r'<span class="licensetpl_link"[^>]*>(.*?)</span>', page, re.S)
    aut = re.search(r'id="fileinfotpl_aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', page, re.S)
    author = text(aut.group(1)) if aut else ''
    author = re.sub(r'\s*\(talk\).*$', '', author)[:80]
    good = [l for l in lic if OK.match(l)]
    if not good or re.search(r'\bNC\b|\bND\b|fair use', ' '.join(lic), re.I) or not author:
        print('SKIP', key, fname, lic, author); continue
    l = good[0]; url = text(links[lic.index(l)]) if len(links) > lic.index(l) else ''
    if url and not url.startswith('http'): url = 'https:' + url
    if not url: url = 'https://creativecommons.org/publicdomain/zero/1.0/' if 'CC0' in l.upper() else ''
    thumb = next((f['thumb'] for f in found.get(key, {}).get('files', []) if f['file'] == fname), '')
    urls = ([re.sub(r'/\d+px-', '/500px-', thumb)] if '/thumb/' in thumb else []) + ['https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(fname[5:].replace(' ', '_')) + '?width=500']
    data = None
    for u in urls:
        try: data = get(u); break
        except Exception as e: print('  retry', key, e)
    time.sleep(0.6)
    if not data: print('FAIL', key, fname); continue
    im = Image.open(io.BytesIO(data)).convert('RGB'); im.thumbnail((480, 480))
    name = key.replace('/', '-') + '.webp'; im.save(os.path.join(OUT, name), 'WEBP', quality=80, method=6)
    meta[key] = {'image': '/assets/img/modelle/foto/' + name, 'exact': True, 'file': fname, 'author': author, 'license': l.upper().replace('PUBLIC DOMAIN', 'Public Domain'),
                 'licenseUrl': url, 'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(fname.replace(' ', '_'))}
    print('OK', key, l, author, im.size, flush=True)
    json.dump(meta, open(MF, 'w'), indent=1, ensure_ascii=False)
