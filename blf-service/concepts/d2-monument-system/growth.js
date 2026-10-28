/*
 * Direction D, "Forest Monument — Living System": the growing tree.
 * An artwork related to the emblem's tree (round crown, visible roots). It is NOT
 * the logo and is never presented as the logo; the authentic emblem appears
 * separately and unaltered.
 *
 * D2 (revision of D): branches grow inside a slightly lobed, oval crown envelope, so the
 * silhouette closes into a round crown like the emblem's tree instead of a drooping
 * umbrella; leaves facing the light (upper right) are lit, the far side is shaded.
 *
 * Performance (fixes the frame drops measured in concept A):
 *   - branches are drawn incrementally onto persistent canvases: each frame only
 *     paints the piece a growing tip added since the previous frame;
 *   - leaves are opaque and drawn once per frame only while they are opening;
 *   - finished work is never redrawn; a full redraw happens only on resize or seek.
 * Colours are opaque (pre-mixed against the dark ground), so overdraw cannot
 * darken overlaps and the result does not depend on drawing order.
 */
(function () {
  "use strict";
  var C = window.Concept;

  /*
   * Unit space: trunk base at (0,0), up is negative y, the tree is about 1 unit
   * tall. Times are in "growth units" and are rescaled to seconds by the caller.
   */
  function generate(seed, o) {
    var r = C.rng(seed);
    var r2 = C.rng(seed + 7919);                                    // separate stream for the foliage masses: the crown shape stays as reviewed
    var maxDepth = o.depth;
    var segs = [], leaves = [], clusters = [];
    var lean = (r() - 0.5) * 0.16;                                  // whole-crown asymmetry
    // crown envelope: an oval, wider than tall, with soft irregular lobes (never a perfect egg)
    // refinement: the main lobe is phased so the top of the crown always bulges (a random dip there read as a heart)
    var E = { x: lean * 0.25, y: -0.63, rx: 0.47, ry: 0.34, p1: (r() - 0.5) * 1.0, p2: r() * 6.28 };
    function lobe(th) { return 1 + 0.05 * Math.sin(3 * th + E.p1) + 0.03 * Math.sin(5 * th + E.p2); }
    function inside(x, y, k) {
      var u = (x - E.x) / E.rx, v = (y - E.y) / E.ry;
      return Math.sqrt(u * u + v * v) <= (k || 1) * lobe(Math.atan2(v, u));
    }

    function branch(x, y, ang, len, w, depth, t0, cluster, layer) {
      var atEdge = false;
      if (depth >= 2) {
        // keep every tip inside the crown: first steer towards its centre, then shorten
        for (var tries = 0; tries < 8 && !inside(x + Math.sin(ang) * len, y - Math.cos(ang) * len, 0.86); tries++) {   // refinement: tips end under the foliage, never on its outline
          if (tries % 2 === 0) {
            var toC = Math.atan2(E.x - x, -(E.y - y));
            var dA = Math.atan2(Math.sin(toC - ang), Math.cos(toC - ang));
            ang += dA * 0.35;
          } else len *= 0.72;
          atEdge = true;
        }
      }
      var x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
      var bend = (r() - 0.5) * 0.34 * len;
      var cx = (x + x1) / 2 + Math.cos(ang) * bend, cy = (y + y1) / 2 + Math.sin(ang) * bend;
      var dur = 0.12 + len * 0.6;
      if (depth === 3) layer = r() < 0.32 ? 0 : 1;                  // two depth layers: back and front
      segs.push({ x0: x, y0: y, cx: cx, cy: cy, x1: x1, y1: y1, w0: w, w1: w * 0.7, depth: depth,
                  t0: t0, t1: t0 + dur, layer: layer, drawn: 0 });
      if (depth >= maxDepth || (atEdge && depth >= 2)) return;   // a shoot that reached the crown edge stops: no wire outline, no twig brooms
      var kids = depth < 2 ? 2 : (r() < 0.3 ? 3 : (depth > 3 && r() < 0.14 ? 1 : 2));  // pruning leaves gaps
      for (var k = 0; k < kids; k++) {
        var dir = kids === 1 ? (r() < 0.5 ? -1 : 1) : kids === 3 ? (k - 1) : (k === 0 ? -1 : 1);
        var spread = dir * (0.26 + r() * 0.34) + (r() - 0.5) * 0.18;
        if (depth === 0) spread *= 0.85;
        var a = ang * (depth < 2 ? 0.95 : 0.85) + spread + (depth < 3 ? lean : 0);
        if (depth >= 2) {
          // inside the crown, shoots grow outward from its centre, so tips reach every side of the oval, not just the top
          var rad = Math.atan2(x1 - E.x, -(y1 - E.y));
          var dR = Math.atan2(Math.sin(rad - a), Math.cos(rad - a));
          a += dR * (depth >= 4 ? 0.55 : 0.35);
        }
        branch(x1, y1, a, len * (depth < 2 ? 0.74 + r() * 0.12 : 0.7 + r() * 0.16), w * (0.6 + r() * 0.1), depth + 1, t0 + dur * 0.78, cluster, layer);
      }
    }
    // roots: short, low, like the emblem's tree standing on the ground
    for (var q = 0; q < 4; q++) {
      var side = q % 2 ? 1 : -1, a = side * (1.75 + r() * 0.5);
      segs.push({ x0: side * 0.012, y0: -0.012, cx: side * 0.05, cy: 0.004, x1: Math.sin(a) * (0.07 + r() * 0.05),
                  y1: 0.012 + r() * 0.01, w0: 0.026, w1: 0.006, depth: 1, t0: 0.02 + q * 0.03, t1: 0.32 + q * 0.03,
                  layer: 1, drawn: 0 });
    }
    branch(0, 0, (r() - 0.5) * 0.04, 0.26, 0.07, 0, 0, -1, 1);

    // Leaf groups fill the whole crown oval (not only the branch tips, which made a hollow shell):
    // group centres keep a minimum distance, so groups stay distinct with small gaps between them.
    var twigs = segs.filter(function (g) { return g.depth >= maxDepth - 3; });
    // refinement: group centres come from their own random stream (branch changes no longer reshuffle the crown)
    // and use best-candidate sampling, which covers the oval evenly: no holes or notches, still irregular
    var r3 = C.rng(seed + 104729), pts = [], NC = 72;
    while (pts.length < NC) {
      var best = null, bestD = -1;
      for (var c3 = 0; c3 < 14; c3++) {
        var px = E.x + (r3() * 2 - 1) * E.rx, py = E.y + (r3() * 2 - 1) * E.ry;
        if (!inside(px, py)) { c3--; continue; }
        var dmin = Infinity;
        pts.forEach(function (q) { dmin = Math.min(dmin, Math.hypot(q.x - px, q.y - py)); });
        if (dmin > bestD) { bestD = dmin; best = { x: px, y: py }; }
      }
      pts.push(best);
    }
    pts.forEach(function (pt) {
      var tw = twigs[0], best = Infinity;                           // the twig that "carries" this group sets its timing
      twigs.forEach(function (g) { var d = Math.hypot(g.x1 - pt.x, g.y1 - pt.y); if (d < best) { best = d; tw = g; } });
      var u = (pt.x - E.x) / E.rx, v = (pt.y - E.y) / E.ry, rho = Math.sqrt(u * u + v * v) / lobe(Math.atan2(v, u));
      var cl = clusters.length, layer = rho < 0.55 || r() < 0.18 ? 0 : 1;   // inner groups sit deeper, in the back layer
      clusters.push({ tip: tw.t1, order: r(), tone: Math.floor(r() * 3), x: pt.x, y: pt.y });
      // refinement: a soft, darker foliage mass under the group, so its leaves read as one connected clump
      // (only under front-layer groups: the mass is on the back canvas, so it can never cover its own leaves)
      var jit = []; for (var q2 = 0; q2 < 9; q2++) jit.push(0.78 + r2() * 0.32);
      var mrot = r2() * 6.283, mshade = r2();
      if (layer === 1) leaves.push({ mass: true, x: pt.x, y: pt.y, s: 0.022, jit: jit, rot: mrot, layer: 0, cluster: cl, shade: mshade, lp: 0 });
      for (var i = 0, n = 18 + Math.floor(r() * 8); i < n; i++) {   // dense enough to read as one group
        var la = r() * 6.283, ld = Math.sqrt(r()) * 0.046;
        leaves.push({ x: pt.x + Math.cos(la) * ld, y: pt.y + Math.sin(la) * ld * 0.85, s: 0.016 + r() * 0.01,
                      rot: la + (r() - 0.5) * 1.2, layer: layer, cluster: cl, shade: r(), lp: 0 });
      }
    });

    // leaf groups unfold one after another, each once its own twigs exist
    var order = clusters.map(function (c, i) { return i; }).sort(function (a, b) { return clusters[a].order - clusters[b].order; });
    var lastTip = 0;
    clusters.forEach(function (c) { lastTip = Math.max(lastTip, c.tip); });
    order.forEach(function (ci, k) { clusters[ci].open = Math.max(clusters[ci].tip, lastTip * 0.72 + k * 0.012); });
    var end = 0;
    leaves.forEach(function (l) {
      // the mass grows together with its leaves (no dark disc shows before them)
      l.t0 = l.cluster < 0 ? lastTip * 0.7 + r() * 0.25 : l.mass ? clusters[l.cluster].open + 0.07 : clusters[l.cluster].open + 0.07 + r() * 0.08;
      end = Math.max(end, l.t0 + 0.3);
    });
    segs.forEach(function (s) { end = Math.max(end, s.t1); });

    // canopy bounds (from the leaves) so callers can centre the crown
    var b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    leaves.forEach(function (l) { b.x0 = Math.min(b.x0, l.x); b.x1 = Math.max(b.x1, l.x); b.y0 = Math.min(b.y0, l.y); b.y1 = Math.max(b.y1, l.y); });
    // light from the upper right: +1 lit side, -1 shaded side
    var ccx = (b.x0 + b.x1) / 2, ccy = (b.y0 + b.y1) / 2, crx = (b.x1 - b.x0) / 2 || 1, cry = (b.y1 - b.y0) / 2 || 1;
    leaves.forEach(function (l) { l.lit = ((l.x - ccx) / crx) * 0.6 - ((l.y - ccy) / cry) * 0.8; });
    return { segs: segs, leaves: leaves, clusters: clusters.length, tones: clusters.map(function (c) { return c.tone; }), end: end,
             canopy: { cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, rx: (b.x1 - b.x0) / 2, ry: (b.y1 - b.y0) / 2 } };
  }

  // opaque palettes: [back layer, front layer]
  var WOOD = [["#1f3119", "#263b1f", "#2d4626", "#33502b"], ["#2a4223", "#34512b", "#3f6034", "#4b6f3e"]];
  var LEAF = [["#47691a", "#4f7417", "#5a821c", "#668f27"], ["#7aa81f", "#8bbb23", "#9ccb3d", "#b0d65a"]];
  var LIT = ["#86ad2e", "#bddc78"], SHADE = ["#3a5716", "#5f8a1a"];  // tints and shades of lime-400
  var MASS = ["#36541a", "#45661f"];                                 // foliage mass under a group: shaded / lit side

  function point(s, p) {                                             // quadratic Bézier at p
    var u = 1 - p;
    return [u * u * s.x0 + 2 * u * p * s.cx + p * p * s.x1, u * u * s.y0 + 2 * u * p * s.cy + p * p * s.y1];
  }

  function leafPath(ctx, x, y, len, rot) {                           // pointed leaf: two quadratic arcs
    var w = len * 0.42, c = Math.cos(rot), s = Math.sin(rot);
    function P(u, v) { return [x + u * s + v * c, y - u * c + v * s]; }
    var a = P(0, 0), b = P(len, 0), l = P(len * 0.5, -w), rr = P(len * 0.5, w);
    ctx.moveTo(a[0], a[1]);
    ctx.quadraticCurveTo(l[0], l[1], b[0], b[1]);
    ctx.quadraticCurveTo(rr[0], rr[1], a[0], a[1]);
  }

  /*
   * A Grower owns two canvases (back, front) and the tree. step(t) paints only
   * what changed since the last call; seek(t) repaints from scratch.
   * view: { ox, oy, scale } in CSS px; time: { start, span } maps seconds to growth units.
   */
  function Grower(tree, layers, view, time) {
    this.tree = tree; this.layers = layers; this.view = view; this.time = time; this.last = -Infinity;
  }
  Grower.prototype.u = function (t) { return (t - this.time.start) / this.time.span * this.tree.end; };
  Grower.prototype.clear = function () {
    this.layers.forEach(function (L) { L.ctx.clearRect(0, 0, L.w, L.h); });
    this.tree.segs.forEach(function (s) { s.drawn = 0; });
    this.tree.leaves.forEach(function (l) { l.lp = 0; });
  };
  Grower.prototype.seek = function (t) { this.clear(); this.last = -Infinity; this.step(t); };
  Grower.prototype.step = function (t) {
    var u = this.u(t), V = this.view, S = V.scale, tree = this.tree, layers = this.layers;
    if (u < this.last) return this.seek(t);
    this.last = u;
    for (var i = 0; i < tree.segs.length; i++) {
      var s = tree.segs[i];
      if (u < s.t0 || s.drawn >= 1) continue;
      var p = C.ease((u - s.t0) / (s.t1 - s.t0));
      if (p <= s.drawn) continue;
      var ctx = layers[s.layer].ctx;
      ctx.strokeStyle = WOOD[s.layer][Math.min(3, Math.floor(s.depth / 2.4))];
      ctx.lineCap = "round";
      // subdivide so the tapering curve stays smooth even when a frame covers a big step
      for (var a = s.drawn; a < p - 1e-6;) {
        var b = Math.min(p, a + 0.1), pa = point(s, a), pb = point(s, b);
        ctx.lineWidth = Math.max(0.6, (s.w0 + (s.w1 - s.w0) * b) * S);
        ctx.beginPath();
        ctx.moveTo(V.ox + pa[0] * S, V.oy + pa[1] * S);
        ctx.lineTo(V.ox + pb[0] * S, V.oy + pb[1] * S);
        ctx.stroke();
        a = b;
      }
      s.drawn = p;
    }
    for (var j = 0; j < tree.leaves.length; j++) {
      var l = tree.leaves[j];
      if (u < l.t0 || l.lp >= 1) continue;
      var lp = C.ease((u - l.t0) / 0.3);
      if (lp <= l.lp) continue;
      var c2 = layers[l.layer].ctx;
      if (l.mass) {                                                   // irregular, smooth blob grown from its centre
        var R0 = l.s * 1.9 * S * lp, n9 = l.jit.length, P = [];
        for (var a9 = 0; a9 < n9; a9++) {
          var th = l.rot + a9 / n9 * 6.283;
          P.push([V.ox + l.x * S + Math.cos(th) * R0 * l.jit[a9], V.oy + l.y * S + Math.sin(th) * R0 * l.jit[a9] * 0.88]);
        }
        c2.fillStyle = MASS[l.lit > 0.3 ? 1 : 0];
        c2.beginPath();
        c2.moveTo((P[0][0] + P[n9 - 1][0]) / 2, (P[0][1] + P[n9 - 1][1]) / 2);
        for (var b9 = 0; b9 < n9; b9++) {
          var nx = P[(b9 + 1) % n9];
          c2.quadraticCurveTo(P[b9][0], P[b9][1], (P[b9][0] + nx[0]) / 2, (P[b9][1] + nx[1]) / 2);
        }
        c2.fill();
        l.lp = lp;
        continue;
      }
      // each leaf group keeps its own tone (two neighbouring shades), so groups read as distinct masses
      var col = LEAF[l.layer][(l.cluster < 0 ? 0 : tree.tones[l.cluster]) + (l.shade > 0.6 ? 1 : 0)];
      if (l.lit > 0.55 && l.shade > 0.35) col = LIT[l.layer];         // the side the beam reaches
      else if (l.lit < -0.5 && l.shade < 0.7) col = SHADE[l.layer];  // the far side falls into shadow
      c2.fillStyle = col;
      c2.beginPath();
      leafPath(c2, V.ox + l.x * S, V.oy + l.y * S, l.s * S * 1.9 * lp, l.rot);
      c2.fill();
      l.lp = lp;
    }
  };

  window.Growth = { generate: generate, Grower: Grower };
})();
