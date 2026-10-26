# Project Status — BLF Service redesign

Last update: 2026-10-26 · **Stage 01 complete, with asset retrieval
outstanding (blocked).** Waiting for approval before Stage 02.

## Stage 01 — Discovery, asset extraction, foundation

### Done

- [x] Saved the supplied gallery HTML unmodified as
      `references/source-html/galerie.html` (SHA-256 `20649488…895b5`).
- [x] Parsed it with a script, not by eye: 27 unique asset files
      (19 gallery photos, 1 logo, 3 footer icons, 4 favicons/og:image), 0
      duplicates, 62 `srcset` derivatives excluded.
- [x] Extracted 9 gallery categories with their image mapping, alt texts,
      widths and inferred Webflow upload dates.
- [x] Found that tab and filename conflict on 11 of 19 gallery images.
      These are routed to `_unclassified/`; the 8 that agree are filed by
      category, still marked *not visually verified*.
- [x] Wrote the asset manifest (`references/asset-manifest.json` and
      `.tsv`).
- [x] Wrote `scripts/fetch-originals.sh`: read-only, requests only the
      manifest URLs over https and follows no redirects, fetches only the
      largest file per image, never overwrites (existing files and links
      are left alone), rejects non-image or empty responses, and logs
      HTTP status, size, SHA-256 and the reason for every failure.
- [x] Stage 01 audit: re-derived the inventory from the committed HTML
      and cross-checked it field by field against the JSON, the TSV, the
      log and the inventory tables (all consistent). Tested the script
      against success, non-image, 404, cross-host 301, blocked host,
      existing file, dangling link and second-run cases.
- [x] Created the folder structure (below).
- [x] Wrote ASSET_INVENTORY, CONTENT_AUDIT, MISSING_INFORMATION (with
      German client questions) and this file.

### Failed / blocked

- [ ] **Asset retrieval: 0 of 27.** The environment's network policy
      refuses `www.blfservice.de` (proxy CONNECT refused; `blfservice.de`
      also does not resolve for the web-fetch tool). Per-file results are
      in `docs/research/download-log.tsv`. No substitutes were created.
- [ ] **Other pages not audited** (Home, Leistungen-Preise, Jobs, Kontakt,
      Impressum, Datenschutz). Blocked for the same reason.
- [ ] **Visual verification of gallery photos.** Depends on retrieval.

### Not done on purpose

- No design, no frontend code, no dependencies added.
- No image optimisation: `public/assets/optimized/` stays empty until the
  originals exist and the design defines the sizes it needs.
- Nothing was sent to or changed on the live site.

## Folder structure

```
blf-service/
  public/assets/
    original/            files exactly as served by the live site
      brand/             BRD-01 logo
      icons/             ICO-01…07
      gallery/
        baumfaellung/            GAL-01…04  (tab + filename agree)
        baufeldberaeumung/       GAL-05, 06
        winterdienst/            GAL-14, 15
        _unclassified/           GAL-07…13, 16…19  (conflict, needs review)
        spielgeraeteaufbau/ stubbenfraesen/ baumpflege-kronensicherung/
        baumkontrolle/ hangbefestigung/ pflasterarbeiten/   (empty until verified)
    optimized/           Stage 02+
  src/                   Stage 02+
  docs/
    PROJECT_STATUS.md
    research/            ASSET_INVENTORY, CONTENT_AUDIT, MISSING_INFORMATION, download-log.tsv
    design/              Stage 02+
  references/
    source-html/galerie.html
    asset-manifest.json / .tsv
  scripts/fetch-originals.sh
```

## Next steps, to close Stage 01

1. Get the assets, by either route:
   - run `bash scripts/fetch-originals.sh` from `blf-service/` on any
     machine with normal internet, then commit `public/assets/original/`
     and the new `download-log.tsv`; **or**
   - add `www.blfservice.de` to the environment's allowed domains, and the
     script can be run here.
2. Save the other six pages as HTML into `references/source-html/` and
   extend CONTENT_AUDIT.
3. Look at all 19 photos and confirm or correct the classification. Move
   files out of `_unclassified/` only after a person has confirmed them.
4. Send the German client questions (`MISSING_INFORMATION.md`).
5. Supply the Ma'Loa reference material.

## Stage 02

Not started. Requires explicit approval.
