#!/usr/bin/env node
// Snapshot of the price calculator on the previous website (handychirurg.de).
// Opens the public page in a browser and keeps the catalogue responses the
// page itself loads (brands, models, repairs, accessories). Nothing else is
// requested and no credentials are used.
//
//   node scripts/fetch-original.mjs        → data-import/original/snapshot.json
//   node scripts/convert-original.mjs      → CSV for npm run import:prices

import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const SOURCE = 'https://www.handychirurg.de/';
const OUT = 'data-import/original/snapshot.json';

const pick = (o, keys) => Object.fromEntries(keys.map((k) => [k, o[k]]));
const tables = {};
const browser = await chromium.launch();
const page = await browser.newPage();
const pending = [];
page.on('response', (r) => {
  const m = r.url().match(/\/rest\/v1\/([a-z_]+)\?/);
  if (!m || r.request().method() !== 'GET' || !r.ok()) return;
  pending.push(r.json().then((rows) => { (tables[m[1]] = tables[m[1]] || []).push(...rows); }));
});
await page.goto(SOURCE, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3000);
await Promise.all(pending);
await browser.close();

const need = ['repair_brands', 'repair_models', 'repair_services', 'model_accessories'];
const missing = need.filter((t) => !tables[t]);
if (missing.length) { console.error(`Nicht geladen: ${missing.join(', ')}`); process.exit(1); }
const byId = (rows) => [...new Map(rows.map((r) => [r.id, r])).values()];

const snapshot = {
  source: SOURCE,
  retrieved: new Date().toISOString(),
  note: 'Public catalogue data loaded by the previous website\'s price calculator. Values unchanged; -1 means "auf Anfrage" on the old site.',
  brands: byId(tables.repair_brands).map((b) => pick(b, ['id', 'name'])),
  models: byId(tables.repair_models).map((m) => pick(m, ['id', 'brand_id', 'display_name', 'sort_order'])),
  services: byId(tables.repair_services).map((s) => pick(s, ['id', 'model_id', 'service_name', 'price', 'standard_price', 'premium_price', 'original_price', 'duration', 'warranty', 'updated_at'])),
  accessories: byId(tables.model_accessories).map((a) => pick(a, ['id', 'model_id', 'name', 'price', 'description']))
};
fs.mkdirSync('data-import/original', { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(snapshot) + '\n');
console.log(`${OUT}: ${snapshot.brands.length} Hersteller, ${snapshot.models.length} Modelle, ${snapshot.services.length} Reparaturzeilen, ${snapshot.accessories.length} Zubehörzeilen`);
