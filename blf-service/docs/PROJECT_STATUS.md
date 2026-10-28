# Project Status — BLF Service redesign

Last update: 2026-10-27 · Stages 01–03 approved; the "Revier" direction was
approved by the project owner. **Stage 04 Home prototype and tree intro
ready for review.** Not started: secondary pages (Stage 05).
## Stage 01 — Discovery, asset extraction, foundation

### Done

**Discovery**
- [x] Saved the supplied gallery HTML unmodified
      (`references/source-html/galerie.html`, SHA-256 `20649488…895b5`).
      It is byte-identical to the live page on 2026-10-26.
- [x] Parsed it with a script: 27 asset files, 0 duplicates, 62 `srcset`
      derivatives excluded; 9 gallery categories with image mapping, alt
      texts, widths and inferred upload dates.

**Tooling and audit**
- [x] Wrote and audited `scripts/fetch-originals.sh`. It is read-only,
      requests manifest URLs only over https, follows no redirects, never
      overwrites existing files or links, rejects non-image or empty
      responses, and logs the reason for every failure. It was tested
      against success, non-image, 404, cross-host 301, blocked host,
      existing file, dangling link and second-run cases.
- [x] Cross-checked the manifest (JSON and TSV), log and inventory tables
      field by field against the HTML.

**Retrieval** (after the network allowance)
- [x] **28 / 28 assets retrieved and verified.** That is the original 27
      plus `telefon.png` (ICO-08), found during the page audit.
      - All responses were HTTP 200 from the manifest URL, with no
        redirects.
      - Each file fully decoded; format matches Content-Type; SHA-256 and
        size recomputed; widths match the HTML.
      - No duplicate content, no EXIF/GPS in photos, SVG free of scripts.
      - The second run left all existing files untouched.
      - Records: `download-log-run1.tsv`, `download-log.tsv`,
        `asset-verification.tsv`.

**Pages and content**
- [x] Saved the other six pages unmodified in
      `references/source-html/pages-2026-10-26/` (all HTTP 200, no
      redirects; `page-fetch-log.tsv`), and the live stylesheet in
      `references/source-css/`.
- [x] Wrote the full content audit. It separates verified facts, site
      claims (quoted, not verified) and our own inferences, and lists issues
      found on the live site:
      - USt-IdNr. format in the Impressum;
      - undisclosed analytics;
      - broken contact-form recipient;
      - no job listings.

**Gallery and docs**
- [x] Visually reviewed all 19 gallery photos. 18 visibly match their tab,
      and GAL-16 is plausible. The upload filenames are the misleading
      signal, not the tabs.
- [x] **Gallery classification applied** after owner approval: 10 photos
      moved into their tab folders with `git mv`. Names and bytes are
      unchanged; checksums before and after are in
      `classification-log.tsv`. GAL-16 is kept in `_unclassified/` until
      the client confirms it.
- [x] Updated ASSET_INVENTORY, CONTENT_AUDIT, MISSING_INFORMATION (with 14
      German client questions) and this file.

### Remaining failures / open items

| Item | Status |
|---|---|
| Asset retrieval | none failed |
| Page retrieval | none failed |
| GAL-16 still in `_unclassified/` | Waiting for the client to confirm it shows a Baumkontrolle (client question 2) |
| Camera originals, vector logo, job content, Ma'Loa reference | Must come from the client or project owner. Not obtainable from the site |
| Contact form | Not submitted on purpose (it would send a real message to the client); delivery problem inferred from the HTML only |

### Not done on purpose

- No design, no frontend code, no dependencies added.
- `public/assets/optimized/` stays empty until the design defines sizes.
- Two CSS-referenced images were not retrieved: one is an Adobe Stock
  photo, both are unused template leftovers.
- Nothing was sent to or changed on the live site; only GET requests.
- The A135 landing page and all files outside `blf-service/` are unchanged.

## Folder structure

