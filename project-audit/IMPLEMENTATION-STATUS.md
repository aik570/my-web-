# Implementation status

Updated: 28.10.2026, Phase 3 (recovery of the original website) · Branch `claude/zealous-bohr-71wesv`

## 1. Access to the original website

| Check | Result |
|---|---|
| First attempt (before the network change) | `getaddrinfo ENOTFOUND www.handychirurg.de` (host not in allowed domains); web.archive.org not reachable |
| After "allow all domains" — `curl https://www.handychirurg.de/` | **HTTP 200, 65 792 bytes** (via the environment proxy). The WebFetch tool still fails with ENOTFOUND, so shell + headless Chromium were used |
| Technology of the old site | Single-page app (Lovable / Vite / React). Catalogue loaded at runtime from a public Supabase REST API (`pzdgfkubugbpqqwgetxy.supabase.co/rest/v1/…`) with the site's public key; contact form via a Supabase function |

Pages inspected in a real browser (rendered text + DOM + network requests):

| URL (discovered from navigation/footer/bundle) | Status | Used for |
|---|---|---|
| `/` | 200 | Hero, benefits, process, shop, FAQ (answers from the JS bundle), contact |
| `/services` | 200 | 8 services with duration, warranty, description; visit block |
| `/impressum` | 200 | Impressum |
| `/datenschutz` | 200 | Datenschutzerklärung |
| `/franchise` | 200 | Franchise offers and requirements, contact |
| `/apple`, `/samsung` (also routes `/huawei`, `/xiaomi`, `/google`, `/sony`, `/oneplus`) | 200 | Brand model lists (show "ab -1€" for models without price — bug of the old site) |
| `/ablauf` | 200 | Same process text as the homepage |
| `/admin`, `/auth`, `/csv-import` | not inspected | Admin routes of the old site; not public content |

## 2. Recovered content and where it went

| Content | Source | New location | Status |
|---|---|---|---|
| **Price catalogue** | Calculator's own data requests (`repair_brands`, `repair_models`, `repair_services`, `model_accessories`), snapshot `data-import/original/snapshot.json` (`scripts/fetch-original.mjs`) | `src/content/prices/*.json` via `scripts/convert-original.mjs` → `npm run import:prices` | Imported, status **`imported`** (not yet confirmed by the owner) |
| Impressum | `/impressum` | `src/content/legal/impressum.md` | Copied verbatim; review marker |
| Datenschutz | `/datenschutz` | `src/content/legal/datenschutz.md` | Copied; hosting section and form/Supabase/Resend sections adapted (see 4) |
| Reparaturleistungen (8 services: duration, warranty, description) | `/services` | New page `/leistungen/`, data `src/_data/leistungen.json`, CMS "Inhalte → Reparaturleistungen" | Copied verbatim |
| Repair durations | `/services` | Calculator (repair types in CMS) and homepage cards | Display 60 Min., Akku 30 Min., Kamera/Ladebuchse/Lautsprecher 45 Min., Wasserschaden 2–3 Std. |
| FAQ (7 questions with answers) | homepage (answers from bundle) | `src/_data/faq.json` | Copied, converted from "Du" to "Sie" (site tone); meaning unchanged |
| Franchise | `/franchise` | `src/_data/franchise.json` | Offers/requirements aligned to original wording ("Eigenkapital ab 25.000 €"); contact e-mail `potsdam@handy-chirurg.de` from original |
| Photos | `/assets/store-exterior…`, `store-interior-1/2…` (2000×1126) | `laden-dortustrasse` (1200 + 800 w), `laden-empfang`, `laden-theke` | Real shop photos; also fixes the social-image size warning |
| Service photos (display, battery, camera …), mascot, team/technician photos | `/services`, `/` | **Not used** | Visibly stock/AI-generated; contradict the art direction and could be mistaken for this shop |
| Old URLs | navigation | `netlify.toml` 301: `/services`, `/ablauf`, `/apple` … `/oneplus` | Done |

## 3. Price catalogue — numbers

