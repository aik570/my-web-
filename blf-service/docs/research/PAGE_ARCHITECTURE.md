# Page Architecture — BLF Service

Stage 02 · 2026-10-26, decisions recorded 2026-10-27 · labels: **[V]**
verified existing content · **[P]** proposal · **[D-xx]** needs client
decision (`CLIENT_DECISIONS.md`) · **[UX-0x]** approved UX decision
(SITEMAP §0)

Section-by-section outlines for the five main pages. Über uns is a Home
section (UX-01), so §4 is kept only as a pointer and section numbers stay
stable for cross-references. This is structure, not visual design: layouts
are described only as far as they affect content and behaviour. The visual
layer is in `docs/design/`.

## 0. Rules for every page

**R1 — Copy.**
- Every factual statement about the company comes from CONTENT_AUDIT §1
  [V] or from an answered D-item.
- Text marked [V] may be shortened or re-ordered for clarity, but no new
  facts may be added.
- "Site claims" (CONTENT_AUDIT §2) appear **only** after D-08 confirms them.
- German labels in quotes that are not marked [V] (e.g. "Wir stellen ein",
  "So bewerben Sie sich") are **proposed microcopy [P]**, not existing site
  text. Final wording comes in the copy stage.

**R2 — Images.**
- Only files in `public/assets/original/` (ASSET_INVENTORY).
- **No upscaling.** The rendered width × device pixel ratio must not exceed
  the file's native width. In practice, with today's ≤ 1500 px files:
  - a portrait photo (1125 px wide) fills at most ~560 CSS px sharply on a
    2× screen, or 1125 CSS px on a 1× screen;
  - full-bleed photo heroes on desktop are **not possible** until D-10
    brings full-resolution originals.
  - Layouts below are designed within that limit and can grow later.
  - On 3× phones the narrow photos **GAL-02 and GAL-03 (843–844 px wide)**
    must stay ≤ 281 CSS px wide, wherever they appear (gallery cards,
    service rows, teasers). The full cap table is in MOTION_SPEC §6.
- GAL-16 is not used until D-14. Photos with people are used prominently
  only after D-12.

**R3 — CTAs.**
- Customer pages: primary "Anfrage stellen" (form), secondary "Anrufen".
- Karriere: primary "Jetzt bewerben".
- On mobile, a slim **bottom action bar** holds the page's two CTAs (call +
  form, or call + apply). It hides while the user is in a form, so it never
  covers inputs.

**R4 — Accessibility.**
- One H1 per page; a logical heading order.
- Every photo gets a descriptive alt text, based on the visual review in
  ASSET_INVENTORY.
- Tap targets ≥ 44 px.
- Forms have visible labels (not just placeholders, as today [V]).

**R5 — Legal.** Footer with Impressum and Datenschutz on every page
(SITEMAP §5). Third-party embeds (Google Maps) load only after consent.

---

## 1. Home `/`

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Hero** | Say *what* and *where* in one look | H1 with the core services and the area: built from verified service names plus "Seddiner See" [V]; the wider area per D-13. Short subline from the verified tagline "Ihre Experten für Baumfällung und Baumpflege" [V]. Phone number visible | "Anfrage stellen"; secondary "0172 3841620" (call) | **GAL-13** (no people) by default; GAL-01 (climber, blue sky) once D-12 is answered (DQ-03 in `docs/design/DESIGN_DECISIONS.md`) |
| 2 | **Notfall strip** | Serve storm-damage callers immediately | "Sturmschaden?" + call button. Availability wording only per D-08 d / D-17 | Call | none |
| 3 | **Leistungen overview** | Route each audience to its service group | 4 group cards [P] (SITEMAP §2): group name, the verified service names inside it, a link to the anchor | Card → `/leistungen#…` | Baumarbeiten GAL-02 · Bau & Fläche GAL-06 · Winter & Reinigung GAL-14 · Grün & Forst: **no photo** → typographic card [D-19] |
| 4 | **Galerie teaser** | Show real work; lead into the gallery | 4–5 photos from different services, one line each naming the service | "Zur Galerie" | e.g. GAL-13, GAL-11, GAL-18, GAL-10, GAL-15 |
| 5 | **Über uns** `#ueber-uns` (UX-01) | Identity, way of working, team, qualifications: all verified only | Sub-blocks 5a–5e below. Blocks without verified content are **omitted, not filled** | "Kontakt aufnehmen"; secondary "Karriere" | see 5a–5e |
| 6 | **Karriere teaser** (UX-03) | Recruit: make hiring visible | **Always shown**, in one of two states. *Positions state* (after D-01): "Wir stellen ein" + up to 3 position titles. *Initiativ state* (default now): the verified sentence "Wir suchen motivierte und engagierte Mitarbeiter, die unser Team verstärken." [V] + invitation to an Initiativbewerbung. No job titles | "Zur Karriere-Seite" | GAL-09 or GAL-12 (machines; people small) [D-12] |
| 7 | **Kontakt band** | Last chance to convert | Phone, e-mail, address [V]; short form link | "Anfrage stellen" | none |

