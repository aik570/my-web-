#!/usr/bin/env node
// Guards the production build: it must never contain development prices or
// preview markers, and the launch gate must fail while blockers remain.

import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT = '.cache/prod-test';
let failed = 0;
const ok = (c, m) => { console.log(`${c ? '  ✓' : '  ✗'} ${m}`); if (!c) failed++; };

console.log('\nproduction build');
fs.rmSync(OUT, { recursive: true, force: true });
execSync(`npx eleventy --quiet --output=${OUT}`, { env: { ...process.env, CONTEXT: 'production' }, stdio: 'pipe' });

const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) { if (e.name !== 'admin') walk(p); } else if (p.endsWith('.html')) pages.push(p);
});
walk(OUT);
const all = pages.map((p) => fs.readFileSync(p, 'utf8')).join('\n');
ok(!/Entwicklungsdaten|Testdaten|Testwert|kein echter Preis/.test(all), 'no development prices or test labels');
ok(!/preview-flag|Vorschau · nicht veröffentlicht/.test(all), 'no preview marker');
ok(!pages.filter((p) => !p.endsWith('404.html')).some((p) => /name="robots" content="noindex/.test(fs.readFileSync(p, 'utf8'))), 'indexable (except 404)');
const official = fs.readdirSync('src/content/prices').filter((f) => f.endsWith('.json'));
if (official.length) ok(/Preise in Prüfung|keine echten/.test(fs.readFileSync(path.join(OUT, 'preise', 'index.html'), 'utf8')) || JSON.parse(fs.readFileSync('src/_data/pricesMeta.json', 'utf8')).status === 'verified', 'unverified official prices are labelled "in Prüfung"');
if (!official.length) ok(/Preisliste wird gerade aktualisiert/.test(fs.readFileSync(path.join(OUT, 'index.html'), 'utf8')), 'without official prices the selector shows the call fallback');
// owner decisions (30.10.2026): 3 months warranty, water damage without warranty, Saturday until 18:00
const text = all.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
ok(!/\b(6|12|24|sechs|zwölf)\s*Monate?n?\s+Garantie|Garantie[^.]{0,40}\b(6|12|24)\s*Monate|\d\s*Jahre?n?\s+Garantie/i.test(text), 'no old warranty periods (6/12 months, years)');
ok(/3 Monate Garantie/.test(text) && /Wasserschaden[^.]{0,80}ohne Garantie|Ohne Garantie/.test(text), 'warranty: 3 months, water damage without warranty');
ok(/gesetzlichen Gewährleistungsrechte/.test(text), 'warranty text keeps statutory rights');
const home = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
ok(/"dayOfWeek": "https:\/\/schema.org\/Saturday", "opens": "10:00", "closes": "18:00"/.test(home) && !/Sunday/.test(home.match(/openingHoursSpecification[\s\S]*?\]/)?.[0] || ''), 'structured data: Saturday 10:00–18:00, Sunday closed');
ok(!/Mo–Sa 10:00–18:30|Sa 10:00–18:30/.test(text), 'no page still says Saturday until 18:30');
ok(!/Testeintrag|Layouttest mit Beispieldaten/.test(all), 'no layout-test reviews in the production build');

const gate = spawnSync('node', ['scripts/check-launch.mjs'], { encoding: 'utf8' });
const blockers = (gate.stdout.match(/✗/g) || []).length;
ok(blockers === 0 ? gate.status === 0 : gate.status === 1, `launch gate exit ${gate.status} with ${blockers} blocker(s)`);

fs.rmSync(OUT, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed` : '\nproduction checks passed');
process.exit(failed ? 1 : 0);
