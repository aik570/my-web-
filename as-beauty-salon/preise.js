/* =====================================================================
   AS BEAUTY SALON — PREISE
   =====================================================================
   Dies ist die EINZIGE Stelle, an der Preise stehen.
   Jede Änderung hier erscheint automatisch überall auf der Website:
   in den beiden großen Angebotszahlen, in den Preislisten Damen/Herren
   und in den Daten für Google.

   SO ÄNDERN SIE EINEN PREIS
   1. Die Zeile der Leistung suchen, z. B.   bart: { name: "Bart", price: "15 €" },
   2. Nur den Text zwischen den Anführungszeichen nach  price:  ändern,
      z. B.  "15 €"  ->  "18 €"
   3. Datei speichern und die Website neu hochladen (z. B. ZIP auf Netlify).

   REGELN
   - Anführungszeichen "..." und das Komma am Zeilenende stehen lassen.
   - Reihenfolge der Zeilen = Reihenfolge auf der Website.
   - Ohne Zahl (z. B. "auf Anfrage") wird der Preis dezent dargestellt.
   - name: ist der angezeigte Name der Leistung und darf auch geändert werden.
   - Neue Leistung: eine Zeile kopieren, den Namen vorne (z. B. dauerwelle:)
     eindeutig machen, name und price anpassen.
   ===================================================================== */

var salonPrices = {

  /* --- EXKLUSIVES ANGEBOT: die zwei großen Zahlen oben im Preis-Bereich ---
     VORLÄUFIG — vom Kunden bestätigen (Angebot 15 € / 30 €)
     name  = Text neben der großen Zahl, price = die große Zahl */
  angebot: {
    herren: { name: "Haarschnitt", price: "15 €" },   // Karte "Herren"
    damen:  { name: "Haarschnitt", price: "30 €" }    // Karte "Damen"
  },

  /* --- DAMEN: Preisliste links --- */
  damen: {
    kurzeHaare:  { name: "Kurze Haare",         price: "35 €" },
    mitteHaare:  { name: "Mitte Haare",         price: "45 €" },
    langeHaare:  { name: "Lange Haare",         price: "60 €" },
    fade:        { name: "Fade",                price: "20 €" },
    farbe:       { name: "Farbe",               price: "70 €" },
    kinder:      { name: "Kinderhaarschnitt",   price: "30 €" },
    augenbrauen: { name: "Augenbrauen färben",  price: "15 €" },
    lockerKurze: { name: "Locker Haare – Kurz", price: "90 €" },
    lockerLange: { name: "Locker Haare – Lang", price: "150 €" },
    frauenPaket: { name: "Frauen Paket",        price: "0 €" }
  },

  /* --- HERREN: Preisliste rechts --- */
  herren: {
    haarschnitt:  { name: "Haarschnitt",           price: "25 €" },
    waschen:      { name: "Haarschnitt + Waschen", price: "30 €" },
    bart:         { name: "Bart",                  price: "15 €" },
    fade:         { name: "Fade",                  price: "10 €" },
    farbe:        { name: "Farbe",                 price: "50 €" },
    kinder:       { name: "Kinderhaarschnitt",     price: "20 €" },
    wax:          { name: "Wax",                   price: "10 €" },
    locker:       { name: "Locker Haare",          price: "100 €" },
    maennerPaket: { name: "Männer Paket",          price: "0 €" }
  }
};
