#!/usr/bin/env python3
"""Builds the Handy Chirurg logo with a Potsdam skyline.

The wordmark, the stethoscope with cross and the red ECG line are the vector
tracings of the original logo (unchanged, apart from removing tracing specks).
Only the skyline is redrawn as line art after reference photos, left to right:

  Schloss Sanssouci · Brandenburger Tor (Potsdam) · St. Nikolaikirche ·
  Altes Rathaus (Atlas with globe) · Landtag / Fortunaportal ·
  Garnisonkirche tower · Neues Palais

Run from the repository root:
  python3 scripts/logo/build-logo.py
Writes src/assets/img/logo.svg, logo-white.svg, logo-sky.svg (skyline + ECG,
used by the intro) and logo-word.svg (wordmark + stethoscope).
The source tracings are kept in scripts/logo/source-*.svg.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
IMG = ROOT / 'src/assets/img'
SRC = pathlib.Path(__file__).resolve().parent
TEAL, RED, INK = '#2f7a68', '#c8312a', '#2a2a2a'
G = 228  # ground line of the skyline (as in the original)


class Path:
    """Tiny SVG path builder (absolute commands)."""

    def __init__(self):
        self.d = []

    def m(self, x, y):
        self.d.append(f'M{x:g} {y:g}')
        return self

    def l(self, *pts):
        for x, y in pts:
            self.d.append(f'L{x:g} {y:g}')
        return self

    def dome(self, x2, y2, h):
        """arc from the current point to (x2, y2), rising h above it"""
        self.d.append(f'A{abs(x2 - self.last_x()) / 2:g} {h:g} 0 0 1 {x2:g} {y2:g}')
        return self

    def last_x(self):
        return float(re.findall(r'(-?\d+\.?\d*) -?\d+\.?\d*$', self.d[-1])[0])

    def __str__(self):
        return ' '.join(self.d)


def arch(x1, x2, spring, bottom=G):
    r = (x2 - x1) / 2
    return f'M{x1:g} {bottom:g} V{spring:g} A{r:g} {r:g} 0 0 1 {x2:g} {spring:g} V{bottom:g}'


def line(*pts):
    return 'M' + ' L'.join(f'{x:g} {y:g}' for x, y in pts)


sky, det = [], []

# Schloss Sanssouci: long single-storey palace, raised centre with oval dome
p = Path().m(12, G).l((12, 204), (18, 204), (18, 198), (50, 198), (50, 190), (54, 190), (54, 186))
p.dome(82, 186, 20).l((82, 190), (86, 190), (86, 198), (118, 198), (118, 204), (122, 204), (122, G))
sky.append(str(p))
det.append(line((68, 166), (68, 158)))                                   # lantern
for x in range(24, 46, 7):
    det.append(arch(x, x + 4, 214))
for x in range(92, 114, 7):
    det.append(arch(x, x + 4, 214))
det.append(arch(62, 74, 210))
det.append(line((122, G), (128, G)))

# Brandenburger Tor (Potsdam): wide gate, central arch, two side passages, attic with crown
p = Path().m(128, G).l((128, 182), (126, 182), (126, 176), (136, 176), (136, 168), (150, 168), (150, 164),
                       (155, 164), (157, 156), (160, 150), (163, 156), (165, 164), (170, 164), (170, 168),
                       (184, 168), (184, 176), (194, 176), (194, 182), (192, 182), (192, G))
sky.append(str(p))
det.append(line((131, 176), (131, 168)))
det.append(line((189, 176), (189, 168)))                                 # corner trophies
det.append(arch(151, 169, 200))
det.append(arch(134, 142, 210))
det.append(arch(178, 186, 210))
det.append(line((192, G), (202, G)))

# St. Nikolaikirche: body, two bell towers, colonnaded drum, large dome, lantern, cross
p = Path().m(202, G).l((202, 166), (206, 166), (206, 126), (209, 118), (212, 126), (212, 166), (226, 166),
                       (226, 150), (230, 150), (230, 122))
p.dome(278, 122, 40).l((278, 150), (282, 150), (282, 166), (296, 166), (296, 126), (299, 118), (302, 126),
                       (302, 166), (306, 166), (306, G))
sky.append(str(p))
det.append(line((247, 84), (247, 73), (261, 73), (261, 84)))              # lantern
det.append(str(Path().m(247, 73).dome(261, 73, 6)))
det.append(line((254, 66), (254, 52)))
det.append(line((250, 57), (258, 57)))                                    # cross
det.append(line((209, 118), (209, 110)))
det.append(line((299, 118), (299, 110)))                                  # tower spires
for x in range(236, 276, 7):
    det.append(line((x, 148), (x, 128)))                                  # drum colonnade
det.append(line((226, 150), (282, 150)))
det.append(line((232, 166), (254, 154), (276, 166)))                      # portico pediment
det.append(arch(248, 260, 206))

# Altes Rathaus: cupola tower crowned by Atlas carrying the globe
p = Path().m(306, 180).l((318, 180), (318, 156), (322, 156), (322, 140))
p.dome(334, 140, 10).l((334, 156), (338, 156), (338, 180), (346, 180), (346, 190))
sky.append(str(p))
det.append(line((328, 130), (328, 121)))
det.append('M322 114 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0')                   # globe
det.append(arch(310, 314, 196))
det.append(arch(340, 344, 196, 190))

# Landtag (rebuilt Stadtschloss) with the Fortunaportal
p = Path().m(346, 190).l((364, 190), (364, 164), (368, 164), (368, 156))
p.dome(380, 156, 9).l((380, 164), (384, 164), (384, 190), (406, 190))
sky.append(str(p))
det.append(line((374, 147), (374, 136)))
det.append('M374 137 Q382 139 379 146')                                   # Fortuna's sail
det.append(arch(369, 379, 202))
for x in range(350, 362, 6):
    det.append(line((x, 198), (x, 212)))
for x in range(390, 404, 6):
    det.append(line((x, 198), (x, 212)))

# Garnisonkirche: stepped baroque tower, cupola, spire with vane
p = Path().m(406, G).l((406, 150), (411, 150), (411, 126), (414, 126), (414, 104), (417, 104))
p.dome(431, 104, 12).l((434, 104), (434, 126), (437, 126), (437, 150), (442, 150), (442, 186))
sky.append(str(p))
det.append(line((424, 92), (424, 80)))
det.append('M421 77 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0')                      # ball
det.append(line((424, 74), (424, 64), (430, 66), (424, 68)))              # spike with vane
det.append(arch(419, 429, 116, 126))
det.append(arch(418, 430, 138, 150))

# Neues Palais: long front, central block, high drum and dome with crown, end domes
p = Path().m(442, 186).l((450, 186), (450, 176))
p.dome(462, 176, 8).l((462, 186), (484, 186), (484, 172), (494, 172), (494, 148), (498, 148))
p.dome(522, 148, 26).l((526, 148), (526, 172), (536, 172), (536, 186), (548, 186), (548, 176))
p.dome(560, 176, 8).l((560, 186), (564, 186), (564, G))
sky.append(str(p))
det.append(line((510, 122), (510, 114)))
det.append(line((503, 114), (517, 114)))
det.append(line((503, 114), (504, 106), (507, 110), (510, 103), (513, 110), (516, 106), (517, 114)))  # crown held by the Three Graces
for x in range(502, 520, 6):
    det.append(line((x, 148), (x, 160)))
for x in list(range(466, 482, 6)) + list(range(540, 546, 6)):
    det.append(arch(x, x + 3, 204))
det.append(arch(504, 516, 206))


def skyline(stroke, w_out=4.2, w_det=3.0):
    return (f'<g fill="none" stroke="{stroke}" stroke-linecap="round" stroke-linejoin="round">'
            f'<path stroke-width="{w_out}" d="{" ".join(sky)}"/>'
            f'<path stroke-width="{w_det}" d="{" ".join(det)}"/></g>')


def clean(path_el):
    """drop tracing specks (sub-paths smaller than 6 × 6 units)"""
    d = re.search(r' d="([^"]+)"', path_el).group(1)
    keep = []
    for sub in re.findall(r'M[^M]+', d):
        n = list(map(float, re.findall(r'-?\d+\.?\d*', sub)))
        if max(n[0::2]) - min(n[0::2]) >= 6 or max(n[1::2]) - min(n[1::2]) >= 6:
            keep.append(sub)
    return path_el.replace(d, ''.join(keep))


src = (SRC / 'source-berlin-logo.svg').read_text()
ecg = re.search(r'<path fill="#c8312a"[^>]*/>', src).group(0)
word = clean(re.search(r'<path fill="#2a2a2a"[^>]*/>', src).group(0))
head = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 574 365">'
title = '<title>Handy Chirurg Potsdam</title>'


def white(s):
    return s.replace(f'fill="{INK}"', 'fill="#ffffff"').replace(f'fill="{RED}"', 'fill="#ff6b5e"')


(IMG / 'logo.svg').write_text(head + title + skyline(TEAL) + ecg + word + '</svg>')
(IMG / 'logo-white.svg').write_text(head + title + skyline('#ffffff') + white(ecg) + white(word) + '</svg>')
(IMG / 'logo-sky.svg').write_text(head + skyline(TEAL) + ecg + '</svg>')
(IMG / 'logo-word.svg').write_text(head + word + '</svg>')
print('logo.svg, logo-white.svg, logo-sky.svg, logo-word.svg written')
