#!/usr/bin/env node
// End-to-end checks against the built site (_site), served locally.
//   npm run build && npm test [-- --shots=<dir>]
// Uses the Playwright + Chromium that is preinstalled in the dev environment.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve('_site');
const shotsArg = process.argv.find((a) => a.startsWith('--shots='));
const SHOTS = shotsArg ? shotsArg.split('=')[1] : null;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.yml': 'text/yaml', '.wasm': 'application/wasm' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404, { 'content-type': TYPES['.html'] }); res.end(fs.readFileSync(path.join(ROOT, '404.html'))); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`); if (!cond) failed++; };

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const PAGES = ['/', '/preise/', '/franchise/', '/impressum/', '/datenschutz/', '/404.html'];
const VIEWPORTS = [[390, 844, 'mobile'], [1440, 900, 'desktop']];

for (const [w, h, label] of VIEWPORTS) {
  console.log(`\n${label} ${w}×${h}`);
  for (const url of PAGES) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errors = []; const external = []; const missing = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', (r) => { if (!r.url().startsWith(BASE) && !r.url().startsWith('data:')) external.push(r.url()); });
    page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/404.html') && r.url() !== `${BASE}/404.html`) missing.push(`${r.status()} ${r.url()}`); });
    await page.goto(BASE + url, { waitUntil: 'load' });
    await page.waitForTimeout(url === '/' ? 3500 : 600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    const logo = await page.$eval('.nav__logo', (e) => +getComputedStyle(e).opacity);
    ok(logo === 1, `${url} header logo visible`);
    ok(errors.length === 0, `${url} no console errors ${errors.length ? JSON.stringify(errors.slice(0, 3)) : ''}`);
    ok(external.length === 0, `${url} no third-party requests ${external.length ? JSON.stringify(external.slice(0, 3)) : ''}`);
    ok(missing.length === 0, `${url} no failed assets ${missing.length ? JSON.stringify(missing.slice(0, 3)) : ''}`);
    ok(overflow <= 0, `${url} no horizontal overflow (${overflow}px)`);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${label}-${url.replace(/\W+/g, '_') || 'home'}.png`, fullPage: url !== '/' });
    await page.close();
  }
}

// Internal links resolve
console.log('\nlinks');
const htmlFiles = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'admin') walk(p); } else if (p.endsWith('.html')) htmlFiles.push(p); });
walk(ROOT);
const bad = new Set();
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    let t = path.join(ROOT, href); if (href.endsWith('/')) t = path.join(t, 'index.html');
    if (!fs.existsSync(t)) bad.add(`${path.relative(ROOT, f)} → ${href}`);
  }
}
ok(bad.size === 0, `all internal links resolve ${bad.size ? JSON.stringify([...bad]) : ''}`);

// Price selector
console.log('\nprice selector');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/');
  const data = await page.evaluate(() => JSON.parse(document.getElementById('price-data').textContent));
  const b = data.brands[0]; const m = b.models[0];
  await page.selectOption('#sel-brand', b.brand);
  ok(await page.$eval('#sel-model', (s) => !s.disabled), 'model select enabled after brand');
  const optCount = await page.$$eval('#sel-model option', (o) => o.length - 1);
  ok(optCount === b.models.length, `model options = ${b.models.length} (got ${optCount})`);
  await page.selectOption('#sel-model', m.name);
  const rows = await page.$$eval('.repair', (r) => r.length);
  ok(rows === m.repairs.length, `repairs shown = ${m.repairs.length} (got ${rows})`);
  const priceTxt = await page.$eval('.repair__price', (e) => e.textContent);
  const r0 = m.repairs[0];
  ok(r0.onRequest ? /auf Anfrage/.test(priceTxt) : priceTxt.includes(String(r0.price).replace('.', ',')), `first price matches data (${priceTxt.trim()})`);
  if (m.repairs.length > 1) {
    await page.click('.repair >> nth=1');
    const cta = await page.$eval('#sel-cta', (e) => e.textContent);
    const name1 = m.repairs[1].label || data.types.find((t) => t.id === m.repairs[1].service).label;
    ok(cta.includes(name1), `CTA follows selected repair (${name1})`);
  }
  const tel = await page.$eval('#sel-cta a[href^="tel:"]', (a) => a.getAttribute('href'));
  ok(tel === `tel:${data.phone.dial}`, 'CTA phone link');
  const last = data.brands[data.brands.length - 1]; const lm = last.models[last.models.length - 1];
  await page.fill('#sel-search', lm.name); await page.dispatchEvent('#sel-search', 'change');
  ok((await page.$eval('#sel-brand', (s) => s.value)) === last.brand && (await page.$eval('#sel-model', (s) => s.value)) === lm.name, `search "${lm.name}" selects ${last.brand} ${lm.name}`);
  await page.fill('#sel-search', 'xyz-gibt-es-nicht'); await page.dispatchEvent('#sel-search', 'change');
  ok(/Kein Modell/.test(await page.$eval('#sel-result', (e) => e.textContent)), 'unknown search shows a call fallback');
  await page.close();
}

// Price list filter
console.log('\nprice list');
{
  const page = await browser.newPage();
  await page.goto(BASE + '/preise/');
  const rowsOk = await page.$$eval('[data-row]', (rows) => rows.every((r) => {
    const label = { display: 'Display', akku: 'Akku', wasserschaden: 'Wasserschaden', platine: 'Platine' }[r.dataset.type];
    return !label || r.querySelector('td').textContent.trim().startsWith(label) || r.querySelector('td').textContent.trim().length > 0;
  }));
  ok(rowsOk, 'every price row shows a repair name');
  const typeCheck = await page.$$eval('[data-row]', (rows) => rows.filter((r) => r.dataset.type === 'akku').every((r) => /Akku/.test(r.querySelector('td').textContent)));
  ok(typeCheck, 'repair name matches its type (no fallback to the first type)');
  await page.goto(BASE + '/preise/#akku');
  const visible = await page.$$eval('[data-row]', (r) => r.filter((x) => !x.hidden).map((x) => x.dataset.type));
  ok(visible.length > 0 && visible.every((t) => t === 'akku'), `#akku filters to Akku rows (${visible.length})`);
  await page.click('.chip[data-type=""]');
  await page.fill('#pl-search', 'zzz');
  ok(!(await page.$eval('#pl-none', (e) => e.hidden)), 'no-match message appears');
  await page.close();
}

// Opening state at fixed times (Europe/Berlin)
console.log('\nopening state');
for (const [iso, expect] of [
  ['2026-10-27T11:00:00+01:00', /Jetzt geöffnet/],
  ['2026-10-27T19:30:00+01:00', /ab morgen 10:00/],
  ['2026-11-07T19:00:00+01:00', /ab Montag 10:00/],
  ['2026-11-08T12:00:00+01:00', /ab morgen 10:00/],
  ['2026-10-31T12:00:00+01:00', /Reformationstag/],
  ['2026-12-25T12:00:00+01:00', /1\. Weihnachtstag/]
]) {
  const page = await browser.newPage();
  await page.clock.setFixedTime(new Date(iso));
  await page.goto(BASE + '/');
  const txt = await page.$eval('[data-state]', (e) => e.textContent);
  ok(expect.test(txt), `${iso} → "${txt}"`);
  await page.close();
}

await browser.close();
server.close();
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed');
process.exit(failed ? 1 : 0);
