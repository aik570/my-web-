# Cinematic intro: storyboard v3 correction plan

**Status: proposal only. Nothing generated. Waiting for owner approval.**

## 1. Reference review (owner references, 10.10.2026)

| Reference | What it is | How it is used |
|---|---|---|
| Eagle image **2** (dark eagle over sunlit ridges) | Golden eagle: dark umber body, golden nape, broad wings, warm rim light | **Primary eagle reference**: species, plumage, wing shape, rim light |
| Eagle image **1** (eagle over blue snow peaks) | **Bald eagle**: white head, white tail, saturated blue grade | **Wing anatomy and feather detail only.** Its head, tail and colour are not used |
| AIK logo-and-mountain reference (= `references/ref-01`) | Dark cinematic massif, navy/obsidian shadows, silver highlights, a warm light leak from the upper left, wet foreground rock | **Primary environment reference** for depth, light and grade |
| Moodboard (= `references/ref-02`) | Modes A/B/C. Panel C contains a bald eagle | Mood only; panel C's eagle is excluded |

**Note on the owner brief:** the brief calls "the first attached image" the golden eagle with the golden nape. In the attachment order the first image is the bald eagle and the second is the golden eagle. This plan follows the content (image 2 = golden eagle). Please confirm.

## 2. Gap: v1 storyboard against the v3 direction

The v1 frames could not be inspected in this environment (the Higgsfield CDN is blocked), so this gap analysis is based on the v1 prompts and the owner's review, not on pixel inspection.

| Aspect | v1 (as prompted) | v3 direction | Consequence |
|---|---|---|---|
| Light | Blue hour, cold, desaturated; warm only as one tiny accent | Deep navy/obsidian shadows **plus** selective silver highlights and warm champagne sun on ridges | Environment must be rebuilt, not regraded |
| Depth | Three planes, calm | Dark detailed foreground cliffs, a deep valley with strong vertical scale, several distant layers, volumetric fog in the valleys | New compositions for 04–07 |
| Eagle | Side or three-quarter, crossing the frame left → right | **Follow camera behind and slightly above** the eagle, leading into the valley and pass; subtle banks | 05 and 06 recomposed; the eagle sheet needs a rear/above view |
| Eagle look | Cool key light, matte | Golden eagle with **warm rim light** from the sun side | New eagle sheet |

### Identity rules affected

These need owner confirmation; they will be recorded in the visual identity document after approval.

- **§7 warmth:** v3 allows warm champagne light on selected ridges, not only on the logo. Proposed limit: warm light on ≤ 15% of any frame, only on sun-facing ridge edges and the eagle's rim, never on shadows or sky.
- **§6 flight direction:** the "left → right" rule becomes **"away from camera into depth, with a gentle bank to the right"**. It stays consistent between shots, with no reversals.

## 3. Recommended minimum regeneration set

All four story beats depend on the new environment and eagle, so continuity requires regenerating the chain. The mobile checks are postponed until the desktop frames are approved.

| # | Frame | Why | References | Credits |
|---|---|---|---|---|
| A | **Eagle reference sheet v3** | Warm rim light, plus the rear/above follow view the new camera needs | text only (see §4) | 2.75 |
| B | **Shot 04 v3: environment master** | Defines the geography, depth, fog and warm/cool light for the whole chain | crop of `ref-01` (environment only, logo cropped out) | 2.75 |
| C | **Shot 05 v3: eagle enters, camera behind and above** | New camera concept | B + A | 2.75 |
| D | **Shot 06 v3: deep in the pass** | Same geography from inside the valley | B + A | 2.75 |
| E | **Shot 07 v3: final plate with logo space** | Must match B's geography and grade | B | 2.75 |
| | **Total** | 5 frames at high quality 2k | | **13.75** |

**Budget**

