# Art Direction — BLF Service

Stage 03 · 2026-10-27 · status: **proposal for review. Nothing here is
client-approved.**

| Label | Meaning |
|---|---|
| **[E]** | Existing brand attribute, measured from the logo file or the live stylesheet |
| **[V]** | Verified fact about content or assets (Stage 01/02 research) |
| **[P]** | Proposed design decision |
| **[A]** | Assumption that needs review |
| **[D-xx]** | Unresolved client decision (`docs/research/CLIENT_DECISIONS.md`) |
| **[UX-0x]** | Approved UX decision (`docs/research/SITEMAP.md` §0) |

Companion documents:
- `DESIGN_TOKENS.md`: the values;
- `MOTION_DESIGN.md`: the gallery;
- `VISUAL_REFERENCE_BRIEF.md`: references still to collect;
- `DESIGN_DECISIONS.md`: the decision log, risks and blockers.

---

## 1. What we are working with (evidence)

### 1.1 The logo [E]

The file is `public/assets/original/brand/…_Logo_273806.png`: a 1966×1966
transparent PNG, uploaded 2025-09-25. **No vector version** exists [D-11].

**What it shows:**
- a circular badge with a stylised tree: dark trunk and branches, lime
  leaves, roots inside an inner ring;
- the words **"BAUM-LAND-FORST"** along the top arc and **"SERVICE"** at
  the bottom, in amber capitals.

**Colours,** measured from the opaque pixels:

| Role in the logo | HEX | Share of opaque pixels |
|---|---|---|
| Rings, trunk | **`#32642A`** (dark green) | ≈ 69 % |
| Leaves | **`#8BBB23`** (lime) | ≈ 16 % |
| Lettering | **`#DD9E09`** (amber) | ≈ 14 % |

**The logo is not changed, redrawn or replaced in any direction.** These
directions build a system *around* it.

### 1.2 The live stylesheet [E]

| Attribute | Value | Note |
|---|---|---|
| Main colour `--green` / `.hauptfarbe` | **`#023435`** (dark teal) | **Does not appear in the logo.** The logo was uploaded about a year after the site was created; the teal may be a template default that was never aligned [A] |
| Hero tint `.zweitfarbe` | `#e6f1eb` | |
| Accent | `#3f8843` | **Fails WCAG AA for normal text** on white: 4.36:1 |
| Scrollbar | `#007A41` | |
| Fonts | **Bellota Text** (headings), **Roboto** (body) | Self-hosted |

The template also self-hosts Barlow and Barlow Condensed, which no page
uses.

Per the brief, these are **existing attributes, not approved final
choices** [D-20].

### 1.3 The photographs [V], measured

Pixel analysis of the 18 usable gallery photos (GAL-16 excluded),
downsampled:

| Colour family | Share of pixels |
|---|---|
| Low-saturation earth, bark, soil, grey | **47 %** |
| Sky blue | 19 % |
| Warm earth / orange-red (soil hues and equipment) | 13 % |
| Ochre / yellow | 9 % |
| Very dark | 7 % |
| Very light | 3 % |
| **Green** | **≈ 1 %** |

**This is the most important finding for the art direction.** The real
photography is **not green**. Most photos were taken with the trees bare:
in winter or early spring, under blue or overcast skies, on bare soil.
Strongly saturated orange appears only on **equipment and safety gear**:
- municipal vehicles and ploughs (GAL-14, 15);
- the barrier (GAL-19);
- the stump grinder (GAL-11);
- clothing (GAL-01);
- the playground frame (GAL-10).

A "lush green eco" look would contradict the company's own pictures.

**Further constraints:**
- Every photo is ≤ 1500 px on its long side.
- 15 of 18 are about 3:4 portrait; GAL-02 and 03 are taller; GAL-05 is the
  only landscape photo.
- **No upscaling** anywhere (`docs/research/MOTION_SPEC.md` §5–6).

### 1.4 Market and audience [V/A]

