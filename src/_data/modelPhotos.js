// Product photos per catalogue model, as a lookup { "brand/id": {...} } for the Preisrechner.
// Source: modelImages.json (a list, so the owner can edit it in the CMS). Entries that point to
// a model no longer in the catalogue, or to a missing file, are left out with a warning.
import fs from 'node:fs';
import prices from './prices.js';

export default function () {
  const list = JSON.parse(fs.readFileSync(new URL('./modelImages.json', import.meta.url))).photos || [];
  const known = new Set(prices().models.map((m) => `${m.brandSlug}/${m.slug}`));
  const map = {};
  for (const p of list) {
    if (!p || !p.model || !p.image) continue;
    if (!known.has(p.model)) { console.warn(`[photos] ${p.model}: kein Modell mit dieser Katalog-ID – Foto wird nicht angezeigt`); continue; }
    if (!fs.existsSync(new URL('../' + p.image.replace(/^\//, ''), import.meta.url))) { console.warn(`[photos] ${p.model}: Datei ${p.image} fehlt`); continue; }
    if (!p.license) { console.warn(`[photos] ${p.model}: keine Lizenz eingetragen – Foto wird nicht angezeigt`); continue; }
    map[p.model] = { image: p.image, license: p.license, credit: p.credit || '', licenseUrl: p.licenseUrl || '', source: p.source || '', exact: true };
  }
  return map;
}
