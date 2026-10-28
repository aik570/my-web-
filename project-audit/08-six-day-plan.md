# 08 — Six-day implementation plan

Assumptions (all estimates, not commitments):
- Option A from 05 is approved (Eleventy + Git-based CMS, static hosting).
- One developer with ~8 focused hours per day = **48 h capacity**. A second person (Коля) handles client intake, content, legal texts and part of QA.
- The approved concept (`index.html`, `css/style.css`, `js/*.js`) is the design reference and is ported, not redesigned.
- Hours are for an experienced developer familiar with this codebase. Interactive blocks (price selector, CMS) are weighted by complexity, not by block count.

## A. Task breakdown

| ID | Blocks | Deliverable | Depends on | Est. h | Prio | Acceptance criteria | Risk | Day |
|---|---|---|---|---|---|---|---|---|
| T01 | — | Client intake: answers to Q1–Q16, price list, legal data, photos, CMS user, domain access | — | 2 | P0 | All P0 questions answered in writing; files received | H | 1 |
| T02 | ALL | Production scaffold: Eleventy, concept ported to layout + partials, content in data files, fonts and three.js self-hosted, preview deploys | approval | 7 | P0 | Preview URL matches concept at 390/1440; 0 third-party requests; 0 console errors | M | 1 |
| T03 | C1, C2, C4–C7, C12 | CMS at `/admin`, P0 content types, login, publish flow | T02, D6 | 6 | P0 | Owner logs in, edits phone/hours/price, publishes; change live after rebuild; invalid input rejected | M | 2 |
| T04 | HOME-01…11, GLOBAL | Homepage and header/footer read from data files | T02 | 4 | P0 | Changing `site.json` updates all 7 phone placements, hours table, monitor, JSON-LD | L | 2 |
| T05 | C5, C6 | Price data import (CSV/JSON) with build-time validation | D1, T02 | 4 | P0 | Client list imported 1:1; duplicate/invalid rows fail the build with a clear message | H | 2–3 |
| T06 | PRICE (home) | Price selector: Hersteller → Modell → Reparatur → price, note, call/WhatsApp CTA with prefilled text | T05 | 7 | P0 | Every row of the list reachable; "auf Anfrage" handled; keyboard and screen reader usable; works on iOS Safari | H | 3 |
| T07 | PRICE-01 | `/preise` page with search and brand filter | T05 | 4 | P1 | Search by model returns correct rows; mobile table readable | M | 3 |
| T08 | LEGAL-01 | `/impressum`, `/datenschutz` from CMS, footer links internal | D4, T03 | 3 | P0 | Texts match client-approved versions; no link to old site | H (content) | 4 |
| T09 | FRAN-01 | `/franchise` page from concept section | T04 | 3 | P1 | Same URL as live; CTA reaches confirmed recipient | L | 4 |
| T10 | HOME-00/01/04, GLOBAL | Fixes: H1 with "Potsdam", WhatsApp action, holiday/closure override, intro once per session, sign affordance (I-01), logo as cached SVG | T04 | 3 | P1 | Issues I-01, I-04, I-07, I-08 closed | L | 4 |
| T11 | C3, C8–C11, C13, C14 | Remaining CMS types | T03 | 5 | P1 | Each field editable and visible on site | M | 4 |
| T12 | ALL | SEO: canonical, absolute OG, sitemap.xml, robots.txt, JSON-LD from data, 301 map, 404 | D7, T04 | 3.5 | P0 | All old URLs return 200 or 301; sitemap valid; Rich Results test passes | M | 5 |
| T13 | ALL | Performance + accessibility pass, image pipeline for original photos | D3, T04 | 4 | P1 | Lighthouse mobile ≥ 85 perf, ≥ 95 a11y; LCP < 2.5 s on 4G profile | M | 5 |
| T14 | ALL | QA: iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari, WhatsApp in-app browser; all 31 interactions; CMS edit → publish → rollback | T03–T12 | 6 | P0 | Checklist 09 fully green | M | 5–6 |
| T15 | — | Client review round and fixes | T14 (first pass) | 5 | P0 | Client sign-off in writing | H | 5–6 |
| T16 | — | Launch: DNS, SSL, redirects, Search Console, Google Business Profile check | D5, T15 | 3 | P0 | Domain serves new site over HTTPS; old URLs redirect; GBP URL/phone match | H | 6 |
| T17 | — | Owner handover: German CMS guide (1 page) + 30-min walkthrough | T03 | 2 | P1 | Owner changes hours and a price unaided | L | 6 |

**Implementation tasks: 17.**

## B. Totals

| Scope | Hours |
|---|---|
| P0 (T01–T06, T08, T12, T14–T16) | **50.5 h** |
| P1 (T07, T09–T11, T13, T17) | **21 h** |
| All tasks | **71.5 h** |
| + 15 % contingency | **≈ 82 h** |

## C. Feasibility

| Team | Capacity in 6 days | P0 (50.5 h) | Full scope (≈ 82 h) |
|---|---|---|---|
| 1 developer | ~48 h | **At the limit, no buffer** | **Not feasible** |
| 1 developer + Коля on intake, content, QA (~25 h) | ~73 h usable | **Feasible** | Not fully; P1 partly |

Feasible only if the price list, legal data and domain access arrive by end of day 2.

## D. Day-by-day schedule

| Day | Developer | Коля / client side | Milestone |
|---|---|---|---|
| 1 | T02 scaffold; set up CMS login method | T01 intake; send question list; collect price list, Impressum data, photos, domain access | Preview URL online |
| 2 | T03 CMS core, T04 data wiring, T05 start | Prepare legal texts, URL list of live site | Owner can edit contacts and hours |
| 3 | T05 finish, T06 price selector, T07 if time | Check imported prices against the official list | Price selector working on preview |
| 4 | T08 legal pages, T09 franchise, T10 fixes, T11 | Client reviews preview (round 1 feedback by evening) | Content-complete preview |
| 5 | T12 SEO + redirects, T13 perf/a11y, T14 QA pass 1 | Device testing on real iPhone/Android; collect review fixes | Release candidate |
| 6 | T15 fixes, T14 final QA, T16 launch, T17 handover | Client sign-off, Google Business Profile update | **Live** |

## E. Critical path
`D1 price list → T05 → T06 → T14 → T15 → T16`
`T02 → T03 → T08 (needs D4 legal) → T16`
`D5 domain access → T16`

## F. Parallel work
- Коля: intake, legal texts, photo collection, URL list, device QA, owner guide.
- Developer: T07/T09/T11 can run in parallel with waiting on client inputs.
- T12 redirect map can be prepared as soon as D7 (URL list) arrives.

## G. Deferral order if the deadline is at risk
1. T11 remaining CMS types (developer edits those texts post-launch).
2. T07 `/preise` full page (the selector on the homepage covers prices).
3. T13 deep performance work beyond the self-hosting already in T02.
4. T09 franchise: ship a minimal page reusing the homepage section partial (keeps the URL, ~1 h).
5. Special closures (C3) and intro-once-per-session.

Never deferred: legal pages, correct contact data, price data integrity, redirects, mobile QA.

## H. Minimum acceptable production result on day 6
- Homepage in the approved design, mobile and desktop, 3D story with working fallback.
- All contact data, hours and diagnosis fee from the CMS; one confirmed phone number everywhere.
- Price selector fed by the official price list, editable by the owner.
- `/impressum`, `/datenschutz`, `/franchise` live at their existing URLs.
- No third-party requests without consent; no cookie banner needed.
- Sitemap, robots, canonical, redirects for every known old URL.
- QA passed on iOS Safari and Android Chrome.
- Owner can change hours and prices alone.
