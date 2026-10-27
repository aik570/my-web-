# Client Decisions — BLF Service

Stage 02 · 2026-10-26, updated 2026-10-27 (Stage 03: D-08 h–l, D-27; Stage 04: D-28)

**Decision owner: the business owner. The name is unresolved (D-28).**
- The Impressum (saved 2026-10-26) and the printed business card name
  **Daniel Witte** [V].
- On 2026-10-27 the project owner gave the current owner's name as **Daniel
  Trautmann** [unverified].
- Historical sources are left unchanged. **No personal name is used in
  public-facing design** until D-28 is confirmed.

This is the **master list** of everything the redesign needs from the
client. The other Stage 02 documents refer to items here by ID (`D-01` …).
It supersedes the question list in `MISSING_INFORMATION.md`; every question
there is covered here.

Each entry has:
- what is **verified today** (from `CONTENT_AUDIT.md`);
- what we need decided;
- the **fallback** the new site uses if there is no answer. A fallback
  never invents content: it leaves the item out or keeps the verified
  wording.

## Summary

| Tier | Meaning | Items |
|---|---|---|
| **A — Critical blockers** | The site cannot launch, or a primary goal (recruitment, inquiries) cannot work, without an answer | D-01 – D-11, D-27, D-28 |
| **B — Needed for quality** | The site can launch with the fallback, but the result is clearly weaker | D-12 – D-20 |
| **C — Optional improvements** | Nice to have | D-21 – D-26 |

---

## A. Critical blockers

### Recruitment

| ID | Decision | Verified today | Fallback if unanswered |
|---|---|---|---|
| **D-01** | **Which positions are open or regularly hired?** For each: title, tasks, requirements (licences such as driving licence class or chainsaw certificate, experience), full/part time, work location, start date | The Jobs page names **no position at all**: one general paragraph | Karriere page in its **Initiativbewerbung** state (UX-03; PAGE_ARCHITECTURE §5). **No invented job titles** |
| **D-02** | **Which employment conditions may be published?** | The site says "Wir bieten: abwechslungsreiche Tätigkeiten, feste Anstellung, moderne Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten und ein angenehmes Arbeitsklima." | Only these five items, as the client's own statements, confirmed before launch; dropped if the client says they no longer apply. **No salary, hours, guarantees or extra benefits** unless supplied |
| **D-03** | **How should applications arrive, and who answers them?** Options: short online form, e-mail, phone, WhatsApp. Is a CV required? Name and photo of a contact person? How long are applicant data kept? | "rufen Sie uns gerne an oder senden uns Ihre Bewerbungsunterlagen"; no address is given for documents | Phone + e-mail (`info@blfservice.de`) as the application channels. The Kurzbewerbung form goes live only with D-03 + D-27 |

### Inquiries and legal

| ID | Decision | Verified today | Fallback if unanswered |
|---|---|---|---|
| **D-27** | **Applicant-data workflow** (needed for any application form): where applications are delivered or stored, who has access, the deletion period, and an applicant section in the Datenschutzerklärung. For the optional upload: allowed file types, size limit, storage outside the public web, malware check. Requirements in PAGE_ARCHITECTURE §5 | No application form exists; the Datenschutzerklärung has **no applicant section** [V] | No application form; Karriere uses phone + e-mail. No upload under any fallback |
| **D-04** | **Do contact-form messages arrive today, and which address should receive them?** | The form's hidden recipient is `info&hey@blfservice.de` (not a valid address), and the error URL is `FEHLERMEDLUNG.com.de.cz` | The new form sends to `info@blfservice.de` only after a successful test delivery the client confirms. Until then phone and e-mail are the primary CTAs |
| **D-28** | **Exact legal and business name, and the current owner.** Who is the owner today (Daniel Witte or Daniel Trautmann)? What is the exact business name for the Impressum, and which lettering should the public logo carry ("SERVICE" as on the website, or a name as on the business card)? | Impressum and business card: "Daniel Witte" [V]; website logo lower arc "SERVICE" [V]; project owner (2026-10-27): "Daniel Trautmann" [unverified] | No personal name anywhere in the design; the logo used is the website version ("SERVICE"). The Impressum cannot be finalised. **Launch blocker** |
| **D-05** | **Correct USt-IdNr.** | The Impressum shows `048/287/07014` under "Umsatzsteuer-ID", which is the format of a Steuernummer | The new Impressum cannot be finalised. Launch blocker |
| **D-06** | **Analytics: who operates `analytics.platzhalterabcd.de`? Keep it, replace it, or drop it?** | Loads on all 7 pages; not mentioned in the Datenschutzerklärung | No analytics in the new site until decided and disclosed |
| **D-07** | **Hosting provider, domain/DNS access, who deploys** | The Datenschutz says an external host is used (with AVV) but doesn't name it | Cannot launch, and the new privacy policy cannot be written |

