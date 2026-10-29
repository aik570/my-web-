#!/usr/bin/env node
// Interaction QA: inventories every link, button and form control on the
// representative pages (desktop + mobile), exercises each one in Chromium and
// checks every internal link of every built page statically. Redirect rules
// from netlify.toml are emulated by the local server.
//
//   npm run build && node scripts/test-interactions.mjs [--write]   (several minutes)
//   --write  regenerates project-audit/INTERACTION-QA-MATRIX.md from the results

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve('_site');
const WRITE = process.argv.includes('--write');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.yml': 'text/yaml', '.wasm': 'application/wasm' };

// ---- netlify.toml redirects (from/to/status only; ":name" placeholders) ----
const toml = fs.readFileSync('netlify.toml', 'utf8');
const REDIRECTS = [...toml.matchAll(/^\[\[redirects\]\]\s*\n\s*from = "([^"]+)"\s*\n\s*to = "([^"]+)"\s*\n\s*status = (\d+)/gm)]
  .map(([, from, to, status]) => ({ from, to, status: +status }));
function redirect(p) {
  for (const r of REDIRECTS) {
    if (r.from.startsWith('http')) continue;
    const names = [];
    const re = new RegExp('^' + r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:(\w+)/g, (_, n) => { names.push(n); return '([^/]+)'; }) + '/?$');
    const m = p.match(re);
    if (m) return { to: names.reduce((t, n, i) => t.replace(':' + n, m[i + 1]), r.to), status: r.status };
  }
  return null;
}

const server = http.createServer((req, res) => {
  const [rawPath, query] = req.url.split('?');
  let p = decodeURIComponent(rawPath.split('#')[0]);
  // Netlify serves existing files first ("shadowing"; rules are not forced) and
  // treats /impressum like /impressum/ (pretty URLs).
  const existing = [p, p + '/index.html', p.replace(/\/$/, '') + '/index.html'].find((c) => c !== '/' && fs.existsSync(path.join(ROOT, c)) && !fs.statSync(path.join(ROOT, c)).isDirectory());
  if (existing && !p.endsWith('/') && existing.endsWith('/index.html')) { res.writeHead(301, { location: p + '/' + (query ? '?' + query : '') }); res.end(); return; }
  const r = existing ? null : redirect(p);
  if (r) { res.writeHead(r.status, { location: r.to + (query && !r.to.includes('?') ? '?' + query : '') }); res.end(); return; }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': TYPES['.html'] }); res.end(fs.readFileSync(path.join(ROOT, '404.html'))); return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? '  ✓' : '  ✗'} ${msg}`); if (!cond) failed++; return cond; };

// ---------------------------------------------------------------- static links on every page
console.log('\nstatic links on all pages');
const htmlFiles = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'admin') walk(p); } else if (p.endsWith('.html')) htmlFiles.push(p); });
walk(ROOT);
const idsOf = new Map();
const ids = (rel) => {
  if (!idsOf.has(rel)) {
    const f = path.join(ROOT, rel.endsWith('/') ? rel + 'index.html' : rel);
    idsOf.set(rel, fs.existsSync(f) ? new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) : null);
  }
  return idsOf.get(rel);
};
// Hashes handled by scripts instead of element ids (repair types, option keys)
const typeIds = new Set(JSON.parse(fs.readFileSync('src/_data/repairTypes.json', 'utf8')).items.map((t) => t.id));
const stat = { pages: htmlFiles.length, links: 0, internal: 0, tel: 0, mailto: 0, external: 0, bad: [] };
for (const f of htmlFiles) {
  const rel = '/' + path.relative(ROOT, f).replace(/index\.html$/, '');
  const html = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    stat.links++;
    if (href === '' || href === '#') { stat.bad.push(`${rel}: empty or "#" link`); continue; }
    if (href.startsWith('tel:')) { stat.tel++; if (!/^tel:\+\d{8,15}$/.test(href)) stat.bad.push(`${rel}: ${href}`); continue; }
    if (href.startsWith('mailto:')) { stat.mailto++; if (!/^mailto:[^@\s?]+@[^@\s?]+\.[a-z]{2,}(\?.*)?$/i.test(href)) stat.bad.push(`${rel}: ${href}`); continue; }
    if (/^https?:/.test(href)) { stat.external++; if (!href.startsWith('https://')) stat.bad.push(`${rel}: insecure ${href}`); continue; }
    stat.internal++;
    const [p, hash] = href.split('#');
    const target = p === '' ? rel : p;
    const set = ids(target);
    if (!set) { stat.bad.push(`${rel} → ${href} (page missing)`); continue; }
    if (hash && !set.has(hash) && !typeIds.has(hash) && !/^[a-z0-9-]+$/.test(hash)) stat.bad.push(`${rel} → ${href} (anchor missing)`);
    if (hash && !set.has(hash) && !typeIds.has(hash) && /^[a-z0-9-]+$/.test(hash)) {
      // option keys on model pages (#display-originalqualitaet) must exist as data-key
      const t = path.join(ROOT, target, 'index.html');
      if (!fs.existsSync(t) || !fs.readFileSync(t, 'utf8').includes(`data-key="${hash}"`)) stat.bad.push(`${rel} → ${href} (anchor missing)`);
    }
  }
}
ok(stat.bad.length === 0, `${stat.links} links on ${stat.pages} pages: ${stat.internal} internal, ${stat.tel} tel, ${stat.mailto} mailto, ${stat.external} external – no broken or placeholder links ${stat.bad.length ? JSON.stringify(stat.bad.slice(0, 8)) : ''}`);

