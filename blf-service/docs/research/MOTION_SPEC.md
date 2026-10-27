# Motion Spec — Scroll-driven Gallery

Stage 02 · 2026-10-26, updated 2026-10-27 (UX-02) · labels: **[V]** verified · **[P]** proposal ·
**[D-xx]** client decision (`CLIENT_DECISIONS.md`)

The interaction specification for `/galerie` (PAGE_ARCHITECTURE §3) and the
smaller teaser on Home. No code; implementation technology is decided in a
later stage.

**Approved 2026-10-27 (UX-02):** hybrid gallery. Desktop is scroll-driven
(§3); mobile is a card layout (§6); reduced motion is respected everywhere
(§4); **performance and image quality take priority over animation
complexity.** This document stays the behavioural spec. The creative layer
(look, typography, timing, failure states) is in
`docs/design/MOTION_DESIGN.md`. Where the two differ, MOTION_DESIGN is the
newer source.

## 0. Benchmark and boundaries

**Ma'Loa.** The brief names the Ma'Loa project as the benchmark for
interaction quality, polish and thoughtful UX, **not** for its visual
identity. No Ma'Loa material is in this repository yet (MISSING_INFORMATION
A5). This spec therefore copies no specific Ma'Loa interaction; it targets
the qualities the brief names:
- calm pacing;
- precise, scroll-linked transitions;
- no gimmicks;
- graceful fallbacks.

**Checkpoint:** compare this spec against Ma'Loa when the material is
supplied, before the design stage.

**Hard rules**

| # | Rule |
|---|---|
| M1 | **Only real BLF photos** from `public/assets/original/gallery/`. No AI imagery, no stock, no upscaling, no generated fills to change aspect ratios |
| M2 | **No chronology claims.** The photos have no dates or EXIF [V]. Nothing in the motion or captions may suggest "before → after", "Tag 1 → Tag 5" or one continuous project. **No before/after sliders, no "vorher/nachher" labels** |
| M3 | **No "same project" claims.** Photos that look like the same site (GAL-07/08/09/12 fence; GAL-17/18 embankment) may sit next to each other, but captions never say they are the same job |
| M4 | **GAL-16 excluded** until D-14 |
| M5 | Captions state the **service** [V] and **what is visible** (ASSET_INVENTORY visual review). No places, clients, dates or results unless D-15 supplies them |
| M6 | **No scroll-jacking.** Native scroll speed and inertia stay untouched; motion is *driven by* scroll, never *replaces* it |

## 1. Asset library for the gallery [V]

| Chapter | Photos | Native size (px) | Shape |
|---|---|---|---|
| Baumfällung | GAL-01, 02, 03, 04 | 1169×1500 · 844×1500 · 843×1500 · 1125×1500 | portrait; 02/03 very tall (≈ 9:16) |
| Baumpflege / Kronensicherung | GAL-13 | 1125×1500 | portrait 3:4 |
| Stubbenfräsen | GAL-11, 12 | 1125×1500 each | portrait 3:4 |
| Baufeldberäumung | GAL-05, 06, 07, 08, 09 | 1500×1125 · 1125×1500 ×4 | **05 is the only landscape image** |
| Hangbefestigung | GAL-17, 18 | 1125×1500 each | portrait 3:4 |
| Pflasterarbeiten | GAL-19 | 1125×1500 | portrait 3:4 |
| Spielgeräteaufbau | GAL-10 | 1125×1500 | portrait 3:4 |
| Winterdienst | GAL-14, 15 (15 only with D-12: licence plate) | 1125×1500 each | portrait 3:4 |

That is **18 photos in 8 chapters**:
- 15 are ≈ 3:4 portrait: 14 exactly 1125×1500, plus GAL-01 at 1169×1500;
- 2 are taller (GAL-02, 03);
- 1 is landscape (GAL-05).

## 2. Sequencing [P]

Chapters follow the **service structure**, not time. The order is a
narrative of scope, moving from the core trade (trees) outward to ground
work and to all-season services. It mirrors the Leistungen grouping
(SITEMAP §2).

