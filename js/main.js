/* =========================================================
   A135 — 6286 203 Street, Langley BC
   Plain JS, no dependencies, no animation library.
   ========================================================= */
(function () {
  'use strict';

  var reduce = !document.documentElement.classList.contains('anim');

  /* =========================================================
     LISTING DATA — the only place to edit.
     A field left as null shows a dash instead of a made-up number.
     ========================================================= */

  var LISTING = {
    status:   null,   // 'For lease'  /  'For sale'  /  'Sold'

    size:     null,   // '2,412 sq ft'
    height:   null,   // '24 ft clear'
    loading:  null,   // 'One grade-level door'
    parking:  null,   // '4 stalls'

    agent:    null,   // 'Nikolai Riabov'
    brokerage:null,   // 'ALIGN | eXp Realty'
    phone:    null,   // '+1 604 000 0000'
    email:    null    // 'desk@example.com'
  };

  /* ---- the four headline figures ---- */

  Array.prototype.forEach.call(document.querySelectorAll('[data-key]'), function (el) {
    var v = LISTING[el.getAttribute('data-key')];
    if (v === null || v === undefined || v === '') {
      el.textContent = '—';
      el.classList.add('is-blank');
      el.title = 'Not supplied yet';
    } else {
      el.textContent = v;
    }
  });

  var statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = LISTING.status || 'Status to be confirmed';

  /* ---- the contact block: only rows that have something in them ---- */

  var who = document.getElementById('who');

  if (who) {
    [
      ['Listed by',  LISTING.agent,     null],
      ['Brokerage',  LISTING.brokerage, null],
      ['Direct',     LISTING.phone,     'tel'],
      ['Email',      LISTING.email,     'mailto']
    ].forEach(function (row) {
      if (!row[1]) return;

      var div = document.createElement('div');
      var dt = document.createElement('dt');
      var dd = document.createElement('dd');

      dt.textContent = row[0];

      if (row[2]) {
        var a = document.createElement('a');
        a.href = row[2] + ':' + (row[2] === 'tel' ? String(row[1]).replace(/[^\d+]/g, '') : row[1]);
        a.textContent = row[1];
        dd.appendChild(a);
      } else {
        dd.textContent = row[1];
      }

      div.appendChild(dt);
      div.appendChild(dd);
      who.appendChild(div);
    });
  }

  /* =========================================================
     the photographs, in one list
     ========================================================= */

  var SHOTS = [
    { src: 'img/aerial-wide.jpg',    cap: 'The complex from above' },
    { src: 'img/street-front.jpg',   cap: 'Frontage to 203 Street' },
    { src: 'img/loading-bays.jpg',   cap: 'Grade-level loading at the rear' },
    { src: 'img/aerial-corner.jpg',  cap: 'The development from the south' },
    { src: 'img/aerial-context.jpg', cap: 'Yard and service access' }
  ];

  /* =========================================================
     headline: split into words so they can be staggered
     ========================================================= */

  var title = document.getElementById('heroTitle');

  if (title) {
    var d = 0;

    Array.prototype.forEach.call(title.querySelectorAll('.line'), function (line) {
      var words = line.textContent.trim().split(/\s+/);
      line.textContent = '';

      words.forEach(function (word, i) {
        var outer = document.createElement('span');
        var inner = document.createElement('span');

        outer.className = 'w';
        inner.textContent = word;
        outer.style.setProperty('--d', d + 'ms');
        d += 70;

        outer.appendChild(inner);
        line.appendChild(outer);
        if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
      });
    });

    /* next frame, so the transition has a start state to move from */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { title.classList.add('in'); });
    });
  }

  /* =========================================================
     hero slideshow, with the rail as its control
     ========================================================= */

  var slides = document.querySelectorAll('.slide');
  var railItems = document.querySelectorAll('.rail__item');
  var railTrack = document.getElementById('railTrack');
  var rail = document.getElementById('rail');
  var hero = document.querySelector('.hero');

  var shot = 0;
  var timer = null;

  function centreRail() {
    if (!railTrack || !rail || reduce) return;

    var item = railItems[shot];
    if (!item) return;

    var want = item.offsetLeft + item.offsetWidth / 2 - rail.clientWidth / 2;
    var most = Math.max(0, railTrack.scrollWidth - rail.clientWidth);
    var x = Math.max(0, Math.min(want, most));

    railTrack.style.transform = 'translateX(' + (-x) + 'px)';
  }

  function show(i) {
    shot = (i + SHOTS.length) % SHOTS.length;

    Array.prototype.forEach.call(slides, function (s, n) {
      s.classList.toggle('is-on', n === shot);
      /* restart the drift so each slide gets its own move */
      if (n === shot && !reduce) {
        var img = s.querySelector('img');
        if (img) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
      }
    });

    Array.prototype.forEach.call(railItems, function (b, n) {
      b.classList.toggle('is-on', n === shot);
      b.setAttribute('aria-selected', n === shot ? 'true' : 'false');
    });

    centreRail();
  }

  function play() {
    if (reduce || timer) return;
    timer = window.setInterval(function () { show(shot + 1); }, 5200);
  }
  function pause() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  }

  Array.prototype.forEach.call(railItems, function (b) {
    b.addEventListener('click', function () {
      show(Number(b.getAttribute('data-i')));
      pause(); play();               /* restart the clock on a manual pick */
    });
  });

  if (hero) {
    hero.addEventListener('mouseenter', pause);
    hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', pause);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else play();
  });

  window.addEventListener('resize', centreRail);

  show(0);
  play();

  /* =========================================================
     blocks rise into view
     ========================================================= */

  var risers = document.querySelectorAll('.rise');

  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(risers, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      /* stagger whatever arrives together */
      var hit = entries.filter(function (e) { return e.isIntersecting; });

      hit.forEach(function (entry, n) {
        entry.target.style.setProperty('--d', (n * 85) + 'ms');
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(risers, function (el) { io.observe(el); });
  }

  /* =========================================================
     a light parallax on the location shot
     ========================================================= */

  var par = document.querySelectorAll('.par img');

  function parallax() {
    if (reduce || !par.length) return;

    Array.prototype.forEach.call(par, function (img) {
      var box = img.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) return;

      var mid = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      img.style.transform = 'translate3d(0,' + (mid * -22).toFixed(1) + 'px,0) scale(1.07)';
    });
  }

  /* =========================================================
     lightbox
     ========================================================= */

  var box = document.getElementById('box');
  var boxImg = document.getElementById('boxImg');
  var boxCap = document.getElementById('boxCap');
  var boxClose = document.getElementById('boxClose');
  var boxPrev = document.getElementById('boxPrev');
  var boxNext = document.getElementById('boxNext');

  var boxAt = 0;
  var lastFocus = null;

  function paintBox() {
    var s = SHOTS[boxAt];
    if (!s || !boxImg) return;
    boxImg.src = s.src;
    boxImg.alt = s.cap;
    if (boxCap) boxCap.textContent = s.cap + '  ·  ' + (boxAt + 1) + ' of ' + SHOTS.length;
  }

  function openBox(i) {
    if (!box) return;
    lastFocus = document.activeElement;
    boxAt = (i + SHOTS.length) % SHOTS.length;
    paintBox();
    box.hidden = false;
    pause();
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { box.classList.add('in'); });
    if (boxClose) boxClose.focus();
  }

  function closeBox() {
    if (!box) return;
    box.classList.remove('in');
    document.body.style.overflow = '';

    var done = function () { box.hidden = true; };
    if (reduce) done(); else window.setTimeout(done, 260);

    play();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function stepBox(n) {
    boxAt = (boxAt + n + SHOTS.length) % SHOTS.length;
    paintBox();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.gal__item'), function (b) {
    b.addEventListener('click', function () { openBox(Number(b.getAttribute('data-i'))); });
  });

  if (boxClose) boxClose.addEventListener('click', closeBox);
  if (boxPrev) boxPrev.addEventListener('click', function () { stepBox(-1); });
  if (boxNext) boxNext.addEventListener('click', function () { stepBox(1); });

  if (box) {
    box.addEventListener('click', function (e) {
      if (e.target === box) closeBox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!box || box.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeBox(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); stepBox(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepBox(-1); }
  });

  /* =========================================================
     bar: over the hero, then solid. Plus the current section.
     ========================================================= */

  var bar = document.getElementById('bar');
  var navLinks = document.querySelectorAll('.bar__nav a');
  var sections = [];

  Array.prototype.forEach.call(navLinks, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ link: a, el: el });
  });

  function onScroll() {
    if (bar && hero) {
      bar.classList.toggle('is-solid', window.scrollY > hero.offsetHeight - 90);
    }

    var mark = 100;
    var active = null;

    sections.forEach(function (s) {
      var b = s.el.getBoundingClientRect();
      if (b.top <= mark && b.bottom > mark) active = s;
    });
    sections.forEach(function (s) {
      s.link.setAttribute('aria-current', s === active ? 'true' : 'false');
    });

    parallax();
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  onScroll();

  /* =========================================================
     menu
     ========================================================= */

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
      if (open && bar) bar.classList.add('is-solid'); else onScroll();
    });
    barNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* =========================================================
     viewing request form
     ========================================================= */

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
