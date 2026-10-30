"""Download gallery thumbnails for crawled models and render numbered contact sheets for visual selection.
Usage: python3 -I commons_sheet.py <found.json> <thumbdir> <sheetdir> [brandprefix]"""
import json, re, sys, os, time, urllib.request, io
from PIL import Image, ImageDraw
UA = 'HandyChirurgSiteBuilder/1.0 (image licence research; contact potsdam@handy-chirurg.de)'
found = json.load(open(sys.argv[1])); TD, SD = sys.argv[2], sys.argv[3]; pref = sys.argv[4] if len(sys.argv) > 4 else ''
os.makedirs(TD, exist_ok=True); os.makedirs(SD, exist_ok=True)
BAD = re.compile(r'box|logo|screen ?shot|screenshot|teardown|ifixit|packag|case|cover|wallpaper|camera ?sample|sample|photo taken|shot on|taken with|\(app\)|icon|keynote|event|store|mockup|vector|render', re.I)
def cands(v):
    fs = [f for f in v['files'] if not BAD.search(f['file'])]
    return fs[:12]
def fetch(u, p):
    if os.path.exists(p): return True
    for i in range(3):
        try:
            d = urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': UA}), timeout=25).read()
            open(p, 'wb').write(d); time.sleep(0.25); return True
        except Exception as e:
            time.sleep(4 * (i + 1))
    return False
rows = []
for key, v in found.items():
    if not key.startswith(pref) or not v['files']: continue
    cs = cands(v)
    if not cs: continue
    ims = []
    for i, f in enumerate(cs):
        p = os.path.join(TD, key.replace('/', '__') + f'__{i}.img')
        if fetch(f['thumb'], p):
            try: ims.append((i, Image.open(p).convert('RGB')))
            except Exception: pass
    rows.append((key, ims))
# sheets of 8 models, each row up to 12 thumbs of 140x140
for s in range(0, len(rows), 8):
    part = rows[s:s + 8]; W = 12 * 146 + 10; H = len(part) * 178 + 10
    sheet = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(sheet)
    for r, (key, ims) in enumerate(part):
        y = 10 + r * 178; d.text((6, y), key, fill='black')
        for i, im in ims:
            im.thumbnail((140, 140)); x = 6 + i * 146
            sheet.paste(im, (x, y + 14)); d.rectangle([x, y + 14, x + 22, y + 28], fill='red'); d.text((x + 4, y + 15), str(i), fill='white')
    sheet.save(os.path.join(SD, f'{pref.replace("/", "") or "all"}-{s // 8:02d}.png'))
print(len(rows), 'models with candidates')
