#!/usr/bin/env python3
"""Vectorises the client's Potsdam logo (scripts/logo/source-potsdam-logo.jpg).

The JPEG is split into its three colours (teal skyline + tagline, red ECG line,
dark wordmark + stethoscope), each layer is traced with potrace and written as
one SVG path in the brand colour. Run from the repository root:
  pip install potracer pillow numpy
  python3 scripts/logo/trace-logo.py
Writes src/assets/img/logo.svg, logo-white.svg, logo-sky.svg (skyline + ECG,
used by the intro) and logo-word.svg (wordmark, stethoscope, tagline).
"""
import pathlib

import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[2]
IMG = ROOT / 'src/assets/img'
SRC = pathlib.Path(__file__).resolve().parent / 'source-potsdam-logo.jpg'
TEAL, RED, INK = '#2f7a68', '#c8312a', '#2a2a2a'
UP = 4          # trace at 4× for smooth curves
PAD = 6         # margin around the artwork (source pixels)

im = Image.open(SRC).convert('RGB')
im = im.resize((im.width * UP, im.height * UP), Image.LANCZOS).filter(ImageFilter.GaussianBlur(UP * 0.35))
a = np.asarray(im).astype(int)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
lum = (r + g + b) / 3
ink = lum < 175
red = ink & (r - g > 60) & (r - b > 60)
teal = ink & ~red & (g - r > 22)
dark = ink & ~red & ~teal & (lum < 130)

ys, xs = np.where(red | teal | dark)
x0, y0 = xs.min() / UP - PAD, ys.min() / UP - PAD
W, H = xs.max() / UP - x0 + PAD, ys.max() / UP - y0 + PAD


def trace(mask, y_from=0, y_to=None):
    m = mask.copy()  # potracer traces False pixels, hence ~m below
    m[:int(y_from * UP)] = False
    if y_to is not None:
        m[int(y_to * UP):] = False
    paths = potrace.Bitmap(~m).trace(turdsize=12 * UP, alphamax=1.0, opticurve=True, opttolerance=0.2)
    f = lambda p: f'{p.x / UP - x0:.2f} {p.y / UP - y0:.2f}'
    d = []
    for c in paths:
        d.append('M' + f(c.start_point))
        for s in c.segments:
            d.append(('L' + f(s.c) + 'L' + f(s.end_point)) if s.is_corner else
                     ('C' + f(s.c1) + ' ' + f(s.c2) + ' ' + f(s.end_point)))
        d.append('Z')
    return ''.join(d)


SPLIT = 262     # source y between skyline and wordmark: teal above = skyline, below = tagline
sky, tag = trace(teal, 0, SPLIT), trace(teal, SPLIT)
ecg, word = trace(red), trace(dark)

head = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}">'
title = '<title>Handy Chirurg Potsdam – Ihr zuverlässiger Partner</title>'
P = lambda fill, d: f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>'

(IMG / 'logo.svg').write_text(head + title + P(TEAL, sky) + P(TEAL, tag) + P(RED, ecg) + P(INK, word) + '</svg>')
(IMG / 'logo-white.svg').write_text(head + title + P('#ffffff', sky) + P('#ffffff', tag) + P('#ff6b5e', ecg) + P('#ffffff', word) + '</svg>')
(IMG / 'logo-sky.svg').write_text(head + P(TEAL, sky) + P(RED, ecg) + '</svg>')
(IMG / 'logo-word.svg').write_text(head + P(TEAL, tag) + P(INK, word) + '</svg>')
print(f'viewBox 0 0 {W:.0f} {H:.0f} – logo.svg, logo-white.svg, logo-sky.svg, logo-word.svg written')