```
blf-service/
  public/assets/
    original/                  files exactly as served by the live site
      brand/                   BRD-01 logo
      icons/                   ICO-01…08
      gallery/
        baumfaellung/                GAL-01…04
        baufeldberaeumung/           GAL-05…09
        spielgeraeteaufbau/          GAL-10
        stubbenfraesen/              GAL-11, 12
        baumpflege-kronensicherung/  GAL-13
        winterdienst/                GAL-14, 15
        baumkontrolle/               (empty until GAL-16 is confirmed)
        hangbefestigung/             GAL-17, 18
        pflasterarbeiten/            GAL-19
        _unclassified/               GAL-16  (pending client)
    optimized/                 Stage 02+
  src/                         Stage 02+
  docs/
    PROJECT_STATUS.md
    research/   ASSET_INVENTORY, CONTENT_AUDIT, MISSING_INFORMATION,
                asset-verification.tsv, classification-log.tsv,
                download-log(-run1).tsv, page-fetch-log.tsv
    design/                    Stage 02+
  references/
    source-html/galerie.html
    source-html/pages-2026-10-26/{home,leistungen-preise,jobs,kontakt,impressum,datenschutz}.html
    source-css/27visu3806.min.css
    asset-manifest.json / .tsv
  scripts/fetch-originals.sh
```

## Stage 02 — UX architecture (documentation only)

### Done

- [x] `docs/research/USER_JOURNEYS.md`: customer and candidate journeys,
      today vs proposed, with friction points and conversion opportunities.
- [x] `docs/research/SITEMAP.md`: proposed hierarchy, URLs and 301s,
      purpose of each page, header/footer navigation. Legal pages are
      reachable from every page.
- [x] `docs/research/PAGE_ARCHITECTURE.md`: section-by-section outlines
      for Home, Leistungen, Galerie, Über uns, Karriere, Kontakt (goal,
      content, CTA, assets, desktop/mobile).
- [x] `docs/research/MOTION_SPEC.md`: scroll-driven gallery. 18 real
      photos in 8 service chapters; pinned desktop stage; reduced-motion
      and mobile fallbacks; no-upscaling caps; performance budgets; no
      chronology claims.
- [x] `docs/research/CLIENT_DECISIONS.md`: master list of 26 decisions for
      Daniel Witte (11 critical, 8 quality, 7 optional), each with a
      no-invention fallback, plus German questions.
- [x] Consistency review:
      - every D-ID is defined and used;
      - every photo ID exists, and GAL-16 is never used without its
        condition;
      - claims only appear with D-08;
      - the gallery sequence covers the 18 photos exactly once;
      - every quote presented as site text was checked against the saved
        pages. Five inexact quotes were corrected, including four in the
        Stage 01 CONTENT_AUDIT.

### Not done on purpose

- No visual design, no frontend code, no copywriting beyond labelled
  example microcopy.
- No changes to source HTML, assets or anything outside `blf-service/`.

### Stage 02 finalisation (2026-10-27)

Approved UX decisions recorded (SITEMAP §0; DESIGN_DECISIONS §1):
- **UX-01** Über uns → Home section `#ueber-uns`. PAGE_ARCHITECTURE Home
  §5 has blocks 5a–5e; §4 is kept as a pointer.
- **UX-02** Hybrid Galerie. MOTION_SPEC §6 is now a card layout on mobile.
- **UX-03** Dedicated Karriere page, with an Initiativbewerbung state, form
  fields, and privacy and security requirements.

Updated: SITEMAP, PAGE_ARCHITECTURE, USER_JOURNEYS, MOTION_SPEC,
CLIENT_DECISIONS.

Corrections (DESIGN_DECISIONS §8):
- D-08 extended with (h)–(j);
- new **D-27** (applicant-data workflow);
- D-20 moved to tier B as an implementation gate;
- the GAL-02/03 mobile size error fixed.

## Stage 03 — Art direction (documentation only)

### Done

