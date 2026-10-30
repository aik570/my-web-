# Client approval checklist — Handy Chirurg Potsdam

Status 29.10.2026. Only decisions that need the owner (Malake Mansour). Everything technical continues without waiting.
Tick a box when the answer is received; record the answer and date next to it.

| # | Decision | Blocks launch? |
|---|---|---|
| 1 | Approve the imported price catalogue | **Yes** |
| 2 | Telephone and WhatsApp numbers | **Yes** (phone) |
| 3 | Warranty statements | **Yes** |
| 4 | Impressum details | **Yes** |
| 5 | Location and service claims | Yes (content accuracy) |
| 6 | VAT and price presentation | **Yes** |
| 7 | Privacy policy and hosting | **Yes** |
| 8 | Client-owned GitHub and Netlify accounts | **Yes** |
| 9 | Final preview approval and domain | **Yes** |
| 10 | Public holidays | No (sensible default in place) |
| 11 | Franchise images: mascot rights, reception photo | **Yes** |

---

### 1. Price catalogue — [ ]
**Why:** All 5 882 prices were taken from the database behind the old website's calculator (last changed 09.07.2026). We have not invented or changed any value, but only the owner knows whether they are still valid. Publishing an outdated price creates a binding expectation in the shop.
**What we have:** 7 brands, 493 models, 3 038 fixed prices, 2 844 "auf Anfrage" (marked -1 in the old database). Spot-check list for the owner: open `/preise/apple/`, `/preise/samsung/` on the preview.
**Please answer:**
- [ ] Are the prices still current? If not: which brands/models change, or send the current list (Excel is fine).
- [ ] 43 MacBook models show "Panzerglas" with **0 €** in the old data. We show "auf Anfrage". Correct, or remove Panzerglas for MacBooks?
- [ ] 58 models have Panzerglas twice: as repair (e.g. 25 €) and as accessory "Premium Displayschutz aus Panzerglas" (40/50 €). Keep both, or which one?
- [ ] Display in "Originalqualität" has a separate price for 285 models. Old data also had "Premiumqualität" for every model, but always without price — we do not show it. Correct?
- [ ] Fehleranalyse is 25 € for most models and 35 € for MacBooks; the site text says "ab 25 €". Correct?
- [ ] After this: set "Preisliste – Status" to **Geprüft** in the CMS (or tell us and we do it).

### 2. Telephone and WhatsApp — [ ]
**Why:** The old site shows two numbers: **0163 228 8224** in Impressum/Datenschutz and **0331 29080953** (landline) everywhere else, including Google-relevant structured data. The new site uses 0163 228 8224 everywhere. WhatsApp: a WhatsApp Business profile exists, but no number is on the site, so the WhatsApp button is hidden.
**Please answer:**
- [ ] Which number should customers call? Show the landline as well?
- [ ] Which number is the WhatsApp Business number (or: no WhatsApp button)?

### 3. Warranty — [ ]
**Why:** The old site contradicts itself: service page "12 Monate Garantie" (water damage "6 Monate"); FAQ "5 Jahre auf Original-Ersatzteile, 12 Monate auf Teile von Zweit-Herstellern"; structured data "5 Jahre Garantie auf Originalteile". A warranty statement is a binding promise. The new site currently repeats the old wording on `/leistungen/` and in the FAQ; the price calculator shows no warranty.
**Please answer:**
- [ ] Warranty for original parts: ____ ; for other parts: ____ ; for water damage: ____ ; on labour: ____
- [ ] Should the calculator show the warranty per repair? (Then we fill "Garantie" per repair type.)

### 4. Impressum — [ ]
**Why:** Copied 1:1 from the old site: Malake Mansour, Dortustraße 23, 14467 Potsdam, Vertreten durch Malake Mansour, Tel. 0163 228 8224, potsdam@handy-chirurg.de, USt-IdNr. DE368877064, no participation in consumer arbitration. Legal form and register entry are not stated.
**Please answer:**
- [ ] All data still correct?
- [ ] Legal form (e.g. Einzelunternehmen, GmbH)? Entry in the Handelsregister? If yes: court and number.
- [ ] Is "Vertreten durch" needed (only for companies)?

