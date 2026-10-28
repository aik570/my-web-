# 02 — Page inventory

## A. Pages in this repository [V-code]

| # | URL | Name | Purpose | Target user | Status |
|---|---|---|---|---|---|
| P1 | `/` (`index.html`) | Homepage concept | Sell walk-in repairs; show services, process, hours, contact | Local customers with a broken device | Concept complete; content partly placeholder (see 06) |
| — | `/docs/redesign-konzept.html` | Internal concept doc | Planning | Team | Internal, not part of the site |
| — | `/docs/angebot.html` | Client offer | Sales | Client | Internal, not part of the site |
| — | `/docs/sales-kit.html` | Sales playbook | Sales | Team | Internal, not part of the site |

**Public pages/routes in repo: 1.** No nested, dynamic or localized routes exist. [V-code]

### P1 global elements [V-code]
- Intro overlay (logo animation), once per page load
- Fixed header: logo, 4 anchor links, opening-state chip (≥ 961 px), call button, menu toggle (≤ 760 px)
- Footer: logo, contact, hours, short Impressum, Datenschutz link

### P1 SEO metadata [V-code]
| Item | Value | Issue |
|---|---|---|
| `<title>` | Handy Chirurg Potsdam – Handyreparatur ohne Termin | OK (49 chars) |
| `meta description` | 152 chars, includes address and hours | OK |
| `og:image` | `img/laden-dortustrasse.jpg` | Relative URL; social crawlers need absolute |
| Canonical | — | Missing |
| H1 | „Notaufnahme für Ihr Handy." | No city/service keyword (old H1 had "Potsdam" and "Handy-Reparatur") |
| Structured data | `MobilePhoneStore` JSON-LD with address, phone, hours, vatID | Missing `url`, `geo`, absolute `image` |
| robots.txt / sitemap.xml | — | Missing |

### P1 responsive behaviour [V-browser]
Desktop: hero text left, 3D phone right. ≤ 760 px or portrait: text on top, phone rises from below; tags move to the right of parts; nav collapses. No overflow at 390 px.

## B. Pages on the live site (handychirurg.de) — NOT verified

Direct inspection was impossible (network policy). Sources: client screenshots [S] and brief [B].

| # | URL | Source | What is known |
|---|---|---|---|
| L1 | `/` | [S] | Homepage. Section order reconstructed below |
| L2 | `/franchise` | [B] | Franchise offer: business model, training, territory, marketing, parts, software; requirements incl. capital from 25.000 € |
| L3 | `/datenschutz` | [B] | Standard privacy policy (hosting, processing, rights). Text not seen |
| L4 | Impressum (URL **unknown**) | [B] | Owner Malake Mansour, USt-IdNr. DE368877064, VSBG opt-out |
| L? | Further routes | [U] | Unknown. A crawl or the live `sitemap.xml` is needed before launch |

**Estimate: at least 4 live routes** (cannot be verified; the live site is unreachable from this environment).

### L1 homepage — section order from screenshots [S]
Order reconstructed from the scroll-bar position in each screenshot. Sections after "Kontaktieren Sie uns" were not captured.

| # | Section | Content seen |
|---|---|---|
| L1-01 | Top bar | Mail icon, phone icon (no labels) |
| L1-02 | Header | Logo, hamburger menu (menu items not seen) |
| L1-03 | Hero | H1 „Handy Chirurg Potsdam – Ihre Handy-Reparatur Experten", intro text, background photo |
| L1-04 | Repair-quote selector | „Hersteller auswählen" (Apple, Samsung, etc.), „Modell auswählen" (iPhone X, etc.), „Reparaturservice auswählen" (Display, Akku, etc.), button „zum Reparaturangebot" |
| L1-05 | Trust cards ×3 | Zertifizierte Techniker vor Ort · Express Reparatur möglich · Garantie auf Ersatzteile |
| L1-06 | Why us | H2 „Warum Du Dein Gerät zu Handy Chirurg bringen solltest", 2 stock photos, 9 benefit cards |
| L1-07 | Process | H2 „So läuft Deine Reparatur ab", mascot illustration, Schritt 1 Geräteannahme, Schritt 2 Fehlerdiagnose (steps 3–4 per brief [B]) |
| L1-08 | Our shop | H2 „Unser Laden", shop-front photo, store text, address, phone, email, hours |
| L1-09 | Contact CTA | „Handy kaputt? Wir helfen sofort!", phone card, email card |
| L1-10 | „Kontaktieren Sie uns" | Heading only seen; content **unknown** (possibly a form) |
| L1-11 | Footer | Not seen |

## C. Proposed route map for the production site (for approval)

| Route | Keep/new | Reason |
|---|---|---|
| `/` | Keep | Main landing page |
| `/preise` | New | Price list from the client's official price sheet; supports the "transparent prices" promise |
| `/franchise` | **Keep URL** | Existing page; preserves links and rankings |
| `/impressum` (or the live path) | **Keep URL** | Legal requirement; match the live path if it differs |
| `/datenschutz` | **Keep URL** | Legal requirement |
| `/admin` | New | CMS entry point, not indexed |
| `404` | New | Graceful handling of old/unknown URLs |
| Service pages (`/display-reparatur` …) | Defer (P2) | SEO value, but not required for a six-day launch |