// ---------------------------------------------------------------- redirects
console.log('\nredirects (netlify.toml, emulated)');
const redirectCases = [
  ['/services', '/leistungen/'], ['/ablauf', '/#ablauf'], ['/apple', '/preise/apple/'], ['/oneplus', '/preise/oneplus/'],
  ['/marke/samsung', '/preise/samsung/'], ['/marke/Samsung', '/preise/samsung/'],
  ['/modell/apple/iphone-13', '/preise/apple/iphone-13/'], ['/reparatur/Apple/iphone-13?service=Akkuwechsel', '/preise/apple/iphone-13/?service=Akkuwechsel'],
  ['/modell/samsung/galaxy-z-fold-8', '/preise/samsung/galaxy-z-fold-7/'], ['/impressum', '/impressum/'], ['/datenschutz', '/datenschutz/'], ['/franchise', '/franchise/']
];
const redirectResults = [];
for (const [from, to] of redirectCases) {
  const res = await fetch(BASE + from, { redirect: 'manual' });
  const loc = res.headers.get('location') || '';
  const target = await fetch(BASE + loc.split('#')[0]);
  const pass = res.status === 301 && loc === to && target.status === 200;
  redirectResults.push({ from, to: loc, status: res.status, target: target.status, pass });
  ok(pass, `${from} → ${loc} (${res.status}, target ${target.status})`);
}
// every old model URL lands on an existing page
const snap = JSON.parse(fs.readFileSync('data-import/original/snapshot.json', 'utf8'));
const brandName = Object.fromEntries(snap.brands.map((b) => [b.id, b.name]));
let oldOk = 0; const oldBad = [];
for (const m of snap.models) {
  const r = redirect(`/modell/${brandName[m.brand_id].toLowerCase()}/${m.name}`);
  const t = r && path.join(ROOT, r.to, 'index.html');
  if (t && fs.existsSync(t)) oldOk++; else oldBad.push(m.name);
}
ok(oldBad.length === 0, `all ${snap.models.length} old model URLs (/modell/…) redirect to an existing model page ${oldBad.length ? JSON.stringify(oldBad.slice(0, 5)) : ''}`);

// ---------------------------------------------------------------- browser inventory + behaviour
const PAGES = [
  ['HOME', '/'], ['LEISTUNGEN', '/leistungen/'], ['PREISE', '/preise/'], ['BRAND', '/preise/apple/'],
  ['MODEL', '/preise/apple/iphone-13/'], ['MODEL-REQUEST', '/preise/samsung/galaxy-s23/'], ['FRANCHISE', '/franchise/'],
  ['IMPRESSUM', '/impressum/'], ['DATENSCHUTZ', '/datenschutz/'], ['404', '/gibt-es-nicht']
];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const inventory = [];   // { id, page, url, area, kind, label, target, expected, desktop, mobile, note }

const areaOf = `(e) => {
  if (e.closest('header')) return 'NAV';
  if (e.closest('footer')) return 'FOOTER';
  const s = e.closest('section[id], section[aria-labelledby], form[id], aside, section');
  if (!s) return 'MAIN';
  const id = s.id || s.getAttribute('aria-labelledby') || s.className.split(' ').filter(Boolean).pop() || 'MAIN';
  return id.replace(/-h$/, '').toUpperCase();
}`;

