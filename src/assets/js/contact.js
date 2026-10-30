// Contact block: tabs for the ways to reach the shop, and a letter that checks
// itself while it is written. Sending folds the letter into an envelope and
// opens the visitor's e-mail program with the message addressed to the shop.
// Nothing is sent or stored by the website itself.
(function () {
  'use strict';

  var reduced = document.documentElement.classList.contains('reduced');

  /* ---------- tabs (WAI-ARIA tabs pattern: arrows, Home, End) ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.ctab'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
    // the doctor beside the box changes with the tab
    var key = tab.id.replace('ct-', '');
    if (key === 'wa') key = 'anruf';
    [].forEach.call(document.querySelectorAll('.contact__doc picture'), function (pic) {
      pic.classList.toggle('is-on', pic.classList.contains('contact__doc-' + key));
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (j === undefined) return;
      e.preventDefault();
      select(tabs[(j + tabs.length) % tabs.length], true);
    });
  });

  /* ---------- the letter ---------- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var err = document.getElementById('cf-error');
  var ready = document.getElementById('cf-ready');
  var f = function (n) { return form.elements[n]; };
  var hint = function (k) { return form.querySelector('[data-hint="' + k + '"]'); };
  var touched = {};

  // live hints: what is still missing, ticked once a field is fine
  function hints() {
    var msg = f('nachricht').value.trim().length, name = f('name').value.trim(), tel = f('telefon').value.trim();
    var okMsg = msg >= 10, okName = !!name, okTel = !tel || f('telefon').checkValidity();
    set('msg', okMsg, okMsg ? msg + ' Zeichen' : (msg ? 'Noch ' + (10 - msg) + ' Zeichen' : 'Mindestens 10 Zeichen'), touched.nachricht && !okMsg);
    set('name', okName, okName ? 'Danke, ' + name.split(/\s+/)[0] : 'Damit wir Sie ansprechen können', touched.name && !okName);
    set('phone', !!tel && okTel, !tel ? 'Ziffern, Leerzeichen, + ( ) / -' : okTel ? 'Wir können Sie zurückrufen' : 'Bitte nur Ziffern, Leerzeichen, + ( ) / -', !okTel);
    ready.textContent = okMsg && okName && okTel ? 'Ihr Brief ist bereit.' : '';
    return okMsg && okName && okTel;
  }
  function set(k, ok, text, bad) {
    var el = hint(k);
    el.textContent = text;
    el.classList.toggle('is-ok', ok);
    el.classList.toggle('is-bad', !!bad);
  }
  ['nachricht', 'name', 'telefon'].forEach(function (n) {
    f(n).addEventListener('input', hints);
    f(n).addEventListener('blur', function () { touched[n] = true; hints(); });
  });

  function check() {
    var problems = [];
    if (!f('name').value.trim()) problems.push([f('name'), 'Bitte geben Sie Ihren Namen an.']);
    if (f('telefon').value.trim() && !f('telefon').checkValidity()) problems.push([f('telefon'), 'Die Mobilnummer enthält ungültige Zeichen.']);
    if (f('nachricht').value.trim().length < 10) problems.push([f('nachricht'), 'Bitte beschreiben Sie Ihr Anliegen in mindestens 10 Zeichen.']);
    [f('name'), f('telefon'), f('nachricht')].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    problems.forEach(function (p) { p[0].setAttribute('aria-invalid', 'true'); });
    err.hidden = !problems.length;
    err.textContent = problems.map(function (p) { return p[1]; }).join(' ');
    touched = { nachricht: true, name: true, telefon: true };
    hints();
    if (problems.length) problems[0][0].focus();
    return !problems.length;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check()) return;
    var name = f('name').value.trim();
    var phone = f('telefon').value.trim();
    var body = f('nachricht').value.trim() + '\n\nMit freundlichen Grüßen\n' + name + (phone ? '\nMobil: ' + phone : '') + '\n';
    var url = 'mailto:' + form.getAttribute('data-email') +
      '?subject=' + encodeURIComponent('Anfrage über die Website von ' + name) +
      '&body=' + encodeURIComponent(body);
    form.dispatchEvent(new CustomEvent('contact:mailto', { detail: url }));   // used by the interaction test
    if (reduced) { location.href = url; return; }
    // fold the letter into the envelope, then hand over to the mail program
    var panel = form.closest('.cpanel');
    panel.classList.add('is-sending');
    setTimeout(function () {
      location.href = url;
      panel.classList.add('is-sent');
      ready.textContent = '';
    }, 1050);
    setTimeout(function () { panel.classList.remove('is-sending', 'is-sent'); }, 1800);
  });
})();