| Area | What we know |
|---|---|
| Market | German, local: Seddiner See, Brandenburg [V] |
| Address | The site addresses customers formally with **"Sie"** [V] |
| Audiences | Private owners, commercial clients and developers, municipalities, forestry operations, emergency callers, job candidates [V from the site's wording; weights unknown, A] |
| Two goals | **Inquiries** and **recruitment** (Karriere, UX-03) |

---

## 2. Brand personality and intended perception [P]

| The site should feel | … and never feel |
|---|---|
| **Kompetent**: knows trees, works safely, uses proper machinery | showy, "agency-polished" in a way that hides the real work |
| **Bodenständig**: local, direct, honest; real photos, plain language | rustic-kitsch: wood textures, leaf clip art, hand-drawn trees |
| **Ruhig und präzise**: calm layouts, exact details, nothing shouting | generic "eco green", stock-photo forests |
| **Verlässlich**: works in every season, for municipalities as well as homeowners | anonymous corporate |
| **Respektvoll gegenüber dem Handwerk**: attractive to skilled workers | a construction or haulage company with a tree logo |

**Perception targets:**
- **Municipal client:** "a professional, reliable contractor".
- **Homeowner:** "these people know trees; I can call them".
- **Candidate:** "real work with real machines, by people who take it
  seriously".

---

## 3. Three visual directions

All three use the existing logo unchanged and only real BLF photographs.
They differ in concept, palette, type and graphic language.

### Direction A — "Revier" (recommended)

**Concept.** The site as the company's working ground (*Revier*: a forest
district and one's own patch). Editorial calm: a warm paper ground, deep
forest ink, generous margins, photographs framed like plates in a field
journal.

The graphic signature is the **Markierung**: the short painted stroke or
dot foresters spray on trees to mark them [P]. It is drawn in the
**logo's own amber** and used for wayfinding: the current page, chapter
markers, list marks. It ties the interface to forestry practice and to the
logo, without touching the logo itself.

| | |
|---|---|
| Palette | Paper `#F4F1E9`, forest ink `#1B2E1A`, logo green `#32642A`, logo lime `#8BBB23` (dark grounds only), logo amber `#DD9E09` (dark grounds only) and its dark variant `#8A5F04` for light grounds, bark neutrals (`DESIGN_TOKENS.md`) |
| Typography | Display: **Newsreader** (a serif with optical sizes; calm, literate, good German glyph coverage). Text and UI: **Hanken Grotesk** (a sober grotesk). Both open-source; licences to confirm before use [P] |
| Imagery | Framed, never full-bleed (resolution); each photo whole in its own aspect ratio; captions as short field notes |
| Graphic elements | Markierung strokes, hairline rules, chapter numerals |
| Strength | Uses the **logo's** colours and the **photos'** earth tones; calm, high-contrast, trustworthy for municipalities; works with 1125 px photos |
| Risk | Could read as "quiet" for recruitment. Mitigation: a more energetic Karriere layout within the same system (§11) |

### Direction B — "Einsatz"

**Concept.** The visual language of the job site and the vehicle fleet:
high-visibility orange, asphalt charcoal, condensed signage type, technical
labels and warning chevrons, like those on the barrier in GAL-19 and on
the ploughs in GAL-14/15. Bold, energetic and recruitment-first.

| | |
|---|---|
| Palette | Asphalt `#1D2120`, bone `#EDEBE5`, signal orange `#E8641C` (on dark, or as a background with dark text) with a dark variant `#9E3F0C` for text on light; steel greys; logo green only in the logo |
| Typography | **Barlow Condensed** (display, uppercase) + **Barlow** (text). Both already self-hosted in the current template library [E], though unused |
| Imagery | Tight crops (limited by resolution), hard edges, numbered data labels |
| Graphic elements | Diagonal hazard stripes, tabular labels, thick rules |
| Strength | Highly memorable; authentic to the equipment in the photos; strong pull for candidates |
| Risk | Reads as construction or haulage rather than tree care; **signal orange is not in the logo**, so two competing accents; condensed caps make long German compounds harder to read; less calm for municipal trust |

### Direction C — "Jahresring"

**Concept.** Continuity with today's site: the existing teal `#023435`,
mint `#E6F1EB` and Bellota Text, refined, with an organic graphic system of
tree-ring and contour lines.

| | |
|---|---|
| Palette | Teal `#023435` [E], mint `#E6F1EB` [E], a darkened green `#2E6B33` for text (replacing `#3F8843`, which fails AA [E]), logo amber `#DD9E09` on teal |
| Typography | **Bellota Text** [E] + **Roboto** [E] |
| Imagery | Rounded frames, ring-line overlays in empty areas, never over subjects |
| Graphic elements | Concentric ring lines, contour patterns |
| Strength | Lowest change for the client; familiar; easiest approval |
| Risk | The teal **conflicts with the logo's greens**; Bellota's rounded forms feel informal for municipal clients and are weak at small sizes; tree-ring motifs are a common cliché; least distinctive against the Ma'Loa benchmark |

### 3.1 Evaluation [P]

Scores from 1 (weak) to 5 (strong). Scoring is our judgement, made explicit
so it can be challenged.

| Criterion | A Revier | B Einsatz | C Jahresring |
|---|---|---|---|
| **Authenticity** (logo, photos, trade) | **5**: logo colours plus photo earth tones plus a forestry marking practice | 4: equipment orange is real, but not in the logo | 3: continuity, but the teal is not in the logo |
| **Memorability** | 4 | **5** | 2 |
| **Usability** (contrast, German text, clarity) | **5**: 12.8:1 body text; serif and grotesk handle long words | 3: condensed caps with long compounds | 3: Bellota at small sizes; accent green fails AA today |
| **Trust** (municipal and private) | **5** | 3 | 4 |
| **Recruitment appeal** | 4 (with §11) | **5** | 3 |
| **Feasibility** (≤ 1500 px photos, effort) | **5**: framed layouts suit the resolution | 4 | 4 |
| **Total** | **28** | 24 | 19 |

### 3.2 Recommendation: Direction A "Revier"

1. **Most authentic.** Its palette comes from the client's **logo** (green,
   lime, amber) and from the **real photographs** (earth, bark, sky), not
   from a template or a generic "eco" idea. The Markierung comes from
   actual forestry practice.
