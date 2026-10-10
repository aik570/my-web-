# AIK Studio — Visual Identity v1.0

**Stage 5A · Master Art Direction**
Status: proposed for approval. QA pass completed on 2026-10-10 (see §13). No website code, assets or images have been produced. The QA used only the two raster references: no vector source exists, and no real devices were tested.

**Positioning (locked):** Premium Websites for Ambitious Businesses.
**Languages (locked):** English is primary, German is secondary.

References (stored next to this file):

- `references/ref-01-logo-cinematic-aik.jpg`: the AIK monogram integrated into three peaks, metallic, with the "STUDIO" wordmark, tagline and "POTSDAM | BERLIN". This is the **monogram reference**.
- `references/ref-02-moodboard-cold-palette.jpg`: the three-mode moodboard (A/B/C), palette, type sample and a "logo direction" panel. This is the **atmosphere, material and colour reference**.

---

## 0. Assessment of the references

### Reference 01: monogram (AIK in the mountains)

**What works**

- The core idea is strong and ownable: the letters are built from mountain flanks. The A, I and K are readable at large size, and the diagonals and peaks come from the same geometry.
- Material and light are close to right: cool brushed metal, one key light from the upper left, and a warm edge only on the faces that catch the light.
- The short champagne rule under the tagline is a good signature detail and worth keeping as a system device.

**Problems to fix**

1. **The silhouette reads as an M.** The central peak is much taller and wider than the two side peaks, and the side peaks sit symmetrically below it. At a glance the outline is "M", and the letters inside are second.
2. **The letters and peaks don't map one-to-one.** The A sits under the left peak, but the I and the K's stem sit under the central peak. The right peak carries only the outer flank. The concept is clearer if each peak *is* a letter.
3. **Too many strokes.** There are two extra parallel diagonals left of the A, plus the A's own legs. That's five near-parallel lines in the left third, and they will merge into one grey wedge below about 64 px.
4. **The K is detached.** The chevron floats away from its stem, and the stem sits as close to the I as the chevron does. At small sizes it reads "A I I <".
5. **Mixed materials.** The central peak is filled with photographic rock and snow while the rest is metal. That can't be reduced to a flat mark, and it's the main reason the central peak dominates.
6. **Too much bloom.** The light leak on the upper-left peak is close to the "glowing outline" effect we want to avoid.

### Reference 02: moodboard and "logo direction"

**What works**

- The palette panel is coherent and matches the brief: cold, desaturated, with one restrained warm metal.
- The three image modes share a horizon logic, cloud layer and grade, and could plausibly belong to one world.
- The texture strip (rock, snow, cloud, wet stone) is the right material vocabulary.

**Problems to fix**

1. **The "logo direction" symbol has lost the AIK.** It's three faceted peaks with a dominant centre, a generic mountain/M mark. The letters survive only in the wordmark. This fails the brief ("do not replace the symbol with a generic mountain icon"). Treat it as a material and light reference only, not a shape reference.
2. **The type sample uses a serif with a champagne italic** ("elevate"). That pushes the brand toward luxury hospitality or real estate, away from "elite technology". It conflicts with the confirmed Space Grotesk/Inter pairing and is not adopted.
3. **Mode A has an orange sun.** It's too warm and too saturated for the lighting rules below and needs to be graded cooler.
4. **Mode C uses a bald eagle.** It's a North American national symbol, so it brings unwanted associations and reads as cliché. It's also not native to the Alps. See §6.
5. The images show typical generation artefacts: inconsistent cloud scale, repeated ridge shapes and smeared feather detail. These are fine for a mood reference, but not good enough to ship.

### Verdict

Keep the monogram concept from Reference 01, take the world, palette and material from Reference 02, and redraw the symbol as vector geometry where **each peak carries one letter**. The direction "Elite Technology + Cinematic Digital" holds. The cinematic world frames the brand, and the interface stays technical, precise and mostly typographic.

---

## 1. Brand character

**Precise · Ambitious · Composed · Technical · Cinematic · Commercially sharp**

### Creative-direction statement

> AIK Studio looks like a high-end engineering instrument that happens to be standing in the Alps. The interface is exact, quiet and typographic: architecture first. The mountain world sits around it as atmosphere: cold air, hard light and real scale. It appears at decisive moments and never as decoration. Every image, line and movement should feel deliberate enough that a client trusts us with their business.

The hierarchy is fixed: **technology leads, cinema frames.** If a screen has no mountain or eagle on it, it must still be unmistakably AIK through type, colour, geometry and spacing.

---

## 2. Logo system

### 2.1 Refinement: construction rules

These rules are for the vector redraw, done by hand in a vector tool and **not traced from an AI render**.

1. **One letter per peak.**
   - **Left peak = A.** The apex is the A's apex, the two flanks are its legs, and a short crossbar sits low in the counter.
   - **Centre peak = I.** A single vertical stem rises to the apex as the ridge line. The peak's flanks are lighter, "atmospheric" strokes around it, or open space in the flat version.
   - **Right peak = K.** The vertical stem is the peak's left edge, and the upper arm of the chevron becomes the peak's right flank. **The chevron touches the stem.** That join is what makes it a K and not "<".
2. **Break the M.** The three peaks get distinct heights and spacing:
   - Height ratio about **A 86 : I 100 : K 78**. The centre stays highest but is no longer twice the others.
   - Apex spacing is **asymmetric**: A–I is closer than I–K.
   - Peaks **overlap in depth**: the A flank passes in front of the I base, and the K stem stands clear. This layering is what reads as "mountain range" rather than "letter M".
3. **One stroke weight, one angle family.** All flanks use a single angle (start at **58° from horizontal**). The K's lower arm is the only counter-angle. Stroke weight is constant. Apexes are sharp in the master and get a 1-unit chamfer in small-size versions.
4. **Drop the extra parallels.** The flat mark has **no** additional strokes left of the A. The cinematic version may keep **one** outer flank as a depth layer, never two.
5. **One material.** No photo or rock texture inside the symbol in any version. In the cinematic render, every face uses the same metal.

