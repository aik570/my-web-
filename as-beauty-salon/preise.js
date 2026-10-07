/* =====================================================================
   AS BEAUTY SALON — PREISE
   =====================================================================
   Dies ist die EINZIGE Stelle, an der Preise stehen.
   Jede Änderung hier erscheint automatisch überall auf der Website:
   in allen Preislisten und in den Daten für Google.
   Stand: offizielle Preisliste des Salons.

   SO ÄNDERN SIE EINEN PREIS
   1. Die Zeile der Leistung suchen, z. B.   bart: { name: "Bart", price: "15 €" },
   2. Nur den Text zwischen den Anführungszeichen nach  price:  ändern,
      z. B.  "15 €"  ->  "18 €"   (auch "ab 55 €" oder "nach Absprache" ist möglich)
   3. Datei speichern und die Website neu hochladen (z. B. auf Netlify).

   REGELN
   - Anführungszeichen "..." und das Komma am Zeilenende stehen lassen.
   - Reihenfolge der Zeilen = Reihenfolge auf der Website.
   - Ein Preis ohne Zahl (z. B. "nach Absprache") wird dezent dargestellt.
   - name: ist der angezeigte Name der Leistung und darf auch geändert werden.
   - Neue Leistung: eine Zeile kopieren, den Namen vorne (z. B. pony:)
     eindeutig machen, name und price anpassen.
   - Das Bild der Preisliste (assets/images/preisliste.jpg) ändert sich
     dadurch NICHT — bei neuen Preisen bitte auch das Bild austauschen.
   ===================================================================== */

var salonPrices = {

  /* --- DAMEN · KURZE HAARE --- */
  damenKurz: {
    waschenSchneiden: { name: "Waschen & Schneiden",                   price: "45 €" },
    waschenFoehnen:   { name: "Waschen (Föhnen & Legen)",              price: "45 €" },
    komplett:         { name: "Waschen & Schneiden (Föhnen & Legen)",  price: "60 €" }
  },

  /* --- DAMEN · LANGE HAARE --- */
  damenLang: {
    waschenSchneiden: { name: "Waschen & Schneiden",                   price: "55 €" },
    waschenFoehnen:   { name: "Waschen (Föhnen & Legen)",              price: "ab 55 €" },
    komplett:         { name: "Waschen & Schneiden (Föhnen & Legen)",  price: "ab 70 €" }
  },

  /* --- FÄRBEN --- */
  faerben: {
    faerben:          { name: "Färben",                 price: "ab 55 €" },
    straehnenOben:    { name: "Strähnen (Oberkopf)",    price: "ab 40 €" },
    straehnenKappe:   { name: "Strähnen (Kappe)",       price: "ab 50 €" },
    straehnenFolie:   { name: "Strähnen (10 Folie)",    price: "ab 50 €" }
  },

  /* --- SERVICE --- */
  service: {
    dauerwelleKurz:   { name: "Dauerwelle (kurze Haare)",                        price: "ab 110 €" },
    dauerwelleLang:   { name: "Dauerwelle (lange Haare)",                        price: "ab 130 €" },
    augenbrauenZupfen:{ name: "Augenbrauen zupfen mit Pinzette",                 price: "10 €" },
    faerbenBrauen:    { name: "Augenbrauen / Wimpern färben",                    price: "10 € / 20 €" },
    wimpernLifting:   { name: "Wimpern Lifting-Effekt",                          price: "35 €" },
    keratin:          { name: "Keratin Beratung & Behandlung",                   price: "ab 50 €" },
    permanentMakeUp:  { name: "Permanent Make-Up (Augenbrauen, Lidstriche, Lippen)", price: "je ab 150 €" },
    hochsteck:        { name: "Hochsteckfrisuren (Schminken)",                   price: "nach Absprache" },
    haarmaske:        { name: "Haarmaske / Haar-Kur",                            price: "10 €" }
  },

  /* --- HERREN --- */
  herren: {
    haarschnitt:      { name: "Haarschnitt",            price: "25 €" },
    waschen:          { name: "Haarschnitt & Waschen",  price: "30 €" },
    bart:             { name: "Bart",                   price: "15 €" },
    wax:              { name: "Wax",                    price: "10 €" },
    farbe:            { name: "Farbe",                  price: "50 €" },
    fade:             { name: "Fade",                   price: "10 €" },
    locken:           { name: "Locken",                 price: "100 €" },
    keratinProtein:   { name: "Creatine & Protein",     price: "300 €" }
  },

  /* --- KINDER --- */
  kinder: {
    haarschnitt:      { name: "Haarschnitt (Kinder bis 10 Jahre)", price: "20 €" }
  }
};
