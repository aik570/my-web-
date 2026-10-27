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
