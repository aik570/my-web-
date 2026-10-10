"""
AIK Studio — flat logo generator (Visual Identity v1.0, §2.1).

Builds every SVG in ../ from one parametric construction, so the geometry
stays consistent across variants. The SVGs are the deliverables; this script
documents and reproduces them.

Requirements (not project dependencies): Python 3.10+, shapely>=2, fonttools.
Wordmark font: Space Grotesk Medium (SIL OFL 1.1), e.g. from the npm package
@fontsource/space-grotesk (files/space-grotesk-latin-500-normal.woff).

    python build_logo.py path/to/space-grotesk-latin-500-normal.woff
"""
import math
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from shapely import affinity
from shapely.geometry import LineString, Polygon, box
from shapely.ops import unary_union

OUT = Path(__file__).resolve().parent.parent
OBSIDIAN, ICE = "#101419", "#F2F5F7"
BIG = 400


# ---------------------------------------------------------------- geometry
def flank(deg):
    """Horizontal run per unit of drop for a flank at `deg` from horizontal."""
    return 1 / math.tan(math.radians(deg))


def under_desc(x, y, t):
    """Half-plane below a flank descending to the right through (x, y)."""
    return Polygon([(x - BIG, y), (x, y), (x + BIG * t, y + BIG), (x - BIG, y + BIG)])


def under_asc(x, y, t):
    """Half-plane below a flank descending to the left through (x, y)."""
    return Polygon([(x + BIG, y), (x, y), (x - BIG * t, y + BIG), (x + BIG, y + BIG)])


def monogram(p):
    """
    Units: baseline y=100, the I summit y=0 (y grows downwards, as in SVG).
    Left peak = A, centre peak = I, right peak = K.
    """
    w, t = p["w"], flank(p["angle"])
    hw = w / math.sin(math.radians(p["angle"]))      # horizontal width of a flank stroke
    lo, parts = 160, []

    # A — chevron; outer apex at (0, ya); optional crossbar inside the counter.
    ya = p["ya"]
    outer = under_desc(0, ya, t).intersection(under_asc(0, ya, t))
    ia = ya + hw / t
    A = outer.difference(under_desc(0, ia, t).intersection(under_asc(0, ia, t)))
    if p["bar"]:
        A = A.union(box(-BIG, p["bar_y"], BIG, p["bar_y"] + p["bar_h"]).intersection(outer))
    parts.append(A)

    # I — vertical stem; top cut by a flank descending right (faceted summit).
    xi = (100 - ya) * t + p["gap_ai"]
    parts.append(box(xi, 0, xi + w, lo).intersection(under_desc(xi, 0, t)))

    # K — stem with the same faceted top; upper arm ends in a summit whose right
    # face is a flank at the same angle; lower arm leaves the upper arm.
    xk, yk = xi + w + p["gap_ik"], p["yk"]
    stem = box(xk, yk, xk + w, lo).intersection(under_desc(xk, yk, t))
    ta = flank(p["arm_angle"])
    ha = w / math.sin(math.radians(p["arm_angle"]))
    xt = xk + w + (p["arm_join"] - yk) * ta            # summit of the upper arm
    arm = Polygon([(xt, yk), (xt + ha / 2, yk + ha / (2 * t)),
                   (xt + ha - BIG * ta, yk + BIG), (xt - BIG * ta, yk + BIG)])
    yj = p["arm_join"]                                 # arm's left edge meets the stem here
    arm = arm.intersection(box(xk + w / 2, -BIG, BIG, yj + ha / ta + 2))
    jy = yj + ha / ta * 0.5
    leg = LineString([(xk + w / 2, jy), (xk + w / 2 + (lo - jy) * ta, lo)])
    leg = leg.buffer(w / 2, cap_style="flat", join_style="mitre")
    leg = leg.intersection(box(xk + w / 2, -BIG, BIG, lo))
    parts += [stem, arm, leg]

    g = unary_union(parts).intersection(box(-BIG, -BIG, BIG, 100))
    minx, miny, _, _ = g.bounds
    return affinity.translate(g, -minx, -miny)


MASTER = dict(w=11, angle=58, ya=14, bar=True, bar_y=70, bar_h=10,
              gap_ai=8, gap_ik=9, yk=22, arm_angle=58, arm_join=52)

# Favicon: no crossbar, heavier strokes, wider gaps, steeper flanks so the
# mark fits a square. Same summit order and faceted tops.
FAVICON = dict(w=17, angle=64, ya=12, bar=False, bar_y=0, bar_h=0,
               gap_ai=11, gap_ik=13, yk=20, arm_angle=56, arm_join=50)


