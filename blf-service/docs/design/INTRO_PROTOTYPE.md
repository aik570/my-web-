# Tree-logo Intro: Prototype Notes

> **Superseded (2026-10-28):** the tree-logo intro was replaced in `src/` by the D2 opening stage (`docs/design/CONCEPT_D_MONUMENT_SYSTEM.md` §13). The files remain in Git history.

Stage 04 · 2026-10-27 · status: **prototype for review**

Implementation:
- `src/scripts/intro.js`
- `src/styles/intro.css`
- the inline head script in `src/index.html`

## 1. Technique: honest about the source

The official logo exists only as **one raster file**:
`public/assets/original/brand/68d4a4d8f70ae14d90397b58_Logo_273806.png`
(1966×1966, transparent, flat colours). There is **no vector** [D-11].

So trunk, branches, leaves, rings and lettering are **not** animated as
separate parts. The intro uses **SVG masks** that progressively reveal the
**authentic pixels** of one image:

| Mask | Reveals | Geometry (logo pixel space, centre 983/983) |
|---|---|---|
| Root and trunk band | Roots, trunk and lower branches, growing upward | Rect x 400–1566, from y 1580 up to 1080 (lite: up to 400), clipped to r < 580 |
| 13 canopy groups | Branches and leaves together, in staggered groups | Circles r 150–250, measured against the leaf area (x 428–1528, y 432–1146) |
| Inner ring | Inner ring | Stroke at r 598, width 44 (ring measured at r 584–612) |
| Outer ring | Outer ring | Stroke at r 966, width 48 (ring measured at r 949–982) |
| Upper lettering | "BAUM-LAND-FORST" | Arc r 797, width 170, −168° → −12° |
| Lower lettering | "SERVICE" | Arc r 797, width 170, 128° → 52° |

**Verification** (pixel check against the PNG, sampled every 3 px):
- the root band and canopy groups cover **100 %** of the tree's pixels;
- **0** lettering pixels lie outside the arc masks.

**Exact final frame.** Shortly before the end, the masks are removed and the
plain original image is shown. The final frame is the unaltered logo,
downscaled losslessly to 1200 px (`public/assets/optimized/home/logo-1200.webp`).

**Why SMIL** (`<animate>`) inside the masks, not CSS animations: WebKit has a
history of not repainting CSS animations inside `<mask>`; SMIL is reliable
there in all current engines. **No library, no video.**

**What it is not.** Leaves do not appear one by one, and branches are not
drawn as strokes. The impression of growth comes from the order of the
reveals. Animating individual parts would need either a vector logo [D-11]
or colour-separated layers extracted from the PNG. Extraction is
technically exact here (the logo is flat-coloured), but the brief allows it
only **with permission**, which has not been given. It is therefore **not
used**.

## 2. Sequence

**Full version** (desktop, fine pointer), seconds after the start:

| Phase | Time |
|---|---|
| Dark forest-green ground (`forest-950`) | from the first paint (pre-cover, then overlay) |
| Paper plate opens (`paper-50`, r 0 → 1005) | 0.00–0.40 |
| Roots and trunk grow upward | 0.20–0.80 |
| Canopy groups open, 13 circles staggered over ~0.5 s | 0.65–1.40 |
| Inner ring draws, from the trunk base clockwise | 1.25–1.80 |
| Outer ring draws | 1.40–1.95 |
| "BAUM-LAND-FORST" revealed along its arc | 1.50–1.95 |
| "SERVICE" revealed along its arc | 1.70–2.15 |
| Short spring: scale 1 → 1.035 → 0.992 → 1 | 2.10–2.46 |
| Handoff: the emblem flies into the header-logo position while the ground fades; then the hero text fades up | 2.45–2.95 |

**Total ≈ 2.95 s.**

**Why the paper plate.** The logo's dark green ring has only **2.06:1**
against `forest-950` (DQ-06), so it would disappear on the dark ground. The
plate is the documented treatment; it doesn't change the artwork. Because
the header is `paper-50`, the plate is invisible after the handoff, so the
transition is seamless.

**Lite version** (width < 1024 px, coarse pointer, or Save-Data):
- plate;
- one upward sweep reveals the whole tree (0.15–0.85);
- rings and lettering together (0.6–1.3);
- no spring, no flight; a fade at 1.35.

**Total ≈ 1.65 s.**

## 3. When it runs, and how it can fail

| Situation | Behaviour |
|---|---|
| First visit in a session, on the Home page | Plays once. `sessionStorage` key `blf-intro`. Secondary pages will not include the script. No replay on in-page navigation |
| `prefers-reduced-motion: reduce` | **Never starts** (head script), plus a second CSS guard |
| JavaScript disabled | Nothing runs; the page is shown immediately |
| `intro.js` fails to load | The pre-cover removes itself after 2.8 s (CSS fail-safe); hero text and content are visible |
| Logo not loaded within 1.2 s, or a load error | Intro abandoned; the page is shown |
| Script starts too late (> 1.5 s after first paint) | Intro abandoned |
| Any error | Intro abandoned (try/catch) |
| Hard stop | Everything cleaned up after 4.5 s at the latest |
| User wants out | "Intro überspringen" button (keyboard reachable), any click, any key except Tab/Shift, wheel or touch-move: fades in 200 ms |
| Screen readers | The SVG is `aria-hidden`; page content is in the DOM and readable from the start |
| Review | `?intro=1` forces the intro; `?intro=0` disables it |

**Does not block the page:** the content loads underneath, the overlay can
be skipped at any time, and fonts and images are not delayed by the intro.

## 4. Lettering: not final

The intro and header use the **website** logo, lower arc "SERVICE" [V].
The printed business card has "DANIEL WITTE" on the lower arc, and the
project owner gave the current owner's name as "Daniel Trautmann" (D-28).

**The public-facing lettering must be confirmed** before this intro is
final. If a different lettering is required, only an authentic file from
the client (ideally a vector, D-11) may be used. The PNG is not edited.

## 5. Why no AI "restoration" of the business-card photo

A restoration prompt for the card photo was supplied. It was **deliberately
not run**:

1. **A better authentic source already exists.** The website PNG shows the
   same emblem at 1966 px with flat colours, against a 960×1280 phone photo
   with glare, scratches and perspective.
2. **No fidelity guarantee.** A generative restoration can't guarantee that
   it doesn't move, invent or drop leaves or letter shapes. Its output would
   be exactly the "generated approximation" the Stage 04 brief rules out.
3. **The card carries a personal name** whose public use is unresolved
   (D-28), and **running the tool would send the client's mark to a
   third-party service**.

**If the "DANIEL WITTE" variant is needed:** ask the client for the original
file (D-11), not a reconstruction.

## 6. Review checklist (intro)

- [ ] Pacing feels calm, not slow (≈ 2.95 s desktop, ≈ 1.65 s mobile)
- [ ] Canopy groups read as "growing", not as "spots"
- [ ] Final frame identical to the logo (masks removed)
- [ ] Handoff lands exactly on the header logo
- [ ] Skip works with click, Esc, wheel, touch
- [ ] Reduced motion: no intro at all
- [ ] Lettering confirmed (D-28, D-11)