> The ratios above (86/100/78, 58°) are starting values for the redraw. They are **not tested**. Validate them at 16, 24, 32 and 64 px and at hero size before freezing.

### 2.2 Two applications

| | **Flat logo (everyday)** | **Cinematic logo (brand moments)** |
|---|---|---|
| Use | Header, mobile, favicon, footer, documents, social avatars, email, invoices | Homepage opening sequence (homepage only), plus selected brand moments as **static pre-rendered stills** (case-study title card, social covers) |
| Form | Solid vector, one colour, no gradients, no bevel | Same geometry, extruded and bevelled, brushed steel |
| Colour | Ice White `#F2F5F7` on dark, Obsidian `#101419` on light | Cool satin steel with a champagne edge light on key-light-facing bevels only |
| Format | SVG master; PNG/ICO exports | Pre-rendered still or video/image sequence (see §8). Never a live 3D render in the header |
| Wordmark | "AIK STUDIO" set in Space Grotesk Medium, uppercase, +0.18em tracking | Same wordmark, flat Ice White under the metal symbol |

**Lockups to produce:**

1. Horizontal: symbol + wordmark. This is the header lockup.
2. Stacked: symbol over wordmark.
3. Symbol only.
4. Favicon/app icon: a simplified symbol on an Obsidian square. If 16 px testing fails, use a reduced "three strokes" version.

**Rules**

- The tagline "Digital solutions for businesses" and "Potsdam | Berlin" are **not** part of the logo. They are set as typography where needed (footer, opening sequence end card).
- Clear space: the height of the I-stem's stroke width × 4 on all sides.
- Minimum size (target, updated by QA §13.1): full symbol 32 px tall on screen and 10 mm in print. The horizontal lockup needs at least 140 px wide. Below 32 px, use the simplified favicon variant.
- Champagne never appears in the flat logo. Warmth belongs to the cinematic version only.
- Never place the flat logo on busy image areas. Use a haze or sky zone, or put it on a solid surface.

---

## 3. Colour system

### 3.1 Final palette

The six proposed values are kept **unchanged**. Contrast testing (WCAG 2.x, figures below) showed three gaps: Steel Blue cannot carry text on either dark or light surfaces, and there was no raised dark surface or alternate light surface. Four **functional tints** close those gaps. They are lighter or darker versions of the same hues, not new hues.

| Token | HEX | Role | Proportion |
|---|---|---|---|
| **Obsidian** | `#101419` | Base dark surface, opening sequence, dramatic sections, text on light | ~35% |
| **Graphite** *(added)* | `#1B242D` | Raised surfaces on Obsidian (cards, nav on scroll, inputs on dark) | ~10% |
| **Deep Slate** | `#253746` | Depth, secondary dark surfaces, highlighted pricing card, secondary text on light | ~10% |
| **Steel Blue** | `#647F93` | Atmosphere, illustrations, large decorative numerals, chart lines. **Not body text.** | ~4% |
| **Steel Light** *(added)* | `#8FA6B7` | Links, icons, focus ring and accent text **on dark** | ~1% |
| **Steel Ink** *(added)* | `#4E6577` | Links, labels, focus ring and accent text **on light** | ~1% |
| **Mist Grey** | `#C5CFD6` | Secondary text on dark, dividers on light, subdued details | ~4% |
| **Snow** *(added)* | `#E6EBEF` | Alternate light surface (FAQ, pricing band, form fields on light) | ~10% |
| **Ice White** | `#F2F5F7` | Main light surface, primary text on dark | ~25% |
| **Champagne Metal** | `#B8A58A` | Logo metal edges, one short hairline rule, rare micro-accents | **≤1%** |

The proportions are a page-level average. The opening is close to 100% dark, and services and pricing are mostly light.

### 3.2 Contrast reference (measured)

| Foreground → Background | Ratio | Use |
|---|---|---|
| Ice White on Obsidian | 16.9 | All text |
| Mist Grey on Obsidian | 11.7 | Secondary text |
| Steel Light on Obsidian | 7.3 | Links, accent text |
| Steel Blue on Obsidian | 4.4 | **Large text (≥24 px) and graphics only** |
| Champagne on Obsidian | 7.7 | Allowed, but kept to micro-accents by rule |
| Obsidian on Ice White | 16.9 | All text |
| Deep Slate on Ice White | 11.2 | Secondary text |
| Steel Ink on Ice White | 5.6 (5.1 on Snow) | Links, labels |
| Steel Blue on Ice White | 3.8 | **Graphics only** |
| Champagne on Ice White | 2.2 | **Never as text or functional UI on light** |

### 3.3 Usage rules

1. **Dark/light rhythm.** Dark for the opening, the featured case study and contact. Light (Ice/Snow) for services, pricing, process, and FAQ. Never more than two consecutive dark sections after the hero.
2. **One accent at a time.** A section uses either Steel or Champagne as its accent, never both.
3. **Champagne** may appear only:
   - on cinematic logo edges,
   - as the signature hairline (40 × 1 px rule under a key heading or in the footer),
   - as a one-pixel active indicator in navigation.

   It never fills a button, a background or a large type element.
4. **No saturated blue.** Interactive states use Steel Light/Steel Ink plus underline or weight. There is no "brand blue" button.
5. **Lines.** On dark, use Mist Grey at 12–16% opacity. On light, use Deep Slate at 12–14% opacity.
6. **Imagery grade.** Shadows go to Obsidian/Deep Slate, midtones to Steel, and highlights to Ice. Pure #FFFFFF clipping should never cover more than small specular points.
7. **System states** (error, success) use muted, non-brand values, defined in the UI stage. They are not part of the identity palette.

---

## 4. Typography

**Confirmed: Space Grotesk (headings, labels) + Inter (body, UI).** Both are free, variable and available on Google Fonts.

Known constraints and how they are handled:

