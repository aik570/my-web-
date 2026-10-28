# Concept D — Forest Monument × Living System

Stage 04D · 2026-10-27 · Status: **prototype for review, not approved**

D is one unified concept built from the strongest parts of the Stage 04B
directions:

- **From B:** the monumental dark atmosphere and type.
- **From A:** a living tree as the emotional centre.
- **From C:** the ring system as an interactive route to the real services.

Concepts A, B and C, and the Home baseline (`src/`), are unchanged.

| What | Where |
|---|---|
| Prototype | `concepts/d-monument-system/index.html`, `growth.js` (tree), `system.js` (scenes, intro, interaction) |
| Shared helper (unchanged) | `concepts/shared/concept.{js,css}` |
| Review boards | `concepts/review/D-*.jpg`, `concepts/review/comparison-B-C-D.jpg` |
| Review page | `concepts/index.html` |

Dependencies added: **none**. The prototype is plain HTML/CSS/JS with Canvas
2D and SVG, about 49 kB uncompressed for the three files.

---

## 1. Thesis and hierarchy

**One sentence.** The name stands like a monument, a tree grows out of the
light, its growth rings become the map of the company's work, and the core
opens onto real photographs.

| Layer | Role | How it is kept in its place |
|---|---|---|
| Dark ground (B) | Foundation and atmosphere | Proposed new shades, darker than forest-950 (see §8); only in the opening stage |
| Tree (A) | Emotional centre | Largest element in the hero (about half the width on desktop); every later scene is centred on its crown |
| Rings and contours (C) | Support, then navigation | Appear only after the tree has grown; carry the four service groups |
| Monumental type (B) | Scale and identity | Left column, never over the tree; fades to 10 % once the system takes over |
| Real photos | Proof | Enter through the tree's core; the closing frame is a real photograph |

## 2. Sequence

The scene order was refined from the brief:

- "Monument → Emergence → Growth" is the timed intro.
- "System → Interaction → Real work → Paper" is driven by scroll.
- The real work enters *through* the interaction, via the core window, rather
  than after it. This makes one continuous camera move instead of seven cuts.

### Intro, 2.8 s

The intro runs once per session. It can be skipped with the button, Esc, any
scroll, wheel or touch, or a navigation click. It never blocks clicks, and
contact stays visible from the first frame.

