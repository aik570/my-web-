# Redesign coverage matrix

Status 29.10.2026. Source of truth: the live site https://www.handychirurg.de (inspected 28. and 29.10.2026 in Chromium, desktop 1280 px and mobile 390 px, all routes from the site's router and every link/button found on them).

**Functional** = the original information and user journey are available on the new site. **Visual** = the section uses the new visual system (Archivo/Plex Mono, teal/red/charcoal, clinic language, 3D hero). Interaction test results for the new pages: `INTERACTION-QA-MATRIX.md`.

Legend: ✓ done · ◐ done with documented difference · ✗ not carried over (reason given) · n/a not applicable

## 1. Original routes

Discovered from the router in the site's JavaScript bundle (`/assets/index-BveUfKcQ.js`, unchanged on 28. and 29.10.) and from all links on the pages.

| Original URL | Status 29.10. | New URL | Redirect | Functional | Visual |
|---|---|---|---|---|---|
| `/` | 200 | `/` | — | ✓ | ✓ |
| `/services` | 200 | `/leistungen/` | 301 | ✓ | ✓ |
| `/ablauf` | 200 | `/#ablauf` (process section) | 301 | ✓ | ✓ |
| `/franchise` | 200 | `/franchise/` | served directly | ✓ | ✓ |
| `/impressum` | 200 | `/impressum/` | served directly | ✓ (review marker) | ✓ |
| `/datenschutz` | 200 | `/datenschutz/` | served directly | ◐ adapted to new hosting (review marker) | ✓ |
| `/apple`, `/samsung`, `/huawei`, `/xiaomi`, `/google`, `/sony`, `/oneplus` | 200 | `/preise/<marke>/` | 301 | ✓ | ✓ |
| `/marke/:brand` | 200 (same page as `/apple` …) | `/preise/<marke>/` | 301 (lower and capitalised) | ✓ | ✓ |
| `/modell/:brand/:model` (493 models) | 200 | `/preise/<marke>/<modell>/` | 301; all 493 old slugs reach a page (one differing old slug `galaxy-z-fold-8` mapped explicitly) | ✓ | ✓ |
| `/reparatur/:brand/:model?service=…` (target of "zum Reparaturangebot") | 200 | `/preise/<marke>/<modell>/` with repair preselected | 301, query kept | ✓ | ✓ |
| `*` (404) | 200 with "404 / Oops! Page not found / Return to Home" | `/404.html` (Netlify serves it with status 404) | — | ✓ | ✓ |
| `/admin`, `/auth`, `/csv-import` | not inspected | `/admin/` (Decap CMS) | — | n/a — staff tools of the old system, not public content | n/a |

No linked PDFs or other documents exist on the original site. External destinations: Google Maps (route), `tel:`, `mailto:`.

## 2. Global elements

| ID | Original element | New element | Functional | Visual | Difference |
|---|---|---|---|---|---|
| GLOBAL-TOPBAR-01 | Top bar: e-mail link | Footer contact + calculator/offer e-mail actions | ◐ | ✓ | No separate top bar; e-mail in footer and contact section |
| GLOBAL-TOPBAR-02 | Top bar: phone `0331 29080953` | Header call button + footer + call section: `0163 228 8224` | ◐ | ✓ | **Number differs** — decision pending (CLIENT-APPROVAL item 2) |
| NAV-01 | Logo → `/` | Logo → `/` | ✓ | ✓ | — |
| NAV-02…04 | Startseite, Reparaturleistungen, Franchise | Leistungen, Preise, Ablauf, Sprechzeiten, Fragen; Franchise in footer and home teaser | ◐ | ✓ | Nav ordered by customer task; Franchise moved to footer/home |
| NAV-05 | Second row: Apple … OnePlus (brand pages) | Header "Preise" → brand cards; footer "Preise nach Hersteller" (7 links) | ✓ | ✓ | — |
| NAV-06 | Mobile menu button | Mobile menu button (aria-expanded) + call button | ✓ | ✓ | — |
| NAV-07 | — | Opening-state chip ("Jetzt geöffnet / Geschlossen · ab …") | new | ✓ | Uses hours, Brandenburg holidays, closures |
| FOOTER-01 | Datenschutz, Impressum links | Footer: Seiten, Rechtliches, Kontakt, Sprechzeiten, Preise nach Hersteller | ✓ | ✓ | — |
| FOOTER-02 | "© 2024 Handy Chirurg. Ihr zuverlässiger Partner." | Logo + tagline "Ihr zuverlässiger Partner" | ✓ | ✓ | — |

