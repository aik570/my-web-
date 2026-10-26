# Content Audit — BLF Service

Stage 01 · 2026-10-26

**Scope.** Everything below is taken from the one page supplied,
`references/source-html/galerie.html` (the *Galerie* page). The other pages
could not be read: the build environment cannot reach `www.blfservice.de`.
Anything not quoted from that file is marked **unverified** and must not be
used as fact.

## Verified facts

Quoted exactly from the HTML, including original spelling and spacing.

### Identity and contact (footer)

| Field | Value | Where |
|---|---|---|
| Company name used on site | `Baum-Land-Forst` | `<title>`, every gallery alt text |
| Short name / domain | `blfservice.de` (www and non-www both used) | canonical, og:url, e-mail |
| Address | `Am Seehügel 1c` / `14554 Seddiner See` | footer |
| Phone | `Telefon: 0172/3841620` (link `tel:0172/3841620`) | footer |
| E-mail | `E-mail: info@blfservice.de` | footer |
| Legal pages | `Impressum` → `/impressum`, `Datenschutz` → `/datenschutz` | footer |

The legal form, owner, register entry and VAT ID are not in the HTML (see
`MISSING_INFORMATION.md`).

### Navigation (header, all items)

| Label (exact) | Link | Note |
|---|---|---|
| `Home` | `/` | |
| `Leistung ` | `leistungen-preise` | Label is singular with a trailing space. The slug suggests prices are listed (unverified) |
| `Galerie` | `galerie` | current page |
| `jobs` | `jobs` | lowercase, unlike the other items |
| `Kontakt` | `kontakt` | |

Footer-only: `Impressum`, `Datenschutz`. The menu is a burger menu at every
breakpoint (`data-collapse="all"`) and slides in from the right.

### Galerie page content

- H1: `Galerie`
- Nine tabs, in this order: `Baumfällung`, `Baufeldberäumung`,
  `Spielgeräteaufbau`, `Stubbenfräsen`, `Baumpflege/ Kronensicherung`,
  `Winterdienst`, `Baumkontrolle`, `Hangbefestigung`, `Pflasterarbeiten`
- 19 photos in total (1–5 per tab). No captions, locations, dates or
  project descriptions.
- No call to action on the page (no inquiry link, no jobs link besides the
  menu).

### Meta and SEO

| Field | Value |
|---|---|
| `<title>` / og:title | `Baum-Land-Forst \| Baumpflege \| Seddiner See \| Galerie` |
| twitter:title | `Galerie` |
| meta description / og:description | `Hier finden Sie eine Vielfalt an Referenzbilder, damit Sie sich selber von unseren Tätigkeiten ein Bild machen können.` (*Referenzbilder* should be *Referenzbildern*) |
| keywords | `Baumkontrolle,Winterdienst,Neuanpflanzung,Pflasterarbeiten,Grünflächenpflege` |
| canonical | `https://www.blfservice.de/galerie` |
| og:url | `https://blfservice.de` (points to home, not to this page) |
| og:locale | `de_DE` |
| og:image | `https://www.blfservice.de/ILD_uploadTool/icons/9ff3c141fff45f951ad41f1893eec7f4.png` |
| og:updated_time | `2025-09-25T04:16:02+02:00` |
| `<html lang>` | `de` |

### Service vocabulary seen on this page

Seen in at least one place on the page, but only the tabs are presented as
services:

| Term | Source |
|---|---|
| Baumfällung, Baufeldberäumung, Spielgeräteaufbau, Stubbenfräsen, Baumpflege / Kronensicherung, Winterdienst, Baumkontrolle, Hangbefestigung, Pflasterarbeiten | gallery tabs |
| Baumpflege | `<title>` |
| Neuanpflanzung, Grünflächenpflege | meta keywords |
| Forstwirtschaftliche Pflege, Neuanpflanzung & Freistellen von Neuanpflanzung, Straßen- und Flächenreinigung, Grünflächenpflege für Kommunen, Winterdienst für Privat | image upload filenames only |

The project brief also names *landscaping* and *municipal services*. The
"…für Kommunen" and "…für Privat" filenames suggest separate private and
municipal offerings. This is **unverified** until the Leistungen page is
read.

### Technical findings

| Finding | Detail | Relevance |
|---|---|---|
| Platform | Webflow export (`data-wf-site="671728156b73774eeddb0b1b"`, `w-*` classes), self-hosted with jQuery 3.5.1 | Rebuild, not a migration |
| Site creation | Webflow site ID timestamp → 2024-10-22 | Current site is ~2 years old |
| Brand colour evidence | `#007A41` green (custom scrollbar) | Confirm against CSS / logo |
| Consent | consentmanager.net CMP (`cmp_cdid 9736762f314e8`) | Existing consent setup to keep or replace (DSGVO) |
| Analytics | `https://analytics.platzhalterabcd.de/script.js` (Umami-style, `data-website-id 44e48e67-…`) | **"platzhalter" means "placeholder"**: the domain may be a leftover. Ask who operates it |
| Phone link | `tel:0172/3841620` | Not in international format (`+49172…`). Unreliable on some devices |
| Image weight | 1280 px WebP icons shown at 20 px | Perf issue on current site, not ours to fix |
| Accessibility | Icon alt text `symbol`; logo alt `Logo`; gallery alts are identical per tab | To improve in the rebuild |
| Motion | Webflow interactions fade in single-image tabs on ≥ 992 px; Lottie burger icon | — |

## Pages not audited

Each must be captured before Stage 02. The quickest way is to save each
page as HTML, as was done for the gallery.

| Page | URL | What we need from it |
|---|---|---|
| Home | `/` | Positioning, hero message, service summary, any claims |
| Leistung / Preise | `/leistungen-preise` | Full service list, descriptions, **prices** |
| Jobs | `/jobs` | Open positions, requirements, benefits *as stated*, how to apply |
| Kontakt | `/kontakt` | Form fields, recipient, opening hours, map |
| Impressum | `/impressum` | Legal name, owner, register, VAT ID — required for the new site |
| Datenschutz | `/datenschutz` | Current processors (CMP, analytics, form, hosting) |
