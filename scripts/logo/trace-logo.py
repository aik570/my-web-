#!/usr/bin/env python3
"""Vectorises the client's Potsdam logo (scripts/logo/source-potsdam-logo.jpg).

The JPEG is split into its three colours (teal skyline + tagline, red ECG line,
dark wordmark + stethoscope), each layer is traced with potrace and written as
one SVG path in the brand colour. Run from the repository root:
  pip install potracer pillow numpy scikit-image
  python3 scripts/logo/trace-logo.py
Writes src/assets/img/logo.svg, logo-white.svg, logo-sky.svg (skyline + ECG)
and logo-word.svg (wordmark, stethoscope, tagline), and the inline SVG of the
loading animation (src/_includes/partials/intro-logo.svg): the traced layers
plus centre lines of the skyline and the heartbeat, ordered left to right, so
the skyline can be drawn like a pen stroke and a spark can run along the pulse.
"""
import pathlib

import numpy as np
import potrace
from skimage.morphology import skeletonize
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


# ---------------------------------------------------------------- loading animation

def centreline(mask, y_from=0, y_to=None, simplify=0.6):
    """Skeleton of a thin line drawing as one path, walked from left to right.
    Branches (towers, ornaments) become extra sub-paths in the order they are met."""
    m = mask.copy()
    m[:int(y_from * UP)] = False
    if y_to is not None:
        m[int(y_to * UP):] = False
    sk = skeletonize(m)
    pts = set(zip(*np.nonzero(sk)))                       # (row, col)
    nb = lambda p: [(p[0] + dy, p[1] + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if (dy or dx) and (p[0] + dy, p[1] + dx) in pts]
    seen, runs = set(), []
    while True:
        rest = [p for p in pts if p not in seen]
        if not rest:
            break
        ends = [p for p in rest if len(nb(p)) == 1] or rest
        start = min(ends, key=lambda p: (p[1], -p[0]))    # leftmost (lowest) free end
        stack, run = [start], []
        while stack:                                       # depth first, rightward first
            p = stack.pop()
            if p in seen:
                continue
            if run and max(abs(p[0] - run[-1][0]), abs(p[1] - run[-1][1])) > 1:
                runs.append(run); run = []
            seen.add(p); run.append(p)
            for q in sorted((q for q in nb(p) if q not in seen), key=lambda q: q[1]):
                stack.append(q)
        runs.append(run)
    runs = [r for r in runs if len(r) >= 3 * UP]

    def rdp(points, eps):
        if len(points) < 3:
            return points
        a, b = np.array(points[0], float), np.array(points[-1], float)
        d = b - a; n = np.hypot(*d) or 1.0
        dist = [abs(d[0] * (a[1] - p[1]) - d[1] * (a[0] - p[0])) / n for p in points]
        i = int(np.argmax(dist))
        if dist[i] > eps:
            return rdp(points[:i + 1], eps)[:-1] + rdp(points[i:], eps)
        return [points[0], points[-1]]

    out = []
    for run in runs:
        run = rdp(run, simplify * UP)
        out.append('M' + ' L'.join(f'{c / UP - x0:.1f} {r / UP - y0:.1f}' for r, c in run))
    return out


sky_line = centreline(teal, 0, SPLIT)
ecg_line = centreline(red)
(ROOT / 'src/_includes/partials/intro-logo.svg').write_text(
    f'<svg class="intro__svg" viewBox="0 0 {W:.0f} {H:.0f}" aria-hidden="true" focusable="false">'
    '<defs>'
    '<radialGradient id="ilPen"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#6fe3c0"/><stop offset="1" stop-color="#6fe3c0" stop-opacity="0"/></radialGradient>'
    '<radialGradient id="ilSpark"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#ff8a7e"/><stop offset="1" stop-color="#ff6b5e" stop-opacity="0"/></radialGradient>'
    f'<clipPath id="ilWordClip"><rect id="ilWordRect" x="0" y="0" width="0" height="{H:.0f}"/></clipPath>'
    f'<clipPath id="ilEcgClip"><rect id="ilEcgRect" x="0" y="0" width="0" height="{H:.0f}"/></clipPath>'
    '</defs>'
    f'<g class="intro__skyline" fill="none" stroke="{TEAL}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">'
    + ''.join(f'<path pathLength="1" d="{d}"/>' for d in sky_line) + '</g>'
    f'<path class="intro__sky" fill="{TEAL}" fill-rule="evenodd" d="{sky}"/>'
    f'<g clip-path="url(#ilWordClip)"><path class="intro__word" fill="{INK}" fill-rule="evenodd" d="{word}"/></g>'
    f'<g clip-path="url(#ilEcgClip)"><path class="intro__ecg" fill="{RED}" fill-rule="evenodd" d="{ecg}"/></g>'
    f'<path class="intro__pulse" fill="none" stroke="none" d="{"".join(ecg_line)}"/>'
    f'<path class="intro__tag" fill="{TEAL}" fill-rule="evenodd" d="{tag}"/>'
    '<circle class="intro__pen" r="10" fill="url(#ilPen)"/>'
    '<circle class="intro__spark" r="16" fill="url(#ilSpark)"/>'
    '</svg>\n')
print('intro-logo.svg written:', len(sky_line), 'skyline strokes')
