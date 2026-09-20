# MARAAL — Dubai luxury real estate landing (demo)

Concept landing page for a private residential brokerage in Dubai.
Built as a portfolio / social-post demo for AIK Studio.

## Stack

Plain HTML, CSS and JavaScript. No frameworks, no build step, no external
fonts, no libraries. Open `index.html` in a browser and it runs.

```
index.html
css/style.css
js/main.js
```

## What is real and what is a placeholder

Nothing here is invented as a claim. Before showing this to a client,
replace:

| Placeholder | Where |
|---|---|
| Brand name MARAAL | `index.html`, `<title>`, logo, footer |
| Six listings (names, districts, sizes) | `#grid` — marked `DEMO CONTENT` |
| Card photos — CSS gradients | `.card__media--a` … `--f` in `style.css` |
| Portrait photo — CSS gradient | `.frame--portrait` in `style.css` |
| Quote block | `.quote` — says "placeholder" on purpose |
| Phone `+00 000 000 0000`, `desk@example.com` | `#enquiry` |

No testimonials, client logos, awards or performance numbers are used.
Prices read "Price on application" rather than a made-up figure.

## Behaviour

- Sticky navigation that gains a background after 40px of scroll
- Mobile menu (burger), closes on link click and on Escape
- Hero headline reveals line by line on load
- Scroll reveals via `IntersectionObserver`
- District marquee — the group is cloned in JS so the loop is seamless
- Collection filter: All / Penthouses / Villas / Branded
- Enquiry form with inline validation; **demo only, sends nothing**

## Accessibility and motion

- `prefers-reduced-motion: reduce` disables animation, marquee and reveals;
  all content shows immediately
- `<noscript>` fallback shows every reveal block when JS is off
- Skip link, visible focus ring, labelled form fields, `aria-invalid` on errors

## Section colour transitions

Shading is applied only to the edge where the colour actually changes:
the top of the light enquiry block, and the top of the dark footer.
Nothing else is shaded.

## Wiring the form

`js/main.js` handles validation and then shows the success message. To make
it send, replace the block marked `Demo only: no request is sent` with a
`fetch()` to your endpoint (Netlify Forms, Formspree, own backend).
