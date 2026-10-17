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
| Buttons | Corners are rounded in a diagonal pair and swap on hover, an arrow slides right, and the fill sweeps up from the bottom |
| Blocks | Rise into view as you scroll, staggered when several arrive together |
| Gallery | Click any frame for the lightbox. Arrow keys move, Escape closes, focus returns to the frame you opened |
| Location shot | Light parallax tied to scroll |

All of it is plain CSS and JavaScript. No GSAP, no Framer Motion, no
library of any kind.

**Motion is opt-in.** A short script in `<head>` adds `.anim` to the root
element only when scripting is on and the viewer has not asked for reduced
motion. Every rule that hides an element sits behind that class, so with no
script, or with reduced motion, the page simply renders at rest with
nothing hidden.

## Performance

Measured in Chromium on a 375 x 812 viewport at 2x, with the CPU throttled
4x and the network held to about 1.6 Mbps.

| Metric | Before | After | |
|---|---|---|---|
| LCP | 2480 ms | **912 ms** | good |
| CLS | 0.0038 | 0.0038 | good |
| Transfer | 452 KB | **370 KB** | |
| Images | 289 KB | **204 KB** | |
| Requests | 11 | 14 | |
| DOM nodes | 201 | 232 | |

What moved the numbers:

1. **WebP with a JPEG fallback.** About 40% smaller across the set. A
   canvas probe picks the format, so no browser is left without an image.
2. **Real thumbnails.** The rail used to load the full photographs to draw
   them 240 px wide. `img/thumb/` holds 380 px copies: 57 KB instead of
   288 KB.
3. **Deferred slides.** Only the first hero shot is fetched up front and
   preloaded. The other four are built after `load`, or on demand if the
   viewer clicks ahead.

Fonts are now the largest single item at 117 KB. They do not block first
paint (`display=swap`), but dropping the width axis from the Archivo
request would save about 21 KB at the cost of the widened headings.

Touch targets were raised to 44 px on the footer links, the menu button,
the header call to action and the address lockup.

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

---

# AIK Studio — `studio/`

A separate page for the studio itself, built around one scroll-driven
film: a golden eagle coming out of mountain fog toward the camera. The
listing above is untouched; the studio page links to it as its first
case study.

```
studio/index.html
studio/studio.css
studio/studio.js
```

Same stack as the listing: plain HTML, CSS and JavaScript, no build step,
no animation library. Same fonts (Archivo, Instrument Sans).

## The film

Generated on Higgsfield (Kling 3.0, 10 s, 1920 × 1080, 24 fps), then
graded darker and cooler and re-encoded for scrubbing. The source file had
a single keyframe, which makes every seek decode from frame 0. Both
encodes put a keyframe every 6 frames and have no B-frames, so a seek
decodes at most five frames.

| File | Size | Used for |
|---|---|---|
| 1920 × 1080, CRF 22 | 4.5 MB | Windows wider than 900 px |
| 1280 × 720, CRF 23 | 1.8 MB | Phones and small windows |
| First frame, 1600 px JPEG | 33 KB | Poster while the sequence loads |
| 6.8 s frame, 1600 px JPEG | 38 KB | Still hero for reduced motion, og:image |

**The files are served from the Higgsfield CDN**, not from this
repository; the URLs are in the `data-*` attributes on `#cineVideo` in
`studio/index.html` and in one `url()` in `studio.css`. To self-host,
download the four files, put them in `studio/media/`, and swap the URLs.

## What the frames contain

The copy is placed from the actual footage, not guessed:

| Time | Frame | Copy |
|---|---|---|
| 0–1.5 s | Empty valley, fog, two peaks | Kicker, low left |
| 1.5–7 s | Eagle rises out of the fog, lower-middle third | Headline in the top band, over the peaks |
| 8–10 s | Close pass; wings fill the upper two thirds | Closing line and CTA, low left, over fog |

## How the scroll works

The section is 420 svh tall (340 on phones) with a sticky stage inside.
One `requestAnimationFrame` loop eases a progress value toward the scroll
position (about 90 ms time constant) and writes everything from that one
number: `video.currentTime`, the three copy beats, two fog layers moving
at different rates, a slow 1.06 → 1.0 settle of the frame, the timecode
rail and a light fade at the end. The loop stops when it has caught up.

- The video is never played while scrubbing. One seek is in flight at a
  time; when `seeked` fires, the next one goes to wherever the scroll is
- iOS Safari will not paint a seeked frame until the element has played
  once, so it is played muted and paused immediately on `loadedmetadata`
- If a seek never lands (2.5 s) or the file errors, the page drops to
  the poster and the copy keeps working
- On portrait screens the crop pans from 50% to 62% over the last
  quarter, so the eagle's head stays in frame during the close pass
- Reduced motion or data saver: no film is requested at all. The hero is
  one still frame with the headline and closing line both visible

Checked in Chromium at 1440 × 900 and 390 × 844 at 0, 20, 50, 78 and 100%
of the sequence: video time tracked progress to within 0.02 s, no
horizontal overflow, no console errors.
