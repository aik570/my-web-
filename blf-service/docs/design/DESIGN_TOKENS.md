# Design Tokens — BLF Service

Stage 03 · 2026-10-27 · **documentation only**: no CSS, JavaScript or
components. The values are for the recommended Direction A "Revier"
(`ART_DIRECTION.md` §3.2). **None is client-approved** [D-20].

**Source column**

| Value | Meaning |
|---|---|
| **logo** | Measured from the client's logo PNG [E] |
| **site** | Taken from the live stylesheet `references/source-css/27visu3806.min.css` [E] |
| **derived** | Computed from a logo or site value (darker or lighter step) |
| **proposed** | New in this stage |

Contrast figures are WCAG 2.x ratios measured for this document.

---

## 1. Colour

### 1.1 Base palette

| Token | HEX | Source | Notes |
|---|---|---|---|
| `color.forest.950` | `#1B2E1A` | derived (logo green, darkened) | ink / dark ground |
| `color.forest.700` | `#264D20` | derived | hover |
| `color.forest.600` | `#32642A` | **logo** | brand green |
| `color.lime.400` | `#8BBB23` | **logo** | dark grounds only |
| `color.harz.500` | `#DD9E09` | **logo** | amber; dark grounds only |
| `color.harz.700` | `#8A5F04` | derived | amber for light grounds |
| `color.paper.50` | `#F4F1E9` | proposed | page ground |
| `color.paper.100` | `#E9E3D6` | proposed | alternate ground |
| `color.bark.600` | `#5F574D` | proposed | secondary text |
| `color.bark.500` | `#7A7166` | proposed | borders with meaning |
| `color.mist.200` | `#C9C2B4` | proposed | secondary text on dark |
| `color.error.700` | `#A3261C` | proposed | errors |

**Existing site colours, not used in Direction A:**

| HEX | Site role | Status |
|---|---|---|
| `#023435` | `--green`, `.hauptfarbe` | Kept on record; used in Direction C. Its replacement needs client approval [D-20] |
| `#E6F1EB` | `.zweitfarbe` | Direction C only |
| `#3F8843` | accent | Fails AA for text (4.36:1 on white); Direction C replaces it for text with `#2E6B33` |
| `#007A41` | scrollbar | Not used |

### 1.2 Semantic tokens

| Token | Light context | Dark context |
|---|---|---|
| `text.primary` | forest.950 (12.81 on paper.50) | paper.50 (12.81 on forest.950) |
| `text.secondary` | bark.600 (6.29 / 5.55) | mist.200 (8.17) |
| `text.link` | forest.600 (6.22) | harz.500 (6.18) |
| `surface.page` | paper.50 | forest.950 |
| `surface.alt` | paper.100 | — |
| `action.primary.bg` / `.fg` | forest.600 / paper.50 (6.22) | harz.500 / forest.950 (6.18) |
| `action.primary.bg-hover` | forest.700 (paper text 8.59) | harz.500 + underline cue |
| `action.secondary.border` | forest.950 | paper.50 |
| `border.control` | bark.500 (4.25 / 3.75, ≥ 3:1) | mist.200 |
| `border.hairline` | bark.500 at 40 % opacity (decorative only) | paper.50 at 20 % |
| `focus.ring` | forest.950, 2 px, offset 2 px | paper.50, 2 px, offset 2 px |
| `marker` (Markierung) | harz.700 (5.00 / 4.42) | harz.500 (6.18) |
| `feedback.error` | error.700 (6.53) | — (errors are shown on light) |
| `feedback.success` | forest.600 | lime.400 |

**Forbidden combinations (measured):**

| Pair | Ratio |
|---|---|
| harz.500 on paper | 2.07 |
| lime.400 on paper | 2.02 |
| harz.500 on forest.600 | 3.00, just below the threshold |
| forest.600 on forest.950 | 2.06 (this affects the logo on dark grounds: needs a paper plate) |

### 1.3 Image placeholders

Each photo's mean colour, computed from the file, shown while it loads.
The full table is in `MOTION_DESIGN.md` §7.

---

## 2. Typography

| Token | Value | Source |
|---|---|---|
| `font.display` | "Newsreader", fallback Georgia, serif | proposed |
| `font.text` | "Hanken Grotesk", fallback system-ui, sans-serif | proposed |
| `font.weight.regular / medium / semibold` | 400 / 500 / 600 | proposed |
| `font.label.tracking` | 0.08 em, uppercase | proposed |

Fonts are self-hosted; licences to be confirmed. The existing families,
Bellota Text and Roboto [site], are documented for Direction C only.

**Type scale.** Fluid between viewport 360 px (min) and 1440 px (max).

| Token | Min | Max | Line height | Family |
|---|---|---|---|---|
| `type.display` | 40 px | 72 px | 1.05 | display |
| `type.h1` | 34 | 56 | 1.10 | display |
| `type.h2` | 28 | 40 | 1.15 | display |
| `type.h3` | 22 | 26 | 1.25 | text, 600 |
| `type.h4` | 19 | 20 | 1.30 | text, 600 |
| `type.body-lg` | 18 | 19 | 1.55 | text |
| `type.body` | 16 | 17 | 1.60 | text |
| `type.small` | 14 | 14 | 1.45 | text |
| `type.label` | 12 | 13 | 1.30 | text, 600, uppercase |

`measure.text`: 65ch (≈ 680 px at body size).

---

## 3. Spacing

A 4-px base scale.