| # | Chapter | Order inside chapter | Why this order |
|---|---|---|---|
| 1 | Baumfällung | GAL-01 → 02 → 04 → 03 | Opens on the strongest, non-identifiable action shot (01). 02 keeps the climbing theme. 04 widens to the platform. 03 (the person on the stump) closes the chapter as a portrait moment, **only with D-12**; otherwise the chapter is 01 → 02 → 04 |
| 2 | Baumpflege / Kronensicherung | GAL-13 | Single, distinctive image; a quiet beat after felling |
| 3 | Stubbenfräsen | GAL-11 → 12 | Close-up first, then the machine in context |
| 4 | Baufeldberäumung | GAL-05 → 06 → 07 → 09 → 08 | Landscape 05 opens wide (chapter establishing shot); the machines (06, 07, 09) follow; 08 closes, the calmest image. **Not a progress sequence** (M2) |
| 5 | Hangbefestigung | GAL-17 → 18 | Detail with people, then the long embankment. Captions describe each image on its own (M2/M3) |
| 6 | Pflasterarbeiten | GAL-19 | — |
| 7 | Spielgeräteaufbau | GAL-10 | Lighter tone near the end |
| 8 | Winterdienst | GAL-14 → 15 | Ends on the night/snow images: a strong, different atmosphere as the finale. **GAL-15 only with D-12** (its licence plate is legible at frame size); otherwise GAL-14 alone |

If D-09 removes Spielgeräteaufbau or Hangbefestigung as services, they stay
in the gallery as photo chapters; D-09 only affects Leistungen.

**Home teaser** (PAGE_ARCHITECTURE §1.4): five photos, one per distinct
service, e.g. GAL-13, 11, 18, 10, 14. No pinning: a single horizontal
reveal row.

## 3. Desktop: pinned stage [P]

