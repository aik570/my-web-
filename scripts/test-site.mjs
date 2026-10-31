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
    if (url === '/impressum/') {
      const call = await page.$eval('.nav__call', (c) => {
        const r = c.getBoundingClientRect(), i = c.querySelector('svg').getBoundingClientRect();
        const t = [...c.querySelectorAll('span')].find((x) => getComputedStyle(x).display !== 'none'), g = document.createRange(); g.selectNodeContents(t);
        const tr = g.getBoundingClientRect(), mid = r.top + r.height / 2;
        return { icon: Math.round(i.width), off: Math.max(Math.abs(i.top + i.height / 2 - mid), Math.abs(tr.top + tr.height / 2 - mid)) };
      });
      ok(call.icon === 16 && call.off <= 1, `header phone button: icon ${call.icon}px, icon/number centred (±${call.off.toFixed(1)}px)`);
    }
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

// Header: logo, links, status, phone button and menu never overlap and stay inside the viewport
console.log('\nHeader');
{
  const page = await browser.newPage();
  const bad = [];
  for (const w of [320, 360, 390, 430, 600, 768, 980, 1024, 1100, 1240, 1280, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto(BASE + '/impressum/'); await page.waitForTimeout(150);
    const r = await page.evaluate(() => {
      const els = [...document.querySelectorAll('.nav__in > *')].filter((e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && !e.matches('.nav__links') || (e.matches('.nav__links') && getComputedStyle(e).position !== 'absolute'); });
      const boxes = els.map((e) => ({ n: e.className.split(' ')[0], b: e.getBoundingClientRect() }));
      const hit = [];
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b, c = boxes[j].b;
        if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) hit.push(boxes[i].n + '×' + boxes[j].n);
      }
      const call = document.querySelector('.nav__call').getBoundingClientRect(), nav = document.querySelector('.nav__in').getBoundingClientRect();
      return { hit, out: call.right > innerWidth || call.left < 0, mid: Math.abs(call.top + call.height / 2 - (nav.top + nav.height / 2)) };
    });
    if (r.hit.length || r.out || r.mid > 1) bad.push(`${w}px ${JSON.stringify(r)}`);
  }
  ok(bad.length === 0, `header at 13 widths (320–1920): no overlaps, phone button inside and vertically centred ${bad.join('; ')}`);
  // Franchise in the main navigation: header link on desktop, mobile menu on phones
  await page.setViewportSize({ width: 1280, height: 800 }); await page.goto(BASE + '/');
  ok(await page.$eval('.nav__links a[href="/franchise/"]', (a) => a.getBoundingClientRect().width > 0 && getComputedStyle(a).visibility !== 'hidden'), 'Franchise link visible in the desktop header');
  await page.setViewportSize({ width: 390, height: 800 }); await page.goto(BASE + '/'); await page.waitForTimeout(200);
  await page.evaluate(() => document.documentElement.classList.add('intro-done'));
  await page.click('#menuBtn'); await page.waitForTimeout(300);
  ok(await page.$eval('.nav__links a[href="/franchise/"]', (a) => a.getBoundingClientRect().width > 0), 'Franchise link in the mobile menu');
  const fr = await page.goto(BASE + '/franchise/'); ok(fr.status() === 200, '/franchise/ answers 200');
  await page.close();
}

