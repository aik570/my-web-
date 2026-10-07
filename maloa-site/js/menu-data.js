/* MA'LOA menu data: the single source for menu.html. Nothing on the menu page is typed into the HTML.
   SOURCE: "Nährwerte Zutaten & Speisen", Stand Okt/2025 (17 pages), assets/docs/maloa-naehrwerte-2025-10.pdf.
   Values are transcribed exactly as printed (the PDF writes decimals with a comma; here with a point).
   The PDF: "Es handelt sich bei den angegebenen Werten um die errechneten Durchschnittswerte. Die Produkte sowie
   Rezepturen werden regelmäßig aktualisiert. Irrtümer und Druckfehler sind vorbehalten."

   To update: change a value here (one place), keep the ids stable. Fields that are not documented are left out
   (no prices, no descriptions: the PDF has neither). WordPress later: these arrays map 1:1 to custom post types /
   ACF fields (product, ingredient), categories to a taxonomy.

   n = nutrition { kj, kcal, fat, sat (davon gesättigte Fettsäuren), carbs, sugar, fiber, protein, salt } in g
   codes = the PDF's "Allergene & Zusatzstoffe" column, as printed (letters = allergens, numbers = additives)
   star = the PDF's ** mark: "kann Aktivität und Aufmerksamkeit von Kindern beeinträchtigen" */