## 3. Home `/`

| ID | Original section (purpose) | Content / assets | Interactive elements | New location | Functional | Visual | Notes |
|---|---|---|---|---|---|---|---|
| HOME-01 | Hero "Handy Chirurg Potsdam – Ihre Handy-Reparatur Experten" (positioning) | Text; technician hero image (stock) | — | Hero "Notaufnahme für Ihr Handy in Potsdam." + 3D phone story; intro logo heartbeat | ◐ | ✓ | Stock image replaced by 3D hero; same message (repair in Potsdam, fast, no data loss → "Schweigepflicht") |
| HOME-02 | Price calculator: Hersteller → Modell → Reparaturservice → "zum Reparaturangebot" | Data from database | 3 dropdowns, 1 button | `#preisrechner`: Hersteller, Modell, search, repair list with prices, enquiry actions, "Zum Reparaturangebot" → model page | ✓ | ✓ | Adds search over 493 models and prices directly in the selector |
| HOME-03 | 3 trust cards: Zertifizierte Techniker vor Ort, Express Reparatur möglich, Garantie auf Ersatzteile | Icons | — | Hero tags + charter | ◐ | ✓ | "Zertifizierte Techniker" **not used** (unverified; CLIENT-APPROVAL item 5) |
| HOME-04 | "Warum Du Dein Gerät zu Handy Chirurg bringen solltest" (9 benefits) | 9 texts; 2 photos (stock), mascot | — | Home: charter (4) + Befund block (diagnosis 25 €); full list of 9 on `/leistungen/` ("Warum Sie Ihr Gerät…") | ✓ | ✓ | Du → Sie; "einer unserer Filialen" not repeated (single shop; item 5); stock photos and mascot not used |
| HOME-05 | "So läuft Deine Reparatur ab" (4 steps) | Text | — | `#ablauf` with two tracks: Im Laden / Per Post (tabs) | ◐ | ✓ | "beiden Filialen in Berlin" not copied (item 5); send-in and payment kept |
| HOME-06 | "Unser Laden" (shop, address, phone, e-mail, hours) | Shop exterior photo | tel, mailto | `#laden`: original photo (1200 px), hours table, address, route link | ✓ | ✓ | — |
| HOME-07 | Franchise teaser "Du willst auch Teil von Handy Chirurg werden?" | Text | "Mehr erfahren" → `/franchise` | Franchise teaser → `/franchise/` | ✓ | ✓ | — |
| HOME-08 | FAQ (7 questions, accordion) | Text | 7 accordion buttons | `#faq`: 9 questions (7 original + "Termin?" + "Einschicken?") as `<details>` | ✓ | ✓ | Du → Sie |
| HOME-09 | "Handy kaputt? Wir helfen sofort!" (call to action) | — | tel, mailto | Call section with large number, e-mail | ✓ | ✓ | Number decision pending |
| HOME-10 | Contact form "Kontaktieren Sie uns" (Name, E-Mail, Mobilnummer, Nachricht, "Nachricht senden"; consent line) | — | 4 fields, submit | `#kontakt`: Name, Mobilnummer, Nachricht → **opens the visitor's e-mail program** with the message | ◐ | ✓ | Old form sent via Supabase/Resend (server). New site has no server; honest mailto fallback, no data stored. Server-side form = decision for Коля (question 1 below) |

## 4. Reparaturleistungen `/services` → `/leistungen/`