### Claims and content

| ID | Decision | Verified today | Fallback if unanswered |
|---|---|---|---|
| **D-08** | **Confirm each claim the current site makes, with evidence for qualifications:** (a) "Seit 2001"; (b) "European Treeworker"; (c) "zertifizierten Baumkontrolleure"; (d) "rund um die Uhr" for Notfällung/Sturmschäden; (e) "Regelmäßige Weiterbildungen und Zertifizierungen"; (f) "etabliertes Unternehmen"; (g) "modernste Techniken und Ausrüstungen"; (h) "Durch die Anschaffungen verschiedenster Technik …"; (i) "Mit jahrelanger Erfahrung und einem engagiertem Team …"; (j) "Wir sind tagtäglich für Sie im Einsatz!"; (k) the tagline "Ihre Experten für Baumfällung und Baumpflege"; (l) "sichere und effiziente Baumfällungen" | All quoted in CONTENT_AUDIT §2; none independently verified | An unconfirmed claim is **left out**: no "since" year, no named certification, no 24/7 promise |
| **D-09** | **Final service list and audiences.** Are all 10 services on *Leistung* current? Are Spielgeräteaufbau and Hangbefestigung (gallery only) offered? Is Winterdienst also for private customers? | *Leistung*: 10 services, Winterdienst "Gewerblich und Kommunen"; gallery adds 2 more; two upload filenames say `Winterdienst fr Privat` | The 10 listed services with their current wording; the 2 gallery-only categories appear only as photo categories; Winterdienst audience as on *Leistung* |
| **D-10** | **Full-resolution photographs** (straight from camera or phone) of the 19 gallery images, and of anything else available | All photos are web exports, ≤ 1500 px on the long side | Layouts are capped at the native resolution (see MOTION_SPEC §5): no full-bleed photo hero on large screens. **No upscaling, no AI substitutes** |
| **D-11** | **Logo as a vector file** (SVG/AI/PDF/EPS) | Only a 1966×1966 PNG exists | PNG used at small sizes only; the large logo treatments are dropped |

---

## B. Needed for quality