- **Space Grotesk has no italic.** Emphasis in headings comes from weight (400 → 600) or colour (Steel Light/Steel Ink), never faux-italic.
- **Space Grotesk's personality** (its `G`, `R` and `t`) gets louder at heavy weights. Headings stay at 500, and 600 is reserved for very small sizes.
- **Languages.** English is primary and German secondary. Layouts are designed in English and must survive German without redesign. Allow for German strings running roughly 20–35% longer: this is a localisation rule of thumb, not a measurement. Display sizes are capped. German pages set `lang="de"` and use `hyphens: auto` on headings, so compounds like "Webentwicklungsleistungen" never overflow on mobile. Buttons and navigation must fit the German strings at 360 px width.

### 4.1 Scale

| Style | Font | Weight | Size (mobile → desktop) | Line height | Tracking | Case |
|---|---|---|---|---|---|---|
| Display | Space Grotesk | 500 | `clamp(2.75rem, 6vw + 1rem, 7rem)` | 0.95 | −0.035em | Sentence |
| H1 | Space Grotesk | 500 | `clamp(2.25rem, 4vw + 1rem, 4.5rem)` | 1.02 | −0.03em | Sentence |
| H2 | Space Grotesk | 500 | `clamp(1.875rem, 2.5vw + 1rem, 3.25rem)` | 1.08 | −0.025em | Sentence |
| H3 | Space Grotesk | 500 | `clamp(1.5rem, 1.2vw + 1rem, 2rem)` | 1.15 | −0.015em | Sentence |
| H4 | Space Grotesk | 500 | `clamp(1.25rem, 0.6vw + 1rem, 1.5rem)` | 1.25 | −0.01em | Sentence |
| H5 | Inter | 600 | 1.125rem | 1.35 | −0.005em | Sentence |
| H6 / Eyebrow | Space Grotesk | 500 | 0.8125rem | 1.3 | +0.12em | **UPPERCASE** |
| Lead | Inter | 400 | `clamp(1.125rem, 0.4vw + 1rem, 1.3125rem)` | 1.5 | −0.005em | Sentence |
| Body | Inter | 400 | 1.0625rem (17 px) | 1.6 | 0 | Sentence |
| Small / secondary | Inter | 400 | 0.875rem | 1.5 | 0 | Sentence |
| Caption / meta | Inter | 500 | 0.8125rem | 1.4 | +0.01em | Sentence |
| Navigation | Inter | 500 | 0.9375rem | 1 | 0 | Sentence |
| Button | Inter | 500 | 0.9375rem (sm) / 1rem (lg) | 1 | +0.005em | Sentence |
| Label / tag | Space Grotesk | 500 | 0.75rem | 1.2 | +0.08em | UPPERCASE |
| Numerals (pricing, stats) | Space Grotesk | 400 | per context | 1 | −0.02em | `tabular-nums` |

### 4.2 Rules

- Uppercase appears only in eyebrows, small labels and the logo wordmark. Headings, navigation and buttons are sentence case.
- Wide tracking (≥ +0.08em) appears only in uppercase text under 14 px. Long text is never tracked out.
- Body line length is 60–72 characters (`max-width: 68ch`).
- Headings break by meaning. Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.
- Body text never sits directly on an image. Use a solid surface or a measured scrim (see §9).

---

## 5. Mountain art direction

### 5.1 The world (shared by all modes)

- **Geography:** high-alpine granite and gneiss terrain in the style of the Valais/Mont Blanc massif: dark, steep rock with snow in couloirs and on ledges. **No identifiable landmarks** (no Matterhorn, no Eiger north face), and no pale limestone Dolomites.
- **Season and time:** deep winter. Low sun, about 10–25° elevation, or a high overcast sky with breaks.
- **Key light:** always from **upper left**, matching the logo. Cool and directional.
- **Air:** real atmospheric perspective. Each depth layer is lighter and bluer.
- **Depth:** three readable planes:
  - **foreground:** dark rock or ridge, usually the bottom 15–25% of the frame,
  - **midground:** the hero peak or ridge,
  - **background:** ranges dissolving into haze.
- **Lens:** 35–50 mm for epic and immersive frames, and 85–135 mm for compressed layered ranges. Camera at ridge height, never a drone-top-down "travel" view.
- **Negative space:** every frame intended for text keeps one calm zone (sky, haze or cloud sea) of at least 35% of the frame.
- **Realism:** premium landscape photography or high-end CGI. Natural snow scale, real rock fracture patterns, no impossible spires or floating islands.

### 5.2 The three modes

| | **A · Dark & Dramatic** | **B · Clean & Epic** | **C · Bold & Immersive** |
|---|---|---|---|
| Role | Opening sequence, section transitions, contact close | Calm content backdrops, case-study and process bands | 1–2 signature moments: scale, camera motion, eagle |
| Exposure | Low key, mostly Obsidian/Deep Slate, highlights only on ridges | Mid–high key, misty, Ice/Mist dominant, soft shadows | High contrast, deep shadows next to bright cloud |
| Light | Low raking sun through cloud breaks, cold rim on ridges | Diffuse overcast with gentle direction | Directional shafts through cloud, strong silhouette |
| Warmth | One small warm highlight allowed near the focal point | None | Small warm accent on the focal subject only |
| Text overlay | Yes, in haze or sky zones | Yes, in the light sky; text in Obsidian | Minimal. Image leads, short headline only |
| Frequency | Hero plus at most 2 transitions | 2–3 bands | At most 2 per site |

### 5.3 Avoid

Generic stock vistas, lakes with jetties, saturated blue skies, orange or pink sunsets, sun discs in frame, HDR halos, fantasy spires, impossible scale, repeated "cloned" ridges, visible AI smearing in snow or rock texture, hikers, flags or tents.

---

## 6. Eagle art direction

### 6.1 Species and appearance — decision

**Golden eagle (*Aquila chrysaetos*)**, not a bald eagle.

