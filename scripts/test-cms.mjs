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
const SITE = 'src/_data/site.json', PHOTOS = 'src/_data/modelImages.json', UPLOAD_DIR = 'src/assets/img/produkte';
const originals = { [SITE]: fs.readFileSync(SITE, 'utf8'), [PHOTOS]: fs.readFileSync(PHOTOS, 'utf8') };
const uploadsBefore = new Set(fs.readdirSync(UPLOAD_DIR));
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

const field = async (page, label, nth = 0) => {
  const id = await page.locator('label', { hasText: new RegExp('^' + label) }).nth(nth).getAttribute('for');
  return page.locator('#' + id);
};
const publish = async (page) => {
  await page.getByRole('button', { name: /^Veröffentlichen/ }).first().click(); await page.waitForTimeout(500);
  await page.locator('text=Jetzt veröffentlichen >> visible=true').first().evaluate((e) => (e.closest('[role="menuitem"]') || e.parentElement).click());
  await page.waitForTimeout(3000);
};

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
  await publish(page);

  console.log('\nadmin: Befund price and opening hours (Laden & Kontakt)');
  await page.goto('http://localhost:8080/admin/#/collections/einstellungen/entries/kontakt'); await page.reload(); await page.waitForTimeout(6000);
  const fee = await field(page, 'Preis in €');
  ok(Number(await fee.inputValue()) === 25, `editor shows Befund 25 €`);
  await fee.fill('31');
  const satTo = await field(page, 'Bis', 5);   // Montag … Samstag = 6th row
  ok((await satTo.inputValue()) === '18:00', 'editor shows Saturday until 18:00');
  const sat = page.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('[class*="NestedObjectLabel"]', { hasText: /Samstag/ }) }).first();
  if (!(await satTo.isVisible())) { await sat.locator('button').first().click(); await page.waitForTimeout(500); }
  await satTo.fill('17:30'); await page.waitForTimeout(300);
  await publish(page);
  const site = JSON.parse(fs.readFileSync(SITE, 'utf8'));
  ok(site.diagnosisFee.amount === 31 && site.hours.find((h) => h.day === 'Samstag').to === '17:30', 'published: site.json has Befund 31 € and Saturday 17:30');

  console.log('\nadmin: add a product photo (model picker + upload)');
  await page.goto('http://localhost:8080/admin/#/collections/einstellungen/entries/produktfotos'); await page.reload(); await page.waitForTimeout(7000);
  await page.getByRole('button', { name: /foto hinzufügen/i }).click(); await page.waitForTimeout(800);
  const items = page.locator('[class*="ListItem-listControlItem"]');
  const last = items.last();
  const modelBox = last.locator('input').first();
  await modelBox.click(); await modelBox.fill('Galaxy S24 Ultra'); await page.waitForTimeout(1500);
  await page.locator('[class*="option"]', { hasText: /^Galaxy S24 Ultra$/ }).first().click(); await page.waitForTimeout(500);
  await last.getByRole('button', { name: /bild|image/i }).first().click(); await page.waitForTimeout(1500);
  const upName = `cms-test-${Date.now()}.webp`;
  fs.mkdirSync('.cache', { recursive: true }); fs.copyFileSync('src/assets/img/produkte/samsung-galaxy-a52.webp', `.cache/${upName}`);
  await page.locator('input[type="file"]').last().setInputFiles(`.cache/${upName}`); await page.waitForTimeout(3000);
  // the uploaded file is selected automatically (marked „Entwurf")
  await page.getByRole('button', { name: /Ausgewähltes Element verwenden|choose selected/i }).last().click(); await page.waitForTimeout(800);
  await (await last.locator('label', { hasText: /^Lizenz/ }).getAttribute('for').then((id) => page.locator('#' + id))).fill('TEST (nur Test)');
  await publish(page);
  const photos = JSON.parse(fs.readFileSync(PHOTOS, 'utf8')).photos;
  const added = photos.find((x) => x.model === 'Galaxy S24 Ultra');
  ok(added && added.license.startsWith('TEST') && added.image === `/assets/img/produkte/${upName}` && fs.existsSync('src' + added.image), `published: photo entry for Galaxy S24 Ultra with the uploaded file (${added && added.image})`);

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
  const brandPage = fs.readFileSync(`${OUT}/preise/apple/index.html`, 'utf8').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  ok(new RegExp(`Apple ${MODEL} .{0,200}Akkuwechsel ${NEW} €`).test(brandPage), `price list /preise/apple/: ${MODEL} Akkuwechsel ${NEW} €`);
  // Befund everywhere
  const anyModel = cat.brands[0].models.find((x) => x.repairs.some((r) => r[0] === 'fehleranalyse'));
  ok(anyModel.repairs.find((r) => r[0] === 'fehleranalyse')[2] === 31, `Befund in the catalogue rows: 31 € (${anyModel.name})`);
  const leist = fs.readFileSync(`${OUT}/leistungen/index.html`, 'utf8'), home = fs.readFileSync(`${OUT}/index.html`, 'utf8'), finder = fs.readFileSync(`${OUT}/reparatur-finden/index.html`, 'utf8');
  ok(/Fehleranalyse ab 31 €/.test(leist) && !/ab 25 €/.test(leist), 'Befund on /leistungen/: ab 31 €, no 25 € left');
  ok(/ab 31 €/.test(home) && /31 €/.test(finder), 'Befund in FAQ (home) and Preisrechner hint: 31 €');
  // opening hours everywhere
  ok(/Samstag<\/th><td>10:00 – 17:30/.test(home), 'hours table (home): Samstag 10:00 – 17:30');
  ok(/schema\.org\/Saturday", "opens": "10:00", "closes": "17:30"/.test(home), 'structured data: Saturday closes 17:30');
  ok(/Sa 10:00–17:30/.test(fs.readFileSync(`${OUT}/impressum/index.html`, 'utf8')), 'footer on every page: Sa 10:00–17:30');
  ok(/"to":"17:30"/.test(home.match(/id="hc-data">[^<]*/)[0]), 'header status data: Saturday until 17:30');
  ok(new RegExp(`data-type="akku"[^>]*data-price="${NEW}"`).test(fs.readFileSync(`${OUT}/preise/apple/${m.slug}/index.html`, 'utf8')), `model page /preise/apple/${m.slug}/: ${NEW} €`);
  const s2 = serve(OUT, 8082);
  const p2 = await browser.newPage();
  await p2.goto(`http://localhost:8082/reparatur-finden/#apple--${m.slug}--akku`); await p2.waitForSelector('#finder.is-ready'); await p2.waitForTimeout(500);
  ok((await p2.$eval('#r-total', (e) => e.textContent)).includes(`${NEW} €`), `Preisrechner shows ${NEW} €`);
  await p2.goto(`http://localhost:8082/reparatur-finden/#samsung--galaxy-s24-ultra`); await p2.waitForSelector('#finder.is-ready'); await p2.waitForTimeout(500);
  ok(await p2.$eval('#f-device-photo', (i) => !i.hidden && /cms-test-\d+\.webp$/.test(i.getAttribute('src')) && i.naturalWidth > 0), 'Preisrechner shows the photo uploaded in the CMS for Galaxy S24 Ultra');
  s2.close();
} finally {
  fs.writeFileSync(FILE, original);   // always restore the price list, settings and photos
  for (const [f, c] of Object.entries(originals)) fs.writeFileSync(f, c);
  for (const f of fs.readdirSync(UPLOAD_DIR)) if (!uploadsBefore.has(f)) fs.rmSync(`${UPLOAD_DIR}/${f}`);
  for (const f of fs.readdirSync('.cache')) if (/^cms-test-\d+\.webp$/.test(f)) fs.rmSync(`.cache/${f}`);
  fs.rmSync(OUT, { recursive: true, force: true });
  await browser.close(); site.close(); proxy.kill();
}
console.log(failed ? `\n${failed} check(s) failed` : '\nCMS checks passed (price restored)');
process.exit(failed ? 1 : 0);