### 5. Location and service claims — [ ]
**Why:** Some statements on the old site do not fit a single shop in Potsdam. We did **not** copy these; please confirm or correct.
- [ ] Old process text: "Bring es in eine unserer beiden Filialen **in Berlin**." — Is there any branch besides Dortustraße 23, Potsdam?
- [ ] Repair time: homepage "in der Regel ca. 60 Minuten", FAQ "1–2 Stunden", service page 30–60 Min. / water damage 2–3 Std. Which wording?
- [ ] Send-in service (shipping label, payment in advance by transfer or card via Stripe): still offered?
- [ ] Payment in the shop: cash, EC card, credit card — correct?
- [ ] Old site claims "Zertifizierte Techniker" — not used on the new site. Certified by whom, if it should be added? The FAQ answer on original parts ("in der Regel Originalteile") is copied from the old site — still correct?
- [ ] Photos: may we use the shop photos from the old site (front, reception, counter)? Better originals available?

### 6. VAT and price presentation — [ ]
**Why:** For consumers, prices must be final prices including VAT (Preisangabenverordnung). The old site gave no VAT note. The business has a USt-IdNr.
**Please answer:**
- [ ] Do all prices include VAT? (Then we add "Alle Preise inkl. MwSt." under every price list.)
- [ ] Any extra costs (diagnosis credited? shipping for send-in?) to state next to prices?

### 7. Privacy policy and hosting — [ ]
**Why:** The old privacy policy described Lovable hosting, a contact form, Supabase and Resend. The new site has no form and would be hosted on **Netlify** (Netlify, Inc., San Francisco; EU-US Data Privacy Framework; data processing agreement part of Netlify's terms — taken from Netlify's own pages). We adapted the text and marked it for legal review.
**Please answer:**
- [ ] Hosting on Netlify (free tier) accepted?
- [ ] Who reviews the privacy policy legally (lawyer, generator service, owner)? We deliver the text and the list of changes.
- [ ] Keep the section on job applications (Bewerberdaten)?

### 8. Accounts owned by the client — [ ]
**Why:** The website code and the CMS must belong to the business, not to our working repository. Steps in `docs/DEPLOY.md` section C.
**Please provide:**
- [ ] GitHub organisation created by the owner (e.g. `handy-chirurg`), developer invited with **Write**.
- [ ] Netlify team on the owner's e-mail, developer invited.
- [ ] E-mail / GitHub accounts of the people who will edit prices (each with 2FA).

### 9. Final preview and domain — [ ]
**Why:** Nothing goes live without written approval.
- [ ] Preview reviewed on phone and computer; list of corrections (or "approved").
- [ ] Main domain: `www.handychirurg.de` or `handy-chirurg.de` (e-mail uses handy-chirurg.de)? Who has access to the domain/DNS settings?
- [ ] Written go-ahead for the switch (date/time with low shop traffic).

### 10. Public holidays — [ ] (not blocking)
**Why:** The "Jetzt geöffnet" status needs to know whether the shop is open on Brandenburg public holidays. Until answered, on a public holiday the site shows the holiday name with "bitte vorher anrufen" instead of open/closed.
- [ ] Closed on public holidays? Exceptions?

### 11. Franchise images — [ ]
- The doctor mascot on `/franchise/` was taken from the current franchise page (handychirurg.de/franchise). Confirm that Handy Chirurg owns the rights to use it on the new site.
- The reception photo (sofa, illuminated logo) carried the label "Вміст, згенерований ШІ" (AI-generated content) on the original site; the label was cropped. Confirm the photo shows the shop as it really is, or send an unedited photo.
- The contact section shows three further poses of the mascot (with a city map, with the "call me" gesture, writing a letter). They were generated with an image model from the existing mascot. Confirm they may be used, or supply poses from the original illustrator.
- Phone number on the franchise page: the old page shows 0331 29080953, the redesign uses 0163 228 8224 everywhere (see item 2). Not changed until confirmed.

### 12. Owner feedback 30.10.2026 — open points — [ ]
- **Google reviews:** Google Place ID of the shop and a Google Maps Platform API key (Places API) for the build, or the owner's decision for another source (Business Profile API, a review widget). Confirm that storing the fetched reviews in the website repository is acceptable under Google's terms. Until then the site only links to Google.
- **Device pictures:** no exact photos per model exist. Supply product photos per model (with rights), or approve the series pictures labelled "Symbolbild". The series pictures come from the old website (partly iStock, partly AI-generated) — confirm the rights.
- **Sunday:** shown as closed — confirm.
- **Warranty:** the old FAQ promised "5 Jahre auf Original-Displays, 12 Monate auf andere Teile"; it was replaced by 3 months / water damage without warranty, as instructed. Confirm warranty for back cover, WLAN/Bluetooth and board repairs (currently not shown).

