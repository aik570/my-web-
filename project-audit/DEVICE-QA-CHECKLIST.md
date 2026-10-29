# Device QA checklist

Repeat on every preview before launch. Record device, OS/browser version, date, tester and result (✓ / ✗ + note + screenshot).
Test against the Netlify preview URL (not localhost). Status of each test type is kept in `IMPLEMENTATION-STATUS.md`, section "QA status".

Devices (minimum): **iPhone** (iOS 17+, Safari) · **Android mid-range** (Android 13+, Chrome) · **Desktop** Chrome, Safari or Firefox, Edge.

## 1. Load and navigation
- [ ] Home opens without error; intro (logo heartbeat) plays once and then the page is usable (on reload in the same tab it does not play again).
- [ ] Header: logo top left, call button visible; menu button opens and closes the menu; all menu links work.
- [ ] No sideways scrolling on any page (try swiping left/right on home, `/preise/samsung/`, `/leistungen/`, `/datenschutz/`).
- [ ] Rotate phone to landscape and back: layout stays intact.
- [ ] Text readable without zoom; buttons easy to hit with a thumb.

## 2. 3D hero
- [ ] Phone: a still image of the phone shows first; after the first scroll the 3D phone appears and follows the scroll story (crack → repair → heartbeat).
- [ ] Scrolling stays smooth (no stutter for more than a moment). Note the device model if it stutters.
- [ ] Leave the page open 1 minute without touching it: device does not get noticeably warm; battery drain normal.
- [ ] iPhone Low Power Mode / Android Battery Saver: page still works (3D or still image).
- [ ] Reduced motion (iOS: Settings → Accessibility → Motion → Reduce Motion; Android: Remove animations): no intro, no moving animations, all content visible.

## 3. Price calculator (home, "Preisrechner")
- [ ] Choose Hersteller → Modell → a repair: price appears; device types grouped (Smartphone/Tablet/Smartwatch/Laptop).
- [ ] Search field: type "iPhone 13" and pick from the list → brand and model are selected.
- [ ] Unknown model ("xyz") → message with phone link.
- [ ] Repair "auf Anfrage" → text "keinen festen Preis" and call/e-mail buttons.
- [ ] Banner "Preise in Prüfung" visible until the owner approves the prices.
- [ ] Spot-check 5 prices against the owner's list: ____ / ____ / ____ / ____ / ____.

## 4. Price pages
- [ ] `/preise/`: search "galaxy s23" shows results; result opens `/preise/samsung/` with that model open.
- [ ] Home "Display" card time link → `/preise/` → brand → only display rows shown.
- [ ] Brand page: filter chips work; "Alle" resets; models open/close by tapping.

## 5. Contact actions
- [ ] "Anrufen" opens the phone app with **0163 228 8224** (or the number approved by the owner).
- [ ] E-mail link opens mail app with subject filled (calculator) to potsdam@handy-chirurg.de.
- [ ] "Route planen" opens Google Maps at Dortustraße 23.
- [ ] WhatsApp button (only once a number is set) opens WhatsApp with a prefilled text.
- [ ] Opening-state chip ("Jetzt geöffnet"/"Geschlossen") matches the real time.

## 6. Other pages
- [ ] `/leistungen/`, `/franchise/`, `/impressum/`, `/datenschutz/` show full text; footer links work.
- [ ] Old addresses redirect: `/services`, `/apple`, `/impressum` (without slash).
- [ ] Unknown address (e.g. `/abc`) shows the 404 page with links.

## 7. CMS (desktop is enough)
- [ ] `/admin/` → login with GitHub works.
- [ ] Change one price → *Veröffentlichen* → after 1–2 minutes the new price is on the brand page and in the calculator → change back.
- [ ] Invalid input (letters in price, wrong phone format) is refused.

## 8. Technical (desktop, DevTools)
- [ ] Console: no red errors on home, `/preise/`, a brand page.
- [ ] Network: no requests to other domains (except Google Maps after clicking "Route planen").
- [ ] Lighthouse mobile on home: performance ≥ 70, accessibility ≥ 95 (record values).
