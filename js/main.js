/* =========================================================
   MARAAL — plain JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     photo slots
     A slot that has no file yet says which file belongs there.
     Drop the file into img/ and the slot fills itself.
     --------------------------------------------------------- */

  var shots = document.querySelectorAll('.shot');

  function markSlot(shot) {
    var img = shot.querySelector('img');
    if (!img) return;

    if (img.complete) {
      shot.classList.toggle('is-empty', img.naturalWidth === 0);
      return;
    }
    img.addEventListener('load', function () { shot.classList.remove('is-empty'); });
    img.addEventListener('error', function () { shot.classList.add('is-empty'); });
  }

  Array.prototype.forEach.call(shots, markSlot);

  /* ---------------------------------------------------------
     nav: transparent over the hero, solid once past it
     --------------------------------------------------------- */

  var nav = document.getElementById('nav');
  var hero = document.querySelector('.hero');

  function onScroll() {
    if (!nav) return;
    var line = hero ? hero.offsetHeight - 90 : 80;
    nav.classList.toggle('is-solid', window.scrollY > line);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     which section you are in
     --------------------------------------------------------- */

  var navLinks = document.querySelectorAll('.nav__links a');
  var sections = [];

  Array.prototype.forEach.call(navLinks, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });

  function spy() {
    if (!sections.length) return;

    var mark = 110;
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

  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');

  function closeMenu() {
    if (!burger || !links) return;
    links.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (open && nav) nav.classList.add('is-solid');
      else onScroll();
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------
     enquiry form
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
      fail(input, input.tagName === 'SELECT' ? 'Choose a band.' : 'Required.');
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
