# Asset Inventory — BLF Service

Stage 01 · compiled 2026-10-26 · source: `references/source-html/galerie.html`
(saved copy of https://www.blfservice.de/galerie, SHA-256
`20649488fa38aa74df9a0f6aae14ed1bb26848647dea49480e0a785e1df895b5`).

Machine-readable versions of this table: `references/asset-manifest.json`
(full metadata) and `references/asset-manifest.tsv` (input for
`scripts/fetch-originals.sh`).

## Summary

| | Count |
|---|---|
| Unique asset files referenced in the HTML | **27** |
| — gallery photographs | 19 |
| — logo | 1 |
| — footer icons | 3 |
| — favicons / touch icon / og:image | 4 |
| Duplicate references (same file used twice) | 0 |
| Responsive variants in `srcset` (`-p-500`, `-p-800`, `-p-1080`) | 62 — derivatives, deliberately not inventoried as separate assets |
| Retrieved | **0** — see [Availability](#availability) |

## Availability

None of the 27 files could be retrieved. The build environment's network
policy refuses connections to `www.blfservice.de`, so every request failed
before it reached the site (proxy `CONNECT` refused, HTTP 000). That says
nothing about whether the files exist on the live site. The per-file result
is in `docs/research/download-log.tsv`.

To retrieve them, run `bash scripts/fetch-originals.sh` from `blf-service/`
on a machine with normal internet access. The script fetches only the
largest file per image, skips files already present, rejects non-image
responses and rewrites the log with HTTP status, byte size and SHA-256.

**"Original" here means the largest file the live site serves.** These are
Webflow exports, mostly 1125 px wide WebP. They are not camera originals.
For a premium redesign the full-resolution source photos must come from the
client (see `MISSING_INFORMATION.md`).

## How to read the classification

The gallery has nine tabs. For each image there are three independent
signals: the **tab** it sits in, its **alt text** and its **upload
filename**. Alt text is generated from the tab ("<Tab> von Baum-Land-Forst ")
on every image, so it adds no independent evidence. Only tab vs. filename
can disagree, and they disagree on 11 of 19 images.

- **Agree** → stored under that category, marked *not visually verified*.
- **Conflict** → stored in `gallery/_unclassified/` until a person has
  looked at the photo.

No photo has been visually inspected yet, because none could be downloaded.

Webflow strips umlauts from upload names (`Baumfällung` → `Baumfllung`,
`für` → `fr`, `Straßen` → `Straen`). The filenames below are reproduced
exactly as served.

## Gallery photographs (19)

Base URL for all rows: `https://www.blfservice.de/images/` + the filename,
URL-encoded (exact URLs are in the manifest).

| ID | Gallery tab | Filename (as uploaded) | Width | Agree? | Target folder | Status |
|---|---|---|---|---|---|---|
| GAL-01 | Baumfällung | `673b3da814d72c9106ecbc2d_Baumfllung - 2.webp` | 1169 | yes | `gallery/baumfaellung` | not retrieved |
| GAL-02 | Baumfällung | `673b3da4e8e7df7899dc6d1f_Baumfllung - 1.webp` | 844 | yes | `gallery/baumfaellung` | not retrieved |
| GAL-03 | Baumfällung | `673b3d5acb65582a29633e4f_Baumfllung - 4.webp` | 843 | yes | `gallery/baumfaellung` | not retrieved |
| GAL-04 | Baumfällung | `673b3d5a5f8ae2cc7cc51d2d_Baumfllung - 6.webp` | 1125 | yes | `gallery/baumfaellung` | not retrieved |
| GAL-05 | Baufeldberäumung | `673b3da41a43f80a57dfd39a_Baufeldberumung - 4.webp` | 1500 | yes | `gallery/baufeldberaeumung` | not retrieved |
| GAL-06 | Baufeldberäumung | `673b3da41e58a26c742897c5_Baufeldberumung - 2.webp` | 1125 | yes | `gallery/baufeldberaeumung` | not retrieved |
| GAL-07 | Baufeldberäumung | `673b3d5a14d72c9106ec7ac9_Baumkontrolle - 1.webp` | 1125 | **no** (Baumkontrolle) | `gallery/_unclassified` | not retrieved |
| GAL-08 | Baufeldberäumung | `673b3d6037647f3dce18a179_Forstwirtschaftliche Pflege - 2.webp` | 1125 | **no** (Forstwirtschaftliche Pflege) | `gallery/_unclassified` | not retrieved |
| GAL-09 | Baufeldberäumung | `673b3d608ebfd674e626d7a2_Forstwirtschaftliche Pflege - 1.webp` | 1125 | **no** (Forstwirtschaftliche Pflege) | `gallery/_unclassified` | not retrieved |
| GAL-10 | Spielgeräteaufbau | `673b3da41b2059277c60918e_Baufeldberumung -1.webp` | 1125 | **no** (Baufeldberäumung) | `gallery/_unclassified` | not retrieved |
| GAL-11 | Stubbenfräsen | `673b3da41f3fdb6a4fd756f7_Baufeldberumung - 3.webp` | 1125 | **no** (Baufeldberäumung) | `gallery/_unclassified` | not retrieved |
| GAL-12 | Stubbenfräsen | `673b3d5bea45ed2c55cb725f_Baumkontrolle - 2.webp` | 1125 | **no** (Baumkontrolle) | `gallery/_unclassified` | not retrieved |
| GAL-13 | Baumpflege/ Kronensicherung | `673b3d5a6fb605502c7cbad5_Baumfllung - 5.webp` | 1125 | **no** (Baumfällung) | `gallery/_unclassified` | not retrieved |
| GAL-14 | Winterdienst | `673b3d185f8ae2cc7cc4d089_Winterdienst fr Privat.webp` | 1125 | yes | `gallery/winterdienst` | not retrieved |
| GAL-15 | Winterdienst | `673b3d181777a3a55a4d07c3_Winterdienst fr Privatd - 2.webp` | 1125 | yes | `gallery/winterdienst` | not retrieved |
| GAL-16 | Baumkontrolle | `673b3d18d6c3bb2aa59ced35_Neuanpflanzung & freistellen von Neuanpflanzung.webp` | 1125 | **no** (Neuanpflanzung) | `gallery/_unclassified` | not retrieved |
| GAL-17 | Hangbefestigung | `673b3d169f797513d32da3d9_Straen-und Flchenreinigung - 2.webp` | 1125 | **no** (Straßen- und Flächenreinigung) | `gallery/_unclassified` | not retrieved |
| GAL-18 | Hangbefestigung | `673b3d121777a3a55a4d053a_Grnflchenpflege fr Kommunen.webp` | 1125 | **no** (Grünflächenpflege für Kommunen) | `gallery/_unclassified` | not retrieved |
| GAL-19 | Pflasterarbeiten | `673b3d158a9d05ead665e4bf_Straen-und Flchenreinigung - 1.webp` | 1125 | **no** (Straßen- und Flächenreinigung) | `gallery/_unclassified` | not retrieved |

Alt text for every gallery image is `"<Tab name> von Baum-Land-Forst "`
(with a trailing space).

### Gallery categories (tabs) and their images

| Tab | Category | Images | Agree / conflict |
|---|---|---|---|
| Tab 1 | Baumfällung | GAL-01 – 04 | 4 / 0 |
| Tab 2 | Baufeldberäumung | GAL-05 – 09 | 2 / 3 |
| Tab 3 | Spielgeräteaufbau | GAL-10 | 0 / 1 |
| Tab 4 | Stubbenfräsen | GAL-11, 12 | 0 / 2 |
| Tab 5 | Baumpflege/ Kronensicherung | GAL-13 | 0 / 1 |
| Tab 6 | Winterdienst | GAL-14, 15 | 2 / 0 |
| Tab 7 | Baumkontrolle | GAL-16 | 0 / 1 |
| Tab 8 | Hangbefestigung | GAL-17, 18 | 0 / 2 |
| Tab 9 | Pflasterarbeiten | GAL-19 | 0 / 1 |

Four categories (Spielgeräteaufbau, Baumpflege/Kronensicherung,
Baumkontrolle, Pflasterarbeiten) have only one photo, and in every one of
those four the filename points to a different service. **Five of the nine
categories currently have no image whose filename supports the label.**

### Patterns in the filenames (evidence, not conclusions)

- The filenames use a **second taxonomy** that does not match the tabs:
  *Forstwirtschaftliche Pflege*, *Neuanpflanzung & freistellen von
  Neuanpflanzung*, *Straßen- und Flächenreinigung*, *Grünflächenpflege für
  Kommunen*, *Winterdienst für Privat*. These look like service names,
  possibly from the Leistungen page or an older version of the site. This
  is unverified.
- Numbered series are split across tabs. *Baufeldberäumung* 1–4: 2 and 4
  are in Baufeldberäumung, 1 in Spielgeräteaufbau, 3 in Stubbenfräsen.
  *Baumfällung* 1, 2, 4, 6 are in Baumfällung, 5 in Baumpflege, and **3 is
  not referenced anywhere**. *Baumkontrolle* 1 and 2 are in
  Baufeldberäumung and Stubbenfräsen, and neither is in the Baumkontrolle
  tab.
- Two scenarios fit this evidence: the photos were correctly re-filed into
  more specific tabs after upload, or they were filled into tabs as
  placeholders. Only looking at the photos, or asking the client, can tell
  the two apart.
- Sharing a filename series does **not** mean that photos show the same
  site or project.

### Upload dates (inferred)

Webflow asset IDs start with a hex Unix timestamp (MongoDB ObjectId). That
timestamp is the **upload date to Webflow**, not the date the photo was
taken.

| Prefix | Date (UTC) | Assets |
|---|---|---|
| `67172816…` | 2024-10-22 | ICO-01; the same prefix is the Webflow site ID (site creation) |
| `673b3d…` | 2024-11-18 | all 19 gallery photos, one upload session |
| `67458513…` | 2024-11-26 | ICO-02, ICO-03 |
| `68d4a4d8…` | 2025-09-25 | BRD-01 logo; matches `og:updated_time` 2025-09-25T04:16:02+02:00 |

## Brand

| ID | Role | Filename / URL | Width | Alt | Target | Status |
|---|---|---|---|---|---|---|
| BRD-01 | Logo (navbar) | `images/68d4a4d8f70ae14d90397b58_Logo_273806.png` | 1966 | `Logo` | `original/brand` | not retrieved |

- Only a PNG raster is referenced. No SVG or vector logo appears in the HTML.
- The `Logo_273806` and `27visu3806` (stylesheet/script names) suffixes look
  like a build or agency project code. This is unverified.
- Colour evidence in the HTML: scrollbar thumb `#007A41` (green), track
  shadow `#a5aaad`. The main brand colour sits in the `hauptfarbe` class,
  defined in `css/27visu3806.min.css`, which was not supplied.

## Icons and meta images

| ID | Role | Path on site | Width | Alt | Status |
|---|---|---|---|---|---|
| ICO-01 | Footer: location pin | `images/671728166b73774eeddb0c46_Icon Standord weiss.svg` | (svg, displayed 25 px) | `symbol` | not retrieved |
| ICO-02 | Footer: person/contact | `images/67458513426c3dea54c5007f_man.webp` | 1280 (displayed 20 px) | `symbol` | not retrieved |
| ICO-03 | Footer: list/legal | `images/67458513f61b5780b6df35df_list.webp` | 1280 (displayed 20 px) | `symbol` | not retrieved |
| ICO-04 | Favicon 32×32 | `/favicon-32x32.png` | 32 | — | not retrieved |
| ICO-05 | Favicon 16×16 | `/favicon-16x16.png` | 16 | — | not retrieved |
| ICO-06 | Apple touch icon | `/apple-touch-icon.png` | 180 | — | not retrieved |
| ICO-07 | `og:image` | `/ILD_uploadTool/icons/9ff3c141fff45f951ad41f1893eec7f4.png` | ? | — | not retrieved |

The footer icons are generic UI glyphs and will most likely be replaced in
the redesign. They are inventoried for completeness.

## Referenced but intentionally not inventoried

| Reference | Why |
|---|---|
| `https://uploads-ssl.webflow.com/64106608e4b642763b4fb9e9/…_27375-menu-burger-1.json` | Lottie burger-menu animation hosted under a *different* Webflow site ID. Third-party template asset, not client material |
| `css/27visu3806.min.css`, `js/27visu3806.js`, `ILD_uploadTool/jquery-3.5.1.min.dc5e7f18c8.js` | Code, not assets. The CSS would confirm brand colours and fonts; it would help to obtain it |
| 62 `srcset` variants | Downscaled derivatives of the files above |
