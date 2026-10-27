# Visual Reference Brief — BLF Service

Stage 03 · 2026-10-27

This brief describes the references needed to **validate** the recommended
Direction A "Revier" (`ART_DIRECTION.md`).

**Status: no reference has been collected or reviewed yet.** This document
contains **no reference URLs** on purpose: none were researched, and none
are invented. Each section says what to look for, how to judge it, and who
supplies it. Fill in the "Collected" tables when references are gathered,
with the source, date and the reviewer's name.

Two kinds of material are kept apart:
- **Validation references:** other people's work, used to judge our
  direction. They are never used on the site.
- **Production material:** photos and assets of BLF itself, the only
  imagery allowed on the site.

---

## 1. Photography style

### 1.1 What to look for (validation references)

| Look for | Avoid |
|---|---|
| Documentary photos of arboricultural and forestry work: climbers, platforms, machines in real conditions | Staged stock: spotless PPE, posed smiles, generic "happy gardener" |
| Natural, slightly cool or neutral daylight; overcast and winter light shown as it is | Heavy HDR, teal-orange grading, vignettes |
| Framing with air around the subject (works for framed, non-full-bleed layouts) | Images that only work full-bleed at very high resolution |
| Safety shown as competence: helmets, harnesses, barriers | Risky-looking "action" shots |
| People seen at work, not posing | Close-up faces without context |

**Judging questions:** Does it look like BLF's own photos could sit beside
it without looking poorer? Does it show competence rather than drama?

### 1.2 New BLF photography that would materially improve the design (production)

All of these depend on client decisions. The resolution target is
**≥ 3000 px on the long side, delivered as originals** (camera or phone
files, not exports) [D-10].

| Priority | Subject | Where it improves the design | Depends on |
|---|---|---|---|
| 1 | **Full-resolution originals of the 18 existing photos** | Lifts every size cap; enables larger gallery frames and a photo-led hero | D-10 |
| 2 | **One wide establishing shot** (landscape, ≥ 3000 px): crew and machine in a landscape or forest setting, calm sky area | Home hero at desktop width; social share image (the current og:image is a GAL-16 crop) | D-10, D-12 |
| 3 | **Team at work, with consent**: 3–5 photos of the crew on a job | Karriere hero and "Einblicke"; Home Über uns 5c | D-12, D-16 |
| 4 | **Owner / contact-person portrait** at work, with consent | Über uns 5a; Karriere "Ansprechpartner" | D-12, D-03 |
| 5 | **The 5 services with no photos**: Notfällung (aftermath only, no danger staged), Straßen- und Flächenreinigung, Neuanpflanzung & Freistellen, Grünflächenpflege für Kommunen, Forstwirtschaftliche Pflege | Leistungen sections without images | D-19 |
| 6 | **Green-season work** (summer foliage) | Balances the winter-heavy set (≈ 1 % green pixels today); seasonal range | D-19 |
| 7 | **Equipment details**: grinder head, platform controls, chainsaw with PPE, vehicles (plates not legible or with approval) | Über uns 5e Technik; Karriere | D-12, D-19 |

**Rules for new photography**
- Real jobs only, no staged emergencies.
- Consent from everyone identifiable.
- No customer property identifiable without permission.
- Record place and date only if they may be published [D-15].

---

## 2. Landscape and forest imagery

**Purpose:** validate the *mood* of the palette (earth, bark, sky, winter
light), not to source images.

**Look for:** Brandenburg-type landscapes, pine and mixed forest, sandy
soils, open skies, seasons other than summer. These match what BLF's
photos actually show: sand embankments (GAL-17/18), pines (GAL-02, 13),
bare deciduous trees (GAL-01, 04, 07–09).

**Judge by:** whether `paper-50` / `forest-950` / `harz-500` feel native
next to these scenes.

**Avoid:** tropical green, misty "spiritual forest" clichés, drone shots
used as decoration.

| Collected (source, date, reviewer) | Notes |
|---|---|
| — none yet — | |

---

## 3. Professional equipment and team imagery

**Purpose:** benchmark how serious trades present people and machines
credibly, especially for **recruitment**.

**Look for:**
- the crew shown as a team;
- machines shown in use, at a human scale;
- PPE shown naturally;
- photo sets that work both small and medium-sized.

**Judge by:** would a skilled arborist or forestry worker recognise real
work, and want to be part of it?

**Avoid:** heavy-equipment "monster truck" aesthetics; people as
silhouettes only.

