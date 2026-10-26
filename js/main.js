(function () {
  'use strict';

  var SHOP_EMAIL = 'potsdam@handy-chirurg.de';

  // Mo–Sa 10:00–18:30, minutes since midnight. Sunday closed.
  var OPEN = 10 * 60;
  var CLOSE = 18 * 60 + 30;

  /* ---------- menu ---------- */

  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }

  btn.addEventListener('click', function () {
    setMenu(btn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      btn.focus();
    }
  });

  /* ---------- opening status, always in Potsdam time ---------- */

  function potsdamNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], minutes: (+map.hour % 24) * 60 + (+map.minute) };
    } catch (e) {
      return null;
    }
  }

  function renderStatus() {
    var now = potsdamNow();
    if (!now) return;

    var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add('is-today');

    var el = document.querySelector('[data-status]');
    if (!el) return;

    var openDay = now.day !== 0;
    var text;
    if (openDay && now.minutes >= OPEN && now.minutes < CLOSE) {
      text = 'Jetzt geöffnet · bis 18:30 Uhr';
      el.className = 'status is-open';
    } else {
      if (openDay && now.minutes < OPEN) text = 'Geschlossen · öffnet heute um 10:00 Uhr';
      else if (now.day === 6 || now.day === 0) text = 'Geschlossen · öffnet Montag um 10:00 Uhr';
      else text = 'Geschlossen · öffnet morgen um 10:00 Uhr';
      el.className = 'status is-closed';
    }
    el.textContent = text;
  }

  renderStatus();

  /* ---------- request form: builds an e-mail, sends nothing itself ---------- */

  var form = document.getElementById('form');
  var error = document.getElementById('formError');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var device = form.device.value.trim();
    var name = form.name.value.trim();
    var missing = [];

    [form.device, form.name].forEach(function (input) {
      var empty = !input.value.trim();
      input.setAttribute('aria-invalid', empty ? 'true' : 'false');
      if (empty) missing.push(input);
    });

    if (missing.length) {
      error.textContent = 'Bitte geben Sie ' +
        (missing.length === 2 ? 'Gerät und Namen' : missing[0] === form.device ? 'das Gerät' : 'Ihren Namen') +
        ' an.';
      error.hidden = false;
      missing[0].focus();
      return;
    }
    error.hidden = true;

    var subject = 'Reparaturanfrage: ' + device + ' – ' + form.issue.value;
    var body = [
      'Gerät: ' + device,
      'Problem: ' + form.issue.value,
      '',
      form.message.value.trim(),
      '',
      'Viele Grüße',
      name
    ].join('\n');

    window.location.href = 'mailto:' + SHOP_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  });
})();
