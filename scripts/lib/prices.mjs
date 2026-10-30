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
      const mKey = slug(m.name);
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
          slug: slug(m.name),
          category: m.category || '',
          repairs: (m.repairs || []).map((r) => ({
            service: r.service,
            label: (r.label || '').trim(),
            price: r.onRequest || r.price === null || r.price === undefined || r.price === '' ? null : Number(r.price),
            from: Boolean(r.from),
            onRequest: Boolean(r.onRequest) || r.price === null || r.price === undefined || r.price === '',
            note: (r.note || '').trim()
          }))
        }))
    }))
    .sort((a, b) => a.order - b.order || a.brand.localeCompare(b.brand, 'de'));

  return { brands: sorted, errors, warnings };
}

export function countRows(brands) {
  return brands.reduce((n, b) => n + b.models.reduce((k, m) => k + m.repairs.length, 0), 0);
}

// iPhones are listed newest first (owner request 30.10.2026). The order comes
// from the model name, so new models sort themselves in without extra data:
// release (year.month), then Pro Max, Pro, Air, Plus, base, mini, e.
const IPHONE_RELEASE = { x: 2017.11, xs: 2018.09, xr: 2018.09, '8': 2017.09, '7': 2016.09, '6s': 2015.09, '6': 2014.09 };
export function iphoneOrder(name) {
  const n = name.toLowerCase().replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/^iphone\b/.test(n)) return null;
  let date = null;
  const se = /\bse\b(?: (\d{4}))?/.exec(n);
  const num = /^iphone (\d+)(e)?\b/.exec(n);
  if (se) date = { 2016: 2016.03, 2020: 2020.04, 2022: 2022.03 }[se[1] || 2016] || Number(se[1] || 2016);
  else if (/^iphone air\b/.test(n)) date = 2025.09;
  else if (num && Number(num[1]) >= 11) date = 2008 + Number(num[1]) + (num[2] ? 0.02 : 0.09);   // 11 → 2019.09, 16e → 2024.02
  else { const k = /^iphone (\w+)/.exec(n); date = k && IPHONE_RELEASE[k[1]]; }
  if (date == null) return null;
  const variant = /^iphone xr\b/.test(n) ? 5 : /pro max/.test(n) ? 0 : /\bpro\b/.test(n) ? 1 : /\bair\b/.test(n) ? 2 : /\b(plus|max)\b/.test(n) ? 3 : /\bmini\b/.test(n) ? 5 : (num && num[2]) ? 6 : 4;
  return -Math.round(date * 100) * 10 + variant;   // ascending sort → newest first
}
export function orderNewestFirst(brands) {
  for (const b of brands) {
    const slots = [], keyed = [];
    b.models.forEach((m, i) => { const k = iphoneOrder(m.name); if (k != null) { slots.push(i); keyed.push([k, i, m]); } });
    keyed.sort((a, c) => a[0] - c[0] || a[1] - c[1]);
    slots.forEach((slot, j) => { b.models[slot] = keyed[j][2]; });
  }
  return brands;
}
