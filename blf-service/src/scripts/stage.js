/*
 * Home opening stage (approved direction D2, "Forest Monument — Living System").
 * Ported from concepts/d2-monument-system/system.js and adapted to the site header,
 * the mobile action bar and a mobile-specific paper reveal.
 *
 * Intro (~2.8 s, once per session, skippable):
 *   Monument: light sweeps across BAUM / LAND / FORST
 *   Emergence: a vertical slit of light opens; the trunk rises against it
 *   Growth: branches, then leaf groups; a soft beam lands on the crown
 * Scroll (sticky stage):
 *   System → Interaction (service rings) → Real work (GAL-13) → Paper
 *
 * Modes:
 *   html.stage-on      cinematic stage (this script running, motion allowed)
 *   html.stage-static  reduced motion: the grown tree is drawn once, everything else is a stacked page
 *   neither            no JavaScript or this script failed: CSS shows the stacked page
 *
 * URL parameters: ?intro=1 replay · ?intro=0 skip · ?t=<s|end> freeze the intro (QA keyframes) ·
 * ?rm=1 reduced motion · ?seed=<n> another tree shape (review only).
 */
(function () {
  "use strict";
  var C = window.BLFMotion, G = window.Growth, html = document.documentElement;
  if (!C || !G) return;                                              // CSS keeps the stacked page
  var q = new URLSearchParams(location.search), tParam = q.get("t");
  function $(s) { return document.querySelector(s); }

  var stage = $("#stage");
  if (!stage) return;
  var sticky = stage.querySelector(".stage__sticky"), svg = $("#stage-rings"), win = $("#stage-window"), hero = $("#stage-hero"),
      treeEl = $("#stage-tree"), slit = $("#stage-slit"), glow = $("#stage-glow"), beam = $("#stage-beam"), skipBtn = $("#stage-skip"),
      paperEl = $("#stage-paper"), paperEdge = $("#stage-edge"), header = $(".site-header"),
      detail = $("#stage-detail"), workEl = $("#stage-work"), workClone = paperEl.querySelector(".stage__work"),
      words = [].slice.call(stage.querySelectorAll(".stage__monument .w")),
      buttons = [].slice.call(document.querySelectorAll("#stage-groups button")),
      groupImgs = [].slice.call(win.querySelectorAll(".stage__photos img")), gWrap = win.querySelector(".stage__photos");
  var NS = "http://www.w3.org/2000/svg";
  var D = 2.8;                                                      // intro length in seconds

  // Verified service names (SITEMAP §2 groups); captions describe the photo only.
  var GROUPS = [
    { svc: "Baumfällung · Stubbenentfernung · Notfällung · Baumpflege · Kronensicherung · Baumkontrolle",
      cap: "Foto: Baumkletterer mit Motorsäge am Stamm einer Kiefer", label: "Baumarbeiten" },
    { svc: "Neuanpflanzung &amp; Freistellen · Grünflächenpflege für Kommunen · Forstwirtschaftliche Pflege",
      cap: "Für diesen Bereich gibt es noch kein Projektfoto. Zu sehen ist der gezeichnete Baum (Illustration).", label: "Grün & Forst" },
    { svc: "Baufeldberäumung · Pflasterarbeiten",
      cap: "Foto: Minibagger auf einem geräumten Grundstück", label: "Bau & Fläche" },
    { svc: "Winterdienst · Straßen- und Flächenreinigung",
      cap: "Foto: Räumfahrzeug mit Schneeschild bei Nacht", label: "Winter & Reinigung" }
  ];

  var SMALL_MQ = "(max-width: 767px), (max-width: 1023px) and (orientation: portrait)";   // phones and portrait tablets (same as stage.css)
  function isSmall() { return window.matchMedia(SMALL_MQ).matches; }
  var small = isSmall();
  var motion = !C.reduced;                                          // cinematic stage vs. static stacked page
  var scrollOn = motion;                                             // scroll scenes active (off for frozen QA keyframes)
  html.classList.remove("stage-intro");
  html.classList.add(motion ? "stage-on" : "stage-static");

  var tree = G.generate(+q.get("seed") || 42, { depth: small ? 7 : 8 });
  var layers = [fit($("#stage-back")), fit($("#stage-front"))];
  function fit(c) { var v = C.fitCanvas(c); return { ctx: v.ctx, w: v.w, h: v.h, el: c }; }
  var grower = new G.Grower(tree, layers, { ox: 0, oy: 0, scale: 1 }, { start: 0.75, span: 1.7 });

  var L = {}, rings = [], labels = [], sysG;
  var introT = 0, scrollP = 0, sel = 0;

  // ---------- grain for the monumental type (restrained: dark specks, max 12 % alpha) ----------
  (function grain() {
    var c = document.createElement("canvas"); c.width = c.height = 160;
    var x = c.getContext("2d"), img = x.createImageData(160, 160), r = C.rng(5);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = r(); img.data[i] = 13; img.data[i + 1] = 22; img.data[i + 2] = 12;
      img.data[i + 3] = v < 0.45 ? Math.round(v * 0.27 * 255) : 0;
    }
    x.putImageData(img, 0, 0);
    stage.querySelector(".stage__monument").style.setProperty("--grain", "url(" + c.toDataURL() + ")");
  })();

  // ---------- layout ----------
  function ringPath(cx, cy, r, wob, seed) {
    var R = C.rng(seed), k = [R() * 6.28, R() * 6.28, R() * 6.28];
    var a = [wob * (0.5 + R()), wob * (0.3 + R() * 0.6), wob * (0.2 + R() * 0.4)], d = "";
    for (var i = 0; i <= 120; i++) {
      var t = i / 120 * Math.PI * 2;
      var rr = r * (1 + a[0] * Math.sin(2 * t + k[0]) + a[1] * Math.sin(3 * t + k[1]) + a[2] * Math.sin(5 * t + k[2]));
      d += (i ? "L" : "M") + (cx + Math.cos(t) * rr).toFixed(1) + " " + (cy + Math.sin(t) * rr).toFixed(1);
    }
    return d + "Z";
  }

  function relRect(el) {                                             // element box relative to the sticky stage
    var a = el.getBoundingClientRect(), b = sticky.getBoundingClientRect();
    return { x0: a.left - b.left, y0: a.top - b.top, x1: a.right - b.left, y1: a.bottom - b.top };
  }

  function layout() {
    small = isSmall();
    var w = sticky.clientWidth, h = motion ? window.innerHeight : treeEl.clientHeight, cv = tree.canopy;
    var Ht = -(cv.cy - cv.ry) + 0.03, S, baseY, ox;
    if (!small) {
      // the crown keeps >= 40 px clear of the right edge of the actual text lines
      var copyR = 0, rng = document.createRange(), sl = sticky.getBoundingClientRect().left;
      [].forEach.call(hero.querySelectorAll(".stage__label, .stage__monument, .stage__lead, .stage__actions"), function (el) {
        rng.selectNodeContents(el);
        [].forEach.call(rng.getClientRects(), function (r) { copyR = Math.max(copyR, r.right - sl); });
      });
      S = Math.min(0.8 * h / Ht, 0.24 * w / cv.rx, (w * 0.67 - copyR - 40) / (cv.rx + 0.06));
      baseY = h * 0.95; ox = w * 0.67 - cv.cx * S;
    } else {
      var topLim = hero.offsetTop + hero.offsetHeight + 18, botLim = h - 80;   // 80: above the mobile action bar
      S = Math.min((botLim - topLim) / Ht, 0.47 * w / cv.rx);
      baseY = botLim; ox = w * 0.5 - cv.cx * S;
    }
    L = { w: w, h: h, S: S, ox: ox, oy: baseY, cx: ox + cv.cx * S, cy: baseY + cv.cy * S };
    L.R = Math.max(cv.rx, cv.ry) * S * 1.04;
    L.step = small ? w * 0.04 : h * 0.03;
    L.Rout = L.R + 18 + 11 * L.step;
    if (!small) { L.k = Math.min(1, 0.47 * h / L.Rout); L.tx = w * 0.66; L.ty = h * 0.5; }
    else { L.k = Math.min(1, 0.5 * w / L.Rout); L.tx = w * 0.5; L.ty = h * 0.33; }
    // No upscaling: the service window shows GAL-02 (844 px wide), the frame GAL-13 (1125 px wide),
    // so their CSS size is capped at native width / device pixel ratio.
    var dpr = window.devicePixelRatio || 1;
    L.r0 = Math.min(L.R * L.k * 0.62, small ? 120 : 165, 844 / dpr / 2);
    if (!small) { L.FW = Math.min(0.34 * w, 520, 0.8 * h * 0.75, 1125 / dpr); L.fx = w * 0.655; L.fy = h * 0.5; }
    else { L.FW = Math.min(0.62 * w, 250, 1125 / dpr); L.fx = w * 0.5; L.fy = 92 + L.FW * 2 / 3; }
    L.FH = L.FW * 4 / 3;

    // canvases cover only the tree's own box (not the viewport): fewer pixels to composite on every scroll frame
    var bx = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    tree.segs.forEach(function (g) { [[g.x0, g.y0], [g.cx, g.cy], [g.x1, g.y1]].forEach(function (pt) {
      bx.x0 = Math.min(bx.x0, pt[0]); bx.x1 = Math.max(bx.x1, pt[0]); bx.y0 = Math.min(bx.y0, pt[1]); bx.y1 = Math.max(bx.y1, pt[1]); }); });
    tree.leaves.forEach(function (l) {                               // leaf groups reach past the branch ends
      var e = l.s * 1.9;
      bx.x0 = Math.min(bx.x0, l.x - e); bx.x1 = Math.max(bx.x1, l.x + e); bx.y0 = Math.min(bx.y0, l.y - e); bx.y1 = Math.max(bx.y1, l.y + e);
    });
    var mg = 0.03;                                                  // stroke widths and anti-aliasing
    var box = { x: Math.floor(L.ox + (bx.x0 - mg) * S), y: Math.floor(L.oy + (bx.y0 - mg) * S) };
    box.w = Math.ceil((bx.x1 - bx.x0 + 2 * mg) * S); box.h = Math.ceil((bx.y1 - bx.y0 + 2 * mg) * S);
    layers[1].el.hidden = false;                                     // a hidden canvas would measure 0 × 0
    layers.forEach(function (Ly) {
      Object.assign(Ly.el.style, { left: box.x + "px", top: box.y + "px", width: box.w + "px", height: box.h + "px" });
      var v = C.fitCanvas(Ly.el); Ly.ctx = v.ctx; Ly.w = v.w; Ly.h = v.h;
    });
    grower.view = { ox: L.ox - box.x, oy: L.oy - box.y, scale: S };
    treeEl.style.setProperty("--ox", L.cx + "px"); treeEl.style.setProperty("--oy", L.cy + "px");
    svg.style.transformOrigin = L.cx + "px " + L.cy + "px";
    slit.style.left = L.ox + "px"; slit.style.setProperty("--baseY", L.oy + "px");
    Object.assign(glow.style, { left: (L.cx - L.R * 1.4) + "px", top: (L.cy - L.R * 1.4) + "px", width: L.R * 2.8 + "px", height: L.R * 2.8 + "px" });
    var bmx = L.cx + L.R * 0.28, bmy = L.cy - L.R * 0.5;             // the shaft fades out behind the upper-right crown
    Object.assign(beam.style, { left: bmx + "px", top: (bmy - h * 1.5) + "px", height: h * 1.5 + "px" });
    stage.style.setProperty("--gx", (L.cx / w * 100).toFixed(1) + "%");
    if (motion) {
      L.copy = relRect(workEl);                                      // for the mobile paper reveal
      L.hh = header ? header.offsetHeight : 0;
      // the header switches to paper once the reveal covers most of its width (waiting for the far
      // corners left a dark bar over an already paper page)
      L.headerFar = Math.hypot(w * 0.35, L.fy - L.hh);
    }
    buildSystem();
  }

  function buildSystem() {
    svg.innerHTML = ""; svg.__sv = {};
    svg.setAttribute("viewBox", "0 0 " + L.w + " " + L.h);
    sysG = document.createElementNS(NS, "g"); svg.appendChild(sysG);
    rings = []; labels = [];
    var i, p;
    for (i = 0; i < 22; i++) {                                     // 12 growth rings (4 bands × 3), then 10 contours
      var contour = i >= 12;
      var r = contour ? L.Rout + (i - 11) * L.step * 1.7 : L.R + 18 + i * L.step;
      // eccentric, slightly irregular growth: rings drift like a real cross-section
      var ex = contour ? 0 : i * 0.9, ey = contour ? 0 : -i * 0.6;
      p = document.createElementNS(NS, "path");
      p.setAttribute("d", ringPath(L.cx + ex, L.cy + ey, r, contour ? 0.04 + (i - 12) * 0.011 : 0.01 + i * 0.0016, 300 + i));
      p.setAttribute("class", contour ? "contour" : "ring" + (i % 3 === 1 ? " major" : ""));
      p.setAttribute("pathLength", "1");
      p.style.strokeDasharray = "1 1"; p.style.strokeDashoffset = "1";
      if (!contour) p.setAttribute("id", "stage-ring" + i);
      sysG.appendChild(p);
      rings.push({ el: p, i: i, contour: contour, band: contour ? -1 : Math.floor(i / 3) });
    }
    var offsets = small ? [75, 75, 75, 75] : [72, 79, 66, 84];
    for (var b = 0; b < 4; b++) {
      // generous invisible hit band per service group
      var hp = document.createElementNS(NS, "path");
      hp.setAttribute("d", ringPath(L.cx + (3 * b + 1) * 0.9, L.cy - (3 * b + 1) * 0.6, L.R + 18 + (3 * b + 1) * L.step, 0.01, 300 + 3 * b + 1));
      hp.setAttribute("class", "hit"); hp.setAttribute("stroke-width", L.step * 3);
      hp.dataset.g = b; sysG.appendChild(hp);
      var tx = document.createElementNS(NS, "text"), tp = document.createElementNS(NS, "textPath");
      tp.setAttribute("href", "#stage-ring" + (3 * b + 1)); tp.setAttribute("startOffset", offsets[b] + "%");
      tx.setAttribute("text-anchor", "middle"); tx.setAttribute("dy", "-8");
      tx.style.fontSize = ((small ? 15 : 12.5) / L.k).toFixed(1) + "px";   // larger on phones; dark halo keeps ring lines off the letters
      tx.style.strokeWidth = (4 / L.k).toFixed(2) + "px";
      tp.textContent = GROUPS[b].label; tx.appendChild(tp); tx.dataset.g = b;
      sysG.appendChild(tx); labels.push(tx);
      [hp, tx].forEach(function (el) {
        el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") select(+el.dataset.g); });
        el.addEventListener("click", function () { select(+el.dataset.g); });
      });
    }
    svg.style.setProperty("--onw", (2.4 / L.k).toFixed(2) + "px");
    var base = 1 / L.k;                                             // keep visual stroke widths stable under the group scale
    rings.forEach(function (R) { R.el.style.strokeWidth = ((R.contour ? 0.9 : R.i % 3 === 1 ? 1.6 : 1.1) * base).toFixed(2); });
    select(sel, true);
  }

  // ---------- interaction ----------
  function select(g, silent) {
    sel = g;
    buttons.forEach(function (b, i) { b.setAttribute("aria-pressed", i === g ? "true" : "false"); });
    if (!silent) detail.innerHTML = '<p class="stage__svc">' + GROUPS[g].svc + '</p><p class="stage__cap">' + GROUPS[g].cap + "</p>";
    rings.forEach(function (R) { R.el.classList.toggle("on", R.band === g); });
    labels.forEach(function (t, i) { t.classList.toggle("on", i === g); t.style.display = small && i !== g ? "none" : ""; });
    groupImgs.forEach(function (im) { im.classList.toggle("on", +im.dataset.g === g); });
    win.classList.toggle("is-illustration", g === 1);
    paint();
  }
  buttons.forEach(function (b) { b.addEventListener("click", function () { select(+b.dataset.g); }); });

  function stageY(p) { return stage.offsetTop + p * (stage.offsetHeight - window.innerHeight); }
  // keyboard users reach the services even if the scene is not on screen yet
  $("#stage-groups").addEventListener("focusin", function () {
    if (scrollOn && !stage.classList.contains("interactive")) window.scrollTo({ top: stageY(0.38), behavior: "instant" });
  });
  [].forEach.call(document.querySelectorAll("[data-stage-goto]"), function (a) {
    a.addEventListener("click", function (e) {
      if (!scrollOn) return;
      e.preventDefault(); finishIntro(); window.scrollTo({ top: stageY(0.38), behavior: "instant" });
      setTimeout(function () { buttons[sel].focus({ preventScroll: true }); }, 50);
    });
  });

  // ---------- painting ----------
  function lerp(a, b, t) { return a + (b - a) * t; }
  // writes a style value only when it changed: scroll frames then touch just what moves
  function sv(el, k, v) {
    var c = el.__sv || (el.__sv = {});
    if (c[k] !== v) { c[k] = v; el.style.setProperty(k, v); }
  }
  function boxDist(cx, cy, b) {                                      // nearest and farthest distance from a point to a box
    var dx = Math.max(b.x0 - cx, 0, cx - b.x1), dy = Math.max(b.y0 - cy, 0, cy - b.y1);
    var far = Math.max(Math.hypot(b.x0 - cx, b.y0 - cy), Math.hypot(b.x1 - cx, b.y0 - cy), Math.hypot(b.x0 - cx, b.y1 - cy), Math.hypot(b.x1 - cx, b.y1 - cy));
    return { near: Math.hypot(dx, dy), far: far };
  }
  function paint() {
    var t = introT, p = scrollOn ? scrollP : 0, seg = C.seg, ease = C.ease;
    // intro
    words.forEach(function (w, i) { sv(w, "--wl", ease(seg(t, 0.05 + i * 0.14, 0.75)).toFixed(3)); });
    sv(stage, "--slit", ease(seg(t, 0.45, 0.5)).toFixed(3));
    var sysIn = C.easeInOut(seg(p, 0.05, 0.17));
    sv(stage, "--slitA", (seg(t, 0.45, 0.2) * (1 - seg(t, 1.8, 0.7))).toFixed(3));
    var bm = ease(seg(t, 1.55, 0.8));
    sv(stage, "--beam", (bm * (1 - seg(p, 0.04, 0.1))).toFixed(3));
    sv(stage, "--beamW", (0.1 + 0.9 * bm).toFixed(3));
    sv(stage, "--glow", (ease(seg(t, 1.7, 0.8)) * (1 - seg(p, 0.55, 0.1))).toFixed(3));
    if (!motion) return;                                             // static mode: the rest is plain layout

    var copy = ease(seg(t, 2.1, 0.6)) * (1 - seg(p, 0.03, 0.07));
    sv(hero, "--copy", copy.toFixed(3));
    sv(hero, "--words", (1 - 0.9 * seg(p, 0.04, 0.12)).toFixed(3));
    sv(hero, "visibility", copy < 0.01 && seg(p, 0.04, 0.12) >= 1 ? "hidden" : "visible");

    // system: tree and rings share one transform (scale k around the crown, then move to the stage centre).
    // Both are composited layers, so moving them does not repaint the canvas or the rings.
    var kk = lerp(1, L.k, sysIn), dx = (L.tx - L.cx) * sysIn, dy = (L.ty - L.cy) * sysIn;
    var tf = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(" + kk.toFixed(4) + ")";
    sv(treeEl, "transform", tf); sv(svg, "transform", tf);
    rings.forEach(function (R) {
      var d = R.contour ? ease(seg(p, 0.12 + (R.i - 12) * 0.008, 0.08)) : ease(seg(p, 0.06 + R.i * 0.007, 0.07));
      sv(R.el, "stroke-dashoffset", (1 - d).toFixed(3));
    });
    var lab = seg(p, 0.22, 0.04) * (1 - seg(p, 0.53, 0.03));
    labels.forEach(function (x) { sv(x, "opacity", lab.toFixed(2)); });
    sv(svg, "opacity", (1 - 0.82 * seg(p, 0.55, 0.12)).toFixed(3));

    // interaction
    var panel = seg(p, 0.23, 0.04) * (1 - seg(p, 0.52, 0.04));
    sv(stage, "--panel", panel.toFixed(3));
    stage.classList.toggle("interactive", panel > 0.5);
    svg.classList.toggle("show-sel", panel > 0.05);                  // the selected band is highlighted only while the services are on screen
    var dim = sel === 1 ? 1 : 0.42;
    sv(treeEl, "opacity", ((1 - panel * (1 - dim)) * (1 - seg(p, 0.55, 0.1))).toFixed(3));

    // core window → real-work frame
    var open = ease(seg(p, 0.2, 0.06)), m = C.easeInOut(seg(p, 0.55, 0.13));
    var cx = lerp(L.tx, L.fx, m), cy = lerp(L.ty, L.fy, m);
    var W = lerp(2 * L.r0 * open, L.FW, m), H = lerp(2 * L.r0 * open, L.FH, m);
    if (W < 1) { sv(win, "visibility", "hidden"); }
    else {
      sv(win, "visibility", "visible");
      sv(win, "left", (cx - W / 2).toFixed(1) + "px"); sv(win, "top", (cy - H / 2).toFixed(1) + "px");
      sv(win, "width", W.toFixed(1) + "px"); sv(win, "height", H.toFixed(1) + "px");
      sv(win, "border-radius", lerp(L.r0, 4, m).toFixed(1) + "px");
      sv(win, "box-shadow", "0 0 0 1px rgba(221,158,9," + (0.75 * (1 - m)).toFixed(2) + ")");
    }
    var gi = (1 - seg(p, 0.55, 0.04)) * (sel === 1 ? 0 : 1);
    sv(win, "--gi", gi.toFixed(3));
    // service photos leave before the frame grows past their size limit (GAL-02 is only 844 px wide)
    sv(gWrap, "visibility", gi < 0.01 ? "hidden" : "visible");
    sv(win, "--wi", seg(p, 0.555, 0.05).toFixed(3));

    // real work, then paper grows out of the photo frame as a widening ring (no grey cross-fade)
    var wv = seg(p, 0.64, 0.06);
    var pg = C.easeInOut(seg(p, 0.74, 0.16));
    var far = Math.max(Math.hypot(L.fx, L.fy), Math.hypot(L.w - L.fx, L.fy), Math.hypot(L.fx, L.h - L.fy), Math.hypot(L.w - L.fx, L.h - L.fy)) + 4;
    var pr = pg * far;
    // Mobile strategy: there the edge would cross the copy almost horizontally, through the heading.
    // So on small screens the copy rests (fades out) while the edge passes over its box and returns,
    // dark on paper, once the edge is past. On wider screens the edge may cross the text: both
    // versions are fully legible on their side of the edge.
    var rest = 1;
    if (small && L.copy) {
      var bd = boxDist(L.fx, L.fy, L.copy);
      rest = 1 - seg(pr, bd.near - 56, 56) + seg(pr, bd.far, 56);
    }
    sv(stage, "--work", (wv * rest).toFixed(3));
    sv(workClone, "opacity", rest.toFixed(3));
    sv(workEl, "visibility", wv * rest < 0.01 ? "hidden" : "visible");   // the panel stays focusable: focusing it scrolls it into view
    sv(paperEl, "visibility", pg > 0 ? "visible" : "hidden");
    sv(paperEl, "--pr", pr.toFixed(1) + "px"); sv(paperEl, "--pcx", L.fx.toFixed(1) + "px"); sv(paperEl, "--pcy", L.fy.toFixed(1) + "px");
    sv(paperEdge, "visibility", pg > 0 && pg < 1 ? "visible" : "hidden");
    sv(paperEdge, "left", (L.fx - pr).toFixed(1) + "px"); sv(paperEdge, "top", (L.fy - pr).toFixed(1) + "px");
    sv(paperEdge, "width", (2 * pr).toFixed(1) + "px"); sv(paperEdge, "height", (2 * pr).toFixed(1) + "px");
    win.classList.toggle("over-paper", pg > 0);
    updateHeader(pr);
  }

  // The site header is light-on-dark while the dark stage is under it, and paper everywhere else.
  function updateHeader(pr) {
    var r = stage.getBoundingClientRect(), hh = L.hh || 0;
    var dark = r.top <= hh && r.bottom > hh;
    if (dark && motion && pr >= L.headerFar) dark = false;           // the paper reveal has covered the header strip
    html.classList.toggle("header-dark", dark);
  }

  // ---------- intro ----------
  var running = false, raf = 0, t0 = 0;
  function frame(now) {
    introT = Math.min(D, (now - t0) / 1000);
    grower.step(introT); paint();
    if (introT < D) raf = requestAnimationFrame(frame); else finishIntro();
  }
  // After the intro the two depth layers are merged into one canvas: one layer less to composite while scrolling.
  function bake() {
    var b = layers[0], f = layers[1];
    if (f.el.hidden) return;
    b.ctx.save(); b.ctx.setTransform(1, 0, 0, 1, 0, 0); b.ctx.drawImage(f.el, 0, 0); b.ctx.restore();
    f.el.hidden = true;
  }
  function redraw(t) {
    layers[1].el.hidden = false;
    grower.seek(t);
    if (t >= D) bake();
  }
  function finishIntro() {
    if (running) { cancelAnimationFrame(raf); running = false; }
    if (introT < D) { introT = D; grower.step(D); paint(); }
    bake();
    skipBtn.hidden = true;
    html.classList.remove("intro-running");
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.removeEventListener(ev, onInput); });
  }
  function onInput(e) {
    if (e.type === "keydown" && ["Escape", " ", "PageDown", "ArrowDown", "End", "Enter"].indexOf(e.key) < 0) return;
    finishIntro();
  }

  layout();
  var seen = false;
  try { seen = sessionStorage.getItem("blf-intro") === "1"; } catch (e) {}
  if (q.get("intro") === "1") seen = false;
  if (q.get("intro") === "0") seen = true;

  if (tParam !== null) {                                            // frozen keyframe (QA)
    introT = tParam === "end" ? D : Math.min(D, parseFloat(tParam) || 0);
    redraw(introT);
    if (introT < D) { html.classList.add("frozen"); scrollOn = false; }
  } else if (!motion || seen) {
    introT = D; redraw(D);
  } else {
    try { sessionStorage.setItem("blf-intro", "1"); } catch (e) {}
    running = true; skipBtn.hidden = false; html.classList.add("intro-running");
    skipBtn.addEventListener("click", finishIntro);
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, onInput, { passive: true }); });
    t0 = performance.now(); raf = requestAnimationFrame(frame);
  }
  paint();

  if (scrollOn) C.scrollScene(stage, function (p) {
    scrollP = p;
    if (running && p > 0.002) finishIntro();
    paint();
  });
  else window.addEventListener("scroll", function () { updateHeader(0); }, { passive: true });
  updateHeader(0);

  if (document.fonts) document.fonts.ready.then(function () { layout(); redraw(introT); paint(); updateHeader(0); });

  var rz;
  window.addEventListener("resize", function () {
    clearTimeout(rz);
    rz = setTimeout(function () { layout(); redraw(introT); paint(); }, 120);
  });
})();