- [x] Evidence gathered:
      - logo colours measured (`#32642A`, `#8BBB23`, `#DD9E09`); the site
        teal `#023435` is not in the logo;
      - photo palette measured (≈ 1 % green, earth tones dominate);
      - placeholder colour per photo computed;
      - all palette pairs measured for WCAG contrast;
      - og:image identified as a crop of the GAL-16 photograph.
- [x] `docs/design/ART_DIRECTION.md`: three directions, scored. The
      recommendation is **A "Revier"**, with the full system: palette,
      type, grid, image rules, icons, interface, accessibility,
      breakpoints.
- [x] `docs/design/DESIGN_TOKENS.md`: tokens with their source (logo,
      site, derived, proposed); alternative palettes measured.
- [x] `docs/design/MOTION_DESIGN.md`: hybrid gallery creative spec,
      including failure and fallback states.
- [x] `docs/design/VISUAL_REFERENCE_BRIEF.md`: references needed (none
      collected, no URLs), a photography shot list, the Ma'Loa checklist.
- [x] `docs/design/DESIGN_DECISIONS.md`: approvals, open questions
      DQ-01 – DQ-10, risks, the Stage 04 gate.

### Not done on purpose

- No CSS, JavaScript, components, mockups or new logo.
- No changes to source HTML, assets, production systems or anything
  outside `blf-service/`.

### Stage 03 review (2026-10-27)

- Checked: the approved UX decisions UX-01 – UX-03 are consistent across
  Stage 02 and 03 documents.
- Corrected:
  - **GAL-15** made conditional on D-12 everywhere (licence plate legible
    at gallery size, and on 2×/3× screens even when small);
  - two self-descriptions gated behind D-08 (k, l).
- Measured:
  - logo lettering at header sizes → new **DQ-11**;
  - real-font widths of German compound words;
  - font licences (OFL 1.1).
- New **DQ-12** (Markierung colour on light grounds).
- Details: DESIGN_DECISIONS §3 and §8.

## Stage 05 — Home page implemented with the D2 opening (2026-10-28)

The owner approved D2 and asked for the real implementation. The Home page in
`src/` now opens with the D2 stage and continues with all planned Home sections.
Not published (`noindex`); no deployment, no DNS or external system changed.

### Done

- [x] **Opening stage in `src/`** (ported from `concepts/d2-monument-system/`):
      `styles/stage.css`, `scripts/motion.js`, `scripts/growth.js`,
      `scripts/stage.js`. Monument words → light slit → growing tree → service
      rings with a working interaction (pointer on the rings, four keyboard
      buttons, live region) → real-work frame (GAL-13) → paper growing out of
      the frame. No dependencies.
- [x] **Robust by construction:** the stacked static layout is the CSS default;
      the cinematic stage switches on only when `stage.js` runs (`html.stage-on`).
      Reduced motion draws the grown tree once (`html.stage-static`). No JS or a
      failing script still gives the full page; a CSS fail-safe reveals the hero
      copy after 3.2 s if `stage.js` never runs.
- [x] **Mobile transition fix:** on phones and portrait tablets the real-work
      copy rests while the paper edge passes over it and returns dark on paper,
      so the edge never cuts through the heading. Desktop keeps the split-text
      reveal (both halves legible).
- [x] **Header and contact:** the site header is fixed; light-on-dark over the
      stage, paper elsewhere; the emblem sits on a paper plate (unchanged
      artwork). Phone + "Anfrage" stay in the header (desktop) and in the
      mobile action bar at every scroll position.
- [x] **All Home sections** after the stage: Notfall strip, Leistungen,
      Galerie preview, Über uns, Karriere (Initiativ), Kontakt, footer.
      Content unchanged from Stage 04 (verified text only).
- [x] **Images:** no visible image above 1.0 device px per source px
      (cinematic and static, DPR 1–3). Photo sizes in the stage are capped by
      the device pixel ratio (GAL-02 844 px, GAL-13 1125 px).
- [x] **Dark ground tokens** `--ground-990` / `--ground-1000` added to
      `tokens.css` (approved with D2).