### Home §5 — Über uns section (UX-01)

| Block | Goal | Content | Assets | Shown when |
|---|---|---|---|---|
| **5a Wer wir sind** | A person and a story behind the name | The "Das bin ich" text [V], shortened if needed. The "Ich" or "Wir" voice per D-16. The "Seit 2001" and "Regelmäßige Weiterbildungen und Zertifizierungen" sentences only with D-08 a/e | GAL-03 (alt text on the site: "Daniel Witte") only with D-12; otherwise GAL-04 (no people) | always |
| **5b Wie wir arbeiten** | Values with substance | "Sicherheit an erster Stelle" [V], a value statement usable as is. These sentences are site **claims** (CONTENT_AUDIT §2), used only once confirmed: "Egal ob heißer Sommer-, nasser Herbst- oder kalter Wintertag: Wir sind tagtäglich für Sie im Einsatz!" [V, D-08 j] and "Durch die Anschaffungen verschiedenster Technik bin ich flexibel und vielseitig einsatzbereit." [V, D-08 h] | GAL-14 (winter, night) and GAL-13 (crown securing). They show the range the quote describes, **not a timeline** | always |
| **5c Team** | Faces for trust and recruiting | Team size, roles, photo **only with D-16 + D-12** | team photo [D-16] | only with D-16 |
| **5d Qualifikationen** | Evidence for municipal and commercial clients | Only claims confirmed in D-08 (e.g. European Treeworker, certified tree inspectors), ideally with the certificate | certificates if supplied and licensed | only with D-08 |
| **5e Technik** | Show capability | Machinery **visible** in the photos: aerial platform (GAL-04), mini excavators (GAL-06, 12), compact loader (GAL-07, 09), stump grinder (GAL-11), winter vehicles (GAL-14, 15). Brands and ownership are not stated | a compact strip of 3–4 of those photos | optional; drop if the page gets long |

**Length budget:** with only 5a + 5b + 5e the section is about 1.5 screen
heights on desktop and 3 on mobile. Each confirmed block adds about one.
The address and map stay on Kontakt and in the footer, not here.

**Desktop.** The hero is a split layout: text on one side, and the photo in
a column of at most ~40 % of the width, capped at the photo's 2× width:
562 CSS px for GAL-13, 584 for GAL-01 (R2). The service cards form a
2×2 or 4-up row.

**Mobile.**
- Hero: text first, then the photo below at full width. 375 CSS px × 3 DPR
  ≈ 1125 px, within native size.
- Cards stack. The gallery teaser becomes a horizontal swipe row with scroll
  snap. The bottom action bar shows "Anrufen | Anfrage".

---

