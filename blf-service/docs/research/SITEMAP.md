# Sitemap — BLF Service

Stage 02 · 2026-10-26, decisions recorded 2026-10-27 · labels: **[V]**
verified current state · **[P]** proposal · **[D-xx]** client decision
(`CLIENT_DECISIONS.md`) · **[UX-0x]** approved UX decision

## 0. Approved UX decisions (2026-10-27)

| ID | Decision | Effect on this sitemap |
|---|---|---|
| **UX-01** | **Über uns is a section on Home, not a separate page** | No `/ueber-uns`. The section has the anchor `/#ueber-uns`. Navigation and footer link to it |
| **UX-02** | **Galerie is a hybrid experience**: scroll-driven photography on desktop, a straightforward touch-friendly card layout on mobile, reduced motion respected, performance and image quality before animation complexity | `/galerie` stays one page; the behaviour is in MOTION_SPEC and `docs/design/MOTION_DESIGN.md` |
| **UX-03** | **Karriere stays a dedicated page.** Until vacancies and conditions are confirmed, it offers an **Initiativbewerbung** | `/karriere` is required. `/karriere/<stelle>` only after D-01 |

These decisions are approved by the project owner. They are not client
approvals of content: every D-item still applies.

## 1. Current site [V]

```
/                       Home
/leistungen-preise      "Leistung "      (10 services, no prices)
/galerie                Galerie          (9 tabs, 19 photos)
/jobs                   "jobs"           (one paragraph)
/kontakt                Kontakt          (form + map)
/impressum              footer only
/datenschutz            footer only
/success.html           form success target (hidden field good_url)
```

Navigation: a burger menu at **all** widths. Order: Home, Leistung,
Galerie, jobs, Kontakt. Legal links appear in the footer only.

## 2. Proposed structure [P]

```
/                               Home   (incl. section #ueber-uns, UX-01)
├── /leistungen                 Leistungen (overview, one section per service)
│     #baumfaellung #baumpflege #baumkontrolle #baufeldberaeumung
│     #strassen-und-flaechenreinigung #winterdienst #pflasterarbeiten
│     #neuanpflanzung #gruenflaechenpflege #forstwirtschaftliche-pflege
├── /galerie                    Galerie (scroll-driven, by service)   name: D-26
├── /karriere                   Karriere (Initiativbewerbung by default, UX-03)  label: D-23
│     └── /karriere/<stelle>    one page per open position            only with D-01
├── /kontakt                    Kontakt + inquiry form
│     └── /kontakt/danke        confirmation (noindex)
├── /impressum                  Impressum                             D-05
└── /datenschutz                Datenschutzerklärung                  D-06, D-07
```

**Not proposed now:** separate pages per service. Each service currently
has one paragraph of verified text [V]. Ten detail pages would be thin and
would invite invented filler. The anchored sections on `/leistungen` can be
split into detail pages later, once the client supplies per-service content
and photos [D-15, D-19].

### Service grouping on /leistungen [P, D-09]

The ten verified services, in four groups. **The group names are
proposals; the service names and texts are verified.**

| Group [P] | Services (verified names) | Photos available |
|---|---|---|
| Baumarbeiten | Baumfällung (incl. Stubbenentfernung, Notfällung) · Baumpflege (incl. Kronensicherung) · Baumkontrolle | GAL-01–04 · GAL-13 · GAL-11, 12 (Stubbenfräsen) · Baumkontrolle: none until D-14 |
| Grün & Forst | Neuanpflanzung & Freistellen · Grünflächenpflege für Kommunen · Forstwirtschaftliche Pflege | none [D-19] |
| Bau & Fläche | Baufeldberäumung · Pflasterarbeiten | GAL-05–09 · GAL-19 |
| Winter & Reinigung | Winterdienst · Straßen- und Flächenreinigung | GAL-14, 15 · none |

**Gallery-only categories.** *Spielgeräteaufbau* (GAL-10) and
*Hangbefestigung* (GAL-17, 18) appear only as gallery categories. They
become services only if the client confirms them [D-09].

## 3. URLs and redirects [P]

German, lowercase, umlauts transliterated, no file extensions.

