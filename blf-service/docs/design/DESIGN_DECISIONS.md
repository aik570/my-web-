# Design Decisions — BLF Service

Stage 03 · 2026-10-27

The decision log for art direction: what is approved, what is only
recommended, what is open, and what blocks implementation.

**Status keys**

| Key | Meaning |
|---|---|
| **APPROVED** | Decided by the project owner |
| **RECOMMENDED** | Our proposal, awaiting approval |
| **OPEN** | Undecided |
| **CLIENT** | Needs Daniel Witte (D-IDs in `docs/research/CLIENT_DECISIONS.md`) |

---

## 1. Approved UX decisions (project owner)

| ID | Decision | Date | Recorded in |
|---|---|---|---|
| — | Gallery classification: 10 photos moved to their tab folders; GAL-16 kept unclassified | 2026-10-26 | ASSET_INVENTORY, `classification-log.tsv` |
| — | Stage 02 UX architecture accepted (sitemap, journeys, page architecture, motion spec, client decision list) | 2026-10-27 | PROJECT_STATUS |
| **UX-01** | **Über uns is a section on Home** (`/#ueber-uns`), not a page; it uses verified information only | 2026-10-27 | SITEMAP §0, PAGE_ARCHITECTURE Home §5 |
| **UX-02** | **Hybrid Galerie:** scroll-driven on desktop, cards on mobile, reduced motion respected, performance and image quality before animation complexity; verified photos only; no fabricated sequences, histories, places or dates | 2026-10-27 | MOTION_SPEC, MOTION_DESIGN |
| **UX-03** | **Karriere is a dedicated page.** Initiativbewerbung until vacancies and conditions are confirmed; no invented titles, salaries, qualifications, benefits, hours or guarantees; privacy and security designed into any form or upload | 2026-10-27 | PAGE_ARCHITECTURE §5, USER_JOURNEYS §3 |

These approvals cover **structure and approach**. They do not approve any
company fact; every D-item still applies.

---

## 2. Recommended visual direction: **RECOMMENDED**

**Direction A "Revier"** (`ART_DIRECTION.md` §3):
- palette from the client's **logo** (green `#32642A`, lime `#8BBB23`,
  amber `#DD9E09`) and the **photographs' earth tones**;
- Newsreader + Hanken Grotesk;
- framed photography;
- the amber **Markierung** (forestry tree marking) as the one graphic
  device.

It scored 28/30 against B "Einsatz" (24) and C "Jahresring" (19), on
authenticity, memorability, usability, trust, recruitment appeal and
feasibility.

**Not approved.** It needs:
1. the project owner's approval (DQ-01);
2. the client's approval, because it moves the main colour from the
   site's teal `#023435` to the logo's green [D-20].

---

## 3. Unresolved design questions (internal)

| ID | Question | Recommendation | Status |
|---|---|---|---|
| DQ-01 | Approve Direction A for presentation to the client? | Yes | OPEN |
| DQ-02 | Keep the Winterdienst dark finale in the gallery (MOTION_DESIGN §3.5)? | Keep; drop if user testing finds it distracting | OPEN |
| DQ-03 | Home hero photo: GAL-01 (climber; worker not identifiable at this size) or GAL-13 (no people)? | GAL-13 until D-12 is answered, then GAL-01. The prominent use of any person photo waits for consent | OPEN |
| DQ-04 | Final fonts: confirm Newsreader + Hanken Grotesk after the German specimen and 360 px tests (VISUAL_REFERENCE_BRIEF §4) and licence review | Test first | OPEN |
| DQ-05 | Icon set: an open-source set (licence check) or custom-drawn to the 24 px / 1.5 px spec? | Open-source set, licence filed | OPEN |
| DQ-06 | Logo on dark grounds: its green ring has only 2.06:1 against `forest-950` | Paper plate behind the PNG now; a light variant only from a vector **with client authorisation** [D-11] | OPEN |
| DQ-07 | Social share image: today's og:image is a 1.4 MB crop of the GAL-16 photograph | Replace with a crop of **GAL-05** (1500 px wide, so a 1200×630 crop needs no upscaling), or a new wide photo [D-10]. 1200 px exceeds the 1125 px portraits, so they don't qualify | OPEN |
| DQ-08 | How much extra energy on Karriere (dark hero band, larger type) without a second brand? | As ART_DIRECTION §11; review in mockups | OPEN |
| DQ-09 | Long German words in headings: confirm the line-break estimate with real fonts | Test in Stage 04 mockups | OPEN |
| DQ-10 | Should the Home gallery teaser animate on desktop (staggered fade) or stay static? | Single staggered fade, played once | OPEN |

---

## 4. Client approvals still needed (design-relevant)

Full wording, fallbacks and German questions are in CLIENT_DECISIONS.

| D-ID | Topic | Why design needs it |
|---|---|---|
| **D-20** | Visual direction: colours and fonts (teal → logo green) | Approval of Direction A |
| **D-11** | Vector logo | Large logo uses, dark-ground variant |
| **D-10** | Full-resolution photos | Removes all size caps; enables a photo-led hero |
| **D-12** | Consent for identifiable people; licence plate (GAL-15) | Hero, Über uns and Karriere imagery |
| **D-14** | GAL-16 purpose | Baumkontrolle chapter; og:image source |
| **D-19** | Additional photos | 5 services without images; team; green season |
| **D-08** (a–j) | Confirmation of the site's claims | Über uns 5b/5d, Warum BLF, Notfall wording |
| **D-15** | Per-photo context | Richer captions; "Projekte" naming (D-26) |
| **D-01 / D-02 / D-03 / D-27** | Positions, conditions, application channel, applicant-data workflow | Karriere state II, Kurzbewerbung form, upload |
| **D-24** | Consent manager | Styling of the consent dialog |