2. **Memorable without noise.** One recognisable device (the amber
   Markierung) and a confident editorial type pairing, instead of
   decoration.
3. **Most usable.** Body text at 12.8:1 contrast; a serif and grotesk
   pairing with good German glyph coverage; amber kept off light grounds,
   where it fails.
4. **Highest trust** for municipal and commercial clients, while staying
   warm for homeowners.
5. **Most feasible.** Framed photography in paper margins is the natural
   way to present 1125 px images at full quality. The direction does not
   need resolutions the client doesn't have.

**What this changes for the client [D-20]:** the site's main colour would
move from teal `#023435` to the logo's own green. That needs the client's
explicit approval. Until then this is a proposal.

**Ma'Loa limitation.** The Ma'Loa material is not in the repository, so
this comparison is against the qualities the brief names, not against
Ma'Loa itself. The checklist is in `VISUAL_REFERENCE_BRIEF.md` §7.

---

## 4. Proposed visual principles (Direction A) [P]

1. **Die Arbeit ist das Bild.** The real photographs carry the identity;
   graphic elements only organise them.
2. **Gerahmt statt gestreckt.** Photos are framed at their native quality,
   never stretched to fill.
3. **Ein Akzent, sparsam.** Amber marks *where you are* and *what matters
   next*, never decoration.
4. **Ruhe vor Effekt.** Calm layouts and motion; one idea per section.
5. **Klartext.** Plain German, "Sie", short sentences; facts only when
   verified.
6. **Für jede Jahreszeit.** The palette is warm and earthy, so wintry
   photos look intentional, not bleak.

---

## 5. Colour palette and semantic roles (Direction A) [P]

All contrast ratios were measured (WCAG 2.x formula). Token names are in
`DESIGN_TOKENS.md`.

| Token | HEX | Source | Role |
|---|---|---|---|
| `forest-950` | `#1B2E1A` | derived from the logo green | Primary text; dark sections; the mobile menu |
| `forest-700` | `#264D20` | derived | Primary button hover |
| `forest-600` | `#32642A` | **logo [E]** | Brand colour; primary buttons; links; success |
| `lime-400` | `#8BBB23` | **logo [E]** | Decorative highlights **on dark grounds only** |
| `harz-500` | `#DD9E09` | **logo [E]** | Markierung and primary button **on dark grounds only** |
| `harz-700` | `#8A5F04` | derived | Markierung and state marks **on light grounds** |
| `paper-50` | `#F4F1E9` | proposed | Page background |
| `paper-100` | `#E9E3D6` | proposed | Alternate sections, cards |
| `bark-600` | `#5F574D` | proposed (bark tones in the photos) | Secondary text |
| `bark-500` | `#7A7166` | proposed | Input borders, dividers that carry meaning |
| `mist-200` | `#C9C2B4` | proposed | Secondary text on dark |
| `error-700` | `#A3261C` | proposed | Errors (always with icon and text) |

**Measured pairs:**