| Collected | Notes |
|---|---|
| — none yet — | |

---

## 4. Typography references

**Purpose:** test the proposed pairing (Newsreader + Hanken Grotesk) and
compare it with the alternatives (Barlow family for B; Bellota Text +
Roboto for C).

**Collect:**
1. Specimens of both proposed families set **in German with our real
   words**: Forstwirtschaftliche Pflege, Grünflächenpflege für Kommunen,
   Baufeldberäumung, Lichtraumprofilschnitt, Straßen- und
   Flächenreinigung, and Umlauts and ß in all weights.
2. A mobile test at 360 px: H1 34–40 px and H2 28 px with these words, to
   check the line-break estimate in ART_DIRECTION §6.
3. Editorial sites that pair a calm serif display face with a grotesk for
   UI, as references for hierarchy and spacing.
4. The licence text of each family, saved with the project before use.

| Collected | Notes |
|---|---|
| — none yet — | |

---

## 5. Web layout references

**Purpose:** validate the framed, editorial layout with generous margins,
and the inquiry and recruitment patterns.

**Look for:**
- service businesses that present a list of services clearly, with
  contextual inquiry buttons;
- **careers pages for trades** with a simple application route
  (including speculative applications);
- contact pages with tap-to-call first on mobile;
- consent dialogs where "Ablehnen" is as easy as "Akzeptieren".

**Judge by:**
- clarity in 5 seconds;
- the number of taps to call or apply;
- behaviour at 360 px;
- contrast.

| Collected | Notes |
|---|---|
| — none yet — | |

---

## 6. Motion references

**Purpose:** benchmark the gallery's quality (`MOTION_DESIGN.md`).

**Look for:**
- **pinned, scroll-driven photo sequences** where photos stay still long
  enough to be looked at, and transitions are scrubbed and reversible;
- **clip-path reveals** and restrained scale changes;
- **reduced-motion versions** of such experiences;
- mobile versions that switch to simple layouts instead of shrinking the
  desktop effect.

**Judge by:**
- Is it smooth on a mid-range phone and laptop?
- Can the user leave or skip it easily?
- Does the motion serve the image?

**Avoid:** scroll-jacking, inertia overrides, 3D effects, cursor trails.

| Collected | Notes |
|---|---|
| — none yet — | |

---

## 7. Ma'Loa comparison checklist

**The Ma'Loa reference material is not in this repository** (the project
owner is to supply it: MISSING_INFORMATION A5). **The comparison has not
been done.** Once the material is available, compare it with the BLF
direction on these points.

We compare **quality, not identity**: no Ma'Loa colours, imagery, food
motifs or brand language are to be adopted.

| # | Quality | Question for the comparison | BLF document to check | Result |
|---|---|---|---|---|
| 1 | Visual sophistication | Is BLF's overall finish at the same level? | ART_DIRECTION | pending |
| 2 | Art direction | Is there one clear idea, consistently applied, as Ma'Loa has? (BLF: Markierung, framed photography) | ART_DIRECTION §3–4 | pending |
| 3 | Image composition | Are photos composed and paired with the same care? (Note: BLF's photos are ≤ 1500 px, Ma'Loa's resolution unknown) | ART_DIRECTION §8 | pending |
| 4 | Interaction design | Are the interactions as considered, especially the gallery? | MOTION_DESIGN §3 | pending |
| 5 | Motion | Pacing (rest vs transition), easing, scrubbing, reversibility | MOTION_DESIGN §3, DESIGN_TOKENS §7 | pending |
| 6 | Typography and spacing | Type scale contrast, measure, vertical rhythm, margins | ART_DIRECTION §6–7, DESIGN_TOKENS §2–4 | pending |
| 7 | Responsive behaviour | Does mobile feel designed, not shrunk? | MOTION_DESIGN §4, ART_DIRECTION §11 | pending |
| 8 | Attention to detail | Focus states, empty and error states, loading placeholders, captions | ART_DIRECTION §10/12, MOTION_DESIGN §7–8 | pending |
| 9 | Performance | If measurable: Ma'Loa's LCP/CLS vs BLF budgets | MOTION_DESIGN §7 | pending |
| 10 | Accessibility | Reduced motion, contrast, keyboard use | ART_DIRECTION §12 | pending |

**Outcome.** List any quality gaps found, and the BLF document changes
they require, in DESIGN_DECISIONS.
