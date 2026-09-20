/* =========================================================
   MARAAL — plain JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky nav ---------- */

  var nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('is-stuck', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */

  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!burger || !navLinks) return;
    navLinks.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- reveal on scroll ---------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-in');
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) {
      io.observe(el);
    });
  }

  /* ---------- hero headline lines ---------- */

  var lines = document.querySelectorAll('.hero__title .line');

  Array.prototype.forEach.call(lines, function (line, i) {
    if (reduceMotion) {
      line.classList.add('is-in');
      return;
    }
    window.setTimeout(function () {
      line.classList.add('is-in');
    }, 180 + i * 130);
  });

  /* ---------- marquee: clone the group so the loop is seamless ---------- */

  var track = document.getElementById('stripTrack');

  if (track && !reduceMotion) {
    var group = track.firstElementChild;
    if (group) {
      var clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  }

  /* ---------- collection filter ---------- */

  var chips = document.querySelectorAll('.chip');
  var cards = document.querySelectorAll('#grid .card');
  var gridEmpty = document.getElementById('gridEmpty');

  Array.prototype.forEach.call(chips, function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      var shown = 0;

      Array.prototype.forEach.call(chips, function (c) {
        c.classList.toggle('is-active', c === chip);
      });

      Array.prototype.forEach.call(cards, function (card) {
        var match = filter === 'all' || card.getAttribute('data-type') === filter;
        card.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (gridEmpty) gridEmpty.hidden = shown !== 0;
    });
  });

  /* ---------- enquiry form ---------- */

  var form = document.getElementById('enquiryForm');
  var success = document.getElementById('formSuccess');

  function setError(input, message) {
    var field = input.closest('.field');
    var slot = document.querySelector('[data-error-for="' + input.id + '"]');

    if (field) field.classList.toggle('has-error', Boolean(message));
    if (slot) slot.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function validate(input) {
    var value = input.value.trim();

    if (!value) {
      setError(input, 'This field is required.');
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(input, 'Please check the email address.');
      return false;
    }
    setError(input, '');
    return true;
  }

  if (form) {
    var required = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(required, function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      var firstBad = null;

      Array.prototype.forEach.call(required, function (input) {
        if (!validate(input)) {
          ok = false;
          if (!firstBad) firstBad = input;
        }
      });

      if (!ok) {
        if (firstBad) firstBad.focus();
        if (success) success.hidden = true;
        return;
      }

      /* Demo only: no request is sent. Wire this to a real endpoint later. */
      if (success) success.hidden = false;
      form.reset();
    });
  }

  /* ---------- current year is not printed anywhere; nothing invented ---------- */
})();
