/*
 * Direction D, "Forest Monument — Living System": scene controller.
 *
 * Intro (~2.8 s, once per session, skippable):
 *   Monument: light sweeps across BAUM / LAND / FORST
 *   Emergence: a vertical slit of light opens; the trunk rises against it
 *   Growth: branches, then leaf groups; a narrow beam finds the crown
 * Scroll (sticky stage):
 *   System → Interaction → Real work → Paper
 *
 * URL parameters: ?t=<s|end> freeze the intro (keyframes) · ?rm=1 reduced motion ·
 * ?intro=1 replay the intro even if it already ran in this session.
 */
(function () {
  "use strict";
  var C = window.Concept, G = window.Growth, html = document.documentElement;
  var q = new URLSearchParams(location.search), tParam = q.get("t");
  function $(s) { return document.querySelector(s); }

  var stage = $("#stage"), sticky = $(".sticky"), svg = $("#sys"), win = $("#window"), hero = $("#hero"),
      treeEl = $("#tree"), slit = $("#slit"), glow = $("#glow"), beam = $("#beam"), skipBtn = $("#skip"),
      detail = $("#detail"), workEl = $("#work"), words = [].slice.call(document.querySelectorAll(".monument .w")),
      buttons = [].slice.call(document.querySelectorAll("#groups button")),
      groupImgs = [].slice.call(win.querySelectorAll(".g img")), gWrap = win.querySelector(".g");
  var NS = "http://www.w3.org/2000/svg";
  var D = 2.8;                                                      // intro length in seconds

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

  function isSmall() { return window.innerWidth < 768 || (window.innerWidth < 1024 && window.innerHeight > window.innerWidth); }   // phones and portrait tablets
  var small = isSmall();
  var tree = G.generate(+q.get("seed") || 42, { depth: small ? 8 : 9 });   // ?seed= only for review
  var layers = [fit($("#back")), fit($("#front"))];
  function fit(c) { var v = C.fitCanvas(c); return { ctx: v.ctx, w: v.w, h: v.h, el: c }; }
  var grower = new G.Grower(tree, layers, { ox: 0, oy: 0, scale: 1 }, { start: 0.75, span: 1.7 });

  var L = {}, rings = [], labels = [], hits = [], sysG;
  var introT = 0, scrollP = 0, sel = 0, scrollOn = false;

  // ---------- grain for the monumental type (restrained: dark specks, max 12 % alpha) ----------
  (function grain() {
    var c = document.createElement("canvas"); c.width = c.height = 160;
    var x = c.getContext("2d"), img = x.createImageData(160, 160), r = C.rng(5);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = r(); img.data[i] = 13; img.data[i + 1] = 22; img.data[i + 2] = 12;
      img.data[i + 3] = v < 0.45 ? Math.round(v * 0.27 * 255) : 0;
    }
    x.putImageData(img, 0, 0);
    $(".monument").style.setProperty("--grain", "url(" + c.toDataURL() + ")");
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

  function layout() {
    small = isSmall();
    var w = sticky.clientWidth, h = window.innerHeight, cv = tree.canopy;
    if (html.classList.contains("rm") || !html.classList.contains("js")) h = treeEl.clientHeight;
    var Ht = -(cv.cy - cv.ry) + 0.03, S, baseY, ox;
    if (!small) {
      S = Math.min(0.8 * h / Ht, 0.24 * w / cv.rx);
      baseY = h * 0.95; ox = w * 0.67 - cv.cx * S;
    } else {
      var topLim = hero.offsetTop + hero.offsetHeight + 18, botLim = h - 80;
      S = Math.min((botLim - topLim) / Ht, 0.47 * w / cv.rx);
      baseY = botLim; ox = w * 0.5 - cv.cx * S;
    }
    L = { w: w, h: h, S: S, ox: ox, oy: baseY, cx: ox + cv.cx * S, cy: baseY + cv.cy * S };
    L.R = Math.max(cv.rx, cv.ry) * S * 1.04;
    L.step = small ? w * 0.04 : h * 0.03;
    L.Rout = L.R + 18 + 11 * L.step;
    if (!small) { L.k = Math.min(1, 0.47 * h / L.Rout); L.tx = w * 0.66; L.ty = h * 0.5; }
    else { L.k = Math.min(1, 0.5 * w / L.Rout); L.tx = w * 0.5; L.ty = h * 0.33; }
    L.r0 = Math.min(L.R * L.k * 0.62, small ? 120 : 165);           // service window: <= 330 CSS px (GAL-02 is 844 px wide)
    if (!small) { L.FW = Math.min(0.34 * w, 520, 0.8 * h * 0.75); L.fx = w * 0.655; L.fy = h * 0.5; }
    else { L.FW = Math.min(0.62 * w, 250); L.fx = w * 0.5; L.fy = 92 + L.FW * 2 / 3; }
    L.FH = L.FW * 4 / 3;

    // canvases cover only the tree's own box (not the viewport): fewer pixels to composite on every scroll frame
    var bx = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    tree.segs.forEach(function (g) { [[g.x0, g.y0], [g.cx, g.cy], [g.x1, g.y1]].forEach(function (pt) {
      bx.x0 = Math.min(bx.x0, pt[0]); bx.x1 = Math.max(bx.x1, pt[0]); bx.y0 = Math.min(bx.y0, pt[1]); bx.y1 = Math.max(bx.y1, pt[1]); }); });
    var mg = 0.06;                                                  // leaves and stroke widths reach past the branch ends
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
    Object.assign(beam.style, { left: L.cx + "px", top: (L.cy - h * 1.5) + "px", height: h * 1.5 + "px" });
    stage.style.setProperty("--gx", (L.cx / w * 100).toFixed(1) + "%");
    buildSystem();
  }

  function buildSystem() {
    svg.innerHTML = ""; svg.__sv = {};
    svg.setAttribute("viewBox", "0 0 " + L.w + " " + L.h);
    sysG = document.createElementNS(NS, "g"); svg.appendChild(sysG);
    rings = []; labels = []; hits = [];
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
      if (!contour) p.setAttribute("id", "d-ring" + i);
      sysG.appendChild(p);
      rings.push({ el: p, i: i, contour: contour, band: contour ? -1 : Math.floor(i / 3) });
    }
    var offsets = small ? [75, 75, 75, 75] : [72, 79, 66, 84];
    for (var b = 0; b < 4; b++) {
      // generous invisible hit band per service group
      var hp = document.createElementNS(NS, "path");
      hp.setAttribute("d", ringPath(L.cx + (3 * b + 1) * 0.9, L.cy - (3 * b + 1) * 0.6, L.R + 18 + (3 * b + 1) * L.step, 0.01, 300 + 3 * b + 1));
      hp.setAttribute("class", "hit"); hp.setAttribute("stroke-width", L.step * 3);
      hp.dataset.g = b; sysG.appendChild(hp); hits.push(hp);
      var tx = document.createElementNS(NS, "text"), tp = document.createElementNS(NS, "textPath");
      tp.setAttribute("href", "#d-ring" + (3 * b + 1)); tp.setAttribute("startOffset", offsets[b] + "%");
      tx.setAttribute("text-anchor", "middle"); tx.setAttribute("dy", "-8");
      if (small) tx.style.fontSize = (13 / L.k).toFixed(1) + "px"; else tx.style.fontSize = (12.5 / L.k).toFixed(1) + "px";
      tp.textContent = GROUPS[b].label; tx.appendChild(tp); tx.dataset.g = b;
      sysG.appendChild(tx); labels.push(tx);
      // on small screens only the selected label shows, so the four never collide
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
    if (!silent) detail.innerHTML = '<p class="svc">' + GROUPS[g].svc + '</p><p class="cap">' + GROUPS[g].cap + "</p>";
    rings.forEach(function (R) {
      R.el.classList.toggle("on", R.band === g);
    });
    labels.forEach(function (t, i) { t.classList.toggle("on", i === g); t.style.display = small && i !== g ? "none" : ""; });
    groupImgs.forEach(function (im) { im.classList.toggle("on", +im.dataset.g === g); });
    paint();
  }
  buttons.forEach(function (b) { b.addEventListener("click", function () { select(+b.dataset.g); }); });

  function stageY(p) { return stage.offsetTop + p * (stage.offsetHeight - window.innerHeight); }
  // keyboard users reach the services even if the scene is not on screen yet
  $("#groups").addEventListener("focusin", function () {
    if (scrollOn && !stage.classList.contains("interactive")) window.scrollTo(0, stageY(0.38));
  });
  document.querySelectorAll("[data-goto]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (!scrollOn) return;
      e.preventDefault(); finishIntro(); window.scrollTo(0, stageY(0.38));
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
    stage.classList.toggle("interactive", scrollOn && panel > 0.5);
    svg.classList.toggle("show-sel", panel > 0.05);                  // the selected band is highlighted only while the services are on screen
    var dim = sel === 1 ? 1 : 0.42;
    sv(treeEl, "opacity", ((1 - panel * (1 - dim)) * (1 - seg(p, 0.55, 0.1))).toFixed(3));

    // core window → real-work frame
    var open = ease(seg(p, 0.2, 0.06)), m = C.easeInOut(seg(p, 0.55, 0.13));
    var cx = lerp(L.tx, L.fx, m), cy = lerp(L.ty, L.fy, m);
    var W = lerp(2 * L.r0 * open, L.FW, m), H = lerp(2 * L.r0 * open, L.FH, m);
    if (!scrollOn) { sv(win, "visibility", C.reduced ? "visible" : "hidden"); }   // reduced motion: CSS places the window in the flow
    else if (W < 1) { sv(win, "visibility", "hidden"); }
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
    if (scrollOn) sv(gWrap, "visibility", gi < 0.01 ? "hidden" : "visible");
    sv(win, "--wi", seg(p, 0.555, 0.05).toFixed(3));

    // real work, then the shift to paper (copy dips out while the ground changes, so contrast never sags)
    var work = seg(p, 0.64, 0.06), pg = seg(p, 0.76, 0.14);
    var onPaper = p >= 0.81;
    html.classList.toggle("paper", scrollOn && onPaper);
    sv(stage, "--ground", (1 - pg).toFixed(3));
    var wv = onPaper ? seg(p, 0.83, 0.06) : work * (1 - seg(p, 0.76, 0.05));
    sv(stage, "--work", wv.toFixed(3));
    if (scrollOn) sv(workEl, "visibility", wv < 0.01 ? "hidden" : "visible");   // the panel stays focusable: focusing it scrolls it into view
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
    ["wheel", "touchstart", "keydown"].forEach(function (ev) { window.removeEventListener(ev, onInput); });
  }
  function onInput(e) {
    if (e.type === "keydown" && ["Escape", " ", "PageDown", "ArrowDown", "End", "Enter"].indexOf(e.key) < 0) return;
    finishIntro();
  }

  layout();
  var seen = false;
  try { seen = sessionStorage.getItem("blf-d-intro") === "1" && q.get("intro") !== "1"; } catch (e) {}

  if (tParam !== null) {                                            // frozen keyframe
    introT = tParam === "end" ? D : Math.min(D, parseFloat(tParam) || 0);
    redraw(introT);
    if (introT < D) html.classList.add("frozen"); else scrollOn = !C.reduced;
  } else if (C.reduced || seen) {
    introT = D; redraw(D); scrollOn = !C.reduced;
  } else {
    try { sessionStorage.setItem("blf-d-intro", "1"); } catch (e) {}
    scrollOn = true; running = true; skipBtn.hidden = false;
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

  if (document.fonts) document.fonts.ready.then(function () { layout(); redraw(introT); paint(); });

  var rz;
  window.addEventListener("resize", function () {
    clearTimeout(rz);
    rz = setTimeout(function () { layout(); redraw(introT); paint(); }, 120);
  });
})();
