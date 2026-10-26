(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = root.classList.contains('reduced');

  /* ---------- intro: the logo draws like a monitor sweep, then docks in the header ---------- */

  // The heartbeat line of the logo, in logo units (viewBox 574 × 365).
  var LINE = [[20, 300], [214, 300], [222, 292], [231, 274], [239, 316], [247, 296], [415, 296], [505, 296], [552, 296]];
  function lineY(x) {
    for (var i = 1; i < LINE.length; i++) {
      if (x <= LINE[i][0]) {
        var a = LINE[i - 1], b = LINE[i], t = (x - a[0]) / (b[0] - a[0]);
        return a[1] + (b[1] - a[1]) * t;
      }
    }
    return 296;
  }
  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  function runIntro() {
    var intro = document.getElementById('intro');
    if (!intro || reduced) { root.classList.add('intro-done'); return; }

    var logo = document.getElementById('introLogo');
    var sweep = intro.querySelector('.intro__sweep');
    var dot = intro.querySelector('.intro__dot');
    var word = intro.querySelector('.intro__word');
    var tag = intro.querySelector('.intro__tag');
    var sky = intro.querySelector('.intro__sky');
    var navLogo = document.getElementById('navLogo');
    var start = performance.now();
    var SWEEP = 1500, WORD = 1050, TAG = 1500, DOCK = 2350, END = 3100;
    var docked = false, done = false;

    function finish() {
      if (done) return;
      done = true;
      root.classList.add('intro-done');
      intro.remove();
    }
    intro.addEventListener('click', finish);

    function frame() {
      if (done) return;
      try { step(performance.now() - start); } catch (e) { finish(); }
    }
    function step(t) {
      var s = ease(clamp(t / SWEEP));
      var x = s * 574;
      sweep.setAttribute('width', x.toFixed(1));
      var inGap = x > 418 && x < 503;
      dot.setAttribute('cx', x.toFixed(1));
      dot.setAttribute('cy', lineY(x).toFixed(1));
      dot.style.opacity = (s > 0.01 && s < 0.995 && !inGap) ? 1 : 0;
      sky.style.opacity = 0.35 + 0.65 * clamp((t - 300) / 1400);

      var w = ease(clamp((t - WORD) / 600));
      word.style.opacity = w;
      word.style.transform = 'translateY(' + (8 * (1 - w)).toFixed(2) + 'px)';
      tag.style.opacity = ease(clamp((t - TAG) / 500)) * (1 - clamp((t - DOCK) / 250));

      if (t >= DOCK && !docked) {
        docked = true;
        // move the drawn logo onto the header logo, then let the page through
        var from = logo.getBoundingClientRect();
        var to = navLogo.getBoundingClientRect();
        var k = to.width / from.width;
        logo.style.transition = 'transform .75s cubic-bezier(.65,0,.35,1)';
        logo.style.transform = 'translate(' + (to.left - from.left) + 'px,' + (to.top - from.top) + 'px) scale(' + k + ')';
        intro.classList.add('is-leaving');
      }
      if (t >= END) { finish(); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    setTimeout(finish, END + 1500);   // in case frames never come (hidden tab, preview)
  }
  runIntro();

  /* ---------- nav ---------- */

  var nav = document.getElementById('nav');
  var btn = document.getElementById('menuBtn');
  var links = document.getElementById('navLinks');

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

  /* ---------- story: scroll progress drives the text scenes, with or without 3D ---------- */

  var story = document.getElementById('story');
  function noWebgl() {
    if (root.classList.contains('webgl-ready')) return;
    root.classList.add('no-webgl');
    onScroll();
  }
  function storyProgress() {
    if (root.classList.contains('no-webgl')) { story.style.setProperty('--p', 0); story.dataset.scene = 'hero'; return; }
    var r = story.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - innerHeight)));
    story.style.setProperty('--p', p.toFixed(4));
    story.dataset.scene = p < 0.15 ? 'hero' : p > 0.86 ? 'done' : 'mid';
  }

  var canWebgl = (function () {
    try { var c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
  })();
  if (!canWebgl) noWebgl();
  else {
    import('./phone.js').catch(noWebgl);
    setTimeout(noWebgl, 10000);   // the CDN never answered
  }

  /* ---------- reveal: checked on scroll, so it works wherever scrolling does ---------- */

  var pending = [].slice.call(document.querySelectorAll('.reveal, .path__line'));
  function reveal() {
    var limit = innerHeight * 0.9;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('is-in'); return false; }
      return true;
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; storyProgress(); reveal(); });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- opening state, in Potsdam time ---------- */

  var OPEN = 10 * 60, CLOSE = 18 * 60 + 30;
  var isOpen = null;
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
  (function renderState() {
    var now = potsdamNow();
    if (!now) return;
    var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add('is-today');

    var openDay = now.day !== 0;
    isOpen = openDay && now.min >= OPEN && now.min < CLOSE;
    var next = openDay && now.min < OPEN ? 'heute 10:00' : (now.day === 6 || now.day === 0) ? 'Montag 10:00' : 'morgen 10:00';

    var state = document.querySelector('[data-state]');
    var hours = document.querySelector('[data-hours-today]');
    var short = document.querySelector('[data-state-short]');
    if (hours) hours.textContent = openDay ? '10:00–18:30' : 'geschlossen';
    if (state) {
      state.textContent = isOpen ? 'Jetzt geöffnet' : 'Geschlossen · ab ' + next;
      state.classList.toggle('is-closed', !isOpen);
    }
    if (short) {
      short.textContent = isOpen ? 'Geöffnet bis 18:30' : 'Geschlossen · ab ' + next;
      short.classList.add(isOpen ? 'is-open' : 'is-closed');
    }
  })();

  /* ---------- heart monitors ---------- */

  // One heartbeat as a function of phase 0..1: P wave, QRS spike, T wave.
  function beat(p) {
    var g = function (c, w, h) { var d = (p - c) / w; return h * Math.exp(-d * d); };
    return g(.12, .035, .12) - g(.3, .012, .14) + g(.33, .014, 1) - g(.365, .014, .32) + g(.56, .06, .26);
  }

  [].forEach.call(document.querySelectorAll('[data-ecg]'), function (cv) {
    var ctx = cv.getContext('2d');
    var wide = cv.hasAttribute('data-ecg-wide');
    var visible = false, w = 0, h = 0, dpr = 1;
    var color = wide ? '111,227,192' : '111,227,192';

    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    addEventListener('resize', size);

    var period = wide ? 260 : 120;          // px per beat
    var speed = wide ? 120 : 70;            // px per second

    function draw(now) {
      if (!w) return;
      var shift = reduced ? 0 : (now / 1000) * speed;
      var amp = isOpen === false ? 0.18 : 1;
      ctx.clearRect(0, 0, w, h);

      // faint monitor grid
      ctx.strokeStyle = 'rgba(' + color + ',.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var gx = 0; gx < w; gx += 16) { ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, h); }
      for (var gy = 0; gy < h; gy += 16) { ctx.moveTo(0, gy + .5); ctx.lineTo(w, gy + .5); }
      ctx.stroke();

      var base = h * 0.62, scale = h * 0.5 * amp;
      var grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(' + color + ',0)');
      grad.addColorStop(0.25, 'rgba(' + color + ',.55)');
      grad.addColorStop(1, 'rgba(' + color + ',1)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = wide ? 2.2 : 1.8;
      ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(' + color + ',.7)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (var x = 0; x <= w; x += 1) {
        var ph = (((x + shift) % period) + period) % period / period;
        var y = base - beat(ph) * scale;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // the bright head at the right edge
      var hp = (((w + shift) % period) + period) % period / period;
      ctx.fillStyle = 'rgba(' + color + ',1)';
      ctx.beginPath(); ctx.arc(w - 2, base - beat(hp) * scale, 2.6, 0, 7); ctx.fill();
    }

    function loop(now) {
      if (visible) draw(now);
      if (!reduced) requestAnimationFrame(loop);
    }
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (reduced && visible) draw(0); }).observe(cv);
    requestAnimationFrame(loop);
  });

  /* ---------- Behandlungsweg tabs ---------- */

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
