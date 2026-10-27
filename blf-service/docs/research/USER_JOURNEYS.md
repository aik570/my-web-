# User Journeys — BLF Service

Stage 02 · 2026-10-26, decisions recorded 2026-10-27

**Approved UX decisions** (SITEMAP §0): **UX-01** Über uns is a Home
section · **UX-02** hybrid Galerie (scroll-driven desktop, cards on
mobile) · **UX-03** dedicated Karriere page with an Initiativbewerbung
until vacancies are confirmed.

**Sources:** the seven saved pages (`references/source-html/`),
`CONTENT_AUDIT.md`, `ASSET_INVENTORY.md`. Client questions are referenced
by ID from `CLIENT_DECISIONS.md`.

**Labels used throughout**

| Label | Meaning |
|---|---|
| **[V]** Verified | How the current site actually behaves or what it says, from the saved source |
| **[P]** Proposal | Our UX recommendation for the new site |
| **[D-xx]** Client decision | Depends on an answer from Daniel Witte |
| **[H]** Hypothesis | An assumption about users. There is no analytics or user-research data; to be validated after launch |

German button and heading labels in quotes inside proposals (e.g. "Wir stellen ein") are **proposed microcopy [P]**, not text from the current site. Text from the current site is always marked [V].

---

## 1. Who arrives

The audiences below come from the site's **own wording** [V]. How much each
matters commercially is unknown [D-09].

| Audience | Evidence on the site [V] | Typical need [H] |
|---|---|---|
| Private property owners | Pflasterarbeiten for "Wege, Einfahrten, Terrassen"; Baumfällung "einen einzelnen Baum"; two upload filenames say `Winterdienst fr Privat` (umlaut stripped on upload) | One tree felled or pruned; stump removed; a driveway paved. Wants a price idea and a date |
| Commercial clients and developers | Winterdienst "Gewerblich"; Baufeldberäumung "Bevor die Bauarbeiten beginnen" | Site clearance on a schedule; a reliable winter contract |
| Municipalities | "Grünflächenpflege für Kommunen", Winterdienst "Kommunen", Straßenreinigung | Recurring maintenance; proof of qualification; formal offer |
| Forestry operations | "Für Forstbetriebe … Pflege von Waldflächen" | Thinning, afforestation care |
| Emergency callers | "Bei, Sturmschäden oder anderen Notfällen …" [sic] (24/7 claim unconfirmed, D-08 d) | A tree on the roof or road. Needs a phone number **now** |
| **Job candidates** | Jobs page: "Wir suchen motivierte und engagierte Mitarbeiter" | Is there a job for me, what does it pay, how do I apply quickly? [H] |

**Device assumption [H]:** both customers and candidates in this trade
often arrive on a phone, from a search or a recommendation. The
architecture is designed mobile-first. Confirm with analytics once D-06 is
resolved.

---

## 2. Customer journey: from discovering a service to submitting an inquiry

### 2.1 Today [V]

| Step | What happens on the current site | Friction |
|---|---|---|
| 1. Arrive (usually Home) | H1 "Willkommen bei Baum-Land-Forst", tagline "Ihre Experten für Baumfällung und Baumpflege", button "Kontaktieren Sie uns" | The H1 says "welcome", not what is offered or where. **No service area anywhere** [D-13] |
| 2. Find the service | The menu is a burger **on every screen size**, desktop included. The label is "Leistung " (singular) | Navigation is hidden on desktop; the label undersells ten services |
| 3. Read about it | *Leistung*: 10 services as long paragraphs on one page; no anchors, no photos, no prices | Users can't jump to "their" service. Nothing **shows** the work. Three sub-services (Stubbenentfernung, Notfällung) are hidden inside Baumfällung |
| 4. Check credibility | Gallery is a separate page with 9 tabs, no captions | Proof (photos) is disconnected from the service text. **No CTA on the gallery page** |
| 5. Decide to contact | Hero button on Home/Leistung/Jobs goes to /kontakt | Same hero on three pages; no contextual CTA ("Baumfällung anfragen") |
| 6. Contact | Phone `tel:0172/3841620` (non-standard format); e-mail; form with Name\*, Anrede, Email\*, Telefonnummer\*, Ihr-Anliegen (optional!), privacy checkbox\* | Phone is mandatory while the message is optional. No service field, so the request arrives without context. The privacy text says data are stored "dauerhaft" |
| 7. After submitting | Form posts to `formmail.php`; recipient `info&hey@blfservice.de` | **Inquiries may never arrive** [D-04]. This is the single biggest conversion risk |

