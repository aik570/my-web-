# Handy Chirurg – Website bearbeiten (CMS)

## Für den Inhaber: so ändern Sie die Website

1. Öffnen Sie **https://www.handychirurg.de/admin/** und melden Sie sich mit Ihrem GitHub-Konto an.
2. Links wählen Sie den Bereich:
   - **Preise** – ein Eintrag pro Hersteller, darin Modelle und Reparaturen.
   - **Laden & Kontakt** – Telefon, WhatsApp, E-Mail, Öffnungszeiten, Schließtage, Fehleranalyse, Reparaturarten, Status der Preisliste.
   - **Inhalte** – Texte der Startseite, Fachbereiche, Reparaturleistungen (Seite /leistungen/), häufige Fragen, Franchise.
   - **Rechtliches** – Impressum und Datenschutzerklärung.
3. Ändern Sie die Felder und klicken Sie oben auf **Veröffentlichen** → **Jetzt veröffentlichen**.
4. Nach etwa einer Minute ist die Änderung auf der Website sichtbar.

Hinweise
- Rot markierte Felder haben ein falsches Format (z. B. Telefon `+491632288224`, Uhrzeit `10:00`). Dann wird nicht gespeichert.
- Preis leer lassen und „Preis auf Anfrage" einschalten, wenn es keinen festen Preis gibt. Ein leerer Preis wird immer als „auf Anfrage" angezeigt, nie als Zahl.
- Jede Änderung wird gespeichert und kann wiederhergestellt werden. Fehler? Melden Sie sich bei uns.
- Schließtage (Urlaub, Feiertage): unter **Laden & Kontakt → Besondere Schließtage** eintragen. Die Anzeige „Jetzt geöffnet" richtet sich danach.

### Einen Preis ändern (Beispiel: iPhone 16 Pro Max, Akkuwechsel)
1. **Preise** → **Apple** öffnen. Die Modelle stehen in derselben Reihenfolge wie auf der Website (neueste zuerst). Mit Strg+F / ⌘+F „16 Pro Max" suchen.
2. Den Pfeil links am Modell anklicken → unter **Reparaturen** die Zeile „akku · … · 119 €" aufklappen.
3. **Preis in €** ändern, oben **Veröffentlichen → Jetzt veröffentlichen**.
4. Der neue Preis erscheint nach dem Neuaufbau (ca. 1–2 Minuten) überall gleichzeitig: Preisrechner, Modellseite, Preisübersicht – es gibt nur diese eine Stelle.

Weitere Felder je Reparatur: **Bezeichnung** (z. B. „Display – Originalqualität" für eine zweite Teilequalität), **„ab"-Preis**, **Preis auf Anfrage**, **Hinweis**, **Dauer (nur dieses Modell)**. Reparatur hinzufügen/entfernen = Zeile hinzufügen/Kreuz. Ein Modell, das eine Reparatur nicht anbietet, hat diese Zeile einfach nicht.
Je Modell: **Modell** (Name mit Variante), **Katalog-ID** (Adresse der Modellseite, bei Umbenennungen die alte ID eintragen), **Gerätetyp**. Garantie und Standard-Dauer je Reparaturart: **Laden & Kontakt → Reparaturarten**.

### Produktfotos
**Laden & Kontakt → Produktfotos im Preisrechner**: ein Eintrag pro Modell (Hersteller/Katalog-ID, Foto, Lizenz, Nachweis). Nur freigestellte Produktfotos mit Lizenz für die gewerbliche Nutzung. Viele Fotos auf einmal (Entwickler): Dateien als `<hersteller>-<katalog-id>.png` nach `incoming/` legen (Namen siehe `project-audit/PRODUCT-PHOTOS-NEEDED.csv`), dann `npm run build && python3 scripts/photos/normalize.py --incoming incoming --license "…" --proof "…"` – zuschneiden, einheitlich auf Weiß setzen, eintragen.

## Ganze Preisliste auf einmal einspielen (Entwickler)

Die offizielle Preisliste als Excel/Sheets-Tabelle mit den Spalten
`Hersteller | Modell | Gerätetyp | Reparatur | Bezeichnung | Preis | Ab | Hinweis`
als CSV speichern und in `data-import/` ablegen (Original bleibt unverändert), dann:

```
npm run import:prices -- data-import/preisliste.csv --dry-run   # nur prüfen
npm run import:prices -- data-import/preisliste.csv             # schreiben
```

Der Import bricht bei unlesbaren Preisen, doppelten Zeilen und unbekannten Reparaturarten ab und schreibt dann nichts. Nach dem Import steht der Status auf „Importiert". Erst nach Stichproben gegen das Original im CMS unter **Laden & Kontakt → Preisliste – Status** auf „Geprüft" setzen; vorher lässt sich die Website nicht in Produktion veröffentlichen.

### Preise der bisherigen Website übernehmen

Die aktuelle Preisliste stammt aus dem Preisrechner der bisherigen Website (handychirurg.de). Erneut abrufen und einspielen:

```
node scripts/fetch-original.mjs     # Momentaufnahme → data-import/original/snapshot.json
node scripts/convert-original.mjs   # → data-import/original/preisliste-handychirurg.csv
npm run import:prices -- data-import/original/preisliste-handychirurg.csv
```

Regeln der Umwandlung (z. B. -1 → „auf Anfrage") stehen oben in `scripts/convert-original.mjs`. Achtung: Ein erneuter Import überschreibt im CMS geänderte Preise.

Die Entwicklungsdaten liegen getrennt in `data-import/demo/` und werden nur in Vorschau-Builds gezeigt, solange keine offizielle Preisliste vorhanden ist. Format und Lieferwege für den Kunden: `docs/PREISLISTE.md`.

## Technik (Entwickler)

| Teil | Lösung |
|---|---|
| Website | Eleventy 3, statisch, Ausgabe `_site/` |
| Inhalte | JSON in `src/_data/`, Preise in `src/content/prices/`, Rechtstexte in `src/content/legal/` |
| CMS | Decap CMS 3.x, selbst gehostet unter `/admin/` (kein CDN), Konfiguration `src/admin/config.yml` |
| Speichern | Jede Veröffentlichung ist ein Git-Commit auf den konfigurierten Branch; der Host baut neu |
| Prüfung | Feldformate im CMS; Preise zusätzlich beim Build (`src/_data/prices.js`) – ungültige Daten stoppen den Build, die Live-Seite bleibt dann unverändert |
| Backup / Rückgängig | Git-Historie |

### Automatischer Test
`npm run build && npm run test:cms` öffnet /admin/ mit dem lokalen Backend (decap-server), prüft, dass alle Bereiche laden, ändert im Editor einen Preis, veröffentlicht, baut die Website neu und prüft den neuen Preis in Preisrechner und Modellseite. Die Preisdatei wird danach wiederhergestellt. Die GitHub-Anmeldung der gehosteten Seite prüft dieser Test nicht.

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