- [x] **Old tree-logo intro removed** (`intro.js`, `intro.css`; still in Git
      history and documented in `docs/design/INTRO_PROTOTYPE.md`).
- [x] **QA script updated** for the new opening; results below.
- [x] **Screenshots:** `docs/screenshots/home-desktop-hero.jpg`,
      `home-mobile-hero.jpg`, `home-intro-keyframes.jpg`,
      `home-desktop-sequence.jpg`, `home-mobile-sequence.jpg`.

### QA (Playwright + Chromium only; no Safari/Firefox, no real devices)

`node scripts/qa/home-prototype-qa.js <outdir>`:

| Check | Result |
|---|---|
| Horizontal overflow | 0 px in 9 layouts (320–1440 px, DPR 1–3) |
| Upscaling | worst 1.0 device px per source px, incl. the stage scenes with photos |
| Console errors | 0 |
| Contrast | 158 text nodes (dark stage + paper), 0 below WCAG AA, minimum 5.49:1 |
| Keyboard | 30 stops with visible focus; tabbing into the service buttons brings the scene into view; Enter selects |
| Mobile menu | focus moves in, back on Esc |
| Intro | runs once per session, ends cleanly, no replay; skip by key and button |
| Service interaction | buttons, pointer on the rings, live detail text (desktop and mobile) |
| Transition | contact action and header controls reachable at every sampled position; document never clipped; screen readers get the real-work heading once; on mobile the edge never crosses visible copy |
| Reduced motion | static page, all content visible, 0 overflow (desktop + mobile) |
| No JavaScript | all content visible, review notes hidden |
| `growth.js` / `stage.js` failing | stacked page; hero copy visible after the 3.2 s fail-safe; buttons clickable |
| Review mode | notes only with `?review`; no forbidden claims or owner names |

Performance (headless, software rendering, CPU 4× slower): intro median
16.7 ms / p95 50–67 ms per frame, scroll median 16.7 ms — the same range as the
D2 concept.

### Still blocked / open (not resolvable in code)

| Item | Status |
|---|---|
| D-28 | Owner name unresolved (Daniel Trautmann vs. Daniel Witte); no name used anywhere |
| D-04 | No contact form: the live form's recipient is invalid; contact is phone + e-mail only until delivery is verified |
| Impressum / Datenschutz | Links point to the current live pages; legal texts need the owner (and D-28) before launch |
| D-12 / D-14 | GAL-03 and GAL-15 not used (permission/plate); GAL-16 excluded |
| D-08 | Unverified claims stay out (years, certificates, 24/7, etc.) |
| D-19 | No photo for Grün & Forst: the drawn tree is shown, labelled "Illustration" |
| Secondary pages | Leistungen, Galerie, Karriere, Kontakt pages not built (navigation uses Home anchors) |
| Publication | Not deployed; `noindex`; no DNS change |
| Browsers | Chromium only |

## Stage 04D revision — D2 (2026-10-27)

- [x] Isolated copy `concepts/d2-monument-system/` fixes D's three biggest
      visual weaknesses: drooping umbrella crown → round crown with distinct
      leaf groups; grey dark→paper cross-fade → paper grows as a ring out of
      the photo with legible copy on both sides; flat beam → light cone and
      lit/shaded leaves. D, A–C and `src/` unchanged.
- [x] Boards: `concepts/review/D2-hero-desktop.jpg`, `D2-hero-mobile.jpg`,
      `D2-intro-keyframes.jpg`, `D-vs-D2.jpg`. Details and QA:
      `docs/design/CONCEPT_D_MONUMENT_SYSTEM.md` §11.
- [x] Refinement pass: foliage masses, edge-stopped branches, bulging crown
      top, soft beam behind the tree (sheen removed), crown/copy clearance,
      short-phone sizing, mobile ring-label size + halo. Details and QA:
      `CONCEPT_D_MONUMENT_SYSTEM.md` §12; board
      `concepts/review/D2-refinement-before-after.jpg`.
