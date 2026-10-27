// QA for the BLF Stage 04 Home prototype.
// Usage (from blf-service/): node scripts/qa/home-prototype-qa.js <outdir>
// Needs Playwright with Chromium (pre-installed in the build environment; not a project dependency).
// Results: <outdir>/qa-results.json plus screenshots.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Serve blf-service/ first, e.g.: python3 -m http.server 8765 --bind 127.0.0.1
const BASE = process.env.BLF_BASE || 'http://127.0.0.1:8765/src/index.html';
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const results = {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: opts.viewport || { width: 1440, height: 900 },
    deviceScaleFactor: opts.dpr || 1,
    isMobile: !!opts.mobile,
    hasTouch: !!opts.mobile,
    reducedMotion: opts.reducedMotion || 'no-preference',
    javaScriptEnabled: opts.js !== false,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('requestfailed', (r) => errors.push('requestfailed ' + r.url().split('/').pop()));
  if (opts.route) await opts.route(page);
  return { ctx, page, errors };
}

async function loadAllImages(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    Array.from(document.images).forEach((i) => { i.loading = 'eager'; });
    const all = Promise.all(Array.from(document.images).map((i) => i.complete ? 0 : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); })));
    await Promise.race([all, new Promise((r) => setTimeout(r, 8000))]);
  });
}

// Upscaling check: device pixels per source pixel, for the chosen file and for the original.
const ORIGINAL_W = { 'GAL-02': 844, logo: 1966 };
async function upscaleReport(page, dpr) {
  return page.evaluate(async ({ dpr, ORIGINAL_W }) => {
    const out = [];
    const trueSize = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res([i.naturalWidth, i.naturalHeight]); i.onerror = () => res([0, 0]); i.src = src; });
    for (const img of document.images) {
      if (!img.currentSrc || img.closest('[hidden]')) continue;
      const r = img.getBoundingClientRect();
      if (r.width === 0) continue;
      const cs = getComputedStyle(img);
      const [nW, nH] = await trueSize(img.currentSrc);   // real pixels of the chosen file
      const file = img.currentSrc.split('/').pop();
      const id = (file.match(/GAL-\d\d|logo/) || ['?'])[0];
      const oW = ORIGINAL_W[id] || 1125, oH = id === 'logo' ? 1966 : 1500;
      const fit = cs.objectFit === 'cover';
      // device pixels per source pixel (>1 means the browser enlarges the image)
      const fileScale = (fit ? Math.max(r.width / nW, r.height / nH) : r.width / nW) * dpr;
      const origScale = (fit ? Math.max(r.width / oW, r.height / oH) : r.width / oW) * dpr;
      out.push({ file, cssW: Math.round(r.width), cssH: Math.round(r.height), filePx: nW + 'x' + nH, fileUpscale: +fileScale.toFixed(3), originalUpscale: +origScale.toFixed(3) });
    }
    return out;
  }, { dpr, ORIGINAL_W });
}

function luminance(rgb) {
  const c = rgb.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
async function contrastReport(page) {
  const items = await page.evaluate(() => {
    const parse = (s) => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 }; };
    const res = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (!el || el.closest('[hidden], .visually-hidden, script, style, .skip-link')) continue;
      const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) continue;
      let bg = null, e = el;
      while (e) { const b = parse(getComputedStyle(e).backgroundColor); if (b && b.a > 0.5) { bg = b.rgb; break; } e = e.parentElement; }
      res.push({ text: n.textContent.trim().slice(0, 40), fg: parse(cs.color).rgb, bg: bg || [244, 241, 233], size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) });
    }
    return res;
  });
  return items.map((i) => {
    const l1 = luminance(i.fg), l2 = luminance(i.bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const large = i.size >= 24 || (i.size >= 18.66 && i.weight >= 700);
    return { ...i, ratio: +ratio.toFixed(2), need: large ? 3 : 4.5 };
  });
}

