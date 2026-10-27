# Motion Design — Hybrid Gallery

Stage 03 · 2026-10-27 · status: **proposal for review**

This is the creative and interaction specification for the approved hybrid
gallery (**UX-02**):
- **desktop:** a refined, scroll-driven photographic experience;
- **mobile:** a straightforward, touch-friendly card layout;
- **reduced motion:** respected everywhere;
- **performance and image quality come before animation complexity.**

It builds on `docs/research/MOTION_SPEC.md`, the behavioural spec with its
rules, sequence and sizes, and adds the look, text behaviour, timing and
failure states in the recommended Direction A "Revier"
(`ART_DIRECTION.md`). Where the two differ, this document is the newer
source.

Labels: **[V]** verified · **[P]** proposal · **[A]** assumption ·
**[D-xx]** client decision · **[UX-0x]** approved UX decision.

---

## 1. Purpose and boundaries

**Purpose.** The motion has one job: **to let each photograph of the real
work be seen properly, one at a time, in the context of the service it
shows.** Motion that doesn't serve that is cut.

**The motion character** is steady and deliberate. Nothing snaps,
bounces or spins. There are no parallax layers, no 3D tilts, no cursor
followers, and no scroll-jacking (M6).

**Binding rules,** repeated from MOTION_SPEC §0:

| # | Rule |
|---|---|
| M1 | Only verified BLF photos; no stock, no AI imagery, no upscaling, no generated fills |
| M2 | **No chronology:** no before/after framing, no "vorher/nachher", no progress narratives. The photos carry no dates [V] |
| M3 | **No "same project" claims**, even where photos look alike (GAL-07/08/09/12; GAL-17/18) |
| M4 | **GAL-16 excluded** until D-14 |
| M5 | Captions say only the service [V] and what is visible |
| M6 | No scroll-jacking; native scrolling is untouched |

**Ma'Loa.** The benchmark material isn't in the repository. This spec aims
at the qualities the brief names (sophistication, purposeful motion,
attention to detail), not at copying Ma'Loa. The comparison checklist is
in `VISUAL_REFERENCE_BRIEF.md` §7.

---

## 2. Verified inventory and sequence

18 photos in 8 chapters (MOTION_SPEC §1–2). The chapter line is a
**verified sentence from the Leistungen page** [V], chosen to contain **no
unconfirmed claim** (D-08). Where the page has no text for a category, the
chapter shows only its label.

| # | Chapter label | Photos, in order | Chapter line (verbatim from the site; typos fixed only in the copy stage) |
|---|---|---|---|
| 01 | Baumfällung | GAL-01 → 02 → 04 → (03 only with D-12) | "Wir bieten sichere und effiziente Baumfällungen an, egal ob es sich um einen einzelnen Baum oder eine größere Fläche handelt." Contains a quality claim ("sichere und effiziente"): **only with D-08 l**, otherwise no chapter line |
| 02 | Baumpflege / Kronensicherung | GAL-13 | "Zur Baumpflege zählen auch die Entfernung von Totholz, Kroneneinkürzung, sowie Lichtraumprofilschnitte und auch der Einbau einer Kronensicherung." |
| 03 | Stubbenfräsen | GAL-11 → 12 | "Nach der Fällung kümmern wir uns auch gerne um die Entfernung des Baumstumpfes, damit Sie den Platz für neue Pflanzen oder andere Projekte nutzen können." |
| 04 | Baufeldberäumung | GAL-05 → 06 → 07 → 09 → 08 | "Wir entfernen Pflanzen, Bäume, Sträucher und bereiten das Gelände optimal für Ihre Projekte vor." |
| 05 | Hangbefestigung | GAL-17 → 18 | none: a gallery-only category with no text on the site [D-09] |
| 06 | Pflasterarbeiten | GAL-19 | "Ob Neubau oder Reparatur-wir übernehmen sämtliche Pflasterarbeiten Ihre Wege, Einfahrten, Terrassen und mehr." [sic] |
| 07 | Spielgeräteaufbau | GAL-10 | none: a gallery-only category [D-09] |
| 08 | Winterdienst | GAL-14 → (15 only with D-12: licence plate) | "Im Winter sorgen wir für eine sichere Umgebung, indem wir Schnee räumen und Gehwege sowie Straßenenteisungen durchführen." |

Without D-12, chapter 01 has 3 photos (no GAL-03), chapter 08 has 1 (no GAL-15), and the gallery 16. The sequence
follows **service scope**, not time.

---

## 3. Desktop: the scroll-driven experience [P]

