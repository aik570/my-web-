"""Find Wikimedia Commons categories for catalogue models and list their image files + gallery thumbnails.
Usage: python3 -I commons_crawl.py <models.json> <out.json>"""
import json, re, sys, time, html, urllib.request, urllib.parse, os
UA = 'HandyChirurgSiteBuilder/1.0 (image licence research; contact potsdam@handy-chirurg.de)'
models = json.load(open(sys.argv[1])); outp = sys.argv[2]
done = json.load(open(outp)) if os.path.exists(outp) else {}

def get(url):
    for i in range(4):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=25)
            return r.status, r.read().decode('utf8', 'ignore')
        except urllib.error.HTTPError as e:
            if e.code == 404: return 404, ''
            if e.code == 429: time.sleep(10 * (i + 1)); continue
            return e.code, ''
        except Exception: time.sleep(3)
    return 0, ''

def cands(m):
    n, b = m['name'], m['brand']
    base = [n]
    n2 = re.sub(r' (5G|4G)$', '', n)
    if n2 != n: base.append(n2)
    out = []
    for x in base:
        if b == 'apple':
            se = {'iPhone SE (2020)': 'IPhone SE (2nd generation)', 'iPhone SE (2022)': 'IPhone SE (3rd generation)', 'iPhone SE (2016)': 'IPhone SE (1st generation)', 'iPhone SE': 'IPhone SE (1st generation)'}
            if x in se: out.append(se[x]); continue
            if x.startswith('iPhone'):
                y = 'I' + x[1:]; out += [y, y.replace(' mini', ' Mini')]
            else: out.append(x[0].upper() + x[1:])
        elif b == 'samsung':
            out += ['Samsung ' + x, 'Samsung ' + x.replace(' Plus', '+'), 'Samsung ' + x.replace(' Plus', ' +')]
        elif b == 'google': out.append('Google ' + x)
        elif b == 'huawei': out += ['Huawei ' + x] + ([x, 'Huawei ' + x] if x.startswith('Honor') else [])
        elif b == 'xiaomi': out += ([x] if x.startswith('Xiaomi') else [x, 'Xiaomi ' + x]) + ([x.replace('Xiaomi Mi ', 'Mi ')] if 'Mi ' in x else [])
        elif b == 'sony': out.append(x if x.startswith('Sony') else 'Sony ' + x)
        else: out.append(x)
    out = [o.replace(' Plus', ' Plus') for o in out]
    seen = []; [seen.append(o) for o in out if o not in seen]
    return seen

def files_of(cat):
    st, h = get('https://commons.wikimedia.org/wiki/Category:' + urllib.parse.quote(cat.replace(' ', '_')))
    if st != 200: return None
    red = re.search(r'class="categoryRedirect[^"]*".*?href="/wiki/Category:([^"#]+)"', h, re.S) or re.search(r'This category is located at.*?href="/wiki/Category:([^"#]+)"', h, re.S)
    if red and 'gallerybox' not in h:
        time.sleep(1.2); return files_of(urllib.parse.unquote(red.group(1)).replace('_', ' '))
    res = []
    for g in re.finditer(r'<li class="gallerybox".*?</li>', h, re.S):
        blk = g.group(0)
        f = re.search(r'href="/wiki/(File:[^"]+)"', blk); t = re.search(r'<img[^>]+src="([^"]+)"', blk)
        if f and t:
            name = urllib.parse.unquote(html.unescape(f.group(1)))
            if re.search(r'\.(jpe?g|png|webp)$', name, re.I): res.append({'file': name, 'thumb': html.unescape(t.group(1))})
    return {'cat': cat, 'files': res}

for i, m in enumerate(models):
    key = m['brand'] + '/' + m['slug']
    if key in done or m['cat'] != 'Smartphone': continue
    found = None
    for c in cands(m):
        r = files_of(c); time.sleep(1.2)
        if r and r['files']: found = r; break
    done[key] = found or {'cat': None, 'files': []}
    print(i, key, found['cat'] if found else '-', len(found['files']) if found else 0, flush=True)
    json.dump(done, open(outp, 'w'), indent=1)
