# Missing Information & Client Questions — BLF Service

Stage 01 · updated 2026-10-26 (after retrieval and full page audit)

> **Superseded for client communication by `CLIENT_DECISIONS.md` (Stage 02)**,
> which covers every client item below with a decision ID and a fallback.
> A5 (Ma'Loa material) is for the project owner and stays tracked here and in
> PROJECT_STATUS. This file is kept as the Stage 01 record.

Nothing listed here may be filled with invented content: no placeholder
job titles, benefits, testimonials, certifications, salaries, team sizes or
project stories. The site's existing claims are quoted in
`CONTENT_AUDIT.md` §2. They need confirmation before reuse.

## Resolved in Stage 01

| Was | Now |
|---|---|
| Site assets not retrieved | 28 / 28 retrieved and verified |
| Six pages not audited | All seven pages saved and audited |
| Brand colours unknown | Live values found in CSS (`#023435`, `#e6f1eb`, `#3f8843`); whether they are a deliberate brand is still open (B1) |
| Gallery classification unclear | Applied after owner approval: 18 of 19 photos are in their tab's folder; only GAL-16 is pending (A4) |

## A. Blocking — needed before design starts

| # | Missing | Why | From |
|---|---|---|---|
| A1 | **Job content**: positions, requirements, conditions, location, how to apply, contact person | The live Jobs page has none of these, and recruitment is a primary goal | Client |
| A2 | **Full-resolution photographs**, plus more of team, machinery and vehicles | All site photos are ≤ 1500 px web exports; upscaling is not allowed | Client |
| A3 | **Logo as vector** (SVG/AI/PDF/EPS) | Only a 1966 px PNG exists | Client / previous agency |
| A4 | **Confirm GAL-16** (large old tree, shown under Baumkontrolle): does it show a tree inspection? | Last photo still in `_unclassified/` | Client (question 2) |
| A5 | **Ma'Loa reference material** | Named as the quality benchmark; nothing in the repo | Project owner |

## B. Content

| # | Missing | Note |
|---|---|---|
| B1 | Are `#023435` / Bellota Text / Roboto the brand, or template defaults? | Decides whether the redesign keeps them |
| B2 | Confirmation of the site's claims: since 2001, European Treeworker, certified tree inspectors, 24/7 emergency felling, regular training | Quoted in CONTENT_AUDIT §2. Need evidence for qualifications |
| B3 | Final service list | *Leistung* lists 10. The gallery adds Spielgeräteaufbau and Hangbefestigung. Are those current services? |
| B4 | Winterdienst audience | *Leistung*: "Gewerblich und Kommunen"; filenames: "für Privat" |
| B5 | Prices or price model, if any are to be shown | Slug says "preise", page has none |
| B6 | Service area | Not stated anywhere |
| B7 | Company facts to show: team size, legal form, founding | Only if supplied |
| B8 | References and testimonials, with permission | None on the current site |
| B9 | Per-photo facts: what the job was, rough location, year, client type | No EXIF on any photo |
| B10 | Photos for the 5 services that have none | Notfällung, Straßenreinigung, Neuanpflanzung, Grünflächenpflege, Forstwirtschaftliche Pflege |
| B11 | Person in GAL-03: who is it, and may they be shown prominently? | The site's alt text says "Daniel Witte" |

## C. Legal / technical

| # | Missing | Note |
|---|---|---|
| C1 | **Correct USt-IdNr.** | The Impressum shows `048/287/07014` under "Umsatzsteuer-ID", which is the format of a Steuernummer |
| C2 | **Analytics**: who operates `analytics.platzhalterabcd.de`? | Loads on every page; not disclosed in the Datenschutz |
| C3 | **Contact form delivery** | Recipient field is `info&hey@blfservice.de`; inquiries may be lost. Ask whether forms arrive |
| C4 | Hosting provider (the Datenschutz doesn't name it), and domain/DNS access | Needed for launch and the new privacy policy |
| C5 | Keep consentmanager.net? Who holds the contract? | — |
| C6 | Where applications should go (e-mail, form, phone/WhatsApp) | — |
| C7 | Photo rights and consent of the people shown (GAL-01–03, 09, 17) and the licence plate in GAL-15 | Before more prominent use |
| C8 | Preferred canonical host (www or non-www) | `og:url` and canonical disagree |

## Client questions (German, ready to send)

1. **Fotos:** Können Sie uns die Originalfotos in voller Auflösung (direkt
   von Kamera/Handy) schicken? Gibt es weitere Fotos von Einsätzen, Team,
   Maschinen und Fahrzeugen, besonders zu Notfällung, Straßenreinigung,
   Neuanpflanzung, Grünflächenpflege und Forstpflege?
2. **Galerie:** Wir haben alle Galeriebilder geprüft; die Kategorien passen.
   Nur beim Bild unter „Baumkontrolle“ (großer alter Baum im Wald): Zeigt es
   eine Baumkontrolle? Und können Sie zu den Bildern kurz sagen, was für ein
   Auftrag es war (Ort, Jahr, privat/gewerblich/kommunal)?
3. **Logo und Farben:** Haben Sie das Logo als Vektordatei (SVG, AI, PDF
   oder EPS)? Sind das Dunkelgrün `#023435` und die Schriften der jetzigen
   Seite Ihre festen Firmenfarben bzw. -schriften?
4. **Leistungen:** Sind die zehn Leistungen auf der Seite „Leistung“ noch
   aktuell? Bieten Sie Spielgeräteaufbau und Hangbefestigung (aus der
   Galerie) ebenfalls an? Wird Winterdienst auch für Privatkunden angeboten?
5. **Einsatzgebiet:** In welchen Orten bzw. in welchem Umkreis arbeiten Sie?
6. **Jobs:** Welche Stellen suchen Sie konkret (z. B. Baumpfleger/in,
   Forstwirt/in, Fahrer/in Winterdienst)? Welche Voraussetzungen, Arbeitszeit,
   Arbeitsort? Wer ist Ansprechpartner? Wie sollen Bewerbungen ankommen?
7. **Nachweise:** Die Seite nennt „European Treeworker“, „zertifizierte
   Baumkontrolleure“ und „seit 2001“. Dürfen wir das weiter verwenden, und
   können Sie uns die Nachweise zeigen?
8. **Notdienst:** Die Seite sagt „rund um die Uhr“ bei Sturmschäden. Gilt
   das, und unter welcher Nummer?
9. **Referenzen:** Gibt es Kunden oder Projekte, die wir nennen dürfen, und
   Kundenstimmen mit Freigabe?
10. **Impressum:** Unter „Umsatzsteuer-ID“ steht 048/287/07014. Das sieht
    nach einer Steuernummer aus. Haben Sie eine USt-IdNr. (beginnt mit „DE“)?
11. **Kontaktformular:** Kommen Anfragen über das Formular bei Ihnen an? Im
    Formular ist als Empfänger „info&hey@blfservice.de“ eingetragen.
12. **Statistik:** Wer betreibt die Besucherstatistik unter
    „analytics.platzhalterabcd.de“? Sie steht nicht in der
    Datenschutzerklärung.
13. **Hosting/Domain:** Bei welchem Anbieter liegt die Seite, und wer hat
    Zugriff auf Domain und Hosting?
14. **Bildrechte:** Sind die Personen auf den Fotos (auch Mitarbeiter) mit
    einer größeren Darstellung auf der neuen Seite einverstanden? Ist auf
    dem Foto mit dem Mann auf dem Baumstumpf Herr Witte zu sehen?
