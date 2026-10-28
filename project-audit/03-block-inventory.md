# 03 — Block inventory

All blocks below are on the single public page `/` of the repository concept [V-code]. IDs follow DOM order. Live-site blocks that the concept dropped are listed in section C, because their functions must be preserved or consciously retired.

Priority: **P0** must ship on day 6 · **P1** should ship · **P2** can follow after launch.
CMS: whether the owner must be able to edit the content (see 05).

## A. Page sections — homepage (`/`)

| ID | Section | Purpose | Existing content and assets | Status | Priority | Interactions | Unique / reusable | CMS-editable | Depends on |
|---|---|---|---|---|---|---|---|---|---|
| HOME-00 | Intro (logo animation) | Brand moment; logo draws as a monitor sweep and docks into the header | Traced SVG logo (`lg-sky`, `lg-pulse`, `lg-word`), tagline text | Working; 3.1 s, click to skip, 5 s CSS failsafe | P1 | Click/tap skips | Unique | No | GLOBAL-LOGO, GLOBAL-HEADER |
| HOME-01 | Story · Hero scene „Aufnahme" | First screen: H1, lede, call/route CTAs, live monitor | H1, lede, 2 CTAs, COMP-MONITOR | Working | **P0** | 2 CTAs; scroll; 3D drag | Unique | Yes: kicker, H1, lede, CTA labels | COMP-3D, COMP-MONITOR, BIZ data |
| HOME-02 | Story · „Im OP" scene | 3D phone exploded into 5 labelled layers | Scene text, 5 tags | Working | P1 | Scroll; drag | Unique | Yes: title, lede, 5 tag labels | COMP-3D |
| HOME-03 | Story · „Entlassen" scene | Phone repaired; CTA | Title, lede, 2 CTAs | Working | P1 | 2 CTAs | Unique | Yes: texts | COMP-3D |
| HOME-04 | Fachbereiche (services) | What is repaired | 4 wayfinding signs with pictograms, durations | Working | **P0** | Hover only (see 04 issue I-01) | Section unique; sign reusable ×4 | Yes: services collection | SERVICES data |
| HOME-05 | Befund (diagnosis fee) | 25 € diagnosis, credited on repair | Text | Working | **P0** | — | Unique | Yes: price, text | — |
| HOME-06 | Patientenrechte (promises) | 4 promises § 1–4 | Text | Working | P1 | — | Unique; item ×4 | Yes | — |
| HOME-07 | Behandlungsweg (process) | Two tracks: in store / by post | 2 × 4 steps, ECG line | Working; **post-track details unconfirmed** | **P0** | 2 tabs | Unique; step item ×8 | Yes | Client confirmation (Q4, Q5) |
| HOME-08 | Sprechzeiten & Anfahrt | Address, hours, route, call | Shop photo, door board, hours table | Working | **P0** | 2 CTAs | Unique | Yes: hours, address, photo | BIZ data |
| HOME-09 | Sprechstunde (FAQ) | Objections and questions | 6 Q&A | Working | P1 | 6 accordions | Unique; item ×6 | Yes: FAQ collection | — |
| HOME-10 | Direkter Draht (call) | Large phone number, email, ECG | Number, meta, wide ECG | Working | P1 | 2 links | Unique | Yes (from BIZ) | BIZ data |
| HOME-11 | Franchise teaser | Franchise offer and contact | Text, 2 lists, mailto CTA | Working; recipient unconfirmed | P1 | 1 CTA | Unique | Yes | Should link to `/franchise` |
| — | **Missing:** price selector / price teaser | Live-site function (L1-04) | — | **Not built** | **P0** | 3 selects + result + CTA | Unique | Yes: price data | Client price list |
| — | **Missing:** WhatsApp action | Direct messaging | — | **Not built** | P1 | Link | Reusable | Yes: number | Client number |

**Unique homepage section types: 12** (HOME-00 … HOME-11). **Section placements: 12** (each appears once). [V-code]
Two further P0/P1 blocks are required but do not exist yet.

