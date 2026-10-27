# Fonts: source and licence

Both families are self-hosted. No font CDN is used: the current
Datenschutzerklärung states that fonts are "lokal installiert", and the new
site keeps that.

| Family | Files here | Licence file | Licence |
|---|---|---|---|
| Newsreader (variable: `wght` 200–800, `opsz` 6–72) | `newsreader/Newsreader-Variable-latin.woff2` | `newsreader/OFL.txt` | SIL Open Font License 1.1 |
| Hanken Grotesk (variable: `wght` 100–900) | `hanken-grotesk/HankenGrotesk-Variable-latin.woff2` | `hanken-grotesk/OFL.txt` | SIL Open Font License 1.1 |

## Source

Downloaded on 2026-10-27 from the google/fonts repository (branch `main`):

| Source file | SHA-256 |
|---|---|
| `ofl/newsreader/Newsreader[opsz,wght].ttf` | `8a08d13f8a6c0d51be379a60af84f945f65369a67e509ee3c3bdcc421254d7c1` |
| `ofl/hankengrotesk/HankenGrotesk[wght].ttf` | `813b3f8fa0965405669a89b38e51bbefd95eef6b8e20d1cb2d8c10cce062662f` |

The `OFL.txt` files were copied unchanged from the same folders.

## What was changed

Each font was **subset** with fontTools `pyftsubset` and converted to WOFF2. All
OpenType layout features and both variation axes were kept. Subsetting and
format conversion are permitted under OFL 1.1; the font names were not changed.

Unicode ranges kept: Basic Latin, Latin-1 Supplement, ı, Œ/œ, ˆ ˚ ˜, ẞ, dashes,
German and English quotation marks, bullet, ellipsis, primes, ‹ ›, €, ™,
arrows ← ↑ → ↓, minus.

**Verified after subsetting:** Ä Ö Ü ä ö ü ß ẞ – „ “ € are all present.

## Figures (verified 2026-10-27 with fontTools)

| Family | Result |
|---|---|
| Newsreader | Has an OpenType `tnum` feature, and its default digits are already equal width (1100 units) |
| Hanken Grotesk | Has **no** `tnum` feature. Its default digits are equal width (560 units) **at the default instance (wght 400)**; other weights were not checked |

`font-variant-numeric: tabular-nums` is therefore effective for Newsreader.
For Hanken Grotesk it is a no-op that does no harm.
