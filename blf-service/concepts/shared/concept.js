/*
 * Shared helpers for the Stage 04B concept prototypes. Concept code, not production.
 *
 * URL parameters (for review and keyframe capture):
 *   ?t=1.2   freeze the intro at 1.2 s (no animation; used for keyframes)
 *   ?t=end   show the final intro state immediately
 *   ?rm=1    force the reduced-motion version
 */
(function (global) {
  "use strict";

  var q = new URLSearchParams(location.search);
  var freezeParam = q.get("t");
  var reduced = q.get("rm") === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Deterministic randomness: the same seed always grows the same tree.
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function ease(t) { return 1 - Math.pow(1 - clamp(t, 0, 1), 3); }          // ease-out cubic
  function easeInOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function seg(t, start, dur) { return clamp((t - start) / dur, 0, 1); }   // local progress of a phase

  /*
   * Runs an intro timeline of `duration` seconds and calls render(t).
   * Frozen (?t=…) or reduced motion: renders a single frame and returns.
   * Calls done() once the intro has reached its end.
   */
  function timeline(duration, render, done) {
    if (freezeParam !== null) {
      var t = freezeParam === "end" ? duration : parseFloat(freezeParam) || 0;
      render(Math.min(t, duration));
      if (t >= duration && done) done();
      document.documentElement.classList.add("frozen");
      return;
    }
    if (reduced) { render(duration); if (done) done(); return; }
    var start = performance.now();
    function frame(now) {
      var t = (now - start) / 1000;
      render(Math.min(t, duration));
      if (t < duration) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
  }

  /* Calls cb(progress 0..1) for a tall section while it scrolls past the sticky viewport. */
  function scrollScene(section, cb) {
    function update() {
      var r = section.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      section.style.setProperty("--p", p.toFixed(4));
      cb(p);
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(function () { update(); ticking = false; }); }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* Sizes a canvas to its CSS box at device resolution (capped at 2x for cost). */
  function fitCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  function loadImage(src) {
    return new Promise(function (res, rej) {
      var i = new Image();
      i.onload = function () { res(i); };
      i.onerror = rej;
      i.src = src;
    });
  }

  var isSmall = window.matchMedia("(max-width: 767px)").matches;

  global.Concept = {
    rng: rng, clamp: clamp, ease: ease, easeInOut: easeInOut, seg: seg,
    timeline: timeline, scrollScene: scrollScene, fitCanvas: fitCanvas, loadImage: loadImage,
    reduced: reduced, frozen: freezeParam !== null, isSmall: isSmall
  };
  if (reduced) document.documentElement.classList.add("rm");
})(window);
