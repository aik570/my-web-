(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = root.classList.contains('reduced');

  /* ---------- loading animation: the logo draws itself, then docks in the header ---------- */

  var ease = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  function runIntro() {
    var intro = document.getElementById('intro');
    if (!intro || reduced || root.classList.contains('intro-seen')) {
      if (intro) intro.remove();
      root.classList.add('intro-done');
      return;
    }
    try { sessionStorage.setItem('hc-intro', '1'); } catch (e) {}

    var logo = document.getElementById('introLogo');
    var q = function (s) { return intro.querySelector(s); };
    var line = q('.intro__skyline'), sky = q('.intro__sky'), tag = q('.intro__tag');
    var pulse = q('.intro__pulse'), pen = q('.intro__pen'), spark = q('.intro__spark');
    var wordRect = document.getElementById('ilWordRect'), ecgRect = document.getElementById('ilEcgRect');
    var W = intro.querySelector('svg').viewBox.baseVal.width;
    var pulseLen = pulse.getTotalLength();
    // skyline strokes: each one is drawn while the pen front passes over its x range
    var strokes = [].map.call(line.querySelectorAll('path'), function (el) {
      var bb = el.getBBox();
      return { el: el, x0: bb.x, x1: bb.x + bb.width, len: el.getTotalLength() };
    });
    var main = strokes.reduce(function (a, b) { return b.len > a.len ? b : a; });
    var navLogo = document.getElementById('navLogo');
    // timeline (ms): skyline 0–1100, wordmark 850–1400, pulse 1050–1750, tagline 1600–1900, dock 1950–2550
    var DOCK = 1950, END = 2550;
    var start = performance.now(), docked = false, done = false;

    function finish() {
      if (done) return;
      done = true;
      root.classList.add('intro-done');
      intro.remove();
    }
    function skip() {
      if (done) return;
      intro.classList.add('is-skipping');
      root.classList.add('intro-done');
      setTimeout(finish, 260);
    }
    intro.addEventListener('click', skip);
    ['keydown', 'wheel', 'touchstart'].forEach(function (ev) { addEventListener(ev, skip, { once: true, passive: true }); });

    function place(el, pt) { el.setAttribute('cx', pt.x.toFixed(1)); el.setAttribute('cy', pt.y.toFixed(1)); }
    function frame() {
      if (done) return;
      try { step(performance.now() - start); } catch (e) { finish(); }
    }
    function step(t) {
      // 1. the skyline, drawn like a pen stroke from left to right
      var p = ease(clamp(t / 1100)), front = p * W;
      strokes.forEach(function (s) {
        s.p = clamp((front - s.x0) / Math.max(1, s.x1 - s.x0));
        s.el.style.strokeDashoffset = (1 - s.p).toFixed(4);
      });
      line.style.opacity = (1 - clamp((t - 1100) / 300)).toFixed(3);
      sky.style.opacity = clamp((t - 800) / 450).toFixed(3);
      place(pen, main.el.getPointAtLength(main.p * main.len));
      pen.style.opacity = (main.p > 0.005 && main.p < 0.995 ? 1 : 0);

      // 2. the wordmark, revealed left to right
      wordRect.setAttribute('width', (W * easeOut(clamp((t - 850) / 550))).toFixed(1));

      // 3. the heartbeat: a spark runs along the line and flares on the peak
      var k = clamp((t - 1050) / 700);
      var pt = pulse.getPointAtLength(ease(k) * pulseLen);
      ecgRect.setAttribute('width', (k <= 0 ? 0 : k >= 1 ? W : pt.x + 2).toFixed(1));
      place(spark, pt);
      var flare = Math.exp(-Math.pow((pt.x - 303) / 12, 2));
      spark.setAttribute('r', (14 + 22 * flare).toFixed(1));
      spark.style.opacity = (k > 0 && k < 1 ? 1 : 0);

      // 4. the tagline
      tag.style.opacity = clamp((t - 1600) / 300).toFixed(3);

      // 5. dock the drawn logo onto the header logo, then let the page through
      if (t >= DOCK && !docked) {
        docked = true;
        var from = logo.getBoundingClientRect();
        var to = navLogo.getBoundingClientRect();
        logo.style.transition = 'transform .6s cubic-bezier(.65,0,.35,1)';
        logo.style.transform = 'translate(' + (to.left - from.left) + 'px,' + (to.top - from.top) + 'px) scale(' + (to.width / from.width) + ')';
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
  if (btn && links) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); btn.focus(); }
  });

  /* ---------- story: scroll progress drives the text scenes, with or without 3D ---------- */

  var story = document.getElementById('story');
  function noWebgl() {
    if (!story || root.classList.contains('webgl-ready')) return;
    root.classList.add('no-webgl');
    onScroll();
  }
  function storyProgress() {
    if (!story) return;
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
  if (story) {
    if (!canWebgl) noWebgl();
    else {
      // Load the 3D scene after the first paint so it never delays the headline.
      var started = false;
      var load = function () {
        if (started) return;
        started = true;
        import('./phone.js').catch(noWebgl);
        setTimeout(noWebgl, 12000);   // the scene never started
      };
      // Phones: the phone sits below the first screen, so start 3D on the first scroll or touch.
      // Larger screens: start once the page is idle.
      if (matchMedia('(max-width: 760px), (max-aspect-ratio: 3/4)').matches) {
        ['scroll', 'touchstart', 'pointerdown'].forEach(function (ev) { addEventListener(ev, load, { once: true, passive: true }); });
      } else {
        // after the intro: compiling the scene's shaders would stall its animation
        var whenIdle = function () {
          if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1500 });
          else setTimeout(load, 200);
        };
        (function waitIntro() {
          if (root.classList.contains('intro-done')) whenIdle();
          else setTimeout(waitIntro, 150);
        })();
      }
    }
  }

  /* ---------- photo zoom: links with data-zoom open the large photo in a dialog ---------- */

  var zoom = document.getElementById('zoom');
  if (zoom && zoom.showModal) {
    var zoomImg = zoom.querySelector('img');
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-zoom]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var img = a.querySelector('img');
      zoomImg.src = a.getAttribute('href');
      zoomImg.alt = img ? img.alt : '';
      zoom.showModal();
    });
    // click on the backdrop closes
    zoom.addEventListener('click', function (e) { if (e.target === zoom) zoom.close(); });
  }

  /* ---------- headings rise word by word as they come into view ---------- */

  if (!reduced) {
    [].forEach.call(document.querySelectorAll('main h2[id], .page-title, .fsec__h'), function (h) {
      if (h.closest('.story, .fresult, .offer, dialog, .prose, li, .fcard') || h.querySelector('a, input')) return;
      var i = 0;
      (function wrap(node) {
        [].slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var o = document.createElement('span'), w = document.createElement('span');
              o.className = 'wr'; w.textContent = part; w.style.setProperty('--i', i++);
              o.appendChild(w); frag.appendChild(o);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') wrap(n);
        });
      })(h);
      h.classList.add('rise');
    });
  }

  /* ---------- cards: a soft light follows the pointer ---------- */

  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.fbrand, .brandcard, .svc__item, .ftile, .frepair, .entry__main, .sign');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- prices: the total counts to its new value ----------
     The element itself always holds the final price (screen readers, scripts);
     the counting is drawn by an aria-hidden copy laid over it. */

  if (!reduced && window.MutationObserver) {
    [].forEach.call(document.querySelectorAll('#r-total, #sum-total, #sum-bar-total'), function (el) {
      var shown = el.textContent, raf = 0, ghost = null;
      var num = function (t) { var m = /([\d.]+(?:,\d+)?)\s*€/.exec(t); return m ? parseFloat(m[1].replace(/\./g, '').replace(',', '.')) : null; };
      function stop() {
        cancelAnimationFrame(raf);
        if (ghost) { ghost.remove(); ghost = null; }
        el.style.color = '';
      }
      new MutationObserver(function () {
        var target = el.textContent, a = num(shown), b = num(target);
        shown = target;
        stop();
        if (a === null || b === null || a === b || !el.offsetParent) return;
        var cs = getComputedStyle(el), prefix = target.slice(0, target.search(/\d/));
        ghost = document.createElement('span');
        ghost.setAttribute('aria-hidden', 'true');
        // anchored at the right edge, where prices are aligned
        ghost.style.cssText = 'position:absolute;pointer-events:none;white-space:nowrap;translate:-100% 0;' +
          'left:' + (el.offsetLeft + el.offsetWidth) + 'px;top:' + el.offsetTop + 'px;line-height:' + el.offsetHeight + 'px;';
        ['fontFamily', 'fontSize', 'fontWeight', 'fontStretch', 'fontVariantNumeric', 'letterSpacing', 'color'].forEach(function (k) { ghost.style[k] = cs[k]; });
        el.offsetParent.appendChild(ghost);
        el.style.color = 'transparent';
        var t0 = performance.now();
        (function tick(now) {
          var k = Math.min(1, (now - t0) / 420), v = a + (b - a) * (1 - Math.pow(1 - k, 3));
          if (!ghost) return;
          ghost.textContent = prefix + Math.round(v).toLocaleString('de-DE') + ' €';
          if (k < 1) raf = requestAnimationFrame(tick); else stop();
        })(t0);
      }).observe(el, { childList: true, characterData: true, subtree: true });
    });
  }

  /* ---------- reveal: checked on scroll, so it works wherever scrolling does ---------- */

  var pending = [].slice.call(document.querySelectorAll('.reveal, .path__line, .rise, .foot'));
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

  /* ---------- opening state, in Potsdam time, from the CMS data ---------- */

  var DATA = {};
  try { DATA = JSON.parse(document.getElementById('hc-data').textContent); } catch (e) {}
  var HOURS = DATA.hours || [];
  var T = DATA.texts || {};   // status wording from the CMS (site.json › statusTexts)
  var tx = function (k, d) { return T[k] || d; };
  var isOpen = null;

  var toMin = function (hhmm) { var p = String(hhmm || '').split(':'); return p.length === 2 ? +p[0] * 60 + +p[1] : null; };
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var iso = function (d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); };

  // Public holidays in Brandenburg (incl. Easter and Whit Sunday, Reformationstag).
  function holidays(year) {
    var a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    var easter = Date.UTC(year, month - 1, day), DAY = 864e5;
    var rel = function (n, name) { return [iso(new Date(easter + n * DAY)), name]; };
    var fix = function (mm, dd, name) { return [year + '-' + pad(mm) + '-' + pad(dd), name]; };
    var list = [fix(1, 1, 'Neujahr'), rel(-2, 'Karfreitag'), rel(0, 'Ostersonntag'), rel(1, 'Ostermontag'),
      fix(5, 1, 'Tag der Arbeit'), rel(39, 'Christi Himmelfahrt'), rel(49, 'Pfingstsonntag'), rel(50, 'Pfingstmontag'),
      fix(10, 3, 'Tag der Deutschen Einheit'), fix(10, 31, 'Reformationstag'), fix(12, 25, '1. Weihnachtstag'), fix(12, 26, '2. Weihnachtstag')];
    var map = {};
    list.forEach(function (x) { map[x[0]] = x[1]; });
    return map;
  }

  function berlinNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
        weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var m = {};
      parts.forEach(function (p) { m[p.type] = p.value; });
      return { date: Date.UTC(+m.year, +m.month - 1, +m.day), min: (+m.hour % 24) * 60 + (+m.minute) };
    } catch (e) { return null; }
  }

  // What the shop does on a given day: { from, to } in minutes, closed, or unknown.
  function dayPlan(utcMidnight) {
    var d = new Date(utcMidnight), key = iso(d);
    var closure = (DATA.closures || []).filter(function (c) { return c.date === key; })[0];
    if (closure) {
      return closure.closed ? { closed: true, label: closure.label }
        : { from: toMin(closure.from), to: toMin(closure.to), label: closure.label };
    }
    var hol = holidays(d.getUTCFullYear())[key];
    if (hol && DATA.publicHolidays === 'closed') return { closed: true, label: hol };
    if (hol && DATA.publicHolidays !== 'open') return { unknown: true, label: hol };
    var h = HOURS.filter(function (x) { return x.dayIndex === d.getUTCDay(); })[0];
    if (!h || !h.open) return { closed: true };
    return { from: toMin(h.from), to: toMin(h.to) };
  }

  var WEEKDAY = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var fmt = function (min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); };

  (function renderState() {
    var now = berlinNow();
    if (!now || !HOURS.length) return;
    var today = new Date(now.date).getUTCDay();
    var row = document.querySelector('.hours tr[data-day="' + today + '"]');
    if (row) row.classList.add('is-today');

    var plan = dayPlan(now.date);
    var text, short, todayHours;
    if (plan.unknown) {
      isOpen = null;
      text = plan.label + ' · ' + tx('holidayLong', 'bitte vorher anrufen');
      short = [plan.label, tx('holidayShort', 'bitte anrufen')];
      todayHours = 'Feiertag';
    } else {
      isOpen = !plan.closed && now.min >= plan.from && now.min < plan.to;
      todayHours = plan.closed ? 'geschlossen' : fmt(plan.from) + '–' + fmt(plan.to);
      if (isOpen) {
        text = tx('open', 'Jetzt geöffnet');
        short = [tx('openShort', 'Geöffnet'), tx('until', 'bis') + ' ' + fmt(plan.to)];
      } else {
        // next opening within two weeks
        var next = '';
        for (var i = 0; i < 14 && !next; i++) {
          var p = dayPlan(now.date + i * 864e5);
          if (p.closed || p.unknown) continue;
          if (i === 0 && now.min >= p.from) continue;
          next = (i === 0 ? 'heute' : i === 1 ? 'morgen' : WEEKDAY[new Date(now.date + i * 864e5).getUTCDay()]) + ' ' + fmt(p.from);
        }
        text = (plan.label ? plan.label + ' · ' : tx('closed', 'Geschlossen') + ' · ') + (next ? tx('from', 'ab') + ' ' + next : tx('noHours', 'Öffnungszeiten folgen'));
        short = [tx('closed', 'Geschlossen'), next ? tx('from', 'ab') + ' ' + next : ''];
      }
    }

    var state = document.querySelector('[data-state]');
    var hours = document.querySelector('[data-hours-today]');
    if (hours) hours.textContent = todayHours;
    if (state) { state.textContent = text; state.classList.toggle('is-closed', isOpen === false); }
    // header chips (bar and mobile menu): label + time; grey when the day is unclear (holiday)
    [].forEach.call(document.querySelectorAll('[data-state-short]'), function (chip) {
      chip.querySelector('.nav__state-label').textContent = short[0];
      chip.querySelector('.nav__state-time').textContent = short[1];
      if (isOpen !== null) chip.classList.add(isOpen ? 'is-open' : 'is-closed');
    });
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
      ctx.beginPath();
      for (var x = 0; x <= w; x += 2) {
        var ph = (((x + shift) % period) + period) % period / period;
        var y = base - beat(ph) * scale;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // the bright head at the right edge
      var hp = (((w + shift) % period) + period) % period / period;
      ctx.fillStyle = 'rgba(' + color + ',1)';
      ctx.beginPath(); ctx.arc(w - 2, base - beat(hp) * scale, 2.6, 0, 7); ctx.fill();
    }

    var last = 0;
    function loop(now) {
      if (visible && !document.hidden && now - last >= 32) { last = now; draw(now); }   // ~30 fps is plenty for a trace
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

// Google reviews carousel: arrows move one card, autoplay every 6 s (paused on hover, focus,
// touch and with reduced motion); wraps to the start at the end.
(function () {
  var track = document.querySelector('[data-rv-track]');
  if (!track) return;
  var step = function () { var c = track.querySelector('.rv__card'); return c ? c.getBoundingClientRect().width + 16 : track.clientWidth; };
  var go = function (dir) {
    var max = track.scrollWidth - track.clientWidth - 2;
    if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0 });
    else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: track.scrollWidth });
    else track.scrollBy({ left: dir * step() });
  };
  document.querySelectorAll('[data-rv]').forEach(function (b) { b.addEventListener('click', function () { go(+b.getAttribute('data-rv')); }); });
  track.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); go(e.key === 'ArrowRight' ? 1 : -1); } });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var paused = false, box = track.closest('.rv');
  ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { box.addEventListener(ev, function () { paused = true; }, { passive: true }); });
  ['mouseleave', 'focusout'].forEach(function (ev) { box.addEventListener(ev, function () { paused = false; }); });
  setInterval(function () { if (!paused && !document.hidden && track.scrollWidth > track.clientWidth + 4) go(1); }, 6000);
})();
