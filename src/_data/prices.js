// Loads the price catalogue from src/content/prices/*.json and validates it.
// Invalid data stops the build, so a broken price list never reaches the live site.

import { loadBrands, readJson, validateCatalogue, countRows, TYPES_FILE } from '../../scripts/lib/prices.mjs';

export default function () {
  const types = readJson(TYPES_FILE).items;
  const { brands, errors, warnings } = validateCatalogue(loadBrands(), types);
  for (const w of warnings) console.warn(`[prices] Hinweis: ${w}`);
  if (errors.length) {
    throw new Error(`Preisliste ungültig (${errors.length} Fehler):\n- ${errors.join('\n- ')}`);
  }
  return { brands, types, rows: countRows(brands) };
}