---

## 5. Asset limitations

| Limitation | Evidence | Design consequence |
|---|---|---|
| All photos ≤ 1500 px on the long side | manifest | Framed layouts; size caps (MOTION_DESIGN §6); no full-bleed photography |
| GAL-02/03 are only 843–844 px wide | manifest | ≤ 281 CSS px on 3× phones, ≤ 421 at 2× |
| Only one landscape photo (GAL-05) | manifest | It opens chapter 04; it is the only og:image candidate without upscaling |
| The photo set is winter-heavy (≈ 1 % green pixels) | pixel analysis, ART_DIRECTION §1.3 | Earth palette, not "eco green"; green-season photos requested [D-19] |
| 5 services have no photos | ASSET_INVENTORY | Text-only service blocks designed to look intentional |
| Identifiable people (GAL-03) and a partly legible plate (GAL-15) | visual review | No prominent use without consent [D-12] |
| Logo only as a PNG; dark ring weak on dark grounds | logo file, contrast 2.06:1 | Paper plate on dark; no redraw without authorisation [D-11] |
| og:image is a GAL-16 crop, 1200×634, 1.4 MB | visual comparison, manifest | Replace (DQ-07) |
| Footer and contact icons are template assets (ICO-08 made in Photoshop in 2019) | XMP metadata, ASSET_INVENTORY | New icon set (DQ-05) |

---

## 6. Risks and dependencies

| # | Risk / dependency | Impact | Mitigation | Owner |
|---|---|---|---|---|
| R1 | **The contact form may not deliver**: recipient `info&hey@blfservice.de` [V] | Lost inquiries; the primary goal fails | **Flagged, not fixed in this stage.** The new form launches only after confirmed test delivery; phone and e-mail first until then | Client [D-04] |
| R2 | **Legal and privacy items open**: the USt-IdNr. format [D-05]; undisclosed analytics [D-06]; hoster unknown [D-07]; no applicant section in the Datenschutz [D-27]; consent manager [D-24] | Launch blocked; recruitment form blocked | Listed as launch gates (§7). No production changes in this stage | Client, legal review |
| R3 | Ma'Loa material missing | Benchmark comparison not possible | Checklist ready (VISUAL_REFERENCE_BRIEF §7) | Project owner |
| R4 | The client prefers the current teal | Direction A's palette changes | Direction C documented as the continuity option; Direction A's system also works with a teal ink | Client [D-20] |
| R5 | Font licences or German rendering problems | Type change late | Specimen and licence check before mockups (DQ-04) | Design |
| R6 | Gallery motion too heavy on low-end devices | Poor performance | The simplification order in MOTION_DESIGN §7; static fallback | Implementation |
| R7 | No new photography | The design stays capped at today's sizes | It still works framed; the photo requests are prioritised (VISUAL_REFERENCE_BRIEF §1.2) | Client [D-10, D-19] |
| R8 | Unconfirmed claims accidentally used in copy | Misleading content | R1 copy rule; claims gated by D-08 a–j | Copy stage |
| R9 | Scope creep in motion | Delays, regressions | UX-02: performance and image quality first; the cut order is defined | Project owner |

---

## 7. Must be resolved before implementation (Stage 04 gate)

| # | Item | Type |
|---|---|---|
| 1 | DQ-01 and **D-20**: the visual direction approved by the project owner **and** the client | design + client |
| 2 | DQ-04: fonts confirmed (specimens, licences) | design |
| 3 | DQ-03 / D-12: hero photo and consent status known | design + client |
| 4 | DQ-06 / D-11: logo usage on dark grounds settled | design + client |
| 5 | Ma'Loa comparison done, or explicitly waived by the project owner | project owner |

**Launch gates** (needed before go-live, not before mockups): D-04, D-05,
D-06, D-07, D-27 (for any application form), D-24, and the copy
confirmations D-01–D-03 and D-08.

---

## 8. Corrections made during Stage 03

Recorded so the changes to earlier documents are traceable.

| Where | Correction |
|---|---|
| CLIENT_DECISIONS D-08 | Added (h) "Durch die Anschaffungen verschiedenster Technik …", (i) "Mit jahrelanger Erfahrung und einem engagiertem Team …" and (j) "Wir sind tagtäglich für Sie im Einsatz!". These are listed as site claims in CONTENT_AUDIT §2 but were used as plain verified text in Stage 02's Über uns outline |
| CLIENT_DECISIONS | Added **D-27** (applicant-data workflow). The current Datenschutzerklärung has no applicant section [V] |
| MOTION_SPEC §6 | Fixed a size error: the Stage 02 mobile rule ("85 vw ≈ 957 px, within 1125 px") ignored the 843–844 px wide GAL-02/03, which would have been upscaled on 3× phones. They are now capped at 281 CSS px |
| PAGE_ARCHITECTURE | Über uns page → Home §5 (UX-01); Karriere rewritten for the Initiativbewerbung state and privacy requirements (UX-03); Galerie mobile → cards (UX-02); R2 now applies the narrow-photo cap site-wide |