(function () {
  function n(kj, kcal, fat, sat, carbs, sugar, fiber, protein, salt) {
    return { kj: kj, kcal: kcal, fat: fat, sat: sat, carbs: carbs, sugar: sugar, fiber: fiber, protein: protein, salt: salt };
  }
  var PDF = 'assets/docs/maloa-naehrwerte-2025-10.pdf';
  var ORDER = 'https://maloa.smoothr.de/map';   // the order destination used across the site

  // ---------- allergens and additives (PDF p. 16) ----------
  var allergens = [
    { code: 'a', name: 'Fisch und Fischerzeugnisse' },
    { code: 'b', name: 'Krebstiere und Krebstiererzeugnisse' },
    { code: 'c', name: 'Weichtiere und Weichtiererzeugnisse' },
    { code: 'd', name: 'Glutenhaltige Getreide sowie daraus hergestellte Erzeugnisse' },
    { code: 'd1', name: 'Weizen', parent: 'd' }, { code: 'd2', name: 'Roggen', parent: 'd' }, { code: 'd3', name: 'Gerste', parent: 'd' },
    { code: 'd4', name: 'Hafer', parent: 'd' }, { code: 'd5', name: 'Dinkel', parent: 'd' }, { code: 'd6', name: 'Kamut', parent: 'd' },
    { code: 'e', name: 'Sojabohnen und daraus gewonnene Erzeugnisse' },
    { code: 'f', name: 'Sesamsamen und daraus gewonnene Erzeugnisse' },
    { code: 'g', name: 'Eier und daraus gewonnene Erzeugnisse' },
    { code: 'h', name: 'Senf und daraus gewonnene Erzeugnisse' },
    { code: 'i', name: 'Erdnüsse und daraus gewonnene Erzeugnisse' },
    { code: 'j', name: 'Schalenfrüchte und daraus gewonnene Erzeugnisse' },
    { code: 'j1', name: 'Mandeln', parent: 'j' }, { code: 'j2', name: 'Haselnüsse', parent: 'j' }, { code: 'j3', name: 'Walnüsse', parent: 'j' },
    { code: 'j4', name: 'Cashewnüsse', parent: 'j' }, { code: 'j5', name: 'Pekannüsse', parent: 'j' }, { code: 'j6', name: 'Paranüsse', parent: 'j' },
    { code: 'j7', name: 'Pistazien', parent: 'j' }, { code: 'j8', name: 'Macadamianüsse', parent: 'j' }, { code: 'j9', name: 'Queenslandnüsse', parent: 'j' },
    { code: 'k', name: 'Milch und daraus gewonnene Erzeugnisse (einschließlich Laktose)' },
    { code: 'l', name: 'Sellerie und daraus gewonnene Erzeugnisse' },
    { code: 'm', name: 'Schwefeldioxid und Sulfite in einer Konzentration von mehr als 10 mg/kg oder 10 mg/l als SO2 angegeben' },
    { code: 'n', name: 'Lupine sowie Erzeugnisse daraus' }
  ];
  var additives = [
    { code: '1', name: 'enthält Farbstoffe' }, { code: '2', name: 'enthält Konservierungsstoffe' }, { code: '3', name: 'mit Geschmacksverstärker' },
    { code: '4', name: 'mit Süßungsmitteln' }, { code: '5', name: 'geschwärzt' }, { code: '6', name: 'mit Antioxidationsmittel' },
    { code: '7', name: 'mit Phosphat' }, { code: '8', name: 'gewachst' }, { code: '9', name: 'geschwefelt' },
    { code: '10', name: 'mit Nitritpökelsalz' }, { code: '11', name: 'koffeinhaltig' }, { code: '12', name: 'chininhaltig' },
    { code: '13', name: 'enthält Phenylalaninquelle' }
  ];

  // ---------- ingredients for Poké your style (PDF pp. 1–6), values per portion ----------
  // visual: the layer of the homepage's Spicy Tropical bowl that shows this ingredient (assets/poke), where one exists
  var ingredients = [
    // 01 Base (p. 1)
    { id: 'sushi-reis', name: 'Sushi Reis', group: 'base', codes: ['3'], n: n(1181.98, 282.5, 0.50, 0.25, 62.50, 0.00, 0.00, 5.25, 0.00), visual: ['rice'] },
    { id: 'vollkornreis', name: 'Vollkornreis', group: 'base', codes: [], n: n(1621.3, 387.5, 4.25, 0.00, 79.25, 0.00, 0.00, 8.25, 0.03) },
    { id: 'spinat', name: 'Spinat', group: 'base', codes: [], n: n(33.68, 8.05, 0.14, 0.00, 1.27, 0.00, 0.00, 1.00, 0.00) },
    { id: 'zucchini-nudeln', name: 'Zucchini Nudeln', group: 'base', codes: [], n: n(119.24, 28.5, 0.60, 0.15, 3.30, 3.75, 0.00, 2.40, 0.03) },
    { id: 'quinoa', name: 'Quinoa', group: 'base', codes: [], n: n(903.74, 216, 4.50, 0.00, 37.98, 2.70, 4.50, 7.56, 0.02) },
    // 02 Protein (p. 2)
    { id: 'ahi-tuna', name: 'Ahi Tuna', group: 'protein', codes: ['a', '2', '6'], n: n(230.96, 55.2, 0.24, 0.12, 0.00, 0.00, 0.00, 13.20, 0.42) },
    { id: 'lachs', name: 'Lachs', group: 'protein', codes: ['a'], n: n(502.08, 120, 8.04, 1.32, 0.00, 0.00, 0.00, 11.94, 0.08) },
    { id: 'shrimps', name: 'Shrimps', group: 'protein', codes: ['b'], n: n(224.26, 53.6, 0.16, 0.08, 0.00, 0.00, 0.00, 13.04, 0.59) },
    { id: 'chicken', name: 'Chicken', group: 'protein', codes: [], n: n(388.28, 92.8, 1.52, 0.48, 1.12, 0.48, 0.00, 18.40, 1.20) },
    { id: 'grilled-chicken', name: 'Grilled Chicken', group: 'protein', codes: [], n: n(439.32, 105, 1.70, 0.60, 1.00, 0.50, 0.00, 22.00, 0.83) },
    { id: 'vegan-chicken', name: 'Vegan Chicken', group: 'protein', codes: ['d1', 'e'], n: n(779.9, 186.4, 9.92, 0.80, 2.56, 2.24, 6.80, 18.32, 0.68) },
    { id: 'beetroot-falafel', name: 'Beetroot Falafel', group: 'protein', codes: [], n: n(759.14, 181.44, 10.92, 0.92, 12.60, 4.20, 5.63, 5.46, 0.92) },
    { id: 'bio-raeucher-tofu', name: 'Bio Räucher Tofu', group: 'protein', codes: ['d1', 'e'], n: n(535.55, 128, 7.04, 1.12, 1.36, 0.56, 2.00, 13.60, 0.88), visual: ['tofu'] },
    { id: 'flamed-salmon', name: 'Flamed Salmon', group: 'protein', codes: ['a'], n: n(502.08, 120, 8.04, 1.32, 0.00, 0.00, 0.00, 11.94, 0.08) },
    { id: 'tempura-shrimps', name: 'Tempura Shrimps', group: 'protein', codes: ['b', 'd1', 'e', 'g'], n: n(329.36, 78.72, 0.83, 0.58, 11.58, 1.15, 0.00, 5.63, 1.09) },
    // 03 Mix-ins (p. 3)
    { id: 'gurke', name: 'Gurke', group: 'mixin', codes: [], n: n(37.66, 9, 0.12, 0.00, 2.16, 0.90, 0.30, 0.42, 0.00), visual: ['veg1', 'veg3'] },
    { id: 'tomaten', name: 'Tomaten', group: 'mixin', codes: [], n: n(37.66, 9, 0.06, 0.00, 1.68, 0.00, 0.60, 0.48, 0.00) },
    { id: 'chili', name: 'Chili', group: 'mixin', codes: [], n: n(20.92, 5, 0.26, 0.00, 0.48, 0.00, 0.00, 0.18, 0.00) },
    { id: 'edamame', name: 'Edamame', group: 'mixin', codes: ['e'], n: n(276.14, 66, 0.00, 0.00, 5.16, 1.50, 0.00, 6.12, 0.01) },
    { id: 'rote-zwiebeln', name: 'Rote Zwiebeln', group: 'mixin', codes: [], n: n(41, 9.8, 0.07, 0.00, 1.72, 1.33, 0.63, 0.46, 0.00) },
    { id: 'koriander', name: 'Koriander', group: 'mixin', codes: [], n: n(5.77, 1.38, 0.03, 0.00, 0.22, 0.05, 0.17, 0.13, 0.00) },
    { id: 'rote-bete', name: 'Rote Bete', group: 'mixin', codes: [], n: n(114.22, 27.3, 0.07, 0.00, 5.46, 0.00, 1.63, 0.98, 0.00) },
    { id: 'fruehlingszwiebeln', name: 'Frühlingszwiebeln', group: 'mixin', codes: [], n: n(35.56, 8.5, 0.15, 0.00, 0.83, 0.25, 0.43, 0.50, 0.00), visual: ['veg2'] },
    { id: 'ananas', name: 'Ananas', group: 'mixin', codes: [], n: n(145.6, 34.8, 0.12, 0.06, 7.74, 7.74, 0.84, 0.30, 0.06), visual: ['pineapple'] },
    // 04 Homemade Flavors (p. 4)
    { id: 'maloa-flavor', name: "Ma'Loa Flavor", group: 'flavor', codes: ['c', 'd1', 'e', 'f', '1', '3'], n: n(660.4, 157.84, 13.75, 1.89, 6.26, 4.55, 0.00, 1.08, 2.89) },
    { id: 'vulcano-flavor', name: "Vul'Cano Flavor", group: 'flavor', codes: ['d1', 'e', 'f', 'g', 'h', '2', '3', '4'], n: n(1214.49, 290.27, 28.93, 2.22, 4.32, 2.56, 0.00, 0.83, 1.86) },
    { id: 'green-cream-flavor', name: 'Green Cream Flavor', group: 'flavor', codes: ['d1', 'e', 'f', 'g', 'h', '1', '4', '6'], n: n(858.81, 205.26, 20.66, 1.61, 2.28, 0.68, 0.00, 0.90, 0.82) },
    { id: 'sweet-shoyu-flavor', name: 'Sweet Shoyu Flavor', group: 'flavor', codes: ['d1', 'e'], n: n(338.74, 80.96, 0.34, 0.10, 16.50, 11.81, 0.00, 2.67, 3.05) },
    { id: 'korean-love-flavor', name: 'Korean Love Flavor', group: 'flavor', codes: ['d1', 'e', 'f'], n: n(435.39, 104.06, 3.59, 0.53, 16.31, 11.06, 0.00, 1.09, 1.75), visual: ['sauce'] },
    { id: 'crazy-lime-flavor', name: 'Crazy Lime Flavor', group: 'flavor', codes: ['d1', 'e'], n: n(263.05, 62.87, 0.15, 0.05, 13.69, 11.38, 0.00, 1.45, 2.56) },
    { id: 'sesam-me-flavor', name: 'Sesam Me Flavor', group: 'flavor', codes: ['d1', 'e', 'f'], n: n(636.68, 152.17, 9.54, 1.62, 11.28, 9.15, 0.00, 4.30, 2.54) },
    { id: 'peanut-butter-dream-flavor', name: 'Peanut Butter Dream Flavor', group: 'flavor', codes: ['i'], n: n(675.21, 161.38, 10.91, 4.22, 10.92, 11.30, 0.00, 3.82, 0.52) },
    { id: 'truffleloa-flavor', name: "Truffle'Loa Flavor", group: 'flavor', codes: ['a', 'd2', 'e', 'g', 'h', 'k'], n: n(1063.36, 254.15, 24.46, 2.07, 4.77, 2.77, 0.00, 1.85, 1.38) },
    // 05 Toppings (p. 5)
    { id: 'masago', name: 'Masago', group: 'topping', codes: ['a', '1'], n: n(158.99, 38, 0.35, 0.00, 6.50, 6.50, 0.00, 2.20, 0.88) },
    { id: 'roestzwiebeln', name: 'Röstzwiebeln', group: 'topping', codes: ['d1'], n: n(370.28, 88.5, 6.60, 3.15, 6.00, 1.35, 0.75, 0.90, 0.18) },
    { id: 'cashewkerne', name: 'Cashewkerne', group: 'topping', codes: ['j4'], n: n(620.28, 148.25, 11.25, 1.95, 6.75, 1.48, 0.90, 4.50, 0.01) },
    { id: 'erdnuesse', name: 'Erdnüsse', group: 'topping', codes: ['i'], n: n(523.84, 125.2, 10.20, 2.40, 2.20, 0.80, 1.52, 5.20, 0.20) },
    { id: 'wasabinuesse', name: 'Wasabinüsse', group: 'topping', codes: ['d1', 'i', '1'], n: n(225.1, 53.8, 3.40, 1.00, 4.20, 0.92, 0.42, 1.40, 0.27) },
    { id: 'kokoschips', name: 'Kokoschips', group: 'topping', codes: [], n: n(284.09, 67.9, 6.50, 6.20, 0.84, 0.66, 1.50, 0.76, 0.01), visual: ['coconut'] },
    { id: 'sushi-ingwer', name: 'Sushi-Ingwer', group: 'topping', codes: ['2', '4', '13'], n: n(2.93, 0.7, 0.01, 0.00, 0.05, 0.01, 0.00, 0.02, 0.19) },
    { id: 'beetroot-crunch', name: 'Beetroot-Crunch', group: 'topping', codes: [], n: n(331.37, 79.2, 3.84, 0.38, 9.60, 0.75, 1.01, 1.01, 0.11) },
    // 06 Premium toppings (p. 6)
    { id: 'avocado', name: 'Avocado', group: 'premium', codes: ['6'], n: n(602.5, 144, 13.19, 1.91, 7.68, 0.59, 6.03, 1.80, 0.02) },
    { id: 'guacamole', name: 'Guacamole', group: 'premium', codes: ['6'], n: n(635.97, 152, 14.00, 2.20, 7.40, 1.90, 0.00, 1.50, 1.10) },
    { id: 'kimchi', name: 'Kimchi', group: 'premium', codes: ['a', 'b'], n: n(213.38, 51, 0.50, 0.10, 7.60, 7.60, 0.00, 2.60, 1.80) },
    { id: 'seaweed-salad', name: 'Seaweed Salad', group: 'premium', codes: ['d1', 'e', 'f', '1'], star: true, n: n(307.94, 73.6, 1.92, 0.24, 12.80, 8.00, 0.72, 0.88, 1.60) },
    { id: 'mango', name: 'Mango', group: 'premium', codes: [], n: n(216.94, 51.85, 0.43, 0.09, 11.05, 11.05, 1.45, 0.51, 0.01), visual: ['mango'] },
    { id: 'granatapfel', name: 'Granatapfel', group: 'premium', codes: [], n: n(42.68, 10.2, 0.05, 0.01, 2.58, 2.49, 0.09, 0.14, 0.00) },
    { id: 'rotkohl-salat', name: 'Rotkohl Salat', group: 'premium', codes: ['h'], n: n(573.21, 137, 11.50, 0.80, 6.00, 5.80, 0.00, 1.20, 1.03) },
    { id: 'kichererbsen-karotten-salat', name: 'Kichererbsen-Karotten-Salat', group: 'premium', seasonal: true, codes: ['f'], n: n(355.64, 85, 4.59, 0.34, 7.65, 2.89, 2.55, 2.21, 0.94) },
    { id: 'gurken-wasabi-salat', name: 'Gurken-Wasabi-Salat', group: 'premium', seasonal: true, codes: ['h', 'k'], n: n(256.06, 61.2, 4.76, 3.23, 2.55, 2.55, 1.53, 1.19, 0.77) },
    { id: 'pastinaken-karotten-salat', name: 'Pastinaken-Karotten-Salat', group: 'premium', seasonal: true, codes: [], n: n(433.88, 103.7, 6.21, 0.51, 8.42, 8.42, 2.04, 2.30, 0.60) },
    { id: 'kuerbissalat', name: 'Kürbissalat', group: 'premium', seasonal: true, codes: ['h'], n: n(561.91, 134.3, 7.40, 0.51, 14.11, 12.33, 1.79, 1.87, 0.68) },
    { id: 'rote-bete-apfel-salat', name: 'Rote Bete-Apfel-Salat', group: 'premium', seasonal: true, codes: [], n: n(288.07, 68.85, 3.23, 0.17, 8.59, 8.59, 1.36, 0.77, 0.77) }
  ];

  // ---------- products ----------
  // featured: position in "Ma'loa Favorites" (the five bowls maloa.com and the home page feature, same order)
  // image: the client's own photo, cut out (assets/bowls); products without a photo are shown as type, never illustrated
  // basis: what one value refers to, as the PDF heads the table
  var BOWL = 'pro Portion, ohne Base, mit Mix Salat und Sesam schwarz & weiß';
  var SWEET = 'pro Portion, mit Granola, Kokoschips und Mango';
  var PORTION = 'pro Portion';
  var G100 = 'pro 100 g';
  var ML100 = 'pro 100 ml';
  function img(name, alt) {
    return { src: 'assets/bowls/' + name + '-900.webp', srcset: 'assets/bowls/' + name + '-560.webp 560w, assets/bowls/' + name + '-900.webp 900w', alt: alt };
  }

  var products = [
    // Fish bowls (p. 7)
    { id: 'big-island-tuna-bowl', name: 'Big Island Tuna Bowl', category: 'bowls', type: 'fish', basis: BOWL, ingredients: ['Ahi Tuna', 'Edamame', 'Gurke', 'Rote Zwiebeln', 'Frühlingszwiebeln', "Ma'Loa Flavor", 'Avocado', 'Erdnüsse'],
      codes: ['a', 'c', 'd1', 'e', 'f', 'i', '1', '2', '3', '6'], n: n(2512.32, 600.46, 39.72, 6.60, 26.92, 9.93, 9.37, 29.61, 3.54) },
    { id: 'maui-tuna-bowl', name: 'Maui Tuna Bowl', category: 'bowls', type: 'fish', basis: BOWL, featured: 5, image: img('maui-tuna', 'Maui Tuna Bowl'),
      ingredients: ['Ahi Tuna', 'Edamame', 'Rote Zwiebeln', 'Frühlingszwiebeln', "Vul'Cano Flavor", 'Avocado', 'Masago'],
      codes: ['a', 'd1', 'e', 'f', 'g', 'h', '1', '2', '3', '4', '6'], n: n(2663.91, 636.69, 44.93, 4.53, 27.11, 12.74, 7.55, 25.93, 3.18) },
    { id: 'lanai-tuna-bowl', name: "Lana'i Tuna Bowl", category: 'bowls', type: 'fish', basis: BOWL, featured: 1, image: img('lanai', "Lana'i Tuna Bowl"),
      ingredients: ['Ahi Tuna', 'Edamame', 'Gurke', 'Rote Bete', 'Koriander', 'Crazy Lime Flavor', 'Avocado', 'Erdnüsse'],
      codes: ['a', 'd1', 'e', 'f', 'i', '2', '6'], n: n(2158.4, 515.87, 26.00, 4.75, 37.49, 15.23, 10.10, 30.12, 3.21) },
    { id: 'kauai-salmon-bowl', name: "Kaua'i Salmon Bowl", category: 'bowls', type: 'fish', basis: BOWL,
      ingredients: ['Lachs', 'Edamame', 'Gurke', 'Ananas', 'Korean Love Flavor', 'Kimchi', 'Cashewkerne'],
      codes: ['a', 'b', 'd1', 'e', 'f', 'j4'], n: n(2334.8, 558.03, 25.62, 4.24, 46.64, 30.29, 2.50, 27.80, 3.72) },
    { id: 'molokai-salmon-bowl', name: 'Molokai Salmon Bowl', category: 'bowls', type: 'fish', basis: BOWL, star: true,
      ingredients: ['Lachs', 'Edamame', 'Gurke', 'Rote Bete', 'Sesam Me Flavor', 'Seaweed Salad', 'Erdnüsse'],
      codes: ['a', 'd1', 'e', 'f', 'i', '1'], n: n(2502.83, 598.19, 31.89, 5.86, 39.97, 20.36, 4.63, 30.67, 4.44) },
    { id: 'oahu-salmon-bowl', name: "O'ahu Salmon Bowl", category: 'bowls', type: 'fish', basis: BOWL, star: true,
      ingredients: ['Lachs', 'Edamame', 'Gurke', 'Frühlingszwiebeln', 'Sweet Shoyu Flavor', 'Seaweed Salad', 'Cashewkerne'],
      codes: ['a', 'd1', 'e', 'f', 'j4', '1'], n: n(2222.67, 531.23, 23.82, 3.88, 45.11, 23.95, 2.81, 27.86, 4.75) },
    // Shrimps bowls (p. 8)
    { id: 'green-cream-shrimps-bowl', name: 'Green Cream Shrimps Bowl', category: 'bowls', type: 'fish', basis: BOWL, star: true, featured: 3, image: img('green-cream-shrimp', 'Green Cream Shrimps Bowl'),
      ingredients: ['Shrimps', 'Edamame', 'Gurke', 'Frühlingszwiebeln', 'Green Cream Flavor', 'Seaweed Salad', 'Wasabinüsse'],
      codes: ['b', 'd1', 'e', 'f', 'g', 'h', 'i', '1', '4', '6'], n: n(2069.74, 494.68, 28.41, 3.20, 28.34, 12.26, 2.33, 24.08, 3.29) },
    { id: 'moana-tempura-shrimps-bowl', name: 'Moana Tempura Shrimps Bowl', category: 'bowls', type: 'fish', basis: BOWL,
      ingredients: ['Tempura Shrimps', 'Edamame', 'Gurke', 'Rote Zwiebeln', "Vul'Cano Flavor", 'Avocado', 'Masago'],
      codes: ['a', 'b', 'd1', 'e', 'f', 'g', 'h', '1', '2', '3', '4', '6'], n: n(2764.41, 660.71, 45.49, 4.99, 40.03, 14.55, 7.42, 18.28, 3.85) },
    // Chicken bowls (p. 8)
    { id: 'vulcano-chicken-bowl', name: "Vul'Cano Chicken Bowl", category: 'bowls', type: 'chicken', basis: BOWL,
      ingredients: ['Chicken', 'Frühlingszwiebeln', 'Edamame', 'Gurke', "Vul'Cano Flavor", 'Avocado', 'Cashewkerne'],
      codes: ['d1', 'e', 'f', 'g', 'h', 'j4', '2', '3', '4', '6'], n: n(3279.17, 783.74, 57.16, 6.84, 28.92, 7.77, 8.12, 33.39, 3.09) },
    { id: 'peanutlover-chicken-bowl', name: 'Peanutlover Chicken Bowl', category: 'bowls', type: 'chicken', basis: BOWL, star: true, featured: 4, image: img('peanutlover', 'Peanutlover Chicken Bowl'),
      ingredients: ['Chicken', 'Edamame', 'Gurke', 'Frühlingszwiebeln', 'Peanut Butter Dream Flavor', 'Seaweed Salad', 'Erdnüsse'],
      codes: ['d1', 'e', 'f', 'i', '1'], n: n(2348.9, 561.4, 26.82, 7.62, 36.10, 23.24, 3.43, 36.16, 3.53) },
    { id: 'truffleloa-chicken-bowl', name: "Truffle'Loa Chicken Bowl", category: 'bowls', type: 'chicken', basis: BOWL,
      ingredients: ['Chicken', 'Edamame', 'Gurke', 'Rote Zwiebeln', "Truffle'Loa Flavor", 'Avocado', 'Geröstete Zwiebeln'],
      codes: ['a', 'd2', 'e', 'f', 'g', 'h', 'k', '6'], n: n(2878.05, 687.87, 48.05, 7.88, 28.62, 7.85, 7.97, 30.81, 2.79) },
    // Beetroot falafel and tofu bowls (p. 9)
    { id: 'crazy-beetroot-bowl', name: 'Crazy Beetroot Bowl', category: 'bowls', type: 'plant', basis: BOWL, image: img('crazy-beetroot', 'Crazy Beetroot Bowl'),
      ingredients: ['Beetroot Falafel', 'Gurke', 'Rote Zwiebeln', 'Rote Bete', 'Peanut Butter Dream Flavor', 'Guacamole', 'Beetroot-Crunch'],
      codes: ['f', 'i', '6'], n: n(2698.85, 645.04, 41.92, 8.00, 50.77, 20.39, 9.65, 14.46, 2.66), note: 'In der Nährwerttabelle zusätzlich unter „Bowl of the Month“ geführt.' },
    { id: 'sesam-me-tofu-bowl', name: 'Sesam Me Tofu Bowl', category: 'bowls', type: 'plant', basis: BOWL,
      ingredients: ['Tofu', 'Edamame', 'Gurke', 'Rote Zwiebeln', 'Sesam Me Flavor', 'Mango', 'Erdnüsse'],
      codes: ['d1', 'e', 'f', 'i'], n: n(2372.08, 566.94, 29.40, 5.51, 35.84, 25.30, 6.36, 31.44, 3.64) },
    { id: 'spicy-tropical-tofu-bowl', name: 'Spicy Tropical Tofu Bowl', category: 'bowls', type: 'plant', basis: BOWL, featured: 2, image: img('spicy-tropical', 'Spicy Tropical Tofu Bowl'),
      ingredients: ['Tofu', 'Gurke', 'Frühlingszwiebeln', 'Ananas', 'Korean Love Flavor', 'Mango', 'Kokoschips'],
      codes: ['d1', 'e', 'f'], n: n(1795.06, 429.03, 19.95, 8.27, 41.20, 32.23, 6.97, 18.01, 2.71) },
    // Bowl of the Month table (p. 9) and the rows that follow it without a new heading (pp. 10–11).
    // Availability of these is not stated in the PDF: shown as "Bowl of the Month & Specials", never as permanent.
    { id: 'deepest-ocean-bowl', name: 'Deepest Ocean Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Shrimps', 'Gurke', 'Frühlingszwiebeln', 'Chili', "Vul'Cano Flavor", 'Kichererbsen-Karotten-Salat', 'Wasabinüsse'],
      codes: ['b', 'd1', 'e', 'f', 'g', 'h', 'i', '1', '2', '3', '4'], n: n(2217.9, 530.09, 39.61, 3.92, 20.54, 7.53, 4.16, 19.40, 3.65) },
    { id: 'no-chicken-chicken-bowl', name: 'No Chicken Chicken Bowl', category: 'bowls', type: 'plant', group: 'special', basis: BOWL, star: true,
      ingredients: ['Vegan Chicken', 'Gurke', 'Edamame', 'Rote Bete', 'Peanut Butter Dream Flavor', 'Seaweed Salad', 'Röstzwiebeln'],
      codes: ['d1', 'e', 'f', 'i', '1'], n: n(2665.63, 637.1, 31.53, 8.69, 45.97, 25.30, 10.66, 32.26, 2.99) },
    { id: 'waikiki-tuna-bowl', name: 'Waikiki Tuna Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Ahi Tuna', 'Edamame', 'Gurke', 'Tomaten', 'Korean Love Flavor', 'Guacamole', 'Beetroot-Crunch'],
      codes: ['a', 'd1', 'e', 'f', '2', '6'], n: n(2089.41, 499.38, 23.85, 3.51, 43.23, 16.12, 2.37, 24.65, 3.40) },
    { id: 'flame-me-salmon-bowl', name: 'Flame Me Salmon Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Flamed Salmon', 'Edamame', 'Gurke', 'Frühlingszwiebeln', 'Tomaten', 'Sweet Shoyu Flavor', 'Seaweed Salad', 'Erbsen Crunch'],
      codes: ['a', 'd1', 'e', 'f', 'g', 'h', 'k', '1', '2', '3', '4'], n: n(2864.12, 684.54, 46.47, 6.61, 35.35, 13.52, 2.60, 23.19, 3.85) },
    { id: 'crunchy-sea-bowl', name: 'Crunchy Sea Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Tempura Shrimps', 'Edamame', 'Gurke', 'Rote Zwiebeln', "Vul'cano Flavor", 'Rotkohl Salat', 'Masago'],
      codes: ['a', 'b', 'd1', 'e', 'f', 'g', 'h', '1', '2', '3', '4'], n: n(2735.12, 653.71, 43.80, 3.87, 38.35, 19.75, 1.39, 17.68, 4.86) },
    { id: 'palm-beach-bowl', name: 'Palm Beach Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Shrimps', 'Frühlingszwiebeln', 'Edamame', 'Gurke', "Vul'Cano Flavor", 'Granatapfel', 'Bananenchips'],
      codes: ['b', 'd1', 'e', 'f', 'g', 'h', '2', '3', '4'], n: n(2472.7, 590.99, 38.90, 9.33, 30.20, 12.46, 2.88, 22.45, 2.47) },
    { id: 'dream-team-bowl', name: 'Dream Team Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Shrimps', 'Oktopus', 'Tomaten', 'Gurke', 'Rote Bete', 'Chili', 'Koriander', "Ma'Loa Flavor", 'Guacamole', 'Masago'],
      codes: ['a', 'b', 'c', 'd1', 'e', 'f', '1', '3', '6'], n: n(1996.77, 477.24, 30.84, 4.45, 31.28, 14.11, 3.15, 20.35, 5.35) },
    { id: 'korean-chicken-bowl', name: 'Korean Chicken Bowl', category: 'bowls', type: 'chicken', group: 'special', basis: BOWL,
      ingredients: ['Chicken', 'Gurke', 'Edamame', 'Ananas', 'Tomaten', 'Korean Love Flavor', 'Pastinaken-Karotten-Salat', 'Erdnüsse'],
      codes: ['d1', 'e', 'f', 'i'], n: n(2382.7, 569.48, 23.82, 4.26, 45.70, 30.91, 5.76, 35.14, 3.82) },
    { id: 'pumpkin-ocean-bowl', name: 'Pumpkin Ocean Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Lachs', 'Koriander', 'Gurke', 'Frühlingszwiebeln', 'Edamame', "Vul'Cano Flavor", 'Kürbissalat', 'Walnüsse'],
      codes: ['a', 'd1', 'e', 'f', 'g', 'h', 'j3', '2', '3', '4'], n: n(2885.16, 689.57, 50.01, 4.64, 28.06, 17.70, 3.47, 23.43, 2.63) },
    { id: 'green-vegan-bowl', name: 'Green Vegan Bowl', category: 'bowls', type: 'plant', group: 'special', basis: BOWL, star: true,
      ingredients: ['Vegan Chicken', 'Edamame', 'Grünkohl', 'Rote Zwiebeln', 'Sesam Me Flavor', 'Seaweed Salad', 'Cashewkerne'],
      codes: ['d1', 'e', 'f', 'j4', '1'], n: n(2785.04, 665.64, 34.71, 4.89, 41.38, 23.70, 9.51, 35.81, 4.84) },
    { id: 'forest-beetroot-bowl', name: 'Forest Beetroot Bowl', category: 'bowls', type: 'fish', group: 'special', basis: BOWL,
      ingredients: ['Lachs', 'Gurke', 'Rote Bete', 'Grünkohl', 'Sesam Me Flavor', 'Rote Bete-Apfel-Salat', 'Cashewkerne'],
      codes: ['a', 'd1', 'e', 'f', 'j4'], n: n(2322.08, 554.99, 34.25, 5.34, 35.35, 20.12, 4.65, 24.13, 3.40) },

    // Hawaiian Currys and soup (p. 11)
    { id: 'kaui-mango-chicken-curry', name: "Kau'i Mango Chicken Curry", category: 'currys', type: 'chicken', group: 'curry', basis: BOWL,
      codes: ['e', 'l'], n: n(1202.23, 287.34, 13.59, 10.68, 23.58, 19.95, 0.00, 17.37, 2.73) },
    { id: 'nui-cashew-vegan-curry', name: "Nu'i Cashew Vegan Curry", category: 'currys', type: 'plant', group: 'curry', basis: BOWL,
      codes: ['h', 'j', 'l'], n: n(1685.36, 402.81, 32.04, 17.46, 18.03, 12.09, 0.00, 10.32, 4.23) },
    { id: 'karotte-kokos-ingwer-suppe', name: 'Karotte-Kokos-Ingwer Suppe', category: 'currys', group: 'soup', basis: PORTION,
      codes: ['k'], n: n(1104.58, 264, 15.34, 13.04, 27.33, 20.50, 0.00, 4.63, 5.38) },

    // Sweet bowls and mochi (pp. 12–13)
    { id: 'acai-bowl', name: 'Acai Bowl', category: 'sweet', group: 'sweet-bowl', basis: SWEET,
      codes: ['d1', 'd3', 'd4', '6'], n: n(2409.52, 575.89, 18.59, 9.81, 86.77, 70.87, 6.32, 6.33, 0.16) },
    { id: 'coconut-cashew-bowl', name: 'Coconut-Cashew Bowl', category: 'sweet', group: 'sweet-bowl', basis: SWEET,
      codes: ['d1', 'd3', 'd4', 'j4', '6'], n: n(3463.89, 827.89, 46.91, 32.85, 84.37, 65.35, 6.32, 11.61, 0.14) },
    { id: 'mochi-eis-erdbeere', name: 'Mochi Eis Erdbeere', short: 'Erdbeere', category: 'sweet', group: 'mochi', basis: G100, codes: [], n: n(732.2, 175, 0.30, 0.20, 42.00, 34.00, 0.00, 0.80, 0.01) },
    { id: 'mochi-eis-kakao', name: 'Mochi Eis Kakao', short: 'Kakao', category: 'sweet', group: 'mochi', basis: G100, codes: ['k'], n: n(907.93, 217, 5.10, 3.50, 39.00, 31.00, 0.00, 2.60, 0.10) },
    { id: 'mochi-eis-kokos', name: 'Mochi Eis Kokos', short: 'Kokos', category: 'sweet', group: 'mochi', basis: G100, codes: ['k'], n: n(891.19, 213, 4.90, 3.50, 39.00, 32.00, 0.00, 2.40, 0.10) },
    { id: 'mochi-eis-mango', name: 'Mochi Eis Mango', short: 'Mango', category: 'sweet', group: 'mochi', basis: G100, codes: [], n: n(769.86, 184, 0.20, 0.10, 44.00, 36.00, 0.00, 0.80, 0.02) },
    { id: 'mochi-eis-pistazie', name: 'Mochi Eis Pistazie', short: 'Pistazie', category: 'sweet', group: 'mochi', basis: G100, codes: ['j', 'k'], n: n(999.98, 239, 7.70, 3.80, 39.00, 30.00, 0.00, 3.10, 0.10) },
    { id: 'mochi-eis-vanille', name: 'Mochi Eis Vanille', short: 'Vanille', category: 'sweet', group: 'mochi', basis: G100, codes: ['k'], n: n(899.56, 215, 5.60, 3.80, 39.00, 31.00, 0.00, 2.00, 0.08) },

    // Smoothies (p. 12)
    { id: 'berry-moana', name: 'Berry Moana', category: 'drinks', group: 'smoothie', basis: PORTION, codes: [], n: n(638.98, 152.72, 1.47, 0.18, 28.70, 26.13, 0.00, 2.02, 0.02) },
    { id: 'green-nalani', name: 'Green Nalani', category: 'drinks', group: 'smoothie', basis: PORTION, codes: [], n: n(700.57, 167.44, 1.10, 0.18, 31.10, 28.52, 0.00, 5.70, 0.02) },
    { id: 'tropical-kino', name: 'Tropical Kino', category: 'drinks', group: 'smoothie', basis: PORTION, codes: [], n: n(785.25, 187.68, 4.97, 4.05, 31.83, 27.97, 0.00, 1.66, 0.02) },
    { id: 'pink-neyla', name: 'Pink Neyla', category: 'drinks', group: 'smoothie', basis: PORTION, codes: [], n: n(923.83, 220.8, 6.99, 5.89, 34.41, 29.07, 0.00, 2.76, 0.02) },

    // Getränke (pp. 13–15), per 100 ml
    { id: 'club-mate', name: 'Club Mate', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4', '11'], n: n(83.68, 20, 0.00, 0.00, 5.00, 5.00, 0.00, 0.00, 0.00) },
    { id: 'eb-limonade-pink-grapefruit', name: 'Elephant Bay Limonade Pink Grapefruit', category: 'drinks', group: 'soft', basis: ML100, codes: ['4'], n: n(158.99, 38, 0.00, 0.00, 0.00, 9.30, 0.00, 0.00, 0.00) },
    { id: 'eb-limonade-mandarin', name: 'Elephant Bay Limonade Mandarin', category: 'drinks', group: 'soft', basis: ML100, codes: ['4'], n: n(158.99, 38, 0.00, 0.00, 0.00, 9.10, 0.00, 0.00, 0.00) },
    { id: 'eb-limonade-exotic', name: 'Elephant Bay Limonade Exotic', category: 'drinks', group: 'soft', basis: ML100, codes: ['4'], n: n(163.18, 39, 0.00, 0.00, 0.00, 9.20, 0.00, 0.00, 0.00) },
    { id: 'eb-limonade-lime-mint', name: 'Elephant Bay Limonade Lime Mint', category: 'drinks', group: 'soft', basis: ML100, codes: ['4'], n: n(150.62, 36, 0.00, 0.00, 0.00, 8.60, 0.00, 0.00, 0.00) },
    { id: 'eb-ice-tea-peach', name: 'Elephant Bay Ice Tea Peach', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4'], n: n(146.44, 35, 0.01, 0.00, 0.00, 8.40, 0.00, 0.02, 0.01) },
    { id: 'eb-ice-tea-mango-pineapple', name: 'Elephant Bay Ice Tea Mango Pineapple', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4'], n: n(129.7, 31, 0.50, 0.10, 7.40, 7.40, 0.00, 0.00, 0.01) },
    { id: 'eb-ice-tea-watermelon', name: 'Elephant Bay Ice Tea Watermelon', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4'], n: n(129.7, 31, 0.50, 0.10, 7.40, 7.40, 0.00, 0.50, 0.01) },
    { id: 'eb-ice-tea-pomegranate', name: 'Elephant Bay Ice Tea Pomegranate', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4'], n: n(146.44, 35, 0.50, 0.10, 8.50, 8.40, 0.00, 0.50, 0.00) },
    { id: 'fountain-of-youth-kokosnusswasser', name: 'Fountain Of Youth Kokosnusswasser', category: 'drinks', group: 'soft', basis: ML100, codes: [], n: n(83.68, 20, 0.10, 0.10, 4.89, 4.89, 0.00, 0.10, 0.08) },
    { id: 'fritz-anjola-bio-ananas-limette', name: 'Fritz Anjola Bio Ananas-Limette', category: 'drinks', group: 'soft', basis: ML100, codes: [], n: n(175.73, 42, 0.10, 0.10, 9.80, 9.80, 0.00, 0.10, 0.00) },
    { id: 'fritz-kola', name: 'Fritz Kola', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4', '11'], n: n(167.36, 40, 0.00, 0.00, 9.90, 9.90, 0.00, 0.00, 0.00) },
    { id: 'fritz-kola-zuckerfrei', name: 'Fritz Kola Zuckerfrei', category: 'drinks', group: 'soft', basis: ML100, codes: ['1', '4', '11'], n: n(4.18, 1, 0.10, 0.02, 0.10, 0.00, 0.00, 0.10, 0.02) },
    { id: 'fritz-limo-honigmelone', name: 'Fritz Limo Honigmelone', category: 'drinks', group: 'soft', basis: ML100, codes: ['4', '6'], n: n(175.73, 42, 0.00, 0.00, 10.00, 10.00, 0.00, 0.00, 0.00) },
    { id: 'fritz-limo-zitrone', name: 'Fritz Limo Zitrone', category: 'drinks', group: 'soft', basis: ML100, codes: ['4', '6'], n: n(142.26, 34, 0.00, 0.00, 8.20, 8.20, 0.00, 0.00, 0.00) },
    { id: 'fritz-spritz-bio-apfelschorle', name: 'Fritz Spritz Bio Apfelschorle', category: 'drinks', group: 'soft', basis: ML100, codes: ['4', '6'], n: n(117.15, 28, 0.00, 0.00, 7.10, 6.60, 0.00, 0.00, 0.00) },
    { id: 'fritz-spritz-bio-rhabarberschorle', name: 'Fritz Spritz Bio Rhabarberschorle', category: 'drinks', group: 'soft', basis: ML100, codes: [], n: n(121.34, 29, 0.00, 0.00, 7.00, 6.80, 0.00, 0.00, 0.00) },
    { id: 'homemade-eistee', name: 'Homemade Eistee', category: 'drinks', group: 'soft', basis: ML100, codes: [], n: n(148.11, 35.4, 0.10, 0.10, 8.55, 8.53, 0.00, 0.35, 0.01) },
    { id: 'roy-cucumber-mint-kombucha', name: 'ROY Cucumber Mint Kombucha', category: 'drinks', group: 'kombucha', basis: ML100, codes: [], n: n(83.68, 20, 0.00, 0.00, 5.50, 5.90, 0.00, 0.00, 0.00) },
    { id: 'roy-ginger-kombucha', name: 'ROY Ginger Kombucha', category: 'drinks', group: 'kombucha', basis: ML100, codes: [], n: n(92.05, 22, 0.00, 0.00, 5.10, 4.90, 0.00, 0.00, 0.00) },
    { id: 'roy-raspberry-kombucha', name: 'ROY Raspberry Kombucha', category: 'drinks', group: 'kombucha', basis: ML100, codes: [], n: n(96.23, 23, 0.00, 0.00, 4.80, 4.50, 0.00, 0.00, 0.00) },
    { id: 'roy-strawberry-basil-kombucha', name: 'ROY Strawberry & Basil Kombucha', category: 'drinks', group: 'kombucha', basis: ML100, codes: [], n: n(79.5, 19, 0.00, 0.00, 4.50, 4.40, 0.00, 0.00, 0.00) },
    { id: 'roy-maloa-pineapple-kombucha', name: "ROY x MA'LOA Pineapple Kombucha", category: 'drinks', group: 'kombucha', basis: ML100, codes: [], n: n(92.05, 22, 0.00, 0.00, 5.50, 5.40, 0.00, 0.00, 0.00) },
    { id: 'kona-big-wave-golden-ale', name: 'Kona Big Wave Golden Ale', category: 'drinks', group: 'beer', basis: ML100, codes: ['d3'], n: n(155.56, 37.18, 0.00, 0.00, 2.82, 0.00, 0.00, 0.41, 0.00) },
    { id: 'kona-hanalei-island-ipa', name: 'Kona Hanalei Island IPA', category: 'drinks', group: 'beer', basis: ML100, codes: ['d3'], n: n(169.7, 40.56, 0.00, 0.00, 3.15, 0.00, 0.00, 0.39, 0.00) },
    { id: 'kona-longboard-island-lager', name: 'Kona Longboard Island Lager', category: 'drinks', group: 'beer', basis: ML100, codes: ['d3'], n: n(157.95, 37.75, 0.00, 0.00, 3.10, 0.00, 0.00, 0.56, 0.00) },
    { id: 'viva-con-agua-laut', name: 'Viva con Aqua laut', category: 'drinks', group: 'water', basis: ML100, codes: [], n: n(0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00) },
    { id: 'viva-con-agua-leise', name: 'Viva con Aqua leise', category: 'drinks', group: 'water', basis: ML100, codes: [], n: n(0, 0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00) },
    // teas: "von der Kennzeichnungspflicht befreit" (no values printed)
    { id: 'alberta-rodeo', name: 'Alberta Rodeo', category: 'drinks', group: 'tea', detail: 'Bio-Schwarztee/Kräuter mit Guarana, Roseblüten', exempt: true },
    { id: 'gin-soul', name: 'Gin Soul', category: 'drinks', group: 'tea', detail: 'Bio-Kräutertee', exempt: true },
    { id: 'heidis-delight', name: "Heidi's Delight", category: 'drinks', group: 'tea', detail: 'Bio-Bergkräuter mit Pfefferminze, Zitronenmelisse, Apfel', exempt: true },
    { id: 'maybe-baby', name: 'Maybe Baby', category: 'drinks', group: 'tea', detail: 'Bio-Früchtetee mit Ananas, Erdbeere', exempt: true },
    { id: 'orange-safari', name: 'Orange Safari', category: 'drinks', group: 'tea', detail: 'Bio-Rooibos mit Vanille, Orange', exempt: true },
    { id: 'team-spirit', name: 'Team Spirit', category: 'drinks', group: 'tea', detail: 'Bio-Kräuter/Grüntee mit Lemongrass', exempt: true }
  ];

  window.MALOA_MENU = {
    meta: {
      source: 'Nährwerte Zutaten & Speisen', stand: 'Okt/2025', pdf: PDF, order: ORDER,
      disclaimer: 'Es handelt sich bei den angegebenen Werten um die errechneten Durchschnittswerte. Die Produkte sowie Rezepturen werden regelmäßig aktualisiert. Irrtümer und Druckfehler sind vorbehalten.',
      starNote: 'kann Aktivität und Aufmerksamkeit von Kindern beeinträchtigen'
    },
    // the menu's sections (sticky navigation) in page order
    categories: [
      { id: 'poke', label: 'Poké your style' },
      { id: 'favorites', label: "Ma'loa Favorites" },
      { id: 'bowls', label: 'Bowls' },
      { id: 'currys', label: 'Currys & Soup' },
      { id: 'sweet', label: 'Sweet' },
      { id: 'drinks', label: 'Drinks' }
    ],
    // filters by main protein (from each bowl's documented ingredients); "plant" = the PDF's tofu, beetroot
    // falafel and vegan chicken bowls. Not a "vegan" certification: the allergen codes stay authoritative.
    types: [
      { id: 'all', label: 'Alle' }, { id: 'fish', label: 'Fisch & Seafood' }, { id: 'chicken', label: 'Chicken' }, { id: 'plant', label: 'Pflanzlich' }
    ],
    // the builder's steps; the PDF documents the groups and values, not how many items each step allows,
    // so no limits are enforced (max: null) until the client confirms them
    steps: [
      { id: 'base', no: '01', label: 'Base', max: null },
      { id: 'protein', no: '02', label: 'Protein', max: null },
      { id: 'mixin', no: '03', label: 'Mix-ins', max: null },
      { id: 'flavor', no: '04', label: 'Homemade Flavors', max: null },
      { id: 'topping', no: '05', label: 'Toppings', max: null },
      { id: 'premium', no: '06', label: 'Premium Toppings', max: null }
    ],
    groups: {
      special: 'Bowl of the Month & Specials', curry: 'Hawaiian Currys', soup: 'Suppe', 'sweet-bowl': 'Sweet Bowls', mochi: 'Mochi-Eis',
      smoothie: 'Smoothies', soft: 'Limonaden, Eistee & Co.', kombucha: 'Kombucha', beer: 'Bier', water: 'Wasser', tea: 'Tee'
    },
    allergens: allergens, additives: additives, ingredients: ingredients, products: products
  };
})();
