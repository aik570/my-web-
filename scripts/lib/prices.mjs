// Shared price-catalogue logic: used by the Eleventy data file (build-time
// validation), the CSV importer and the launch check. Plain Node, no deps.

import fs from 'node:fs';
import path from 'node:path';

export const PRICE_DIR = 'src/content/prices';          // official data only
export const DEMO_DIR = 'data-import/demo/prices';        // development data, never used in production
export const TYPES_FILE = 'src/_data/repairTypes.json';
export const META_FILE = 'src/_data/pricesMeta.json';

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function loadBrands(dir = PRICE_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ file: path.join(dir, f), ...readJson(path.join(dir, f)) }));
}

// URL-safe id for brands and models (/preise/apple/#iphone-13).
export const slug = (s) => String(s).toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const isPrice = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && Math.round(v * 100) === v * 100;

// Returns { brands, errors, warnings }. Brands come back sorted and normalised.
export function validateCatalogue(brands, repairTypes) {
  const errors = [];
  const warnings = [];
  const typeIds = new Set(repairTypes.map((t) => t.id));
  const seenBrands = new Set();

  for (const b of brands) {
    const where = path.basename(b.file || b.brand || '?');
    if (!b.brand || typeof b.brand !== 'string') { errors.push(`${where}: Hersteller fehlt`); continue; }
    const bKey = b.brand.trim().toLowerCase();
    if (seenBrands.has(bKey)) errors.push(`${where}: Hersteller „${b.brand}" ist doppelt`);
    seenBrands.add(bKey);
    if (!Array.isArray(b.models) || b.models.length === 0) { warnings.push(`${b.brand}: keine Modelle`); continue; }

    const seenModels = new Set();
    for (const m of b.models) {
      const mWhere = `${b.brand} › ${m.name || '?'}`;
      if (!m.name || !String(m.name).trim()) { errors.push(`${b.brand}: Modell ohne Namen`); continue; }
      const mKey = m.id ? String(m.id).trim() : slug(m.name);
      if (m.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(mKey)) errors.push(`${mWhere}: Katalog-ID „${m.id}" ungültig (nur a–z, 0–9, Bindestrich)`);
      if (seenModels.has(mKey)) errors.push(`${mWhere}: Modell ist doppelt (oder gleiche Adresse wie ein anderes Modell)`);
      seenModels.add(mKey);
      if (!Array.isArray(m.repairs) || m.repairs.length === 0) { warnings.push(`${mWhere}: keine Reparaturen`); continue; }

      const seenRows = new Set();
      for (const r of m.repairs) {
        const rWhere = `${mWhere} › ${r.label || r.service || '?'}`;
        if (!typeIds.has(r.service)) errors.push(`${rWhere}: unbekannte Reparaturart „${r.service}"`);
        const rowKey = `${r.service}|${(r.label || '').trim().toLowerCase()}`;
        if (seenRows.has(rowKey)) errors.push(`${rWhere}: Reparatur ist doppelt`);
        seenRows.add(rowKey);
        const hasPrice = r.price !== null && r.price !== undefined && r.price !== '';
        // Contradictory or missing price: show "auf Anfrage" rather than block the whole site.
        if (r.onRequest && hasPrice) warnings.push(`${rWhere}: Preis und „auf Anfrage" gleichzeitig gesetzt – angezeigt wird „auf Anfrage"`);
        if (!r.onRequest && !hasPrice) warnings.push(`${rWhere}: kein Preis eingetragen – angezeigt wird „auf Anfrage"`);
        if (hasPrice && !isPrice(Number(r.price))) errors.push(`${rWhere}: ungültiger Preis „${r.price}"`);
        if (hasPrice && Number(r.price) > 2000) warnings.push(`${rWhere}: ungewöhnlich hoher Preis ${r.price} €`);
      }
    }
  }

  const sorted = brands
    .filter((b) => b.brand)
    .map((b) => ({
      brand: b.brand.trim(),
      slug: slug(b.brand),
      order: Number.isFinite(b.order) ? b.order : 999,
      models: (b.models || [])
        .filter((m) => m.name)
        .map((m) => ({
          name: String(m.name).trim(),
          slug: m.id ? String(m.id).trim() : slug(m.name),
          category: m.category || '',
          repairs: (m.repairs || []).map((r) => ({
            service: r.service,
            label: (r.label || '').trim(),
            price: r.onRequest || r.price === null || r.price === undefined || r.price === '' ? null : Number(r.price),
            from: Boolean(r.from),
            onRequest: Boolean(r.onRequest) || r.price === null || r.price === undefined || r.price === '',
            note: (r.note || '').trim(),
            duration: (r.duration || '').trim()
          }))
        }))
    }))
    .sort((a, b) => a.order - b.order || a.brand.localeCompare(b.brand, 'de'));

  return { brands: sorted, errors, warnings };
}