| ID | Decision | Verified today | Fallback |
|---|---|---|---|
| **D-12** | **Consent of the people shown** (GAL-01, 02, 03, 09, 17) to more prominent use, and approval for the partly legible licence plate in GAL-15. Is the man in GAL-03 Daniel Witte? | The Home page shows GAL-03 with alt text "Daniel Witte" | People photos at the current prominence only; GAL-15 not used at all (its plate is legible at frame size and, on 2×/3× screens, even at small sizes); cropped or blurred only with approval; GAL-03 is not captioned with a name |
| **D-13** | **Service area**: towns or radius around Seddiner See | Not stated anywhere; only the address | Show the address and map only; no area claims |
| **D-14** | **GAL-16**: the large old multi-stemmed tree under "Baumkontrolle". Does it show a tree inspection? | Plausible but not visible in the image; kept in `_unclassified/` | Excluded from the gallery sequence; Baumkontrolle shown without a photo |
| **D-15** | **Per-photo context**: kind of job, rough place, year, client type (private / commercial / municipal) | Nothing; the photos have no EXIF | Captions name the service and what is visible only. The section is called "Galerie" or "Einblicke", **not "Projekte"** (see SITEMAP §4) |
| **D-16** | **About-us content**: team size, roles, short story, team or owner photo; "ich" or "wir" voice? | Home "Das bin ich" text (first person, owner) is the only about content; other pages say "wir" | Home section Über uns (UX-01) built from the existing "Das bin ich" text (claims per D-08), no team block, no team numbers |
| **D-17** | **Emergency contact**: is there a dedicated number or hours for storm damage? Is the mobile number reachable via WhatsApp? | One mobile number `0172/3841620` | Only the existing number; no WhatsApp button; no "24/7" label (D-08 d) |
| **D-18** | **Contact form fields**: should phone stay mandatory? Add a service dropdown, location field, and photo upload of the tree or site? | Phone required; message optional; no service field | Proposed form in PAGE_ARCHITECTURE §6, with only name + one contact method + message required, pending this decision |
| **D-19** | **Additional photos** for the 5 services with none (Notfällung, Straßen- und Flächenreinigung, Neuanpflanzung, Grünflächenpflege für Kommunen, Forstwirtschaftliche Pflege), plus team, machinery and vehicles | No images exist | These services are shown text-only |
| **D-20** | **Visual direction: colours and fonts.** The logo uses green `#32642A`, lime `#8BBB23` and amber `#DD9E09`; the website's main colour is a teal `#023435` that is not in the logo. Approve the Stage 03 recommendation (Direction A "Revier", built on the logo's colours), or keep the teal (Direction C)? | Live CSS teal, Bellota Text, Roboto; logo colours measured | No final colours or fonts. Mockups show Direction A clearly labelled as a proposal (`docs/design/ART_DIRECTION.md`). **Gate for implementation** (DESIGN_DECISIONS §7) |

## C. Optional improvements

| ID | Decision | Verified today | Fallback |
|---|---|---|---|
| D-21 | Publish prices or a price model? | The slug is `leistungen-preise` but there are no prices | No prices; "Angebot anfragen" CTA |
| D-22 | References or testimonials, with written permission | None exist | No testimonials section |
| D-23 | Navigation label: "Jobs" or "Karriere"? Agree to new URLs with 301 redirects from the old ones? | Label "jobs", URL `/jobs` | "Karriere" label, `/karriere`, 301 from `/jobs` (SITEMAP §3) |
| D-24 | Keep consentmanager.net? Who holds the contract? | Used on every page | Keep until decided |
| D-25 | Canonical host: www or non-www? | Canonical uses www; `og:url` uses non-www | `https://www.blfservice.de` |
| D-26 | Name of the gallery page: "Galerie", "Einblicke" or "Projekte"? | "Galerie" | "Galerie" unless D-15 provides project context |

---

## Questions to send (German)

Grouped for one conversation with Daniel Witte. IDs in brackets.

**Kritisch**
1. **Stellen [D-01]:** Welche Stellen sind offen oder werden regelmäßig
   gesucht? Bitte je Stelle: Bezeichnung, Aufgaben, Voraussetzungen (z. B.
   Führerscheinklasse, Motorsägenschein), Voll-/Teilzeit, Einsatzort,
   Starttermin.
2. **Arbeitsbedingungen [D-02]:** Ihre Seite nennt „feste Anstellung,
   moderne Arbeitsmittel, Fort- und Weiterbildungsmöglichkeiten, angenehmes
   Arbeitsklima“. Dürfen wir genau das verwenden? Möchten Sie weitere
   Angaben machen (z. B. Gehaltsrahmen, Arbeitszeiten)? Nur, was wir
   veröffentlichen dürfen.
3. **Bewerbungsweg [D-03]:** Wie sollen Bewerbungen ankommen: Formular,
   E-Mail, Telefon oder WhatsApp? Brauchen Sie einen Lebenslauf? Wer ist
   Ansprechpartner (Name, Foto)?
3a. **Bewerberdaten [D-27]:** Wohin sollen Bewerbungen gehen (eigenes
   Postfach?), wer darf sie lesen, und nach welcher Frist werden sie
   gelöscht? Sollen Bewerber Unterlagen hochladen können? Wer kümmert sich
   bei Ihnen um den Datenschutz?
4. **Kontaktformular [D-04]:** Kommen Anfragen über das Formular heute bei
   Ihnen an? Als Empfänger ist „info&hey@blfservice.de“ eingetragen. An
   welche Adresse sollen Anfragen gehen?
