# 09 — Acceptance checklist

Each item is pass/fail and testable. "Devices" = iPhone (iOS Safari), Android (Chrome), desktop Chrome, Firefox, Safari, plus WhatsApp in-app browser on iOS.

## 1. Design fidelity (approved concept)
- [ ] Homepage matches the concept at 390, 768, 1280 and 1440 px (side-by-side screenshots attached)
- [ ] Colours and type tokens identical to `css/style.css` (`--teal #2f7a68`, `--red #c8312a`, Archivo, IBM Plex Mono)
- [ ] Logo intro plays once per session, skips on tap, never blocks > 5 s
- [ ] 3D story: cracked → exploded with 5 labels → repaired, on all devices
- [ ] With WebGL disabled: story collapses to the hero, rest of page intact
- [ ] Reduced motion: no intro, no reveal animation, 3D follows scroll without smoothing
- [ ] No horizontal scroll at any width from 320 px

## 2. Content and business data
- [ ] One phone number, identical in all placements (header, hero, done scene, board, FAQ, call section, footer, JSON-LD)
- [ ] Address, email, hours identical everywhere and equal to Google Business Profile
- [ ] Opening state correct: weekday open, weekday before 10:00, after 18:30, Saturday evening → "öffnet Montag", Sunday, a configured holiday
- [ ] No claim on the site that the client has not confirmed in writing (guarantee duration, original parts, certification)
- [ ] No reference to Berlin branches unless confirmed
- [ ] "Sie" form used consistently

## 3. Prices
- [ ] Every row of the official list is reachable in the selector and on `/preise`
- [ ] Spot check: 10 random rows match the official list exactly
- [ ] "auf Anfrage" rows show a call/WhatsApp CTA instead of a price
- [ ] Selector usable by keyboard and screen reader; result announced
- [ ] Invalid price data (text in price, duplicate row) fails the build with a readable message; live site unaffected

## 4. Interactions (31 placements from 04)
- [ ] All 7 phone links open the dialer with +49 163 2288224 (or the confirmed number)
- [ ] All 3 email links open the composer with the correct address/subject
- [ ] Both route links open the correct location
- [ ] Nav anchors land below the fixed header
- [ ] Menu: opens, closes on link, Esc and button; focus returns
- [ ] Tabs switch with click and arrow keys
- [ ] 6 FAQ items expand/collapse
- [ ] WhatsApp action opens a chat with the confirmed number
- [ ] No link points to the old site; no dead links (automated link check)
- [ ] Service signs are either real links or have no link affordance

## 5. CMS / admin
- [ ] Owner logs in at `/admin` with their own account (2FA enabled)
- [ ] Owner changes: phone, one opening day, a holiday closure, a price, an FAQ answer, Impressum text — each appears live after publish
- [ ] Required-field and format validation blocks bad input
- [ ] A previous version can be restored (rollback tested once)
- [ ] `/admin` is `noindex` and not linked publicly
- [ ] Owner guide delivered; owner completes two edits unaided

## 6. Legal and privacy
- [ ] `/impressum` complete (name, legal form, address, contact, USt-IdNr., VSBG statement) and approved by the client
- [ ] `/datenschutz` updated for the new hosting/CMS and approved by the client
- [ ] Zero requests to third-party hosts on page load (check Network tab): fonts and three.js self-hosted
- [ ] No cookies set; no analytics without consent
- [ ] Hosting DPA signed by the client

## 7. SEO
- [ ] Every known old URL returns 200 at the same path or 301 to its new target
- [ ] Title and description set per page; H1 includes "Potsdam" on the homepage
- [ ] Canonical on every page; one canonical domain, the other domain 301s
- [ ] `sitemap.xml` and `robots.txt` valid; sitemap submitted in Search Console
- [ ] Structured data passes Google's Rich Results Test
- [ ] OG image absolute, 1200×630, renders in a WhatsApp link preview
- [ ] Custom 404 page

## 8. Performance and accessibility
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] LCP < 2.5 s, CLS < 0.1 on a simulated 4G phone
- [ ] Keyboard-only walkthrough of the whole page succeeds
- [ ] All images have meaningful alt text

## 9. Launch
- [ ] HTTPS valid on both domains; HTTP redirects to HTTPS
- [ ] DNS switched; old hosting kept until verification
- [ ] Google Business Profile website and phone updated
- [ ] Post-launch check after 24 h: Search Console errors, forms/links, opening state
