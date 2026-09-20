/* =========================================================
   A135 — 6286 203 Street, Langley BC
   Plain JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* =========================================================
     LISTING DATA — the only place to edit.

     Fill a value in and it appears on the page. Leave it null
     and the page shows a dash instead of a made-up number.
     Nothing here is invented; every field is waiting on the
     real listing.
     ========================================================= */

  var LISTING = {
    status:    null,   // e.g. 'For lease'  /  'For sale'  /  'Sold'
    price:     null,   // e.g. '$24.50 per sq ft, net'  or  '$1,295,000'

    size:      null,   // e.g. '2,412 sq ft'
    ground:    null,   // e.g. '1,540 sq ft'
    mezzanine: null,   // e.g. '872 sq ft'

    zoning:    null,   // e.g. 'M-2 General Industrial'
    height:    null,   // e.g. '24 ft clear'
    loading:   null,   // e.g. 'One grade-level door, 12 x 14 ft'
    power:     null,   // e.g. '100 amp, 600 volt, 3-phase'
    parking:   null,   // e.g. '4 stalls'
    strata:    null,   // e.g. '$0.42 per sq ft per month'
    available: null,   // e.g. 'Immediately'

    agent:     null,   // e.g. 'Nikolai Riabov'
    brokerage: null,   // e.g. 'ALIGN | eXp Realty'
    phone:     null,   // e.g. '+1 604 000 0000'
    email:     null    // e.g. 'desk@example.com'
  };

  /* ---------------------------------------------------------
     paint the data into every slot that asks for it
     --------------------------------------------------------- */

  var slots = document.querySelectorAll('[data-key]');
  var filled = 0, total = 0;

  Array.prototype.forEach.call(slots, function (el) {
    var key = el.getAttribute('data-key');
    var value = LISTING[key];
    total++;

    if (value === null || value === undefined || value === '') {
      el.textContent = '—';
      el.classList.add('is-blank');
      el.setAttribute('title', 'Not supplied yet');
      return;
    }

    filled++;
    el.classList.remove('is-blank');
    el.removeAttribute('title');

    /* phone and email become links, everything else is plain text */
    if (key === 'phone') {
      el.innerHTML = '';
      el.appendChild(link('tel:' + String(value).replace(/[^\d+]/g, ''), value));
    } else if (key === 'email') {
      el.innerHTML = '';
      el.appendChild(link('mailto:' + value, value));
    } else {
      el.textContent = value;
    }
  });

  function link(href, text) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    a.style.borderBottom = '1px solid currentColor';
    return a;
  }

  /* the status pill only claims something once it is told to */
  var statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = LISTING.status || 'Status to be confirmed';
  }

  /* the note above the specs reports how much is still missing */
  var note = document.getElementById('dataNote');
  if (note && filled === total && total > 0) {
    note.textContent = 'All listing figures are supplied.';
  }

  /* ---------------------------------------------------------
     which section you are in
     --------------------------------------------------------- */

  var navLinks = document.querySelectorAll('.bar__nav a');
  var sections = [];

  Array.prototype.forEach.call(navLinks, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });

  function spy() {
    if (!sections.length) return;

    var mark = 100;
    var active = null;

    sections.forEach(function (s) {
      var box = s.el.getBoundingClientRect();
      if (box.top <= mark && box.bottom > mark) active = s;
    });

    sections.forEach(function (s) {
      s.link.setAttribute('aria-current', s === active ? 'true' : 'false');
    });
  }
  spy();
  window.addEventListener('scroll', spy, { passive: true });

  /* ---------------------------------------------------------
     menu
     --------------------------------------------------------- */

  var menuBtn = document.getElementById('menuBtn');
  var barNav = document.getElementById('barNav');

  function closeMenu() {
    if (!menuBtn || !barNav) return;
    barNav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }

  if (menuBtn && barNav) {
    menuBtn.addEventListener('click', function () {
      var open = barNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    barNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------
     viewing request form
     --------------------------------------------------------- */

  var form = document.getElementById('enquiryForm');
  var ok = document.getElementById('formOk');

  function fail(input, message) {
    var fld = input.closest('.fld');
    var slot = document.querySelector('[data-err="' + input.id + '"]');
    if (fld) fld.classList.toggle('is-bad', Boolean(message));
    if (slot) slot.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function check(input) {
    var v = input.value.trim();

    if (!v) {
      fail(input, input.tagName === 'SELECT' ? 'Choose one.' : 'Required.');
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      fail(input, 'Check the address.');
      return false;
    }
    fail(input, '');
    return true;
  }

  if (form) {
    var must = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(must, function (input) {
      input.addEventListener('blur', function () { check(input); });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') check(input);
      });
      input.addEventListener('input', function () {
        if (input.closest('.fld').classList.contains('is-bad')) check(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var good = true, first = null;

      Array.prototype.forEach.call(must, function (input) {
        if (!check(input)) {
          good = false;
          if (!first) first = input;
        }
      });

      if (!good) {
        if (first) first.focus();
        if (ok) ok.hidden = true;
        return;
      }

      /* Demo only: nothing is sent. Point this at your endpoint to go live. */
      if (ok) ok.hidden = false;
      form.reset();
    });
  }
})();