4a. **Name und Inhaber [D-28]:** Wer ist heute Inhaber, und wie lautet der
   genaue Firmenname für das Impressum? Auf Ihrer Visitenkarte steht im Logo
   „Daniel Witte“, im Logo der Website „Service“. Welche Version soll die
   neue Website zeigen?
5. **USt-IdNr. [D-05]:** Im Impressum steht unter „Umsatzsteuer-ID“
   048/287/07014. Das sieht nach einer Steuernummer aus. Wie lautet Ihre
   USt-IdNr. (beginnt mit „DE“)?
6. **Statistik [D-06]:** Wer betreibt die Besucherstatistik unter
   „analytics.platzhalterabcd.de“? Soll sie bleiben?
7. **Hosting [D-07]:** Bei welchem Anbieter liegt die Seite, und wer hat
   Zugang zu Domain und Hosting?
8. **Angaben auf der Seite [D-08]:** Ihre Seite nennt „seit 2001“,
   „European Treeworker“, „zertifizierte Baumkontrolleure“, Notfalleinsatz
   „rund um die Uhr“, regelmäßige Zertifizierungen, „jahrelange Erfahrung
   und ein engagiertes Team“, „verschiedenste Technik“, „tagtäglich im
   Einsatz“, „Ihre Experten für Baumfällung und Baumpflege“ und „sichere und
   effiziente Baumfällungen“. Stimmt das heute noch? Können Sie uns die Nachweise zeigen?
9. **Leistungen [D-09]:** Sind die zehn Leistungen auf Ihrer Seite
   aktuell? Bieten Sie auch Spielgeräteaufbau und Hangbefestigung an? Gibt
   es Winterdienst auch für Privatkunden?
10. **Fotos [D-10]:** Können Sie die Fotos in Originalgröße schicken, direkt
    vom Handy oder der Kamera?
11. **Logo [D-11]:** Haben Sie das Logo als Vektordatei (SVG, AI, PDF oder
    EPS)?

**Wichtig**
12. **Personen auf Fotos [D-12]:** Sind alle abgebildeten Personen mit
    einer größeren Darstellung einverstanden? Sind Sie der Mann auf dem
    großen Baumstumpf? Darf das Fahrzeug mit lesbarem Kennzeichen gezeigt
    werden?
13. **Einsatzgebiet [D-13]:** In welchen Orten oder in welchem Umkreis
    arbeiten Sie?
14. **Baumkontrolle-Foto [D-14]:** Zeigt das Bild mit dem großen alten Baum
    im Wald eine Baumkontrolle?
15. **Bildinfos [D-15]:** Können Sie zu den Fotos kurz sagen, was das für
    ein Auftrag war (Ort, Jahr, privat/gewerblich/kommunal)?
16. **Über uns [D-16]:** Wie viele Mitarbeiter sind Sie? Gibt es ein Team-
    oder Porträtfoto? Sollen wir „ich“ oder „wir“ schreiben?
17. **Notfall [D-17]:** Gibt es eine eigene Notfallnummer oder feste Zeiten?
    Sind Sie unter der Mobilnummer auch per WhatsApp erreichbar?
18. **Anfrageformular [D-18]:** Was müssen Sie bei einer Anfrage mindestens
    wissen? Wäre ein Foto-Upload (Baum oder Grundstück) hilfreich?
19. **Weitere Fotos [D-19]:** Gibt es Fotos von Notfällung,
    Straßenreinigung, Neuanpflanzung, Grünflächenpflege, Forstpflege, Team,
    Maschinen oder Fahrzeugen?
19a. **Farben [D-20]:** Ihr Logo ist grün, hellgrün und gelb-orange, die
    Website dagegen dunkles Petrol. Dürfen wir die neue Seite in den Farben
    Ihres Logos gestalten? Wir zeigen Ihnen dazu einen Entwurf.

**Optional**
20. Preise
    nennen? [D-21] · Kundenstimmen mit Freigabe? [D-22] · „Jobs“ oder
    „Karriere“? [D-23] · Cookie-Banner-Anbieter behalten? [D-24] ·
    Adresse mit oder ohne „www“? [D-25] · Galerie-Seite „Galerie“,
    „Einblicke“ oder „Projekte“ nennen? [D-26]