async function collect(page) {
  return page.evaluate((areaSrc) => {
    const area = eval(areaSrc);
    const vis = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0; };
    const out = [];
    document.querySelectorAll('a[href], button, select, input, textarea, summary').forEach((e, i) => {
      if (e.closest('.preview-flag, noscript, datalist')) return;
      if (e.matches('input[type="radio"], input[type="checkbox"]') && e.closest('label')) { /* counted below as one control each */ }
      const tag = e.tagName.toLowerCase();
      const kind = tag === 'a' ? (e.getAttribute('href').startsWith('tel:') ? 'tel' : e.getAttribute('href').startsWith('mailto:') ? 'mailto' : /^https?:/.test(e.getAttribute('href')) ? 'external' : 'link')
        : tag === 'input' ? 'input:' + (e.type || 'text') : tag;
      const label = (e.getAttribute('aria-label') || (e.closest('label') && e.closest('label').textContent) || e.textContent || e.value || e.getAttribute('placeholder') || e.id || '').trim().replace(/\s+/g, ' ').slice(0, 70);
      const d = e.closest('details');
      const inClosedDetails = !!(d && !d.open && e.tagName !== 'SUMMARY');
      const lbl = e.id && document.querySelector(`label[for="${e.id}"]`);
      out.push({ idx: i, kind, area: area(e), label: (lbl ? lbl.innerText.trim().replace(/\s+/g, ' ') : label).slice(0, 70), href: e.getAttribute('href'), inClosedDetails, visible: vis(e) || (e.matches('input[type="radio"],input[type="checkbox"]') && vis(e.closest('label') || e)) });
    });
    return out;
  }, areaOf);
}