| Foreground on background | Ratio | Use allowed |
|---|---|---|
| forest-950 on paper-50 | 12.81 | all text |
| forest-950 on paper-100 | 11.31 | all text |
| paper-50 on forest-950 | 12.81 | all text |
| forest-600 on paper-50 | 6.22 | text, links, UI |
| paper-50 on forest-600 (primary button) | 6.22 | button text |
| paper-50 on forest-700 (hover) | 8.59 | button text |
| bark-600 on paper-50 / paper-100 | 6.29 / 5.55 | secondary text |
| bark-500 on paper-50 / paper-100 | 4.25 / 3.75 | borders and UI only (≥ 3:1) |
| harz-700 on paper-50 / paper-100 | 5.00 / 4.42 | marks and UI; small text on paper-50 only |
| harz-500 on forest-950 | 6.18 | marks, text, button background |
| forest-950 on harz-500 (button on dark) | 6.18 | button text |
| lime-400 on forest-950 | 6.36 | decorative or text on dark |
| mist-200 on forest-950 | 8.17 | secondary text on dark |
| error-700 on paper-50 | 6.53 | error text |

**Forbidden pairs (measured failures):**

| Pair | Ratio |
|---|---|
| amber `#DD9E09` on paper | 2.07 |
| lime `#8BBB23` on paper | 2.02 |
| amber on forest-600 | 3.00, rounded up from just below |
| forest-600 on forest-950 | 2.06 |

**Consequence for the logo [A, D-11]:** the logo's dark green ring has only
2.06:1 against `forest-950`. **On dark grounds the PNG logo needs a paper
plate** behind it, or a light variant. A light variant may only be
produced from a vector file *with the client's authorisation*.

Directions B and C have measured palettes too; see `DESIGN_TOKENS.md` §9.

---

## 6. Typography (Direction A) [P]

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display, H1–H2 | **Newsreader** | 400–500; italic for rare emphasis | Optical size on; gives the editorial tone |
| H3–H4, text, UI, forms | **Hanken Grotesk** | 400 / 500 / 600 | Legible at small sizes; neutral next to the serif |
| Labels, chapter numbers, counters | Hanken Grotesk | 600, uppercase, letter-spacing +0.08 em | Figures tabular where available (to check) |

**Hierarchy** (fluid between 360 and 1440 px; exact values in tokens):

| Level | Desktop | Mobile | Line height |
|---|---|---|---|
| Display (hero H1) | 72 px | 40 px | 1.05 |
| H1 (page) | 56 | 34 | 1.1 |
| H2 | 40 | 28 | 1.15 |
| H3 | 26 | 22 | 1.25 |
| H4 | 20 | 19 | 1.3 |
| Body large | 19 | 18 | 1.55 |
| Body | 17 | 16 | 1.6 |
| Small / caption | 14 | 14 | 1.45 |
| Label | 13 | 12 | 1.3 |

**German-specific rules**
- `lang="de"` and automatic hyphenation for body text.
- Headings: **no automatic hyphenation**; instead, manual soft hyphens in
  known long words.
- **Test words:** Forstwirtschaftliche, Grünflächenpflege,
  Baufeldberäumung, Lichtraumprofilschnitt, Straßen- und
  Flächenreinigung.
- **Estimate [A]:** at about 0.5 em average glyph width, a 22-character
  word set at 28 px needs ≈ 308 px, which fits the 328–343 px mobile text
  width. Set at 40 px it does **not** fit, which is why mobile H1 sizes
  are capped and long service names are H2/H3 on mobile. **Verify with the
  real fonts.**
- Measure (line length): 60–70 characters.
- Phone numbers per DIN 5008 style: `0172 3841620`; figures tabular in
  contact blocks.

**Licensing and hosting.**
- Self-host all fonts; no font CDN. The current Datenschutz already states
  that fonts are "lokal installiert" [V].
- Confirm each licence before use [P].

---

## 7. Grid, spacing and layout (Direction A) [P]

| Range | Columns | Gutter | Outer margin |
|---|---|---|---|
| < 600 px | 4 | 16 px | 16 px |
| 600–1023 px | 8 | 20 px | 32 px |
| ≥ 1024 px | 12 | 24 px | clamp(32 px, 5 vw, 80 px) |

**Content widths**
- Text column ≈ 680 px (about 65 characters).
- Standard container 1280 px.
- Wide container 1440 px, for the gallery stage only.

