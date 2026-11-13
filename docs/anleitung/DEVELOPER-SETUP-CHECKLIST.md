# Developer setup checklist – CMS hosting (Handy Chirurg)

Status 03.11.2026. "Verified" = checked in this repository or by a test run on 03.11. Nothing here was tested on a hosted site: **no Netlify site of the new website exists yet** (`https://www.handychirurg.de/admin/config.yml` → 404; www.handychirurg.de is still the old site). Step details: `docs/DEPLOY.md` (C1–C4, D).

## A. Already in place (verified)

| Item | Where | Verified how |
|---|---|---|
| Decap CMS 3.x, self-hosted under `/admin/` (no CDN) | `src/admin/` | `/admin/` loads in the local build |
| CMS config: GitHub backend, `publish_mode: simple`, German UI, 4 collections / 15 sections | `src/admin/config.yml` | `npm run test:cms`: all 15 open |
| Local editing (decap-server, `local_backend: true`) | `npm run cms` + `npm run dev` | `npm run test:cms` + `node scripts/test-cms-guide.mjs`: price, Befund, hours, warranty, page heading, SEO title pattern, text, **add device**, photo upload → publish → rebuild → visible in calculator, model page, price list, services, FAQ, footer, structured data |
| Build settings, Node 22, headers (CSP, `noindex` for `/admin/`), redirects | `netlify.toml` | `npm test` (production checks) |
| Invalid CMS data stops the build (live site stays unchanged) | `src/_data/prices.js`, `scripts/check-launch.mjs` | build validation tests |
| No secrets in the repository | — | only the OAuth client secret is needed, and it lives in Netlify |

## B. Not configured yet – needs accounts (do in this order)

| # | Task | Who | Status |
|---|---|---|---|
| 1 | Client GitHub organisation + private repository, 2FA on, developer invited (Write) | Client | **open** |
| 2 | Push code to the client repo (`preview` branch); set `backend.repo` and `backend.branch` in `src/admin/config.yml` (now `aik570/my-web-` / `claude/zealous-bohr-71wesv` – `npm run check` blocks launch until changed) | Developer | **open** |
| 3 | Netlify team on the client's e-mail; site from the client repo; production branch `main`, branch deploys `preview`; no custom domain yet | Client / developer | **open** |
| 4 | GitHub OAuth App in the client organisation (callback `https://api.netlify.com/auth/done`); Client ID + Secret into Netlify → *Access & security → OAuth → GitHub* | Developer with client | **open** |
| 5 | Owner's own GitHub account, Write on the repo, 2FA on | Client | **open** |
| 6 | **Hosted test** on `https://preview--<site>.netlify.app/admin/`: "Mit GitHub einloggen" → change one price → Veröffentlichen → commit „CMS: preise … geändert" on `preview` → branch deploy → new price on `/preise/<marke>/` → revert. Record URL and result in `project-audit/IMPLEMENTATION-STATUS.md` | Developer | **not tested** |
| 7 | Deploy notifications (failed deploys) to the maintainer | Developer | **open** |
| 8 | Production: `backend.branch: main`, push `preview:main`; `npm run check` must pass | Developer, after written approval | **open** |
| 9 | Domain/DNS `www.handychirurg.de` → Netlify, HTTPS; OAuth App homepage → final domain | Client approval required | **open – do not change without approval** |
| 10 | Google reviews: `GOOGLE_PLACE_ID` + `GOOGLE_PLACES_API_KEY` (run `scripts/fetch-reviews.mjs`), or an approved review widget | Client | **open** – site shows the honest empty strip |

## C. Content blockers (`npm run check`, 03.11.2026: 5 blockers)

1. Price list status "imported" → owner checks samples, sets "Geprüft" in the CMS.
2. CMS repository still the work repository (B2).
3. Datenschutz: legal review of the adapted text.
4. Datenschutz: Netlify log retention + confirmation that the site runs in the owner's Netlify account.
5. Impressum: confirm data (register entry etc.).

Warnings: WhatsApp number, public-holiday rule, VAT note, Sunday closed, product photos (8 of 493 – see `project-audit/CLIENT-APPROVAL-CHECKLIST.md` item 14).

## D. Hand the owner

- `docs/anleitung/ADMIN-ANLEITUNG.md` (German, with screenshots) – fill in your contact line at the end.
- Their GitHub login works only after B1–B6. Do the hosted test (B6) yourself before handing over.