**Applies when** all three hold: viewport ≥ 1024 px wide, ≥ 700 px tall,
fine pointer, and no reduced-motion preference.

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ header (compact)                                             │
├───────────────────────┬──────────────────────────────────────┤
│ 03 / 08               │                                      │
│ STUBBENFRÄSEN         │        ┌──────────────┐              │
│ one verified line     │        │              │              │
│ from Leistungen       │        │   image      │  ← frame     │
│                       │        │   frame      │    sized to  │
│ caption: what is      │        │              │    the photo │
│ visible               │        │              │    (§5)      │
│ 1 / 2                 │        └──────────────┘              │
│ [Ähnliche Arbeit      │                                      │
│  anfragen]            │                                      │
├───────────────────────┴──────────────────────────────────────┤
│ ▪▪▪▪ ▪ ▪▪ ▪▪▪▪▪ ▪▪ ▪ ▪ ▪▪   chapter progress rail (clickable) │
└──────────────────────────────────────────────────────────────┘
```

### Pinning
- The **whole gallery stage** is pinned (sticky) while its scroll track
  passes, and the content changes inside it.
- **Track length:** about 60 vh of scroll per photo, plus about 40 vh per
  chapter intro. For 18 photos that is ≈ 14 viewport heights. It is long,
  so §7 provides skip and jump controls.
- **Pin release:** after the last photo the stage un-pins and scrolls away
  normally into the closing CTA (PAGE_ARCHITECTURE §3.5).

### Per-photo scroll segment (60 vh)

| Segment part | What happens |
|---|---|
| 0–25 % | **Rest**: the photo is fully visible and static |
| 25–75 % | **Transition**, scrubbed 1:1 with scroll, so it reverses when scrolling up |
| 75–100 % | **Rest**: the next photo is fully visible |

The rest zones keep each photo still long enough to look at, so the eye
isn't always chasing motion.

### Transitions
Only `transform`, `opacity` and `clip-path` are animated (§8).

| Moment | Motion |
|---|---|
| **Photo → photo, same chapter** | The incoming photo is revealed by a clip-path wipe from the bottom edge (inset 100 % → 0 %). The outgoing photo scales 1.00 → 0.96 and fades to 0.4 opacity underneath. **Never scale a photo above 1.00** (R2: no upscaling, even temporarily) |
| **Frame shape change** (e.g. 3:4 → 9:16, GAL-01 → 02; or 4:3, chapter 4 opener) | The frame's dimensions interpolate during the same transition. Each photo is always shown **whole** in its own aspect ratio; nothing is cropped to fit a fixed frame |
| **Chapter → chapter** | Text column: the old chapter title slides up 16 px and fades out; the new one slides in from 16 px below. Chapter number and counter update. Photo transition as above. A short extra rest (the 40 vh intro) lets the chapter title register before the first photo moves |
| **Caption** | Fades and swaps at the midpoint of each photo transition |
| **Progress rail** | One tick per photo, grouped by chapter. The active tick fills continuously with scroll. Clicking a chapter scrolls smoothly to its start (respecting §4) |

**Easing:** scrubbed segments map linearly to scroll (the scroll itself
supplies the feel). Non-scrubbed UI moves (rail clicks, text swaps) use one
shared ease-out, 300–450 ms.

**Interaction**
- Click or Enter on the photo opens the **lightbox** at native size,
  never upscaled, with previous/next and Esc.
- The CTA "Ähnliche Arbeit anfragen" opens Kontakt with the chapter's
  service preselected. For the gallery-only chapters (Spielgeräteaufbau,
  Hangbefestigung) it falls back to a general inquiry unless D-09 makes
  them services.

## 4. Reduced motion [P]

When `prefers-reduced-motion: reduce` is set:
- **No pinning, no scrubbing, no clip-path wipes, no scaling.**
- The gallery becomes a **static chapter layout**: chapter heading,
  verified line, then the chapter's photos in a simple grid in the same
  order, each with its caption.
- The only remaining motion: opacity fades of ≤ 150 ms when the lightbox
  opens or closes. Rail and chip jumps scroll **instantly**.
- The content and order are identical to the animated version. **Nothing
  is only available through motion.**

## 5. Image sizing: no upscaling [P, based on V]

The frame size is capped so that **CSS size × device pixel ratio ≤ native
pixels**, at least at 1× and ideally at 2×.

| Rule | Value | Reason |
|---|---|---|
| Frame height (desktop) | `min(80vh, 750px)` | 750 CSS px × 2 DPR = 1500 px, the native height of every portrait photo |
| Portrait 3:4 frame | ≤ 562 × 750 CSS px | 1125 px ÷ 2 |
| Tall 9:16-ish (GAL-02, 03) | ≤ 421 × 750 CSS px | 843 px ÷ 2 |
| Landscape GAL-05 | ≤ 750 × 562 CSS px | 1500 px ÷ 2 |
| Lightbox | ≤ native size at 1× | Never upscaled; on 2× screens it is shown at native size, i.e. smaller |

When full-resolution originals arrive (D-10), only these caps change; the
choreography stays.

## 6. Mobile and tablet: card layout [P, UX-02]

**Applies when** the width is < 1024 px, the height is < 700 px, or the
pointer is coarse. Per UX-02 the mobile gallery is a **straightforward,
touch-friendly card layout**, not a reduced copy of the desktop stage.

- **No pinning, no scroll-linked animation.** Pinned sections on phones
  fight browser chrome resizing and touch momentum.
- **Structure:** filter chips at the top (one per chapter, plus "Alle"),
  then each chapter as a heading with its verified line, followed by its
  cards. Order as in §2.
- **Cards:** the photo in its **own aspect ratio, never cropped**, with the
  caption below (service + what is visible). One column below 600 px; two
  columns from 600 to 1023 px.
- **Size caps.** CSS width × DPR must stay ≤ native width:

| Photos | Native width | Max card width at 3× DPR | Max at 2× DPR |
|---|---|---|---|
| 3:4 portraits (1125 px) | 1125 | 375 CSS px → full width on phones fits | 562 |
| GAL-01 | 1169 | 389 | 584 |
| **GAL-02, GAL-03** | **843–844** | **281 CSS px**: narrower than full width on 3× phones, centred with the caption below | 421 |
| GAL-05 (landscape) | 1500 | 500 → full width fits; **not** cropped to portrait (a 3:4 slice would be only 844 px wide) | 750 |

  On the current files this cap shows GAL-02/03 slightly smaller rather
  than softer. Full-resolution originals (D-10) remove the cap.
- **Filter chips** scroll horizontally. A tap shows that chapter only and
  scrolls to it; "Alle" restores the list. The URL hash reflects the chip
  for sharing.
- **Entry motion:** at most a single fade/translate (≤ 16 px, ≤ 400 ms) as
  a card enters the viewport, played once. None with reduced motion.
- **Lightbox:** tap opens it; swipe between photos within the active
  filter; swipe down or ✕ closes it.
- **Per-chapter CTA** "Ähnliche Arbeit anfragen" after each chapter's
  cards (as on desktop, §3).
- The bottom action bar (PAGE_ARCHITECTURE R3) hides while the lightbox is
  open.

## 7. Accessibility [P]

- **Semantic structure:** each chapter is a section with a heading; each
  photo is a figure with its caption. DOM order equals visual order, in
  every mode.
- **"Galerie überspringen"** link before the stage. Chapter chips and the
  progress rail are keyboard-reachable buttons with labels ("Kapitel 3:
  Stubbenfräsen").
- **The pinned stage never traps focus or Tab.** Tabbing to a photo
  scrolls to its segment.
- **Lightbox:** focus moves in on open and returns to the photo on close;
  Esc closes it; arrow keys move between photos; announced as a dialog.
- **Alt text** describes what is visible (from the visual review), for
  example GAL-13: "Blick in die Kronen mehrerer Kiefern, die mit einem
  Seilsystem zur Kronensicherung verbunden sind."
- Caption and text contrast meets WCAG AA over every state of the
  transitions.

## 8. Performance [P]

**Image derivatives** are made in the build/design stage from
`original/` into `optimized/`. Originals are never touched.
- AVIF + WebP at 480, 800 and native width. **No width above native.**
- Correct `sizes` per breakpoint, so phones never download the
  native-width file.
- Every image has explicit width and height (or aspect-ratio) so the
  layout reserves space: **CLS ≈ 0**.

**Loading**
- The first photo of chapter 1 loads eagerly with high priority. It is the
  likely LCP element.
- Every other photo is lazy and preloaded about one segment ahead of the
  scroll position. Decode happens before the transition starts, so a
  half-loaded image never wipes in.

**Rendering**
- Animate only `transform`, `opacity` and `clip-path`; no layout
  properties.
- At most the current and the next photo are composited layers at a time.
- `will-change` only during an active transition.

**Scroll linkage:** prefer native scroll-driven animations where supported,
falling back to a lightweight observer-based driver. The choice is made in
implementation; either way it must meet the budgets below.

**Budgets** (to verify in implementation):

| Metric | Target |
|---|---|
| LCP | < 2.5 s on mid-range Android over 4G |
| CLS | < 0.1 |
| INP | < 200 ms |
| Frame rate during scrub | 60 fps on mid-range hardware |
| First view | ≤ ~500 KB of image data |

For reference, today's served WebPs are 143–684 KB each at 1125 px wide
[V]; the 800 px derivatives will be smaller.

**Graceful degradation:** without JavaScript, the reduced-motion layout
(§4) is the baseline and shows all photos.

## 9. Open points

| Item | Resolved by |
|---|---|
| Compare choreography with Ma'Loa | Project owner supplies Ma'Loa material (MISSING_INFORMATION A5) |
| GAL-03 in chapter 1 | D-12 |
| GAL-16 as Baumkontrolle chapter | D-14 |
| Richer captions (job type, place, year) | D-15 |
| Larger frames / full-bleed moments | D-10 originals |
| Whether the gallery-only chapters get an inquiry CTA | D-09 |