**Spacing.** A 4-px base scale. Section padding is 96–160 px on desktop and
64–96 px on mobile. Generous space is the luxury here, not effects.

**Layout habits**
- Asymmetric two-column compositions: text on 5 columns, image on 6, one
  column of air.
- Photos sit on paper, not under the text.
- Alternate `paper-50` and `paper-100` sections.
- Use dark `forest-950` sections sparingly: the Karriere teaser, the
  Kontakt band and the gallery's Winterdienst finale (MOTION_DESIGN §4).

---

## 8. Image treatment, cropping and composition (all directions) [P]

**Hard rules** (from Stage 01/02 and the brief):
1. **Only verified BLF photographs** from the manifest. No stock, no AI
   imagery, no generative fill or extension.
2. **Never upscale.** CSS size × device pixel ratio ≤ native pixels. Caps
   per photo are in `docs/research/MOTION_SPEC.md` §5–6. GAL-02 and 03 are
   ≤ 281 CSS px wide on 3× phones.
3. **Crop only to reduce, and only if the cropped area still has enough
   pixels** for its display size. Default: show the whole photo in its own
   aspect ratio. **Never crop GAL-05** (the landscape photo) to portrait.
4. **GAL-16 is not used** until D-14. That includes the og:image, which is
   a crop of the same photograph (see DESIGN_DECISIONS §5).
5. **Identifiable people** (GAL-03 especially) never get prominent use
   (hero, large Über uns image, Karriere hero) without consent [D-12].
   GAL-15 shows a partly legible licence plate: use it small, or blurred
   **only with approval** [D-12].
6. **No chronology or same-project framing** in layout or captions
   (MOTION_SPEC M2/M3).

**Treatment**
- No filters, duotones or colour washes on photos; the authenticity is the
  point.
- Allowed: a mild, uniform exposure or white-balance correction on
  **derivatives only**, documented per file. Originals are never edited.
- **No text over photos** by default: the branches and skies are busy, and
  contrast can't be guaranteed. The rare exception is a calm sky area with
  a measured scrim and ≥ 4.5:1 contrast.

**Composition**
- Pair a large photo (≤ 562 CSS px wide) with a smaller detail (e.g.
  GAL-11 next to GAL-12).
- The landscape GAL-05 opens a chapter.
- The tall GAL-02 and 03 stand alone, with air beside them.

**Focal points** for any responsive cropping, from the visual review:

| Photo | Focal point |
|---|---|
| GAL-01 | Climber, upper centre-right |
| GAL-02 | Climber, upper third |
| GAL-04 | Platform and tree top, upper half |
| GAL-11 | Grinder head, upper right |
| GAL-13 | Rope junction, centre |
| GAL-14 | Plough and cab, lower left |
| GAL-17 | Mat and workers, upper half |
| GAL-19 | Paver grid and sign, centre |

**Captions** are short *Feldnotizen*: chapter number, service name [V], and
what is visible. No places, dates or clients [D-15].

**Where new photography would materially help** (detail in
VISUAL_REFERENCE_BRIEF §1):
- a wide, high-resolution hero (≥ 3000 px on the long side);
- team and Karriere photos, with consent;
- the 5 services that have no photos [D-19];
- summer and green-season work to balance the winter-heavy set;
- the full-resolution originals of all 18 photos [D-10].

---

## 9. Iconography and graphic elements (Direction A) [P]

**Icons**
- One consistent line set: 24 px grid, 1.5 px stroke, rounded joins.
  Taken from an open-source set (licence to confirm) or drawn to that spec.
- Needed: phone, mail, map pin, external link, arrow, chevron, menu,
  close, plus/minus (disclosure), filter, upload, check, alert.
- The current footer icons are template assets [V] and are replaced.

**Markierung**
- A short, slightly irregular painted stroke (≈ 24 × 6 px) or dot (8 px)
  in `harz-500` on dark, `harz-700` on light.
- Used for:
  - the current navigation item;
  - the active gallery chapter;
  - list marks in "Was wir bieten";
  - section index numbers.
- Never more than one per view, except list marks.

**Other elements**
- **Hairline rules** in `bark-500` at 1 px separate sections and form
  groups.
- **Chapter numerals** "01–08" in Newsreader for the gallery chapters.

**Not used:**
- leaf or tree illustrations;
- wood textures;
- the logo's tree as a pattern or watermark. The logo is the client's
  mark and is not repurposed.

---

## 10. Buttons, links, navigation and interface (Direction A) [P]