- It's native to the Alps, so it belongs to this world.
- It avoids American national symbolism.
- Its plumage fits the palette: deep umber-brown body that grades toward Graphite, a tawny-golden nape that echoes Champagne Metal in a natural way, and pale-grey patches at the base of the tail and wings in juveniles. We use the **adult** plumage for consistency.
- Grade the brown so it reads near-neutral dark. It must not look orange.

### 6.2 Feathers and light

- The primaries must show individual, separated "fingered" wing-tip feathers in a glide. This is the clearest credibility marker.
- Feathers are matte. Specular highlights stay tiny and appear only along the leading edge of the wing and the nape, from the same upper-left key light as the scene.
- The underside sits in shadow, filled by cool bounce light from snow and cloud, never lit from below.

### 6.3 Framing and behaviour

- **Distance:**
  - **Default is mid to wide:** the eagle fills 8–25% of the frame width, so the mountains give it scale.
  - **One close pass maximum** across the whole site: the wing crossing camera as a transition.
  - No portrait close-ups of the head, no open beak, no talons toward camera, no hunting or attack. The message is perspective and control, not aggression.
- **Motion:** gliding and banking, with slow, broad turns. At most 1–2 wingbeats per shot. The camera never "chases" it frantically.
- **When it appears (locked: Hero and selected transitions only, maximum 3 times on the homepage):**
  1. **Hero/opening sequence:** it crosses the frame and leads the eye toward the logo reveal.
  2. **Transition 1:** into the Featured MA'LOA case study, where its flight line leads the camera through a pass.
  3. **Transition 2 (optional):** into Process.

  It never appears in the contact section, footer or content sections, or on inner pages.
- **Connecting scenes:**
  - Its flight vector sets the camera direction for the next scene.
  - A near-camera wing pass works as an occlusion wipe (a natural cut point).

### 6.4 Consistency plan (requires testing)

Generated video **cannot be assumed** to keep the same bird across shots. Plan:

1. Create a locked **reference set**: side glide, top-down glide, three-quarter underside, banking. Same species, adult plumage, same light.
2. Generate each shot **image-first from that set**, then animate image-to-video. Test continuity between at least two consecutive shots before committing.
3. **Fallback A:** a licensed 3D golden-eagle model with feather groom, **rendered offline** into image sequences. This gives the most consistent result and full camera control. It is not real-time 3D, which stays excluded in v1.
4. **Fallback B:** licensed real footage, graded to the palette.
5. Decide the production route only after the test in step 2.

---

## 7. Lighting and material rules

| Element | Rule |
|---|---|
| **Key light** | Single cold directional source from the upper left, about 5600–6500 K appearance, graded cooler. Consistent across logo, mountains and eagle. |
| **Haze** | Present in every exterior frame. Density increases with distance and has a slight blue-grey tint. It is never a flat white fog over everything. |
| **Volumetric rays** | Only where cloud breaks justify them. At most one ray group per frame, low opacity, never radiating from the logo. |
| **Shadows** | Deep but not crushed. Shadow detail stays readable in rock. Shadow tone sits in Deep Slate/Obsidian, not neutral black. |
| **Highlights** | Snow highlights stay close to Ice White, with clipping only at small specular points. Contrast comes from value structure, not from sharpening. |
| **Snow** | Soft, slightly translucent, with blue-shadowed hollows. The wind texture is visible. It is never plastic-white or glittering. |
| **Rock** | Dark granite/gneiss, sharp fracture planes, micro-specular wetness only where snow melts. |
| **Logo metal** | Satin brushed steel with a cool base, reflecting the sky and environment. Fine, subtle stone/scratch micro-texture is allowed, as in Ref 01. |
| **Champagne edge** | A thin highlight only on bevel edges facing the key light, 1–3% of the logo area. Never all edges, never a glowing outline. |
| **Effects banned by default** | Lens flares, anamorphic streaks, heavy bloom, glowing strokes, chromatic aberration, particle sparkles, fake dust motes. |

---

## 8. Motion language

### 8.1 Principles

1. **Deliberate.** Every motion reveals, connects or confirms. Nothing loops for decoration.
2. **Physical camera.** Camera moves have weight, with slow acceleration in and slow settle out. There are no whip pans and no rotation for its own sake.
3. **The user drives.** Scroll-linked sequences follow native scroll (scrub). Scroll is never hijacked or snapped, and the speed is never altered.
4. **Short.** The pinned opening runs about 2–3 viewport heights of scroll at most. Any other pinned scene is at most 1.5 viewports.
5. **Type is calm.** The scene moves and the text settles.

### 8.2 Specific behaviours

| Moment | Intended behaviour | Technique (recommended) |
|---|---|---|
| **Opening / logo reveal** (homepage only) | Dark frame, cloud drifts, light rakes across the ridge, eagle crosses, then the metal AIK resolves. At the end the cinematic logo hands off to the flat SVG logo in the header. | **Hybrid:** pre-rendered image sequence scrubbed on canvas, plus a DOM/SVG flat logo and type layered on top. Autoplay plays once if there is no scroll within about 2 s. |
| **Camera through passes** | A slow forward dolly between ridges, with haze layers parting. | **Image sequence** (provisional; see §13.3). Final choice after the device test plan. |
| **Eagle flight** | Glide across or toward the scene and lead the camera. | Rendered **inside the sequence**. A separate alpha-video layer (WebM VP9 alpha plus HEVC alpha for Safari) only if the test proves it is needed. |
| **Scene transitions** | Cloud or haze cross-dissolve, or the eagle's wing occlusion wipe. No slides, zooms or glitch effects. | Part of the sequence, or a CSS opacity crossfade between stills. |
| **Typography entrance** | A line-by-line mask reveal: 12–16 px rise plus opacity, 700–900 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, 70 ms stagger. Body copy fades in only (400 ms). | CSS/JS, IntersectionObserver or scroll timeline. |
| **UI micro-motion** | Hover and focus at 150–200 ms, colour or underline only. Buttons don't scale or bounce. | CSS |
| **Parallax** | At most two layers in mode B bands, with a small offset of 4–8%. | CSS transforms, disabled on reduced motion. |
| **Real-time 3D** | **Excluded from v1 (locked).** No WebGL, no live logo or scene. | — |

