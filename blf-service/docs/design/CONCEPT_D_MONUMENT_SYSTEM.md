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
