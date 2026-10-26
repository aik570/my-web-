# Project Status — BLF Service redesign

Last update: 2026-10-26 · **Stage 01 complete and approved.** **Stage 02
(UX architecture) complete.** Waiting for approval before Stage 03.
GAL-16 still waits on the client (D-14).

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

## Before Stage 03

1. Send the client questions in `CLIENT_DECISIONS.md` (**critical:
   D-01 – D-11**).
2. Supply the Ma'Loa reference material (MOTION_SPEC §0 checkpoint).
3. Decide whether Über uns is a page or a Home section (SITEMAP §4).
4. When the client answers D-14, `git mv` GAL-16 accordingly.
5. Give explicit approval to start Stage 03.
