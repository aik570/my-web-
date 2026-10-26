(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- intro: remove once it has played ---------- */

  var intro = document.getElementById('intro');
  if (intro) setTimeout(function () { intro.remove(); }, 3000);

  /* ---------- nav ---------- */

  var nav = document.getElementById('nav');
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');
  var story = document.getElementById('story');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
  });

  // The bar turns light over light sections.
  var darks = [].slice.call(document.querySelectorAll('.story, .dark'));
  function navTone() {
    var y = nav.offsetHeight / 2, dark = false;
    darks.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) dark = true;
    });
    nav.classList.toggle('is-light', !dark);
  }
  addEventListener('scroll', navTone, { passive: true });
  navTone();

  /* ---------- 3D fallback: if the scene has not started, collapse the story ---------- */

  setTimeout(function () {
    if (!root.classList.contains('webgl-ready')) root.classList.add('no-webgl');
  }, 8000);

  /* ---------- reveal on scroll ---------- */

  var targets = document.querySelectorAll('.reveal, .flow__pulse, .call__pulse');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    [].forEach.call(targets, function (t) { io.observe(t); });
  } else {
    [].forEach.call(targets, function (t) { t.classList.add('is-in'); });
  }

  /* ---------- opening status, in Potsdam time ---------- */

  var OPEN = 10 * 60, CLOSE = 18 * 60 + 30;
  function potsdamNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var m = {};
      parts.forEach(function (p) { m[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[m.weekday], min: (+m.hour % 24) * 60 + (+m.minute) };
    } catch (e) { return null; }
  }
  var now = potsdamNow();
  if (now) {
    var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add('is-today');
    var el = document.querySelector('[data-status]');
    var openDay = now.day !== 0;
    if (openDay && now.min >= OPEN && now.min < CLOSE) {
      el.textContent = 'Jetzt geöffnet · bis 18:30 Uhr';
      el.classList.add('is-open');
    } else {
      el.textContent = openDay && now.min < OPEN ? 'Geschlossen · öffnet heute um 10:00 Uhr'
        : (now.day === 6 || now.day === 0) ? 'Geschlossen · öffnet Montag um 10:00 Uhr'
        : 'Geschlossen · öffnet morgen um 10:00 Uhr';
      el.classList.add('is-closed');
    }
  }

  /* ---------- Ablauf: Im Laden / Per Post ---------- */

  var tabs = [].slice.call(document.querySelectorAll('.switch [role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next); next.focus();
    });
  });
})();