| Time | Scene | What happens |
|---|---|---|
| 0.05–1.1 s | Monument | Directional light sweeps from right to left across BAUM, LAND and FORST, one word after the other. The text is real HTML; the light is a moving gradient clipped to the text |
| 0.45–0.95 s | Emergence | A vertical slit of light opens where the trunk will stand (B's slit) |
| 0.75–2.45 s | Growth | The trunk and roots rise dark against the slit. The branches extend in sequence, then leaf groups unfold one after another, each only once its own twigs exist |
| 1.55–2.35 s | Light | The slit fades, and a narrow diagonal beam from the upper right finds the crown |
| 2.1–2.7 s | Copy | The label, the verified service sentence and "Leistungen entdecken" fade in |

Keyframes: `concepts/review/D-intro-keyframes.jpg` (0.3, 0.7, 1.1, 1.6, 2.1
and 2.8 s).

### Scroll, sticky stage of 560 vh (600 vh on small screens)

| Progress | Scene | What moves |
|---|---|---|
| 0.03–0.16 | Hand-over | The copy leaves and the words fade to 10 % |
| 0.05–0.22 | **System** | Tree and rings scale down around the crown and move to the stage centre. 12 growth rings draw outward: eccentric and slightly irregular, like a real cross-section, not a loader. 10 wider contour lines continue them into the landscape |
| 0.20–0.26 | Core | A circular window opens in the heart of the crown |
| 0.23–0.56 | **Interaction** | The services panel and the ring labels appear (see §3) |
| 0.55–0.68 | **Real work** | The core window grows into a 3:4 frame. The service photo hands over to GAL-13 (crown bracing) and the tree fades. Then come the verified Kronensicherung sentence and the label "Echte Arbeit · Baumpflege / Kronensicherung" |
| 0.76–0.90 | **Paper** | The dark ground gives way to paper-50. The copy dips out while the ground changes and returns in forest-950 and bark-600, so contrast never sits in a muddy middle state |
| after | Home continues | The gallery (GAL-04, 11, 18, 19) and contact, on paper |

Board: `concepts/review/D-scroll-scenes.jpg`.

## 3. Interaction: rings as the service navigation

**Mapping.** The four service groups are four bands of three growth rings
each, ordered outward from the tree: "Vom Baum bis zur Fläche".

| Band | Group | Photo in the core | Services shown (verified names) |
|---|---|---|---|
| 1 (inner) | Baumarbeiten | GAL-02 | Baumfällung · Stubbenentfernung · Notfällung · Baumpflege · Kronensicherung · Baumkontrolle |
| 2 | Grün & Forst | none (D-19): the core stays open onto the drawn tree, captioned "Illustration" | Neuanpflanzung & Freistellen · Grünflächenpflege für Kommunen · Forstwirtschaftliche Pflege |
| 3 | Bau & Fläche | GAL-06 | Baufeldberäumung · Pflasterarbeiten |
| 4 (outer) | Winter & Reinigung | GAL-14 | Winterdienst · Straßen- und Flächenreinigung |

**Inputs.**

- **Pointer:** hovering a ring band (a wide invisible hit area) or its label
  previews the group. A click or tap selects it.
- **Keyboard and screen readers:**
  - Four real `<button>`s with `aria-pressed` drive the same state.
  - The detail text is an `aria-live="polite"` region.
  - Focusing a button while the scene is off-screen scrolls the stage to the
    interaction scene.
  - "Leistungen" in the navigation and "Leistungen entdecken" jump there
    directly.

**Response.**

- The selected band's three rings turn harz-500 and thicker, and its label
  lights up.
- The core crossfades to that group's real photo.
- The crown dims to 42 % around the photo; it stays at full strength for Grün
  & Forst.
- The highlight only exists while the services are on screen.

**Mobile.** The rings sit in the upper half. The four groups become a 2 × 2
grid of 48 px buttons above the contact dock, and only the selected label is
drawn on its ring, so labels never collide.

Board: `concepts/review/D-interaction.jpg`:

- the default state;
- mouse on the outer ring → Winter & Reinigung;
- a click on Bau & Fläche;
- Grün & Forst showing the illustration;
- keyboard focus;
- a tap on mobile.

## 4. Typography

- **Words.** BAUM / LAND / FORST in Newsreader at weight 560, with the
  optical-size axis pinned at 30.
  - At display size the automatic optical size thinned the T's arm until
    "FORST" read as "FORS'T". It is fixed.
- **Legibility does not depend on texture.**
  - The fill is a solid mist-200 base (10.4:1 on the ground).
  - The light sweep is a gradient over it.
  - The "bark" is reduced to a restrained grain: dark specks at most 12 %
    alpha.
  - No generated bark image is used.
- **Identity and proposition both visible.**
  - The label "Baum-Land-Forst Service · Seddiner See" sits above the words.
  - The verified sentence "Wir bieten Ihnen: Baumfällung, Baumpflege,
    Baumkontrolle, Winterdienst, …" sits below, with its first three services
    set in bold.
  - The H1 is the company name as real text; the services follow as text.
- **Content.**
  - No owner name, no years, no claims.
  - The only new copy is the two headings "Vom Baum bis zur Fläche" (a
    navigation heading, as in Stage 04B A) and "Echte Arbeit am Baum."
  - Both are descriptive and need approval like all copy.

## 5. Tree and logo

- **Category A (authentic logo).** The original emblem PNG appears top-left,
  unchanged, on a paper plate. It is not animated and not reconstructed.
- **The tree is an artwork, not the logo.**
  - It is generated by code (`growth.js`, fixed seed 42, so it is identical on
    every visit).
  - It is visually related to the emblem: a round crown, visible roots, a
    single trunk.
  - It is clearly not the emblem: no ring, no lettering, a different
    silhouette.
  - It does not depend on any geometry of the flat raster logo.
- **No category-B logo proposal is used in D.** If the owner wants the emblem
  itself in the sequence, the honest options are:
  - the Stage 04 masked reveal of the PNG;
  - a redraw by a designer, approved as a new artwork.
- **Known look.** The crown reads slightly "weeping" at the edges. The leaf
  colours are the brand lime (lime-400 and its tints); darker back-layer
  shades give depth.

## 6. Performance: what was fixed from A

Concept A redrew every branch and leaf on every frame. D's tree engine:

- **Draws incrementally onto persistent canvases.** Each frame paints only
  the piece a growing tip added and the leaves that are still opening.
  Finished work is never redrawn.
- **Uses opaque, pre-mixed colours,** so overdraw cannot darken overlaps.
- **Sizes the canvases to the tree's bounding box**, not the viewport.
- **Merges the two depth layers into one canvas after the intro**, so scrolling
  composites one layer, not two.
- **Moves the tree and the rings with CSS transforms on composited layers.**
  No SVG geometry is rebuilt and no canvas is repainted while scrolling.
  Style values are written only when they change.
- **Uses no `mix-blend-mode`** and no pointer parallax.

Measured in headless Chromium with software rendering. Frame interval, p50 /
p95 in ms, and the number of frames over 50 ms:

| | Intro, 1× CPU | Intro, 4× CPU | Intro, 4× CPU, 390 px @3x | Scroll, 4× CPU |
|---|---|---|---|---|
| A · Lebender Baum | 16.7 / 66.8 · 24 | 33.3 / 616.6 · 11 (only 43 frames) | 16.8 / 150 · 18 | n/a (no scroll-driven tree) |
| **D** | 16.7 / 33.4 · 1 | 16.7 / 83.3 · 13 (124 frames) | 16.7 / 66.6 · 13 | 33.3 / 50.1 · 7 (desktop), 33.3 / 50 · 4 (mobile) |
| B · Wald-Monument, for reference | 16.7 / 33.4 · 1 | 16.7 / 216.6 · 15 | 16.7 / 116.6 · 26 | 150 / 200 · 119 |
| C · Wald als System, for reference | 16.7 / 16.8 · 0 | 16.7 / 16.8 · 2 | 16.7 / 16.8 · 1 | 16.7 / 33.4 · 0 |

At normal speed D's intro and scroll hold 60 fps (p50 16.7 ms).

Under 4× CPU throttling (a proxy for a low-end phone) D:

- keeps a 60 fps median through the intro, with the occasional dropped frame;
- scrolls at about 30 fps;
- far better than A and B, but behind C, which is pure SVG on paper.

These are software-rendering numbers; real devices composite on the GPU and
will do better. They have not been measured on real devices.

**Three.js/WebGL: not used and not needed.** The tree is 2D and its cost is
now incremental; WebGL would add ≈ 150 kB and a second rendering path for no
visible gain. WebGL would only be justified for real 3D foliage with lighting,
which the brief explicitly does not ask for.

**Slow connections.**

- The intro runs on code and the self-hosted fonts alone; no image is needed
  for it.
- The service photos are 480/800 px WebP. GAL-06 and GAL-14 load lazily.
- GAL-13 loads lazily and is used only from the real-work scene on.

## 7. Accessibility and fallbacks

| Check | Result |
|---|---|
| Console errors | 0, in every run (keyframes, scenes, interaction, mobile, fallbacks) |
| Horizontal overflow | 0 px at 320, 390, 768, 1024 and 1440 px, with JS, with reduced motion and without JS |
| Upscaling | Every *visible* image ≤ 0.92 device px per source px at 1440@1, 1440@2, 1920@2, 1024@2, 768@2, 390@3 and 320@3, in the interaction, real-work and gallery states. Service photos are hidden before the frame grows past their limit (GAL-02 is only 844 px wide) |
| Keyboard | Tab order: logo, navigation (3), "Leistungen entdecken", the four service buttons, contact links. Visible focus on all. Tab + Enter selects a group; focus scrolls the scene into view |
| Skip | The skip button shows during the intro; one click ends it; on a second visit in the same session no intro plays |
| Reduced motion (`prefers-reduced-motion` or `?rm=1`) | No intro, no scroll scenes. The hero shows the grown tree once; services, the photo, real work and the gallery follow as a stacked page. The service buttons still work |
| No JavaScript | Words, copy, services (first group), the photos and contact all visible. No tree |
| Small screens | Phones and portrait tablets use the stacked layout: words on top, the tree below, the services as a 2 × 2 grid |

**Contrast (WCAG 2.x)** on the lightest part of the dark ground (#18291a) and
on paper:

| Text | Contrast |
|---|---|
| Words (mist-200) | 8.65:1 |
| Lead (paper-100) | 11.98:1 |
| Navigation and buttons (paper-50) | 13.57:1 |
| Selected service (harz-500) | 6.54:1 |
| Decorative ring labels (duplicates of the buttons, hidden from screen readers) | 6.89:1 |
| "Anfrage" (forest-950 on harz-500) | 6.18:1 |
| Paper scenes: forest-950 / bark-600 / forest-600 links on paper-50 | 12.81 / 6.29 / 6.22:1 |

Boards: `concepts/review/D-fallbacks.jpg` and `D-mobile-sequence.jpg`.

**Not tested:**

- Safari and Firefox; only Chromium was tested;
- real devices;
- a screen reader by ear (only the semantics were checked).

## 8. Assessment against the acceptance criteria

| Criterion | Assessment |
|---|---|
| B's dark monumental atmosphere | Yes. A near-black forest green instead of B's neutral black; the words are cleaner (no muddy bark) |
| A's living tree | Yes. It grows on screen, leaf groups open in sequence, and the beam reveals the crown. It is now the centre of the hero, not decoration |
| C's rings as a coherent interactive narrative | Yes. The rings grow from the tree and map the services outward from the tree to the land. The selection drives the core photo |
| One art-directed experience | One axis throughout: crown → rings → core → frame. One light: slit → beam. One hand-over: dark → paper |
| Impact without a demo feel | In my judgement it is stronger than A, B and C. The comparison board shows it next to B and C. The reviewer decides |
| Services and contact clear | The verified services are in the hero, in the panel and in the buttons; the contact dock shows in every scene |
| A's performance problems avoided | Yes. The intro's p95 at 4× improves from 617 ms to 83 ms |
| Mobile and reduced motion | Yes, see §7 |
| Baseline and originals preserved | Yes. `src/`, concepts A, B and C, the originals and the A135 page are untouched |

**Weak points still open:**

- The crown's weeping edge.
- Scrolling at about 30 fps under 4× throttling.
- The paper hand-over passes through a brief greyish state.
- Ring labels are small on mobile.

## 9. Decisions needed from the project owner

1. **Adopt D** as the Home direction (instead of C, recommended in Stage 04B),
   or keep C.
2. **Dark ground.** The opening uses two shades darker than the approved
   palette: `--ground-990 #0d160c` and `--ground-1000 #080e07`. Approve them
   as tokens, or use forest-950 #1b2e1a.
3. **Tree artwork.** Approve a code-drawn tree that is related to, but
   distinct from, the emblem. This includes the fixed shape (seed 42) and the
   brand-lime leaves.
4. **Copy:** "Vom Baum bis zur Fläche" and "Echte Arbeit am Baum."
5. **Grün & Forst without a photo (D-19).** Is showing the drawn tree, labelled
   "Illustration", acceptable until a real photo exists?
6. **Intro once per session**, about 2.8 s, skippable. Confirm, or limit it to
   the very first visit.
7. **Unchanged open items:**
   - D-28 (owner name);
   - D-12 (GAL-03 and GAL-15);
   - D-14 (GAL-16);
   - D-08 (claims);
   - the Stage 04B category-B logo proposals, which D does not use.

## 10. How to view

```
cd blf-service
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/concepts/d-monument-system/index.html`.

| Add to the URL | Effect |
|---|---|
| `?intro=1` | replays the intro in the same session |
| `?t=1.6` | freezes the intro at 1.6 s |
| `?t=end` | shows the end state |
| `?rm=1` | reduced motion |
| `?seed=<n>` | review only: shows another tree shape |

---

## 11. Revision D2 (2026-10-27): the three biggest weaknesses fixed

D2 is a separate copy, `concepts/d2-monument-system/`. Concept D,
concepts A–C and `src/` are unchanged, so D and D2 can be compared side by
side. Board: `concepts/review/D-vs-D2.jpg`.

| # | Weakness in D (from its screenshots) | Fix in D2 | Files |
|---|---|---|---|
| 1 | **Tree silhouette:** the crown was a hollow umbrella whose sides drooped below mid-trunk. It read as a weeping willow, not the emblem's round tree | Branches grow inside a slightly lobed oval crown envelope and steer outward from its centre; shoots that reach the edge stop (no wire outline). Leaf groups fill the whole oval with a minimum spacing, so they stay distinct with small gaps; inner groups sit in the darker back layer. The trunk is a little sturdier. Same seed 42, still drawn by code, still not the logo | `growth.js` |
| 2 | **Dark → paper transition:** a cross-fade passed through a flat olive-grey frame with faded copy (it looked like a dimmed or broken screen) | Paper grows out of the photo frame as a widening "growth ring" (CSS `clip-path: circle()` with a thin amber edge). The real-work copy exists twice: light on the dark side, and dark inside the paper layer (`aria-hidden`, no focusable content). As the edge passes, each half is fully legible; there is no grey state. The navigation turns dark the moment the paper reaches it | `index.html`, `system.js` |
| 3 | **Lighting:** the beam was a flat grey stripe that stopped above the crown, and the crown had no lit side | The beam is a soft cone, narrow at the source and wide where it lands, fading at both ends, and it lands on the upper right of the crown. A faint sheen sits there. Leaves facing the light take a lit tint of lime-400 (`#c6e18a` front, `#86ad2e` back); the far side takes a shade (`#5f8a1a` / `#3a5716`) | `index.html`, `system.js`, `growth.js` |

**Not changed on purpose:**

- **Monumental type:** it already works (10.4:1, crisp after the Stage 04D
  optical-size fix).
- **Mobile ring labels:** about 13 px, harz-500 (fourth on the list). The
  next candidate is a dark halo (`paint-order: stroke`) behind each curved
  label.
- **Interaction, intro timing, contact dock, image limits and fallbacks:**
  unchanged.

**A bug found and fixed while building D2.** The `paper` class that the page
sets on `<html>` (to darken the navigation) also matched the new paper
layer's CSS rule. That clipped the whole document to a circle and left a
white screen from 84 % scroll on. The layer class is now `paper-reveal`.

**Checks run for D2** (Playwright with Chromium only; no other browsers, no
real devices):

| Check | Result |
|---|---|
| Console errors | 0 in every run |
| Horizontal overflow | 0 px at 320, 390, 768, 1024 and 1440 px, with JS, reduced motion and without JS |
| Upscaling | Every visible image ≤ 0.92 device px per source px, at 1440@1, 1440@2, 1920@2, 1024@2, 768@2, 390@3 and 320@3 |
| Keyboard | 12 tab stops, all with a solid focus outline; Tab + Enter selects a group |
| Interaction | Hovering the outer ring selects Winter & Reinigung |
| Skip and session | Skip works; the second visit plays no intro |
| Fallbacks | Reduced motion and no-JS give the stacked page; the paper layer is not used |

**Frame times** (headless, software rendering), p95 in ms:

| | D | D2 |
|---|---|---|
| Intro, 1440 px, CPU 4× | 66.6 | 50 |
| Intro, 390 px @3x, CPU 4× | 50 | 33.4 |
| Scroll, 1440 px, CPU 4× | 49.9 | 50 |

D2 is equal or better despite the fuller crown (about 1,600 leaves), because
leaves are still drawn incrementally.

**The existing QA script for the Home baseline**
(`scripts/qa/home-prototype-qa.js`) was re-run:

| Check | Result |
|---|---|
| Horizontal overflow | 0 px in all 9 layouts |
| Upscaling | Worst file 1.0 |
| Contrast | 165 text nodes, 0 below AA, minimum 5.49:1 |
| Keyboard | Visible focus on every stop. One recorded entry is `BODY` (focus leaving the page at the end of the tab cycle) |
| Intro | Ends on desktop and mobile; Esc skips |
| Reduced motion / no JS / logo failure / `intro.js` blocked | Page usable |
| Forbidden claims or names | None |

---

## 12. D2 refinement pass (2026-10-27, uncommitted, awaiting review)

Only `concepts/d2-monument-system/` changed. D, A–C, `src/` and all assets
are untouched. Before/after board: `concepts/review/D2-refinement-before-after.jpg`.

### Defects found in the D2 screenshots, and the fix for each

| # | Defect (seen in the screenshots) | Change | Why it was necessary |
|---|---|---|---|
| 1 | Leaves read as scattered confetti, especially the pale lit leaves on the upper rim; a few floated loose below the mass | A soft, darker, irregular foliage mass under each front-layer leaf group, growing together with its leaves (`growth.js`) | Groups now read as connected clumps with leaves as texture; depth runs from shaded masses to branches to lit outer leaves |
| 2 | Twig ends traced the crown outline like wire (upper left and upper right) | Branch tips stop at 86 % of the crown radius, and shoots that reach it stop branching (from depth 2) | The foliage always covers the wood at the edge |
| 3 | Transient "brooms" of fine twigs at 1.4–1.9 s | One branch level fewer (8 desktop, 7 phones) | Leaf groups fill the crown on their own; the extra level only added clutter |
| 4 | Heart-shaped notch on top of the crown at 768–1440 px | The main lobe of the crown oval is phased so the top always bulges | A random dip at the top read as a heart |
| 5 | Any branch change reshuffled the whole crown; random gaps appeared | Leaf-group centres come from their own random stream and use best-candidate sampling | Even coverage with no holes, still irregular; the crown layout is stable |
| 6 | The beam had a hard straight edge (`clip-path` polygon), and a grey plane at the top | Elongated radial glow tinted towards the forest palette, a fade at the lower end, no clip-path | No edges, no stripe |
| 7 | Where the beam landed it washed grey haze over the leaves; the sheen overlay showed as a flat grey disc | Beam moved behind the tree, landing on the upper-right crown; sheen removed | The light is carried by the lit/shaded leaf tones; no extra effect needed |
| 8 | At 1024 px the crown came within about 30 px of the lead text | Desktop tree scale is capped so the crown keeps ≥ 40 px from the right edge of the measured text lines | Measured gaps after: 62 / 67 / 83 / 244 px at 1024 / 1280 / 1440 / 1920 |
| 9 | At 320 × 640 the tree was about 130 px tall | On short phones (≤ 700 px tall) the words and lead are slightly smaller | Tree now about 190 px; still fully visible |
| 10 | Mobile ring label small, with ring lines running through the letters | Label 15 px on phones (was 13), plus a dark halo (`paint-order: stroke`) on all ring labels | Legible over the rings |

### Not changed

- The intro timing and the slit.
- The ring interaction, the photos and their size limits.
- The growth-ring paper transition, which was already correct. It was
  re-verified as below.

### QA (Playwright with Chromium only; no other browsers, no real devices)

**Widths 320, 390, 768, 1024 and 1440:**

| Check | Result |
|---|---|
| Crown framing | Tree canvas fully inside the viewport at every width; no overlap with the copy (measured in pixels) |
| Service buttons | ≥ 48 px tall |
| Ring labels | All 4 on desktop, the selected one on phones, all in view |
| Contact dock and navigation | Hittable at every sampled scroll position before, during and after the transition (72–97 %) |
| Document clipping | None |
| Errors | 0 |

**Transition:**

| Check | Result |
|---|---|
| Edge crossing the heading | Captured at p = 0.827 (390 px) and 0.828 (1440 px). Each side is fully legible; no grey frame |
| Doubled text for screen readers | The ARIA tree contains the real-work heading and sentence exactly once (the dark copy is `aria-hidden`) |

**Interaction and fallbacks:**

| Check | Result |
|---|---|
| Hovering the outer ring | Selects Winter & Reinigung |
| Keyboard | Tab + Enter selects; 12 tab stops, all with a solid focus outline |
| Skip | Works; no replay in the same session |
| Overflow | 0 px in 15 runs (5 widths × JS, reduced motion, no JS) |
| Upscaling | Every visible image ≤ 0.92 device px per source px (7 viewport/DPR combinations) |

**Performance** against a frozen copy of the pre-refinement D2, same
machine, alternating runs, headless software rendering. Intro p95 under 4×
CPU throttling:

| | Baseline | Refined |
|---|---|---|
| 390 px @3x | 50 / 50 / 66.7 ms | 50 / 50 / 50 ms |
| 1440 px | 50 / 50 / 50 ms | 50 / 50 / 50 ms |

Isolated scroll runs are equal within run-to-run noise: medians 16.7–33 ms
for both versions.

**Baseline QA** (`scripts/qa/home-prototype-qa.js`, `src/`):

| Check | Result |
|---|---|
| Overflow / upscaling | 0 px overflow and worst upscale ≤ 1.0 in all 9 layouts |
| Contrast | 165 text nodes, 0 below AA, minimum 5.49:1 |
| Keyboard | Visible focus on all stops (the one `BODY` entry is focus leaving the page) |
| Intro, skip, reduced motion, no JS, logo failure, blocked `intro.js` | All pass |
| Forbidden claims | None |

### Still open

- On phones the paper edge cuts horizontally through the heading for a
  moment. Both halves stay legible, but it is visually busy for about a
  tenth of a scroll step.
- The thin bright line in the 0.7–2.1 s keyframes is the intended slit from
  D. It fades by 2.5 s.
- At 320 × 640 the tree is still modest (about 190 px); very short phones
  have little room below the copy.
- Not measured on real devices, and not tested in Safari or Firefox.

---

## 13. Production implementation (2026-10-28)

D2 was approved and is now the opening of the real Home page in `src/`
(see `docs/PROJECT_STATUS.md`, Stage 05). Differences from the concept page:

- The concept's own brand/nav/contact dock is replaced by the site header (fixed,
  light-on-dark over the stage) and the mobile action bar.
- The stacked static layout is the CSS default; the cinematic stage needs
  `stage.js` (`html.stage-on`). This is more robust than the concept's
  `html.rm` / `:not(.js)` overrides.
- **Mobile paper reveal:** the real-work copy rests while the edge passes over
  it (it no longer cuts through the heading). Desktop is unchanged.
- Photo sizes in the stage are capped by the device pixel ratio (found by the
  QA at 1440 px @3x).
- The intro session key is the site's `blf-intro`; `?intro=0/1`, `?rm=1`,
  `?t=` work as before.
