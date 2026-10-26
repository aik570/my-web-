# Page Architecture — BLF Service

Stage 02 · 2026-10-26 · labels: **[V]** verified existing content ·
**[P]** proposal · **[D-xx]** needs client decision (`CLIENT_DECISIONS.md`)

Section-by-section outlines for the six main pages. This is structure, not
visual design: layouts are described only as far as they affect content and
behaviour.

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
| 1 | **Hero** | Say *what* and *where* in one look | H1 with the core services and the area: built from verified service names plus "Seddiner See" [V]; the wider area per D-13. Short subline from the verified tagline "Ihre Experten für Baumfällung und Baumpflege" [V]. Phone number visible | "Anfrage stellen"; secondary "0172 3841620" (call) | GAL-01 (climber, blue sky; worker not identifiable). Alternative without people: GAL-13 |
| 2 | **Notfall strip** | Serve storm-damage callers immediately | "Sturmschaden?" + call button. Availability wording only per D-08 d / D-17 | Call | none |
| 3 | **Leistungen overview** | Route each audience to its service group | 4 group cards [P] (SITEMAP §2): group name, the verified service names inside it, a link to the anchor | Card → `/leistungen#…` | Baumarbeiten GAL-02 · Bau & Fläche GAL-06 · Winter & Reinigung GAL-14 · Grün & Forst: **no photo** → typographic card [D-19] |
| 4 | **Galerie teaser** | Show real work; lead into the gallery | 4–5 photos from different services, one line each naming the service | "Zur Galerie" | e.g. GAL-13, GAL-11, GAL-18, GAL-10, GAL-15 |
| 5 | **Über uns teaser** | Put a person and a story behind the name | Shortened "Das bin ich" text [V]. The "Seit 2001" sentence only with D-08 a | "Mehr über uns" | GAL-03 (owner photo per the site's alt text) only with D-12; otherwise GAL-04 |
| 6 | **Karriere teaser** | Recruit: make hiring visible | "Wir stellen ein" + up to 3 position titles [D-01]. **Shown only while positions exist**; otherwise hidden, not replaced | "Offene Stellen ansehen" | GAL-09 or GAL-12 (machines; people small) [D-12] |
| 7 | **Qualifikationen** | Trust for municipal and commercial clients | Only claims confirmed in D-08 (e.g. European Treeworker, certified tree inspectors). **Omitted entirely** if none are confirmed | — | Certificate logos only if supplied and licensed |
| 8 | **Kontakt band** | Last chance to convert | Phone, e-mail, address [V]; short form link | "Anfrage stellen" | none |

**Desktop.** The hero is a split layout: text on one side, and the photo in
a column of at most ~40 % of the width. At 1440 px that is ~576 CSS px,
sharp on 2× screens with GAL-01's 1169 px (R2). The service cards form a
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

**Desktop.** A pinned stage with chapter text and images (MOTION_SPEC §3).
**Mobile.** No pinning: per-chapter swipe rows or a vertical stack
(MOTION_SPEC §6).

---

## 4. Über uns `/ueber-uns`

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Intro** | Who is behind BLF | The "Das bin ich" text [V]: owner's voice, "ich" or "wir" per D-16. The "Seit 2001" and "Weiterbildungen und Zertifizierungen" sentences only with D-08 a/e | — | GAL-03 with D-12; otherwise none |
| 2 | **Wie wir arbeiten** | Values with substance | "Sicherheit an erster Stelle" [V]; "Egal ob heißer Sommer-, nasser Herbst- oder kalter Wintertag: Wir sind tagtäglich für Sie im Einsatz!" [V]; "Durch die Anschaffungen verschiedenster Technik…" (D-08 g wording) | — | GAL-14 (winter, at night) and GAL-04 (platform). These show the year-round work the quote describes; they are **not** a timeline |
| 3 | **Team** (conditional) | Faces for trust and recruiting | Team size, roles, photo: **only with D-16 / D-12**; otherwise omitted | "Karriere" | team photo [D-16] |
| 4 | **Qualifikationen** (conditional) | Evidence | Only D-08-confirmed items | — | certificates if supplied |
| 5 | **Technik** (conditional) | Show capability | Machinery seen in the photos: aerial platform (GAL-04), mini excavators (GAL-06, 12), compact loader (GAL-07, 09), stump grinder (GAL-11), winter vehicles (GAL-14, 15). These are **visible facts; brands and ownership are not stated** | — | those photos |
| 6 | **Standort & Einsatzgebiet** | Where | Address [V]; area per D-13; map (consent-gated) | "Kontakt aufnehmen" | map |

**Thin-page fallback:** see SITEMAP §4. If sections 3–5 stay empty, the
page is folded into a Home section.

**Desktop:** alternating text and image rows. **Mobile:** single column;
the map is a static preview with "Karte laden" (consent).

---

## 5. Karriere `/karriere` (label: D-23)

| # | Section | Goal | Content | Primary CTA | Assets |
|---|---|---|---|---|---|
| 1 | **Hero for candidates** | Speak to candidates, not customers | H1 inviting applications. Verified basis: "Wir suchen motivierte und engagierte Mitarbeiter, die unser Team verstärken." [V]. **Not** the customer hero used today | "Jetzt bewerben" (anchor to form) | GAL-02 or GAL-12 [D-12] |
| 2 | **Offene Stellen** | Show what is actually open | One card per position: title, tasks, requirements, hours, location, start [D-01], linking to `/karriere/<stelle>`. **Fallback without D-01:** no cards, only "Initiativbewerbung willkommen" | "Bewerben" per card | none |
| 3 | **Was wir bieten** | Reasons to join, verified only | The five verified items as a list: abwechslungsreiche Tätigkeiten, feste Anstellung, moderne Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten, angenehmes Arbeitsklima [V, D-02]. **Nothing added** | — | none |
| 4 | **Einblicke** | Show the real work environment | 3–5 photos of crews and machines | — | GAL-01, 07, 09, 14, 15 [D-12] |
| 5 | **So bewerben Sie sich** | Lower the barrier | 3 steps [P]: get in touch (form, phone or e-mail) → conversation → trial day or start. **Steps 2–3 need D-03 confirmation**; if unconfirmed, only "Melden Sie sich" with the channels | — | none |
| 6 | **Kurzbewerbung** | Convert on mobile | Form [P, D-03]: Name\*, Telefon\*, E-Mail, Stelle (select: positions + "Initiativ"), Nachricht, Lebenslauf (optional upload). Privacy note with the retention period [D-03] | "Bewerbung senden" | none |
| 7 | **Ansprechpartner** | A person, not a mailbox | Name, photo, phone, e-mail [D-03, D-12]; fallback: the verified phone and e-mail | "Anrufen" | photo [D-12] |

**Position detail `/karriere/<stelle>`** (only with D-01): title, tasks,
requirements, conditions [D-02], the short form with this position
preselected, and the contact person.

**Desktop:** the form sits beside the "So bewerben Sie sich" steps.
**Mobile:** the form is reachable within one screen-swipe from the hero via
an anchor. The bottom bar: "Anrufen | Bewerben". Inputs use the right
keyboard (`type=tel`, `type=email`).

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
| Home | Hero, Leistungen overview, Galerie teaser, Kontakt band | Karriere teaser (D-01), Qualifikationen (D-08), owner photo (D-12), area (D-13) |
| Leistungen | All 10 services with text; 7 with photos | 5 services with no photos (D-19), final list (D-09) |
| Galerie | 18 photos in 8 chapters | Context captions (D-15), GAL-16 (D-14) |
| Über uns | Intro, values, location | Team, qualifications, technology framing (D-16, D-08, D-12) |
| Karriere | General text, five offer items, Initiativ route | **Positions and application channel (D-01, D-03)** |
| Kontakt | Channels, intro, map | **Form delivery (D-04)**, fields (D-18) |
