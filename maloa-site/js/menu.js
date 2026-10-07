/* Menu page: renders every product, ingredient, value and code from window.MALOA_MENU (js/menu-data.js).
   - Hero islands: the bowls that have a real photo; each opens its details.
   - Sticky categories: plain anchor links (native smooth scroll, scroll-margin on the sections), the active one
     follows the reading position; nothing ever moves the page by itself.
   - Poké your style: six steps (tabs), ingredients as toggle buttons. The sum of the chosen ingredients' per-portion
     values is shown, the PDF's own method (its bowls are exactly the sum of their documented components plus the
     undocumented Mix Salat and Sesam, which are therefore left out here and said so). The plate shows the real
     Spicy Tropical layers for the ingredients that appear in that photo.
   - Favorites and bowls with filters, currys, sweet, drinks: buttons that open one detail dialog.
   - Nutrition overview: search, category, "without allergen", expandable rows; the PDF for download.
   Reduced motion: no entrance or parallax, instant state changes. */
(function () {
  var D = window.MALOA_MENU;
  if (!D) return;
  var M = window.MALOA || {};
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var h = function (tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) { if (attrs[k] === false || attrs[k] == null) continue; if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k] === true ? '' : attrs[k]); }
    if (html != null) e.innerHTML = html;
    return e;
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  document.documentElement.classList.add('mn-anim');

  // ---------- formatting: German decimals, values as printed ----------
  var de = function (v, min, max) { return Number(v).toLocaleString('de-DE', { minimumFractionDigits: min, maximumFractionDigits: max }); };
  var kcal = function (v) { return de(v, 0, 2); };
  var gram = function (v) { return de(v, 2, 2) + ' g'; };
  var BASIS_SHORT = function (b) { return /100 ml/.test(b) ? 'pro 100 ml' : /100 g/.test(b) ? 'pro 100 g' : 'pro Portion'; };

  var products = D.products, ingredients = D.ingredients;
  var byId = {}; products.concat(ingredients).forEach(function (x) { byId[x.id] = x; });
  var allergenBy = {}; D.allergens.forEach(function (a) { allergenBy[a.code] = a; });
  var additiveBy = {}; D.additives.forEach(function (a) { additiveBy[a.code] = a; });
  var typeLabel = {}; D.types.forEach(function (t) { typeLabel[t.id] = t.label; });
  var isAdd = function (c) { return /^\d+$/.test(c); };
  function sortCodes(list) {
    return list.slice().sort(function (a, b) {
      var na = isAdd(a), nb = isAdd(b);
      if (na !== nb) return na ? 1 : -1;
      return na ? a - b : a.localeCompare(b, 'de', { numeric: true });
    });
  }
  function codesText(codes) { return codes && codes.length ? sortCodes(codes).join(', ') : ''; }
  // as the PDF names them: "d1 Weizen" (the group d is explained in the legend)
  function allergenName(c) { var a = allergenBy[c]; return a ? a.name : c; }

  // order links and the PDF
  $$('[data-order]').forEach(function (a) { a.href = D.meta.order; });
  $$('[data-pdf]').forEach(function (a) { a.href = D.meta.pdf; a.setAttribute('download', 'MALOA-Naehrwerte-' + D.meta.stand.replace('/', '-') + '.pdf'); });
  $$('[data-pdf-meta]').forEach(function (e) { e.textContent = D.meta.source + ', Stand ' + D.meta.stand + ' · PDF'; });
  $$('[data-disclaimer]').forEach(function (e) { e.textContent = D.meta.disclaimer + ' Die Nährwert-PDF ist die verbindliche Übersicht.'; });

  // ---------- hero islands ----------
  // positions in % of the islands box (x, y = centre; s = width); the centre one is the largest
  var spots = [
    { id: 'maui-tuna-bowl', x: 50, y: 50, s: 42, d: 1 },
    { id: 'lanai-tuna-bowl', x: 15, y: 25, s: 24, d: .55 },
    { id: 'crazy-beetroot-bowl', x: 86, y: 20, s: 22, d: .45 },
    { id: 'spicy-tropical-tofu-bowl', x: 15, y: 77, s: 25, d: .7 },
    { id: 'green-cream-shrimps-bowl', x: 85, y: 78, s: 24, d: .6 },
    { id: 'peanutlover-chicken-bowl', x: 52, y: 8, s: 15, d: .35 }
  ];
  var islands = $('[data-islands]');
  if (islands) spots.forEach(function (sp, i) {
    var p = byId[sp.id]; if (!p || !p.image) return;
    var b = h('button', { class: 'mn-island', type: 'button', 'data-open': p.id, 'data-depth': sp.d, style: '--x:' + sp.x + '%;--y:' + sp.y + '%;--s:' + sp.s + '%;z-index:' + Math.round(sp.s), 'aria-label': p.name + ': Details' });
    b.innerHTML = '<img src="' + p.image.src.replace('-900', '-560') + '" srcset="' + p.image.srcset + '" sizes="(max-aspect-ratio: 4/5) 44vw, 22vw" width="900" height="900" alt="" decoding="async"' + (i > 1 ? ' loading="lazy"' : '') + '>' +
      '<span class="mn-island__name">' + esc(p.name.replace(/ Bowl$/, '')) + '</span>';
    b.style.transitionDelay = (0.15 + i * 0.08) + 's';
    islands.appendChild(b);
  });

  // ---------- sticky categories ----------
  var catList = $('[data-cats]');
  D.categories.forEach(function (c, i) {
    var li = h('li');
    li.appendChild(h('a', { class: 'mn-cats__link', href: '#' + c.id, 'data-cat': c.id }, '<span>' + String(i + 1).padStart(2, '0') + '</span>' + esc(c.label)));
    catList.appendChild(li);
  });
  var track = $('.mn-cats__track');
  function setCat(id) {
    $$('.mn-cats__link').forEach(function (a) {
      var on = a.dataset.cat === id;
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      // keep the active item visible inside the strip (horizontal only: the page never moves)
      if (on && track.scrollWidth > track.clientWidth) {
        var l = a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2;
        track.scrollTo({ left: Math.max(0, l), behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var secIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setCat(e.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    D.categories.forEach(function (c) { var s = document.getElementById(c.id); if (s) secIo.observe(s); });
    // above the first category nothing is active
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) setCat(null); }, { rootMargin: '-40% 0px -55% 0px' }).observe($('.mn-hero'));
  }

  // ---------- header over light grounds (as on the franchise page) ----------
  var header = $('.site-header'), row = $('.site-header__row');
  var lights = $$('.mn-light, .mn-cats');
  if (header && 'IntersectionObserver' in window) {
    var on = new Set(), hio;
    var hset = function () {
      var hh = row ? row.offsetHeight : 72;
      hio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) on.add(e.target); else on.delete(e.target); });
        header.classList.toggle('is-light', on.size > 0);
      }, { rootMargin: '0px 0px ' + (-(innerHeight - hh / 2)) + 'px 0px' });
      lights.forEach(function (s) { hio.observe(s); });
    };
    hset();
    addEventListener('resize', function () { hio.disconnect(); on.clear(); hset(); });
  }

  // ---------- Poké your style ----------
  var steps = D.steps;
  var chosen = {}; steps.forEach(function (s) { chosen[s.id] = []; });
  var current = 0;
  var stepsEl = $('[data-steps]'), optsEl = $('[data-options]'), plate = $('[data-plate]');
  var stepBtns = steps.map(function (s, i) {
    var b = h('button', { class: 'mn-step', type: 'button', role: 'tab', id: 'mn-step-' + s.id, 'aria-controls': 'mn-panel', 'aria-selected': i === 0 ? 'true' : 'false', tabindex: i === 0 ? '0' : '-1' },
      '<span class="mn-step__no">' + s.no + '</span><span class="mn-step__label">' + esc(s.label) + '</span><span class="mn-step__count" aria-hidden="true"></span>');
    b.addEventListener('click', function () { go(i, true); });
    b.addEventListener('keydown', function (e) {
      var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (k) { e.preventDefault(); go((i + k + steps.length) % steps.length, true); }
    });
    stepsEl.appendChild(b);
    return b;
  });
  var panel = h('div', { class: 'mn-panel', role: 'tabpanel', id: 'mn-panel', tabindex: '0' });
  optsEl.appendChild(panel);

  // the plate's layers, in the order they sit in the photo; a layer shows when a chosen ingredient maps to it
  var LAYERS = ['rice', 'tofu', 'veg1', 'veg2', 'veg3', 'mango', 'pineapple', 'sauce', 'coconut'];
  var layerEls = {};
  LAYERS.forEach(function (n) {
    var im = h('img', { class: 'mn-plate__layer', src: 'assets/poke/spicy-tropical-' + n + '-960.webp', width: 960, height: 960, alt: '', decoding: 'async', loading: 'lazy' });
    plate.appendChild(im); layerEls[n] = im;
  });
  var cap = h('figcaption', { class: 'mn-plate__cap' }, 'Foto: unsere Spicy Tropical Bowl. Es erscheinen die Zutaten, die darin vorkommen.');
  plate.parentNode.appendChild(cap);

  function go(i, focus) {
    current = i;
    stepBtns.forEach(function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
    if (focus) stepBtns[i].focus();
    panel.setAttribute('aria-labelledby', stepBtns[i].id);
    renderPanel();
  }
  function renderPanel() {
    var s = steps[current];
    var list = ingredients.filter(function (x) { return x.group === s.id; });
    panel.innerHTML = '';
    panel.appendChild(h('p', { class: 'mn-panel__hint' }, 'Wählt aus ' + list.length + ' Zutaten. Werte je Portion laut Nährwerttabelle.'));
    var ul = h('ul', { class: 'mn-options' });
    list.forEach(function (x) {
      var on = chosen[s.id].indexOf(x.id) > -1;
      var b = h('button', { class: 'mn-opt', type: 'button', 'aria-pressed': on ? 'true' : 'false', 'data-ing': x.id },
        '<span class="mn-opt__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></svg></span>' +
        '<span>' + esc(x.name) + (x.star ? '**' : '') + '</span>' + (x.seasonal ? '<span class="mn-opt__season">saisonal</span>' : '') +
        '<span class="mn-opt__kcal">' + kcal(x.n.kcal) + ' kcal</span>');
      b.addEventListener('click', function () { toggle(s.id, x.id, b); });
      var li = h('li'); li.appendChild(b); ul.appendChild(li);
    });
    panel.appendChild(ul);
    var nav = h('p', { class: 'mn-panel__nav' });
    if (current > 0) { var back = h('button', { class: 'mn-textbtn', type: 'button' }, 'Zurück'); back.addEventListener('click', function () { go(current - 1, true); }); nav.appendChild(back); }
    else nav.appendChild(h('span'));
    if (current < steps.length - 1) { var next = h('button', { class: 'mn-textbtn', type: 'button' }, 'Weiter: ' + steps[current + 1].no + ' ' + esc(steps[current + 1].label)); next.addEventListener('click', function () { go(current + 1, true); }); nav.appendChild(next); }
    panel.appendChild(nav);
  }
  function toggle(step, id, btn) {
    var arr = chosen[step], k = arr.indexOf(id);
    if (k > -1) arr.splice(k, 1); else arr.push(id);
    btn.setAttribute('aria-pressed', k > -1 ? 'false' : 'true');
    update();
  }
  var sumList = $('[data-sum-list]'), totals = $('[data-totals]'), sumCodes = $('[data-sum-codes]'), sumNote = $('[data-sum-note]');
  function update() {
    var picked = [];
    steps.forEach(function (s, i) {
      chosen[s.id].forEach(function (id) { picked.push(byId[id]); });
      var c = stepBtns[i].querySelector('.mn-step__count');
      c.textContent = chosen[s.id].length || '';
      c.classList.toggle('is-on', chosen[s.id].length > 0);
    });
    // list
    sumList.innerHTML = '';
    steps.forEach(function (s) {
      var names = chosen[s.id].map(function (id) { return esc(byId[id].name); });
      sumList.appendChild(h('li', null, '<b>' + esc(s.label) + '</b><span class="' + (names.length ? '' : 'is-empty') + '">' + (names.length ? names.join(', ') : '–') + '</span>'));
    });
    // totals: the sum of the documented per-portion values
    var t = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    picked.forEach(function (x) { for (var f in t) t[f] += x.n[f]; });
    var none = !picked.length;
    var val = function (v, unit) { return none ? '–' : de(Math.round(v * 100) / 100, 0, unit === 'kcal' ? 0 : 1) + '<small>' + unit + '</small>'; };
    totals.innerHTML = '<div class="mn-totals__kcal"><dt>Kalorien</dt><dd>' + val(t.kcal, 'kcal') + '</dd></div>' +
      '<div><dt>Eiweiß</dt><dd>' + val(t.protein, 'g') + '</dd></div><div><dt>Kohlenhydrate</dt><dd>' + val(t.carbs, 'g') + '</dd></div>' +
      '<div><dt>Fett</dt><dd>' + val(t.fat, 'g') + '</dd></div>';
    // allergens and additives: the union of the chosen ingredients' codes
    var codes = {}; picked.forEach(function (x) { (x.codes || []).forEach(function (c) { codes[c] = 1; }); });
    var cs = sortCodes(Object.keys(codes));
    var al = cs.filter(function (c) { return !isAdd(c); }), ad = cs.filter(isAdd);
    sumCodes.innerHTML = (al.length ? '<b>Allergene:</b> ' + al.map(function (c) { return c + ' ' + esc(allergenName(c)); }).join(', ') + '. ' : '') +
      (ad.length ? '<b>Zusatzstoffe:</b> ' + ad.map(function (c) { return c + ' ' + esc(additiveBy[c].name); }).join(', ') + '.' : '');
    var star = picked.some(function (x) { return x.star; });
    var multi = steps.some(function (s) { return chosen[s.id].length > 1; });
    sumNote.textContent = none ? 'Wählt Zutaten aus: hier stehen dann ihre Werte, je eine Portion laut Nährwerttabelle (Stand ' + D.meta.stand + ').'
      : 'Summe der gewählten Zutaten, je eine Portion laut Nährwerttabelle (Stand ' + D.meta.stand + ')' + (multi ? '; jede Auswahl zählt als ganze Portion' : '') +
        '. Mix Salat und Sesam sind dort nicht einzeln ausgewiesen und hier nicht enthalten. Durchschnittswerte.' + (star ? ' ** ' + D.meta.starNote + '.' : '');
    // plate
    var layersOn = {};
    picked.forEach(function (x) { (x.visual || []).forEach(function (n) { layersOn[n] = 1; }); });
    LAYERS.forEach(function (n) { layerEls[n].classList.toggle('is-on', !!layersOn[n]); });
  }
  $('[data-reset]').addEventListener('click', function () { steps.forEach(function (s) { chosen[s.id] = []; }); renderPanel(); update(); go(0, false); });
  go(0, false); update();

  // ---------- product cards, rows and the detail dialog ----------
  function ingLine(p) { return p.ingredients ? p.ingredients.join(', ') : (p.detail || ''); }
  function imgTag(p, sizes, lazy) {
    return '<img src="' + p.image.src + '" srcset="' + p.image.srcset + '" sizes="' + sizes + '" width="900" height="900" alt="' + esc(p.image.alt) + '" decoding="async"' + (lazy ? ' loading="lazy"' : '') + '>';
  }

  // Favorites
  var favEl = $('[data-favs]');
  var favs = products.filter(function (p) { return p.featured; }).sort(function (a, b) { return a.featured - b.featured; });
  favs.forEach(function (p) {
    var li = h('li', { class: 'mn-fav', 'data-type': p.type });
    li.innerHTML = '<button class="mn-fav__img" type="button" data-open="' + p.id + '" aria-label="' + esc(p.name) + ': Details">' + imgTag(p, '(max-aspect-ratio: 4/5) 112px, (max-width: 1023px) 50vw, 28vw', true) + '</button>' +
      '<p class="mn-fav__type">' + esc(typeLabel[p.type]) + '</p>' +
      '<h3 class="mn-fav__name">' + esc(p.name) + (p.star ? '**' : '') + '</h3>' +
      '<p class="mn-fav__ing">' + esc(ingLine(p)) + '</p>' +
      '<p class="mn-fav__meta"><span><span class="mn-kcal">' + kcal(p.n.kcal) + '</span><span class="mn-unit">kcal</span></span><span class="mn-codes">' + codesText(p.codes) + '</span></p>' +
      '<p class="mn-fav__actions"><a class="btn btn--primary" href="' + D.meta.order + '">Bestellen</a><button class="mn-textbtn" type="button" data-open="' + p.id + '">Details</button></p>';
    favEl.appendChild(li);
  });
  var favEmpty = h('li', { class: 'mn-empty', hidden: true }, 'Keine Favorites in dieser Auswahl.');
  favEl.appendChild(favEmpty);
  function lead() {
    var vis = $$('.mn-fav', favEl).filter(function (e) { return !e.hidden; });
    vis.forEach(function (e, i) { if (i === 0) e.setAttribute('data-lead', ''); else e.removeAttribute('data-lead'); });
    favEmpty.hidden = vis.length > 0;
  }
  var ff = $('[data-filter="favorites"]');
  D.types.forEach(function (t) {
    var b = h('button', { class: 'mn-chip', type: 'button', 'aria-pressed': t.id === 'all' ? 'true' : 'false' }, esc(t.label));
    b.addEventListener('click', function () {
      $$('.mn-chip', ff).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('.mn-fav', favEl).forEach(function (e) { e.hidden = !(t.id === 'all' || e.dataset.type === t.id); });
      lead();
    });
    ff.appendChild(b);
  });
  lead();

  // Bowls
  var bowlsEl = $('[data-bowls]');
  $('[data-bowl-basis]').textContent = 'Alle Werte ' + products.find(function (p) { return p.category === 'bowls'; }).basis + '. Base nach Wahl, siehe Poké your style.';
  var bowlGroups = [
    { title: 'Fisch & Seafood', items: products.filter(function (p) { return p.category === 'bowls' && p.type === 'fish' && !p.group; }) },
    { title: 'Chicken', items: products.filter(function (p) { return p.category === 'bowls' && p.type === 'chicken' && !p.group; }) },
    { title: 'Pflanzlich', note: 'Tofu, Beetroot Falafel. Allergene stehen bei jeder Bowl.', items: products.filter(function (p) { return p.category === 'bowls' && p.type === 'plant' && !p.group; }) },
    { title: D.groups.special, note: 'In der Nährwerttabelle unter bzw. nach „Bowl of the Month“ aufgeführt. Ob sie gerade angeboten werden, steht dort nicht: bitte im Store erfragen.', items: products.filter(function (p) { return p.category === 'bowls' && p.group === 'special'; }) }
  ];
  var idx = 0;
  bowlGroups.forEach(function (g) {
    var sec = h('div', { class: 'mn-group' });
    sec.innerHTML = '<div class="mn-group__head"><h3 class="mn-group__title">' + esc(g.title) + '</h3><span class="mn-group__count">' + g.items.length + ' Bowls</span>' + (g.note ? '<p class="mn-group__note">' + esc(g.note) + '</p>' : '') + '</div>';
    var ul = h('ul', { class: 'mn-rows' });
    g.items.forEach(function (p) {
      idx++;
      var li = h('li');
      li.innerHTML = '<button class="mn-row" type="button" data-open="' + p.id + '">' +
        (p.image ? '<span class="mn-row__thumb">' + imgTag(p, '56px', true) + '</span>' : '<span class="mn-row__thumb is-index" aria-hidden="true">' + String(idx).padStart(2, '0') + '</span>') +
        '<span><span class="mn-row__name">' + esc(p.name) + (p.star ? '**' : '') + (p.group === 'special' ? '<span class="mn-tag">Special</span>' : '') + '</span><span class="mn-row__ing">' + esc(ingLine(p)) + '</span></span>' +
        '<span class="mn-row__right"><span><span class="mn-kcal">' + kcal(p.n.kcal) + '</span><span class="mn-unit">kcal</span></span><span class="mn-codes">' + codesText(p.codes) + '</span></span></button>';
      ul.appendChild(li);
    });
    sec.appendChild(ul);
    bowlsEl.appendChild(sec);
  });

  // a large typographic row (currys, soup, sweet bowls)
  function big(p, meta) {
    return '<button class="mn-big" type="button" data-open="' + p.id + '"><span class="mn-big__name">' + esc(p.name) + '</span>' +
      '<span><span class="mn-kcal">' + kcal(p.n.kcal) + '</span><span class="mn-unit">kcal</span></span>' +
      '<span class="mn-big__meta">' + esc(meta) + (p.codes && p.codes.length ? ' · ' + codesText(p.codes) : '') + '</span></button>';
  }
  var cur = $('[data-currys]');
  cur.innerHTML = '<div class="mn-currys__col"><p class="mn-sub">' + D.groups.curry + '</p>' +
    products.filter(function (p) { return p.group === 'curry'; }).map(function (p) { return big(p, typeLabel[p.type] + ' · ' + BASIS_SHORT(p.basis)); }).join('') + '</div>' +
    '<div class="mn-currys__col"><p class="mn-sub">' + D.groups.soup + '</p>' +
    products.filter(function (p) { return p.group === 'soup'; }).map(function (p) { return big(p, BASIS_SHORT(p.basis)); }).join('') + '</div>';

  var sw = $('[data-sweet]');
  var sweetBowls = products.filter(function (p) { return p.group === 'sweet-bowl'; });
  var mochi = products.filter(function (p) { return p.group === 'mochi'; });
  sw.innerHTML = '<div class="mn-sweet__bowls"><p class="mn-sub">' + D.groups['sweet-bowl'] + '</p>' + sweetBowls.map(function (p) { return big(p, 'Mit Granola, Kokoschips und Mango'); }).join('') + '</div>' +
    '<div class="mn-sweet__mochi"><p class="mn-sub">' + D.groups.mochi + '</p><p class="mn-fine">Sechs Sorten. Werte pro 100 g.</p><ul class="mn-mochi">' +
    mochi.map(function (p) { return '<li><button class="mn-mochi__btn" type="button" data-open="' + p.id + '"><span class="mn-mochi__name">' + esc(p.short) + '</span><span class="mn-mochi__kcal">' + kcal(p.n.kcal) + ' kcal</span></button></li>'; }).join('') + '</ul></div>';

  var dr = $('[data-drinks]');
  var sm = products.filter(function (p) { return p.group === 'smoothie'; });
  var dl = function (key, wide, note) {
    var items = products.filter(function (p) { return p.group === key; });
    return '<div class="mn-dl' + (wide ? ' mn-dl--wide' : '') + '"><p class="mn-sub">' + D.groups[key] + '</p>' + (note ? '<p class="mn-fine">' + note + '</p>' : '') + '<ul class="mn-dl__list">' +
      items.map(function (p) {
        return '<li class="mn-dl__item"><button class="mn-dl__btn" type="button" data-open="' + p.id + '"><span><span class="mn-dl__name">' + esc(p.name) + '</span>' + (p.detail ? '<span class="mn-dl__detail">' + esc(p.detail) + '</span>' : '') + '</span>' +
          '<span class="mn-dl__val">' + (p.exempt ? 'befreit' : kcal(p.n.kcal) + ' kcal') + '</span></button></li>';
      }).join('') + '</ul></div>';
  };
  dr.innerHTML = '<p class="mn-sub">' + D.groups.smoothie + '</p><p class="mn-fine">Werte pro Portion.</p><ul class="mn-smoothies">' +
    sm.map(function (p) { return '<li><button class="mn-smoothie" type="button" data-open="' + p.id + '"><span class="mn-smoothie__name">' + esc(p.name) + '</span><span><span class="mn-kcal">' + kcal(p.n.kcal) + '</span><span class="mn-unit">kcal</span></span></button></li>'; }).join('') + '</ul>' +
    '<div class="mn-drinklists">' + dl('soft', true, 'Werte pro 100 ml.') + dl('kombucha', false, 'Werte pro 100 ml.') + dl('beer', false, 'Werte pro 100 ml.') + dl('water', false, 'Werte pro 100 ml.') +
    dl('tea', true, 'Von der Kennzeichnungspflicht befreit: keine Nährwerte angegeben.') + '</div>';

  // nutrition values block (shared by the dialog and the overview rows)
  function nutrBlock(x) {
    if (!x.n) return '<p class="mn-fine">Von der Kennzeichnungspflicht befreit: keine Nährwerte angegeben.</p>';
    var r = function (label, v, sub) { return '<div' + (sub ? ' class="is-sub"' : '') + '><dt>' + label + '</dt><dd>' + v + '</dd></div>'; };
    return '<dl class="mn-nutr">' + r('Brennwert', de(x.n.kj, 0, 2) + ' kJ / ' + kcal(x.n.kcal) + ' kcal') + r('Fett', gram(x.n.fat)) + r('davon gesättigte Fettsäuren', gram(x.n.sat), 1) +
      r('Kohlenhydrate', gram(x.n.carbs)) + r('davon Zucker', gram(x.n.sugar), 1) + r('Ballaststoffe', gram(x.n.fiber)) + r('Eiweiß', gram(x.n.protein)) + r('Salz', gram(x.n.salt)) + '</dl>';
  }
  function allgBlock(x) {
    if (x.exempt) return '';
    var cs = sortCodes(x.codes || []);
    var al = cs.filter(function (c) { return !isAdd(c); }), ad = cs.filter(isAdd);
    var out = '<div class="mn-allg">';
    out += '<h4>Allergene</h4>' + (al.length ? '<ul>' + al.map(function (c) { return '<li><b>' + c + '</b> ' + esc(allergenName(c)) + '</li>'; }).join('') + '</ul>' : '<p>Keine gekennzeichnet.</p>');
    if (ad.length) out += '<h4>Zusatzstoffe</h4><ul>' + ad.map(function (c) { return '<li><b>' + c + '</b> ' + esc(additiveBy[c].name) + '</li>'; }).join('') + '</ul>';
    return out + '</div>';
  }

  // the dialog
  var dlg = $('[data-detail]'), dMedia = $('[data-dmedia]'), dBody = $('[data-dbody]'), opener = null;
  var catLabel = { bowls: 'Bowl', currys: 'Currys & Soup', sweet: 'Sweet', drinks: 'Drinks' };
  function open(id, from) {
    var p = byId[id]; if (!p) return;
    opener = from || document.activeElement;
    dMedia.innerHTML = p.image ? imgTag(p, '(max-aspect-ratio: 4/5) 62vw, 460px', false) : '<p class="mn-detail__type" aria-hidden="true">' + esc(p.short || p.name) + '</p>';
    var label = [catLabel[p.category], p.group ? D.groups[p.group] : null, p.type ? typeLabel[p.type] : null].filter(function (v, i, a) { return v && a.indexOf(v) === i; }).join(' · ');
    var notes = [];
    if (p.group === 'special') notes.push('In der Nährwerttabelle unter bzw. nach „Bowl of the Month“ aufgeführt. Ob die Bowl gerade angeboten wird, steht dort nicht: bitte im Store erfragen.');
    if (p.note) notes.push(p.note);
    if (p.star || (p.ingredients || []).some(function (n) { return n === 'Seaweed Salad'; })) notes.push('** ' + D.meta.starNote + '.');
    if (p.exempt) notes.push('Von der Kennzeichnungspflicht befreit: in der Nährwerttabelle sind keine Nährwerte und Allergene angegeben.');
    dBody.innerHTML = '<p class="mn-detail__label">' + esc(label) + '</p>' +
      '<h2 class="mn-detail__name" id="mn-detail-title">' + esc(p.name) + (p.star ? '**' : '') + '</h2>' +
      (p.ingredients ? '<p class="mn-detail__ing">' + esc(p.ingredients.join(', ')) + '</p>' : p.detail ? '<p class="mn-detail__ing">' + esc(p.detail) + '</p>' : '') +
      (p.n ? '<p class="mn-detail__kcal"><span class="mn-kcal">' + kcal(p.n.kcal) + '</span><span class="mn-unit">kcal</span></p><p class="mn-detail__basis">' + esc(p.basis.charAt(0).toUpperCase() + p.basis.slice(1)) + '. Durchschnittswerte, Stand ' + D.meta.stand + '.</p>' : '') +
      nutrBlock(p) + allgBlock(p) +
      notes.map(function (t) { return '<p class="mn-detail__note">' + esc(t) + '</p>'; }).join('') +
      '<p class="mn-detail__actions"><a class="btn btn--primary" href="' + D.meta.order + '">Jetzt bestellen</a>' +
      (p.category === 'bowls' ? '<a class="mn-textbtn" href="#poke" data-close>Selbst zusammenstellen</a>' : '') + '</p>';
    document.documentElement.classList.add('mn-lock');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    dBody.scrollTop = 0; var inner = $('.mn-detail__inner'); if (inner) inner.scrollTop = 0;
  }
  function close() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function () { document.documentElement.classList.remove('mn-lock'); if (opener && opener.focus) opener.focus({ preventScroll: true }); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) return close();                                   // the backdrop
    var c = e.target.closest('[data-close]'); if (c) { close(); }          // "Selbst zusammenstellen" closes, then the link scrolls
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]'); if (!b || dlg.contains(b)) return;
    open(b.getAttribute('data-open'), b);
  });

  // ---------- nutrition overview ----------
  var NCATS = [
    { id: 'all', label: 'Alle' },
    { id: 'base', label: 'Base' }, { id: 'protein', label: 'Protein' }, { id: 'mixin', label: 'Mix-ins' }, { id: 'flavor', label: 'Flavors' },
    { id: 'topping', label: 'Toppings' }, { id: 'premium', label: 'Premium Toppings' },
    { id: 'bowls', label: 'Bowls' }, { id: 'currys', label: 'Currys & Suppe' }, { id: 'sweet', label: 'Sweet' }, { id: 'drinks', label: 'Drinks' }
  ];
  var groupName = { base: 'Base', protein: 'Protein', mixin: 'Mix-in', flavor: 'Homemade Flavor', topping: 'Topping', premium: 'Premium Topping' };
  var entries = ingredients.map(function (x) { return { x: x, cat: x.group, label: groupName[x.group] + (x.seasonal ? ' · saisonal' : '') }; })
    .concat(products.map(function (p) { return { x: p, cat: p.category, label: (p.group ? D.groups[p.group] : catLabel[p.category]) }; }));
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’`]/g, ''); };
  var table = $('[data-ntable]');
  table.innerHTML = '<div class="mn-nhead" role="row"><span role="columnheader">Zutat / Gericht</span><span role="columnheader" class="mn-c-basis">Bezug</span><span role="columnheader">kcal</span>' +
    '<span role="columnheader" class="mn-c-prot">Eiweiß</span><span role="columnheader" class="mn-c-carb">Kohlenh.</span><span role="columnheader" class="mn-c-fat">Fett</span><span role="columnheader" class="mn-c-salt">Salz</span><span role="columnheader">Kennz.</span><span></span></div>';
  entries.forEach(function (e, i) {
    var x = e.x, n = x.n;
    var row = h('div', { class: 'mn-nrow', role: 'row' });
    var dash = '–';
    row.innerHTML = '<button class="mn-nrow__btn" type="button" aria-expanded="false" aria-controls="mn-n-' + i + '">' +
      '<span class="mn-nrow__name" role="cell"><b>' + esc(x.name) + (x.star ? '**' : '') + '</b><small>' + esc(e.label) + '</small></span>' +
      '<span class="mn-nrow__basis mn-c-basis" role="cell">' + (x.basis ? esc(BASIS_SHORT(x.basis)) : 'pro Portion') + '</span>' +
      '<span role="cell">' + (n ? kcal(n.kcal) : dash) + '</span>' +
      '<span role="cell" class="mn-c-prot">' + (n ? de(n.protein, 2, 2) : dash) + '</span>' +
      '<span role="cell" class="mn-c-carb">' + (n ? de(n.carbs, 2, 2) : dash) + '</span>' +
      '<span role="cell" class="mn-c-fat">' + (n ? de(n.fat, 2, 2) : dash) + '</span>' +
      '<span role="cell" class="mn-c-salt">' + (n ? de(n.salt, 2, 2) : dash) + '</span>' +
      '<span role="cell" class="mn-codes">' + (x.exempt ? 'befreit' : codesText(x.codes) || dash) + '</span>' +
      '<svg class="mn-nrow__chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>' +
      '<div class="mn-nrow__more" id="mn-n-' + i + '" hidden>' + nutrBlock(x) + allgBlock(x) +
      (x.basis ? '<p class="mn-fine" style="grid-column:1/-1">' + esc(x.basis.charAt(0).toUpperCase() + x.basis.slice(1)) + '.</p>' : '') + '</div>';
    var btn = row.firstChild;
    btn.addEventListener('click', function () {
      var openNow = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', openNow ? 'true' : 'false');
      row.querySelector('.mn-nrow__more').hidden = !openNow;
    });
    e.row = row;
    e.text = norm(x.name + ' ' + (x.ingredients || []).join(' ') + ' ' + (x.detail || '') + ' ' + e.label);
    table.appendChild(row);
  });
  var nCat = 'all', nText = '', nFree = '';
  var nf = $('[data-nfilter]');
  NCATS.forEach(function (c) {
    var b = h('button', { class: 'mn-chip', type: 'button', 'aria-pressed': c.id === 'all' ? 'true' : 'false' }, esc(c.label));
    b.addEventListener('click', function () { nCat = c.id; $$('.mn-chip', nf).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); }); filterN(); });
    nf.appendChild(b);
  });
  var sel = $('[data-nfree]');
  D.allergens.filter(function (a) { return !a.parent; }).forEach(function (a) {
    sel.appendChild(h('option', { value: a.code }, esc(a.code + ' · ' + a.name.replace(/ und daraus gewonnene Erzeugnisse| sowie daraus hergestellte Erzeugnisse| sowie Erzeugnisse daraus| und Krebstiererzeugnisse| und Fischerzeugnisse| und Weichtiererzeugnisse/g, '').replace(/ in einer Konzentration.*$/, ''))));
  });
  sel.addEventListener('change', function () { nFree = sel.value; filterN(); });
  var timer;
  $('[data-nsearch]').addEventListener('input', function (ev) { clearTimeout(timer); timer = setTimeout(function () { nText = norm(ev.target.value.trim()); filterN(); }, 120); });
  var countEl = $('[data-ncount]');
  function filterN() {
    var n = 0;
    entries.forEach(function (e) {
      var codes = e.x.codes || [];
      // "without" an allergen, by its marking: d excludes d1–d6, j excludes j1–j9; unmarked (exempt) teas stay
      var hasIt = nFree && codes.some(function (c) { return c === nFree || (c.charAt(0) === nFree && /^[dj]$/.test(nFree)); });
      var show = (nCat === 'all' || e.cat === nCat) && (!nText || e.text.indexOf(nText) > -1) && !hasIt;
      e.row.hidden = !show; if (show) n++;
    });
    countEl.textContent = n + (n === 1 ? ' Eintrag' : ' Einträge') + (nFree ? ' ohne gekennzeichnetes Allergen „' + nFree + '“' : '');
  }
  filterN();

  // legend
  $('[data-legend]').innerHTML = '<div><h3>Allergene</h3><ul>' + D.allergens.map(function (a) { return '<li><b>' + a.code + '</b> ' + esc(a.name) + '</li>'; }).join('') + '</ul></div>' +
    '<div><h3>Zusatzstoffe</h3><ul>' + D.additives.map(function (a) { return '<li><b>' + a.code + '</b> ' + esc(a.name) + '</li>'; }).join('') + '</ul><p class="mn-fine" style="margin-top:16px">** ' + esc(D.meta.starNote) + '</p></div>';

  // ---------- entrances (once, as things come into view) and a little depth in the hero ----------
  var revealables = $$('[data-reveal], .mn-h2, .mn-hero__title, .mn-island');
  if (reduce || !('IntersectionObserver' in window)) revealables.forEach(function (e) { e.classList.add('is-in'); });
  else {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (e) { rio.observe(e); });
  }
  if (M.gsap && !reduce) {
    gsap.utils.toArray('.mn-island, .mn-leaf').forEach(function (el) {
      var k = parseFloat(el.dataset.depth) || 0.4;
      gsap.fromTo(el, { y: 0 }, { y: -60 * k, ease: 'none', scrollTrigger: { trigger: '.mn-hero', start: 'top top', end: 'bottom top', scrub: 0.6 } });
    });
  }
})();
