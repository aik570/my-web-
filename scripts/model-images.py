"""Trim the old-site device renders to the device outline and save small WebP files.

Usage: python3 scripts/model-images.py <folder with the original images>
The originals are the owner's images from the previous website (see CLIENT-APPROVAL-CHECKLIST).
"""
import sys, pathlib
from PIL import Image, ImageChops, ImageDraw

SRC = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parent.parent / 'src/assets/img/modelle'
FILES = {
    'iphone17.png': 'iphone-17', 'iphone16-min.png': 'iphone-16', 'iphone 15-min.png': 'iphone-15',
    'iphone14-min.png': 'iphone-14', 'iphone13-min.png': 'iphone-13', 'Iphone 12.png': 'iphone-12',
    'iphone11.jpg': 'iphone-11', 'iphonee 10-min.png': 'iphone-x', 'iphone7-min.png': 'iphone-homebutton',
    'Samsung Galaxy s.png': 'galaxy-s', 'samsung galaxy a-min.png': 'galaxy-a', 'samsung note-min.png': 'galaxy-note',
    'google pixel-min.png': 'pixel', 'huawei.png': 'huawei', 'xiaomi redmi-min.png': 'redmi',
    'sony.png': 'xperia', 'oneplus.png': 'oneplus',
    'ChatGPT Image Nov 17, 2025, 11_59_04 AM.png': 'apple-watch',
}
OUT.mkdir(parents=True, exist_ok=True)
for src, name in FILES.items():
    im = Image.open(SRC / src).convert('RGBA')
    # background = colour of the top-left pixel (flat light grey or white); keep everything that differs
    bg = Image.new('RGBA', im.size, im.getpixel((2, 2)))
    diff = ImageChops.difference(im, bg).convert('L').point(lambda v: 255 if v > 18 else 0)
    alpha = im.getchannel('A').point(lambda v: 255 if v > 18 else 0)
    box = ImageChops.multiply(diff, alpha).getbbox() or im.getbbox()
    im = im.crop(box)
    # make the background transparent, but only where it touches the edge (keeps white screens)
    rgb = im.convert('RGB'); mark = (255, 0, 255)
    for c in ((0, 0), (rgb.width - 1, 0), (0, rgb.height - 1), (rgb.width - 1, rgb.height - 1)):
        if rgb.getpixel(c) != mark: ImageDraw.floodfill(rgb, c, mark, thresh=24)
    mask = Image.eval(ImageChops.difference(rgb, Image.new('RGB', rgb.size, mark)).convert('L'), lambda v: 0 if v < 8 else 255)
    im.putalpha(ImageChops.multiply(mask, im.getchannel('A')))
    im.thumbnail((440, 440))
    im.save(OUT / f'{name}.webp', 'WEBP', quality=82, method=6)
    print(name, im.size, (OUT / f'{name}.webp').stat().st_size)