### 8.3 Reduced motion and performance

- `prefers-reduced-motion: reduce`:
  - Sequences are replaced by a single art-directed still (the final frame).
  - Text appears without movement.
  - No parallax.
  - The eagle appears only as a still.
- Mobile gets a shorter sequence at lower resolution. A poster still is the LCP element, and frames load progressively after first paint.
- Every animated scene has a static fallback that alone looks finished.

---

## 9. Website application

| Section | Surface | Imagery | Notes |
|---|---|---|---|
| **Header & nav** | Transparent over the hero, then Graphite at 85% with backdrop blur after scroll | — | Flat horizontal lockup. Nav in Inter 500, sentence case. One primary CTA. The active item gets a 1 px champagne underline. |
| **Hero** | Obsidian | Mode A (opening sequence) | Display headline in a haze zone with a measured scrim (Obsidian gradient, 0 → 70%). Text meets AA on the scrim. |
| **Featured: MA'LOA** | Obsidian/Deep Slate | Project visuals; mode B band optional | **Labelled as a self-initiated concept redesign, not client work.** No invented client, results, metrics or testimonials. |
| **Services** | Ice White | None or a small mode B detail | Typographic grid, Steel Ink labels, hairline dividers. |
| **Pricing** | Snow | None | Tabular numerals. One emphasised plan on Deep Slate with Ice text, no gold. Prices and inclusions are readable in 5 seconds. |
| **Process** | Ice White, with an optional mode B/C band before it | Eagle transition candidate | Numbered steps in large Steel Blue numerals (decorative, ≥ 48 px). |
| **FAQ** | Snow | None | Accordion with a +/− icon in a 1.5 px stroke. Keyboard and screen-reader accessible. |
| **Contact** | Obsidian | Mode A/B close | Form on Graphite surfaces with Steel Light focus rings and visible labels, not placeholders only. |
| **Footer** | Obsidian | None | Flat logo, Potsdam \| Berlin, a champagne hairline signature, legal links (Impressum, Datenschutz). |

### Identity without imagery

These are what keep the brand recognisable when no mountain is on screen:

1. **Typographic voice:** tight Space Grotesk headlines, generous whitespace, strict alignment.
2. **The flank angle:** the logo's 58° appears in rare graphic cuts, such as section edge masks or the corner of the featured project frame. Never as a repeated pattern.
3. **Hairlines:** 1 px dividers and the champagne signature rule.
4. **Sharp geometry:** radius 2 px (buttons, inputs) and 4 px (cards). No pills, blobs or soft shadows. Elevation on dark comes from Graphite; on light, from a 1 px line.
5. **Grid:** 12 columns, max content width 1320 px, 24 px gutters, outer margin `clamp(16px, 5vw, 64px)`, 8 px spacing base.

### Components (identity-level)

- **Primary button:** Ice White fill with Obsidian text on dark, and Obsidian fill with Ice text on light. 2 px radius.
- **Secondary button:** 1 px border plus text.
- **Focus:** a 2 px outline with 2 px offset, Steel Light on dark and Steel Ink on light. Always visible.

---

## 10. Do's and don'ts

**Do**

- Let one strong image carry a section, and keep the rest typographic.
- Keep the key light upper-left everywhere: logo, mountains, eagle.
- Alternate dark and light sections for rhythm and readability.
- Keep champagne rare enough that people notice it.
- Label MA'LOA as a self-initiated concept redesign. State only verifiable facts.
- Test every image with real headline text placed on it.

**Don't**

- Use the mountain as wallpaper behind every section.
- Use a serif or italic display face. That is the luxury-hospitality register, not ours.
- Use gold gradients, gold buttons or gold text on light backgrounds.
- Use saturated blue, neon, glows, lens flares or glitch effects.
- Show a bald eagle, aggressive eagle poses or the eagle in more than three moments.
- Mix the photo-textured centre peak back into the logo.
- Use gaming-style chrome lettering, fantasy landscapes or outdoor-brand clichés (summit flags, hikers, compasses).
- Put body text directly on imagery.

---

## 11. Asset production checklist

**Logo**

- [ ] Vector redraw of the symbol per §2.1 (construction grid documented)
- [ ] Small-size tests at 16, 24, 32 and 64 px, on dark and light
- [ ] Wordmark set and kerned; horizontal and stacked lockups
- [ ] Favicon set (SVG, 32/16 ICO, 180 apple-touch, 512 maskable)
- [ ] Cinematic logo render: still (16:9, 1:1) built **from the final vector**, not AI-generated letterforms
- [ ] Cinematic logo reveal sequence (for the opening)

**Mountains**

- [ ] Style frame per mode (A, B, C), approved before any volume production
- [ ] Hero opening sequence: storyboard of 6–8 frames, then sequence
- [ ] 2–3 mode B content bands (desktop 21:9 and mobile 4:5 crops, art-directed separately)
- [ ] Contact close still
- [ ] Reduced-motion stills for every sequence

**Eagle**

- [ ] Reference set (4 poses, same light)
- [ ] Two-shot continuity test
- [ ] Production-route decision: generated, 3D or licensed footage

**Website system**

- [ ] Colour tokens (CSS custom properties) from §3
- [ ] Type tokens from §4, with the font loading strategy (variable WOFF2, `font-display: swap`, subset Latin + Latin Extended for German)
- [ ] OG/social image templates (dark and light)

**Quality gate for every image:** palette grade check, key light direction, no artefacts at 100% zoom, a text-zone check with a real headline, file weight within budget (hero poster under 250 KB AVIF on mobile).

---

## 12. Decision status

### Locked (confirmed by the client, 2026-10-10)

