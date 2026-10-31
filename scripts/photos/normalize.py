"""Turn licensed product photos into the uniform repair-finder format and register them.

Batch (no manual list): put the originals into incoming/, each named <brand>-<catalogue-id>.<png|jpg|webp>
exactly as in project-audit/PRODUCT-PHOTOS-NEEDED.csv, then

    npm run build
    python3 scripts/photos/normalize.py --incoming incoming --license "iStock Standard (nicht redaktionell)" --proof "Bestellung 12345"

Files that match no catalogue model are reported and skipped. A licence per file can be given in
incoming/licenses.csv (file;license;proof;credit;licenseUrl;source) and overrides --license/--proof.

Single entries with full details:

    python3 scripts/photos/normalize.py scripts/photos/manifest.json

manifest.json lists one entry per catalogue model:
  { "model": "apple/iphone-16-pro-max",        # brand/slug from the catalogue
    "file": "incoming/iphone-16-pro-max.png",   # original: device isolated on white/light or transparent background
    "license": "iStock Standard",               # or "CC BY-SA 4.0", "Samsung permission 2026-11-02", ...
    "proof": "iStock order 123456",             # invoice / permission reference (kept in the data, not shown)
    "credit": "",                               # shown under the photo only when the licence requires it
    "licenseUrl": "", "source": "" }

Each image is cropped to the device, centred on a white 600 × 800 canvas with equal margins
and saved as WebP in src/assets/img/produkte/. Images whose background is not light and even
are rejected: the finder shows only clean product shots.
"""
import json, sys, pathlib
from PIL import Image, ImageChops, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'src/assets/img/produkte'
DATA = ROOT / 'src/_data/modelImages.json'
W, H, PAD = 600, 800, 0.08

def isolate(path):
    im = Image.open(path).convert('RGBA')
    flat = Image.new('RGB', im.size, (255, 255, 255)); flat.paste(im, mask=im.getchannel('A'))
    w, h = flat.size; px = flat.load()
    edge = [px[x, y] for x in range(0, w, max(1, w // 60)) for y in (0, h - 1)] + [px[x, y] for y in range(0, h, max(1, h // 60)) for x in (0, w - 1)]
    light = sum(1 for p in edge if min(p) > 225) / len(edge)
    if light < 0.95: raise ValueError(f'background not light and even ({light:.0%} of the edge)')
    # backdrop colour = median of the edge; everything close to it counts as background
    bgc = tuple(sorted(p[i] for p in edge)[len(edge) // 2] for i in range(3))
    diff = ImageChops.difference(flat, Image.new('RGB', flat.size, bgc)).convert('L')
    mask = diff.point(lambda v: 255 if v > 26 else 0).filter(ImageFilter.MedianFilter(9))   # drop dust specks
    box = mask.getbbox()
    if not box or min(box[0], box[1], w - box[2], h - box[3]) < 2: raise ValueError('device touches the edge (cropped?)')
    # turn the (light grey) backdrop into clean white, with a soft edge
    soft = mask.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(2))
    flat = Image.composite(flat, Image.new('RGB', flat.size, (255, 255, 255)), soft)
    return flat.crop(box)

def main(manifest):
    OUT.mkdir(parents=True, exist_ok=True)
    data = json.loads(DATA.read_text())
    for e in json.loads(pathlib.Path(manifest).read_text()):
        try: dev = isolate(ROOT / e['file'] if not pathlib.Path(e['file']).is_absolute() else e['file'])
        except ValueError as err: print('SKIP', e['model'], err); continue
        s = min(W * (1 - 2 * PAD) / dev.width, H * (1 - 2 * PAD) / dev.height)
        dev = dev.resize((round(dev.width * s), round(dev.height * s)), Image.LANCZOS)
        canvas = Image.new('RGB', (W, H), (255, 255, 255)); canvas.paste(dev, ((W - dev.width) // 2, (H - dev.height) // 2))
        name = e['model'].replace('/', '-') + '.webp'; canvas.save(OUT / name, 'WEBP', quality=86, method=6)
        entry = {'model': e['model'], 'image': '/assets/img/produkte/' + name, 'license': e['license'], 'proof': e.get('proof', ''),
                                      'credit': (e['credit'] + ' (bearbeitet)') if e.get('credit') and e['license'].upper().startswith('CC') else e.get('credit', ''), 'licenseUrl': e.get('licenseUrl', ''), 'source': e.get('source', '')}
        print('OK', e['model'])
    data['photos'].sort(key=lambda p: p['model'])
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')

def from_incoming(folder, license, proof, catalogue):
    """Build manifest entries from file names in the incoming folder."""
    cat = json.loads(pathlib.Path(catalogue).read_text())
    ids = {f"{b['slug']}-{m['slug']}": f"{b['slug']}/{m['slug']}" for b in cat['brands'] for m in b['models']}
    per_file = {}
    csv = pathlib.Path(folder) / 'licenses.csv'
    if csv.exists():
        for line in csv.read_text().splitlines()[1:]:
            parts = (line.split(';') + [''] * 6)[:6]
            if parts[0]: per_file[parts[0]] = dict(zip(['license', 'proof', 'credit', 'licenseUrl', 'source'], parts[1:]))
    entries = []
    for f in sorted(pathlib.Path(folder).iterdir()):
        if f.suffix.lower() not in ('.png', '.jpg', '.jpeg', '.webp'): continue
        model = ids.get(f.stem)
        if not model: print('NO MATCH', f.name, '(name must be <brand>-<catalogue-id>, see PRODUCT-PHOTOS-NEEDED.csv)'); continue
        info = {'license': license, 'proof': proof, 'credit': '', 'licenseUrl': '', 'source': ''} | per_file.get(f.name, {})
        if not info['license']: print('NO LICENCE', f.name, '(use --license or incoming/licenses.csv)'); continue
        entries.append({'model': model, 'file': str(f.resolve()), **info})
    return entries

if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('manifest', nargs='?')
    ap.add_argument('--incoming'); ap.add_argument('--license', default=''); ap.add_argument('--proof', default='')
    ap.add_argument('--catalogue', default=str(ROOT / '_site/preise/katalog.json'))
    a = ap.parse_args()
    if a.incoming:
        tmp = ROOT / '.cache/photo-manifest.json'; tmp.parent.mkdir(exist_ok=True)
        tmp.write_text(json.dumps(from_incoming(a.incoming, a.license, a.proof, a.catalogue), indent=1, ensure_ascii=False))
        main(tmp)
    elif a.manifest: main(a.manifest)
    else: ap.print_help()