// Google reviews: only real data from reviews.json; without it, only a link to Google
console.log('\nGoogle-Bewertungen');
{
  const rv = JSON.parse(fs.readFileSync('src/_data/reviews.json', 'utf8'));
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/'); await page.waitForTimeout(300);
  const st = await page.evaluate(() => {
    const s = document.getElementById('bewertungen'), f = document.querySelector('footer');
    return { exists: !!s, beforeFooter: !!s && !!f && s.nextElementSibling === f, height: s ? s.getBoundingClientRect().height : 0,
      cards: document.querySelectorAll('.rstrip__track:not([aria-hidden]) li').length, link: s?.querySelector('.rstrip__link')?.href || '', sample: !!s?.querySelector('.rstrip__sample'),
      bigSection: !!document.querySelector('.reviews, #reviews-h') };
  });
  ok(st.exists && st.beforeFooter && !st.bigSection, 'Google reviews: slim strip directly above the footer, no large section');
  ok(st.height > 0 && st.height <= 120, `reviews strip is compact on a phone (${Math.round(st.height)} px)`);
  ok(st.cards === rv.items.length && !st.sample, `review quotes = reviews.json (${rv.items.length})${rv.items.length ? '' : ' → no quotes, nothing invented'}`);
  ok(/^https:\/\/(www\.)?google\.[a-z.]+\/maps/.test(st.link), 'link to the reviews on Google');
  await page.close();
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
  await page.waitForFunction((n) => document.querySelectorAll('.fmodel').length === n, apple.models.length, { timeout: 3000 }).catch(() => {});
  ok((await page.$$eval('.fmodel', (e) => e.length)) === apple.models.length, `brand → ${apple.models.length} models`);
  const phones = await page.$$eval('.fmodel', (e) => e.map((x) => x.firstChild.textContent).filter((n) => /^iPhone/.test(n)));
  const at = (n) => phones.indexOf(n);
  ok(phones[0] === 'iPhone 17 Pro Max' && at('iPhone 16 Pro Max') > at('iPhone 17') && at('iPhone 16 Pro') > at('iPhone 16 Pro Max') && at('iPhone 16') > at('iPhone 16 Plus') && at('iPhone 6s') < at('iPhone 6') && at('iPhone 6') < at('iPhone XS Max') && at('iPhone X') < at('iPhone SE (2022)'), 'iPhones newest first, Pro Max → Pro → Plus → base, then X-Serie and SE');
  ok((await page.$$eval('.fmodels__group', (e) => e.map((x) => x.textContent))).join('|').startsWith('iPhone|iPhone X-Serie|iPhone SE'), 'model list grouped: iPhone / iPhone X-Serie / iPhone SE');
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
  // device preview: photo of the model before a repair is chosen, then the drawing with the part in red
  // registered photos as the site resolves them (finder data: brand/catalogue-id → photo)
  const imgs = { models: JSON.parse(await page.$eval('#finder-data', (e) => e.textContent)).photos };
  const want = imgs.models['apple/iphone-13'];
  const before = await page.evaluate(() => { const i = document.getElementById('f-device-photo'); return { src: i.getAttribute('src'), shown: !i.hidden && i.getBoundingClientRect().width > 20, svg: getComputedStyle(document.querySelector('.fdevice__svg')).display, note: document.getElementById('f-device-note').textContent }; });
  if (want) {
    ok(before.src === want.image && before.shown && before.svg === 'none', `model chosen → product photo ${want.image.split('/').pop()}`);
    ok(await page.evaluate(async (h) => (await fetch(h)).ok, before.src), 'product photo file loads');
  } else ok(!before.src && !before.shown && before.svg !== 'none' && /Schematische/.test(before.note), 'no licensed product photo for iPhone 13 → drawing, no other picture');
  await page.click('.frepair[data-service="display"]');
  await page.waitForFunction(() => !document.getElementById('f-step3').hidden && document.querySelectorAll('#r-quality-options input').length > 0, null, { timeout: 3000 }).catch(() => {});
  ok(!(await page.$eval('#f-step3', (e) => e.hidden)) && (await page.$$eval('#r-quality-options input', (e) => e.length)) === 2, 'result step with two part qualities (Standard / Original)');
  await page.waitForTimeout(400); // stroke colour transition
  const pic = await page.evaluate(() => {
    const s = document.querySelector('.fdevice__svg');
    return { photo: document.getElementById('f-device-photo').hidden, svg: getComputedStyle(s).display, red: getComputedStyle(s.querySelector('.part--display')).stroke, other: getComputedStyle(s.querySelector('.part--akku')).stroke };
  });
  ok(pic.photo && pic.svg !== 'none' && pic.red === 'rgb(200, 49, 42)' && pic.red !== pic.other, 'repair chosen → photo hidden, drawing with the display in red');
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
  if (want) ok(await page.$eval('#f-device-photo', (i, src) => !i.hidden && i.getAttribute('src') === src, want.image), 'back to repair choice → product photo shown again');
  await page.goBack(); await page.waitForTimeout(150);
  ok(!(await page.$eval('#f-step1', (e) => e.hidden)) && await page.$eval('.fbrand[data-brand="apple"]', (b) => b.getAttribute('aria-pressed') === 'true'), 'browser back → step 1, brand kept');
  // deep links, enquiry state, invalid links
  await page.goto(BASE + '/reparatur-finden/#samsung--galaxy-s23--hauptkamera'); await page.waitForSelector('#finder.is-ready');
  ok(/auf Anfrage/.test(await page.$eval('#r-total', (e) => e.textContent)) && !(await page.$eval('#r-request', (e) => e.hidden)), 'deep link to a repair without price → "Preis auf Anfrage" + enquiry text');
  ok(await page.$eval('#f-device-photo', (i) => i.hidden) && await page.$eval('.fdevice__svg', (s) => s.dataset.part === 'hauptkamera' && getComputedStyle(s.querySelector('.part--hauptkamera')).stroke === 'rgb(200, 49, 42)'), 'deep link to a repair → drawing, main camera in red');
  await page.goto(BASE + '/reparatur-finden/#apple--iphone-14-pro'); await page.waitForSelector('#finder.is-ready'); await page.waitForTimeout(100);
  const p14 = imgs.models['apple/iphone-14-pro'];
  ok(p14 ? await page.$eval('#f-device-photo', (i, src) => !i.hidden && i.getAttribute('src') === src, p14.image) : (!(await page.$eval('#f-device-photo', (i) => i.hasAttribute('src'))) && /Schematische/.test(await page.$eval('#f-device-note', (e) => e.textContent))), p14 ? 'iPhone 14 Pro → its own product photo' : 'iPhone 14 Pro: no product photo → drawing, no picture of another model');
  const op = imgs.models['oneplus/oneplus-7-pro'];
  if (op) {
    await page.goto(BASE + '/reparatur-finden/#oneplus--oneplus-7-pro'); await page.waitForSelector('#finder.is-ready'); await page.waitForTimeout(150);
    ok(await page.$eval('#f-device-photo', (i, src) => !i.hidden && i.getAttribute('src') === src && i.naturalWidth > 0, op.image), 'OnePlus 7 Pro → its product photo is shown');
    await page.click('.frepair[data-service="akku"]'); await page.waitForTimeout(450);
    ok(await page.evaluate(() => document.getElementById('f-device-photo').hidden && getComputedStyle(document.querySelector('.part--akku')).stroke === 'rgb(200, 49, 42)'), 'Akkuwechsel → photo hidden, battery in red');
    await page.goBack(); await page.waitForTimeout(250);
    ok(await page.$eval('#f-device-photo', (i) => !i.hidden), 'back to the repair choice → product photo again');
  }
  // every registered photo: file exists, licence and proof recorded, clean white canvas
  const entries = Object.entries(imgs.models);
  ok(entries.every(([, v]) => v.license && fs.existsSync('src' + v.image)), `${entries.length} product photos: file present and licence recorded`);
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
  const nm = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await nm.route('**/vendor/three.module.min.js', (r) => r.abort());
  await nm.goto(BASE + '/'); await nm.mouse.wheel(0, 40);
  await nm.waitForFunction(() => document.documentElement.classList.contains('no-webgl'), null, { timeout: 8000 }).catch(() => {});
  const cut = await nm.evaluate(() => [...document.querySelectorAll('.scene--hero *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1; }).length);
  ok(cut === 0, `no WebGL on a phone: hero text and buttons fit the screen (${cut} cut off)`);
  await nm.close();
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
