// Loads and validates the price catalogue.
// Official data lives in src/content/prices. While that folder is empty, local
// and preview builds fall back to the clearly labelled development dataset in
// data-import/demo; production builds never do and show "Preisliste folgt".
// Invalid data stops the build, so a broken price list never reaches the site.

import { loadBrands, readJson, validateCatalogue, countRows, orderNewestFirst, TYPES_FILE, PRICE_DIR, DEMO_DIR } from '../../scripts/lib/prices.mjs';
import env from './env.js';

export default function () {
  const types = readJson(TYPES_FILE).items;
  let raw = loadBrands(PRICE_DIR);
  let isDemo = false;
  if (!raw.length && !env().isProduction) { raw = loadBrands(DEMO_DIR); isDemo = raw.length > 0; }
  const { brands, errors, warnings } = validateCatalogue(raw, types);
  for (const w of warnings) console.warn(`[prices] Hinweis: ${w}`);
  if (errors.length) {
    throw new Error(`Preisliste ungültig (${errors.length} Fehler):\n- ${errors.join('\n- ')}`);
  }
  orderNewestFirst(brands);
  // Single source for the error analysis (Befund): its price comes from the CMS setting
  // „Fehleranalyse" (site.json), never from the per-model rows.
  const fee = readJson(new URL('./site.json', import.meta.url)).diagnosisFee?.amount;
  if (Number.isFinite(Number(fee))) for (const b of brands) for (const m of b.models) for (const r of m.repairs)
    if (r.service === 'fehleranalyse') Object.assign(r, { price: Number(fee), onRequest: false });
  if (isDemo) console.warn('[prices] Keine offizielle Preisliste – Entwicklungsdaten werden angezeigt (nur Vorschau).');
  // One entry per model for the model offer pages (/preise/<marke>/<modell>/).
  const models = brands.flatMap((b) => b.models.map((m) => ({ ...m, brand: b.brand, brandSlug: b.slug })));
  return { brands, models, types, rows: countRows(brands), isDemo };
}