export function countRows(brands) {
  return brands.reduce((n, b) => n + b.models.reduce((k, m) => k + m.repairs.length, 0), 0);
}

// Model order for the whole catalogue (owner requests 30./31.10.2026): newest first,
// derived from the model name so new models sort themselves in. Every model gets
//   series  – shown as a group heading in the Preisrechner (e.g. "iPhone SE")
//   rank    – order of the series within the brand
//   gen     – generation (higher = newer); a release date where names do not count up
//   variant – order inside one generation (Pro Max, Pro, Plus, base, mini …)
// Models the rules do not know keep their place at the end of their category ("Weitere").
const CATS = ['Smartphone', 'Tablet', 'Smartwatch', 'Laptop', 'PC', 'Sonstiges'];
const vrank = (n, list) => { for (let i = 0; i < list.length; i++) if (list[i].test(n)) return i; return list.length; };
const num = (re, n) => { const m = re.exec(n); return m ? Number(m[1]) : null; };
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 };
const DATES = {
  // Apple, where names do not count up
  'iphone x': 2017.11, 'iphone xs': 2018.09, 'iphone xs max': 2018.09, 'iphone xr': 2018.09,
  'iphone se': 2016.03, 'iphone se 2016': 2016.03, 'iphone se 2020': 2020.04, 'iphone se 2022': 2022.03,
  'ipad pro 13 zoll 1. gen': 2024.05, 'ipad pro 12.9 zoll 6. gen': 2022.10, 'ipad pro 12.9 zoll 5. gen': 2021.05, 'ipad pro 12.9 zoll 4. gen': 2020.03,
  'ipad pro 12.9 zoll 3. gen': 2018.11, 'ipad pro 12.9 zoll 2. gen': 2017.06, 'ipad pro 12.9 zoll 1. gen': 2015.11, 'ipad pro 11 zoll 4. gen': 2022.10,
  'ipad pro 11 zoll 3. gen': 2021.05, 'ipad pro 11 zoll 2. gen': 2020.03, 'ipad pro 11 zoll 1. gen': 2018.11, 'ipad pro 10.5 zoll': 2017.06, 'ipad pro 9.7 zoll': 2016.03,
  'ipad air 13 zoll 1. gen': 2024.05, 'ipad air 11 zoll 1. gen': 2024.05, 'ipad air 5': 2022.03, 'ipad air 4': 2020.10, 'ipad air 3': 2019.03, 'ipad air 2': 2014.10,
  'ipad mini 7': 2024.10, 'ipad mini 6': 2021.09, 'ipad mini 5': 2019.03,
  'ipad 10 2022 10.9 zoll': 2022.10, 'ipad 9 2021 10.2 zoll': 2021.09, 'ipad 8 2020 10.2 zoll': 2020.09, 'ipad 7. gen': 2019.09, 'ipad 6. gen': 2018.03, 'ipad 5. gen': 2017.03,
  // Sony before the 1 / 5 / 10 lines
  'sony xperia xz3': 2018.10, 'sony xperia xz2 premium': 2018.07, 'sony xperia xz2': 2018.04, 'sony xperia xz2 compact': 2018.04, 'sony xperia xa2 ultra': 2018.02,
  'sony xperia xa2': 2018.02, 'sony xperia xz1': 2017.09, 'sony xperia xz1 compact': 2017.09, 'sony xperia xa1 ultra': 2017.04, 'sony xperia xzs': 2017.04,
  'sony xperia xz dual f8332': 2016.10, 'sony xperia xz f8331': 2016.10, 'sony xperia x compact': 2016.09, 'sony xperia xa ultra': 2016.07,
  'sony xperia x performance': 2016.06, 'sony xperia x': 2016.05, 'sony xperia xa': 2016.05,
  // Samsung lines without counting names
  'galaxy xcover 7 pro': 2024.03, 'galaxy xcover 7': 2024.01, 'galaxy xcover 6 pro': 2022.06, 'galaxy xcover 5': 2021.03, 'galaxy xcover pro': 2020.01,
  'galaxy xcover 4s': 2019.06, 'galaxy xcover 4': 2017.04, 'galaxy xcover 3': 2015.04, 'galaxy tab e': 2015.06, 'galaxy tab s': 2014.06,
  'galaxy a3 2017': 2017.01, 'galaxy a5': 2017.01, 'galaxy a6': 2018.05, 'galaxy a6 plus': 2018.05, 'galaxy a7 2018': 2018.10, 'galaxy a8': 2018.01, 'galaxy a9': 2018.11,
  'apple watch ultra ultra 2': 2023.09, 'apple watch series 9 41 45mm': 2023.09, 'apple watch series 8 41 45mm': 2022.09, 'apple watch se 2. gen 40 44 mm': 2022.09,
  'apple watch series 7 41 45mm': 2021.10, 'apple watch series 6 40 44mm': 2020.09, 'apple watch series se 40 44mm': 2020.09, 'apple watch series 5 40 44 mm': 2019.09,
  'apple watch series 4 40 mm': 2018.09, 'apple watch series 4 44 mm': 2018.09, 'apple watch series 3 38 42 mm': 2017.09, 'apple watch series 2 38 mm': 2016.09,
  'apple watch series 2 42 mm': 2016.09, 'apple watch series 1 38 mm': 2016.09, 'apple watch series 1 42 mm': 2016.09
};
const clean = (s) => s.toLowerCase().replace(/[()/,]/g, ' ').replace(/(galaxy)?-?x-?cover/g, (m, g) => (g ? 'galaxy ' : '') + 'xcover').replace(/\s+/g, ' ').trim();
const date = (n) => DATES[n] ?? DATES[n.replace(/ (5g|4g)$/, '')] ?? null;