### 2.2 Proposed journey [P]

```
Search / referral
   │
   ▼
Home ── clear promise + service area + phone ──► (emergency) tap-to-call
   │
   ├─► Leistungen overview ─► service section (anchor) ─► "Diese Leistung anfragen"
   │                                │                          │
   │                                └─ photos of that service ─┘
   │
   ├─► Galerie (by service) ─► "Ähnliche Arbeit anfragen" ────┐
   │                                                          ▼
   └────────────────────────────────────────────────► Kontakt / inquiry form
                                                     (service preselected)
                                                              │
                                                              ▼
                                       Confirmation page: what happens next
```

| Step | Proposal | Depends on |
|---|---|---|
| Arrive | H1 states what and where, e.g. tree work and green-space services around Seddiner See. The wording uses only the verified service names. The phone number is visible in the header on every page | Area wording D-13 |
| Find | Visible desktop navigation; on mobile a burger plus a **persistent call button** | — |
| Read | Leistungen grouped into a few clear groups, each service with an anchor, a short summary, the verified description, and **its own photos** from the gallery | Grouping is a proposal; final list D-09 |
| Trust | Photos sit next to each service; the qualifications strip is shown **only if confirmed** | D-08, D-12 |
| Contact | Every service section ends with "Diese Leistung anfragen", which opens the form with the service preselected | — |
| Form | Short: name, phone **or** e-mail, service, location (town), message, optional photos | D-18 |
| After | Confirmation page restating what happens next; **no response-time promise** unless the client gives one | D-04, D-18 |

### 2.3 Emergency sub-journey [P]

A storm-damage caller should not need to scroll. The proposal is a
"Notfall?" link in the header and on Home that leads straight to
tap-to-call.

The label and promise depend on **D-08 d** and **D-17**:
- **Confirmed:** "Sturmschaden? Rund um die Uhr erreichbar" plus the number.
- **Not confirmed:** just "Sturmschaden? Rufen Sie an" plus the number, with
  no availability promise.

### 2.4 Friction points and conversion opportunities (customer)

| # | Friction [V] | Opportunity [P] | Priority |
|---|---|---|---|
| C1 | Form recipient invalid; delivery unknown | Fix delivery, test end to end, add a confirmation page | **Critical** [D-04] |
| C2 | Burger menu hides navigation on desktop | Visible nav ≥ 1024 px; CTA button "Anfrage" in the header | High |
| C3 | No service area | State the area in the hero and the footer | High [D-13] |
| C4 | Service text and photos are on different pages | Photos inside each service section; gallery filters link back | High |
| C5 | No contextual CTAs | "Diese Leistung anfragen" per service, with the form preselected | High |
| C6 | Message optional, phone mandatory, no service field | Require one contact method plus a message; add a service select | High [D-18] |
| C7 | `tel:` links not in international format | `tel:+491723841620` everywhere | Medium (verified number; format change only) |
| C8 | Same generic hero on 3 pages | A page-specific H1 and intro on every page | Medium |
| C9 | Services without photos look thinner | Text-only treatment that still looks intentional; ask for photos | Medium [D-19] |
| C10 | "Leistungen-Preise" promises prices that aren't there | Rename to Leistungen; decide on prices separately | Low [D-21] |

---

## 3. Candidate journey: from discovering Jobs to applying

### 3.1 Today [V]

| Step | What happens | Friction |
|---|---|---|
| 1. Arrive | Via the menu label "jobs" (lowercase, inside the burger) or directly | Not visible as a priority; a candidate on Home sees no hint of hiring |
| 2. Read | The page reuses the customer hero ("Ihre Experten für Baumfällung…", button "Kontaktieren Sie uns"), then one paragraph | **No job titles, no requirements, no location, no hours, no pay, no contact person** |
| 3. Evaluate | Benefits: five items in one sentence | Nothing to judge the job by; no photos of team or machines |
| 4. Apply | "rufen Sie uns gerne an oder senden uns Ihre Bewerbungsunterlagen" | No e-mail address on the page, no form, no "where to send". The hero button leads to the *customer* contact form |
| 5. After | — | No acknowledgement, no process description |

