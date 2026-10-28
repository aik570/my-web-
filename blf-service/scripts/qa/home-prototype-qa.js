// QA for the BLF Home page (src/): D2 opening stage + paper sections.
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
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      let op = 1; for (let e = img; e; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
      if (op < 0.01) continue;                       // not shown
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
      if (cs.visibility === 'hidden') continue;
      let op = 1; for (let x = el; x; x = x.parentElement) op *= parseFloat(getComputedStyle(x).opacity);
      if (op < 0.01) continue;
      let bg = null, e = el;
      while (e && e !== document.body) { const b = parse(getComputedStyle(e).backgroundColor); if (b && b.a > 0.5) { bg = b.rgb; break; } e = e.parentElement; }
      if (!bg && r.top < innerHeight && r.bottom > 0) {
        // e.g. the transparent fixed header over the dark stage: use what is painted underneath
        for (const u of document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)) {
          if (u === el || u.contains(el) || el.contains(u)) continue;
          const b = parse(getComputedStyle(u).backgroundColor); if (b && b.a > 0.5) { bg = b.rgb; break; }
        }
      }
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
    const hero = await page.evaluate(() => {
      const h = document.querySelector('#stage-title').getBoundingClientRect(), c = document.querySelector('#stage-back').getBoundingClientRect();
      return { title: document.querySelector('#stage-title').textContent.trim(), titleRight: Math.round(h.right), treeBox: [Math.round(c.left), Math.round(c.top), Math.round(c.right), Math.round(c.bottom)],
               treeInView: c.left >= 0 && c.top >= 0 && c.right <= innerWidth && c.bottom <= innerHeight, mode: ['stage-on', 'stage-static'].filter((k) => document.documentElement.classList.contains(k)).join() };
    });
    // the stage scenes that show photos: services window and real-work frame
    for (const f of [0.38, 0.7]) {
      await page.evaluate((f) => { const s = document.getElementById('stage'); scrollTo({ top: s.offsetTop + f * (s.offsetHeight - innerHeight), behavior: 'instant' }); }, f);
      await page.waitForTimeout(500);
      (await upscaleReport(page, L.dpr)).forEach((u) => ups.push({ ...u, stage: f }));
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(300);
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

  // 3. Opening intro (desktop and mobile): frames + end state, no replay in the same session.
  for (const v of [{ name: 'intro-desktop', viewport: { width: 1440, height: 900 }, dpr: 1, times: [150, 700, 1200, 1700, 2300, 3200] },
                   { name: 'intro-mobile', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true, times: [150, 700, 1700, 3200] }]) {
    const { ctx, page, errors } = await newPage(browser, v);
    const t0 = Date.now();
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    const frames = [];
    for (const t of v.times) {
      const wait = t - (Date.now() - t0); if (wait > 0) await sleep(wait);
      const state = await page.evaluate(() => ({ cls: document.documentElement.className, skipVisible: !document.getElementById('stage-skip').hidden, copy: getComputedStyle(document.getElementById('stage-hero')).getPropertyValue('--copy') || '(unset)' }));
      await page.screenshot({ path: path.join(OUT, `${v.name}-${String(t).padStart(4, '0')}ms.png`) });
      frames.push({ t, ...state });
    }
    await sleep(800);
    const end = await page.evaluate(() => ({ cls: document.documentElement.className, skipVisible: !document.getElementById('stage-skip').hidden, copy: getComputedStyle(document.getElementById('stage-hero')).getPropertyValue('--copy'), session: sessionStorage.getItem('blf-intro') }));
    await page.goto(BASE, { waitUntil: 'load' });
    await sleep(300);
    const replay = await page.evaluate(() => ({ cls: document.documentElement.className, skipVisible: !document.getElementById('stage-skip').hidden, copy: getComputedStyle(document.getElementById('stage-hero')).getPropertyValue('--copy') }));
    results[v.name] = { frames, end, replayAfterReload: replay, errors };
    await ctx.close();
  }

  // 4. Skip during the intro: by key and by the skip button.
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    await sleep(700);
    const before = await page.evaluate(() => !document.getElementById('stage-skip').hidden);
    await page.keyboard.press('Escape');
    await sleep(300);
    const afterKey = await page.evaluate(() => ({ skipVisible: !document.getElementById('stage-skip').hidden, copy: getComputedStyle(document.getElementById('stage-hero')).getPropertyValue('--copy') }));
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    await sleep(700);
    await page.click('#stage-skip');
    await sleep(300);
    const afterButton = await page.evaluate(() => ({ skipVisible: !document.getElementById('stage-skip').hidden, copy: getComputedStyle(document.getElementById('stage-hero')).getPropertyValue('--copy') }));
    results.skip = { skipVisibleBefore: before, afterKey, afterButton };
    await ctx.close();
  }

  // 5. Reduced motion: static stacked page, no intro, everything visible.
  for (const v of [{ name: 'reducedMotion', viewport: { width: 1440, height: 900 } }, { name: 'reducedMotionMobile', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true }]) {
    const { ctx, page, errors } = await newPage(browser, { ...v, reducedMotion: 'reduce' });
    await page.goto(BASE, { waitUntil: 'load' });
    await sleep(600);
    results[v.name] = await page.evaluate(() => ({ cls: document.documentElement.className, skipVisible: !document.getElementById('stage-skip').hidden,
      panelOpacity: getComputedStyle(document.getElementById('leistungsbereiche')).opacity, workOpacity: getComputedStyle(document.getElementById('stage-work')).opacity,
      teaserOpacity: getComputedStyle(document.querySelector('.teaser__item')).opacity, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    results[v.name].errors = errors;
    await page.screenshot({ path: path.join(OUT, `view-${v.name}.png`), fullPage: true });
    await ctx.close();
  }

  // 6. JavaScript disabled (synchronous evaluation only: timers do not run in this page).
  {
    const { ctx, page, errors } = await newPage(browser, { viewport: { width: 1440, height: 900 }, js: false });
    await page.goto(BASE + '?review', { waitUntil: 'load' });
    results.noJs = await page.evaluate(() => ({ cls: document.documentElement.className, reviewNotesVisible: Array.from(document.querySelectorAll('[data-review]')).filter((e) => e.offsetParent !== null).length,
      heroOpacity: getComputedStyle(document.getElementById('stage-hero')).opacity, panelOpacity: getComputedStyle(document.getElementById('leistungsbereiche')).opacity,
      workOpacity: getComputedStyle(document.getElementById('stage-work')).opacity, teaserOpacity: getComputedStyle(document.querySelector('.teaser__item')).opacity,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
    results.noJs.errors = errors;
    await page.screenshot({ path: path.join(OUT, 'view-no-js.png'), fullPage: true });
    await ctx.close();
  }

  // 7. growth.js fails to load: stage.js must give up and the stacked page must show.
  {
    const { ctx, page, errors } = await newPage(browser, { viewport: { width: 1440, height: 900 }, route: (p) => p.route('**/growth.js', (r) => r.abort()) });
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    await sleep(3600);
    results.growthFails = await page.evaluate(() => ({ cls: document.documentElement.className, heroOpacity: getComputedStyle(document.getElementById('stage-hero')).opacity,
      panelOpacity: getComputedStyle(document.getElementById('leistungsbereiche')).opacity }));
    results.growthFails.errors = errors;
    await ctx.close();
  }

  // 8. stage.js blocked: the CSS fail-safe must reveal the copy and never block clicks.
  {
    const { ctx, page } = await newPage(browser, { viewport: { width: 1440, height: 900 }, route: (p) => p.route('**/stage.js', (r) => r.abort()) });
    const t0 = Date.now();
    await page.goto(BASE + '?intro=1', { waitUntil: 'domcontentloaded' });
    const heroOp = async () => page.evaluate(() => getComputedStyle(document.getElementById('stage-hero')).opacity);
    await sleep(1000); const early = await heroOp();
    await sleep(2600); const late = await heroOp();
    const hit = await page.evaluate(() => { const r = document.querySelector('.stage__actions .button').getBoundingClientRect(); const e = document.elementFromPoint(r.left + 5, r.top + 5); return e && e.className; });
    results.stageJsBlocked = { heroOpacityAt1s: early, heroOpacityAt3_6s: late, elementAtHeroButton: hit, ms: Date.now() - t0 };
    await ctx.close();
  }

  // 8b. Stage scenes: service interaction, keyboard, transition, header mode, mobile copy rest.
  for (const v of [{ name: 'stage-desktop', viewport: { width: 1440, height: 900 }, dpr: 1 }, { name: 'stage-mobile', viewport: { width: 390, height: 844 }, dpr: 2, mobile: true }]) {
    const { ctx, page, errors } = await newPage(browser, v);
    await page.goto(BASE + '?intro=0', { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready); await sleep(400);
    const toP = async (f) => { await page.evaluate((f) => { const s = document.getElementById('stage'); scrollTo({ top: s.offsetTop + f * (s.offsetHeight - innerHeight), behavior: 'instant' }); }, f); await sleep(350); };
    const r = { headerDarkAtTop: await page.evaluate(() => document.documentElement.classList.contains('header-dark')) };
    await toP(0.38);
    await page.screenshot({ path: path.join(OUT, `${v.name}-services.png`) });
    r.interaction = {};
    for (const g of [2, 1, 3]) {
      await page.click(`#stage-groups button[data-g="${g}"]`);
      await sleep(250);
      r.interaction['g' + g] = await page.evaluate(() => ({ pressed: document.querySelector('#stage-groups [aria-pressed=true]').textContent.trim(), detail: document.getElementById('stage-detail').innerText.split('\n')[0] }));
    }
    if (!v.mobile) {
      const pt = await page.evaluate(() => { const hp = document.querySelectorAll('#stage-rings .hit')[0]; const bb = hp.getBBox(); const s = document.getElementById('stage-rings').createSVGPoint(); s.x = bb.x; s.y = bb.y + bb.height / 2; const q = s.matrixTransform(hp.getScreenCTM()); return { x: q.x + 3, y: q.y }; });
      await page.mouse.move(pt.x, pt.y); await sleep(300);
      r.interaction.hoverInnerRing = await page.evaluate(() => document.querySelector('#stage-groups [aria-pressed=true]').textContent.trim());
    }
    r.transition = [];
    for (const f of [0.7, 0.76, 0.78, 0.8, 0.82, 0.84, 0.86, 0.88, 0.9, 0.97]) {
      await toP(f);
      r.transition.push(await page.evaluate((f) => {
        const hit = (el) => { if (!el) return null; const q = el.getBoundingClientRect(); if (!q.width) return 'not shown'; const e = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2); return !!e && (el === e || el.contains(e)); };
        const pe = document.getElementById('stage-paper'), pr = parseFloat(pe.style.getPropertyValue('--pr')) || 0, cx = parseFloat(pe.style.getPropertyValue('--pcx')), cy = parseFloat(pe.style.getPropertyValue('--pcy'));
        const work = document.getElementById('stage-work'), q = work.getBoundingClientRect();
        const near = Math.hypot(Math.max(q.left - cx, 0, cx - q.right), Math.max(q.top - cy, 0, cy - q.bottom));
        const far = Math.max(...[[q.left, q.top], [q.right, q.top], [q.left, q.bottom], [q.right, q.bottom]].map(([x, y]) => Math.hypot(x - cx, y - cy)));
        const shown = parseFloat(getComputedStyle(work).opacity) > 0.05 && getComputedStyle(work).visibility !== 'hidden';
        return { p: f, edgeRadius: Math.round(pr), edgeInsideCopyWhileShown: shown && pr > near && pr < far,
                 contactReachable: hit(document.querySelector(innerWidth >= 1024 ? '.header-cta' : '.action-bar .button--primary')),
                 headerControl: hit(document.querySelector(innerWidth >= 1024 ? '.site-nav a' : '.menu-button')),
                 headerDark: document.documentElement.classList.contains('header-dark'), htmlClip: getComputedStyle(document.documentElement).clipPath };
      }, f));
      if (f === 0.84) await page.screenshot({ path: path.join(OUT, `${v.name}-transition-084.png`) });
    }
    const aria = await page.locator('body').ariaSnapshot();
    r.ariaRealWorkHeadingCount = aria.split('Echte Arbeit am Baum').length - 1;
    await page.evaluate(() => scrollTo({ top: document.getElementById('stage').offsetHeight + 40, behavior: 'instant' })); await sleep(300);
    r.headerDarkAfterStage = await page.evaluate(() => document.documentElement.classList.contains('header-dark'));
    // keyboard: from the top, tab into the service buttons; the scene must come into view
    await page.evaluate(() => { document.activeElement && document.activeElement.blur(); scrollTo({ top: 0, behavior: 'instant' }); }); await sleep(200);
    await page.focus('.skip-link');                    // start the Tab path at the top of the document
    let reached = false;
    for (let i = 0; i < 25 && !reached; i++) { await page.keyboard.press('Tab'); reached = await page.evaluate(() => !!document.activeElement.closest('#stage-groups')); }
    await sleep(400);
    r.keyboardServices = { reached, panelOpacity: await page.evaluate(() => getComputedStyle(document.getElementById('leistungsbereiche')).opacity) };
    await page.keyboard.press('Enter'); await sleep(200);
    r.keyboardServices.selected = await page.evaluate(() => document.querySelector('#stage-groups [aria-pressed=true]').textContent.trim());
    r.errors = errors;
    results[v.name] = r;
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
