# Asset Inventory — BLF Service

Stage 01 · updated 2026-10-26 (after retrieval)

Sources:
- `references/source-html/galerie.html`, the supplied copy of
  https://www.blfservice.de/galerie. SHA-256 `20649488…895b5`, byte-identical
  to the live page on 2026-10-26.
- `references/source-html/pages-2026-10-26/*.html`: the other six pages.
- `references/source-css/27visu3806.min.css`: the site stylesheet.

Machine-readable versions:
- `references/asset-manifest.json`: full metadata, status, checksum, dimensions.
- `references/asset-manifest.tsv`: input for `scripts/fetch-originals.sh`.
- `docs/research/asset-verification.tsv`: per-file verification record.
- `docs/research/download-log-run1.tsv`: first run, 27 files.
- `docs/research/download-log.tsv`: second run; ICO-08 added, 27 left untouched.

## Summary

| | Count |
|---|---|
| Unique asset files used by the site | **28** |
| — gallery photographs | 19 |
| — logo | 1 |
| — UI icons (footer ×3, Kontakt ×1) | 4 |
| — favicons / touch icon / og:image | 4 |
| Retrieved | **28 / 28** |
| Verified as valid images | **28 / 28** |
| Failed | 0 |
| Redirects encountered | 0 (none followed; the script follows none) |
| Duplicate content (identical SHA-256) | 0 |
| Referenced in CSS but unused on any page | 2, not retrieved ([below](#referenced-but-not-retrieved)) |
| Responsive `srcset` variants | 62 derivatives, deliberately not retrieved |

## Retrieval and verification

Everything was retrieved with `scripts/fetch-originals.sh` on 2026-10-26.
Every request returned HTTP 200 from its manifest URL with no redirect, so
for each file the final URL is the manifest URL. The `final_url` column in
`asset-verification.tsv` records it.

Each file was then checked independently of the server's claims:
1. **Full decode.** Pillow 12.3 for PNG/WebP; XML parse with an `<svg>`
   root for SVG.
2. **Real format matches the Content-Type.**
3. **SHA-256 and byte size** recomputed and matched against the log.
4. **Pixel width** matches the largest `srcset` width declared in the HTML.

All 28 passed. The script's second run left the original 27 untouched: same
checksums as run 1.

**Embedded metadata.**
- Photos: none of the 19 WebP files carries EXIF or GPS data.
- PNGs: they carry DPI values only. ICO-08 also has Adobe XMP, created in
  Photoshop on 2019-02-03.
- SVG (ICO-01): contains no script, event handler or external link.

**These are web exports, not camera originals.** All 19 photos are at most
1500 px on the long side; the narrowest is 843 px wide. The full-resolution
originals must come from the client.

## Gallery photographs (19)

URL pattern: `https://www.blfservice.de/images/` + the filename, URL-encoded.
Exact URLs and checksums are in the manifest.

| ID | Tab on site | Upload filename (as served) | Pixels | Filename agrees with tab? | Folder now |
|---|---|---|---|---|---|
| GAL-01 | Baumfällung | `673b3da814d72c9106ecbc2d_Baumfllung - 2.webp` | 1169×1500 | yes | `gallery/baumfaellung` |
| GAL-02 | Baumfällung | `673b3da4e8e7df7899dc6d1f_Baumfllung - 1.webp` | 844×1500 | yes | `gallery/baumfaellung` |
| GAL-03 | Baumfällung | `673b3d5acb65582a29633e4f_Baumfllung - 4.webp` | 843×1500 | yes | `gallery/baumfaellung` |
| GAL-04 | Baumfällung | `673b3d5a5f8ae2cc7cc51d2d_Baumfllung - 6.webp` | 1125×1500 | yes | `gallery/baumfaellung` |
| GAL-05 | Baufeldberäumung | `673b3da41a43f80a57dfd39a_Baufeldberumung - 4.webp` | 1500×1125 | yes | `gallery/baufeldberaeumung` |
| GAL-06 | Baufeldberäumung | `673b3da41e58a26c742897c5_Baufeldberumung - 2.webp` | 1125×1500 | yes | `gallery/baufeldberaeumung` |
| GAL-07 | Baufeldberäumung | `673b3d5a14d72c9106ec7ac9_Baumkontrolle - 1.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-08 | Baufeldberäumung | `673b3d6037647f3dce18a179_Forstwirtschaftliche Pflege - 2.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-09 | Baufeldberäumung | `673b3d608ebfd674e626d7a2_Forstwirtschaftliche Pflege - 1.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-10 | Spielgeräteaufbau | `673b3da41b2059277c60918e_Baufeldberumung -1.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-11 | Stubbenfräsen | `673b3da41f3fdb6a4fd756f7_Baufeldberumung - 3.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-12 | Stubbenfräsen | `673b3d5bea45ed2c55cb725f_Baumkontrolle - 2.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-13 | Baumpflege/ Kronensicherung | `673b3d5a6fb605502c7cbad5_Baumfllung - 5.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-14 | Winterdienst | `673b3d185f8ae2cc7cc4d089_Winterdienst fr Privat.webp` | 1125×1500 | yes | `gallery/winterdienst` |
| GAL-15 | Winterdienst | `673b3d181777a3a55a4d07c3_Winterdienst fr Privatd - 2.webp` | 1125×1500 | yes | `gallery/winterdienst` |
| GAL-16 | Baumkontrolle | `673b3d18d6c3bb2aa59ced35_Neuanpflanzung & freistellen von Neuanpflanzung.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-17 | Hangbefestigung | `673b3d169f797513d32da3d9_Straen-und Flchenreinigung - 2.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-18 | Hangbefestigung | `673b3d121777a3a55a4d053a_Grnflchenpflege fr Kommunen.webp` | 1125×1500 | no | `gallery/_unclassified` |
| GAL-19 | Pflasterarbeiten | `673b3d158a9d05ead665e4bf_Straen-und Flchenreinigung - 1.webp` | 1125×1500 | no | `gallery/_unclassified` |

Alt text on every gallery image is `"<Tab name> von Baum-Land-Forst "`. It
is generated from the tab and is not independent evidence.

### Visual review (2026-10-26, by the assistant, not yet confirmed by a person)

Each photo was viewed. The descriptions say only what is visible.

| ID | What is visible | Fits its tab? | Proposed category |
|---|---|---|---|
| GAL-01 | Climber with chainsaw and harness in a twin-stem tree; fresh cut on a stem | yes | Baumfällung |
| GAL-02 | Climber with chainsaw high on a pine trunk | yes | Baumfällung |
| GAL-03 | Man in helmet holding a chainsaw, standing on a very large fresh stump in front of a brick house. **Identifiable face** | yes | Baumfällung |
| GAL-04 | Aerial work platform beside a tree reduced to its main stems; overcast | yes (could also be crown reduction) | Baumfällung |
| GAL-05 | Cleared, levelled plot; house and green construction fence behind | yes | Baufeldberäumung |
| GAL-06 | Mini excavator on a cleared plot in front of a house, brush piles | yes | Baufeldberäumung |
| GAL-07 | Red compact wheel loader moving logs on a cleared wooded plot, green fence | **yes**. Nothing indicates tree inspection, as the filename says | Baufeldberäumung |
| GAL-08 | Partially cleared plot with cut stems and brush, green fence | yes | Baufeldberäumung |
| GAL-09 | Same type of red loader with logs and a worker; green fence | yes | Baufeldberäumung |
| GAL-10 | New wooden climbing frame with slide on a sand bed | **yes**, clearly a playground | Spielgeräteaufbau |
| GAL-11 | Close-up of a stump grinder working a stump, wood chips | **yes** | Stubbenfräsen |
| GAL-12 | Yellow mini excavator with a stump-grinder attachment, chips, green fence | **yes** | Stubbenfräsen |
| GAL-13 | Upward view of pines connected by a crown-securing rope system | **yes**, exactly | Baumpflege/ Kronensicherung |
| GAL-14 | Orange municipal vehicle with snow plough clearing snow at night | yes | Winterdienst |
| GAL-15 | Two orange vehicles with ploughs in a garage. **Licence plate partly legible** | yes | Winterdienst |
| GAL-16 | Large old multi-stemmed tree in woodland. No people, tools or inspection equipment | plausible, but nothing in the image *shows* an inspection | Baumkontrolle (needs client confirmation) |
| GAL-17 | Steep sand embankment with erosion-control mat laid in strips; two people at the top | **yes** | Hangbefestigung |
| GAL-18 | Long embankment fully covered with erosion-control mat, power pylon | **yes** | Hangbefestigung |
| GAL-19 | Grass-paver grid laid along a road, no-stopping sign, barrier | **yes** | Pflasterarbeiten |

**Result:**
- 18 of 19 photos visibly match their tab.
- GAL-16 is plausible but can't be proven from the image.
- The tabs, not the filenames, are the reliable signal. The filenames
  appear to come from a different set of names (the service names on
  *Leistungen*) and were not updated when the photos were sorted.

**Possible shared sites (unconfirmed):**
- GAL-07, 08, 09, 12 show the same style of green construction fence.
- GAL-07 and 09 show the same model of red loader.
- GAL-17 and 18 show the same embankment, pylon and fence line.

Other photos should not be assumed to belong together.

**Proposed action, awaiting human sign-off:** move the 11 `_unclassified`
files into the folder of their tab. GAL-16 should go there only after the
client confirms it. No file has been moved.

**Privacy notes for later use:**
- GAL-03 shows an identifiable face. On the Home page the same image has the
  alt text "Daniel Witte", the name in the Impressum. Whether the person
  shown *is* Daniel Witte is not confirmed.
- GAL-01, 02, 09 and 17 show workers who are not identifiable at this size.
- GAL-15 shows a partly legible licence plate.

### Gallery categories

| Tab | Photos | Upload filename agrees | Visually consistent |
|---|---|---|---|
| Baumfällung | GAL-01 – 04 | 4 / 4 | 4 / 4 |
| Baufeldberäumung | GAL-05 – 09 | 2 / 5 | 5 / 5 |
| Spielgeräteaufbau | GAL-10 | 0 / 1 | 1 / 1 |
| Stubbenfräsen | GAL-11, 12 | 0 / 2 | 2 / 2 |
| Baumpflege/ Kronensicherung | GAL-13 | 0 / 1 | 1 / 1 |
| Winterdienst | GAL-14, 15 | 2 / 2 | 2 / 2 |
| Baumkontrolle | GAL-16 | 0 / 1 | plausible |
| Hangbefestigung | GAL-17, 18 | 0 / 2 | 2 / 2 |
| Pflasterarbeiten | GAL-19 | 0 / 1 | 1 / 1 |

Services listed on *Leistungen* with **no photo at all**: Notfällung,
Straßen- und Flächenreinigung, Neuanpflanzung & Freistellen, Grünflächenpflege
für Kommunen, Forstwirtschaftliche Pflege.

### Upload dates (inferred from Webflow asset IDs; upload date, not shooting date)

| Prefix | Date (UTC) | Assets |
|---|---|---|
| `67172816…` | 2024-10-22 | ICO-01, ICO-08 and the Webflow site ID (site creation) |
| `673b3d…` | 2024-11-18 | all 19 gallery photos, one upload session |
| `67458513…` | 2024-11-26 | ICO-02, ICO-03 |
| `68d4a4d8…` | 2025-09-25 | BRD-01 logo; matches `og:updated_time` on all pages |

## Brand

| ID | Role | File | Pixels | Bytes | Folder |
|---|---|---|---|---|---|
| BRD-01 | Logo (header, every page) | `68d4a4d8f70ae14d90397b58_Logo_273806.png` | 1966×1966, 300 dpi | 231 424 | `original/brand` |

The logo exists only as a square raster PNG; no vector version is served.
Brand colours and fonts as they appear in the live CSS are in
`CONTENT_AUDIT.md` → *Visual system*.

## Icons and meta images

| ID | Role | File | Pixels | Bytes |
|---|---|---|---|---|
| ICO-01 | Footer: location pin (white) | `671728166b73774eeddb0c46_Icon Standord weiss.svg` | viewBox 24.51×24.63 | 747 |
| ICO-02 | Footer: person | `67458513426c3dea54c5007f_man.webp` | 1280×1415 (shown at 20 px) | 13 836 |
| ICO-03 | Footer: list | `67458513f61b5780b6df35df_list.webp` | 1280×1323 (shown at 20 px) | 16 214 |
| ICO-04 | Favicon | `favicon-32x32.png` | 32×32 | 2 551 |
| ICO-05 | Favicon | `favicon-16x16.png` | 16×16 | 794 |
| ICO-06 | Apple touch icon | `apple-touch-icon.png` | 180×180 | 44 613 |
| ICO-07 | `og:image` (every page) | `9ff3c141fff45f951ad41f1893eec7f4.png` | 1200×634 | 1 468 416 |
| ICO-08 | Kontakt page: phone icon | `671728166b73774eeddb0b99_telefon.png` | 91×115 | 3 132 |

ICO-08 was found in the page audit and added to the manifest. Its embedded
XMP shows it was made in Photoshop in 2019, before this site existed. It is
a template icon, not client material.

## Referenced but not retrieved

| Reference | Where | Why not retrieved |
|---|---|---|
| `images/671728166b73774eeddb0c4c_AdobeStock_17496330_visu.jpg` | CSS class `.essen-bild2` | The class is used on **none** of the 7 pages. The filename says **Adobe Stock**, so it is a licensed stock image, not a client photo. "essen-bild" means "food image", a leftover from another template |
| `images/671728166b73774eeddb0c22_2.png` | CSS class `.video-2` | Used on none of the 7 pages; template leftover |
| `images/custom-checkbox-checkmark.589d534424.svg` | CSS (Webflow default) | Framework UI glyph |
| `uploads-ssl.webflow.com/64106608…/…_27375-menu-burger-1.json` | Lottie, every page | Burger-menu animation under a different Webflow site ID; third-party template asset |
| 62 `srcset` variants | gallery, logo, icons | Downscaled derivatives |
| 108 `@font-face` files under `ILD_uploadTool/fonts/` | CSS | Generic font library of the template; only a few families are used |