| ID | Original section | New | Functional | Visual | Notes |
|---|---|---|---|---|---|
| SERVICES-01 | Intro "Unsere Reparaturleistungen" | Page head | ✓ | ✓ | — |
| SERVICES-02 | 8 service cards (name, duration, warranty, description, photo) | 8 cards with Dauer/Garantie chips, description, link to prices (or phone for Home Button/Mikrofon) | ✓ | ✓ | Service photos (stock/AI) not used; warranty wording kept but conflicting (item 3) |
| SERVICES-03 | "Besuchen Sie uns in Potsdam" (address, phone, e-mail, hours, Route planen) | Same block + 2 original interior photos | ✓ | ✓ | — |
| SERVICES-04 | Process (4 steps) | Link via nav/footer to `/#ablauf` | ◐ | ✓ | Not repeated on this page |
| SERVICES-05 | — | "Warum Sie Ihr Gerät zu Handy Chirurg bringen sollten" (9 original benefits) | new placement | ✓ | From original home |

## 5. Brand pages `/apple` … → `/preise/<marke>/`

| ID | Original | New | Functional | Visual | Notes |
|---|---|---|---|---|---|
| BRAND-01 | Heading "<Marke> Reparatur", "Zurück zur Startseite" | Breadcrumb Preisliste / Marke, other-brand nav | ✓ | ✓ | — |
| BRAND-02 | Grid of model cards with product image and "ab <Preis>€" (shows "ab -1€" for unpriced models — bug) | Models grouped by device type, each expandable with full price table and "Reparaturangebot" link; search and repair-type filter | ✓ | ✓ | Product images (manufacturer renders/AI) not used; no "ab -1€" bug |
| BRAND-03 | Model list in brand menu (links to `/modell/…`) | Same models via brand page, footer, search | ✓ | ✓ | — |
| BRAND-04 | — | `/preise/` overview: brand cards + search across all 493 models | new | ✓ | — |

## 6. Model / offer pages `/modell/…`, `/reparatur/…` → `/preise/<marke>/<modell>/` (493)

| ID | Original | New | Functional | Visual | Notes |
|---|---|---|---|---|---|
| MODEL-01 | Breadcrumb Home / Marke / Modell, "Zurück zur Startseite" | Breadcrumb Preisliste / Marke | ✓ | ✓ | — |
| MODEL-02 | "Reparaturservice wählen" (11 services) | "1 Reparatur wählen": all repairs as options with price | ✓ | ✓ | — |
| MODEL-03 | "Qualitätsstufe wählen": Standard / Premium / Original | Display offered as "Standardqualität" and "Originalqualität" where a price exists | ◐ | ✓ | "Premiumqualität" exists only as "auf Anfrage" for every model → not shown (question 2 below) |
| MODEL-04 | "Empfohlenes Zubehör" (Schutzfolie, Handyhülle, Panzerglas; checkboxes) | "2 Zubehör dazu" checkboxes (58 models with accessories) | ✓ | ✓ | — |
| MODEL-05 | Reparaturpreis, Gesamtpreis (auf Anfrage if any part unpriced) | Summary card: Reparatur, Zubehör, Gesamtpreis (same rule); sticky total bar on phones | ✓ | ✓ | — |
| MODEL-06 | "30-60 Minuten", "12 Monate Garantie" (same default for every repair) | Duration per repair type from `/services`; warranty hidden until confirmed | ◐ | ✓ | Conflict documented (item 3) |
| MODEL-07 | "Besuchen Sie uns in Potsdam" + Route planen | Same block + links to process, brand, services | ✓ | ✓ | — |
| MODEL-08 | "Unsere Garantien": Original Teile, 12 Monate Garantie, Schneller Service, Kein Datenverlust | Not shown | ✗ | n/a | Contains the unconfirmed claims "Original Teile" / "12 Monate auf alle Reparaturen" (items 3, 5) |
| MODEL-09 | "Alle Services" list with prices | Merged into MODEL-02 (same list, selectable) | ✓ | ✓ | — |
| MODEL-10 | Process (4 steps) | Link "So läuft die Reparatur ab" → `/#ablauf` | ◐ | ✓ | — |
| MODEL-11 | "Häufige Probleme" heading (on `/reparatur/…`, empty in the data) | — | n/a | n/a | No content in the source (common_issues empty for all rows) |
| MODEL-12 | Product image per model | — | ✗ | n/a | Images from the old site's storage (manufacturer renders/AI); no usage rights confirmed |
| MODEL-13 | — | Enquiry actions: call, e-mail with the selected repair and accessories (WhatsApp once a number exists) | new | ✓ | — |