def path_d(g, nd=2):
    fmt = lambda v: f"{v:.{nd}f}".rstrip("0").rstrip(".")
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    out = []
    for pg in polys:
        for ring in [pg.exterior, *pg.interiors]:
            pts = list(ring.coords)[:-1]
            out.append("M" + "L".join(f"{fmt(x)} {fmt(y)}" for x, y in pts) + "Z")
    return "".join(out)


# ---------------------------------------------------------------- wordmark
def wordmark(font_path, text="AIK STUDIO", tracking=0.18):
    """Outlines `text` in Space Grotesk Medium; returns (d, width, cap_height) in font units."""
    f = TTFont(font_path)
    gs, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    upm, cap = f["head"].unitsPerEm, f["OS/2"].sCapHeight
    pen, x = SVGPathPen(gs), 0.0
    names = [cmap[ord(c)] for c in text]
    for i, n in enumerate(names):
        # flip y so the glyphs sit on y=0 with caps reaching y=-cap
        gs[n].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        x += hmtx[n][0] + (tracking * upm if i < len(names) - 1 else 0)
    bp = BoundsPen(gs)
    gs[names[-1]].draw(bp)
    width = x - hmtx[names[-1]][0] + bp.bounds[2]       # trim last glyph's right bearing
    first = BoundsPen(gs)
    gs[names[0]].draw(first)
    return pen.getCommands(), first.bounds[0], width, cap


# ---------------------------------------------------------------- writers
def svg(viewbox, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" '
            f'aria-label="{title}"><title>{title}</title>{body}</svg>\n')


def write(name, content):
    (OUT / name).write_text(content)
    print("wrote", name)


def main(font_path):
    sym = monogram(MASTER)
    sw, sh = sym.bounds[2], sym.bounds[3]               # sh == 100
    d_sym = path_d(sym)
    wd, wx0, ww, cap = wordmark(font_path)

    for suffix, fill in (("", OBSIDIAN), ("-reverse", ICE)):
        # 1. Symbol
        write(f"aik-symbol{suffix}.svg",
              svg(f"0 0 {sw:.2f} {sh:.2f}", f'<path fill="{fill}" d="{d_sym}"/>', "AIK Studio"))

        # 2. Horizontal lockup: wordmark cap height = 0.30 × symbol height,
        #    wordmark baseline on the symbol baseline, gap = 0.36 × symbol height.
        s = 0.30 * sh / cap
        gap = 0.36 * sh
        tx = sw + gap - wx0 * s
        width = sw + gap + (ww - wx0) * s
        body = (f'<path fill="{fill}" d="{d_sym}"/>'
                f'<path fill="{fill}" transform="translate({tx:.2f} {sh:.2f}) scale({s:.5f})" d="{wd}"/>')
        write(f"aik-lockup-horizontal{suffix}.svg",
              svg(f"0 0 {width:.2f} {sh:.2f}", body, "AIK Studio"))

        # 3. Stacked lockup: wordmark width = symbol width, gap = 0.30 × symbol height.
        s2 = sw / (ww - wx0)
        gap2 = 0.30 * sh
        top = sh + gap2 + cap * s2
        body = (f'<path fill="{fill}" d="{d_sym}"/>'
                f'<path fill="{fill}" transform="translate({-wx0 * s2:.2f} {top:.2f}) scale({s2:.5f})" d="{wd}"/>')
        write(f"aik-lockup-stacked{suffix}.svg",
              svg(f"0 0 {sw:.2f} {top:.2f}", body, "AIK Studio"))

    # 4. Simplified favicon symbol (transparent) and the favicon tile.
    fav = monogram(FAVICON)
    fw, fh = fav.bounds[2], fav.bounds[3]
    d_fav = path_d(fav)
    for suffix, fill in (("", OBSIDIAN), ("-reverse", ICE)):
        write(f"aik-favicon-symbol{suffix}.svg",
              svg(f"0 0 {fw:.2f} {fh:.2f}", f'<path fill="{fill}" d="{d_fav}"/>', "AIK Studio"))
    # Tile: 32-unit square, Obsidian, 2-unit radius; mark 28 units wide, optically
    # centred (baseline slightly below the geometric centre).
    k = 28 / fw
    ox, oy = 2, (32 - fh * k) / 2 + 0.6
    body = (f'<rect width="32" height="32" rx="2" fill="{OBSIDIAN}"/>'
            f'<path fill="{ICE}" transform="translate({ox:.3f} {oy:.3f}) scale({k:.5f})" d="{d_fav}"/>')
    write("aik-favicon.svg", svg("0 0 32 32", body, "AIK Studio"))


if __name__ == "__main__":
    main(sys.argv[1])
