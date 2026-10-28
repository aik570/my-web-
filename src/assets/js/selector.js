// Price selector: Hersteller → Modell → Reparatur → Preis.
// Reads the catalogue embedded at build time; no requests at runtime.
(function () {
  'use strict';

  var dataEl = document.getElementById('price-data');
  var brandSel = document.getElementById('sel-brand');
  if (!dataEl || !brandSel) return;

  var D = JSON.parse(dataEl.textContent);
  var modelSel = document.getElementById('sel-model');
  var search = document.getElementById('sel-search');
  var out = document.getElementById('sel-result');
  var demo = D.isDemo || !D.meta || D.meta.status !== 'verified';
  var typeLabel = {}, typeOf = {};
  D.types.forEach(function (t) { typeLabel[t.id] = t.label; typeOf[t.id] = t; });

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  };
  var euro = function (n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
  };
  var priceText = function (r) {
    if (r.onRequest) return 'auf Anfrage';
    return (r.from ? 'ab ' : '') + euro(r.price);
  };
  var repairName = function (r) { return r.label || typeLabel[r.service] || r.service; };
  // Duration and warranty come from the repair type (CMS); shown only when filled in.
  var facts = function (r) {
    var t = typeOf[r.service] || {};
    var f = [];
    if (t.duration) f.push('Dauer: ' + t.duration);
    if (t.warranty) f.push('Garantie: ' + t.warranty);
    return f.length ? '<p class="selector__hint">' + esc(f.join(' · ')) + '</p>' : '';
  };
  var callLink = function () { return '<a href="tel:' + esc(D.phone.dial) + '">' + esc(D.phone.display) + '</a>'; };
  var brandOf = function (name) { return D.brands.filter(function (b) { return b.brand === name; })[0]; };
  var modelOf = function (b, name) { return b && b.models.filter(function (m) { return m.name === name; })[0]; };

  function fillModels(b) {
    modelSel.innerHTML = '';
    var first = document.createElement('option');
    first.value = '';
    first.textContent = b ? 'Bitte wählen' : 'Erst Hersteller wählen';
    modelSel.appendChild(first);
    if (!b) { modelSel.disabled = true; return; }
    // group by device type when the list has more than one
    var groups = {};
    b.models.forEach(function (m) { (groups[m.category || ''] = groups[m.category || ''] || []).push(m); });
    var keys = Object.keys(groups);
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
    var rows = m.repairs.map(function (r, i) {
      return '<li><label class="repair"><input type="radio" name="repair" value="' + i + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span class="repair__name">' + esc(repairName(r)) + (r.note ? '<small>' + esc(r.note) + '</small>' : '') + '</span>' +
        '<span class="repair__price' + (r.onRequest ? ' is-request' : '') + '">' + esc(priceText(r)) +
        (demo && !r.onRequest ? '<small>Testwert</small>' : '') + '</span></label></li>';
    }).join('');
    out.innerHTML = '<div class="selector__model"><p class="selector__name"><span class="field__no">3</span>' + esc(b.brand + ' ' + m.name) + '</p>' +
      '<fieldset><legend class="sr">Reparatur wählen</legend><ul class="repairs">' + rows + '</ul></fieldset>' +
      '<p class="selector__hint">Ihre Reparatur ist nicht dabei? Rufen Sie an: ' + callLink() + '.</p></div>' +
      '<div id="sel-cta">' + enquiry(b, m, m.repairs[0]) + '</div>';
    out.querySelectorAll('input[name="repair"]').forEach(function (inp) {
      inp.addEventListener('change', function () {
        document.getElementById('sel-cta').innerHTML = enquiry(b, m, m.repairs[+inp.value]);
      });
    });
  }

  brandSel.addEventListener('change', function () { fillModels(brandOf(brandSel.value)); render(); });
  modelSel.addEventListener('change', render);

  // Free-text search: "Apple iPhone 13" or just "iPhone 13" selects brand and model.
  if (search) {
    search.addEventListener('change', function () {
      var q = search.value.trim().toLowerCase();
      if (!q) return;
      var hit = null;
      D.brands.some(function (b) {
        return b.models.some(function (m) {
          var full = (b.brand + ' ' + m.name).toLowerCase();
          if (full === q || m.name.toLowerCase() === q) { hit = [b, m]; return true; }
          return false;
        });
      });
      if (!hit) {
        D.brands.some(function (b) {
          return b.models.some(function (m) {
            if ((b.brand + ' ' + m.name).toLowerCase().indexOf(q) >= 0) { hit = [b, m]; return true; }
            return false;
          });
        });
      }
      if (!hit) {
        out.innerHTML = '<p class="selector__empty">Kein Modell zu „' + esc(search.value) + '" gefunden. Rufen Sie an, wir helfen Ihnen weiter: ' + callLink() + '.</p>';
        return;
      }
      brandSel.value = hit[0].brand;
      fillModels(hit[0]);
      modelSel.value = hit[1].name;
      render();
    });
  }
})();