## 7. Franchise `/franchise` → `/franchise/`

| ID | Original | New | Functional | Visual | Notes |
|---|---|---|---|---|---|
| FRANCHISE-01 | Hero + "Jetzt Kontakt aufnehmen" (mailto) | Hero + button (mailto potsdam@handy-chirurg.de) | ✓ | ✓ | — |
| FRANCHISE-02 | "Unsere Stores – Modern & Einladend" (2 interior photos) | Same 2 photos | ✓ | ✓ | — |
| FRANCHISE-03 | "Ihre Vorteile als Franchise-Partner" (text + 6 points) | Concept text + "Was Sie bekommen" (6) | ✓ | ✓ | Original text restored (an earlier invented sentence removed) |
| FRANCHISE-04 | 4 tiles: Wachstumsmarkt, Starke Community, Know-how, Gebietsschutz | 4 highlights | ✓ | ✓ | — |
| FRANCHISE-05 | "Was wir von Ihnen erwarten" (4) | "Was Sie mitbringen" (4) | ✓ | ✓ | — |
| FRANCHISE-06 | "Interessiert? Kontaktieren Sie uns!" + e-mail, phone | Same text + e-mail and phone buttons | ✓ | ✓ | — |
| FRANCHISE-07 | Mascot image | — | ✗ | n/a | Mascot rights unknown; not part of the visual system |

## 8. Legal pages

| ID | Original | New | Functional | Visual | Notes |
|---|---|---|---|---|---|
| LEGAL-01 | Impressum (owner, address, representation, contact, USt-IdNr, VSBG) | `/impressum/`, copied | ✓ | ✓ | Review marker (item 4) |
| LEGAL-02 | Datenschutz sections 1–5 | `/datenschutz/`: 1, 3, 4 (E-Mail/Telefon, WhatsApp), 5 copied; 2 Hosting → Netlify; form/Supabase/Resend removed; Google Maps link added | ◐ | ✓ | Review markers (item 7) |

## 9. Summary

| | Count |
|---|---|
| Original routes | 21 router patterns in the bundle; 18 inspected with 18 URLs (all except the staff tools `/admin`, `/auth`, `/csv-import`) |
| Rows in sections 2–8 | 50 (46 original sections/elements + 4 new-only rows) |
| Functional ✓ | 30 |
| Functional ◐ (documented difference) | 12 |
| Not carried over ✗ | 3 (MODEL-08 unconfirmed guarantee claims, MODEL-12 product images, FRANCHISE-07 mascot) |
| n/a | 1 (MODEL-11 "Häufige Probleme": empty in the source data) |
| New on the redesign | 4 (NAV-07 opening state, BRAND-04 overview search, MODEL-13 enquiry actions, SERVICES-05 benefits placement) |
| Original photos reused | 3 (shop exterior, reception, counter) |
| Original photos not reused | 11 service/team/hero images (stock/AI), mascot, doctor figure, model product images |

### Questions for Коля (approval needed)
1. **Contact form:** keep the honest e-mail-program form, or a server form (e.g. Netlify Forms — needs the Netlify site and an addition to the privacy policy)?
2. **"Premiumqualität"** shown as "auf Anfrage" on every display like the old site, or keep it hidden?
3. **"Unsere Garantien" box** (Original Teile / 12 Monate auf alle Reparaturen) — only after the owner confirms the warranty (item 3).
4. **Product images per model:** none (current), or should the owner supply licensed photos?
