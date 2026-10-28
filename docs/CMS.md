# Handy Chirurg – Website bearbeiten (CMS)

## Für den Inhaber: so ändern Sie die Website

1. Öffnen Sie **https://www.handychirurg.de/admin/** und melden Sie sich mit Ihrem GitHub-Konto an.
2. Links wählen Sie den Bereich:
   - **Preise** – ein Eintrag pro Hersteller, darin Modelle und Reparaturen.
   - **Laden & Kontakt** – Telefon, WhatsApp, E-Mail, Öffnungszeiten, Schließtage, Fehleranalyse, Reparaturarten, Status der Preisliste.
   - **Inhalte** – Texte der Startseite, Fachbereiche, häufige Fragen, Franchise.
   - **Rechtliches** – Impressum und Datenschutzerklärung.
3. Ändern Sie die Felder und klicken Sie oben auf **Veröffentlichen** → **Jetzt veröffentlichen**.
4. Nach etwa einer Minute ist die Änderung auf der Website sichtbar.

Hinweise
- Rot markierte Felder haben ein falsches Format (z. B. Telefon `+491632288224`, Uhrzeit `10:00`). Dann wird nicht gespeichert.
- Preis leer lassen und „Preis auf Anfrage" einschalten, wenn es keinen festen Preis gibt. Ein leerer Preis wird immer als „auf Anfrage" angezeigt, nie als Zahl.
- Jede Änderung wird gespeichert und kann wiederhergestellt werden. Fehler? Melden Sie sich bei uns.
- Schließtage (Urlaub, Feiertage): unter **Laden & Kontakt → Besondere Schließtage** eintragen. Die Anzeige „Jetzt geöffnet" richtet sich danach.

## Ganze Preisliste auf einmal einspielen (Entwickler)

Die offizielle Preisliste als Excel/Sheets-Tabelle mit den Spalten
`Hersteller | Modell | Gerätetyp | Reparatur | Bezeichnung | Preis | Ab | Hinweis`
als CSV speichern und in `data-import/` ablegen (Original bleibt unverändert), dann:

```
npm run import:prices -- data-import/preisliste.csv --dry-run   # nur prüfen
npm run import:prices -- data-import/preisliste.csv             # schreiben
```

Der Import bricht bei unlesbaren Preisen, doppelten Zeilen und unbekannten Reparaturarten ab und schreibt dann nichts. Nach dem Import steht der Status auf „Importiert". Erst nach Stichproben gegen das Original im CMS unter **Laden & Kontakt → Preisliste – Status** auf „Geprüft" setzen; vorher lässt sich die Website nicht in Produktion veröffentlichen.

Die Entwicklungsdaten liegen getrennt in `data-import/demo/` und werden nur in Vorschau-Builds gezeigt, solange keine offizielle Preisliste vorhanden ist. Format und Lieferwege für den Kunden: `docs/PREISLISTE.md`.

## Technik (Entwickler)

| Teil | Lösung |
|---|---|
| Website | Eleventy 3, statisch, Ausgabe `_site/` |
| Inhalte | JSON in `src/_data/`, Preise in `src/content/prices/`, Rechtstexte in `src/content/legal/` |
| CMS | Decap CMS 3.x, selbst gehostet unter `/admin/` (kein CDN), Konfiguration `src/admin/config.yml` |
| Speichern | Jede Veröffentlichung ist ein Git-Commit auf `main`; der Host baut neu |
| Prüfung | Feldformate im CMS; Preise zusätzlich beim Build (`src/_data/prices.js`) – ungültige Daten stoppen den Build, die Live-Seite bleibt dann unverändert |
| Backup / Rückgängig | Git-Historie |

### Lokal arbeiten
```
npm install
npm run cms    # Terminal 1: Decap-Backend für lokale Dateien (Port 8081)
npm run dev    # Terminal 2: Website + Admin auf http://localhost:8080 (/admin/)
```
Im lokalen Modus schreibt das CMS direkt in die Dateien dieses Repositorys.

### Anmeldung in Produktion (vor dem Start einrichten)
Schritt für Schritt mit Zuständigkeiten: `docs/DEPLOY.md`.

Das CMS nutzt das GitHub-Backend (`backend.name: github`). Der Inhaber braucht ein GitHub-Konto mit Schreibrechten auf das Repository.

- **Netlify (empfohlen):** Website mit dem Repository verbinden. Unter *Site configuration → Access & security → OAuth* den Anbieter **GitHub** mit Client-ID und Secret einer GitHub-OAuth-App hinterlegen (Callback-URL `https://api.netlify.com/auth/done`). Das Secret liegt nur bei Netlify, nicht im Repository. Netlify Identity wird **nicht** benötigt.
- **Andere Hosts (z. B. Cloudflare Pages):** einen OAuth-Proxy betreiben (z. B. Cloudflare Worker) und in `config.yml` `backend.base_url` setzen.
- Zwei-Faktor-Anmeldung im GitHub-Konto des Inhabers einschalten.
- Branch `main` als Produktionszweig festlegen (in `config.yml` und beim Host).
- Build-Benachrichtigungen (fehlgeschlagener Build) an die E-Mail des Betreuers senden.

### Vor dem Start
`npm run build && npm test && npm run check` – `check` listet alle offenen Kundenangaben und endet mit Fehler, solange Blocker offen sind.
