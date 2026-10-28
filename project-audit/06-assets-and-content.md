# 06 — Assets and content

## A. Assets in the repository [V-code]

| Asset | Size / format | Source | Production-ready? |
|---|---|---|---|
| Logo (inline SVG paths `lg-sky`, `lg-pulse`, `lg-word`) | ~50 KB inline in `index.html` | Traced from the client's 828×462 JPEG | Usable. Tagline is set as live text because the traced version was illegible. **An original vector logo (AI/SVG/PDF) from the client would be better** |
| `img/laden-dortustrasse.jpg` / `.webp` | 732×612, 125 KB / 88 KB | Cropped from an iPhone screenshot of the live site | **No.** Low resolution, screenshot compression. Needs the original photo |
| `img/logo-handy-chirurg.png` | 431×274 | Earlier concept | **Unused**; can be removed during build |
| Fonts: Archivo, IBM Plex Mono | Google Fonts CDN | Open licence (OFL) | Licence OK; must be **self-hosted** (privacy) |
| three.js 0.160.0 | jsDelivr CDN | MIT | Must be **self-hosted** |
| 3D phone | Procedural code in `js/phone.js` | Built for this project | Yes. Generic phone, no brand marks |
| Pictograms (4 services) | Inline SVG | Built for this project | Yes |
| `references/` | Screenshots, logo JPEG, brief | Client | Reference only; do not deploy |

No videos, icon fonts or other media exist. [V-code]

## B. Assets seen on the live site [S]

| Asset | Assessment |
|---|---|
| Shop-front photo (Dortustraße) | Authentic. Request the original file |
| 2 workshop photos ("Warum Du…") | Appear to be stock photography. Must not be presented as this shop |
| Hero background (cracked phone, blurred) | Appears to be stock |
| Cartoon doctor mascot | Brand illustration of unknown origin. Confirm rights before reuse; currently not used |
| Logo | Same as provided |

## C. Business content — status

| Item | Value in concept | Source | Status |
|---|---|---|---|
| Business name | Handy Chirurg Potsdam | [S] | Confirmed |
| Address | Dortustraße 23, 14467 Potsdam | [S] site + WhatsApp profile | Confirmed |
| Phone | 0163 228 8224 (+49 163 2288224) | [B] Коля, 26.10. | Confirmed for the new site. **Live site shows 0331 29080953** — decide whether the landline is kept (Q1) |
| Email | potsdam@handy-chirurg.de | [S] | Confirmed |
| Domain | handychirurg.de | [B] | **Email uses handy-chirurg.de, WhatsApp profile links Handy-Chirurg.de** — which domain is canonical? (Q2) |
| Hours | Mo–Sa 10:00–18:30, So closed | [S] site + WhatsApp | Confirmed |
| Holidays | — | — | **Missing** (Q3) |
| Services | Display, Akku, Wasserschaden, Platine; Laptop, Tablet, PC, MacBook; Zubehör, Prepaidkarten | [B] + [S] WhatsApp | Water damage only in brief; confirm |
| Diagnosis | 25 €, credited on repair | [S] | Confirmed ("ab 25 €" on live site — is it fixed or "from"?) (Q6) |
| Express time | „in der Regel ca. 60 Minuten" | [S] | Confirmed as the shop's own claim; applies to which repairs? |
| Guarantee | On work and parts | [S] | **Duration missing** (Q8) |
| "Original-Ersatzteile" | Not used in concept | [S] | Needs confirmation before use (legal risk) (Q9) |
| "Zertifizierte Techniker" | Not used in concept | [S] | Certified by whom? (Q10) |
| Process steps 3–4 | Concept text written from brief | [B] | Live text not seen; "Filialen in Berlin" wording on live site (Q4) |
| Send-in service | Steps written from brief | [B] | Label generation, address, costs unknown (Q5) |
| Payment | Card, bank transfer, Stripe | [B] | Confirm in-store methods (cash? EC?) (Q11) |
| **Prices** | **None** | [B] "official price list exists" | **Missing — P0 blocker** (Q7) |
| Impressum | Owner Malake Mansour, USt-IdNr. DE368877064, VSBG opt-out | [B] | **Legal form, Impressum address, register data missing.** The concept's footer prints Dortustraße 23 as Impressum address — this is an **unconfirmed assumption** (Q12) |
| Datenschutz | — | [B] page exists on live site | Text not available; must be rewritten for the new stack anyway |
| Franchise content | 6 offers, 4 requirements, 25.000 € | [B] | Confirmed from brief; contact recipient unknown (Q16) |
| WhatsApp number | — | [S] business profile exists | Missing (Q1) |

## D. Client dependencies (what we need, by when)

| # | Item | Needed by | Blocks |
|---|---|---|---|
| D1 | Official price list (file) | Day 1 | Price selector, `/preise`, CMS schema |
| D2 | Answers to Q1–Q12 | Day 1 | Content, legal pages |
| D3 | Original photos (shop front, interior, workbench), original logo file | Day 2 | Image quality, OG image |
| D4 | Full Impressum data, current Datenschutz text | Day 2 | Legal pages (launch blocker) |
| D5 | Domain registrar / DNS access, current hosting access | Day 4 | Launch |
| D6 | Who gets CMS access (email for account) | Day 2 | CMS setup |
| D7 | List of all live URLs (or permission to crawl the live site) | Day 2 | Redirects / SEO preservation |
