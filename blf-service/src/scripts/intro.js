/*
 * Tree-logo intro (Stage 04 prototype).
 *
 * Technically honest by design: the official logo exists only as one raster file
 * (public/assets/original/brand/…_Logo_273806.png). Its parts are NOT animated
 * separately. SVG masks progressively reveal the authentic pixels: a root and
 * trunk band growing upward, canopy groups opening, the rings and the lettering
 * swept in arcs. At the end the masks are removed, so the final frame is exactly
 * the original artwork. Mask geometry was measured from the logo file and checked
 * to cover 100 % of its tree pixels (see docs/design/INTRO_PROTOTYPE.md).
 *
 * The intro never blocks the page: it runs only on the Home page, once per
 * session, not with prefers-reduced-motion, can be skipped at any time, and gives
 * up if the logo has not loaded quickly. Without JavaScript nothing of this runs.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  if (!root.classList.contains("intro-pending")) return;

  var LOGO = "../public/assets/optimized/home/logo-1200.webp"; // lossless downscale of the original PNG
  var LOAD_TIMEOUT = 1200;   // ms the intro waits for the logo before giving up
  var START_DEADLINE = 1500; // ms after first paint after which the intro no longer starts
  var HARD_STOP = 4500;      // ms: absolute upper bound, then everything is cleaned up

  var requestedAt = window.__blfIntroRequestedAt || Date.now();
  var lite = window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches ||
    (navigator.connection && navigator.connection.saveData === true);

  var overlay, svg, skipButton, hardStopTimer, done = false;

  function abort() {
    root.classList.remove("intro-pending", "intro-running");
  }

  function remember() {
    try { sessionStorage.setItem("blf-intro", "1"); } catch (e) {}
  }

  // Timeline in seconds. "lite" is the lightweight mobile version.
  var T = lite
    ? { plate: 0, grow: 0.15, growDur: 0.7, canopy: null, fill: 0.85,
        ringIn: 0.6, ringOut: 0.65, ringDur: 0.55, textTop: 0.7, textBottom: 0.8, textDur: 0.5,
        spring: null, handoff: 1.35 }
    : { plate: 0, grow: 0.2, growDur: 0.6, canopy: 0.65, fill: 1.4,
        ringIn: 1.25, ringOut: 1.4, ringDur: 0.55, textTop: 1.5, textBottom: 1.7, textDur: 0.45,
        spring: 2.1, handoff: 2.45 };

  // Canopy groups: centre x, centre y, radius, start offset (s). Measured against the logo.
  var CANOPY = [
    [983, 1000, 250, 0], [720, 880, 250, 0.12], [1246, 880, 250, 0.12],
    [983, 770, 200, 0.2], [560, 1020, 190, 0.24], [1406, 1020, 190, 0.24],
    [600, 760, 200, 0.32], [1366, 760, 200, 0.32], [480, 880, 150, 0.38], [1486, 880, 150, 0.38],
    [800, 640, 250, 0.44], [1166, 640, 250, 0.44], [983, 520, 230, 0.52]
  ];

  function at(t) { return "ixStart.begin+" + t.toFixed(2) + "s"; }

  function buildSvg() {
    var growTop = lite ? 400 : 1080; // lite: one sweep reveals the whole tree
    var canopy = "";
    if (T.canopy !== null) {
      CANOPY.forEach(function (c) {
        canopy += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="0" fill="#fff">' +
          '<animate attributeName="r" from="0" to="' + c[2] + '" dur="0.42s" begin="' + at(T.canopy + c[3]) +
          '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0 0 1"/></circle>';
      });
    }
    var sweep = function (cls, d, width, begin, dur) {
      return '<path class="' + cls + '" d="' + d + '" pathLength="1" fill="none" stroke="#fff" stroke-width="' + width +
        '" stroke-dasharray="1 1" stroke-dashoffset="1"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="' +
        dur + 's" begin="' + at(begin) + '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/></path>';
    };
    // Rings drawn from the trunk base (6 o'clock), clockwise.
    var ring = function (r, width, begin) {
      return '<circle cx="983" cy="983" r="' + r + '" pathLength="1" fill="none" stroke="#fff" stroke-width="' + width +
        '" stroke-dasharray="1 1" stroke-dashoffset="1" transform="rotate(90 983 983)"><animate attributeName="stroke-dashoffset" from="1" to="0" dur="' +
        T.ringDur + 's" begin="' + at(begin) + '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"/></circle>';
    };
    var spring = T.spring === null ? "" :
      '<animateTransform attributeName="transform" type="scale" values="1;1.035;0.992;1" keyTimes="0;0.35;0.7;1" dur="0.36s" begin="' +
      at(T.spring) + '" fill="freeze" calcMode="spline" keySplines="0.2 0 0 1;0.4 0 0.6 1;0.4 0 0.6 1"/>';

    return '' +
      '<svg class="intro__emblem" viewBox="-30 -30 2026 2026" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<clipPath id="ixInner"><circle cx="983" cy="983" r="580"/></clipPath>' +
      '<mask id="ixTree" maskUnits="userSpaceOnUse" x="-30" y="-30" width="2026" height="2026">' +
      '<g clip-path="url(#ixInner)">' +
      // Root and trunk band, growing upward from the base of the inner ring.
      '<rect x="400" y="1580" width="1166" height="0" fill="#fff">' +
      '<animate attributeName="y" from="1580" to="' + growTop + '" dur="' + T.growDur + 's" begin="' + at(T.grow) + '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.2 1"/>' +
      '<animate attributeName="height" from="0" to="' + (1580 - growTop) + '" dur="' + T.growDur + 's" begin="' + at(T.grow) + '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.2 1"/>' +
      '</rect>' +
      canopy +
      // Safety net: completes the reveal of the inner disc.
      '<circle cx="983" cy="983" r="580" fill="#fff" opacity="0"><animate attributeName="opacity" from="0" to="1" dur="0.15s" begin="' + at(T.fill) + '" fill="freeze"/></circle>' +
      '</g></mask>' +
      '<mask id="ixFrame" maskUnits="userSpaceOnUse" x="-30" y="-30" width="2026" height="2026">' +
      ring(598, 44, T.ringIn) +
      ring(966, 48, T.ringOut) +
      sweep("ix-text-top", "M 203.4 817.3 A 797 797 0 0 1 1762.6 817.3", 170, T.textTop, T.textDur) +
      sweep("ix-text-bottom", "M 492.3 1611 A 797 797 0 0 0 1473.7 1611", 170, T.textBottom, T.textDur) +
      '</mask>' +
      '</defs>' +
      '<animate id="ixStart" attributeName="opacity" from="1" to="1" dur="0.01s" begin="indefinite"/>' +
      '<g transform="translate(983 983)"><g>' + spring +
      '<g transform="translate(-983 -983)">' +
      // Paper plate: the logo's green ring is too weak on forest-950 (2.06:1, DQ-06).
      '<circle class="intro__plate" cx="983" cy="983" r="0" fill="#f4f1e9">' +
      '<animate attributeName="r" from="0" to="1005" dur="0.4s" begin="' + at(T.plate) + '" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.2 0 0 1"/></circle>' +
      '<image class="ix-masked" href="' + LOGO + '" x="0" y="0" width="1966" height="1966" mask="url(#ixTree)"/>' +
      '<image class="ix-masked" href="' + LOGO + '" x="0" y="0" width="1966" height="1966" mask="url(#ixFrame)"/>' +
      '</g></g></g>' +
      '</svg>';
  }

  function finish(fast) {
    if (done) return;
    done = true;
    clearTimeout(hardStopTimer);
    removeListeners();

    var headerLogo = document.querySelector(".site-logo img");
    var canFly = !fast && !lite && svg && headerLogo && svg.animate;
    root.classList.add("intro-leaving");

    if (canFly) {
      var from = svg.getBoundingClientRect();
      var to = headerLogo.getBoundingClientRect();
      // The plate is 1005/983 of the logo's radius; land the logo itself on the header logo.
      var logoScale = (to.width / from.width) * (2026 / 1966);
      var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      var dy = (to.top + to.height / 2) - (from.top + from.height / 2);
      svg.animate(
        [{ transform: "translate(0, 0) scale(1)" },
         { transform: "translate(" + dx + "px, " + dy + "px) scale(" + logoScale + ")" }],
        { duration: 500, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "forwards" }
      );
      overlay.animate([{ backgroundColor: "rgba(27, 46, 26, 1)" }, { backgroundColor: "rgba(27, 46, 26, 0)" }],
        { duration: 500, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
      setTimeout(cleanup, 500);
    } else {
      overlay.style.transition = "opacity " + (fast ? 200 : 300) + "ms cubic-bezier(0.4, 0, 1, 1)";
      overlay.style.opacity = "0";
      setTimeout(cleanup, fast ? 200 : 300);
    }
  }

  function cleanup() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    root.classList.remove("intro-pending", "intro-running", "intro-leaving");
  }

  function onSkipKey(e) {
    if (e.key === "Tab" || e.key === "Shift") return;
    finish(true);
  }
  function onSkip() { finish(true); }
  function removeListeners() {
    window.removeEventListener("keydown", onSkipKey, true);
    window.removeEventListener("wheel", onSkip, { passive: true });
    window.removeEventListener("touchmove", onSkip, { passive: true });
  }

  function start() {
    if (Date.now() - requestedAt > START_DEADLINE + LOAD_TIMEOUT) { abort(); return; }

    overlay = document.createElement("div");
    overlay.className = "intro" + (lite ? " intro--lite" : "");
    overlay.innerHTML = buildSvg() +
      '<button type="button" class="intro__skip">Intro überspringen</button>';
    document.body.insertBefore(overlay, document.body.firstChild);
    svg = overlay.querySelector("svg");
    skipButton = overlay.querySelector(".intro__skip");

    root.classList.add("intro-running");
    root.classList.remove("intro-pending");
    remember();

    skipButton.addEventListener("click", onSkip);
    overlay.addEventListener("click", onSkip);
    window.addEventListener("keydown", onSkipKey, true);
    window.addEventListener("wheel", onSkip, { passive: true });
    window.addEventListener("touchmove", onSkip, { passive: true });

    var startAnim = svg.getElementById ? svg.getElementById("ixStart") : null;
    if (!startAnim || typeof startAnim.beginElement !== "function") { finish(true); return; }
    startAnim.beginElement();

    setTimeout(function () {
      // Remove the masks: from here on the plain original artwork is shown.
      Array.prototype.forEach.call(svg.querySelectorAll(".ix-masked"), function (img, i) {
        if (i === 0) img.removeAttribute("mask"); else img.parentNode.removeChild(img);
      });
    }, ((T.spring !== null ? T.spring : T.handoff) - 0.05) * 1000);

    setTimeout(function () { finish(false); }, T.handoff * 1000);
    hardStopTimer = setTimeout(function () { finish(true); }, HARD_STOP);
  }

  function preloadThenStart() {
    var img = new Image();
    var settled = false;
    var timer = setTimeout(function () { if (!settled) { settled = true; abort(); } }, LOAD_TIMEOUT);
    img.onload = function () {
      if (settled) return;
      var go = function () { if (!settled) { settled = true; clearTimeout(timer); try { start(); } catch (e) { abort(); } } };
      if (img.decode) img.decode().then(go, go); else go();
    };
    img.onerror = function () { if (!settled) { settled = true; clearTimeout(timer); abort(); } };
    img.src = LOGO;
  }

  try {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", preloadThenStart);
    } else {
      preloadThenStart();
    }
  } catch (e) {
    abort();
  }
})();
