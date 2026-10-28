# 01 — Project overview

Audit date: 28.10.2026 · Branch: `claude/zealous-bohr-71wesv` · Commit: `4d16865`
Scope: the repository `aik570/my-web-` as checked out, plus the client's screenshots of the live site.

## Evidence levels used in this audit

| Tag | Meaning |
|---|---|
| **[V-code]** | Verified by reading source in this repository |
| **[V-browser]** | Verified by running the page in Chromium (Playwright, 1440×900 and 390×844) on 28.10.2026 |
| **[S]** | Seen only in the client's iPhone screenshots of the live site (`references/pack-1..3`, taken 26.10.2026) |
| **[B]** | Stated only in the client brief (chat messages), not seen anywhere |
| **[U]** | Unknown, needs verification |

**The live site could not be inspected.** `www.handychirurg.de` and `www.handy-chirurg.de` are blocked by this cloud environment's network policy (proxy: `connect_rejected`; WebFetch: `ENOTFOUND`). Every statement about the live site is therefore [S] or [B]. To inspect it directly, the host must be added under the environment's Network access → Allowed domains.

## What the repository is

The repository is a **static concept**, not the production website. It contains no copy of the live site's code.

| Area | Finding | Evidence |
|---|---|---|
| Framework | None. Hand-written HTML, CSS and JavaScript | [V-code] |
| Build system | None. No `package.json`, no bundler, no scripts | [V-code] |
| Language | German (`lang="de"`), single locale | [V-code] |
| Routing | One public page: `index.html`. Navigation uses in-page anchors only | [V-code] |
| Backend / API | None | [V-code] |
| Database / persistence | None | [V-code] |
| CMS / admin | None | [V-code] |
| Authentication / roles | None | [V-code] |
| Forms | None. All contact actions are `tel:`, `mailto:` and map links | [V-code] |
| Environment variables | None referenced | [V-code] |
| Secrets in repo | None found | [V-code] |
| Hosting / deploy config | None (no `netlify.toml`, `vercel.json`, `.htaccess`, CI) | [V-code] |
| Tests / linting | None | [V-code] |
| Console errors | 0 at both viewports | [V-browser] |
| Horizontal overflow | 0 px at 1440 and 390 | [V-browser] |

### Files (excluding `.claude/skills/` tooling and `references/`)

| Path | Lines | Role |
|---|---|---|
| `index.html` | 391 | The concept page. Contains ~50 KB of inline SVG path data for the traced logo |
| `css/style.css` | 437 | All styles and design tokens |
| `js/main.js` | 278 | Intro animation, nav, scroll progress, reveals, opening state, ECG monitors, tabs, 3D loader |
| `js/phone.js` | 475 | Three.js scene: procedural phone, explode/repair story, labels |
| `img/laden-dortustrasse.jpg/.webp` | — | Shop front, cropped from a phone screenshot (732×612) |
| `img/logo-handy-chirurg.png` | — | **Unused** since concept v3 (logo is now inline SVG) |
| `docs/redesign-konzept.html` | 580 | Internal concept document (RU/DE) |
| `docs/angebot.html` | 312 | Client offer page (DE) |
| `docs/sales-kit.html` | 299 | Internal sales playbook (RU) |
| `references/` | — | Client screenshots, original logo, brief notes |
| `README.md` | 70 | Concept notes |

### External runtime dependencies [V-browser]

| Host | What | Concern |
|---|---|---|
| `fonts.googleapis.com` / `fonts.gstatic.com` | Archivo (variable), IBM Plex Mono | Transfers visitor IP to Google without consent. German courts have ruled this a GDPR violation (LG München I, 20.01.2022). Must be self-hosted for production |
| `cdn.jsdelivr.net` | three.js 0.160.0 (`three.module.min.js`, ≈ 155 KB gzip) | Same IP-transfer concern; also a single point of failure. Must be self-hosted |
| `www.google.com/maps` | Outbound link only, no embed | Fine |

### Other remote branches
Eight other branches exist (AIK Studio, AS Beauty Salon, BLF, a poke restaurant, a Langley listing). A search for "handy chirurg" across them returned **0 files**. They are unrelated and out of scope. [V-code]

## Implementation status of the concept

| Feature | Status | Evidence |
|---|---|---|
| Animated logo intro (monitor sweep, docks into header) | Working | [V-browser] |
| Scroll-driven 3D story (cracked → exploded → repaired) | Working in Chromium. Real iOS Safari not tested | [V-browser] |
| No-WebGL fallback | Implemented (collapses story after load failure or 10 s) | [V-code] |
| Live opening state (Europe/Berlin) | Working. **No public-holiday or special-closure handling** | [V-code] |
| Mobile menu, tabs, FAQ accordion | Working | [V-code] |
| Reduced-motion handling | Implemented | [V-code] |
| Prices | **Absent** (only "Fehleranalyse 25 €") | [V-code] |
| Repair-quote selector (live site feature) | **Absent** — dropped in the concept | [V-code] vs [S] |
| WhatsApp contact | **Absent** | [V-code] |
| Impressum / Datenschutz pages | **Absent**. Short Impressum in footer; Datenschutz links to the old live site | [V-code] |
| Franchise page | Section on homepage only, no separate route | [V-code] |
| SEO files (sitemap, robots, canonical) | **Absent** | [V-code] |

## Conclusion
There is no existing production codebase, CMS or admin to preserve in this repository. The work is a **new build** that must (a) carry the approved concept's design into a production stack, (b) re-create the live site's content and functions that the concept dropped, and (c) add a CMS from scratch.
