# Implementation status

Updated: 28.10.2026, end of day 1 · Branch `claude/zealous-bohr-71wesv`

## Summary
The site, price catalogue, price selector, CMS and 3D hero are built and tested locally. **Launch is blocked by client inputs**, not by code: the official price list and the legal data are missing (`npm run check` lists 9 blockers). Nothing is deployed yet — no hosting or domain access exists.

## Completed and tested

| Plan ID | Deliverable | Evidence |
|---|---|---|
| T02 | Eleventy 3 project; concept ported to templates; all content in data files | `npm run build` OK (9 pages) |
| T02 | Fonts and three.js self-hosted | `npm test`: 0 third-party requests on all 6 pages × 2 viewports |
| T03 | Decap CMS at `/admin/`, self-hosted (6.2 MB); collections: prices, contact/hours/closures/holiday rule, repair types, price-list status, homepage texts, services, FAQ, franchise, Impressum, Datenschutz | Local end-to-end run: login → edit iPhone 13 display price → Veröffentlichen → `src/content/prices/apple.json` changed → rebuild → `/preise/` shows 149 € (test edit reverted afterwards) |
| T03 | Field validation in the CMS | Invalid phone `0163 228` rejected, file unchanged |
| T04 | Homepage, header, footer, JSON-LD read from data | 7 phone links rendered from `site.json` |
| T05 | Price importer (CSV) + build-time validation | Demo CSV imported; broken CSV (unreadable price, duplicate, unknown repair type) rejected with 4 messages, nothing written |
| T06 | Price selector on the homepage | `npm test`: brand → models, repairs, CTA follows selection, search, unknown-model fallback |
| T07 | `/preise/` with search, type filter, `#type` deep links | `npm test` |
| T08 | `/impressum/`, `/datenschutz/` (Markdown via CMS) | Rendered; open points marked visibly, see below |
| T09 | `/franchise/` page | Rendered; CTA falls back to shop phone until an e-mail is confirmed |
| T10 | H1 with "Potsdam"; intro once per session; service signs link to price filter; WhatsApp only when a number is set; Brandenburg holidays + closures in opening state | `npm test`: 6 fixed-time cases incl. Reformationstag and 1. Weihnachtstag |
| T12 | Canonical, absolute OG image, `sitemap.xml`, `robots.txt`, 404 page, redirects for known old URLs | Build output |
| T13 | Performance and accessibility pass | See results below |
| — | 3D: still poster for loading and no-WebGL; phones start 3D on first scroll; no re-render at rest on phones; 30 fps cap on ECG traces | `npm test`: 3D checks (4) |
| — | Launch gate `npm run check` | Lists 9 blockers, 4 warnings |

## Test results (local, Chromium)
- `npm test`: **all checks pass** — 6 pages × 2 viewports (no console errors, no third-party requests, no failed assets, no horizontal overflow, header logo visible), internal links, price selector (8), price list (4), 3D scene (4), opening state (6).
- Lighthouse, mobile profile (4× CPU, slow 4G), headless Chromium with **software WebGL**:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT |
|---|---|---|---|---|---|---|
| `/` mobile | 72 | 100 | 100 | 100 | 2.9 s | 1.05 s |
| `/` desktop | 61 | 100 | 100 | 100 | 0.6 s | 1.76 s |
| `/preise/` mobile | 98 | 96* | 100 | 100 | 2.3 s | 0 ms |

  *before the footer link fix. Start of day: homepage mobile performance was 28.
  The remaining TBT comes from WebGL and canvas drawing on a **software GPU** in this environment; a real phone will be faster, but this has **not been measured on a real device**.

## Decisions and trade-offs
| Decision | Reason |
|---|---|
| Eleventy + Decap CMS (Git-based) instead of WordPress or a custom admin | Static, no server to patch; every change is a commit (backup, rollback); validated in a full local run |
| Decap served from the site, not unpkg | No CDN dependency; works where CDNs are blocked |
| Production login via GitHub OAuth (Netlify provider or own OAuth proxy) | Netlify Identity is deprecated; secrets stay with the host, never in the repo |
| Procedural 3D phone instead of a downloaded model | No licence risk, small, every part labelled; poster image as static fallback |
| Missing/contradictory price → "auf Anfrage" (warning) instead of failing the build | The owner never sees a broken site; a price is never invented |
| Demo price dataset with "auf Anfrage" only, plus visible "Testdaten" notice | Development data must not look like real prices |
| Legal gaps as visible `[[KLÄREN: …]]` markers + launch gate | Nothing is fabricated; impossible to launch by accident |
| No contact form | None confirmed on the old site; avoids data processing and consent work. Enquiries via phone, WhatsApp, e-mail with prefilled text |
| Store-process step "Zahlung per Karte oder Überweisung" removed | Not confirmed for in-store payment |

## Still needed from the client (blocks launch)
1. **Official price list** (file). The live site with its embedded price list could not be accessed from this environment (`www.handychirurg.de` blocked by the network policy). Either allow the host in the environment's network settings or send the file.
2. **Impressum:** legal form, address for service of process, register/chamber data if applicable.
3. **Datenschutz:** hosting provider, log retention, Stripe use for send-in; legal review.
4. **Domain and hosting access**; decision on host (Netlify recommended); canonical domain (handychirurg.de vs handy-chirurg.de).
5. **CMS user:** GitHub account (e-mail) for the owner.

Not blocking, but open: WhatsApp number · public-holiday rule · franchise contact e-mail · guarantee duration · original photos (shop photo is a 732 px screenshot crop) · full list of old URLs for redirects · whether a contact form existed.

## Deployment status
Not deployed. `netlify.toml` is ready (build, headers, CSP, redirects). Steps: connect repo → set branch `main` → add GitHub OAuth provider → point domain. See `docs/CMS.md`.

## Remaining work (days 2–6)
| ID | Task | Est. h | Depends on |
|---|---|---|---|
| T05/T06 | Import and verify the official price list (spot checks vs. source) | 2–4 | Client price list |
| T08 | Fill legal pages, remove markers | 1 | Client legal data |
| T16 | Hosting setup, CMS OAuth, domain, redirects for all old URLs, Search Console | 3 | Access |
| T14 | Real-device QA (iPhone Safari, Android Chrome) incl. 3D and CMS login in production | 3 | Deployment |
| T15 | Client review round and fixes | 4–5 | Preview link |
| T17 | Owner walkthrough of the CMS | 1 | CMS live |
| P2 | Optional: more realistic phone materials; label spacing on very small screens; Apple Maps link on iOS | — | Time |

## Risks to the deadline
- Price list arrives late → selector stays on "Testdaten"; launch impossible without it.
- No domain/hosting access by day 4 → no launch on day 6.
- Real-device 3D performance unknown until a preview URL exists.
- Client review changes after day 5.
