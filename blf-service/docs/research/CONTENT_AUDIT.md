# Content Audit — BLF Service

Stage 01 · updated 2026-10-26 (all seven pages)

**Sources.** All seven pages of https://www.blfservice.de, saved unmodified:

| Page | File | HTTP | Bytes | SHA-256 |
|---|---|---|---|---|
| Galerie | `references/source-html/galerie.html` (supplied; identical to live) | 200 | — | `20649488…895b5` |
| Home | `references/source-html/pages-2026-10-26/home.html` | 200 | 19 218 | see `page-fetch-log.tsv` |
| Leistung | `…/leistungen-preise.html` | 200 | 23 308 | 〃 |
| Jobs | `…/jobs.html` | 200 | 18 185 | 〃 |
| Kontakt | `…/kontakt.html` | 200 | 21 740 | 〃 |
| Impressum | `…/impressum.html` | 200 | 17 769 | 〃 |
| Datenschutz | `…/datenschutz.html` | 200 | 37 484 | 〃 |
| Stylesheet | `references/source-css/27visu3806.min.css` | 200 | 110 506 | `5f712170…884ad` |

No page redirected. All pages share the same header, footer, title pattern
(`Baum-Land-Forst | Baumpflege | Seddiner See | <Page>`) and
`og:updated_time` 2025-09-25.

## How to read this audit

There are three levels of certainty, and they are not interchangeable:

| Label | Meaning | Usable in the new site? |
|---|---|---|
| **Verified fact** | Read directly from the site's source, e.g. an address or a page structure | Yes |
| **Site claim** | Something the site *says* about the company, quoted exactly. We have confirmed that the site says it, **not that it is true** | Only after client confirmation, ideally with evidence |
| **Unverified** | An inference of ours, or something we could not determine | No |

---

## 1. Verified facts

### Identity and contact

| Field | Value (exact) | Source |
|---|---|---|
| Name in Impressum | `Daniel Witte` / `Baumpflege` | Impressum |
| Trading name used on the site | `Baum-Land-Forst` | all titles, H1, alt texts |
| Address | `Am Seehügel 1c`, `14554 Seddiner See` | Impressum, footer |
| Phone | `0172/3841620` (footer, Kontakt); `01723841620` (Impressum, Datenschutz) | |
| E-mail | `info@blfservice.de` | footer, Kontakt, Impressum |
| Number labelled "Umsatzsteuer-ID" | `048/287/07014` | Impressum, see issue L1 |
| Editorially responsible | `Daniel Witte` | Impressum |
| Consumer dispute resolution | `Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.` | Impressum |
| Controller under GDPR | Daniel Witte, Baumpflege, address as above | Datenschutz |

### Navigation and pages

| Label (exact) | Link | H1 of the page |
|---|---|---|
| `Home` | `/` | `Willkommen bei Baum-Land-Forst` |
| `Leistung ` | `leistungen-preise` | `Willkommen bei Baum-Land-Forst` (H2 `Unsere Dienstleistungen`) |
| `Galerie` | `galerie` | `Galerie` |
| `jobs` | `jobs` | `Willkommen bei Baum-Land-Forst` (H2 `Jobs`) |
| `Kontakt` | `kontakt` | `Kontaktieren Sie uns` |
| footer `Impressum` | `impressum` | `Impressum` |
| footer `Datenschutz` | `datenschutz` | `Datenschutzerklärung` |

- Home, Leistung and Jobs share the same hero: H1 `Willkommen bei
  Baum-Land-Forst`, tagline `Ihre Experten für Baumfällung und Baumpflege`,
  button `Kontaktieren Sie uns` → `/kontakt`. The hero is a pale green block
  (`#e6f1eb`) with no image and no video.
- The menu is a burger menu at every screen width.

### Services: complete list on *Leistung* (H2 `Unsere Dienstleistungen`)

The site offers ten H3 services. Three sub-services appear under
Baumfällung as unstyled paragraphs.