- [x] Approved by the owner on 2026-10-28 ("proceed to final implementation").

## Stage 04D — Concept D: Forest Monument × Living System (2026-10-27)

### Done

- [x] New isolated prototype `concepts/d-monument-system/` that unifies B
      (dark monument), A (growing tree) and C (rings as service navigation).
      Concepts A, B, C and `src/` are untouched.
- [x] Intro 2.8 s (monument → slit → tree growth → beam), once per session,
      skippable; scroll scenes: system → interaction → real work (GAL-13)
      → paper.
- [x] Working ring/service interaction: hover/click on ring bands, four
      keyboard buttons (`aria-pressed`, live region), real photos GAL-02,
      06, 14; Grün & Forst shows the drawn tree labelled "Illustration"
      (no photo, D-19).
- [x] A's tree performance problem fixed (incremental drawing, cropped and
      merged canvases): intro p95 at 4× CPU 617 ms → 83 ms.
- [x] Checks: 0 console errors; 0 px overflow at 320–1440 px (JS, reduced
      motion, no JS); no visible image upscaled (max 0.92); keyboard order
      and focus; contrast ≥ 6.18:1 for all text; skip and session replay.
- [x] Review boards in `concepts/review/` (`D-*.jpg`,
      `comparison-B-C-D.jpg`); write-up and decisions:
      [`docs/design/CONCEPT_D_MONUMENT_SYSTEM.md`](design/CONCEPT_D_MONUMENT_SYSTEM.md).
- [x] No dependencies added; no logo reconstruction; no generated images.

### Open

| Item | Status |
|---|---|
| Direction | Owner: adopt D, or keep C |
| Dark ground tokens | `--ground-990` / `--ground-1000` need approval |
| Tree artwork, new copy, Grün & Forst illustration | Owner approval (§9 of the D document) |
| Scroll at 4× CPU | ≈ 30 fps in headless software rendering; not measured on devices |
| Browsers | Chromium only |

## Stage 04B — Creative reset: three directions (2026-10-27)

### Done

- [x] Three directions, each a working prototype of hero, intro and first
      three scroll scenes, in `concepts/`:
      - A · Lebender Baum (Canvas 2D generative tree);
      - B · Wald-Monument (canvas bark lettering, raking light);
      - C · Wald als System (SVG tree rings, contours, service names on
        the rings, photo window).
- [x] Full write-up, scores, recommendation (**C**) and decisions needed:
      [`docs/design/CREATIVE_DIRECTIONS.md`](design/CREATIVE_DIRECTIONS.md).
- [x] Real screenshot boards in `concepts/review/`: hero comparison,
      intro keyframes, scroll scenes. Review page: `concepts/index.html`.
- [x] Checks: 0 console errors; 0 px horizontal overflow at 320–1440 px;
      no upscaling at 1×/2×/3×; reduced-motion and no-JS fallbacks render
      a stacked page.
- [x] Logo: the authentic PNG only, unchanged. Category-B proposals (B
      relief, C tree-mark lockup) are labelled "Vorschlag B" on the page.
- [x] No dependencies added. Higgsfield not used (credits, and no generated
      imagery wanted next to real work).

### Not done on purpose

- No full website, no secondary pages; `src/` (the Stage 04 baseline)
  untouched.

### Open

| Item | Status |
|---|---|
| Direction | Owner to choose (recommended C) |
| Category-B logo proposals | Owner approval needed; until then only the unchanged emblem |
| A performance | Intro drops frames under CPU throttling; fix described, not built |
| Browsers | Chromium only |

## Stage 04 — Home prototype and tree intro (2026-10-27)

### Done

- [x] **Stack:** plain HTML, CSS and JS (no framework existed; no build
      step; no dependencies). Files:
      - `src/index.html`;
      - `src/styles/{tokens,site,intro}.css`;
      - `src/scripts/{intro,site}.js`.