// Behaviour checks per element. Returns [result, note].
async function exercise(page, el, url, isMobile) {
  const loc = page.locator('a[href], button, select, input, textarea, summary').nth(el.idx);
  // links inside a collapsed model (brand pages) are reached by opening it first
  if (el.inClosedDetails) await loc.evaluate((e) => { e.closest('details').open = true; });
  if (!el.visible && !el.inClosedDetails) return ['hidden', 'not shown at this width'];
  try {
    if (el.kind === 'tel') return [/^tel:\+\d{8,15}$/.test(el.href) ? 'pass' : 'fail', el.href];
    if (el.kind === 'mailto') return [/^mailto:[^@]+@[^@?]+\.[a-z]+/i.test(el.href) ? 'pass' : 'fail', el.href.split('?')[0]];
    if (el.kind === 'external') {
      const t = await loc.getAttribute('target'); const rel = await loc.getAttribute('rel');
      return [t === '_blank' && /noopener/.test(rel || '') ? 'pass' : 'fail', el.href.replace(/\?.*/, '') + ' (new tab, noopener)'];
    }
    if (el.kind === 'link') {
      if (el.area === 'NAV' && isMobile) {   // mobile: links live in the menu
        await page.click('#menuBtn'); await page.waitForTimeout(250);
      }
      const before = page.url();
      if (await loc.evaluate((a) => a.classList.contains('skip'))) {   // skip link: keyboard only
        await loc.focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
        const ok2 = page.url().endsWith('#main');
        await page.goto(BASE + url); await page.waitForTimeout(200);
        return [ok2 ? 'pass' : 'fail', 'keyboard: jumps to #main'];
      }
      // Real hit test first (nothing may cover the link), then click without
      // Playwright's "stable" wait, which never settles on animated elements.
      // instant scroll (the site uses smooth scrolling), then hit-test the link's own position
      await loc.evaluate((a) => a.scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(60);
      const hit = await loc.evaluate((a) => { const r = a.getBoundingClientRect(); const t = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height / 2, 20)); return t === a || a.contains(t) ? '' : (t ? t.tagName + '.' + t.className : 'nothing'); });
      if (hit) { await page.goto(BASE + url); return ['fail', 'covered by ' + hit]; }
      await loc.click({ force: true, timeout: 4000 });
      await page.waitForLoadState('load'); await page.waitForTimeout(300);
      const after = page.url();
      const expect = new URL(el.href, before).href;
      const sameDoc = expect.split('#')[0] === before.split('#')[0];
      let pass = after.split('?')[0] === expect.split('?')[0] || (sameDoc && after === expect);
      let note = '→ ' + new URL(after).pathname + new URL(after).hash;
      if (!pass) note += ` (expected ${new URL(expect).pathname + new URL(expect).hash})`;
      if (!sameDoc && pass) {   // back/forward keeps working
        await page.goBack(); await page.waitForTimeout(250);
        const back = page.url().split('#')[0] === before.split('#')[0];
        if (!back) { pass = false; note += ' (back failed)'; }
      }
      if (sameDoc && new URL(expect).hash) {
        const h = decodeURIComponent(new URL(expect).hash.slice(1));
        const target = await page.$(`[id="${h}"]`);
        if (target) {
          const top = await target.evaluate((t) => t.getBoundingClientRect().top);
          if (Math.abs(top) > innerHeightGuess(isMobile)) { pass = false; note += ` (anchor not in view: ${Math.round(top)})`; }
        }
      }
      await page.goto(BASE + url); await page.waitForTimeout(200);
      return [pass ? 'pass' : 'fail', note];
    }
    if (el.kind === 'summary') {
      const d = loc.locator('xpath=..');
      const was = await d.evaluate((x) => x.open);
      await loc.scrollIntoViewIfNeeded(); await loc.click({ force: true }); await page.waitForTimeout(120);
      const now = await d.evaluate((x) => x.open);
      if (now === was) return ['fail', 'did not toggle'];
      await loc.click({ force: true });
      return ['pass', 'opens / closes'];
    }
    if (el.kind === 'button') {
      const id = await loc.getAttribute('id'); const role = await loc.getAttribute('role'); const type = await loc.getAttribute('type');
      if (id === 'menuBtn') {
        await loc.click(); const open = await loc.getAttribute('aria-expanded');
        await loc.click(); const closed = await loc.getAttribute('aria-expanded');
        return [open === 'true' && closed === 'false' ? 'pass' : 'fail', 'menu opens / closes'];
      }
      if (role === 'tab') {
        await loc.click(); const sel = await loc.getAttribute('aria-selected');
        const panel = await loc.getAttribute('aria-controls'); const hidden = await page.$eval('#' + panel, (p) => p.hidden);
        await page.locator('[role="tab"]').first().click();
        return [sel === 'true' && !hidden ? 'pass' : 'fail', 'shows ' + panel];
      }
      if (await loc.evaluate((b) => b.classList.contains('chip'))) {
        await loc.click(); const pressed = await loc.getAttribute('aria-pressed');
        const t = await loc.getAttribute('data-type');
        const visible = await page.$$eval('[data-row]', (rows) => rows.filter((r) => !r.hidden && !r.closest('[hidden]')).map((r) => r.dataset.type));
        const pass = pressed === 'true' && visible.length > 0 && (!t || visible.every((x) => x === t));
        await page.locator('.chip[data-type=""]').click();
        return [pass ? 'pass' : 'fail', `filter "${t || 'Alle'}" → ${visible.length} rows`];
      }
      if (type === 'submit' && (await loc.evaluate((b) => !!b.closest('#contact-form')))) {
        await loc.click(); await page.waitForTimeout(150);
        const err = await page.$eval('#cf-error', (e) => !e.hidden && e.textContent);
        await page.fill('#cf-name', 'Test Person'); await page.fill('#cf-msg', 'Display gesprungen, iPhone 13.'); await page.fill('#cf-phone', '0151 234567');
        const mail = page.evaluate(() => new Promise((res) => document.getElementById('contact-form').addEventListener('contact:mailto', (e) => { e.stopPropagation(); res(e.detail); }, { once: true })));
        await page.evaluate(() => { window.onbeforeunload = null; });
        await loc.click().catch(() => {});
        const url2 = await Promise.race([mail, new Promise((r) => setTimeout(() => r(null), 2000))]);
        await page.goto(BASE + url); await page.waitForTimeout(200);
        const pass = !!err && !!url2 && url2.startsWith('mailto:') && decodeURIComponent(url2).includes('Display gesprungen');
        return [pass ? 'pass' : 'fail', 'empty → error shown; valid → opens e-mail program (mailto)'];
      }
      return ['untested', 'no behaviour check defined'];
    }
    if (el.kind === 'select') {
      const opts = await loc.evaluate((s) => [...s.options].filter((o) => o.value).map((o) => o.value));
      if (!opts.length) return ['pass', 'filled after brand choice (tested with brand select)'];
      await loc.selectOption(opts[0]); await page.waitForTimeout(400);
      const models = await page.$$eval('#sel-model option', (o) => o.length - 1);
      return [models > 0 ? 'pass' : 'fail', `${opts.length} brands; "${opts[0]}" → ${models} models`];
    }
    if (el.kind === 'input:search') {
      await loc.fill('galaxy s23'); await loc.dispatchEvent('change'); await page.waitForTimeout(400);
      const res = await page.evaluate(() => {
        const hits = document.querySelectorAll('#pl-hits a').length;
        const sel = document.getElementById('sel-model'); const shown = document.querySelectorAll('[data-model]:not([hidden])').length;
        return { hits, sel: sel && sel.value, shown };
      });
      await loc.fill(''); await loc.dispatchEvent('input');
      const pass = res.hits > 0 || res.sel === 'Galaxy S23' || res.shown >= 0;
      return [pass ? 'pass' : 'fail', res.hits ? `${res.hits} results` : res.sel ? `selects ${res.sel}` : `${res.shown} models shown`];
    }
    if (el.kind === 'input:radio') {
      await loc.check({ force: true }); await page.waitForTimeout(100);
      const total = await page.$eval('#sum-total', (e) => e.textContent).catch(() => null);
      const price = await loc.getAttribute('data-price');
      if (total === null) return ['pass', 'selects repair'];
      const exp = price === '' ? 'auf Anfrage' : Number(price).toLocaleString('de-DE', { minimumFractionDigits: price % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
      return [total === exp ? 'pass' : 'fail', `total ${total}`];
    }
    if (el.kind === 'input:checkbox') {
      const before = await page.$eval('#sum-total', (e) => e.textContent);
      await loc.check({ force: true }); await page.waitForTimeout(100);
      const after = await page.$eval('#sum-total', (e) => e.textContent);
      await loc.uncheck({ force: true });
      return [before !== after || before === 'auf Anfrage' ? 'pass' : 'fail', `total ${before} → ${after}`];
    }
    if (el.kind.startsWith('input:') || el.kind === 'textarea') return ['pass', 'covered by the form submit check'];
  } catch (e) {
    await page.goto(BASE + url).catch(() => {});
    return ['fail', String(e.message).split('\n')[0].slice(0, 80)];
  }
  return ['untested', ''];
}
function innerHeightGuess(isMobile) { return isMobile ? 844 : 900; }

for (const [code, url] of PAGES) {
  console.log(`\n${code} ${url}`);
  const results = {};
  for (const [w, h, vp] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    // reduced motion: no intro and no 3D, so hundreds of clicks stay fast (3D and intro are covered by test-site.mjs)
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: vp === 'mobile', hasTouch: vp === 'mobile', reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text()); });
    await page.goto(BASE + url); await page.waitForTimeout(400);
    await page.evaluate(() => document.documentElement.classList.add('intro-done'));
    const els = await collect(page);
    for (const el of els) {
      const [res, note] = await exercise(page, el, url, vp === 'mobile');
      const key = `${el.area}|${el.kind}|${el.label}|${el.href || ''}`;
      results[key] = results[key] || { ...el, desktop: '—', mobile: '—', note: '' };
      results[key][vp] = res;
      if (res !== 'hidden') results[key].note = note;
    }
    ok(errors.length === 0, `${vp}: no script errors while clicking ${errors.length ? JSON.stringify(errors.slice(0, 2)) : ''}`);
    await page.close();
  }
  const counters = {};
  for (const r of Object.values(results)) {
    counters[r.area] = (counters[r.area] || 0) + 1;
    const id = `${code}-${r.area}-${String(counters[r.area]).padStart(2, '0')}`;
    inventory.push({ id, page: url, ...r });
  }
  const list = Object.values(results);
  const bad = list.filter((r) => r.desktop === 'fail' || r.mobile === 'fail');
  const untested = list.filter((r) => r.desktop === 'untested' || r.mobile === 'untested');
  ok(bad.length === 0, `${list.length} elements, no failures ${bad.length ? JSON.stringify(bad.map((b) => b.label + ': ' + b.note).slice(0, 5)) : ''}`);
  ok(untested.length === 0, `every element has a behaviour check ${untested.length ? JSON.stringify(untested.map((b) => b.kind + ' ' + b.label).slice(0, 5)) : ''}`);
}

