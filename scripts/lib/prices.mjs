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
      const mKey = String(m.name).trim().toLowerCase();
      if (seenModels.has(mKey)) errors.push(`${mWhere}: Modell ist doppelt`);
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
      order: Number.isFinite(b.order) ? b.order : 999,
      models: (b.models || [])
        .filter((m) => m.name)
        .map((m) => ({
          name: String(m.name).trim(),
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
