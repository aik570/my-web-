# Missing Information & Client Questions — BLF Service

Stage 01 · 2026-10-26

Ordered by how much each item blocks the next stage. Nothing listed here
may be filled with invented content: no placeholder benefits, testimonials,
certifications, salaries, team sizes or project stories.

## A. Blocking — needed before design starts

| # | Missing | Why it matters | Who / how |
|---|---|---|---|
| A1 | **The 27 asset files** | Nothing retrieved: `www.blfservice.de` is blocked in the build environment | Us: run `scripts/fetch-originals.sh` on an unrestricted machine, or allow the domain in the environment's network settings |
| A2 | **Remaining pages** (Home, Leistungen-Preise, Jobs, Kontakt, Impressum, Datenschutz) | Content audit only covers the gallery | Us: save each page as HTML into `references/source-html/` |
| A3 | **Jobs content**: positions, requirements, conditions, application process | Recruitment is a primary objective; nothing is known yet | Client |
| A4 | **Full-resolution photographs** | Site files are ~1125 px web exports. Too small for full-bleed hero use without upscaling, which is not allowed | Client |
| A5 | **Logo as vector** (SVG/AI/PDF/EPS) and brand colours | Only a 1966 px PNG is referenced | Client / previous agency |
| A6 | **Ma'Loa reference material** (URL, screenshots or repo) | The brief names it as the quality benchmark, but nothing from it is in this repository | Project owner |

## B. Needed for content

| # | Missing | Note |
|---|---|---|
| B1 | Authoritative service list, grouped (private / municipal / commercial?) | Three different vocabularies exist (tabs, filenames, keywords), see CONTENT_AUDIT |
| B2 | Prices / price model | Implied by the `leistungen-preise` slug, unverified |
| B3 | Service area (towns, radius from Seddiner See) | — |
| B4 | Company facts: founding year, team size, legal form, owner | Only if the client supplies them |
| B5 | Equipment / machinery list | Strong visual and recruiting material, if it exists |
| B6 | Qualifications or certifications (e.g. FLL, ZTV, SKT, insurance) | List only what the client confirms in writing |
| B7 | Customer references / testimonials, with permission to publish | None exist on the site so far; none will be written for them |
| B8 | Per-photo facts: what is shown, rough location, year, private or municipal job | Needed to caption and correctly classify the gallery |
| B9 | Correct classification of the 11 conflicting gallery images | See `ASSET_INVENTORY.md` |

## C. Technical / legal

| # | Missing | Note |
|---|---|---|
| C1 | Impressum data (legal name, address, register, VAT ID, responsible person) | Mandatory (§ 5 DDG) |
| C2 | Analytics: who runs `analytics.platzhalterabcd.de`? Keep it? | The domain name means "placeholder" |
| C3 | Consent manager: keep consentmanager.net or replace? | Contract owner? |
| C4 | Where inquiry and application forms should deliver (e-mail, CRM, ATS) | — |
| C5 | Domain, DNS and hosting access; who deploys | — |
| C6 | Photo rights and consent of identifiable people (employees, clients, licence plates) | Needed before reuse in a more prominent design |
| C7 | Preferred canonical host (www or non-www) | Both are in use |

## Client questions (German, ready to send)

1. **Fotos:** Können Sie uns die Originalfotos in voller Auflösung (direkt
   von Kamera/Handy) zur Verfügung stellen? Gibt es weitere Fotos von
   Einsätzen, Team, Maschinen oder Fahrzeugen?
2. **Galerie-Zuordnung:** Bei einigen Galeriebildern passt der Dateiname
   nicht zur Kategorie (z. B. heißt das Bild unter „Baumkontrolle“
   „Neuanpflanzung & Freistellen“). Können Sie für jedes Bild kurz sagen,
   was zu sehen ist und zu welcher Leistung es gehört? Wir schicken dazu
   eine Übersicht.
3. **Logo:** Haben Sie das Logo als Vektordatei (SVG, AI, PDF oder EPS)
   und feste Firmenfarben?
4. **Leistungen:** Welche Leistungen bieten Sie aktuell an, und für wen
   (Privatkunden, Kommunen, Gewerbe/Bauträger)? Welche sind Ihnen am
   wichtigsten?
5. **Einsatzgebiet:** In welchen Orten bzw. in welchem Umkreis sind Sie
   tätig?
6. **Jobs:** Welche Stellen sind offen bzw. werden regelmäßig gesucht? Was
   bieten Sie Mitarbeitern konkret (nur was wir veröffentlichen dürfen)?
   Wie sollen Bewerbungen ankommen (E-Mail, Formular, Telefon/WhatsApp)?
7. **Nachweise:** Gibt es Qualifikationen, Zertifikate oder
   Mitgliedschaften, die wir nennen dürfen? Bitte nur mit Nachweis.
8. **Referenzen:** Gibt es Kunden oder Projekte, die namentlich genannt
   werden dürfen, und Kundenstimmen mit Freigabe?
9. **Firmendaten:** Gründungsjahr, Teamgröße, Rechtsform und Inhaber, falls
   Sie diese zeigen möchten.
10. **Technik:** Wer betreibt die Statistik unter
    „analytics.platzhalterabcd.de“, und wer hat Zugriff auf Domain und
    Hosting?
11. **Bildrechte:** Sind alle Personen auf den Fotos mit einer
    Veröffentlichung einverstanden?