**Conditions:** ≥ 1024 px wide, ≥ 700 px tall, fine pointer, no
reduced-motion preference (DESIGN_TOKENS §8).

### 3.1 Scene layout

```
┌─ header (compact, 56 px) ───────────────────────────────────────────┐
│                                                                     │
│  03 / 08                       ┌───────────────────┐                │
│  ▬ STUBBENFRÄSEN               │                   │                │
│                                │                   │                │
│  "Nach der Fällung kümmern     │   photo frame     │                │
│   wir uns …"                   │   (own aspect,    │                │
│                                │    ≤ 562 × 750)   │                │
│  ─────────────                 │                   │                │
│  Fräse an einem Baumstumpf,    │                   │                │
│  Holzspäne.          1 / 2     └───────────────────┘                │
│                                                                     │
│  → Ähnliche Arbeit anfragen                                         │
│                                                                     │
│  01 ▪▪▪▪  02 ▪  03 ▪▪  04 ▪▪▪▪▪  05 ▪▪  06 ▪  07 ▪  08 ▪▪   rail     │
└─────────────────────────────────────────────────────────────────────┘
```

**Columns**
- **Text column:** grid columns 1–4, vertically centred.
- **Photo frame:** columns 6–11, centred on the remaining space.
- **Ground:** `paper-50`. Chapter 08 switches to `forest-950` (§3.5).

**Text column, from top to bottom:**
1. **Chapter index** "03 / 08": Newsreader, 20 px, tabular figures.
2. **Markierung + service label**: label style (Hanken Grotesk 600,
   uppercase, +0.08 em); `harz-700` stroke on light, `harz-500` on dark.
3. **Chapter line**: body-lg, at most 3 lines; omitted for chapters 05
   and 07.
4. **Hairline.**
5. **Caption**: small, `bark-600`; what is visible (ASSET_INVENTORY visual
   review).
6. **Counter** "1 / 2": label style, right-aligned to the caption.
7. **CTA** "Ähnliche Arbeit anfragen": a text link with an arrow.
   Chapters 05 and 07 link to a general inquiry unless D-09 makes them
   services.

### 3.2 Photo-to-photo transition (within a chapter)

The scroll segment per photo is 60 vh: rest 0–25 %, transition 25–75 %,
rest 75–100 %. Everything is scrubbed linearly with scroll and reverses
when scrolling up.

| Layer | Start → end of the transition |
|---|---|
| Incoming photo | clip-path inset from the bottom: 100 % → 0 % |
| Outgoing photo | scale 1.00 → 0.96; opacity 1 → 0.4; then hidden once covered |
| Frame | width and height interpolate between the two photos' aspect ratios (e.g. 3:4 → 9:16) |
| Caption | opacity 1 → 0 over 25–50 %, swapped at 50 %, 0 → 1 over 50–75 % |
| Counter | swaps at 50 % (no animation on the number) |

**The scale never exceeds 1.00** (no upscaling, even temporarily).

### 3.3 Chapter-to-chapter transition

There is an extra 40 vh rest at each chapter start.

| Order | What happens | Timing |
|---|---|---|
| 1 | The old index, label and line fade out and move up 16 px | `duration.slow` 450 ms, `ease.exit`; time-based, triggered at the segment's start |
| 2 | The Markierung retracts (scaleX 1 → 0, origin right) | 300 ms |
| 3 | The new index, label and line fade in from 16 px below | 450 ms, `ease.standard`, 80 ms stagger between index, label and line |
| 4 | The Markierung draws (scaleX 0 → 1, origin left) | 450 ms; the only "flourish" in the gallery |
| 5 | The photo transition as in §3.2 | scrubbed, after the 40 vh rest |

**Why time-based.** Text swaps are time-based so that letters are never
caught half-faded mid-scroll. Photos are scrubbed so the user controls how
long they look.

### 3.4 Sticky and pinned behaviour

- **Pinned:** the whole stage stays pinned for the gallery's track,
  ≈ 18 × 60 vh + 8 × 40 vh ≈ 14 viewport heights. Before and after it,
  the page scrolls normally. The pin releases into the closing CTA
  (PAGE_ARCHITECTURE §3.5).
- **Header:** stays compact (56 px) while the stage is pinned; the stage
  area is the viewport minus the header.
- **Progress rail** (bottom of the stage): one tick per photo, grouped and
  labelled by chapter number. The active tick fills with scroll. Clicking a
  chapter scrolls smoothly to its start (instantly under reduced motion).
- **Escape routes:**
  - a "Galerie überspringen" link before the stage;
  - the rail;
  - the chapter chips above the stage;
  - Esc/Tab are never trapped (MOTION_SPEC §7).

