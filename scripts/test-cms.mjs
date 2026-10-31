#!/usr/bin/env node
// End-to-end test of the admin (Decap CMS) with its local backend:
//   1. every collection / settings file opens in /admin/ without errors
//   2. a price is changed in the editor (Apple › iPhone 16 Pro Max › Akku) and published
//   3. only that value changes in src/content/prices/apple.json
//   4. after a rebuild the new price is in the catalogue, on the model page and in the Preisrechner
// The price file is always restored. This checks the CMS and the build, not the GitHub login
// of the hosted site (that needs the owner's GitHub/Netlify account, see docs/CMS.md).
//
//   npm run build && node scripts/test-cms.mjs

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const FILE = 'src/content/prices/apple.json';
const OUT = '.cache/cms-test';
const MODEL = 'iPhone 16 Pro Max';
let failed = 0;
const ok = (c, m) => { console.log(`${c ? '  ✓' : '  ✗'} ${m}`); if (!c) failed++; };

const original = fs.readFileSync(FILE, 'utf8');
const before = JSON.parse(original).models.find((m) => m.name === MODEL).repairs.find((r) => r.service === 'akku').price;
const NEW = before + 7;

const serve = (root, port) => http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(root, p), (e, d) => {
    if (e) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.yml': 'text/yaml', '.wasm': 'application/wasm', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }[path.extname(p)] || 'application/octet-stream' });
    r.end(d);
  });
}).listen(port);

const proxy = spawn('node_modules/.bin/decap-server', [], { env: { ...process.env, PORT: '8081' }, stdio: 'ignore' });
const site = serve('_site', 8080);   // Decap only uses the local backend on localhost
await new Promise((r) => setTimeout(r, 2500));
const browser = await chromium.launch();

try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:8080/admin/'); await page.waitForTimeout(3000);
  const login = page.getByRole('button', { name: /login|anmelden/i });
  if (await login.count()) { await login.first().click(); await page.waitForTimeout(2500); }

  console.log('\nadmin: collections');
  const routes = ['preise/entries/apple', 'einstellungen/entries/kontakt', 'einstellungen/entries/reparaturarten', 'einstellungen/entries/preisliste',
    'einstellungen/entries/produktfotos', 'einstellungen/entries/bewertungen', 'inhalte/entries/startseite', 'inhalte/entries/fachbereiche',
    'inhalte/entries/leistungen', 'inhalte/entries/fragen', 'inhalte/entries/franchise', 'rechtliches/entries/impressum', 'rechtliches/entries/datenschutz'];
  for (const r of routes) {
    await page.goto('http://localhost:8080/admin/#/collections/' + r); await page.waitForTimeout(1800);
    const fields = await page.locator('[class*="ControlContainer"]').count();
    const error = await page.getByText(/Fehler beim|konnte nicht geladen|error loading|failed to load/i).count();
    ok(fields > 0 && !error, `${r} opens (${fields} fields)`);
  }

  console.log('\nadmin: change a price');
  await page.goto('http://localhost:8080/admin/#/collections/preise/entries/apple'); await page.waitForTimeout(3500);
  const item = page.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('[class*="NestedObjectLabel"]', { hasText: new RegExp(`^${MODEL}$`) }) }).first();
  await item.scrollIntoViewIfNeeded(); await item.locator('button').first().click(); await page.waitForTimeout(800);
  const row = item.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('[class*="NestedObjectLabel"]', { hasText: /^akku\b/ }) }).first();
  await row.scrollIntoViewIfNeeded(); await row.locator('button').first().click(); await page.waitForTimeout(600);
  const input = row.locator('input[type="number"]').first();
  ok(Number(await input.inputValue()) === before, `editor shows the current price ${before} €`);
  await input.fill(String(NEW)); await page.waitForTimeout(300);
  await page.getByRole('button', { name: /^Veröffentlichen/ }).first().click(); await page.waitForTimeout(500);
  await page.locator('text=Jetzt veröffentlichen >> visible=true').first().evaluate((e) => (e.closest('[role="menuitem"]') || e.parentElement).click());
  await page.waitForTimeout(3000);

  const saved = fs.readFileSync(FILE, 'utf8');
  const after = JSON.parse(saved).models.find((m) => m.name === MODEL).repairs.find((r) => r.service === 'akku').price;
  ok(after === NEW, `published: ${FILE} now has ${after} €`);
  const changed = saved.split('\n').filter((l, i) => l !== original.split('\n')[i]);
  ok(changed.length === 1 && changed[0].includes(String(NEW)), `only that line changed in the file (${changed.length})`);
  ok(errors.length === 0, `no script errors in the admin ${errors.length ? JSON.stringify(errors.slice(0, 2)) : ''}`);

  console.log('\nsite after rebuild');
  fs.rmSync(OUT, { recursive: true, force: true });
  execSync(`npx eleventy --quiet --output=${OUT}`, { stdio: 'pipe' });
  const cat = JSON.parse(fs.readFileSync(`${OUT}/preise/katalog.json`, 'utf8'));
  const m = cat.brands.find((b) => b.slug === 'apple').models.find((x) => x.name === MODEL);
  ok(m.repairs.find((r) => r[0] === 'akku')[2] === NEW, `catalogue (Preisrechner data): ${NEW} €`);
  ok(new RegExp(`data-type="akku"[^>]*data-price="${NEW}"`).test(fs.readFileSync(`${OUT}/preise/apple/${m.slug}/index.html`, 'utf8')), `model page /preise/apple/${m.slug}/: ${NEW} €`);
  const s2 = serve(OUT, 8082);
  const p2 = await browser.newPage();
  await p2.goto(`http://localhost:8082/reparatur-finden/#apple--${m.slug}--akku`); await p2.waitForSelector('#finder.is-ready'); await p2.waitForTimeout(500);
  ok((await p2.$eval('#r-total', (e) => e.textContent)).includes(`${NEW} €`), `Preisrechner shows ${NEW} €`);
  s2.close();
} finally {
  fs.writeFileSync(FILE, original);   // always restore the price list
  fs.rmSync(OUT, { recursive: true, force: true });
  await browser.close(); site.close(); proxy.kill();
}
console.log(failed ? `\n${failed} check(s) failed` : '\nCMS checks passed (price restored)');
process.exit(failed ? 1 : 0);