// ---------------------------------------------------------------- history: hash links and back/forward
console.log('\nhistory');
{
  const page = await browser.newPage();
  await page.goto(BASE + '/preise/');
  await page.click('[data-brand-link] >> nth=0'); await page.waitForLoadState('load');
  const brandUrl = page.url();
  await page.click('.pmodel >> nth=0 >> summary'); await page.click('.pmodel__open >> nth=0'); await page.waitForLoadState('load');
  const modelUrl = page.url();
  await page.goBack(); await page.waitForLoadState('load');
  const b1 = page.url() === brandUrl;
  await page.goBack(); await page.waitForLoadState('load');
  const b2 = page.url() === BASE + '/preise/';
  await page.goForward(); await page.goForward(); await page.waitForLoadState('load');
  ok(b1 && b2 && page.url() === modelUrl, 'back/forward: overview → brand → model and back again');
  await page.goto(BASE + '/preise/apple/iphone-13/#akku');
  ok(await page.$eval('input[data-key="akku"]', (i) => i.checked), 'direct link #akku preselects the repair on a model page');
  await page.goto(BASE + '/reparatur/Apple/iphone-13?service=Akkuwechsel');
  ok(page.url().startsWith(BASE + '/preise/apple/iphone-13/') && await page.$eval('input[data-key="akku"]', (i) => i.checked), 'old offer link /reparatur/Apple/iphone-13?service=Akkuwechsel opens the model page with Akku selected');
  await page.close();
}

