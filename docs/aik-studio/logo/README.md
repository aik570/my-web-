# AIK Studio: flat logo system (draft for owner review)

**Status: draft. Not approved.** This is the vector redraw specified in Visual Identity v1.0 §2.1 and §13.1. The metallic logo, eagle and Stage 5B work are not started.

## Files

| File | Variant | Colour |
|---|---|---|
| `aik-symbol.svg` / `aik-symbol-reverse.svg` | Standalone symbol | Obsidian `#101419` / Ice White `#F2F5F7` |
| `aik-lockup-horizontal.svg` / `-reverse.svg` | Symbol + AIK STUDIO wordmark, side by side | same |
| `aik-lockup-stacked.svg` / `-reverse.svg` | Symbol above AIK STUDIO | same |
| `aik-favicon-symbol.svg` / `-reverse.svg` | Simplified symbol for very small sizes | same |
| `aik-favicon.svg` | Favicon tile, 32 × 32 (Ice symbol on an Obsidian square, radius 2) | both |
| `previews/preview-sheet.png` | All variants on light and dark (rendered from the SVGs) | |
| `previews/size-test@1x.png`, `@2x.png` | 16 / 24 / 32 / 48 / 64 px at device-pixel-ratio 1 and 2 | |
| `previews/size-test-pixels-6x.png` | The @1x renders at 16–48 px, enlarged 6× with nearest-neighbour so the pixels can be inspected | |
| `source/build_logo.py` | Parametric generator for every SVG above | |

Every file is a flat monochrome fill: no gradients, strokes, effects or embedded rasters. Each mark is a single `<path>`, and the wordmark is outlined, so no font is needed to display it. For inline use on the web, replace the `fill` value with `currentColor`.

The previews are headless-Chromium (Playwright) screenshots of `previews/*.html`. Those pages load the SVG files directly through `<img>`.

## Construction

Units: symbol height = 100, baseline y = 100, y grows downward.

| Element | Rule |
|---|---|
| Letter → peak | Left peak = **A**, centre peak = **I**, right peak = **K** |
| Summit heights | I 100, A 86, K 78. Three distinct summits; the centre is highest without dominating the mass |
| Angle family | Every flank and facet is at **58°** from horizontal: the A's legs, the faceted tops of I and K, the K's arms and the right face of the K's arm summit |
| Stroke | 11 units (1/9 of height) everywhere: A legs, crossbar (10), I, K stem, K arms |
| A | Chevron with a pointed apex. Crossbar at y 70–80, so the triangular counter above it stays large |
| I | Vertical stem with a single 58° facet cut, high on the left and falling to the right. This reads as a lit rock face (key light from the upper left), not a pencil point |
| K | Stem with the same facet. The upper arm rises at 58° to its own pointed summit. The lower arm leaves the upper arm and runs down to the baseline. **Both arms are joined to the upright.** |
| Spacing | A to I: 8 units at the baseline, opening into a triangular valley. I to K: 9 units |
| Removed from Ref 01 | The two redundant parallel strokes left of the A, the photographic centre peak and the detached chevron |
| Overall silhouette | The A's left leg rises at 58° and the K's lower arm falls at 58°. The envelope is one massif with three summits. There are no vertical outer strokes, so it doesn't form an M. |
| Symbol box | 171.71 × 100 |

**Wordmark.** "AIK STUDIO" in Space Grotesk Medium (the font already specified in §2.2 and §4; SIL OFL 1.1), uppercase, tracking +0.18em, outlined.
- **Horizontal lockup:** cap height = 0.30 × symbol height, wordmark baseline on the symbol baseline, gap = 0.36 × symbol height.
- **Stacked lockup:** wordmark width = symbol width, gap = 0.30 × symbol height.

**Favicon variant.** Same summit order and facets, with these changes:
- no crossbar
- stroke 17 units
- flanks steepened to 64°
- gaps widened to 11 and 13 units

The A becomes a plain Λ peak. This is a deliberate simplification for sizes where a crossbar would close the counter.

## Size test results (rendered, Chromium)

Pixel figures are derived from the geometry. The pass/fail verdicts come from inspecting the rendered screenshots, plus a scan of two pixel rows (at 45% and 97% of height) that counts separate strokes. The verdicts are **my own visual judgement, not user testing.**

| Size (height) | Full symbol | Favicon symbol / tile |
|---|---|---|
| 64 / 48 px | **Pass.** All strokes separate. A, I and K clear; K joined; no M | **Pass** |
| 32 px | **Pass.** Stroke 3.5 px, smallest gap (A to I at baseline) 2.6 px | **Pass** |
| 24 px | **Pass.** Stroke 2.6 px, gaps ≥ 1.9 px. The K's upper notch is narrow but open | **Pass** |
| 16 px | **Limited.** Stroke 1.8 px (below the 2 px rule), A to I gap 1.3 px, and the K's upper notch closes at @1x. Still reads as A I K when enlarged, but too fine at actual size | **Pass, with limits.** At @1x on a 16 px tile the mark is about 8 px tall: Λ, I and K stay separate, but the K is reduced to a blocky shape. Recognisable as the AIK mark, not as letters to be read |

### Minimum sizes

| Use | Minimum |
|---|---|
| Full symbol | **24 px tall** on screen |
| Below 24 px | Use `aik-favicon-symbol` or `aik-favicon` |
| Horizontal lockup | 24 px tall (≈ 120 px wide; wordmark caps ≈ 7 px) is the tested minimum. **32 px tall** is recommended for the header |
| Stacked lockup | **64 px tall.** At 48 px the wordmark caps drop to about 5 px |
| Favicon | `aik-favicon.svg` for 16–64 px |

Not yet produced: ICO and PNG exports (16/32 ICO, 180 apple-touch, 512 maskable). The listed favicon variant must be approved first.

## Not verified / open points

1. **No human or real-device review yet.** All checks above are renders in headless Chromium on Linux. Rendering on Windows ClearType and macOS may differ slightly.
2. **Mountain reading vs letter reading.** The AIK letters read clearly. The mountain reading depends on the 58° massif envelope and the faceted summits, and is weaker than in the cinematic reference. Owner judgement needed.
3. **"AIK AIK STUDIO" repetition.** The symbol already spells AIK, so the brief's "AIK STUDIO" wordmark repeats it. Ref 01 paired the monogram with "STUDIO" only. Both are easy to switch; **decision needed.**
4. Light-on-dark marks look slightly bolder on screen (irradiation). There's no separate optically thinned reverse; assess on real screens.
5. The 58° angle and the 86/100/78 summit ratio are now implemented and render well, but haven't been approved.