| Token | Value |
|---|---|
| `space.1` | 4 px |
| `space.2` | 8 |
| `space.3` | 12 |
| `space.4` | 16 |
| `space.5` | 24 |
| `space.6` | 32 |
| `space.7` | 48 |
| `space.8` | 64 |
| `space.9` | 96 |
| `space.10` | 128 |
| `space.11` | 160 |

| Token | Mobile | Desktop |
|---|---|---|
| `space.section` | 64–96 px | 96–160 px |
| `space.gutter` | 16 | 24 (tablet 20) |
| `space.margin` | 16 | clamp(32, 5 vw, 80) px (tablet 32) |

---

## 4. Content widths

| Token | Value | Use |
|---|---|---|
| `width.text` | 680 px | running text |
| `width.container` | 1280 px | standard pages |
| `width.wide` | 1440 px | gallery stage only |
| `width.form` | 560 px | Kontakt and Kurzbewerbung forms |

**Image width caps.** CSS px = native ÷ DPR (MOTION_SPEC §5–6):

| Token | Value | Applies to |
|---|---|---|
| `image.max.portrait@2x` | 562 px | 1125 px photos at 2× |
| `image.max.portrait@3x` | 375 px | 1125 px photos at 3× |
| `image.max.gal01@2x` | 584 px | GAL-01 |
| `image.max.tall@2x` | 421 px | GAL-02, GAL-03 |
| `image.max.tall@3x` | 281 px | GAL-02, GAL-03 |
| `image.max.landscape@2x` | 750 px | GAL-05 |
| `image.max.height` | min(80vh, 750 px) | desktop gallery frame |

---

## 5. Border radii

| Token | Value | Use |
|---|---|---|
| `radius.none` | 0 | photos, cards, sections |
| `radius.control` | 2 px | buttons, inputs |
| `radius.pill` | 999 px | chips |

---

## 6. Shadows (elevation)

| Token | Value | Use |
|---|---|---|
| `shadow.none` | none | default; elevation is shown with hairlines, not shadows |
| `shadow.header` | 0 1px 0 rgba(27,46,26,0.12) | compact sticky header |
| `shadow.overlay` | 0 12px 32px rgba(27,46,26,0.24) | lightbox chrome, mobile menu edges, dropdowns |

---

## 7. Motion

The values match `docs/research/MOTION_SPEC.md` and `MOTION_DESIGN.md`.

| Token | Value | Use |
|---|---|---|
| `motion.duration.fast` | 150 ms | hover, focus, small state changes; the maximum lightbox fade under reduced motion |
| `motion.duration.base` | 300 ms | menus, chips, accordions |
| `motion.duration.enter` | 400 ms | one-time entry fade/translate (≤ 16 px) |
| `motion.duration.slow` | 450 ms | chapter title swap, rail jumps (spec range 300–450 ms) |
| `motion.distance.enter` | 16 px | maximum translate for entry and text swaps |
| `motion.ease.standard` | cubic-bezier(0.2, 0, 0, 1) | entering and moving elements |
| `motion.ease.exit` | cubic-bezier(0.4, 0, 1, 1) | leaving elements |
| `motion.ease.scrub` | linear | anything scrubbed by scroll |
| `motion.scale.outgoing` | 1.00 → 0.96 | gallery outgoing photo. **Never > 1.00** |
| `motion.scroll.photo` | 60 vh | scroll length per photo (desktop stage) |
| `motion.scroll.chapter` | 40 vh | extra rest per chapter intro |

**Reduced motion:** every duration becomes 0, except opacity fades of
≤ 150 ms (`motion.duration.fast`); no translate or scale; scrubbing off.

---

## 8. Responsive breakpoints

| Token | Min width | Meaning |
|---|---|---|
| `bp.sm` | 600 px | 8-column grid; gallery cards in 2 columns (MOTION_SPEC §6) |
| `bp.md` | 768 px | tablet layouts |
| `bp.lg` | 1024 px | 12-column grid; visible navigation; desktop gallery stage |
| `bp.xl` | 1280 px | full container width |
| `bp.2xl` | 1440 px | wide gallery stage |

**Condition for the pinned gallery stage:**
- ≥ `bp.lg` **and** viewport height ≥ 700 px;
- **and** a fine pointer;
- **and** no reduced-motion preference.

Otherwise the card layout (or the static layout under reduced motion) is
used.

---

## 9. Alternative directions (for comparison, not recommended)

All measured.

**B "Einsatz"**

| Token | HEX | Use | Measured |
|---|---|---|---|
| asphalt | `#1D2120` | ink / dark | 13.65 vs bone |
| bone | `#EDEBE5` | ground | |
| signal | `#E8641C` | orange on dark only | 4.86 on asphalt; asphalt text on it 4.86; **2.81 on bone: fails** |
| signal-dark | `#9E3F0C` | orange text on light | 5.56; white on it 6.62 |
| steel | `#5B625F` | secondary text | 5.25 |
| steel-light | `#A9B0AC` | secondary on dark | 7.36 |
| logo green | `#32642A` | logo only | 5.89 on bone |

Fonts: Barlow Condensed + Barlow (already self-hosted by the current site
template [site]).

**C "Jahresring"**

| Token | HEX | Use | Measured |
|---|---|---|---|
| teal | `#023435` [site] | ink / dark | 13.59 on white; 11.74 on mint |
| mint | `#E6F1EB` [site] | ground | |
| green-text | `#2E6B33` | replaces `#3F8843` for text | 5.55 on mint |
| green | `#3F8843` [site] | large or decorative only | 4.36 on white |
| amber | `#DD9E09` [logo] | on teal only | 5.80 |
| grey | `#4A5754` | secondary text | 7.55 on white |

Fonts: Bellota Text + Roboto [site].
