// Price selector: Hersteller → Modell → Reparatur → Preis.
// Brands are in the HTML; the catalogue (/preise/katalog.json, same origin)
// loads when the selector comes near the viewport or is used.
(function () {
  'use strict';

  var dataEl = document.getElementById('price-data');
  var brandSel = document.getElementById('sel-brand');
  if (!dataEl || !brandSel) return;

  var D = JSON.parse(dataEl.textContent);
  var root = brandSel.closest('[data-selector]');
  var modelSel = document.getElementById('sel-model');
  var search = document.getElementById('sel-search');
  var list = document.getElementById('sel-models');
  var out = document.getElementById('sel-result');
  var demo = D.isDemo || !D.meta || D.meta.status !== 'verified';
  var typeOf = {};
  D.types.forEach(function (t) { typeOf[t.id] = t; });
  var brands = null;
  var loading = null;

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var euro = function (n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
  };
  // Repair rows from katalog.json: [type, label, price|null, from, note]
  var repair = function (a) { return { service: a[0], label: a[1], price: a[2], from: a[3], note: a[4], onRequest: a[2] === null }; };
  var priceText = function (r) {
    if (r.onRequest) return 'auf Anfrage';
    return (r.from ? 'ab ' : '') + euro(r.price);
  };
  var repairName = function (r) { return r.label || (typeOf[r.service] || {}).label || r.service; };
  // Duration and warranty come from the repair type (CMS); shown only when filled in.
  var facts = function (r) {
    var t = typeOf[r.service] || {};
    var f = [];
    if (t.duration) f.push('Dauer: ' + t.duration);
    if (t.warranty) f.push('Garantie: ' + t.warranty);
    return f.length ? '<p class="selector__hint">' + esc(f.join(' · ')) + '</p>' : '';
  };
  // Same key as the model offer page uses for #… (Eleventy slugify of the label).
  var keyOf = function (r) {
    if (!r.label) return r.service;
    return r.label.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };
  var callLink = function () { return '<a href="tel:' + esc(D.phone.dial) + '">' + esc(D.phone.display) + '</a>'; };
  var brandOf = function (name) { return (brands || []).filter(function (b) { return b.brand === name; })[0]; };
  var modelOf = function (b, name) { return b && b.models.filter(function (m) { return m.name === name; })[0]; };

  function load() {
    if (!loading) {
      loading = fetch(D.catalogue).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      }).then(function (cat) {
        brands = cat.brands;
        var frag = document.createDocumentFragment();
        brands.forEach(function (b) {
          b.models.forEach(function (m) {
            var o = document.createElement('option');
            o.value = b.brand + ' ' + m.name;
            frag.appendChild(o);
          });
        });
        if (list) list.appendChild(frag);
      }).catch(function () {
        loading = null;
        out.innerHTML = '<p class="selector__empty">Die Preise konnten nicht geladen werden. Rufen Sie an, wir nennen Ihnen den Preis: ' + callLink() + '.</p>';
        throw new Error('catalogue');
      });
    }
    return loading;
  }

  function fillModels(b) {
    modelSel.innerHTML = '';
    var first = document.createElement('option');
    first.value = '';
    first.textContent = b ? 'Bitte wählen' : 'Erst Hersteller wählen';
    modelSel.appendChild(first);
    if (!b) { modelSel.disabled = true; return; }
    // group by device type when the list has more than one
    var groups = {};
    var keys = [];
    b.models.forEach(function (m) {
      var k = m.category || '';
      if (!groups[k]) { groups[k] = []; keys.push(k); }
      groups[k].push(m);
    });
    keys.forEach(function (k) {
      var parent = modelSel;
      if (keys.length > 1 && k) { parent = document.createElement('optgroup'); parent.label = k; modelSel.appendChild(parent); }
      groups[k].forEach(function (m) {
        var o = document.createElement('option');
        o.value = m.name; o.textContent = m.name;
        parent.appendChild(o);
      });
    });
    modelSel.disabled = false;
  }

  function enquiry(b, m, r) {
    var what = b.brand + ' ' + m.name + ' – ' + repairName(r) + (r.onRequest ? '' : ' (' + priceText(r) + ')');
    var links = '<a class="btn btn--primary" href="tel:' + esc(D.phone.dial) + '">Jetzt anrufen</a>';
    if (D.whatsapp) {
      links += '<a class="btn btn--quiet" target="_blank" rel="noopener" href="https://wa.me/' + esc(D.whatsapp.replace('+', '')) +
        '?text=' + encodeURIComponent('Hallo, ich interessiere mich für eine Reparatur: ' + what) + '">WhatsApp</a>';
    }
    links += '<a class="btn btn--quiet" href="mailto:' + esc(D.email) + '?subject=' + encodeURIComponent('Reparaturanfrage: ' + what) +
      '&body=' + encodeURIComponent('Hallo,\n\nich interessiere mich für folgende Reparatur:\n' + what + '\n\nViele Grüße\n') + '">E-Mail</a>';
    return '<div class="selector__cta"><p><span>Ausgewählt</span>' + esc(what) + '</p>' + facts(r) +
      (r.onRequest ? '<p class="selector__hint">Für diese Reparatur gibt es keinen festen Preis. Fragen Sie an, wir nennen ihn nach kurzer Prüfung.</p>' : '') +
      '<div class="actions">' + links + '</div>' +
      '<a class="link-arrow" href="/preise/' + b.slug + '/' + m.slug + '/#' + esc(keyOf(r)) + '">Zum Reparaturangebot</a>' +
      '<p class="selector__hint">' + esc(D.meta && D.meta.vatNote ? D.meta.vatNote + ' · ' : '') + 'Den Preis bestätigen wir Ihnen vor der Reparatur.</p></div>';
  }

  function render() {
    var b = brandOf(brandSel.value);
    var m = modelOf(b, modelSel.value);
    if (!m) {
      out.innerHTML = '<p class="selector__empty"><span class="field__no">3</span>' +
        (b ? 'Jetzt das Modell wählen.' : 'Wählen Sie Hersteller und Modell. Dann sehen Sie alle Reparaturen mit Preis.') + '</p>';
      return;
    }
    if (!m.repairs.length) {
      out.innerHTML = '<p class="selector__empty"><span class="field__no">3</span>Für ' + esc(b.brand + ' ' + m.name) +
        ' ist noch kein Preis hinterlegt. Rufen Sie an, wir nennen Ihnen den Preis: ' + callLink() + '.</p>';
      return;
    }
    var repairs = m.repairs.map(repair);
    var rows = repairs.map(function (r, i) {
      return '<li><label class="repair"><input type="radio" name="repair" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="repair__name">' + esc(repairName(r)) + (r.note ? '<small>' + esc(r.note) + '</small>' : '') + '</span>' +
        '<span class="repair__price' + (r.onRequest ? ' is-request' : '') + '">' + esc(priceText(r)) +
        (demo && !r.onRequest ? '<small>' + (D.isDemo ? 'Testwert' : 'in Prüfung') + '</small>' : '') + '</span></label></li>';
    }).join('');
    out.innerHTML = '<div class="selector__model"><p class="selector__name"><span class="field__no">3</span>' + esc(b.brand + ' ' + m.name) + '</p>' +
      '<fieldset><legend class="sr">Reparatur wählen</legend><ul class="repairs">' + rows + '</ul></fieldset>' +
      '<p class="selector__hint">Ihre Reparatur ist nicht dabei? Rufen Sie an: ' + callLink() + '.</p></div>' +
      '<div id="sel-cta">' + enquiry(b, m, repairs[0]) + '</div>';
    out.querySelectorAll('input[name="repair"]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        document.getElementById('sel-cta').innerHTML = enquiry(b, m, repairs[+inp.value]);
      });
    });
  }

  function find(q) {
    var hit = null;
    var match = function (test) {
      brands.some(function (b) {
        return b.models.some(function (m) {
          if (test(b, m, (b.brand + ' ' + m.name).toLowerCase())) { hit = [b, m]; return true; }
          return false;
        });
      });
    };
    match(function (b, m, full) { return full === q || m.name.toLowerCase() === q; });
    if (!hit) match(function (b, m, full) { return full.indexOf(q) >= 0; });
    return hit;
  }

  brandSel.addEventListener('change', function () {
    load().then(function () { fillModels(brandOf(brandSel.value)); render(); }, function () {});
  });
  modelSel.addEventListener('change', render);

  // Free-text search: "Apple iPhone 13" or just "iPhone 13" selects brand and model.
  if (search) {
    search.addEventListener('change', function () {
      var raw = search.value.trim();
      if (!raw) return;
      load().then(function () {
        var hit = find(raw.toLowerCase());
        if (!hit) {
          out.innerHTML = '<p class="selector__empty">Kein Modell zu „' + esc(raw) + '" gefunden. Rufen Sie an, wir helfen Ihnen weiter: ' + callLink() + '.</p>';
          return;
        }
        brandSel.value = hit[0].brand;
        fillModels(hit[0]);
        modelSel.value = hit[1].name;
        render();
      }, function () {});
    });
  }

  // Start loading early enough that the first choice feels instant.
  var start = function () { load().catch(function () {}); };
  ['focusin', 'pointerdown', 'touchstart'].forEach(function (ev) { root.addEventListener(ev, start, { once: true, passive: true }); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
    }, { rootMargin: '600px 0px' });
    io.observe(root);
  }
})();
