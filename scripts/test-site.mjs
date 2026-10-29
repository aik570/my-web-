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
const PAGES = ['/', '/reparatur-finden/', '/leistungen/', '/preise/', '/preise/samsung/', '/preise/apple/iphone-13/', '/franchise/', '/impressum/', '/datenschutz/', '/404.html'];
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
    ok(logo === 1, `${url} header logo visible${logo === 1 ? '' : ' (' + await page.evaluate(() => document.documentElement.className + (document.getElementById('intro') ? ', intro running' : '')) + ')'}`);
    ok(errors.length === 0, `${url} no console errors ${errors.length ? JSON.stringify(errors.slice(0, 3)) : ''}`);
    ok(external.length === 0, `${url} no third-party requests ${external.length ? JSON.stringify(external.slice(0, 3)) : ''}`);
    ok(missing.length === 0, `${url} no failed assets ${missing.length ? JSON.stringify(missing.slice(0, 3)) : ''}`);
    ok(overflow <= 0, `${url} no horizontal overflow (${overflow}px)`);
    // html/body clip overflow-x, so also look for content cut off at the right edge
    const clipped = await page.evaluate(() => [...document.querySelectorAll('main *, footer *, .nav__in > *')].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.width && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(e).position !== 'fixed' && !e.closest('[aria-hidden="true"], .story, canvas, dialog');
    }).slice(0, 3).map((e) => e.tagName + '.' + String(e.className).split(' ')[0] + ' "' + e.textContent.trim().slice(0, 30) + '"'));
    ok(clipped.length === 0, `${url} no content cut off at the edge ${clipped.length ? JSON.stringify(clipped) : ''}`);
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

