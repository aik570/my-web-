/* =========================================================
   AIK Studio — scroll-driven hero

   One controller. Scroll position is read into a target
   progress (0..1) across the pinned section; a single rAF loop
   eases toward it and writes everything from that one number:
   video.currentTime, the copy beats, the fog parallax, the HUD
   and the fade into the next section. The loop sleeps when it
   has caught up.

   The video is never played while scrubbing. Only one seek is in
   flight at a time; when it lands, the next one is issued for
   wherever the scroll has got to by then.
   ========================================================= */

(function () {
  'use strict';

  var root  = document.documentElement;
  var hero  = document.getElementById('cine');
  var video = document.getElementById('cineVideo');
  if (!hero || !video) return;

  var animated = root.classList.contains('anim');
  var stage = hero.querySelector('.cine__stage');
  var frame = hero.querySelector('.cine__frame');
  var mistFar  = hero.querySelector('.cine__mist--far');
  var mistNear = hero.querySelector('.cine__mist--near');
  var shade = hero.querySelector('.cine__shade');
  var cue   = hero.querySelector('.cine__cue');
  var tc    = document.getElementById('cineTc');
  var rail  = document.getElementById('cineRail');

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function ramp(p, a, b) { return smooth(clamp((p - a) / (b - a), 0, 1)); }

  /* ---------- source ---------------------------------------
     720p for phones and small windows, 1080p above that. Both are
     encoded with a keyframe every 6 frames so a seek decodes at most
     five frames, which is what makes scrubbing feel immediate. */

  var small = Math.min(window.innerWidth, window.innerHeight) <= 640 ||
              window.innerWidth <= 900;
  var saveData = !!(navigator.connection && navigator.connection.saveData);

  if (!animated || saveData) {
    // Reduced motion or data saver: the still poster is the hero.
    // The film is never requested and nothing moves.
    root.classList.remove('anim');
    return;
  }

  // The sequence opens on the empty valley, so swap the static poster
  // (eagle mid-flight) for the first frame before anything paints.
  video.poster = video.getAttribute('data-poster-start');
  hero.style.setProperty('--poster', 'url("' + video.poster + '")');
  video.preload = 'auto';
  video.muted = true;
  video.defaultMuted = true;
  video.src = video.getAttribute(small ? 'data-sm' : 'data-lg');

  /* ---------- copy beats ----------------------------------- */

  var beats = [].map.call(hero.querySelectorAll('[data-beat]'), function (el) {
    var r = el.getAttribute('data-beat').split(' ').map(parseFloat);
    var w = Math.min(0.07, (r[1] - r[0]) / 3);
    return { el: el, a: r[0], b: r[1], w: w, hold: el.hasAttribute('data-hold'), v: -1 };
  });

  function beatValue(bt, p) {
    var vin  = bt.a <= 0 ? 1 : ramp(p, bt.a, bt.a + bt.w);
    var vout = bt.hold ? 1 : 1 - ramp(p, bt.b - bt.w, bt.b);
    return { v: Math.min(vin, vout), leaving: vout < 1 };
  }

  /* ---------- measurement ---------------------------------- */

  var top = 0, span = 1;
  function measure() {
    var r = hero.getBoundingClientRect();
    top = r.top + window.pageYOffset;
    span = Math.max(1, hero.offsetHeight - stage.offsetHeight);
  }

  /* ---------- state ---------------------------------------- */

  var target = 0, current = 0, last = -1;
  var duration = 0;
  var seeking = false, seekStarted = 0, seekable = true;
  var intro = 0, introStart = 0;
  var raf = 0, prevT = 0;

  function readScroll() {
    target = clamp((window.pageYOffset - top) / span, 0, 1);
  }

  /* ---------- video ---------------------------------------- */

  function onMeta() {
    duration = video.duration;
    if (!isFinite(duration) || duration <= 0) { duration = 0; return; }
    // iOS Safari will not paint a seeked frame until the element has
    // played once. A muted inline play is allowed; pause right away.
    var pr = video.play();
    if (pr && pr.then) {
      pr.then(function () { video.pause(); seekTo(current); })
        .catch(function () { seekTo(current); });
    } else {
      video.pause();
      seekTo(current);
    }
  }

  function seekTo(p) {
    if (!duration || !seekable) return;
    // Stop a hair short of the end: some browsers show black at
    // exactly duration.
    var t = p * (duration - 0.05);
    if (Math.abs(video.currentTime - t) < 1 / 60) return;
    if (seeking) {
      // A seek that never lands means the browser cannot scrub this
      // file. Fall back to the poster rather than a frozen frame.
      if (performance.now() - seekStarted > 2500) giveUp();
      return;
    }
    seeking = true;
    seekStarted = performance.now();
    try { video.currentTime = t; } catch (e) { giveUp(); }
  }

  function giveUp() {
    seekable = false;
    seeking = false;
    hero.classList.add('cine--still');
  }

  video.addEventListener('loadedmetadata', onMeta);
  if (video.readyState >= 1) onMeta();
  video.addEventListener('seeked', function () {
    seeking = false;
    wake();
  });
  // Never let playback run on its own (autoplay policies, media keys).
  video.addEventListener('play', function () {
    if (duration) setTimeout(function () { video.pause(); }, 0);
  });
  video.addEventListener('error', giveUp);

  /* ---------- render --------------------------------------- */

  function render(p) {
    if (p !== last) {
      // camera: a slow settle as the bird approaches, then fog sheets
      // moving at two speeds for parallax over the footage's own depth
      frame.style.transform = 'scale(' + (1.06 - 0.06 * smooth(p)).toFixed(4) + ')';
      mistFar.style.transform  = 'translate3d(0,' + (-p * 6).toFixed(2) + '%,0)';
      mistNear.style.transform = 'translate3d(' + (p * 4).toFixed(2) + '%,' + (-p * 20).toFixed(2) + '%,0)';
      mistNear.style.opacity = (1 - 0.6 * ramp(p, 0, 0.5)).toFixed(3);
      shade.style.setProperty('--out', (0.62 * ramp(p, 0.9, 1)).toFixed(3));
      rail.style.setProperty('--p', p.toFixed(4));
      cue.style.opacity = ((1 - ramp(p, 0, 0.05)) * intro).toFixed(3);

      if (duration) {
        var s = p * duration;
        tc.textContent = '00:' + String(Math.floor(s)).padStart(2, '0') + ':' +
                         String(Math.floor((s % 1) * 24)).padStart(2, '0');
      }
      last = p;
    }

    for (var i = 0; i < beats.length; i++) {
      var bt = beats[i];
      var r = beatValue(bt, p);
      var v = r.v * (bt.a <= 0 ? intro : 1);
      if (Math.abs(v - bt.v) < 0.001) continue;
      bt.v = v;
      var y = (1 - v) * (r.leaving ? -22 : 26);
      bt.el.style.opacity = v.toFixed(3);
      bt.el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      bt.el.classList.toggle('is-on', v > 0.001);
    }
  }

  function tick(now) {
    raf = 0;
    var dt = prevT ? Math.min(0.05, (now - prevT) / 1000) : 1 / 60;
    prevT = now;

    // Frame-rate independent easing, ~90 ms time constant: enough to
    // smooth wheel steps without feeling like the film lags the hand.
    var k = 1 - Math.exp(-dt / 0.09);
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.0004) current = target;

    if (intro < 1) {
      if (!introStart) introStart = now;
      intro = smooth(clamp((now - introStart) / 1400, 0, 1));
    }

    render(current);
    seekTo(current);

    if (current !== target || intro < 1 || seeking) wake();
    else prevT = 0;
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  /* ---------- wiring --------------------------------------- */

  function onScroll() { readScroll(); wake(); }
  function onResize() { measure(); readScroll(); last = -1; wake(); }

  measure();
  readScroll();
  current = target;           // no ease-in from 0 on a mid-page reload

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('load', onResize);
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero);

  // A preference change mid-visit drops straight to the still frame.
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  function onPref() {
    if (!mq.matches) return;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
    root.classList.remove('anim');
    [frame, mistFar, mistNear].forEach(function (el) { el.style.transform = ''; });
    beats.forEach(function (bt) { bt.el.style.opacity = ''; bt.el.style.transform = ''; });
    shade.style.removeProperty('--out');
  }
  if (mq.addEventListener) mq.addEventListener('change', onPref);

  wake();
})();