- Positioning: Premium Websites for Ambitious Businesses
- Art direction: hybrid, with a cinematic introduction and a clean technological website. Technology leads.
- Languages: English primary, German secondary
- Typography: Space Grotesk + Inter, no serif display face
- Logo: flat monochrome for the interface; metallic for the homepage opening and selected brand moments
- Logo geometry: keeps the AIK letterforms and three distinct peaks, with no overall M silhouette. Generic mountain icon rejected.
- Eagle: Hero and selected transitions only, at most 3 appearances, gliding only, never attacking
- MA'LOA: self-initiated concept redesign, not client work
- Cinematic opening: homepage only
- No real-time 3D in v1

### Confirmed by this document

- The six core palette values are unchanged, plus four functional tints for accessibility (contrast measured, §3.2)
- Champagne limited to ≤1% and never used as text on light
- Three image modes A/B/C sharing one world, with the key light upper-left
- Golden eagle, not bald eagle
- Reduced-motion fallbacks required for all motion

### Still needs testing

See §13 for status and §13.6 for the closing checklist.

**Note on tools:** an image/video generation integration (Higgsfield) is connected to this workspace. It has **not** been used or capability-checked. No assets have been generated.

---

## 13. QA, Stage 5A (2026-10-10)

**Method and limits**

- The repository contains **no logo source files** (no SVG, AI or PDF). The only material is the two AI-generated raster references.
- Logo QA was done by cropping the symbol from each reference, downscaling it with Lanczos to 16/24/32/48/64 px tall (also fitted into a square, for favicon use), and inspecting the result. Stroke and gap widths were measured on a horizontal pixel profile of Ref 01.
- This tests the **reference geometry only**. The redrawn flat logo (§2.1) does not exist yet, so every check on it is *not verified*.
- No real devices were used. Media findings are labelled **[documented]** (specs and platform documentation), **[arithmetic]** (calculated) or **[hypothesis]** (to be tested).

### 13.1 Logo QA, 16–64 px

**Ref 01 measurements**

At the cut through the I and K (symbol crop 1045 × 455 px):

| Element | Source width | At 16 px | At 24 px | At 32 px | At 48 px | At 64 px |
|---|---|---|---|---|---|---|
| I stem | ≈ 43 px | ≈ 1.5 px | 2.3 px | 3.0 px | 4.5 px | 6.0 px |
| Gap from I to K stem | ≈ 48 px | ≈ 1.7 px | 2.5 px | 3.4 px | 5.1 px | 6.8 px |
| Gap from K stem to chevron | ≈ 19 px | ≈ 0.7 px | 1.0 px | 1.3 px | 2.0 px | 2.7 px |

The two parallel diagonals left of the A are separated by gaps of the same order as the K gap.

| Check | Ref 01 (AIK monogram) | Ref 02 ("logo direction") | Redrawn flat logo |
|---|---|---|---|
| AIK letter recognition | **Fail** ≤24 px (letters merge into the background photo). **Pass** ≥32 px. | **Fail** at all sizes: no crossbar on the A, no upright on the K, reads "A1\\" | Not verified |
| Three distinct peaks | **Fail.** Side peaks dissolve into the background mountains ≤32 px. The centre peak dominates (M silhouette) at every size. | Partial: three peaks visible ≥32 px, but the dominant centre still reads as an M. **Fail** | Not verified |
| K diagonals connected to upright | **Fail.** The 19 px source gap shows as a detached chevron ≥48 px and blurs ≤32 px. | **Fail** (no upright) | Not verified (rule set in §2.1) |
| Stroke separation | **Fail** ≤32 px: gaps under 1.5 px merge, and the left parallels form one wedge | **Fail** ≤24 px | Not verified |
| Optical balance and negative space | **Fail.** Mass is concentrated in the photo-filled centre peak; the right flank trails off-balance. | Pass ≥48 px; centre-heavy | Not verified |
| Favicon / compact UI (square, 16–32 px) | **Fail.** The symbol is ≈ 7–14 px tall in the square and unreadable. | **Fail** | Not verified |

**Conclusions**

- Neither reference is usable as an interface logo. The vector redraw is mandatory, not optional.
- A **simplified favicon variant is required.** At 16 px the full geometry produces gaps under 1 px. The variant keeps three peaks and the I stem, drops the A crossbar and the second flank layer, and uses a heavier stroke.
- **Size guidance for the redraw** (target, to be verified on the vector):
  - Every stroke must be at least 2 px and every gap at least 1.5 px at the smallest permitted size. In construction terms: stroke ≥ 1/12 and gap ≥ 1/16 of symbol height.
  - **Full symbol:** minimum 32 px tall. Use 24–31 px only after a passing test.
  - **Horizontal lockup:** minimum 140 px wide.
  - **Below 32 px:** use the simplified favicon variant.
  - At 1× density, Ref 01's own geometry would need **≥ 48 px** for the K gap to reach 2 px.

### 13.2 Eagle consistency QA

**Evidence available:** one eagle, in Ref 02 panel C, about 260 × 170 px, AI-generated.

| Check | Result |
|---|---|
| Species | **Fail.** It's a bald eagle, not the locked golden eagle. |
| Anatomy | **Fail.** There's a second white mass on the back (a duplicated head/nape artefact), and the white tail has dark banding, which is wrong for an adult bald eagle. |
| Behaviour | **Fail.** It's in a wing upstroke flap, not a glide. |
| Lighting | Partial. Cool and overall consistent with the scene, but too low-resolution to judge the feathers. |
| Usability as a reference | **Fail.** Mood only; do not use it as an input image. |

**Missing evidence:**

- golden-eagle reference set (4 poses)
- any two-shot continuity test
- the production-route decision

**Consistency rules** (binding for every eagle asset):

1. **Silhouette:**
   - adult golden eagle, gliding
   - wings held in a slight dihedral (shallow V)
   - 5–7 separated "fingered" primaries per wing
   - tail fanned modestly, never fully spread
   - head forward and level
