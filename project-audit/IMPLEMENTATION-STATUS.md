# Implementation status

Updated: 28.10.2026, Phase 3 (recovery of the original site) · earlier: Phase 2 · Branch `claude/zealous-bohr-71wesv`

## 0. Phase 3 — recovery of the original website: **blocked by network access**

Attempted on 28.10.2026 from this cloud session:

| URL / method | Result |
|---|---|
| `https://www.handychirurg.de/` (WebFetch) | `getaddrinfo ENOTFOUND www.handychirurg.de` — host is outside the session's allowed network domains |
| `https://web.archive.org/web/2025/https://www.handychirurg.de/` | "unable to fetch from web.archive.org" |
| Direct shell requests (curl) to the site and mirrors | Refused by the session's permission policy |
| Web search "handychirurg.de Impressum Potsdam Dortustraße", "\"Handy Chirurg\" Potsdam Reparatur Preise" | No page of handychirurg.de indexed in the results |
| Repository, all branches, history, `references/` | Only the 15 screenshots + brief; their content (benefits, process, hours, diagnosis fee, contact) is already integrated. No Impressum/Datenschutz text, no `/services` page, no price data |

Not inspected because unreachable (contents **unknown, not missing**): `/`, `/services`, `/franchise`, Impressum, Datenschutz, price calculator and its data requests.

