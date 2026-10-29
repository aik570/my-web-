// Model offer page: repair + optional accessories → total, enquiry links.
// #akku (or the old site's ?service=Akkuwechsel) preselects a repair.
(function () {
  'use strict';

  var form = document.querySelector('[data-offer]');
  var dataEl = document.getElementById('offer-data');
  if (!form || !dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var model = form.getAttribute('data-model');
  var radios = [].slice.call(form.querySelectorAll('input[name="repair"]'));
  var extras = [].slice.call(form.querySelectorAll('input[name="extra"]'));
  var $ = function (id) { return document.getElementById(id); };
  var typeOf = {};
  D.types.forEach(function (t) { typeOf[t.id] = t; });
  if (!radios.length) return;

  // Repair names used in links from the previous website (/reparatur/...?service=…)
  var OLD = {
    'display reparatur': 'display', 'akkuwechsel': 'akku', 'backcover reparatur': 'backcover',
    'ladebuchse reparatur': 'ladebuchse', 'hauptkamera reparatur': 'hauptkamera', 'frontkamera reparatur': 'frontkamera',
    'lautsprecher reparatur': 'lautsprecher', 'wifi & bluetooth': 'wifi-bluetooth', 'wasserschaden': 'wasserschaden',
    'fehleranalyse': 'fehleranalyse', 'panzerglas': 'panzerglas'
  };

  var euro = function (n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
  };
  var num = function (el) { var v = el.getAttribute('data-price'); return v === '' ? null : Number(v); };

  function update() {
    var r = radios.filter(function (x) { return x.checked; })[0] || radios[0];
    var rp = num(r);
    var label = r.getAttribute('data-label');
    var picked = extras.filter(function (x) { return x.checked; });
    var extraSum = 0, extraRequest = false;
    picked.forEach(function (x) { var p = num(x); if (p === null) extraRequest = true; else extraSum += p; });
    var request = rp === null || extraRequest;
    var from = r.getAttribute('data-from') === '1';

    $('sum-repair-label').textContent = label;
    $('sum-repair').textContent = rp === null ? 'auf Anfrage' : (from ? 'ab ' : '') + euro(rp);
    if ($('sum-extras')) $('sum-extras').textContent = extraRequest ? 'auf Anfrage' : euro(extraSum);
    $('sum-total').textContent = request ? 'auf Anfrage' : (from ? 'ab ' : '') + euro(rp + extraSum);
    $('sum-request').hidden = !request;
    $('sum-bar-total').textContent = $('sum-total').textContent;

    var t = typeOf[r.getAttribute('data-type')] || {};
    var facts = [];
    if (t.duration) facts.push('Dauer: ' + t.duration);
    if (t.warranty) facts.push('Garantie: ' + t.warranty);
    $('sum-facts').hidden = !facts.length;
    $('sum-facts').textContent = facts.join(' · ');

    var lines = [model + ' – ' + label + (rp === null ? ' (auf Anfrage)' : ' (' + euro(rp) + ')')];
    picked.forEach(function (x) { var p = num(x); lines.push('+ ' + x.getAttribute('data-label') + (p === null ? ' (auf Anfrage)' : ' (' + euro(p) + ')')); });
    if (picked.length && !request) lines.push('Gesamt: ' + euro(rp + extraSum));
    var text = 'Hallo,\n\nich interessiere mich für folgende Reparatur:\n' + lines.join('\n') + '\n\nViele Grüße\n';
    $('sum-mail').href = 'mailto:' + D.email + '?subject=' + encodeURIComponent('Reparaturanfrage: ' + model + ' – ' + label) + '&body=' + encodeURIComponent(text);
    if ($('sum-wa')) $('sum-wa').href = 'https://wa.me/' + D.whatsapp.replace('+', '') + '?text=' + encodeURIComponent(text);
    return r;
  }

  function select(type) {
    var hit = radios.filter(function (x) { return x.getAttribute('data-key') === type; })[0] ||
      radios.filter(function (x) { return x.getAttribute('data-type') === type; })[0];
    if (hit) { hit.checked = true; update(); }
    return !!hit;
  }

  function fromUrl() {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h && select(h)) return;
    var q = new URLSearchParams(location.search).get('service');
    if (q) select(OLD[q.toLowerCase()] || q.toLowerCase());
  }

  radios.forEach(function (x) {
    x.addEventListener('change', function () {
      update();
      // keep the choice in the address (shareable) without adding history entries
      if (history.replaceState) history.replaceState(null, '', '#' + x.getAttribute('data-key'));
    });
  });
  extras.forEach(function (x) { x.addEventListener('change', update); });
  addEventListener('hashchange', fromUrl);
  update();
  fromUrl();
})();