### 3.5 The Winterdienst finale (chapter 08)

The last chapter's photos were taken in snow, one of them at night. Without
D-12 the finale is GAL-14 alone (no plate visible). During
the chapter 08 intro rest (40 vh), the stage ground cross-fades
**`paper-50` → `forest-950`** [P].

**Contrast safety:** the colour change happens **only while the text
column is empty**, between steps 1 and 3 of §3.3. Text therefore never sits
on a mid-tone. When the text returns:
- text uses `paper-50`;
- the caption uses `mist-200` (8.17:1);
- the Markierung uses `harz-500` (6.18:1).

**Exit:** the ground stays dark through the closing CTA (the dark Kontakt
band). Under reduced motion the chapter is simply dark from the start.

This is optional [DQ-02 in DESIGN_DECISIONS]. Drop it if testing shows it
distracts.

### 3.6 Lightbox

- Click or Enter on the photo opens it.
- `paper-50` at 96 % over the page; the photo at native size, ≤ 1× DPR,
  never upscaled.
- Caption and counter below; previous/next within the chapter; Esc closes
  it.
- Opening and closing fade 150 ms.
- Focus moves into the dialog and returns to the photo afterwards.

---

## 4. Mobile: cards [P, UX-02]

The behaviour is in MOTION_SPEC §6. This section adds the look.

**Filter chips**
- Sticky under the header: "Alle", "01 Baumfällung" … "08 Winterdienst".
- Pills, 40 px tall; selected is `forest-950` with `paper-50` text.

**Chapter header**
- Index + Markierung + label, then the chapter line (body, at most 4 lines
  on mobile).

**Cards**
- The photo in its own aspect ratio, no crop, placeholder colour (§7) until
  loaded, within the caps (GAL-02/03 ≤ 281 CSS px on 3× phones, centred).
- Caption below in small `bark-600`.
- One column below 600 px; two columns at 600–1023 px.
- The per-chapter CTA follows the last card.

**Motion**
- At most one fade + 16 px rise (`duration.enter` 400 ms) the first time a
  card enters the viewport; never repeated, never staggered across more
  than 3 cards.
- No motion at all under reduced motion.
- **No horizontal carousels** inside the gallery: everything is reachable
  by vertical scroll and taps.

**Lightbox:** full-screen; swipe left/right within the active filter;
swipe down or ✕ to close.

**Chapter 08 on mobile:** the chapter has a `forest-950` ground as a
static section; no transition.

---

## 5. Reduced motion [P]

Applies when `prefers-reduced-motion: reduce` is set, on any device.
- **Desktop:** no pin, no scrub, no clip wipe, no scaling, no Markierung
  drawing. A **static chapter layout**: index, label with a static
  Markierung, line, then the chapter's photos in a simple grid within the
  caps, with captions. Chapter 08 is dark from the start.
- **Mobile:** the card layout without entry fades.
- **Everywhere:** lightbox open/close as opacity only, ≤ 150 ms; rail and
  chip jumps scroll instantly.
- **Same content, same order.** Nothing depends on motion.

---

## 6. Image resolution limitations [V → P]

| Photos | Native | Desktop frame max (2×) | Mobile card max (3×) |
|---|---|---|---|
| 14 × 1125×1500 (3:4) | 1125 w | 562 × 750 CSS px | 375 CSS px wide |
| GAL-01 1169×1500 | 1169 w | 584 × 750 | 389 |
| GAL-02 844×1500, GAL-03 843×1500 | 843–844 w | 421 × 750 | **281** |
| GAL-05 1500×1125 (landscape) | 1500 w | 750 × 562 | 500 (full width fits; never cropped to portrait) |

**Consequences**
- **No full-bleed, viewport-filling photography** anywhere in the gallery
  until full-resolution originals arrive [D-10]. The framed scene is
  designed around this; it is the intended look, not a compromise.
- **On large 1× desktop monitors** the caps would allow bigger frames, but
  the scene keeps the 2× sizes for a consistent composition [P].
- **When originals arrive,** only the caps change; the choreography stays.
- **Blurred low-resolution placeholders (LQIP) are not used.** A blurred
  thumbnail stretched to frame size is an upscaled image. Placeholders are
  flat colours (§7).

---

## 7. Loading and performance strategy [P]

**Derivatives** (made later from `original/` into `optimized/`):
- AVIF + WebP at 480 px, 800 px and native width; never wider than native;
- correct `sizes` per layout;
- explicit dimensions on every image, so CLS ≈ 0.

