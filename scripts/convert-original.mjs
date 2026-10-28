#!/usr/bin/env node
// Converts data-import/original/snapshot.json (see fetch-original.mjs) into the
// CSV format of npm run import:prices. Values are carried over unchanged:
//   -1           → "auf Anfrage" (the old site's own rule)
//   0            → "auf Anfrage" + listed in the report (0 € is not a real price)
//   original_price (number) → extra row "Display – Originalqualität"
//   premium/original tiers with -1 only → not shown as separate rows (counted)
//   accessories  → repair type "zubehoer", label = accessory name
// Duration/warranty are identical defaults for every row in the source and are
// therefore not copied per row (see repairTypes.json and the status report).

import fs from 'node:fs';

const IN = 'data-import/original/snapshot.json';
const OUT = 'data-import/original/preisliste-handychirurg.csv';
const d = JSON.parse(fs.readFileSync(IN, 'utf8'));

const SERVICE = {
  'Display Reparatur': 'display', 'Akkuwechsel': 'akku', 'Backcover Reparatur': 'backcover',
  'Ladebuchse Reparatur': 'ladebuchse', 'Hauptkamera Reparatur': 'hauptkamera', 'Frontkamera Reparatur': 'frontkamera',
  'Lautsprecher Reparatur': 'lautsprecher', 'WiFi & Bluetooth': 'wifi-bluetooth', 'Wasserschaden': 'wasserschaden',
  'Fehleranalyse': 'fehleranalyse', 'Panzerglas': 'panzerglas'
};
const ORDER = Object.values(SERVICE).concat('zubehoer');
const BRAND_ORDER = ['Apple', 'Samsung', 'Huawei', 'Xiaomi', 'Google', 'Sony', 'OnePlus']; // old site's navigation
const category = (n) => /Watch/.test(n) ? 'Smartwatch' : /MacBook/.test(n) ? 'Laptop' : /iPad|Tab\b|Tab /.test(n) ? 'Tablet' : 'Smartphone';
const fmt = (v) => String(v).replace('.', ',');

const report = { rows: 0, onRequest: 0, zero: [], skippedTiers: { premium: 0, original: 0 }, unknown: [] };
const brandName = Object.fromEntries(d.brands.map((b) => [b.id, b.name]));
const svcByModel = new Map(); for (const s of d.services) (svcByModel.get(s.model_id) || svcByModel.set(s.model_id, []).get(s.model_id)).push(s);
const accByModel = new Map(); for (const a of d.accessories) (accByModel.get(a.model_id) || accByModel.set(a.model_id, []).get(a.model_id)).push(a);

const models = [...d.models].sort((a, b) =>
  BRAND_ORDER.indexOf(brandName[a.brand_id]) - BRAND_ORDER.indexOf(brandName[b.brand_id]) || a.sort_order - b.sort_order);

const lines = [['Hersteller', 'Modell', 'Gerätetyp', 'Reparatur', 'Bezeichnung', 'Preis', 'Ab', 'Hinweis']];
const q = (v) => (/[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
for (const m of models) {
  const brand = brandName[m.brand_id]; const model = m.display_name.trim();
  const rows = [];
  const price = (v, where) => {
    if (v === -1 || v === null) { report.onRequest++; return 'auf Anfrage'; }
    if (v === 0) { report.zero.push(where); report.onRequest++; return 'auf Anfrage'; }
    return fmt(v);
  };
  for (const s of svcByModel.get(m.id) || []) {
    const type = SERVICE[s.service_name];
    if (!type) { report.unknown.push(`${brand} ${model}: ${s.service_name}`); continue; }
    const where = `${brand} ${model} › ${s.service_name}`;
    if (s.premium_price === -1) report.skippedTiers.premium++;
    if (s.original_price === -1) report.skippedTiers.original++;
    if (typeof s.original_price === 'number' && s.original_price > 0) {
      rows.push([type, 'Display – Standardqualität', price(s.price, where)]);
      rows.push([type, 'Display – Originalqualität', price(s.original_price, where + ' (Original)')]);
    } else rows.push([type, '', price(s.price, where)]);
  }
  for (const a of accByModel.get(m.id) || []) rows.push(['zubehoer', a.name, price(a.price, `${brand} ${model} › Zubehör ${a.name}`), a.description || '']);
  rows.sort((a, b) => ORDER.indexOf(a[0]) - ORDER.indexOf(b[0]));
  for (const [type, label, p, note = ''] of rows) { lines.push([brand, model, category(model), type, label, p, '', note]); report.rows++; }
}
fs.writeFileSync(OUT, lines.map((l) => l.map(q).join(';')).join('\n') + '\n');
console.log(`${OUT}: ${report.rows} Zeilen, davon ${report.onRequest} „auf Anfrage"`);
console.log(`0 € in der Quelle (→ auf Anfrage): ${report.zero.length}${report.zero.length ? ' – z. B. ' + report.zero.slice(0, 3).join(', ') : ''}`);
console.log(`Stufen nur mit -1 (nicht als eigene Zeile): Premium ${report.skippedTiers.premium}, Original ${report.skippedTiers.original}`);
if (report.unknown.length) { console.error(`Unbekannte Reparaturen: ${report.unknown.join(', ')}`); process.exit(1); }
