# Handy Chirurg Potsdam – Website

Website of the repair shop Handy Chirurg, Dortustraße 23, Potsdam.
Static site built with **Eleventy 3**, content edited through **Decap CMS** at `/admin/`.

```
npm install
npm run dev            # site + admin on http://localhost:8080
npm run cms            # (second terminal) local CMS backend, writes to the repo files
npm run build          # production build → _site/
npm test               # end-to-end checks against _site/ (Playwright + Chromium)
npm run check          # launch gate: lists open client inputs, fails while blockers remain
npm run test:interactions -- --write   # clicks every link/button on representative pages, writes project-audit/INTERACTION-QA-MATRIX.md (several minutes)
npm run preview:bundle # self-contained preview in .cache/preview (flat pages, relative links; open with any static server)
npm run import:prices -- data-import/<file>.csv   # import the official price list
```

## Structure

| Path | What |
|---|---|
| `src/_data/*.json` | Editable content: business info and hours (`site.json`), homepage texts, services, FAQ, franchise, repair types, price-list status |
| `src/content/prices/*.json` | Price catalogue, one file per manufacturer (edited in the CMS or imported from CSV) |
| `src/content/legal/*.md` | Impressum and Datenschutz |
| `src/_data/prices.js` | Loads and validates the catalogue; invalid data stops the build |
| `src/*.njk`, `src/_includes/` | Templates |
| `src/assets/` | CSS, JS (`main.js`, `phone.js` 3D scene, `selector.js`), images |
| `src/admin/config.yml` | CMS configuration |
| `scripts/` | Price importer, launch check, end-to-end tests |
| `data-import/` | Source files for price imports (kept unchanged as reference) |
| `netlify.toml` | Build, security headers, redirects |
| `docs/CMS.md` | Owner guide (German) and CMS/auth setup |
| `project-audit/` | Audit, six-day plan, implementation status |

## Design

A clinic for phones, in the brand's own colours (skyline teal `#2f7a68`, heartbeat red `#c8312a`, charcoal `#2a2a2a` on white and mint). Archivo at its widest setting echoes the spaced capitals of the logo; IBM Plex Mono for monitor and chart labels.

- **Intro:** the real logo is revealed by a monitor sweep with a dot riding the heartbeat line, then docks into the header. Once per session; skipped with reduced motion.
- **Hero:** "Notaufnahme für Ihr Handy in Potsdam." with a patient monitor showing the live opening state (Potsdam time, Brandenburg holidays, closures from the CMS).
- **3D story** (`phone.js`, three.js 0.160, self-hosted): a cracked phone opens into labelled layers on scroll and closes repaired. Built from primitives, no external model (no licence question). Desktop starts after idle; phones start on first scroll; at rest nothing re-renders on phones. Without WebGL a still image (`phone-poster.webp`) is shown.
- **Price selector:** Hersteller → Modell → Reparatur → Preis, free-text search, enquiry by phone, WhatsApp (when configured) or e-mail.

## Privacy
Fonts, three.js and the CMS are served from the site itself. The public site sets no cookies and makes no third-party requests (checked by `npm test`). The CMS at `/admin/` talks to GitHub only for logged-in editors.

## Status
See `project-audit/IMPLEMENTATION-STATUS.md`. The site must not go live until `npm run check` passes (official price list, Impressum and privacy data from the client).
