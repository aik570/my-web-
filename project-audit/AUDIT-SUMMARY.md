# Audit summary — Handy Chirurg Potsdam

28.10.2026 · Phase 1, audit only. No application file was changed.

## Key facts

| Metric | Value | Verified? |
|---|---|---|
| Public pages/routes in repository | **1** (`/`) | Yes, source |
| Internal docs pages (not part of the site) | 3 | Yes |
| Live-site routes | **≥ 4** (`/`, `/franchise`, `/datenschutz`, Impressum) | **Estimate** — live site blocked by this environment's network policy |
| Unique homepage section types | **12** | Yes |
| Page-section placements | **12** (each section once) | Yes |
| Unique reusable component types | **16**, with **57** placements | Yes (grep) |
| Interactive elements | **31** placements, **11** interaction types | Yes (script + browser) |
| Forms / data-changing actions | **0** | Yes |
| WhatsApp actions | **0** (missing) | Yes |
| Existing admin/CMS features | **0** | Yes |
| CMS content types required | **14** (7 for P0) | Proposal |
| Implementation tasks | **17** | Proposal |
| Estimated hours | **P0 50.5 h · all 71.5 h · with contingency ≈ 82 h** | Estimate |

## What exists
A static, working design concept: animated logo intro, scroll-driven 3D phone story, live opening state, services, process, hours, FAQ, franchise teaser. No framework, build, backend, CMS, forms, tests or deploy config. 0 console errors, 0 overflow at 390 and 1440 px.

## What is missing
- **Price list and repair selector** — the live site's main tool; dropped in the concept.
- **Admin panel** — nothing exists; must be built.
- **Legal pages**, WhatsApp, holiday handling, sitemap/canonical/redirects.
- **Self-hosting** of fonts and three.js (currently loaded from Google and jsDelivr without consent).

## Six-day feasibility
- **Full scope: not feasible** for one developer (≈ 82 h against ~48 h).
- **P0 scope (50.5 h): feasible** with one developer plus Коля on intake, content and QA, **if** price list, legal data and domain access arrive by end of day 2.
- Recommended stack: Eleventy + Git-based CMS (Decap/Sveltia) on static hosting. Needs approval.

## Highest risks
1. Price list not delivered early (blocks the main feature).
2. Live site not inspectable here → URL list and old content must come from the client, or the host must be allowed.
3. Domain/hosting access missing → no launch.
4. Incomplete Impressum/Datenschutz → launch blocker.
5. Untested on real iOS Safari; 3D on low-end phones.

## Immediate next steps
1. Send the client the question list (below) and request price list, legal data, photos, domain access today.
2. Approve the stack (option A) and who gets CMS access.
3. Allow `www.handychirurg.de` in this environment's network settings, or obtain the live URL list.
4. After approval, start T02 (scaffold) and then the price selector.

## Questions for the client
1. Which phone number is shown: 0163 228 8224 only, or also the landline 0331 29080953? Which number has WhatsApp?
2. Canonical domain: handychirurg.de or handy-chirurg.de?
3. Closed on public holidays? Any planned closures?
4. Is there only the Potsdam shop? The current site mentions „Filialen in Berlin".
5. Send-in service from Potsdam: shipping address, who prints/pays the label, return shipping cost?
6. Diagnosis: fixed 25 € or „ab 25 €"?
7. Please send the official price list (file). Roughly how many rows? Original vs. compatible parts?
8. Guarantee duration on repairs and parts?
9. May we say „Original-Ersatzteile"? For all repairs?
10. „Zertifizierte Techniker": certified by whom?
11. In-store payment methods (cash, EC, credit card)? Stripe prepayment only for send-in?
12. Impressum: legal form, full Impressum address (is it Dortustraße 23?), register entry if any, Berufsbezeichnung/Kammer if applicable.
13. Who controls the domain (registrar) and current hosting? Login access?
14. Any hosting preference (Germany only)?
15. Who edits the site later, and which email gets the CMS account?
16. Franchise enquiries: which email should receive them?
17. Original photos and the logo as vector file (AI/SVG/PDF)?
18. Is the mascot illustration yours to use? Keep or drop?
19. What is in the „Kontaktieren Sie uns" section of the current site (a form?) — keep it?