| | Credits |
|---|---|
| Approved cap | 34.00 |
| Already spent (v1) | 19.25 |
| This set | 13.75 |
| **Total** | **33.00**, leaving 1.00 (no retries) |

The mobile 9:16 checks for 04 and 07 (2 × 2.75 = 5.50) and any retry would exceed the current cap and need a new approval.

**Cheaper option, 11.00 credits:** reuse the v1 eagle sheet (skip A) **if** the owner judges its plumage and anatomy correct. Its cool lighting would then have to be overridden by the shot prompts, which carries a higher risk of the eagle not matching.

## 4. Draft prompts (to be submitted only after approval)

The common grade and light block is prepended to B–E:

> Photorealistic cinematic alpine environment matching the reference: deep navy and obsidian shadows, dark wet granite, monumental angular peaks with crisp snow on ledges and couloirs, selective silver highlights, warm champagne sunlight from the upper left grazing only the sun-facing ridge edges, volumetric fog lying inside the valleys, several layers of distant ranges fading into blue-grey haze, strong separation of foreground, midground and background, premium film look, no text, no logo, no letters, no watermark, no lens flare, no orange sunset, no fantasy spires.

- **A, eagle sheet v3:**
  > Adult golden eagle (Aquila chrysaetos) photographic reference sheet on a dark graphite seamless background, four views of the same bird: rear view from slightly above gliding away from camera, rear three-quarter view banking gently right, side view gliding right, top-down view. Broad long wings fully spread with 6–7 separated fingered primaries, dark umber-brown plumage, golden nape and crown, warm rim light along the wing edges and nape from a low sun at the upper left, cool shadow side. Powerful, majestic, anatomically accurate, consistent proportions in all views. Not a bald eagle: no white head, no white tail. No text.
- **B, shot 04 v3 (environment master):**
  > [BLOCK] Wide establishing view from high above a deep alpine valley, 35mm. Dark detailed cliffs fill the near left and right foreground. A deep valley falls away in the centre with strong vertical scale, filled with volumetric fog. A monumental massif of three angular snow-covered summits of different heights rises beyond, the centre highest but not dominant. A narrow pass between the centre and right summits is visible as the route ahead.
- **C, shot 05 v3:**
  > [BLOCK] Same geography as the first reference. The camera follows behind and slightly above an adult golden eagle (second reference) gliding away from camera into the valley toward the pass, wings fully spread, banking gently right. The eagle is in the lower centre, about 18% of the frame width, with warm rim light on its wing edges and golden nape. The valley and fog below give a strong sense of height.
- **D, shot 06 v3:**
  > [BLOCK] Same geography, now inside the pass. Steep dark rock walls rise on both sides; fog layers ahead part; a shaft of warm champagne light falls across the far ridge. The same golden eagle is seen from behind and slightly above, smaller (about 10% of the frame width), leading the camera deeper and banking right.
- **E, shot 07 v3 (logo plate):**
  > [BLOCK] Same geography, emerging beyond the pass, 85mm compression. The three summits of the massif sit in the lower 45% of the frame with fog in the valleys and warm light on their ridge edges. The upper 55% is a calm, dark, softly lit sky with no detail, clouds or objects, kept clean for compositing a logo. No birds.

## 5. Process

1. Upload one **crop of `ref-01`** that excludes the logo and text (left mountains, sky and foreground rock) as the environment reference. This keeps the model from copying letterforms into the scene. Uploading costs no credits.
2. Generate **A and B first** (5.50). Then generate **C, D and E** referencing B (and A for the eagle) (8.25).
3. Present the gallery and stop for review. No video.

## 6. Limitations

- I cannot view Higgsfield results from this environment (CDN host `d8j0ntlcm91z4.cloudfront.net` blocked). Quality judgement relies on the owner's review in the gallery until that host is allowed.
- The owner's eagle images appear to be third-party Pinterest posts. They are used only as written direction; they will **not** be uploaded as generation inputs unless the owner confirms they may be used that way.