| # | Service (exact H3) | Notes from the text |
|---|---|---|
| 1 | `Baumfällung` | single trees or larger areas; sub-items **Stubbenentfernung** and **Notfällung** |
| 2 | `Baumpflege` | Kronenpflege, Schnittarbeiten, Düngung, Totholzentfernung, Kroneneinkürzung, Lichtraumprofilschnitt, **Einbau einer Kronensicherung** |
| 3 | `Baumkontrolle` | inspections, risk identification, recommendations |
| 4 | `Baufeldberäumung` | removal of plants, trees, shrubs before construction |
| 5 | `Straßen-und Flächenreinigung` | street sweeping, footpaths, leaves and dirt, "Mit professionellen Reinigungsmaschinen" |
| 6 | `Winterdienst` | subtitle **`Gewerblich und Kommunen`**; snow clearing, de-icing |
| 7 | `Pflasterarbeiten` | new build and repair: paths, driveways, terraces |
| 8 | `Neuanpflanzung & Freistellen von Neuanpflanzung` | planning and planting, freeing young plantings |
| 9 | `Grünflächenpflege für Kommunen` | parks, verges, municipal green space: mowing, mulching, cutting |
| 10 | `Forstwirtschaftliche Pflege` | for forestry operations: thinning, freeing plantings, afforestation care |

**No prices appear anywhere**, even though the slug is
`leistungen-preise`.

**Where the service vocabularies disagree:**
- **Gallery only:** *Spielgeräteaufbau* and *Hangbefestigung* are gallery
  tabs but not services on *Leistung*. *Stubbenfräsen* exists on *Leistung*
  only as "Stubbenentfernung".
- **No photos:** Notfällung, Straßen- und Flächenreinigung, Neuanpflanzung,
  Grünflächenpflege, Forstwirtschaftliche Pflege.
- **Winterdienst audience:** *Leistung* says Winterdienst is for
  "Gewerblich und Kommunen", but two upload filenames say "Winterdienst für
  Privat".

### Jobs page: complete content

> Sind Sie auf der Suche nach einer abwechslungsreichen Tätigkeit im Bereich
> der Baum-Land-Forstwirtschaft? Dann sind Sie bei uns genau richtig! Wir
> sind ein etabliertes Unternehmen im Bereich Baumfällung, Grünflächenpflege
> und forstwirtschaftlicher Dienstleistungen. Wir suchen motivierte und
> engagierte Mitarbeiter, die unser Team verstärken.
>
> Wir bieten: abwechslungsreiche Tätigkeiten, feste Anstellung, moderne
> Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten und ein angenehmes
> Arbeitsklima.
>
> Interessiert? Dann rufen Sie uns gerne an oder senden uns Ihre
> Bewerbungsunterlagen.

That is the whole page. The page has:
- **no job titles**, requirements, location, hours, start date or salary;
- no application form;
- no contact person for applications;
- no image.

The five "Wir bieten" items are the only stated benefits.

### Kontakt page

- Intro text with phone and e-mail links. Embedded **Google Maps** iframe
  for "Am Seehügel 1C, 14554 Seddiner See".
- Form `Kontaktformular`, posting to `https://www.blfservice.de/formmail.php`:

| Field | Type | Required |
|---|---|---|
| `Name *` | text | yes |
| `Ihre Anrede` (Herr / Frau) | select | no |
| `Email *` | email | yes |
| `Telefonnummer *` | tel | yes |
| `Ihr-Anliegen` | textarea | no; the actual message is optional |
| Privacy checkbox: "Ich habe die Datenschutzerklärung zur Kenntnis genommen. Ich stimme zu, dass meine Angaben … dauerhaft gespeichert werden." | checkbox | yes |

  Hidden fields (verbatim): `recipients = info&hey@blfservice.de`,
  `good_url = https://www.blfservice.de/success.html`,
  `bad_url = FEHLERMEDLUNG.com.de.cz`,
  `subject = Neues Kontaktformular eingegangen!`. See issue T1.

### Datenschutz page: processors it names

| Section | Content |
|---|---|
| Hosting | "einem externen Dienstleister", **hoster not named**; says a processing agreement (AVV) exists |
| Cookies / consent | Consent Manager Provider, Jaohawi AB, Västerås (Sweden) |
| Server log files, Kontaktformular, Anfrage per E-Mail/Telefon/Telefax | standard sections |
| Google Web Fonts | "lokal installiert", no connection to Google |
| Google Maps | Google Ireland Ltd.; IP transfer to the USA |
| **Not mentioned** | the analytics script `analytics.platzhalterabcd.de`, and the Lottie file loaded from `uploads-ssl.webflow.com`. **Both load on all seven pages.** See issue L2 |

### Visual system as built (from the live CSS)