(async () => {
  const browser = await chromium.launch();

  // 1. Static layouts (intro off), several widths and DPRs.
  const layouts = [
    { name: 'desktop-1440', viewport: { width: 1440, height: 900 }, dpr: 2 },
    { name: 'desktop-1024', viewport: { width: 1024, height: 768 }, dpr: 1 },
    { name: 'desktop-1440-dpr3', viewport: { width: 1440, height: 900 }, dpr: 3 },
    { name: 'tablet-768', viewport: { width: 768, height: 1024 }, dpr: 2, mobile: true },
    { name: 'mobile-390', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
    { name: 'mobile-430', viewport: { width: 430, height: 932 }, dpr: 3, mobile: true },
    { name: 'mobile-320', viewport: { width: 320, height: 640 }, dpr: 2, mobile: true },
    { name: 'mobile-412-dpr2.625', viewport: { width: 412, height: 915 }, dpr: 2.625, mobile: true },
    { name: 'desktop-1440-dpr1', viewport: { width: 1440, height: 900 }, dpr: 1 },
  ];
  results.layouts = {};
  for (const L of layouts) {
    const { ctx, page, errors } = await newPage(browser, L);
    await page.goto(BASE + '?intro=0', { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const logoTop = await page.evaluate(() => Math.round(document.querySelector('.site-logo img').getBoundingClientRect().height));
    await loadAllImages(page);
    await page.waitForTimeout(500);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const ups = await upscaleReport(page, L.dpr);
    const logo = await page.evaluate(() => { const r = document.querySelector('.site-logo img').getBoundingClientRect(); return Math.round(r.height); });
    const hero = await page.evaluate(() => { const i = document.querySelector('.hero__media img'); const r = i.getBoundingClientRect(); return { cssW: Math.round(r.width), cssH: Math.round(r.height), file: i.currentSrc.split('/').pop(), natural: i.naturalWidth + 'x' + i.naturalHeight }; });
    results.layouts[L.name] = { horizontalOverflowPx: overflow, headerLogoPx: logoTop, lettering_px: +(logoTop * 0.102).toFixed(1), headerLogoAfterScrollBack: logo, hero, worstFileUpscale: Math.max(...ups.map((u) => u.fileUpscale)), worstOriginalUpscale: Math.max(...ups.map((u) => u.originalUpscale)), over1: ups.filter((u) => u.originalUpscale > 1.0 || u.fileUpscale > 1.0), errors };
    await page.screenshot({ path: path.join(OUT, `layout-${L.name}.png`), fullPage: true });
    if (L.name === 'desktop-1440') {
      await page.screenshot({ path: path.join(OUT, 'view-desktop-hero.png') });
      results.contrast = await contrastReport(page);
    }
    if (L.name === 'mobile-390') {
      await page.screenshot({ path: path.join(OUT, 'view-mobile-hero.png') });
      results.contrastMobile = await contrastReport(page);
      // open the menu
      await page.click('[data-menu-open]');
      await sleep(100);
      results.menuFocus = await page.evaluate(() => document.activeElement && document.activeElement.textContent.trim());
      await page.screenshot({ path: path.join(OUT, 'view-mobile-menu.png') });
      await page.keyboard.press('Escape');
      results.menuClosedFocus = await page.evaluate(() => document.activeElement && document.activeElement.className);
    }
    await ctx.close();
  }

  // 2. Keyboard path (desktop).
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '?intro=0', { waitUntil: 'load' });
    const path_ = [];
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      path_.push(await page.evaluate(() => {
        const a = document.activeElement; const cs = getComputedStyle(a);
        return { tag: a.tagName, text: (a.getAttribute('aria-label') || a.textContent || a.getAttribute('alt') || '').trim().replace(/\s+/g, ' ').slice(0, 40), outline: cs.outlineStyle + ' ' + cs.outlineWidth };
      }));
    }
    results.keyboard = path_;
    await page.keyboard.press('Shift+Tab');
    await ctx.close();
  }

  // 3. Intro, full (desktop) and lite (mobile): frames + end state.
  for (const v of [{ name: 'intro-desktop', viewport: { width: 1440, height: 900 }, dpr: 1, times: [150, 600, 1000, 1400, 1800, 2200, 2550, 3200] },
                   { name: 'intro-mobile', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true, times: [150, 500, 900, 1250, 1500, 2100] }]) {
    const { ctx, page, errors } = await newPage(browser, v);
    const t0 = Date.now();
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    const frames = [];
    for (const t of v.times) {
      const wait = t - (Date.now() - t0); if (wait > 0) await sleep(wait);
      const state = await page.evaluate(() => ({ cls: document.documentElement.className, overlay: !!document.querySelector('.intro') }));
      await page.screenshot({ path: path.join(OUT, `${v.name}-${String(t).padStart(4, '0')}ms.png`) });
      frames.push({ t, ...state });
    }
    await sleep(1500);
    const end = await page.evaluate(() => ({ cls: document.documentElement.className, overlay: !!document.querySelector('.intro'), heroOpacity: getComputedStyle(document.querySelector('.hero__text')).opacity, logoOpacity: getComputedStyle(document.querySelector('.site-logo img')).opacity, session: sessionStorage.getItem('blf-intro') }));
    // reload in the same session: the intro must not replay
    await page.goto(BASE, { waitUntil: 'load' });
    await sleep(300);
    const replay = await page.evaluate(() => ({ cls: document.documentElement.className, overlay: !!document.querySelector('.intro') }));
    results[v.name] = { frames, end, replayAfterReload: replay, errors };
    await ctx.close();
  }

  // 4. Skip by key during the intro.
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    await sleep(700);
    const before = await page.evaluate(() => !!document.querySelector('.intro'));
    await page.keyboard.press('Escape');
    await sleep(400);
    results.skipByKey = { overlayBefore: before, overlayAfter: await page.evaluate(() => !!document.querySelector('.intro')), cls: await page.evaluate(() => document.documentElement.className) };
    await ctx.close();
  }

  // 5. Reduced motion: no intro, teaser visible.
  {
    const { ctx, page, errors } = await newPage(browser, { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(BASE, { waitUntil: 'load' });
    await sleep(500);
    results.reducedMotion = await page.evaluate(() => ({ cls: document.documentElement.className, overlay: !!document.querySelector('.intro'), teaserOpacity: getComputedStyle(document.querySelector('.teaser__item')).opacity }));
    results.reducedMotion.errors = errors;
    await page.screenshot({ path: path.join(OUT, 'view-reduced-motion.png') });
    await ctx.close();
  }

  // 6. JavaScript disabled.
  {
    const { ctx, page, errors } = await newPage(browser, { viewport: { width: 1440, height: 900 }, js: false });
    await page.goto(BASE + '?review', { waitUntil: 'load' });
    results.noJs = await page.evaluate(() => ({ cls: document.documentElement.className, reviewNotesVisible: Array.from(document.querySelectorAll('[data-review]')).filter((e) => e.offsetParent !== null).length, heroOpacity: getComputedStyle(document.querySelector('.hero__text')).opacity, teaserOpacity: getComputedStyle(document.querySelector('.teaser__item')).opacity }));
    results.noJs.errors = errors;
    await page.screenshot({ path: path.join(OUT, 'view-no-js.png') });
    await ctx.close();
  }

  // 7. Logo asset fails: intro must give up, content visible.
  {
    const { ctx, page, errors } = await newPage(browser, { viewport: { width: 1440, height: 900 }, route: (p) => p.route('**/logo-1200.webp', (r) => r.abort()) });
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    await sleep(600);
    results.logoFails = await page.evaluate(() => ({ cls: document.documentElement.className, overlay: !!document.querySelector('.intro'), heroOpacity: getComputedStyle(document.querySelector('.hero__text')).opacity }));
    results.logoFails.errors = errors;
    await ctx.close();
  }

  // 8. intro.js blocked: CSS fail-safe must remove the cover.
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 }, route: (p) => p.route('**/intro.js', (r) => r.abort()) });
    const t0 = Date.now();
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    const coverAt = async () => page.evaluate(() => { const s = getComputedStyle(document.body, '::before'); return { visibility: s.visibility, opacity: s.opacity }; });
    await sleep(1000); const early = await coverAt();
    await sleep(2200); const late = await coverAt();
    const pe = await page.evaluate(() => getComputedStyle(document.body, '::before').pointerEvents);
    const hit = await page.evaluate(() => { const r = document.querySelector('.hero .button--primary').getBoundingClientRect(); const e = document.elementFromPoint(r.left + 5, r.top + 5); return e && e.className; });
    results.introJsBlocked = { at1s: early, at3_2s: late, pointerEvents: pe, elementAtHeroButton: hit, heroOpacity: await page.evaluate(() => getComputedStyle(document.querySelector('.hero__text')).opacity), ms: Date.now() - t0 };
    await ctx.close();
  }

  // 9. Review mode shows notes only with ?review (JS on) and never otherwise.
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '?intro=0', { waitUntil: 'load' });
    const plain = await page.evaluate(() => Array.from(document.querySelectorAll('[data-review]')).filter((e) => e.offsetParent !== null).length);
    await page.goto(BASE + '?intro=0&review', { waitUntil: 'load' });
    const review = await page.evaluate(() => Array.from(document.querySelectorAll('[data-review]')).filter((e) => e.offsetParent !== null).length);
    await page.screenshot({ path: path.join(OUT, 'view-review-mode.png'), fullPage: true });
    // visible text must not contain unconfirmed claims or owner names (review notes excluded)
    await page.goto(BASE + '?intro=0', { waitUntil: 'load' });
    const text = await page.evaluate(() => document.body.innerText);
    const forbidden = ['2001', 'Treeworker', 'zertifiziert', 'rund um die Uhr', '24/7', 'Experten', 'sichere und effiziente', 'Trautmann', 'Witte', 'etabliert', 'modernste', 'jahrelang', 'tagtäglich', 'Preis', '€'];
    results.reviewMode = { notesVisibleWithoutParam: plain, notesVisibleWithParam: review, forbiddenFound: forbidden.filter((f) => text.includes(f)) };
    await ctx.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'qa-results.json'), JSON.stringify(results, null, 1));
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