### 3.2 Proposed journey [P]

```
Home Karriere teaser ──────────┐   (always: Initiativ state now, positions after D-01)
Header nav "Karriere" ─────────┼─► Karriere page (UX-03)
Search "Baumpfleger Job …" ────┘     │
                                     ├─ State I (now): Initiativbewerbung, pick an area of work
                                     ├─ State II (after D-01): open positions ──► position detail
                                     ├─ Why work here (verified items only, D-02)  │
                                     └─ Apply ◄────────────────────────────────────┘
                                         now: phone / e-mail
                                         later: Kurzbewerbung form (D-03 + D-27)
                                                   │
                                                   ▼
                                Confirmation: who gets in touch (no time promise)
```

| Step | Proposal | Depends on |
|---|---|---|
| Discover | "Karriere" in the main nav; a Home teaser that is **always shown**: an Initiativbewerbung invitation now, position titles after D-01; a short line in the footer | D-01, D-23 |
| Understand | **Now:** the verified general text and a choice of *areas of work* taken from the verified services (not job titles). **After D-01:** one card per position (title, tasks, requirements, hours, location), each with its own page so it can be shared and found by search | D-01 |
| Evaluate | "Was wir bieten": the five verified items. Photos of real work (gallery images with people only after D-12). No invented perks | D-02, D-12 |
| Apply | **Now:** tap-to-call and e-mail. **Once D-03 + D-27 are settled:** a Kurzbewerbung form (name, phone or e-mail, area or position, message; upload optional and only with the D-27 upload workflow), completable on a phone in under 2 minutes [H]. No photo, birth date, nationality or marital status asked | D-03, D-27 |
| After | Confirmation page naming who will get in touch, from D-03 | D-03 |

**Default until D-01 is answered (UX-03):** the Karriere page is in its
Initiativbewerbung state. It shows the verified general text, the verified
"Wir bieten" items (confirmation requested, D-02), and the application
channels phone + e-mail. No position cards and no job titles. The Home
teaser invites Initiativbewerbungen instead of being hidden.

### 3.3 Friction points and conversion opportunities (candidate)

| # | Friction [V] | Opportunity [P] | Priority |
|---|---|---|---|
| K1 | No positions listed | Position cards from D-01 | **Critical** [D-01] |
| K2 | No clear application channel | Now: phone and e-mail stated clearly. Later: a short mobile form, no mandatory CV | **Critical** [D-03, D-27] |
| K3 | Customer hero and CTA reused on Jobs | Own hero for candidates, with the CTA "Jetzt bewerben" | High |
| K4 | Hiring not visible outside the Jobs page | Nav item, an always-on Home teaser (Initiativ or positions state) and a footer line | High [D-01] |
| K5 | No visual proof of the work environment | Real photos of crews and machines (GAL-01, 02, 07, 09, 12, 14, 15) | Medium [D-12] |
| K6 | Benefits buried in one sentence | Same five items as a scannable list; no additions | Medium [D-02] |
| K7 | No contact person | Name and photo of the person who answers | Medium [D-03, D-12] |
| K8 | Applicant data handling is undefined; the Datenschutz has no applicant section [V] | Applicant-data workflow and privacy section before any form goes live (PAGE_ARCHITECTURE §5) | **Critical** for the form [D-27] |

---

## 4. Cross-journey requirements [P]

- **Impressum and Datenschutz** are linked from the footer of every page
  and from the mobile menu (SITEMAP §5).
- **One phone number**, the verified `0172/3841620`, formatted the same way
  everywhere. The Impressum currently writes `01723841620`.
- **No claims without confirmation:** every sentence in the new copy that
  states a fact about the company must trace back to CONTENT_AUDIT §1
  (verified) or to an answered D-item.
- **Measuring success** needs analytics [D-06]. The proposed events are
  form submits per service, tap-to-call, application submits, and gallery
  → inquiry clicks. Set them up only after D-06 is decided and disclosed.