| Token | Value | Use |
|---|---|---|
| `--green` / `.hauptfarbe` | **`#023435`** (very dark teal), white text | header, menu, footer, the main brand colour |
| `.zweitfarbe` | `#e6f1eb` (pale green), black text | hero block |
| Accent green | `#3f8843` | `.farbe-der-headings`, `.highlights`, open menu |
| Scrollbar | `#007A41` | inline style only |
| Headings | **Bellota Text** 700 | `.heading-1`, `.heading-2` |
| Body | **Roboto** 400, line-height 1.5 | `.flie-text` |

The stylesheet is a generic agency template: 108 `@font-face` rules, gold
`#d4af37` buttons, unused classes such as `.essen-bild2`. Only the values
above are actually used. Whether they are the client's brand colours or just
the template's defaults is unverified.

### Technical findings

| Finding | Detail |
|---|---|
| Platform | Webflow export, self-hosted (`ILD_uploadTool/`, jQuery 3.5.1, `formmail.php`) |
| Site created | Webflow site ID → 2024-10-22; logo and all pages updated 2025-09-25 |
| Consent | consentmanager.net CMP on every page |
| Analytics | `analytics.platzhalterabcd.de` (Umami-style) on every page; "platzhalter" means "placeholder" |
| Canonical | `https://www.blfservice.de/<page>`; `og:url` on every page is `https://blfservice.de` (home) |
| Phone links | `tel:0172/3841620`: not international format |
| Meta description typo | Galerie: "Referenzbilder" → "Referenzbildern" |
| Image weight | 1280 px icons shown at 20 px; 1.4 MB og:image |
| Accessibility | icon alts `symbol`/`Symbol`; gallery alts identical per tab |

---

## 2. Site claims, quoted, not independently verified

None of these may be stated as fact in the new site until the client
confirms them, preferably with documents for the qualifications.

| Claim (exact quote) | Page |
|---|---|
| "Seit 2001 arbeite ich bereits in den Bereichen Baum-Land-Forst." | Home, Home meta description |
| "Regelmäßige Weiterbildungen und Zertifizierungen in den jeweiligen Fachgebieten" | Home |
| "Durch die Anschaffungen verschiedenster Technik bin ich flexibel und vielseitig einsatzbereit." | Home |
| "Mit jahrelanger Erfahrung und einem engagiertem Team …" | Home |
| "Wir sind tagtäglich für Sie im Einsatz!" | Home |
| "Unsere zertifizierten Baumkontrolleure …" | Leistung |
| "Unser Team besteht aus qualifizierten European Treeworkern …" | Leistung, *Warum uns wählen?* |
| "Bei, Sturmschäden oder anderen Notfällen sind wir rund um die Uhr für Sie da." [sic] (24/7 emergency service) | Leistung |
| "Unsere Fachleute nutzen modernste Techniken und Ausrüstungen" | Leistung |
| "Wir sind ein etabliertes Unternehmen …" | Jobs |
| "Wir bieten: … feste Anstellung, moderne Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten …" | Jobs |

Note the voice: Home is written in the **first person singular** ("Das bin
ich", "arbeite ich"); the other pages say "wir" and "unser Team".

## 3. Unverified (our inferences)

- That the man in GAL-03 is Daniel Witte. The Home page uses the image with
  alt `Daniel Witte`, but that only shows what the site says.
- The legal form. "Daniel Witte · Baumpflege" with no register entry is
  consistent with a sole proprietorship, but that is not confirmed.
- Team size, service area and customer types beyond what the services list
  says.
- Whether any photo shows a municipal, commercial or private job, or where
  and when it was taken. The photos carry no EXIF.
- Whether `#023435`, Bellota Text and Roboto are a deliberate brand or
  template defaults.

---

## 4. Issues found on the live site (for the client, not for us to fix)

| # | Issue | Why it matters |
|---|---|---|
| L1 | The Impressum field "Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz" shows `048/287/07014`. That is the format of a **Steuernummer**; a USt-IdNr. looks like `DE` + 9 digits | Legal accuracy of the Impressum |
| L2 | The analytics script and the Webflow-CDN Lottie load on every page but are **not disclosed** in the Datenschutzerklärung | GDPR disclosure gap |
| T1 | Contact form: recipient `info&hey@blfservice.de` is not a valid address, and `bad_url` is `FEHLERMEDLUNG.com.de.cz` | Inquiries may not be delivered. Not tested: we did not submit the form |
| T2 | The message field `Ihr-Anliegen` is optional while phone is required | Conversion and data minimisation |
| C1 | No job listings at all on *Jobs* | Recruitment is a primary goal of the redesign |
| C2 | `leistungen-preise` has no prices; the nav label is singular "Leistung " | Expectation mismatch |