export function modelOrder(brand, name, category) {
  const n = clean(name), cat = CATS.indexOf(category || 'Smartphone');
  const r = (series, rank, gen, variant) => ({ cat: cat < 0 ? CATS.length : cat, series, rank, gen: gen ?? -1, variant: variant ?? 0 });
  if (brand === 'apple') {
    if (/^iphone se\b/.test(n)) return r('iPhone SE', 2, date(n));
    if (/^iphone x[sr]?\b/.test(n)) return r('iPhone X-Serie', 1, date(n), vrank(n, [/ max$/, /xs$/, /x$/, /xr$/]));
    if (/^iphone/.test(n)) {
      const g = /^iphone air/.test(n) ? 17 : num(/^iphone (\d+)/, n) + (/^iphone \d+s\b/.test(n) ? 0.5 : 0);
      return r('iPhone', 0, g, /^iphone air/.test(n) ? 2 : vrank(n, [/pro max/, /\bpro\b/, /\bair\b/, /\b(plus|max)\b/, /^iphone \d+e?$/, /\bmini\b/, /\de\b/]));
    }
    if (/^ipad pro/.test(n)) return r('iPad Pro', 10, date(n));
    if (/^ipad air/.test(n)) return r('iPad Air', 11, date(n));
    if (/^ipad mini/.test(n)) return r('iPad mini', 12, date(n));
    if (/^ipad/.test(n)) return r('iPad', 13, date(n));
    if (/^apple watch/.test(n)) return r('Apple Watch', 20, date(n), vrank(n, [/ultra/, /series \d/, /se/]));
    if (/^macbook/.test(n)) {
      // Apple's model numbers (A1150 … A2941) rise over time
      return r(/^macbook pro/.test(n) ? 'MacBook Pro' : /^macbook air/.test(n) ? 'MacBook Air' : 'MacBook', /^macbook pro/.test(n) ? 30 : /^macbook air/.test(n) ? 31 : 32, num(/\ba(\d{4})\b/, n));
    }
  }
  if (brand === 'samsung') {
    const tier = [/ultra/, /\b(plus|\+)\b/, /^galaxy [a-z]+ ?\d+$/, /\bfe\b/, /\d+e$/, /lite/];
    let m;
    if ((m = /^galaxy s(\d+)/.exec(n))) return r('Galaxy S', 0, Number(m[1]) < 11 ? Number(m[1]) + 9 : Number(m[1]), vrank(n, [/ultra/, /plus/, /^galaxy s\d+$/, /\bfe\b/, /\d+e$/]));
    if ((m = /^galaxy z fold ?(\d*)/.exec(n))) return r('Galaxy Z Fold', 1, Number(m[1] || 1));
    if ((m = /^galaxy z flip ?(\d*)/.exec(n))) return r('Galaxy Z Flip', 2, Number(m[1] || 1));
    if ((m = /^galaxy note ?(\d+)/.exec(n))) return r('Galaxy Note', 3, Number(m[1]), vrank(n, tier));
    if ((m = /^galaxy ([am])(\d)(\d)/.exec(n))) return r(m[1] === 'a' ? 'Galaxy A' : 'Galaxy M', m[1] === 'a' ? 4 : 5, 2019 + Number(m[3]) + Number(m[2]) / 100, vrank(n, [/\d$/, /5g$/, /\ds$/, /\de$/, /4g$/]));
    if (/^galaxy a\d\b/.test(n)) return r('Galaxy A', 4, date(n) ? date(n) - 0.5 : 2017);
    if ((m = /^galaxy j(\d)/.exec(n))) return r('Galaxy J', 6, (num(/(20\d\d)/, n) || 2018) + Number(m[1]) / 100);
    if (/xcover|x cover/.test(n)) return r('Galaxy XCover', 7, date(n));
    if ((m = /^galaxy tab ([sa])(\d+)/.exec(n))) return r(m[1] === 's' ? 'Galaxy Tab S' : 'Galaxy Tab A', m[1] === 's' ? 10 : 11, Number(m[2]), vrank(n, [/ultra/, /fe plus/, /plus/, /tab [sa]\d+$/, /\bfe\b/, /lite/, /\d+e$/]));
    if (/^galaxy tab/.test(n)) return r('Galaxy Tab', 12, date(n));
  }
  if (brand === 'google') {
    const g = num(/^pixel (\d+)/, n);
    if (g != null) return r('Pixel', 0, g, /\da\b/.test(n) ? 4 + vrank(n, [/xl/, /4g/, /5g/]) : vrank(n, [/pro xl/, /\bpro\b/, /\bxl\b/]));
  }
  if (brand === 'huawei') {
    const v = [/pro plus/, /\bpro\b/, /\bplus\b/, /^\S+ \S+$/, /\bview\b/, /\bx\b/, /lite$/, /lite 5g/, /lite e/];
    let m;
    if ((m = /^p smart/.exec(n))) return r('P smart', 1, num(/(20\d\d)/, n) || 2018, vrank(n, [/plus/]) === 0 ? 0 : 1);
    if ((m = /^p(\d+)/.exec(n))) return r('P-Serie', 0, Number(m[1]), vrank(n, [/pro plus/, /\bpro\b/, /\bplus\b/, /^p\d+$/, /lite$/, /lite 5g/, /lite e/]));
    if ((m = /^mate (\d+|s)/.exec(n))) return r('Mate', 2, m[1] === 's' ? 7 : Number(m[1]), vrank(n, [/\bpro\b/, /\bx\b/, /^mate \d+$/, /lite/]));
    if ((m = /^honor (?:view )?(\d+)/.exec(n))) return r('Honor', 3, Number(m[1]) + (/\d+x\b/.test(n) ? 0.5 : 0), vrank(n, [/\bpro\b/, /^honor \d+x?$/, /view/, /lite/]));
  }
  if (brand === 'xiaomi') {
    let m;
    // Ultra, Pro, base, S, X, T Pro, T, Lite, T Lite
    const v = /\d+t\b/.test(n) ? 6 + vrank(n, [/pro/, /lite/]) : vrank(n, [/ultra/, /\bpro\b/, /^\D+\d+( 5g)?$/, /\d+s\b/, /\d+x\b/, /lite/]);
    if ((m = /^(?:xiaomi )?(?:mi )?(\d+)/.exec(n.replace(/^xiaomi xiaomi/, 'xiaomi'))) && /^xiaomi/.test(n)) return r('Xiaomi', 0, Number(m[1]), v);
    if ((m = /^redmi note (\d+)/.exec(n))) return r('Redmi Note', 1, Number(m[1]), vrank(n, [/pro plus/, /\bpro\b/, /^redmi note \d+$/, /^redmi note \d+ 5g$/, /\d+s\b/, /\d+t\b/]));
    if ((m = /^redmi a(\d+)/.exec(n))) return r('Redmi A', 3, Number(m[1]));
    if ((m = /^redmi (\d+)/.exec(n))) return r('Redmi', 2, Number(m[1]), vrank(n, [/^redmi \d+$/, /\d+t\b/, /\d+c\b/, /\d+a\b/, /\d+at\b/]));
    if ((m = /^poco(?:phone)? ([fx])(\d+)/.exec(n))) return r(m[1] === 'f' ? 'Poco F' : 'Poco X', m[1] === 'f' ? 4 : 5, Number(m[2]), vrank(n, [/ultra/, /\bpro\b/, /\bgt\b/, /^poco(phone)? [fx]\d+$/]));
  }
  if (brand === 'sony') {
    let m;
    if ((m = /^xperia (1|5|10)(?: (plus|i{1,3}|iv|v|vi{0,3}))?$/.exec(n)))
      return r('Xperia ' + m[1], { 1: 0, 5: 1, 10: 2 }[m[1]], m[2] === 'plus' ? 1 : ROMAN[m[2] || 'i'], m[2] === 'plus' ? 1 : 0);
    if (/xperia/.test(n)) return r('Xperia X / XZ', 3, date(n), vrank(n, [/premium/, /ultra/, /compact/]));
  }
  if (brand === 'oneplus') {
    let m;
    if ((m = /^oneplus (\d+)/.exec(n))) return r('OnePlus', 0, Number(m[1]), vrank(n, [/\bpro\b/, /^oneplus \d+$/, /\d+t\b/, /\d+r\b/]));
    if (/^oneplus nord/.test(n)) {
      const g = num(/nord(?: ce)? (\d+)/, n) ?? (/\bn\d+/.test(n) ? 0.5 : 1);
      return r('OnePlus Nord', 1, g, vrank(n, [/^oneplus nord( \d+)?$/, /ce( \d+)?$/, /ce \d+ lite/, /n100/, /n10\b/]));
    }
    if (/^oneplus open/.test(n)) return r('OnePlus Open', 2, 1);
  }
  return r('Weitere', 99, null);
}

// Sorts every brand's models in place: category, series, newest generation, variant;
// unknown names keep their relative order. Adds `series` to each model.
export function orderNewestFirst(brands) {
  for (const b of brands) {
    const keyed = b.models.map((m, i) => ({ m, i, k: modelOrder(b.slug, m.name, m.category) }));
    keyed.sort((x, y) => x.k.cat - y.k.cat || x.k.rank - y.k.rank || y.k.gen - x.k.gen || x.k.variant - y.k.variant || x.i - y.i);
    b.models = keyed.map(({ m, k }) => Object.assign(m, { series: k.series }));
  }
  return brands;
}
