# A135 — 6286 203 Street, Langley BC

A single-listing page for a commercial strata unit in the Township of
Langley, British Columbia. Built as a portfolio piece for AIK Studio.

## Direction

The palette is taken off the building itself: charcoal cladding, white
concrete, and the orange stripe that runs along the facade.

| Token | Value | Role |
|---|---|---|
| `--char` | `#33363a` | Charcoal cladding. Type and the dark band |
| `--bone` | `#f4f3f1` | White concrete. The page ground |
| `--orange` | `#e4601f` | The facade stripe. Status, CTA, rules. Used sparingly |
| `--grey` | `#6b7076` | Secondary text |

Type: **Archivo** at 700 with a widened axis for headings, **Instrument
Sans** for body. Figures use tabular numerals.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step. The only
external resource is the Google Fonts stylesheet.

```
index.html
css/style.css
js/main.js
img/           five photographs
og.png
```

## Filling in the listing

**Every figure lives in one object.** Open `js/main.js` and edit `LISTING`
at the top. A field left as `null` renders as a greyed dash instead of a
made-up number.

```js
var LISTING = {
  status:  'For lease',
  size:    '2,412 sq ft',
  height:  '24 ft clear',
  loading: 'One grade-level door',
  parking: '4 stalls',
  agent:   'Nikolai Riabov',
  ...
};
```

Only four figures are shown on the page now: unit size, clear height,
loading and parking. The full specification table was removed. Contact rows
are built from the same object and a row with no value is not rendered at
all, so the block never shows an empty line.

## Interaction

| What | How it behaves |
|---|---|
| Hero slideshow | Five shots crossfade every 5.2 s with a slow scale drift. Pauses on hover, on focus, and when the tab is hidden |
| Thumbnail rail | Doubles as the control. Click to jump; the track slides to keep the active frame centred |
| Headline | Splits into words and rises into place on load, 70 ms apart |
| Blocks | Rise into view as you scroll, staggered when several arrive together |
| Gallery | Click any frame for the lightbox. Arrow keys move, Escape closes, focus returns to the frame you opened |
| Location shot | Light parallax tied to scroll |
| Buttons | Fill sweeps up from the bottom edge on hover |

All of it is plain CSS and JavaScript. No GSAP, no Framer Motion, no
library of any kind.

**Motion is opt-in.** A short script in `<head>` adds `.anim` to the root
element only when scripting is on and the viewer has not asked for reduced
motion. Every rule that hides an element sits behind that class, so with no
script, or with reduced motion, the page simply renders at rest with
nothing hidden.

## Photographs

Shot by the site owner. The five files in `img/` were cut out of three
social-post composites: the baked-in title block and the brokerage
watermark were cropped away.

| File | Size | Shot |
|---|---|---|
| `aerial-wide.jpg` | 828 × 560 | The complex from above, valley behind |
| `street-front.jpg` | 702 × 419 | Frontage across 203 Street |
| `loading-bays.jpg` | 688 × 394 | Rear elevation, grade-level doors |
| `aerial-corner.jpg` | 702 × 282 | Panorama from the south |
| `aerial-context.jpg` | 688 × 288 | Overhead, yard and service access |

**These are low resolution.** The two panoramas are capped at 980px wide so
nothing upscales past about 1.4×. Supply the originals from the camera and
those caps in `css/style.css` can be removed.

There is also a 5 MB MP4 of the site that could not be processed here:
neither the bundled ffmpeg nor the bundled browser can decode H.264 in this
environment. It is not in the repository.

## What the page does not claim

No price, area, zoning, clear height, power, parking or availability is
stated until the data is supplied. The footer says so. Nothing on the page
is an offer.

## Behaviour

- Sticky bar with the current section marked via `aria-current`
- Menu collapses under 720px, closes on link click and on Escape
- Viewing request form validates inline. **Demo only — it sends nothing**
- `prefers-reduced-motion` disables the transitions
- Nothing is hidden behind a scroll observer; the page reads at load

## Wiring the form

In `js/main.js`, replace the block marked `Demo only: nothing is sent` with
a `fetch()` to your endpoint.
