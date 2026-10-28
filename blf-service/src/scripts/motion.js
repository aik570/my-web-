/*
 * Small motion helpers for the opening stage. No dependencies.
 *
 * URL parameters (review and QA):
 *   ?rm=1   force the reduced-motion version
 */
(function (global) {
  "use strict";

  var q = new URLSearchParams(location.search);
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

  /* Calls cb(progress 0..1) for a tall section while it scrolls past the sticky viewport. */
  function scrollScene(section, cb) {
    function update() {
      var r = section.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      cb(total > 0 ? clamp(-r.top / total, 0, 1) : 0);
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

  global.BLFMotion = {
    rng: rng, clamp: clamp, ease: ease, easeInOut: easeInOut, seg: seg,
    scrollScene: scrollScene, fitCanvas: fitCanvas, reduced: reduced
  };
})(window);