## 2. Leistungen `/leistungen`

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Intro** | Orient: what's on this page | H1 "Leistungen". Intro built from the verified meta description: "Wir bieten Ihnen: Baumfällung, Baumpflege, Baumkontrolle, Winterdienst, Pflasterarbeiten, Neuanpflanzung, Grünflächenpflege und mehr." [V] | — | none |
| 2 | **Group jump nav** | Let people skip straight to their service | 4 group chips, sticky under the header while scrolling the page | Chip → anchor | none |
| 3–6 | **One section per group** | Each service: understand → see → request | For each service: name [V], a one-line summary [P, drawn from the verified text], the full verified description [V], and sub-services as a list (e.g. Baumpflege: Kronenpflege, Schnittarbeiten, Düngung, Totholzentfernung, Kroneneinkürzung, Lichtraumprofilschnitt, Kronensicherung [V]). Audiences only where the text names them (Winterdienst "Gewerblich und Kommunen" [V]; D-09) | "Diese Leistung anfragen" (form with the service preselected) | Baumfällung GAL-01–04 · Stubbenentfernung GAL-11, 12 ([P]: these Stubbenfräsen photos illustrate the verified sub-service) · Baumpflege/Kronensicherung GAL-13 · Baufeldberäumung GAL-05–09 · Pflasterarbeiten GAL-19 · Winterdienst GAL-14, 15 · all others: none [D-19] |
| 7 | **Weitere Arbeiten** (conditional) | Cover the gallery-only categories | Spielgeräteaufbau, Hangbefestigung: **only if D-09 confirms them as services** | as above | GAL-10 · GAL-17, 18 |
| 8 | **Warum BLF** | Reasons to choose | The three verified items: "Zertifizierte Fachkräfte" (needs D-08 b, since it names European Treeworker), "Sicherheit an erster Stelle" [V], "Kundenzufriedenheit" [V] | — | none |
| 9 | **Kontakt band** | Convert | As on Home | "Anfrage stellen" | none |

**Desktop.** Each service is a two-column block: text and a photo strip or
a small set of 1–3 images, each ≤ ~560 CSS px wide (R2). Services without
photos use a full-width text layout, so missing images don't leave empty
holes.

**Mobile.**
- Chips scroll horizontally. Each service shows its summary and CTA first,
  with the full description behind "Mehr lesen" (a disclosure, not a
  separate page).
- Photos form a swipe row. The bottom bar: "Anrufen | Anfrage".

---

## 3. Galerie `/galerie` (name: D-26)

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Intro** | Set expectations | H1 + one line based on the verified meta description ("…damit Sie sich selber von unseren Tätigkeiten ein Bild machen können." [V]) | — | none |
| 2 | **Chapter index** | Let people jump to a service | One chip per service chapter, in the sequence order of MOTION_SPEC §2 | chip → chapter | none |
| 3 | **Scroll-driven sequence** | Show the range and quality of the work | 18 photos in 8 service chapters, with pinned/sticky behaviour per MOTION_SPEC. Captions: service name [V] plus a description of **what is visible** (from the visual review). **No places, dates, clients or project stories** unless D-15 provides them | per chapter: "Ähnliche Arbeit anfragen" (form with the service preselected) | GAL-01–15, GAL-17–19 (GAL-16 only after D-14) |
| 4 | **Lightbox** | Look closer | Tap or click opens the photo at native size, never upscaled | — | same |
| 5 | **Abschluss CTA** | Convert after browsing | "Ihr Projekt besprechen" + call | "Anfrage stellen" | none |

**Hybrid (UX-02).**
- **Desktop:** a pinned stage with chapter text and images (MOTION_SPEC §3,
  MOTION_DESIGN).
- **Mobile:** no pinning. A straightforward, touch-friendly **card layout**
  grouped by service, with filter chips and the lightbox (MOTION_SPEC §6).
- **Reduced motion:** the static chapter layout (MOTION_SPEC §4) on every
  device.

---

## 4. Über uns: merged into Home (UX-01)

There is no separate page. The content blocks are in **Home §5** (5a–5e).
This heading is kept so section numbers stay stable for cross-references.

---

## 5. Karriere `/karriere` (label: D-23; dedicated page per UX-03)

The page has **two states**. Today only state I is possible.