To unblock: allow `www.handychirurg.de` and `handychirurg.de` (and `handy-chirurg.de`) under *Network access → Allowed domains* in the cloud environment settings, then re-run the recovery (crawl pages, capture the calculator's network requests, import the catalogue with `npm run import:prices`, migrate Impressum/Datenschutz text marked "übernommen von der bisherigen Website, vor Start prüfen").

Done in Phase 3 without the original site:
- Calculator: repair types carry optional **Dauer** and **Garantie** (CMS → Laden & Kontakt → Reparaturarten); shown only when filled in, so nothing unverified appears. Empty states for a model without prices and for repairs not listed (call link); explicit enquiry text when a repair has no fixed price.
- Test added (missing-repair hint; no duration/warranty without CMS data).

## 1. Verification results

| Command | Result |
|---|---|
| `npm ci` (clean) | OK |
| `npm run build` | OK — 9 pages (`/`, `/preise/`, `/franchise/`, `/impressum/`, `/datenschutz/`, 404, admin, sitemap, robots) |
| `npm test` | **all checks pass** (incl. 2 new selector checks): 6 pages × 2 viewports (no console errors, no third-party requests, no failed assets, no overflow, logo visible), internal links, price selector (8), price list (4), 3D start/fallback (4), reduced motion (2), opening state (6), **production build guard (4)** |
| `npm run check` | **Exit 1 — 10 blockers, 4 warnings** (list in section 3) |

### Fixed in this phase (found during verification)
| Problem | Fix |
|---|---|
| Test prices lived in the same folder as official prices; a production build would have shown them | Moved to `data-import/demo/`. Production builds never load them and show "Preisliste wird gerade aktualisiert" + call button |
| Production builds were not blocked by open legal placeholders | Netlify `production` context now runs `npm run check`; the deploy fails while blockers exist |
| Preview builds could be indexed or mistaken for the live site | Non-production builds: `noindex, nofollow` and a fixed "Vorschau · nicht veröffentlicht · Testpreise" marker |
| CMS pointed to branch `main`, which **does not exist** in `aik570/my-web-` (its default branch belongs to another project) | CMS now targets the working branch for preview; launch gate blocks production while the CMS points to the shared work repository |
| Price status "demo"/"verified" could be set wrongly by a re-import | Status flow `pending → imported → verified`; importer sets `imported`, a person sets `verified` after spot checks |
| `pricesMeta.json` regressed to the old "Entwicklungsdaten" text in a commit | Caught by the new production test; corrected |

Verified in the production build (`CONTEXT=production`): no "Testdaten/Entwicklungsdaten/Testwert", no preview marker, pages indexable, selector shows the call fallback.

## 2. Real pricing source — status: **not available**
Searched: all branches and full git history (no PDF/CSV/XLSX for Handy Chirurg — only files of other projects), disk, docs, references (the screenshots show the old selector's dropdowns but no prices). The live site `www.handychirurg.de` is still blocked by this environment's network policy (`connect_rejected`), so the embedded price data cannot be read from here.

What the client must deliver: see `docs/PREISLISTE.md` — preferably the Excel/Sheets file they maintain (columns *Hersteller, Modell, Gerätetyp, Reparatur, Bezeichnung, Preis, Ab, Hinweis*), otherwise the PDF (we transcribe and send back for approval) or access to the system behind the old site's selector. Empty template: `data-import/VORLAGE-preisliste.csv`. Also needed: VAT included? Diagnosis fee in addition or included?

Import path tested: `npm run import:prices -- <file>` writes only to `src/content/prices/`, sets status `imported`; broken files are rejected with line numbers and nothing is written.

## 3. Launch blockers (`npm run check`)
1. No official prices in `src/content/prices`.
2. CMS `backend.repo` is the shared work repository `aik570/my-web-` → client-owned repository needed.
3. Impressum: legal form.
4. Impressum: address for service of process.
5. Impressum: register / profession / chamber data if applicable.
6. Datenschutz: legal review of the draft.
7. Datenschutz: controller address.
8. Datenschutz: hosting provider.
9. Datenschutz: log retention.
10. Datenschutz: Stripe for send-in (if used).

Warnings: WhatsApp number · public-holiday rule · franchise e-mail · social image only 732 px wide.

## 4. Preview
| Preview | Status |
|---|---|
| Local | `npm run build && npx http-server _site -p 8080` — verified |
| **Hosted preview (claude.ai)** | https://claude.ai/artifact/MKnvHQdRfoKvSRqyntbA2E — private until shared. Same build with relative paths, pages: home, Preise, Franchise, Impressum, Datenschutz. Verified locally from the same bundle (0 errors, 0 failed files, 3D starts). **Not verified inside the claude.ai viewer, no CMS** |
| Netlify branch preview | **Blocked: no Netlify account/site.** Exact steps in `docs/DEPLOY.md` section B (production branch `main` = never deployed; branch deploy of `claude/zealous-bohr-71wesv`). No DNS touched |

## 5. CMS authentication and deployment
- Production flow: Decap CMS (self-hosted at `/admin/`) → GitHub backend → editor logs in with **their own GitHub account** via the GitHub OAuth provider built into Netlify (Netlify Identity is not used). The OAuth secret is stored only in Netlify.
- Every *Veröffentlichen* is a commit to the configured branch → Netlify builds → site updated (~1 min). Production builds run the launch gate.
- Permissions: editors need **Write** access to the repository; branch protection on the production branch must allow them to push (or use `editorial_workflow`).
- Ownership: client owns the GitHub organisation/repository, Netlify team, OAuth App and domain; the developer is a removable collaborator (`docs/DEPLOY.md` C). No personal credentials are used as permanent access.
- **Verified:** login → edit price → publish → file commit → rebuild → new price, using the local backend (decap-server). **Not yet verified:** real GitHub OAuth login and Netlify rebuild — requires the Netlify site and an OAuth App.
- **Client account editing: not verified** (no client GitHub account yet).

## 6. 3D and performance
Implementation (`src/assets/js/phone.js`, three.js 0.160, self-hosted):
- Delayed start: desktop after `requestIdleCallback`; phones/portrait only on first scroll/touch; still poster shown while loading and when WebGL is missing (tested).
- Idle rendering: phones render nothing at rest; desktop idle sway capped at 30 fps; nothing renders off-screen or in hidden tabs; ECG traces ~30 fps.
- Reduced motion: no intro, no reveal animation, no idle motion (tested).

| Cost | Size / effect | Assessment |
|---|---|---|
| three.js module | 670 KB raw / **166 KB gzip**, parsed when 3D starts | Largest remaining cost; only loaded after first paint (desktop) or first scroll (phones) |
| Scene init (procedural geometry, PMREM environment, 3 canvas textures) | One-off | Not measurable meaningfully here (software GPU) |
| Screen texture redraw (600×1240 canvas) | During crack→repair transition and heartbeat | Only while scrolling through that phase |
| ECG canvases | ~30 fps while visible | Small |
| Intro | 2.7 s, image layers | Once per session |

Environment limits vs. real devices: Lighthouse and the frame-time probe here run with **software WebGL (SwiftShader)** — measured 3D frame time median 89 ms at 1440×900, which is a CPU emulation figure, not device performance. Lighthouse homepage: mobile 72 / desktop 61 performance, 100 accessibility; sub-pages 98–99. **Real-device testing has not been performed.** It needs a preview URL on an iPhone (Safari) and a mid-range Android (Chrome): check 3D smoothness while scrolling, battery/heat over 1 minute, and the no-WebGL fallback in low-power mode.

## 7. Client questions (must be answered)
1. Price list file (see `docs/PREISLISTE.md`); prices incl. VAT? diagnosis fee separate?
2. Impressum: legal form, address for service, register/chamber data.
3. Datenschutz: hosting decision (Netlify proposed), Stripe used for send-in?
4. GitHub: organisation/account to own the repository; e-mail(s) of CMS editors.
5. Netlify: client team (or approval to create one in the client's name).
6. Canonical domain: handychirurg.de or handy-chirurg.de? Who controls DNS?
7. WhatsApp number · closed on public holidays? · franchise contact e-mail · guarantee duration.
8. Original photos (shop front ≥ 1200 px).

## 8. Next three actions
0. **Allow the original domain in the session network settings** and run the recovery (section 0). This replaces most of the client questions on prices and legal text.
1. **Get the price file and legal data** from the client using `docs/PREISLISTE.md` and the question list; import, spot-check 10 rows, set status `verified`.
2. **Create the Netlify branch preview** (`docs/DEPLOY.md` B) — needs a Netlify account; then set up the GitHub OAuth provider and run the real login → edit price → publish → redeploy test.
3. **Real-device QA** on iPhone Safari and Android Chrome against the preview URL; record results here.
