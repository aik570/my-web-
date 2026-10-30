// Preisrechner (/reparatur-finden/): Gerät → Reparatur → Ergebnis.
// State lives in the address hash so every step is a history entry and can be
// linked: #apple, #apple--iphone-13, #apple--iphone-13--akku
// (option keys as on the model pages, e.g. display-originalqualitaet).
(function () {
  'use strict';

  var root = document.querySelector('[data-finder]');
  var dataEl = document.getElementById('finder-data');
  if (!root || !dataEl) return;

  var D = JSON.parse(dataEl.textContent);
  var $ = function (id) { return document.getElementById(id); };
  var typeOf = {};
  D.types.forEach(function (t) { typeOf[t.id] = t; });
  var unverified = D.isDemo || D.status !== 'verified';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var brands = null;          // from /preise/katalog.json
  var state = { brand: null, model: null, key: null, cat: '', extras: {} };

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var euro = function (n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
  };
  // Same keys as the model offer pages (Eleventy slugify of the label)
  var slug = function (s) {
    return String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  // katalog.json rows: [type, label, price|null, from, note]
  var row = function (a) {
    return { service: a[0], label: a[1], price: a[2], from: !!a[3], note: a[4], key: a[1] ? slug(a[1]) : a[0] };
  };
  var name = function (r) { return r.label || (typeOf[r.service] || {}).label || r.service; };
  var tier = function (r) { var m = /–\s*(.+)$/.exec(r.label || ''); return m ? m[1] : name(r); };
  var priceText = function (r) { return r.price === null ? 'Preis auf Anfrage' : (r.from ? 'ab ' : '') + euro(r.price); };
  var call = '<a href="tel:' + esc(D.phone.dial) + '">' + esc(D.phone.display) + '</a>';

  function findBrand(s) { return (brands || []).filter(function (b) { return b.slug === s; })[0]; }
  function findModel(b, s) { return b && b.models.filter(function (m) { return m.slug === s; })[0]; }
  function repairsOf(m) { return m.repairs.map(row).filter(function (r) { return r.service !== 'zubehoer'; }); }
  function extrasOf(m) { return m.repairs.map(row).filter(function (r) { return r.service === 'zubehoer'; }); }
  // one card per repair type; display can have several part qualities
  function groupsOf(m) {
    var g = [], by = {};
    repairsOf(m).forEach(function (r) {
      if (!by[r.service]) { by[r.service] = { service: r.service, options: [] }; g.push(by[r.service]); }
      by[r.service].options.push(r);
    });
    return g;
  }

  // ------------------------------------------------------------------ hash state
  function hashFor(b, m, key) { return '#' + [b, m, key].filter(Boolean).join('--'); }
  function go(b, m, key) {
    var h = hashFor(b, m, key);
    if (location.hash === h) render(); else location.hash = h;   // each step is a history entry
  }
  function fromHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split('--');
    state.brand = parts[0] || null; state.model = parts[1] || null; state.key = parts[2] || null;
  }

  // ------------------------------------------------------------------ loading
  function load() {
    $('f-status').textContent = 'Preise werden geladen …';
    return fetch(D.catalogue).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    }).then(function (cat) {
      brands = cat.brands;
      $('f-status').textContent = '';
      root.classList.add('is-ready');
    }, function () {
      $('f-status').innerHTML = 'Die Preise konnten nicht geladen werden. Rufen Sie an, wir nennen Ihnen den Preis sofort: ' + call +
        ' – oder öffnen Sie die <a href="/preise/">Preisliste</a>.';
      root.classList.add('is-failed');
      throw new Error('catalogue');
    });
  }

  // ------------------------------------------------------------------ rendering
  function showStep(n) {
    [1, 2, 3].forEach(function (i) {
      var el = $('f-step' + i);
      var on = i === n;
      if (on && el.hidden) {
        el.hidden = false;
        if (!reduce) { el.classList.remove('is-in'); void el.offsetWidth; el.classList.add('is-in'); }
      } else if (!on) el.hidden = true;
    });
    root.querySelectorAll('.finder__progress button').forEach(function (b) {
      var i = +b.getAttribute('data-goto');
      if (i === n) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    root.setAttribute('data-step', n);
  }

  function setProgress(b, m, r) {
    var btn = function (i) { return root.querySelector('.finder__progress [data-goto="' + i + '"]'); };
    $('f-search').value = $('f-search').value;  // keep typed text
    root.querySelector('[data-progress="1"]').textContent = m ? b.brand + ' ' + m.name : (b ? b.brand : 'noch offen');
    root.querySelector('[data-progress="2"]').textContent = r ? name(r) : 'noch offen';
    root.querySelector('[data-progress="3"]').textContent = r ? (r.price === null ? 'auf Anfrage' : euro(r.price)) : ' ';
    btn(2).disabled = !m;
    btn(3).disabled = !r;
  }

  // Photo of the exact model (modelImages.json "models"), else the first family rule whose brand and
  // pattern match (labelled "Symbolbild"); never a picture of another model generation
  function imageFor(b, m) {
    var exact = (D.photos || {})[b.slug + '/' + m.slug];
    if (exact) return exact;
    return (D.images || []).filter(function (x) {
      try { return x.brand === b.slug && new RegExp(x.pattern, 'i').test(m.name); } catch (e) { return false; }
    })[0];
  }

  // Before a repair is chosen: the model's photo. After: the drawing with the part in red.
  function device(b, m, r) {
    var svg = root.querySelector('.fdevice__svg'), img = $('f-device-photo'), note = $('f-device-note');
    svg.setAttribute('data-cat', (m && m.category) || 'Smartphone');
    svg.setAttribute('data-part', r ? r.service : '');
    var pic = m && imageFor(b, m), show = !!pic && !r;
    if (pic && img.getAttribute('src') !== pic.image) { img.src = pic.image; img.alt = pic.exact ? 'Foto: ' + b.brand + ' ' + m.name : pic.label; }
    if (!pic) { img.removeAttribute('src'); img.alt = ''; }
    img.hidden = !show;
    svg.style.display = show ? 'none' : '';
    root.querySelector('.fdevice').toggleAttribute('data-model', !!m);
    root.querySelector('.fdevice').toggleAttribute('data-photo', show);
    if (show && pic.exact) {
      note.innerHTML = 'Foto: ' + esc(pic.author) + ', <a href="' + esc(pic.licenseUrl) + '" target="_blank" rel="noopener">' + esc(pic.license) + '</a>, ' +
        '<a href="' + esc(pic.source) + '" target="_blank" rel="noopener">Wikimedia Commons</a>';
    } else note.textContent = show ? pic.label + ' – nicht das exakte Modell' : (m ? 'Schematische Darstellung' : '');
    $('f-device-name').textContent = m ? b.brand + ' ' + m.name : (b ? b.brand : 'Kein Gerät gewählt');
    $('f-device-part').textContent = r ? name(r) : '';
  }

  function renderBrands(b) {
    root.querySelectorAll('.fbrand').forEach(function (el) {
      el.setAttribute('aria-pressed', b && el.getAttribute('data-brand') === b.slug ? 'true' : 'false');
    });
    var box = $('f-models');
    if (!b) { box.hidden = true; return; }
    box.hidden = false;
    var cats = [];
    b.models.forEach(function (m) { if (m.category && cats.indexOf(m.category) < 0) cats.push(m.category); });
    if (cats.indexOf(state.cat) < 0) state.cat = '';
    $('f-cats').innerHTML = cats.length > 1 ? ['<button type="button" class="chip" data-cat="" aria-pressed="' + (!state.cat) + '">Alle</button>']
      .concat(cats.map(function (c) { return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (state.cat === c) + '">' + esc(c) + '</button>'; })).join('') : '';
    renderModels(b);
  }

  function renderModels(b) {
    var q = $('f-filter').value.trim().toLowerCase();
    var list = b.models.filter(function (m) {
      return (!state.cat || m.category === state.cat) && (!q || m.name.toLowerCase().indexOf(q) >= 0);
    });
    $('f-model-list').innerHTML = list.map(function (m) {
      return '<li><button type="button" class="fmodel" data-model="' + esc(m.slug) + '"' + (state.model === m.slug ? ' aria-pressed="true"' : '') + '>' +
        esc(m.name) + '<small>' + esc(m.category || '') + '</small></button></li>';
    }).join('');
    $('f-models-none').hidden = list.length > 0;
  }

  function renderRepairs(b, m) {
    $('f-model-name').textContent = b.brand + ' ' + m.name;
    var groups = groupsOf(m);
    $('f-repairs-none').hidden = groups.length > 0;
    $('f-repairs').innerHTML = groups.map(function (g) {
      var t = typeOf[g.service] || {};
      var first = g.options[0];
      var prices = g.options.length > 1
        ? g.options.map(function (o) { return '<span>' + esc(tier(o)) + ': <b>' + esc(priceText(o)) + '</b></span>'; }).join('')
        : '<b' + (first.price === null ? ' class="is-request"' : '') + '>' + esc(priceText(first)) + '</b>';
      var chosen = g.options.some(function (o) { return o.key === state.key; });
      return '<li><button type="button" class="frepair" data-key="' + esc(first.key) + '" data-service="' + esc(g.service) + '"' + (chosen ? ' aria-pressed="true"' : '') + '>' +
        '<span class="frepair__name">' + esc(t.label || g.service) + '</span>' +
        '<span class="frepair__price">' + prices + '</span>' +
        (t.duration ? '<span class="frepair__meta">Dauer: ' + esc(t.duration) + '</span>' : '') +
        (first.note ? '<span class="frepair__meta">' + esc(first.note) + '</span>' : '') +
        '</button></li>';
    }).join('');
  }

  function renderResult(b, m, r) {
    var group = groupsOf(m).filter(function (g) { return g.service === r.service; })[0];
    $('r-device').textContent = b.brand + ' ' + m.name;
    $('r-repair').textContent = (typeOf[r.service] || {}).label || name(r);
    // part quality only where the catalogue has more than one option
    $('r-quality').hidden = group.options.length < 2;
    $('r-quality-options').innerHTML = group.options.map(function (o) {
      return '<label><input type="radio" name="r-quality" value="' + esc(o.key) + '"' + (o.key === r.key ? ' checked' : '') + '><span>' + esc(tier(o)) + '<small>' + esc(priceText(o)) + '</small></span></label>';
    }).join('');
    var extras = extrasOf(m);
    $('r-extras').hidden = !extras.length;
    $('r-extras-list').innerHTML = extras.map(function (x) {
      return '<li><label class="extra"><input type="checkbox" value="' + esc(x.key) + '"' + (state.extras[x.key] ? ' checked' : '') + '>' +
        '<span class="extra__box" aria-hidden="true"></span><span class="repair__name">' + esc(x.label) + (x.note ? '<small>' + esc(x.note) + '</small>' : '') + '</span>' +
        '<span class="extra__price">' + esc(priceText(x)) + '</span></label></li>';
    }).join('');
    total(b, m, r);
    $('r-offer').href = '/preise/' + b.slug + '/' + m.slug + '/#' + r.key;
    $('r-offer').textContent = 'Alle Preise für ' + m.name;
  }

  function total(b, m, r) {
    var picked = extrasOf(m).filter(function (x) { return state.extras[x.key]; });
    var request = r.price === null || picked.some(function (x) { return x.price === null; });
    var sum = r.price === null ? 0 : r.price;
    picked.forEach(function (x) { if (x.price !== null) sum += x.price; });
    $('r-total').textContent = request ? 'Preis auf Anfrage' : (r.from ? 'ab ' : '') + euro(sum);
    $('r-request').hidden = !request;
    var t = typeOf[r.service] || {}, facts = [];
    if (t.duration) facts.push('Dauer: ' + t.duration);
    if (t.warranty) facts.push(/^ohne/i.test(t.warranty) ? t.warranty : 'Garantie: ' + t.warranty);
    if (unverified && !request) facts.push('Preis in Prüfung – verbindlich ist der Preis, den wir vor der Reparatur nennen');
    $('r-facts').hidden = !facts.length;
    $('r-facts').textContent = facts.join(' · ');
    var lines = [b.brand + ' ' + m.name + ' – ' + name(r) + ' (' + priceText(r) + ')'];
    picked.forEach(function (x) { lines.push('+ ' + x.label + ' (' + priceText(x) + ')'); });
    if (picked.length && !request) lines.push('Gesamt: ' + euro(sum));
    var text = 'Hallo,\n\nich interessiere mich für folgende Reparatur:\n' + lines.join('\n') + '\n\nViele Grüße\n';
    $('r-mail').href = 'mailto:' + D.email + '?subject=' + encodeURIComponent('Reparaturanfrage: ' + b.brand + ' ' + m.name + ' – ' + name(r)) + '&body=' + encodeURIComponent(text);
    if ($('r-wa')) $('r-wa').href = 'https://wa.me/' + D.whatsapp.replace('+', '') + '?text=' + encodeURIComponent(text);
    root.querySelector('[data-progress="3"]').textContent = request ? 'auf Anfrage' : euro(sum);
  }

  var lastStep = 0;
  function render() {
    fromHash();
    if (!brands) return;
    var b = findBrand(state.brand);
    var m = findModel(b, state.model);
    var r = m && repairsOf(m).filter(function (x) { return x.key === state.key; })[0];
    if (state.brand && !b) $('f-status').textContent = 'Diesen Hersteller führen wir nicht im Preisrechner. Rufen Sie an: ' + D.phone.display + '.';
    else if (state.model && !m) $('f-status').textContent = 'Dieses Modell ist nicht in der Preisliste. Wählen Sie Ihr Gerät unten aus oder rufen Sie an: ' + D.phone.display + '.';
    else if (state.key && m && !r) $('f-status').textContent = 'Diese Reparatur gibt es für das Modell nicht. Bitte wählen Sie eine der folgenden.';
    else $('f-status').textContent = '';
    if (m && m.slug !== (render.model || '')) state.extras = {};
    render.model = m ? m.slug : '';

    setProgress(b, m, r);
    device(b, m, r);
    renderBrands(b);
    var step = r ? 3 : m ? 2 : 1;
    if (m) renderRepairs(b, m);
    if (r) renderResult(b, m, r);
    showStep(step);
    if (lastStep && step !== lastStep) {
      var h = $('f-step' + step).querySelector('.fstep__h');
      h.focus({ preventScroll: true });
      var top = root.getBoundingClientRect().top + scrollY - 70;
      if (scrollY > top) scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
    lastStep = step;
  }

  // ------------------------------------------------------------------ search
  var hits = [], active = -1;
  function search() {
    var q = $('f-search').value.trim().toLowerCase();
    var list = $('f-hits');
    if (!brands || q.length < 2) { list.hidden = true; $('f-search').setAttribute('aria-expanded', 'false'); return; }
    hits = [];
    brands.forEach(function (b) {
      b.models.forEach(function (m) {
        var full = (b.brand + ' ' + m.name).toLowerCase();
        var n = m.name.toLowerCase();
        // rank: exact name, then names starting with the query, then the rest
        if (full.indexOf(q) >= 0 || n.indexOf(q) >= 0) hits.push([b, m, n === q || full === q ? 2 : (full.indexOf(q) === 0 || n.indexOf(q) === 0 ? 1 : 0)]);
      });
    });
    hits.sort(function (a, c) { return (c[2] - a[2]); });
    hits = hits.slice(0, 8);
    active = -1;   // nothing highlighted until the arrow keys are used; Enter takes the first hit
    list.innerHTML = hits.length ? hits.map(function (h, i) {
      return '<li role="option" id="f-hit-' + i + '" data-i="' + i + '" aria-selected="false">' + esc(h[0].brand) + ' <b>' + esc(h[1].name) + '</b><small>' + esc(h[1].category || '') + '</small></li>';
    }).join('') : '<li class="fsearch__none">Kein Modell gefunden. Rufen Sie an: ' + esc(D.phone.display) + '</li>';
    list.hidden = false;
    $('f-search').setAttribute('aria-expanded', 'true');
    $('f-search').setAttribute('aria-activedescendant', '');
  }
  function pick(i) {
    var h = hits[i];
    if (!h) return;
    $('f-hits').hidden = true;
    $('f-search').setAttribute('aria-expanded', 'false');
    go(h[0].slug, h[1].slug);
  }
  function mark(i) {
    active = i;
    [].forEach.call($('f-hits').children, function (li, j) { li.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    $('f-search').setAttribute('aria-activedescendant', i >= 0 ? 'f-hit-' + i : '');
  }

  // ------------------------------------------------------------------ events
  root.addEventListener('click', function (e) {
    var t = e.target.closest('button, li[role="option"]');
    if (!t || !root.contains(t)) return;
    if (t.matches('[data-goto]')) {
      var n = +t.getAttribute('data-goto');
      if (n === 1) go(state.brand);
      if (n === 2) go(state.brand, state.model);
      if (n === 3 && state.key) go(state.brand, state.model, state.key);
    } else if (t.matches('.fbrand')) {
      var s = t.getAttribute('data-brand');
      $('f-filter').value = '';
      go(s === state.brand && !state.model ? null : s);
    } else if (t.matches('.chip[data-cat]')) {
      state.cat = t.getAttribute('data-cat');
      renderBrands(findBrand(state.brand));
    } else if (t.matches('.fmodel')) {
      go(state.brand, t.getAttribute('data-model'));
    } else if (t.matches('.frepair')) {
      go(state.brand, state.model, t.getAttribute('data-key'));
    } else if (t.matches('li[role="option"]')) {
      pick(+t.getAttribute('data-i'));
    }
  });
  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'r-quality') {
      // switch part quality without adding a history entry
      history.replaceState(null, '', hashFor(state.brand, state.model, t.value));
      render();
    } else if (t.closest('#r-extras-list')) {
      state.extras[t.value] = t.checked;
      var b = findBrand(state.brand), m = findModel(b, state.model);
      total(b, m, repairsOf(m).filter(function (x) { return x.key === state.key; })[0]);
    }
  });
  $('f-filter').addEventListener('input', function () { renderModels(findBrand(state.brand)); });
  $('f-search').addEventListener('input', search);
  $('f-search').addEventListener('keydown', function (e) {
    if ($('f-hits').hidden || !hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); mark(active + 1 >= hits.length ? 0 : active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mark(active <= 0 ? hits.length - 1 : active - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(active < 0 ? 0 : active); }
    else if (e.key === 'Escape') { $('f-hits').hidden = true; $('f-search').setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.fsearch')) { $('f-hits').hidden = true; $('f-search').setAttribute('aria-expanded', 'false'); }
  });
  addEventListener('hashchange', render);

  load().then(render, function () {});
})();
