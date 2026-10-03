"""Rice base layer for Poké your style (stage 01).
No client photo shows rice, so it was generated once in Higgsfield (GPT Image 2.5, against the real empty
bowl, assets/src/poke/empty-bowl-ref.png) and is kept as assets/src/poke/rice-generated.webp.
Here it is fitted to the client's bowl: the generated rim is mapped onto the real rim, only the grains are
kept, and their colour and brightness are matched to the whites of the real photo (the coconut flakes).
Run after crop.py / seg.py (needs crop.png and lbl.npy in the working directory)."""
import cv2, numpy as np, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
src = cv2.imread(str(ROOT / 'assets/src/poke/rice-generated.webp')).astype(np.float32)
crop = cv2.imread('crop.png').astype(np.float32); lbl = np.load('lbl.npy')
H = W = 960; C = 480
# generated rim: centre (996, 978), outer edge r ~976 px  ->  real rim: centre (480, 480), r 477.5
gcx, gcy, gr = 996, 978, 976
s = 477.5 / gr
M = np.float32([[s, 0, C - s * gcx], [0, s, C - s * gcy]])
rice = cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REFLECT)
hsv = cv2.cvtColor(np.clip(rice, 0, 255).astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
yy, xx = np.mgrid[0:H, 0:W]; rr = np.hypot(xx - C, yy - C)
# the grains: light and unsaturated, inside the floor (the generated rim and wall are not used)
m = ((hsv[..., 2] > 120) & (hsv[..., 1] < 70) & (rr < 452)).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
n, cc, st, _ = cv2.connectedComponentsWithStats(m, 8)
m = (cc == 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])).astype(np.uint8)           # one body of rice
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
# one solid body: the shaded gaps between grains are rice too, not holes to the floor
cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
m = np.zeros_like(m); cv2.drawContours(m, cs, -1, 1, thickness=-1)
a = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.6)
# colour: the real photo's whites (coconut flakes) set the white balance and brightness
coco = crop[(lbl == 1) & (cv2.cvtColor(crop.astype(np.uint8), cv2.COLOR_BGR2HSV)[..., 2] > 170)]
ref = np.median(coco, 0)
grains = rice[m > 0]; cur = np.median(grains, 0)
gain = (ref * 0.93) / np.maximum(cur, 1)                                         # a touch below the flakes
rice = rice * gain[None, None, :]
# light as in the photo: brighter towards the top left, falling off towards the walls
d = rr / 452.0
light = 1.0 + 0.07 * np.exp(-((xx - C + 90) ** 2 + (yy - C + 110) ** 2) / (2 * 260 ** 2)) - 0.16 * np.clip((d - 0.7) / 0.3, 0, 1) ** 1.5
rice *= light[..., None]
# soft contact shadow just outside the rice, onto the floor (as for the other layers)
sh = cv2.GaussianBlur(np.roll(np.roll(m.astype(np.float32), 6, 0), 4, 1), (0, 0), 7) * 0.4
sh = np.clip(sh - a, 0, 1)
alpha = np.clip(a + sh, 0, 1) * np.clip(477.5 - rr, 0, 1)
rgb = rice * a[..., None] / np.maximum(alpha, 1e-4)[..., None]
rgb = np.where((alpha > 0.002)[..., None], rgb, 0)
rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha * 255, 0, 255)]).astype(np.uint8)
for size in (960, 600):
    im = rgba if size == 960 else cv2.resize(rgba, (size, size), interpolation=cv2.INTER_AREA)
    cv2.imwrite(str(ROOT / f'assets/poke/spicy-tropical-rice-{size}.webp'), im, [cv2.IMWRITE_WEBP_QUALITY, 84])
print('rice px', int(m.sum()), 'gain', gain.round(3))