| State | When | Section 2 shows |
|---|---|---|
| **I — Initiativbewerbung** (default) | until D-01/D-02 are answered | the Initiativbewerbung block. No position cards, no job titles, conditions, hours, salaries or guarantees |
| **II — Offene Stellen** | after D-01 (and D-02 for conditions) | position cards; the Initiativbewerbung block moves below them |

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Hero for candidates** | Speak to candidates, not customers | Built on the verified sentences "Wir suchen motivierte und engagierte Mitarbeiter, die unser Team verstärken." and "Sind Sie auf der Suche nach einer abwechslungsreichen Tätigkeit im Bereich der Baum-Land-Forstwirtschaft?" [V]. **Not** the customer hero used today | "Jetzt bewerben" (anchor to form) | GAL-02 or GAL-12 [D-12] |
| 2 | **State I: Initiativbewerbung** | Let people apply without a vacancy | Short explanation that applications without a specific opening are welcome. The candidate picks the **area of work** they are interested in. The list uses only verified service fields: Baumarbeiten (Baumfällung, Baumpflege, Baumkontrolle), Grün & Forst, Bau & Fläche, Winter & Reinigung, plus "Sonstiges". These are fields of work, **not job titles** | "Initiativ bewerben" | none |
| 2 | **State II: Offene Stellen** | Show what is actually open | One card per position: title, tasks, requirements, hours, location, start [D-01], linking to `/karriere/<stelle>` | "Bewerben" per card | none |
| 3 | **Was wir bieten** | Reasons to join, verified only | The five items the current site states: abwechslungsreiche Tätigkeiten, feste Anstellung, moderne Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten, angenehmes Arbeitsklima [V]. Shown as the client's own statements, with **D-02 confirmation before launch**. **Nothing added** | — | none |
| 4 | **Einblicke** | Show the real work environment | 3–5 photos of crews and machines | — | GAL-01, 07, 09, 14, 15 [D-12] |
| 5 | **So bewerben Sie sich** | Lower the barrier | Only what is confirmed. Default: "Melden Sie sich per Formular, Telefon oder E-Mail." Further steps (interview, trial day) only with D-03 | — | none |
| 6 | **Kurzbewerbung** | Convert on mobile | Form, see the field list and data-protection requirements below. **Goes live only with D-03 + D-27.** Until then this section shows the application channels: phone and e-mail [V] | "Bewerbung senden" (fallback: "Anrufen" / "E-Mail schreiben") | none |
| 7 | **Ansprechpartner** | A person, not a mailbox | Name, photo, phone, e-mail [D-03, D-12]. Fallback: the verified phone and e-mail | "Anrufen" | photo [D-12] |

**Position detail `/karriere/<stelle>`** (state II only): title, tasks,
requirements, conditions [D-02], the short form with this position
preselected, and the contact person.

### Kurzbewerbung: fields [P, D-03]

| Field | Required | Note |
|---|---|---|
| Name | yes | |
| Telefon **or** E-Mail | at least one | Many candidates prefer a call back [H] |
| Bereich / Stelle | yes | State I: area of work (see above); state II: position or "Initiativ" |
| Nachricht | no | Free text: experience, licences, availability, **in the candidate's own words** |
| Unterlagen | no | Upload, **only once the upload part of the workflow below is approved (D-27)**. Until then the form, if live, has no upload field |
| Datenschutz-Hinweis | acknowledgement | Links to the applicant section of the new Datenschutzerklärung |

**Deliberately not asked:** photo, date of birth, nationality, marital
status, gender/Anrede. They are not needed for a first contact, and asking
for them creates discrimination risks under the AGG and needless personal
data. This is a recommendation for legal review, not legal advice.

### Application data: privacy and security requirements [P, D-03, D-27]

These must be agreed and checked by whoever is responsible for data
protection **before** the form goes live. They are design requirements,
not a legal assessment.

