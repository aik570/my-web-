# MARAAL Register — Dubai private residential desk (concept)

A one-page site for a fictional private brokerage in Dubai. Built as a
portfolio and social-post piece for AIK Studio.

## Direction

Not a luxury brochure. The page is set as an **architect's drawing sheet**:
a title block instead of a nav bar, hairline rules, a dimension line under
the hero, mono figures with tabular numerals, and two canvas drawings.

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0c1416` | Deep petrol ground, green bias. Not neutral near-black |
| `--stone` | `#e9e3d8` | Warm limestone type |
| `--brass` | `#c19a62` | The only accent. Hairlines, ticks, the marked level |
| `--paper` | `#e6e1d6` | The enquiry band, where the sheet flips to paper |

Type: **Bodoni Moda** (display) / **Archivo** (body) / **IBM Plex Mono**
(references, areas, labels). Loaded from Google Fonts with real fallback
stacks.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step, no plugins.
The only external resource is the Google Fonts stylesheet.

```
index.html
css/style.css
js/main.js
```

## The two drawings

Both are drawn on `<canvas>` at load, sized to the device pixel ratio, and
redrawn on resize and once webfonts settle.

- **Hero elevation** — a tower section with two setbacks, 46 floor lines, a
  brass band on the marked level, a leader line out to its label, and a
  height dimension down the left margin.
- **Floor plan** — redrawn every time you select a line in the register.
  Rooms, an outdoor band (terrace hatched, pool hatched), a compass with
  north up and the unit's aspect marked in brass, and a scale bar carrying
  the unit's real span.

## What is real and what is a placeholder

| Item | Status |
|---|---|
| Six addresses, refs, areas, levels, plans | **Demo data** in `UNITS` in `js/main.js` |
| Brand MARAAL | Invented for the concept |
| Phone, email | `+00 000 000 0000`, `desk@example.com` |
| Dubai local time in the header | Real, `Intl` with `Asia/Dubai` |
| DLD transfer 4% | Real Dubai Land Department figure |
| Prices | "On application" — no invented number |
| Service charge | "On file" — no invented number |

No testimonials, client logos, awards or performance figures appear
anywhere on the page. The footer says the concept is a demo.

## Behaviour

- Register: click or keyboard. `Enter` / `Space` select, `ArrowUp` /
  `ArrowDown` move and select. The plan panel is sticky beside the list on
  wide screens and stacks below it on narrow ones.
- Enquiry form validates inline. **Demo only — it sends nothing.**
- Sticky title block with a live Dubai clock; menu collapses under 720px.

## Deliberate decisions

- **Nothing is parked at `opacity: 0`.** The page is fully readable the
  moment it loads; no scroll observer gates content.
- **The hero is not `100vh`.** It is sized to what it holds.
- **Numbers only where order is real.** `01–04` appear in the purchase
  sequence and nowhere else.
- **Section transitions.** Only the edge where the colour actually changes
  is shaded: the top of the paper band and the top of the footer.

## Wiring the form

In `js/main.js`, replace the block marked `Demo only: nothing is sent` with
a `fetch()` to your endpoint (Netlify Forms, Formspree, your own backend).