// Content and SEO basics on every built page
console.log('\ncontent & seo');
{
  const read = (u) => fs.readFileSync(path.join(ROOT, u), 'utf8');
  const titles = htmlFiles.filter((f) => !f.includes('/admin/')).map((f) => [path.relative(ROOT, f), (read(path.relative(ROOT, f)).match(/<title>([^<]*)<\/title>/) || [])[1] || '']);
  const badTitles = titles.filter(([, t]) => !t || /^\s*[–-]/.test(t));
  ok(badTitles.length === 0, `every page has a title ${badTitles.length ? JSON.stringify(badTitles) : ''}`);
  const imp = read('impressum/index.html'); const ds = read('datenschutz/index.html');
  ok(/<h1[^>]*>\s*Impressum/.test(imp) && /Malake Mansour/.test(imp) && /DE368877064/.test(imp), 'Impressum renders heading, owner and VAT id');
  ok(/<h1[^>]*>\s*Datenschutzerkl/.test(ds) && /verantwortliche Stelle/.test(ds) && /WhatsApp/.test(ds), 'Datenschutz renders heading and sections');
  const sm = read('sitemap.xml');
  const brandDirs = fs.readdirSync(path.join(ROOT, 'preise'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  const missingSm = ['/', '/leistungen/', '/preise/', '/franchise/', '/impressum/', '/datenschutz/', ...brandDirs.map((b) => `/preise/${b}/`)].filter((u) => !sm.includes(`/${u.replace(/^\//, '')}<`.replace('/<', '/<')) && !sm.includes(`${u}</loc>`));
  ok(missingSm.length === 0, `sitemap lists all public pages (${brandDirs.length} brand pages) ${missingSm.length ? JSON.stringify(missingSm) : ''}`);
  ok(!/404|admin|katalog/.test(sm), 'sitemap excludes 404, admin and data files');
}

// Preisrechner (/reparatur-finden/)
console.log('\nPreisrechner');
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/reparatur-finden/');
  const data = await page.evaluate(async () => {
    const d = JSON.parse(document.getElementById('finder-data').textContent);
    return { ...d, ...(await (await fetch(d.catalogue)).json()) };
  });
  await page.waitForSelector('#finder.is-ready', { timeout: 8000 }).catch(() => {});
  ok(data.brands.length > 0 && await page.$eval('#finder', (f) => f.classList.contains('is-ready')), `catalogue loads (${data.brands.length} brands)`);
  const apple = data.brands.find((x) => x.slug === 'apple');
  await page.click('.fbrand[data-brand="apple"]');
  ok((await page.$$eval('.fmodel', (e) => e.length)) === apple.models.length, `brand → ${apple.models.length} models`);
  await page.click('#f-cats .chip[data-cat="Tablet"]');
  const tablets = apple.models.filter((m) => m.category === 'Tablet').length;
  ok((await page.$$eval('.fmodel', (e) => e.length)) === tablets, `device type filter → ${tablets} tablets`);
  await page.click('#f-cats .chip[data-cat=""]');
  await page.fill('#f-filter', 'iphone 13'); await page.waitForTimeout(50);
  ok((await page.$$eval('.fmodel', (e) => e.length)) === apple.models.filter((m) => m.name.toLowerCase().includes('iphone 13')).length, 'model filter by text');
  await page.click('.fmodel[data-model="iphone-13"]');
  await page.waitForFunction(() => location.hash === '#apple--iphone-13' && !document.getElementById('f-step2').hidden);
  const m13 = apple.models.find((m) => m.slug === 'iphone-13');
  const services = [...new Set(m13.repairs.filter((r) => r[0] !== 'zubehoer').map((r) => r[0]))];
  ok(page.url().endsWith('#apple--iphone-13') && (await page.$$eval('.frepair', (e) => e.length)) === services.length, `model → ${services.length} repair cards, address #apple--iphone-13`);
  const akku = m13.repairs.find((r) => r[0] === 'akku');
  ok((await page.$eval('.frepair[data-service="akku"] .frepair__price', (e) => e.textContent)).includes(String(akku[2])), `card price = data (Akku ${akku[2]} €)`);
  await page.click('.frepair[data-service="display"]');
  ok(!(await page.$eval('#f-step3', (e) => e.hidden)) && (await page.$$eval('#r-quality-options input', (e) => e.length)) === 2, 'result step with two part qualities (Standard / Original)');
  const orig = m13.repairs.find((r) => r[1] === 'Display – Originalqualität')[2];
  await page.click('#r-quality-options label >> nth=1');
  ok((await page.$eval('#r-total', (e) => e.textContent)).includes(String(orig)), `quality switch → ${orig} €`);
  const foil = m13.repairs.find((r) => r[0] === 'zubehoer' && r[1] === 'Schutzfolie')[2];
  await page.click('#r-extras-list label >> nth=0');
  ok((await page.$eval('#r-total', (e) => e.textContent)).includes(String(orig + foil)), `accessory added → ${orig + foil} €`);
  ok((await page.$eval('#r-mail', (a) => decodeURIComponent(a.href))).includes('Schutzfolie'), 'e-mail enquiry contains the selection');
  ok(await page.$eval('#r-offer', (a) => a.getAttribute('href') === '/preise/apple/iphone-13/#display-originalqualitaet'), 'link to the model page keeps the choice');
  await page.goBack(); await page.waitForTimeout(150);
  ok(!(await page.$eval('#f-step2', (e) => e.hidden)), 'browser back → step 2');
  await page.goBack(); await page.waitForTimeout(150);
  ok(!(await page.$eval('#f-step1', (e) => e.hidden)) && await page.$eval('.fbrand[data-brand="apple"]', (b) => b.getAttribute('aria-pressed') === 'true'), 'browser back → step 1, brand kept');
  // deep links, enquiry state, invalid links
  await page.goto(BASE + '/reparatur-finden/#samsung--galaxy-s23--hauptkamera'); await page.waitForSelector('#finder.is-ready');
  ok(/auf Anfrage/.test(await page.$eval('#r-total', (e) => e.textContent)) && !(await page.$eval('#r-request', (e) => e.hidden)), 'deep link to a repair without price → "Preis auf Anfrage" + enquiry text');
  await page.goto(BASE + '/reparatur-finden/#apple--gibt-es-nicht'); await page.waitForSelector('#finder.is-ready');
  ok(/nicht in der Preisliste/.test(await page.$eval('#f-status', (e) => e.textContent)) && !(await page.$eval('#f-step1', (e) => e.hidden)), 'unknown model → message, back at step 1');
  // search with keyboard
  await page.goto(BASE + '/reparatur-finden/'); await page.waitForSelector('#finder.is-ready');
  await page.fill('#f-search', 'pixel 8'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
  ok(page.url().endsWith('#google--pixel-8'), `search "pixel 8" + ↓ + Enter → ${decodeURIComponent(page.url().split('#')[1] || '')}`);
  await page.goto(BASE + '/reparatur-finden/'); await page.waitForSelector('#finder.is-ready');
  await page.fill('#f-search', 'xyz-gibt-es-nicht'); await page.waitForTimeout(50);
  ok(/Kein Modell gefunden/.test(await page.$eval('#f-hits', (e) => e.textContent)), 'search without result → message with phone');
  ok((await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, 'no horizontal overflow at 390 px');
  await page.close();
  // failed catalogue
  const fail = await browser.newPage();
  await fail.route('**/katalog.json', (r) => r.abort());
  await fail.goto(BASE + '/reparatur-finden/'); await fail.waitForTimeout(600);
  ok(/nicht geladen/.test(await fail.$eval('#f-status', (e) => e.textContent)) && await fail.$('#f-status a[href^="tel:"]') !== null, 'catalogue fails → message with phone link');
  await fail.close();
}

// Price list filter
console.log('\nprice list');
{
  const page = await browser.newPage();
  await page.goto(BASE + '/preise/apple/');
  const typeCheck = await page.$$eval('[data-row]', (rows) => rows.filter((r) => r.dataset.type === 'akku').every((r) => /Akku/.test(r.querySelector('td').textContent)));
  ok(typeCheck, 'repair name matches its type (no fallback to the first type)');
  ok(await page.$$eval('[data-row]', (rows) => rows.every((r) => r.querySelector('td').textContent.trim().length > 0)), 'every price row shows a repair name');
  await page.goto(BASE + '/preise/apple/#akku');
  const visible = await page.$$eval('[data-row]', (r) => r.filter((x) => !x.hidden && !x.closest('[hidden]')).map((x) => x.dataset.type));
  ok(visible.length > 0 && visible.every((t) => t === 'akku'), `#akku filters to Akku rows (${visible.length})`);
  await page.click('.chip[data-type=""]');
  await page.fill('#pl-search', 'zzz');
  ok(!(await page.$eval('#pl-none', (e) => e.hidden)), 'no-match message appears');
  const slug = await page.$eval('[data-model]', (d) => d.id);
  await page.goto(BASE + '/preise/apple/#' + slug);
  ok(await page.$eval('#' + slug, (d) => d.open), `#${slug} opens that model`);
  await page.goto(BASE + '/preise/');
  await page.fill('#pl-find', 'galaxy s23');
  const hits = await page.$$eval('#pl-hits a', (a) => a.map((x) => x.getAttribute('href')));
  ok(hits.length > 0 && hits.every((h) => h.startsWith('/preise/samsung/#')), `overview search finds models (${hits.length})`);
  await page.goto(BASE + '/preise/#display');
  ok(await page.$eval('[data-brand-link]', (a) => a.getAttribute('href').endsWith('#display')), '#display carries the repair type to the brand pages');
  await page.close();
}

// 3D scene: deferred on phones until the first scroll, then starts; desktop starts on idle
console.log('\n3D scene');
{
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(BASE + '/');
  await mob.waitForTimeout(2500);
  ok(!(await mob.evaluate(() => document.documentElement.classList.contains('webgl-ready'))), 'phone: 3D not started before interaction');
  await mob.mouse.wheel(0, 600);
  await mob.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'), null, { timeout: 15000 }).catch(() => {});
  ok(await mob.evaluate(() => document.documentElement.classList.contains('webgl-ready')), 'phone: 3D starts after scrolling');
  await mob.close();
  const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desk.goto(BASE + '/');
  await desk.waitForFunction(() => document.documentElement.classList.contains('webgl-ready'), null, { timeout: 15000 }).catch(() => {});
  ok(await desk.evaluate(() => document.documentElement.classList.contains('webgl-ready')), 'desktop: 3D starts without interaction');
  await desk.close();
  const nogl = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await nogl.route('**/vendor/three.module.min.js', (r) => r.abort());
  await nogl.goto(BASE + '/');
  // the scene loads after the intro, so the fallback follows it
  await nogl.waitForFunction(() => document.documentElement.classList.contains('no-webgl'), null, { timeout: 8000 }).catch(() => {});
  await nogl.waitForTimeout(300);
  const fb = await nogl.evaluate(() => [document.documentElement.classList.contains('no-webgl'), getComputedStyle(document.querySelector('.story__poster')).display !== 'none', document.getElementById('story').offsetHeight < innerHeight * 1.5]);
  ok(fb.every(Boolean), `no WebGL: fallback poster shown and story collapsed ${JSON.stringify(fb)}`);
  await nogl.close();
}

// Reduced motion: no intro, no reveal animation, 3D follows scroll without idle motion
console.log('\nreduced motion');
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + '/');
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => ({
    reduced: document.documentElement.classList.contains('reduced'),
    intro: !!document.getElementById('intro'),
    revealHidden: [...document.querySelectorAll('.reveal')].some((e) => getComputedStyle(e).opacity !== '1')
  }));
  ok(r.reduced && !r.intro, 'reduced motion: intro skipped');
  ok(!r.revealHidden, 'reduced motion: content visible without reveal animation');
  await ctx.close();
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