| Old URL [V] | New URL [P] | How |
|---|---|---|
| `/` | `/` | — |
| `/leistungen-preise` | `/leistungen` | 301 |
| `/galerie` | `/galerie` | unchanged |
| `/jobs` | `/karriere` | 301 [D-23] |
| `/kontakt` | `/kontakt` | unchanged |
| `/success.html` | `/kontakt/danke` | 301 |
| `/impressum`, `/datenschutz` | unchanged | — |

Canonical host: `https://www.blfservice.de` [D-25]. The current pages
already use it in `<link rel="canonical">`.

## 4. Purpose of each page

| Page | Purpose | Primary audience | Primary CTA | Success signal |
|---|---|---|---|---|
| **Home** | Say in five seconds what BLF does and where, show real work, and route people to a service, the gallery, Karriere or a call | everyone | "Anfrage stellen"; secondary: call | Click into a service or contact; tap-to-call |
| **Leistungen** | Let each audience find *its* service quickly, see proof (photos), and ask for exactly that | customers | "Diese Leistung anfragen" (form with the service preselected) | Service-specific inquiry |
| **Galerie** | Show the range and quality of the work with real photos, organised by service. Hybrid per UX-02: scroll-driven on desktop, cards on mobile | customers, candidates | "Ähnliche Arbeit anfragen" → form with that service preselected | Gallery → inquiry clicks |
| **Home › Über uns** (section, UX-01) | Who is behind the business, how they work, which qualifications are confirmed. Builds trust for larger clients | municipal and commercial clients, candidates | "Kontakt aufnehmen"; secondary "Karriere" | Visits that continue to Kontakt or Karriere |
| **Karriere** | Turn interest into applications. Until D-01/D-02 are answered: an Initiativbewerbung with the verified general text only; afterwards positions and conditions | candidates | "Jetzt bewerben" | Applications |
| **Kontakt** | Make contact effortless: call, e-mail or form. Show where BLF is | customers | Submit the form; tap-to-call | Delivered inquiries [D-04] |
| **Impressum** | Legal provider identification | — | — | Correct and complete [D-05] |
| **Datenschutz** | Legal privacy information covering every processor actually used | — | — | Complete [D-06, D-07] |

**Gallery naming [D-26].** "Projekte" implies identifiable jobs with
context. Without per-photo context [D-15] the page stays **"Galerie"**,
because calling single undated photos "Projekte" would overstate what we
know. The briefing's working title "Projekte/Galerie" is kept open for that
reason.

**Über uns as a Home section (UX-01).** The only verified about content is
the Home "Das bin ich" paragraph [V], too little for a page of its own. A
Home section holds it without looking thin, and grows with D-16 (team),
D-08 (qualifications) and D-12 (photos). A separate page is reconsidered
only if new requirements justify it, e.g. substantial team and
qualification content.

## 5. Navigation [P]

### Header

| Width | Content |
|---|---|
| **≥ 1024 px** | Logo (→ Home) · Leistungen · Galerie · Über uns (→ `/#ueber-uns`) · Karriere · Kontakt · phone `0172 3841620` (tap/click to call) · button **Anfrage** |
| **< 1024 px** | Logo · call icon button · menu button. The menu opens full-screen: the 5 nav items, a large call button, e-mail, and at the bottom Impressum and Datenschutz |

- **Sticky header:** compact on scroll, so the call and Anfrage buttons
  stay reachable on long pages.
- **Karriere marker:** a small "Wir stellen ein" badge on the nav item,
  shown **only** while positions exist [D-01].
- **Current page:** marked visually and with `aria-current="page"`. "Über
  uns" is an anchor, so it is marked only while that Home section is in
  view.
- **Karriere stays in the main navigation** in both states (positions /
  Initiativbewerbung), because recruitment is a primary goal (UX-03).

### Footer (every page)

| Column | Content |
|---|---|
| Kontakt | `Am Seehügel 1c`, `14554 Seddiner See` · phone · e-mail [V] |
| Leistungen | links to the 4 groups (anchors) |
| Unternehmen | Über uns (→ `/#ueber-uns`) · Galerie · Karriere |
| Rechtliches | **Impressum · Datenschutz** · Cookie-Einstellungen (reopens the consent dialog) |

**Legal pages stay reachable from every page**, at most one tap away: in
the footer on all widths, and also in the mobile menu.

### Utility pages

- `/kontakt/danke`: no nav changes, `noindex`.
- A 404 page with the main nav and a call button.