2. **Proportions:**
   - wingspan about 2.2× body length (nose to tail tip)
   - wing chord about 0.2× span
   - tail about 0.35× body length
   - these are checked as the same ratios in every shot
3. **Coloration:**
   - umber-brown body, graded toward Graphite
   - tawny-golden nape (the only warm element)
   - darker primaries
   - no white head, no white tail band (adult plumage)
   - same grade LUT across all shots
4. **Lighting:**
   - key light upper-left, from the same scene source
   - underside in shadow with cool snow bounce
   - matte feathers, tiny specular highlights only on the leading edge and nape
5. **Camera:**
   - eye level or slightly below the bird (looking up 5–15°), never top-down in hero shots
   - eagle fills 8–25% of frame width
   - at most one near-camera wing pass across the site
6. **Flight direction:**
   - a single site-wide vector, **left → right with a slight climb**, matching the reading direction and the logo light
   - transitions continue that vector
   - no reversals between consecutive shots
7. **Approval gate:** an eagle shot is accepted only if it matches all six rules and the previous shot side by side.

### 13.3 Image sequence vs video (scroll-driven scene)

| Criterion | Image sequence (canvas) | Video (`<video>` + `currentTime`) |
|---|---|---|
| Scroll sync | Frame-exact: draw frame *n* for scroll position *n* **[documented: canvas `drawImage`]** | Each scroll update is a seek. The decoder must start from the previous keyframe, so latency grows with keyframe interval **[documented codec behaviour]** |
| Reverse scrubbing | Same cost as forward **[arithmetic: random access]** | No native reverse decode; every backward step is a seek. Smooth only with all-intra or very short GOP encoding, which inflates the file **[documented]**. Actual smoothness per browser **[hypothesis]** |
| iOS Safari | Canvas works, but browser-imposed canvas memory caps can blank the canvas **[hypothesis; reported limits must be verified on device]** | Inline autoplay requires `muted` + `playsinline` **[documented]**. Low Power Mode can block autoplay **[documented by WebKit behaviour; verify]**. Seek smoothness **[hypothesis]** |
| Android Chrome | Good on mid-range devices if decoded frames are bounded **[hypothesis]** | Seeking generally works; smoothness depends on hardware decoder **[hypothesis]** |
| Memory | Decoded frame = w × h × 4 bytes. 1600 × 900 is 5.8 MB per frame, so 96 frames is ≈ 553 MB: never keep all frames decoded **[arithmetic]** | One decoder; low, steady memory **[documented]** |
| Decoding cost | AVIF decode is CPU-heavy. Decode off the main thread with `img.decode()` / `createImageBitmap` **[documented APIs]**; per-frame cost on devices **[hypothesis]** | Hardware decoding; cheap for forward play, expensive for repeated seeks **[documented]** |
| Network | Many small files over HTTP/2. Can load progressively (coarse frames first). Larger total, since there is no inter-frame compression **[documented]** | One file with range requests and inter-frame compression, so it's much smaller. A scrub can stall on unbuffered ranges **[documented]** |
| Mobile fallback / reduced motion | Show one still frame. Trivial **[arithmetic]** | Show the poster. Trivial **[documented]** |

**Recommendation (provisional):**

- **Image sequence** for the scroll-scrubbed homepage opening: frame-exact, symmetric reverse scrubbing, and progressive loading.
- **Video** only for non-scrubbed, autoplaying ambient clips, if any are added.
- The final decision follows the device test below.

**Device test plan (not yet performed)**

1. Build two throwaway prototypes of the same 4 s, 96-frame scene:
   - AVIF/WebP sequence, 1600 × 900 desktop and 720 × 1280 mobile
   - H.264 MP4 at the same sizes, in two encodings: GOP 1 (all-intra) and GOP 12
2. Test on these devices:
   - iPhone (current iOS, plus one 3+ year-old model)
   - iPad Safari
   - mid-range Android, around €250, on Chrome
   - desktop Safari, Chrome and Firefox
3. Measure:
   - frame drops during forward and reverse scrub (DevTools/performance traces, target ≥ 50 fps)
   - time to first scrubbable frame on throttled Fast 4G
   - peak memory (Safari Web Inspector, Chrome task manager)
   - canvas blanking or crashes
   - Low Power Mode and Data Saver behaviour
   - reduced-motion path
4. **Pass criteria:** no visible stutter on reverse scrub, peak tab memory ≤ 300 MB on mobile, first scrubbable frame ≤ 3 s on Fast 4G.

### 13.4 Provisional loading budget

**These are targets, not measured results.**

| Item | Mobile | Desktop |
|---|---|---|
| Initial homepage payload before the sequence (HTML + CSS + JS + fonts + poster, compressed) | ≤ 450 KB | ≤ 600 KB |
| HTML / CSS / JS (critical) | ≤ 30 / 40 / 60 KB | same |
| Fonts | 2 variable WOFF2 files, Latin + Latin-Ext subset, ≤ 120 KB total; preload only Space Grotesk | same |
| Hero poster (LCP image) | AVIF 720 × 1280, ≤ 120 KB | AVIF 1920 × 1080, ≤ 220 KB |
| Cinematic sequence | ≤ 72 frames at 720 × 1280, ≤ 25 KB per frame avg, **≤ 1.8 MB** total | ≤ 96 frames at 1600 × 900, ≤ 40 KB per frame avg, **≤ 3.8 MB** total |
| Decoded frames held in memory | ≤ 16 (≈ 59 MB) | ≤ 24 (≈ 138 MB) |
| Content image bands | 4:5, 1080 × 1350, ≤ 140 KB | 21:9, 2560 × 1100, ≤ 220 KB |
| Image formats | AVIF primary, WebP fallback; `srcset` widths 640 / 960 / 1280 / 1920 / 2560 | same |
| Logo / favicon | SVG ≤ 3 KB inline; ICO 16/32, 180 apple-touch, 512 maskable | same |
| OG image | 1200 × 630 JPEG ≤ 150 KB | same |
| Total homepage including sequence | ≤ 3 MB | ≤ 6 MB |
| Core Web Vitals (Google "good" thresholds) | LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on mid-range mobile, Fast 4G | same |