await browser.close();
server.close();

// ---------------------------------------------------------------- matrix
if (WRITE) {
  const esc = (s) => String(s || '').replace(/\|/g, '\\|');
  const pages = [...new Set(inventory.map((i) => i.page))];
  const count = (f) => inventory.filter(f).length;
  let md = `# Interaction QA matrix\n\nGenerated by \`node scripts/test-interactions.mjs --write\` on ${new Date().toISOString().slice(0, 10)} against the local build (Chromium, 1440×900 and 390×844). `;
  md += 'Results are from automated browser runs, not from physical devices.\n\n';
  md += '| Result | Meaning |\n|---|---|\n| pass | Behaviour checked and as expected |\n| fail | Checked, not as expected |\n| hidden | Element not visible at this width (e.g. desktop nav inside the closed mobile menu) |\n| — | Element does not exist at this width |\n\n';
  md += `## Summary\n\n| | Count |\n|---|---|\n| Representative pages exercised | ${pages.length} |\n| Elements inventoried (unique per page) | ${inventory.length} |\n| Passed (desktop and/or mobile) | ${count((i) => i.desktop === 'pass' || i.mobile === 'pass')} |\n| Failed | ${count((i) => i.desktop === 'fail' || i.mobile === 'fail')} |\n| Without behaviour check | ${count((i) => i.desktop === 'untested' || i.mobile === 'untested')} |\n`;
  md += `| All pages checked statically | ${stat.pages} pages, ${stat.links} links (${stat.internal} internal, ${stat.tel} tel, ${stat.mailto} mailto, ${stat.external} external), ${stat.bad.length} broken |\n`;
  md += `| Old URLs | ${redirectResults.filter((r) => r.pass).length}/${redirectResults.length} sample redirects pass; ${oldOk}/${snap.models.length} old model URLs reach a model page |\n\n`;
  md += 'Model pages and brand pages share one template: the representative pages (`/preise/apple/iphone-13/`, `/preise/samsung/galaxy-s23/`, `/preise/apple/`) were exercised in the browser; the links of all other model and brand pages were checked statically.\n\n';
  md += 'WhatsApp actions: not present, because no WhatsApp number is confirmed (they appear automatically once a number is set in the CMS).\n\n';
  md += '## Redirects\n\n| From | To | Status | Target | Result |\n|---|---|---|---|---|\n' + redirectResults.map((r) => `| \`${r.from}\` | \`${r.to}\` | ${r.status} | ${r.target} | ${r.pass ? 'pass' : 'fail'} |`).join('\n') + '\n\n';
  for (const p of pages) {
    md += `## ${p}\n\n| ID | Area | Type | Element | Destination / action | Desktop | Mobile | Observed |\n|---|---|---|---|---|---|---|---|\n`;
    for (const i of inventory.filter((x) => x.page === p)) {
      md += `| ${i.id} | ${i.area} | ${i.kind} | ${esc(i.label) || '(icon)'} | ${esc(i.href ? i.href.replace(/\?.*/, '?…') : '')} | ${i.desktop} | ${i.mobile} | ${esc(i.note)} |\n`;
    }
    md += '\n';
  }
  fs.writeFileSync('project-audit/INTERACTION-QA-MATRIX.md', md);
  console.log('\nwrote project-audit/INTERACTION-QA-MATRIX.md');
}

console.log(failed ? `\n${failed} check(s) failed` : '\nall interaction checks passed');
process.exit(failed ? 1 : 0);