| | Count |
|---|---|
| Manufacturers | **7** (Apple, Samsung, Huawei, Xiaomi, Google, Sony, OnePlus) |
| Models | **493** (Samsung 147, Apple 129 incl. iPads, Apple Watch, MacBooks; Xiaomi 92, Huawei 49, Sony 31, OnePlus 25, Google 20) |
| Repair types with prices | **12** (Display, Akkuwechsel, Backcover, Ladebuchse, Hauptkamera, Frontkamera, Lautsprecher, WiFi & Bluetooth, Wasserschaden, Fehleranalyse, Panzerglas, Zubehör) + Platine (no prices) |
| Price rows on the new site | **5 882** = 5 423 repair rows + 285 "Display – Originalqualität" rows + 174 accessory rows |
| Rows with a fixed price | **3 038** |
| Rows "auf Anfrage" | **2 844** (2 801 marked -1 in the source = the old site's own "auf Anfrage" + 43 below) |
| Reconciliation | All 5 882 rows compared with the snapshot by script: **0 mismatches** |

Missing or ambiguous (not invented, shown as "auf Anfrage" or left out, listed here for the owner):
1. **43 × 0 €** — "Panzerglas" for MacBooks in the source. Shown as "auf Anfrage".
2. **"Premiumqualität"** exists for every display (493) but only with -1 → not shown as its own row. **"Originalqualität"** with -1 (208) likewise; with a real price (285) shown as an extra row.
3. **Panzerglas twice**: repair-type price (e.g. 25 €) and accessory "Panzerglas – Premium Displayschutz aus Panzerglas" (40/50 €) for 58 models. Both kept as in the source (the old calculator offered both); confirm.
4. **Fehleranalyse** is 25 € for 450 models and 35 € for 43 (MacBooks); the site text says "ab 25 €".
5. **Duration/warranty per row** in the database are the same default for all 5 423 rows ("30-60 Minuten", "12 Monate Garantie") — not used per row. Per-service durations come from `/services`.
6. **Warranty conflict**: `/services` says 12 months (water damage 6 months); FAQ says 5 years on original parts, 12 months on third-party parts; schema.org text says "5 Jahre Garantie auf Originalteile". Calculator shows **no** warranty until the owner confirms (CMS field "Garantie" per repair type); `/leistungen/` and FAQ show the original wording.
7. Database last changed **09.07.2026**; whether prices are still current must be confirmed by the owner.
8. VAT note: none on the old site.

## 4. Legal pages — what is copied, what is changed

**Impressum** — copied from the original: Malake Mansour, Dortustraße 23, 14467 Potsdam, Vertreten durch Malake Mansour, Telefon 0163 228 8224, E-Mail, USt-IdNr. DE368877064, Verbraucherstreitbeilegung statement. Not on the original (so not added): legal form, register entry. One review marker remains (launch blocker) asking the owner to confirm the data is current and complete.

**Datenschutz** — copied from the original: sections 1 (Datenschutz auf einen Blick), 3 (Pflichtinformationen incl. verantwortliche Stelle, rights, SSL, Werbe-E-Mails), 4 (Anfrage per E-Mail/Telefon, WhatsApp link incl. links), 5 (Bewerberdaten).
Changed because the facts differ for the new site (flagged, launch blocker until legal review):
- Hosting: original names Lovable Labs Inc. (USA) — the new site will not run there; new provider still open → marker.
- Removed: Kontaktformular, Supabase Edge Functions, Resend — the new site has no form.
- Added: no cookies/tracking statement, Google Maps "Route planen" link.

Contradictions found on the original (not resolved by us):
- Phone: Impressum and Datenschutz use 0163 228 8224; everywhere else the old site shows the landline **0331 29080953**. New site uses 0163 228 8224 (confirmed by Коля 26.10.).
- Process text on the old site speaks of "unsere beiden Filialen in Berlin" and payment "per Vorkasse (Stripe)" vs FAQ "vor Ort bar oder EC-/Kreditkarte". Not copied into the process; Send-in FAQ keeps the original Vorkasse wording.
- FAQ "1–2 Stunden" vs homepage "etwa 60 Minuten" — both are the owner's statements; homepage keeps 60 minutes.

## 5. Calculator and price pages

| Feature | Before Phase 3 | Now |
|---|---|---|
| Journey Hersteller → Modell → Reparatur → Preis | Yes (demo data) | Yes, 7 brands / 493 models, models grouped by device type (Smartphone, Tablet, Smartwatch, Laptop) |
| Search | Datalist | Datalist with all 493 models ("Galaxy S23" or "Samsung Galaxy S23") |
| Duration / warranty | — | Per repair type from CMS, shown only when filled |
| Quality tiers | — | "Display – Standardqualität" / "Display – Originalqualität" where the source has both prices |
| Enquiry action | Call / e-mail / WhatsApp | Same, plus explicit text when there is no fixed price |
| Empty states | Unknown search | + model without prices, + "Ihre Reparatur ist nicht dabei?", + catalogue load failure |
| Test prices | Labelled "Testwert" | Never in production; official-but-unconfirmed prices labelled "in Prüfung" |
| Loading | Catalogue inline in the homepage | Homepage HTML 25 KB; catalogue `/preise/katalog.json` (226 KB raw / 8 KB gzip) loads when the selector nears the viewport or is used |
| Price list | One page | `/preise/` (brand cards + model search across brands; `#akku` carries the type) and `/preise/<marke>/` (≈300 KB raw / 10 KB gzip; collapsible models, type filter, `#model` opens a model) |
| Keyboard / mobile | Native selects, radio group | Same; price list uses `<details>`; tested at 390 px and 1440 px |

## 6. CMS

- Same architecture (Decap, GitHub backend, local backend for development). Editable without code: manufacturers/models/repairs/prices (`Preise`), repair types incl. **Dauer** and **Garantie** (`Laden & Kontakt → Reparaturarten`), price status, services page (`Inhalte → Reparaturleistungen`), FAQ, franchise, legal texts.
- Validation before publication: CMS field formats; build-time catalogue validation (unknown repair type, duplicate model/URL, invalid price → build fails, live site unchanged).
- **Full workflow tested locally on the real catalogue** (decap-server + Eleventy dev server, headless Chromium): opened Samsung (147 models), Galaxy S23 → Akkuwechsel 119 → 129 €, *Veröffentlichen* → only that value changed in `src/content/prices/samsung.json` → rebuild → `/preise/samsung/` and `/preise/katalog.json` showed 129 €. Test change reverted.
- Observation: the Samsung entry took ~22 s to open and ~40 s to save in this environment (software rendering). On a normal laptop it will be faster, but if editors find it slow the price files can be split by series (e.g. Galaxy S, A, Tab) without code changes to the site.
- Not yet verified: real GitHub OAuth login on a Netlify preview (needs the Netlify site; see `docs/DEPLOY.md` B).

## 7. Verification results

| Command | Result |
|---|---|
| `npm run build` (preview) | OK — 18 files incl. 7 brand pages, `/leistungen/`, `/preise/katalog.json` |
| `npm test` | **all checks pass (117)**: 8 pages × 2 viewports (console errors, third-party requests, failed assets, overflow, logo), internal links, selector (catalogue load, models, prices, CTA, enquiry state, missing-repair hint, duration/warranty rule, search), price list (type names, `#akku`, no-match, `#model`, overview search, type carry-over), 3D start/fallback, reduced motion, opening state, production build guard (no test data, "in Prüfung" label, noindex/preview marker) |
| `npm run check` | **Exit 1 — 5 blockers, 2 warnings** (was 10 blockers, 4 warnings) |

Launch blockers:
1. Price list status `imported` → owner spot-checks and sets "Geprüft" in the CMS.
2. CMS repository is the shared work repository → client-owned repository needed.
3. Datenschutz: legal review of the adapted text.
4. Datenschutz: new hosting provider details.
5. Impressum: owner confirms the copied data is current and complete.

Warnings: WhatsApp number not set · public-holiday rule open.

Real-device testing has **not** been performed.

## 8. Next three actions
1. **Owner review (one call):** confirm prices are current (database from 09.07.2026), the warranty rule (12 months vs 5 years original parts), Panzerglas double price, phone number (mobile vs landline), Impressum data. Then set price status to "Geprüft".
2. **Netlify branch preview + GitHub OAuth** (`docs/DEPLOY.md` B), repeat the CMS edit → publish → rebuild test there; decide hosting and complete the Datenschutz hosting section.
3. **Real-device QA** on iPhone Safari and Android Chrome against the preview (3D, calculator, brand pages).