- [x] **Fonts:** self-hosted, subset WOFF2 with OFL 1.1 licence files in
      `public/fonts/` (details in `public/fonts/README.md`).
      - Tabular figures verified: Newsreader has `tnum`; Hanken Grotesk has
        equal-width default digits at wght 400 but no `tnum`.
- [x] **Images:** derivatives in `public/assets/optimized/home/`, recorded in
      `derivatives.json`.
      - Never wider than the original; the native WebP is a byte copy.
      - Originals untouched (checksums verified).
- [x] **Home sections per PAGE_ARCHITECTURE §1:** header; hero with GAL-13;
      Notfall strip; services; gallery preview; Über uns (Home section,
      UX-01); Karriere teaser (Initiativ state, UX-03); contact; footer;
      mobile action bar.
- [x] **Content:** only verified text; all D-08 claims omitted; no personal
      name (D-28); internal notes only with `?review`.
- [x] **Tree intro:** a masked reveal of the authentic logo PNG
      (`docs/design/INTRO_PROTOTYPE.md`).
      - Full version ≈ 2.95 s; lite version on mobile ≈ 1.65 s.
      - Once per session; skippable; off under reduced motion.
      - CSS fail-safe if the script fails.
- [x] **Business-card photo** preserved in `references/client-supplied/`.
      No AI restoration (reasons in INTRO_PROTOTYPE §5).
- [x] **QA** (`scripts/qa/home-prototype-qa.js`, Playwright/Chromium,
      9 viewport/DPR combinations):

      | Check | Result |
      |---|---|
      | Horizontal overflow | 0 px at all widths 320–1440 |
      | Upscaling | ≤ 1.0 device px per source px everywhere |
      | Console errors | 0 |
      | Contrast | 165 text nodes, 0 below WCAG AA, minimum 5.49:1 |
      | Keyboard | 30 tab stops, visible focus on all |
      | Mobile menu | focus moves in, and back on Esc |
      | Intro | ends cleanly; no replay after reload; skip with Esc works |
      | Reduced motion | no intro; content visible |
      | No JavaScript | content visible; review notes hidden |
      | Logo fails to load | intro abandoned, page visible |
      | `intro.js` blocked | cover fades after 2.8 s and never blocks clicks |
      | Forbidden claims or names | none in the visible text |

- [x] **Bugs found and fixed during QA:**
      - the fail-safe cover could block clicks;
      - 320 px overflow (hero H1, service rows);
      - upscaling of the hero/Karriere photos on DPR ≥ 2.6 and the GAL-02
        card at DPR 3;
      - the gallery preview could stay hidden if `site.js` failed;
      - two QA-script bugs: a density-corrected `naturalWidth`, and lazy
        images in a horizontal scroller.

### Not available

- **No lint, build or test tooling exists in the project**; nothing like
  that was run. The checks above are the custom QA script plus
  `node --check` on all scripts.

### Known limitations / open

| Item | Status |
|---|---|
| DQ-11 | Header logo lettering ≈ 9 px on desktop and 5.7 px on mobile: barely legible / not legible |
| DQ-12 | Markierung reads brown on paper |
| D-28 | Owner name and logo lettering unresolved |
| Secondary pages | Leistungen, Galerie, Karriere, Kontakt, Impressum and Datenschutz not built. The navigation uses Home anchors; the legal links point to the current live pages |
| Contact form | None until D-04 |
| Browsers | Tested only in Chromium (Playwright). Safari and Firefox not tested; the intro uses SMIL and WAAPI, which both support, but this is not verified here |

## Before Stage 04 (historical)

1. Project owner: approve or adjust Direction A (DQ-01). Then present it to
   the client [D-20].
2. Send the client questions (`CLIENT_DECISIONS.md`). Critical: D-01 –
   D-11 and D-27; for design also D-10, D-11, D-12, D-20.
3. Supply the Ma'Loa material, or waive the comparison.
4. Font specimen and licence check (DQ-04).
5. When the client answers D-14, `git mv` GAL-16 accordingly.
6. Give explicit approval to start Stage 04.
