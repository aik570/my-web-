# MARAAL Residences — Dubai concept site

A one-page site for a fictional private brokerage in Dubai, built as a
portfolio and social-post piece for AIK Studio.

## Direction

Photography-led. The chrome stays quiet and the photographs carry the
colour: a full-bleed hero, an asymmetric tile grid, generous whitespace.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f1efe9` | Warm off-white, pulled grey so it is not the usual cream |
| `--paper-2` | `#e8e4db` | The enquiry band |
| `--ink` | `#17150f` | Warm near-black for type and the footer |
| `--muted` | `#6f6b62` | Secondary text |
| `--slot` | `#e0dbd0` | An empty photo slot |

There is no chromatic accent. Interactive states invert ink and paper.

Type: **Bodoni Moda** (display) and **Archivo** (body and labels), from
Google Fonts with real fallback stacks.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step. The only
external resource is the Google Fonts stylesheet.

```
index.html
css/style.css
js/main.js
img/          <- photographs go here
og.png
```

## Photographs

**The page ships without them.** Each slot states which file belongs there
and at what size; drop the file into `img/` and the slot fills itself.
`img/README.md` carries the full brief.

| File | Size | Shot |
|---|---|---|
| `hero.jpg` | 2400 × 1400 | Skyline or tower facade at dusk |
| `living.jpg` | 1600 × 1200 | Living room through full-height glass |
| `pool.jpg` | 1600 × 1200 | Waterfront villa, lap pool |
| `terrace.jpg` | 1600 × 1200 | Terrace in evening light |
| `stair.jpg` | 1200 × 1600 | Vertical: staircase or hall |
| `detail.jpg` | 1200 × 1200 | Square: stone, oak, brass close up |

Regenerate `og.png` once the photographs are in, or the link preview keeps
showing empty slots.

## What is real and what is a placeholder

| Item | Status |
|---|---|
| Brand MARAAL, four addresses, areas, levels | Invented for the concept |
| Phone, email | `+00 000 000 0000`, `desk@example.com` |
| Prices | Not shown. No invented figure |

No testimonials, client logos, awards or performance figures appear on the
page. The footer states that the concept is a demo.

## Behaviour

- Nav is transparent over the hero and turns solid past it; the current
  section is marked with `aria-current`
- Menu collapses under 720px, closes on link click and on Escape
- Enquiry form validates inline. **Demo only — it sends nothing**
- Anchor targets carry `scroll-margin-top` so headings clear the fixed nav
- `prefers-reduced-motion` disables the transitions
- Nothing is hidden behind a scroll observer; the page reads at load

## Wiring the form

In `js/main.js`, replace the block marked `Demo only: nothing is sent` with
a `fetch()` to your endpoint (Netlify Forms, Formspree, your own backend).