**Placeholder colour** per photo: the mean colour, computed from each file
[V]. It is shown in the frame or card until the image has decoded.

| Photo | Colour | Photo | Colour | Photo | Colour |
|---|---|---|---|---|---|
| GAL-01 | `#586C85` | GAL-07 | `#726D64` | GAL-13 | `#576D85` |
| GAL-02 | `#686A69` | GAL-08 | `#6F7476` | GAL-14 | `#514745` |
| GAL-03 | `#7A7478` | GAL-09 | `#697173` | GAL-15 | `#706B68` |
| GAL-04 | `#8C9EB2` | GAL-10 | `#80796A` | GAL-17 | `#8C8F95` |
| GAL-05 | `#897B6D` | GAL-11 | `#907554` | GAL-18 | `#948C85` |
| GAL-06 | `#807B76` | GAL-12 | `#7D6E4F` | GAL-19 | `#908887` |

**Loading order**
- **Desktop:** the first photo of chapter 01 loads eagerly with high
  priority (the likely LCP element). Each further photo is requested when
  the scroll position is one segment ahead of it, and **decoded before its
  transition may start**.
- **Mobile:** native lazy loading with a one-viewport margin.

**Rendering**
- Animate only `transform`, `opacity` and `clip-path`.
- At most 2 composited photo layers at a time (current + next).
- `will-change` only during an active transition.
- The scroll driver is native scroll-driven animations where supported,
  otherwise a lightweight observer (§8).

**Budgets** (verify in implementation; from MOTION_SPEC §8):

| Metric | Target |
|---|---|
| LCP | < 2.5 s on mid-range Android over 4G |
| CLS | < 0.1 |
| INP | < 200 ms |
| Frame rate while scrubbing | 60 fps on mid-range hardware |
| First view | ≤ ~500 KB of image data |

**If budgets can't be met,** simplify in this order:
1. drop the frame-shape interpolation (cut between aspect ratios);
2. drop the outgoing photo's scale;
3. drop the Winterdienst ground change;
4. fall back to the static chapter layout.

**Image quality is never reduced to save motion.**

---

## 8. Failure and fallback states [P]

| Situation | Behaviour |
|---|---|
| A photo fails to load | The frame or card keeps its placeholder colour and caption, with a small note "Bild konnte nicht geladen werden" and a "Erneut laden" link. The sequence continues; the transition into a failed photo wipes in the placeholder, never a broken-image icon |
| A photo is still loading when its transition is reached | The transition waits at the rest position until decode finishes. The user can keep scrolling; the stage catches up instantly once the photo is ready, without replaying a skipped transition |
| JavaScript disabled or failed | The static chapter layout (§5) is the HTML baseline: all photos, captions and CTAs work. The lightbox degrades to a link to the image file |
| Scroll-driven animation API unsupported | The observer-based driver. If that is unavailable too, the static chapter layout |
| Viewport < 700 px tall, or zoomed so the stage would not fit | The card layout instead of the pinned stage |
| Browser zoom ≥ 200 % / text-only zoom | Layout reflows; the pinned stage gives way to cards once its text column would overflow |
| Very slow network (e.g. data saver signalled) | Load the 480/800 px derivatives only (within the caps); no prefetch beyond the next photo |
| Print | Static list: chapter headings, photos at print size within native resolution, captions |
| Deep link to a chapter (`/galerie#kapitel-04`) | Desktop: scroll to the chapter start, stage pinned at its first photo. Mobile: chip preselected |
| GAL-16 confirmed later (D-14) | It is added as a new Baumkontrolle chapter (label + verified Baumkontrolle text, **only the non-claim sentence**), and the counts update. Nothing else changes |
| D-12 consent withdrawn for a person photo | The photo is removed from the sequence; counts update; no gap remains |

---

## 9. Home teaser motion [P]

Five photos, one per service (GAL-13, 11, 18, 10, 14), in a framed row. GAL-15 is not used here: even a small CSS size shows its plate legibly on 2×/3× screens.
- **Desktop:** a single staggered fade-up (≤ 16 px, 400 ms, 80 ms stagger)
  when the row enters, played once.
- **Mobile:** a horizontal swipe row within the caps.
- **Reduced motion:** static.
- **No pinning on Home.**

---

## 10. Open points

| Point | Owner |
|---|---|
| DQ-02: keep the Winterdienst dark finale? | Design review (DESIGN_DECISIONS) |
| Compare pacing and transitions with Ma'Loa | Project owner supplies the material |
| GAL-03 in chapter 01 | D-12 |
| Baumkontrolle chapter | D-14 |
| Richer captions | D-15 |
| Larger frames | D-10 |
