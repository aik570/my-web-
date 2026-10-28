#!/usr/bin/env node
// Imports a price list exported from Excel/Sheets (CSV, ; or , separated) into
// src/content/prices/<hersteller>.json, validates it and writes a report.
//
//   npm run import:prices -- data-import/preisliste.csv [--demo] [--dry-run]
//
// Columns (header row required, order free, case-insensitive):
//   Hersteller | Modell | Gerätetyp | Reparatur | Bezeichnung | Preis | Ab | Hinweis
// Preis: "189", "189,00", "189 €" or "auf Anfrage". Ab: "ja", "x" or empty.
// Reparatur must match an id or label in src/_data/repairTypes.json.
// The source file is never modified; keep it in data-import/ as the reference.

import fs from 'node:fs';
import path from 'node:path';
import { PRICE_DIR, TYPES_FILE, META_FILE, readJson, validateCatalogue, countRows } from './lib/prices.mjs';

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith('--'));
const demo = args.includes('--demo');
const dryRun = args.includes('--dry-run');
if (!file) { console.error('Aufruf: npm run import:prices -- <datei.csv> [--demo] [--dry-run]'); process.exit(2); }

const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const sep = (raw.split('\n')[0].match(/;/g) || []).length >= (raw.split('\n')[0].match(/,/g) || []).length ? ';' : ',';

// Minimal CSV parser with quoted fields.
function parse(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

const rows = parse(raw);
const head = rows.shift().map((h) => h.trim().toLowerCase().replace('ä', 'ae'));
const col = (name) => head.indexOf(name);
const need = ['hersteller', 'modell', 'reparatur', 'preis'];
const missing = need.filter((n) => col(n) < 0);
if (missing.length) { console.error(`Spalten fehlen: ${missing.join(', ')}`); process.exit(1); }

const types = readJson(TYPES_FILE).items;
const typeOf = (v) => {
  const k = v.trim().toLowerCase();
  const t = types.find((x) => x.id === k || x.label.toLowerCase() === k);
  return t ? t.id : v.trim();
};
const get = (r, n) => (col(n) >= 0 ? (r[col(n)] || '').trim() : '');

const problems = [];
const brands = new Map();
rows.forEach((r, i) => {
  const line = i + 2;
  const brand = get(r, 'hersteller'); const model = get(r, 'modell');
  if (!brand || !model) { problems.push(`Zeile ${line}: Hersteller oder Modell leer`); return; }
  const priceRaw = get(r, 'preis');
  const onRequest = /anfrage/i.test(priceRaw);
  const num = priceRaw.replace(/[€\s]/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  if (!onRequest && !/^\d+(\.\d{1,2})?$/.test(num)) problems.push(`Zeile ${line}: Preis „${priceRaw}" nicht lesbar`);
  if (!brands.has(brand)) brands.set(brand, new Map());
  const models = brands.get(brand);
  if (!models.has(model)) models.set(model, { name: model, category: get(r, 'geraetetyp'), repairs: [] });
  models.get(model).repairs.push({
    service: typeOf(get(r, 'reparatur')),
    label: get(r, 'bezeichnung'),
    price: onRequest ? null : Number(num),
    from: /^(ja|x|yes|1)$/i.test(get(r, 'ab')),
    onRequest,
    note: get(r, 'hinweis'),
    _line: line
  });
});

const catalogue = [...brands.entries()].map(([brand, models], i) => ({
  file: brand, brand, order: i + 1, models: [...models.values()]
}));
const { errors, warnings } = validateCatalogue(catalogue, types);
const all = [...problems, ...errors];

console.log(`Quelle: ${file}`);
console.log(`Zeilen: ${rows.length} · Hersteller: ${catalogue.length} · Modelle: ${catalogue.reduce((n, b) => n + b.models.length, 0)} · Preise: ${countRows(catalogue)}`);
warnings.forEach((w) => console.log(`Hinweis: ${w}`));
if (all.length) {
  console.error(`\n${all.length} Fehler, nichts geschrieben:\n- ${all.join('\n- ')}`);
  process.exit(1);
}
if (dryRun) { console.log('\nProbelauf OK, nichts geschrieben.'); process.exit(0); }

const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
fs.mkdirSync(PRICE_DIR, { recursive: true });
for (const f of fs.readdirSync(PRICE_DIR)) if (f.endsWith('.json')) fs.unlinkSync(path.join(PRICE_DIR, f));
for (const b of catalogue) {
  const out = { brand: b.brand, order: b.order, models: b.models.map((m) => ({ ...m, repairs: m.repairs.map(({ _line, ...r }) => r) })) };
  fs.writeFileSync(path.join(PRICE_DIR, `${slug(b.brand)}.json`), JSON.stringify(out, null, 2) + '\n');
}
const meta = readJson(META_FILE);
meta.status = demo ? 'demo' : 'verified';
meta.source = demo ? 'Entwicklungsdaten. Die offizielle Preisliste von Handy Chirurg liegt noch nicht vor.' : path.basename(file);
meta.updated = new Date().toISOString().slice(0, 10);
fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2) + '\n');
console.log(`\nGeschrieben: ${catalogue.length} Dateien in ${PRICE_DIR}, Status „${meta.status}".`);