## B. Global and reusable components [V-code]

| ID | Component | Placements | Variants | CMS-editable data |
|---|---|---|---|---|
| GLOBAL-HEADER | Fixed header with nav, state chip, call button, menu | 1 | Desktop / mobile drawer | Nav labels, phone |
| GLOBAL-FOOTER | Logo, contact, hours, Impressum, Datenschutz | 1 | — | BIZ data, legal |
| GLOBAL-LOGO | Inline SVG logo (`<symbol>`-like `<defs>` + `<use>`) | 4 (intro, header, door board, footer) | Full colour, white, with/without tagline | No (brand asset) |
| COMP-BTN | Button | 7 | primary, quiet, white, outline-light | Labels |
| COMP-KICKER | Label with cross mark | 9 | light / dark | Text |
| COMP-MONITOR | Live opening-state monitor + ECG canvas | 1 (+ 1 wide ECG in HOME-10) | compact / wide | Hours, closures |
| COMP-STATE | Opening-state chip in header | 1 | open / closed | Hours |
| COMP-3D | Three.js phone scene (`js/phone.js`) | 1 | — | No |
| COMP-TAG | 3D part label | 5 | — | Texts |
| COMP-SIGN | Service sign | 4 | — | Service fields |
| COMP-STEP | Process station | 8 (2 tracks × 4) | — | Step fields |
| COMP-FAQ | Accordion item | 6 | — | Q, A |
| COMP-CHARTER | Promise item | 4 | — | Title, text |
| COMP-HOURS | Hours table with "today" highlight | 1 | — | Hours |
| COMP-FCARD | Checklist card | 2 | — | List items |
| COMP-PULSE | Drawn heartbeat line (SVG) | 1 (process) | — | No |

**Unique reusable component types: 16.** Total component placements: 1+1+4+7+9+2+1+1+5+4+8+6+4+1+2+1 = **57**. Counted from markup with `grep` [V-code].

## C. Live-site blocks and their fate [S]

| Live block | Concept equivalent | Decision needed |
|---|---|---|
| L1-01 Top bar (mail/phone icons) | Merged into header call button | Retire (icons without labels; adds 100 px on mobile) |
| L1-03 Hero | HOME-01 | Keep "Potsdam" + "Handy-Reparatur" in H1 for SEO (see 07) |
| **L1-04 Repair-quote selector** | **None** | **Must be rebuilt (P0)**: it is the live site's main tool and the client has an official price list |
| L1-05 Trust cards ×3 | HOME-06 partly | "Zertifizierte Techniker" claim needs evidence before reuse |
| L1-06 Why us (9 benefits) | HOME-05, HOME-06, HOME-04 | All 9 claims mapped except "Großer Ersatzteillagerbestand"/"Erfahrene Techniker" (only in lede). Confirm wording |
| L1-07 Process (4 steps) | HOME-07 | Steps 3–4 text, Berlin wording, payment — confirm |
| L1-08 Our shop | HOME-08 | Shop text paragraph not carried over; can be added |
| L1-09 Contact CTA | HOME-10 | Equivalent |
| L1-10 „Kontaktieren Sie uns" | None | Content unknown — if it is a form, decide whether to keep |
| L2 `/franchise` | HOME-11 (teaser only) | Needs its own page to keep URL |
| L3/L4 legal | Footer excerpt | Need full pages |

## D. Proposed new templates (production)

| ID | Template | Blocks | Priority |
|---|---|---|---|
| PRICE-01 | `/preise` price list | Brand → model → repairs table, search, notes, CTA | P0 (as part of selector) / P1 (full page) |
| FRAN-01 | `/franchise` page | Hero, offer list, requirements, process, contact | P1 |
| LEGAL-01 | Legal page template (Impressum, Datenschutz) | Rich-text body | **P0** |
| ERR-404 | Not found | Message, links | P1 |