| Element | Spec |
|---|---|
| **Primary button** (light ground) | `forest-600` background, `paper-50` text, 48 px min height, 2 px radius, label in Hanken Grotesk 600. Hover `forest-700`; pressed: 1 px down. Focus: 2 px `forest-950` outline with 2 px offset |
| **Primary button** (dark ground) | `harz-500` background, `forest-950` text (6.18:1); focus 2 px `paper-50` outline |
| **Secondary button** | Transparent, 1.5 px `forest-950` border, `forest-950` text; hover: `paper-100` fill |
| **Call button** | Phone icon + `0172 3841620` with tabular figures; on mobile also in the header and the bottom bar |
| **Text links** | `forest-600`, underline 1 px with 3 px offset; hover underline 2 px. External links get an icon |
| **Header** | `paper-50`, 72 px tall (56 px when compact on scroll), hairline bottom border. Nav links `forest-950`; **current item: harz-700 Markierung** under the label plus `aria-current` |
| **Mobile menu** | Full-screen `forest-950`: links in Newsreader 32 px in `paper-50`; current item with a `harz-500` Markierung; large call button; Impressum and Datenschutz at the bottom (SITEMAP §5) |
| **Bottom action bar** (mobile) | `paper-50` with a top hairline; two equal buttons (call + form, or call + apply); hidden while a form field or the lightbox is focused (PAGE_ARCHITECTURE R3) |
| **Forms** | Visible labels above fields; 48 px inputs; `bark-500` border (≥ 3:1); focus border 2 px `forest-600`; errors in `error-700` with icon and text below the field, never colour alone; the required marker explained once at the top |
| **Chips** (Leistungen groups, gallery filters) | Pill shape, 40 px tall, `paper-100` background; selected: `forest-950` background with `paper-50` text |
| **Consent dialog** | In the site's style; **"Ablehnen" as easy and visible as "Akzeptieren"** (German consent practice) [P, D-24] |

---

## 11. Desktop, tablet and mobile principles [P]

| | Desktop (≥ 1024) | Tablet (600–1023) | Mobile (< 600) |
|---|---|---|---|
| Navigation | Visible links + call + Anfrage button | Burger + call | Burger + call; bottom action bar |
| Hero | Split: text 5–6 columns, photo ≤ 40 % width (GAL-13 ≤ 562 CSS px by default; GAL-01 ≤ 584 after D-12, DQ-03) | Stacked; photo ≤ 562 CSS px | Text first, then the photo within the caps |
| Galerie | Pinned scroll-driven stage (UX-02) | Card layout, 2 columns | Card layout, 1 column |
| Leistungen | Two-column service blocks | Single column; photo rows | Summary + CTA first; "Mehr lesen" disclosure |
| Über uns (Home section, UX-01) | 2-column blocks 5a–5e | Stacked | Stacked; Technik as a short row |
| Karriere | Same system, **more energy**: a `forest-950` hero band, larger type, Markierung list for "Was wir bieten", bold "Jetzt bewerben" | Same, stacked | Same; the form anchor within one swipe of the hero |
| Motion | Scroll-linked gallery; subtle UI transitions | Entry fades only | Entry fades only; none with reduced motion |

**Recruitment energy without a second brand.** Karriere uses the dark
ground, the amber primary button and larger type of the same system. That
gives a more active page without borrowing Direction B's orange.

---

## 12. Accessibility and contrast [P]

- **Target WCAG 2.2 AA** across the site. All text pairs in §5 are measured
  ≥ 4.5:1; UI and state indicators ≥ 3:1.
- **Amber and lime never carry meaning on light grounds** (≈ 2:1 there);
  on light, the darker `harz-700` is used.
- **Focus** is always visible (2 px outline, 2 px offset), never removed.
- **Touch targets** are ≥ 48 px (WCAG 2.2 asks for 24; the field context,
  with gloves and outdoors, justifies more [A]).
- **Text** can be resized to 200 % without loss; the layout reflows at
  320 px.
- **Information is never conveyed by colour alone:** errors, the current
  page and selected chips all have a shape or text cue as well.
- **Motion** respects `prefers-reduced-motion`; nothing is available only
  through motion (MOTION_SPEC §4).
- **Language:** `lang="de"`. Alt texts describe what is visible
  (ASSET_INVENTORY visual review).
- **Logo alt text** "Baum-Land-Forst Service": the logo's own words [V],
  not "Logo" as today.
