# 04 — Interactions and buttons

Source: `index.html` and `js/main.js`, enumerated by script and checked in Chromium on 28.10.2026 [V-code][V-browser]. "Works" means the element does what its markup says in Chromium. `tel:`/`mailto:` were verified as correct URLs, not by placing a call. iOS Safari was **not** tested.

## A. Full list (DOM order)

| # | Block | Label / accessible name | Type | Action / destination | Works | Expected after redesign | Mobile | External dependency | QA checks |
|---|---|---|---|---|---|---|---|---|---|
| 1 | GLOBAL | Zum Inhalt springen | Skip link | `#main` | Yes | Keep | Keyboard only | — | Tab from address bar shows it |
| 2 | HEADER | Handy Chirurg Potsdam, Startseite | Logo link | `#top` | Yes | `/` on sub-pages | Same | — | Returns to top |
| 3 | HEADER | Reparaturen | Nav link | `#leistungen` | Yes | `/#leistungen` from sub-pages | In drawer | — | Anchor offset under fixed header |
| 4 | HEADER | Ablauf | Nav link | `#ablauf` | Yes | as above | In drawer | — | as above |
| 5 | HEADER | Sprechzeiten | Nav link | `#laden` | Yes | as above | In drawer | — | as above |
| 6 | HEADER | Fragen | Nav link | `#faq` | Yes | as above | In drawer | — | as above |
| 7 | HEADER | 0163 228 8224 / Anrufen | Call button | `tel:+491632288224` | Yes (URL) | Number from CMS | Label "Anrufen" | Phone line | Tap opens dialer on iOS/Android |
| 8 | HEADER | Menü öffnen | Toggle button | Opens drawer; Esc closes; link click closes | Yes | Keep | Visible ≤ 760 px | — | aria-expanded toggles; focus returns |
| 9 | HOME-01 | Jetzt anrufen | CTA | `tel:` | Yes (URL) | Keep | Same | Phone line | Dialer |
| 10 | HOME-01 | Route planen | CTA | Google Maps search URL (new tab) | Yes (URL) | Keep; consider Apple Maps on iOS | Same | Google Maps | Opens correct pin |
| 11 | HOME-03 | Jetzt anrufen | CTA | `tel:` | Yes (URL) | Keep | Same | Phone line | Hidden when scene inactive (visibility) |
| 12 | HOME-03 | Reparaturen ansehen | CTA | `#leistungen` | Yes | Keep | Same | — | Anchor lands correctly |
| 13 | HOME-07 | Im Laden | Tab | Shows panel-laden | Yes | Keep | Same | — | Arrow keys switch tabs |
| 14 | HOME-07 | Per Post | Tab | Shows panel-post | Yes | Keep | Same | — | as above |
| 15 | HOME-08 | Route planen | CTA | Google Maps (new tab) | Yes (URL) | Keep | Same | Google Maps | Duplicate of #10 by design |
| 16 | HOME-08 | Anrufen | CTA | `tel:` | Yes (URL) | Keep | Same | Phone line | Dialer |
| 17 | HOME-09 | 0163 228 8224 | Inline link | `tel:` | Yes (URL) | Keep | Same | Phone line | Dialer |
| 18–23 | HOME-09 | 6 questions | Accordion (`<details>`) | Expand/collapse | Yes | Keep; FAQ from CMS | Same | — | Keyboard, screen reader announces state |
| 24 | HOME-10 | 0163 228 8224 | Large link | `tel:` | Yes (URL) | Keep | Same | Phone line | Dialer |
| 25 | HOME-10 | potsdam@handy-chirurg.de | Link | `mailto:` | Yes (URL) | Keep | Same | Mail client | Opens composer |
| 26 | HOME-11 | Erstgespräch vereinbaren | CTA | `mailto:potsdam@…?subject=Franchise – Erstgespräch` | Yes (URL) | Link to `/franchise`; recipient to be confirmed | Same | Mail client | Correct recipient |
| 27 | FOOTER | 0163 228 8224 | Link | `tel:` | Yes (URL) | Keep | Same | Phone line | Dialer |
| 28 | FOOTER | potsdam@handy-chirurg.de | Link | `mailto:` | Yes (URL) | Keep | Same | Mail client | Composer |
| 29 | FOOTER | Datenschutz | Link | `https://www.handychirurg.de/datenschutz` (new tab) | **Unverified** (host unreachable here) | `/datenschutz` on the new site | Same | Old site | Must not point to the old site after launch |
| 30 | HOME-00 | (intro overlay) | Click target | Skips intro | Yes | Keep | Tap | — | Never blocks page longer than 5 s |
| 31 | HOME-01..03 | (3D canvas) | Pointer drag | Rotates phone; vertical scroll passes through (`touch-action: pan-y`) | Yes (desktop) | Keep | Touch drag | three.js (CDN) | Scroll not trapped on iOS |

Non-clickable dynamic elements (not counted as interactive): header opening chip, monitor state, two ECG canvases, scroll-driven scenes.

## B. Counts [V-code]

| Category | Count |
|---|---|
| **Total interactive placements** | **31** (29 DOM controls + intro click + 3D drag) |
| Unique interaction types | **11**: in-page anchor, phone, map, email, external page link, menu toggle, tab switch, accordion, intro skip, 3D drag, scroll-driven story |
| Internal links (anchors) | 7 (#1–6, #12) |
| External links | 3 (2 × Google Maps, 1 × old Datenschutz) |
| Phone actions | 7 |
| WhatsApp actions | **0** |
| Email actions | 3 |
| Map actions | 2 |
| Buttons (non-link) | 9 (1 menu, 2 tabs, 6 accordions) |
| Form submissions / data-changing actions | **0** |

## C. Issues found

| ID | Element | Issue | Severity |
|---|---|---|---|
| I-01 | HOME-04 signs | Show a "→" arrow and hover state but are not links. Ambiguous affordance | Medium — either link each sign to its price/service or remove the arrow |
| I-02 | #29 Datenschutz | Points to the old live site in a new tab | **High** — after relaunch it breaks or shows the wrong policy |
| I-03 | #26 Franchise CTA | Sends franchise leads to the Potsdam shop inbox | Medium — confirm recipient |
| I-04 | Opening state | Shows "Jetzt geöffnet" on public holidays (no holiday/closure data) | Medium |
| I-05 | #10/#15 | Google Maps only; iOS users may prefer Apple Maps | Low |
| I-06 | Repair-quote selector | Live-site interaction (3 selects + button) not present | **High** (functional loss) |
| I-07 | WhatsApp | Client has WhatsApp Business; no action on site | Medium |
| I-08 | Intro | Plays on every load (3.1 s) | Low — play once per session |

Live-site interactions could not be inventoried (site unreachable). From screenshots [S]: header mail icon, header phone icon, hamburger, 3 selects, „zum Reparaturangebot" button, phone card, email card, contact-section items (unknown). **Estimate: ≥ 9 live interactive elements**, behaviour unverified.