**Loading strategy (intended, not implemented)**

1. **Content first.** The hero headline, navigation and CTA are real HTML text over a static poster, so they're visible and usable at first paint. The poster is the LCP element and the only hero image preloaded.
2. **The sequence never blocks.** Frames start loading after first paint, when the browser is idle. Coarse frames load first (every 8th, then every 4th, then all), so scrubbing works early at reduced smoothness. If the user scrolls before a frame arrives, the nearest loaded frame is drawn.
3. **The rest of the page is independent.** Sections below the hero render and lazy-load normally. Scroll is never locked or delayed.
4. **Static fallback.** The poster plus the final frame (logo resolved) replace the sequence when any of these apply:
   - `prefers-reduced-motion`
   - a `Save-Data` header, or a slow connection (Network Information API, **Chromium only [documented]**)
   - low device memory (`navigator.deviceMemory`, **Chromium only [documented]**)
   - a load or decode failure
5. **Bounded decoding.** Decode around the current scroll position within the memory caps above, and release decoded frames when the hero leaves the viewport.

### 13.5 QA summary, blockers and risks

| Area | Status |
|---|---|
| Document reflects locked decisions | **Pass** (updated in this QA) |
| Colour contrast (§3.2) | **Pass** (measured) |
| Logo, Ref 01 at 16–64 px | **Fail** (≤32 px recognition, K join, separation, M silhouette) |
| Logo, Ref 02 at 16–64 px | **Fail** (no AIK letterforms) |
| Logo, redrawn flat vector | **Not verified** (does not exist) |
| Favicon variant | **Not verified** (required; does not exist) |
| Eagle consistency | **Fail** (only reference is the wrong species with artefacts); golden-eagle set **not verified** |
| Image sequence vs video | **Not verified** (desk analysis only; device test pending) |
| Loading budget | **Not verified** (targets only) |

**Blockers**

1. **No vector logo exists.** All logo checks on the actual identity are blocked until the flat SVG is drawn per §2.1 and §13.1.
2. **No usable eagle reference.** Rules 1–7 can't be verified until a golden-eagle reference set exists. Creating it is image generation and needs your approval.

**Risks**

- The redraw may still read as an M if the centre-peak ratio isn't held at about 100 vs 86/78.
- iOS canvas memory limits may force a smaller or shorter mobile sequence.
- AI-generated eagle continuity may fail, which would push production to the offline 3D or licensed-footage route (cost and time).
- German string lengths may break navigation and buttons at 360 px.

### 13.6 Checklist to close Stage 5A

- [x] Visual Identity v1.0 written and updated with the locked decisions
- [x] Contrast verified for all text pairings
- [x] Logo reference QA documented (16–64 px)
- [x] Eagle consistency rules defined
- [x] Media comparison, device test plan and provisional budgets documented
- [ ] **Flat vector logo drawn** (symbol, horizontal and stacked lockups) per §2.1
- [ ] Vector logo passes §13.1 at 24/32/48/64 px on dark and light
- [ ] Simplified favicon variant drawn and passes at 16/32 px
- [ ] Client approval of the vector logo
- [ ] Client approval of this document

The golden-eagle reference set, the mountain style frames and the media device test are **Stage 5B prerequisites**. They don't block 5A closure and each needs explicit approval before any generation or prototyping.

---

## Appendix: reference prompts for later asset generation

Use the **base block** in every prompt, then add a mode block. Keep the negative block constant.

**Base block**

> Photorealistic high-alpine winter landscape, dark granite and gneiss peaks with snow in couloirs and on ledges, deep winter, cold directional light from upper left, natural atmospheric perspective with blue-grey haze increasing with distance, clear foreground / midground / background separation, colour grade: shadows deep slate #253746 and obsidian #101419, midtones steel blue #647F93, highlights ice white #F2F5F7, desaturated, premium landscape photography, large calm negative space for typography.

**Mode A: Dark & Dramatic**

> Low-key exposure, low sun at 15° raking across ridgelines through a break in heavy cloud, cold rim light on snow edges, most of the frame in deep shadow, one small restrained warm highlight near the main ridge, cloud sea in the valley, 50 mm lens at ridge height, quiet sky zone upper third.

**Mode B: Clean & Epic**

> Mid-high key, high overcast with soft directional light, misty layered ranges fading to pale grey-blue, gentle shadows, calm and spacious, 85–135 mm compressed perspective, large pale sky area for dark text.

**Mode C: Bold & Immersive**

> High contrast, a massive rock face in the near midground with deep shadow, bright cloud shafts behind it, sense of immense scale, 35 mm lens, dynamic but stable composition.

**Eagle reference** (add to base)

> Adult golden eagle (Aquila chrysaetos) gliding, wings fully spread with separated fingered primary feathers, deep umber-brown plumage, tawny golden nape, matte feathers, lit from upper left with cool bounce light on the underside, mid-distance, eagle occupies 15% of frame, anatomically accurate. [pose: side glide / top-down glide / three-quarter underside / banking turn]

**Cinematic logo** (use the final vector as the input image; never ask the model to draw the letters)

> Extruded satin brushed-steel emblem from the supplied vector, sharp bevels, subtle fine stone-like micro-texture, cool environment reflections of an overcast alpine sky, a thin champagne (#B8A58A) edge highlight only on bevels facing an upper-left key light, obsidian #101419 background with faint haze, no glow, no lens flare, no bloom.

**Negative block**

> No orange or pink sunset, no sun disc in frame, no saturated blue sky, no lens flare, no bloom, no HDR halos, no fantasy spires, no floating rocks, no people, no flags, no buildings, no text, no watermark, no bald eagle, no cloned or repeating ridges, no smeared snow texture, no oversharpening.