| Area | Requirement |
|---|---|
| Transport | HTTPS only; no third-party form services without a processing agreement (AVV) |
| Spam protection | Honeypot and rate limiting. **No reCAPTCHA or similar third-party challenge** without consent and disclosure |
| Upload | Optional. PDF, JPG and PNG only, checked server-side by content, not file name. Size limit (e.g. ≤ 10 MB in total, to be set). Files renamed on receipt and stored **outside the public web root**, never reachable by URL. Malware scan if the host offers one |
| Delivery and storage | Either (a) a dedicated, access-restricted mailbox, or (b) protected storage with notification only (no attachments in the notification). The choice depends on D-03 and D-07. **Not** the general info mailbox if several people read it |
| Access | Only named persons responsible for hiring |
| Retention | A fixed deletion period after the process ends, set with legal review. Keeping applications longer (talent pool) only with separate, explicit consent |
| Transparency | An applicant section in the Datenschutzerklärung (purpose, legal basis, recipients, retention, rights), linked from the form |
| Confirmation | The on-screen confirmation names the next step from D-03. A confirmation e-mail, if any, **never contains the uploaded files** |
| Contact-form reuse | The application form must not reuse today's `formmail.php` setup, whose recipient is invalid [V, D-04] |

**Desktop:** the form sits beside "So bewerben Sie sich". **Mobile:** the
form is reachable within one screen-swipe from the hero via an anchor. The
bottom bar: "Anrufen | Bewerben". Inputs use the right keyboard
(`type=tel`, `type=email`).

---

## 6. Kontakt `/kontakt`

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Intro** | Reassure, explain options | The verified intro: "Haben Sie Fragen oder benötigen Sie ein unverbindliches Angebot? …" [V] | — | none |
| 2 | **Kontaktwege** | Choose the easiest channel | Three cards: phone `0172 3841620` (`tel:+491723841620`), e-mail `info@blfservice.de`, address [V]. WhatsApp only with D-17 | call / mail | ICO set to be redrawn in design (current icons are template assets) |
| 3 | **Anfrageformular** | Collect complete, actionable requests | Proposed fields [P, D-18]: Leistung (select, preselected when arriving from a service), Name\*, Telefon or E-Mail (at least one\*), Ort/PLZ of the job, Nachricht\*, Fotos (optional, e.g. of the tree), privacy consent\*. **Dropped:** Anrede (not needed). Privacy text **without** "dauerhaft gespeichert"; retention per the new Datenschutz [D-06/07] | "Anfrage senden" | none |
| 4 | **Standort** | Where | Map **behind consent** (click to load) instead of today's direct Google Maps iframe [V]; address text always visible | "Route planen" (external link) | map |
| 5 | **Danke** `/kontakt/danke` | Close the loop | "Danke, wir melden uns." **No response-time promise** unless the client gives one [D-18]. Phone for urgent cases | "Zurück zur Startseite" | none |

**Delivery is a launch gate.** The new form goes live only after a test
submission is confirmed received by the client [D-04]. Until then phone
and e-mail are the primary CTAs.

**Desktop:** the form and the contact cards sit side by side; the map is
full width below. **Mobile:** contact cards first (call is the fastest
channel), then the form. Each field has a visible label and inline errors
in German. The submit button stays visible above the keyboard.

---

## 7. Content gaps by page (summary)

| Page | Can be built with verified content now | Blocked or weakened without |
|---|---|---|
| Home | Hero, Leistungen overview, Galerie teaser, Über uns 5a/5b/5e, Karriere teaser (Initiativ state), Kontakt band | Karriere positions state (D-01), Über uns 5c Team (D-16), 5d Qualifikationen (D-08), owner photo (D-12), area (D-13) |
| Leistungen | All 10 services with text; 7 with photos | 5 services with no photos (D-19), final list (D-09) |
| Galerie | 18 photos in 8 chapters | Context captions (D-15), GAL-16 (D-14) |
| Karriere | State I: candidate hero, Initiativbewerbung via phone and e-mail, Einblicke | Positions (D-01), confirmation of the five offer items (D-02), **application form (D-03 + D-27)**, upload (D-27) |
| Kontakt | Channels, intro, map | **Form delivery (D-04)**, fields (D-18) |
