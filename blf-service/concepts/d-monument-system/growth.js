/*
 * Direction D, "Forest Monument — Living System": the growing tree.
 * An artwork related to the emblem's tree (round crown, visible roots). It is NOT
 * the logo and is never presented as the logo; the authentic emblem appears
 * separately and unaltered.
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
    var maxDepth = o.depth, clusterDepth = o.depth - 3;
    var segs = [], leaves = [], clusters = [];
    var lean = (r() - 0.5) * 0.16;                                  // whole-crown asymmetry

    function branch(x, y, ang, len, w, depth, t0, cluster, layer) {
      var x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
      var bend = (r() - 0.5) * 0.34 * len;
      var cx = (x + x1) / 2 + Math.cos(ang) * bend, cy = (y + y1) / 2 + Math.sin(ang) * bend;
      var dur = 0.12 + len * 0.6;
      if (depth === clusterDepth) { cluster = clusters.length; clusters.push({ tip: 0, order: r(), tone: Math.floor(r() * 3) }); }
      if (depth === 3) layer = r() < 0.32 ? 0 : 1;                  // two depth layers: back and front
      segs.push({ x0: x, y0: y, cx: cx, cy: cy, x1: x1, y1: y1, w0: w, w1: w * 0.7, depth: depth,
                  t0: t0, t1: t0 + dur, layer: layer, drawn: 0 });
      if (cluster >= 0) clusters[cluster].tip = Math.max(clusters[cluster].tip, t0 + dur);
      if (depth >= 3 && depth < maxDepth - 3) {                     // sparse, darker interior leaves fill the crown from inside
        for (var m = 0, nm = 1 + Math.floor(r() * 3); m < nm; m++) {
          var fm = 0.4 + r() * 0.6;
          leaves.push({ x: x + (x1 - x) * fm, y: y + (y1 - y) * fm, s: 0.015 + r() * 0.01,
                        rot: ang + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.8), layer: 0, cluster: -1, shade: r(), lp: 0 });
        }
      }
      if (depth >= maxDepth - 3 && cluster >= 0) {                  // leaves on the outer four levels: a full, round crown
        var n = depth >= maxDepth ? 4 + Math.floor(r() * 4) : depth === maxDepth - 1 ? 2 + Math.floor(r() * 3) : 1 + Math.floor(r() * 2);
        for (var i = 0; i < n; i++) {
          var f = depth >= maxDepth ? 0.5 + r() * 0.55 : 0.3 + r() * 0.7;
          var side = r() < 0.5 ? -1 : 1;
          leaves.push({ x: x + (x1 - x) * f, y: y + (y1 - y) * f, s: 0.013 + r() * 0.01,
                        rot: ang + side * (0.5 + r() * 0.8), layer: layer, cluster: cluster,
                        shade: r(), lp: 0 });
        }
      }
      if (depth >= maxDepth) return;
      var kids = depth < 2 ? 2 : (r() < 0.3 ? 3 : (depth > 3 && r() < 0.14 ? 1 : 2));  // pruning leaves gaps
      for (var k = 0; k < kids; k++) {
        var dir = kids === 1 ? (r() < 0.5 ? -1 : 1) : kids === 3 ? (k - 1) : (k === 0 ? -1 : 1);
        var spread = dir * (0.26 + r() * 0.34) + (r() - 0.5) * 0.18;
        if (depth === 0) spread *= 0.85;
        if (depth >= 3 && Math.abs(ang) > 0.7) spread += Math.sign(ang) * 0.24;   // outer limbs reach sideways and down: a dome, not a flat top
        // limbs bend back towards the light at depth, so the crown closes into a dome instead of an umbrella
        var a = ang * (depth < 2 ? 0.95 : 0.8) + spread + (depth < 3 ? lean : 0);
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
    branch(0, 0, (r() - 0.5) * 0.04, 0.24, 0.06, 0, 0, -1, 1);

    // leaf groups unfold one after another, each once its own twigs exist
    var order = clusters.map(function (c, i) { return i; }).sort(function (a, b) { return clusters[a].order - clusters[b].order; });
    var lastTip = 0;
    clusters.forEach(function (c) { lastTip = Math.max(lastTip, c.tip); });
    order.forEach(function (ci, k) { clusters[ci].open = Math.max(clusters[ci].tip, lastTip * 0.72 + k * 0.035); });
    var end = 0;
    leaves.forEach(function (l) {
      l.t0 = l.cluster < 0 ? lastTip * 0.7 + r() * 0.25 : clusters[l.cluster].open + r() * 0.08;
      end = Math.max(end, l.t0 + 0.3);
    });
    segs.forEach(function (s) { end = Math.max(end, s.t1); });

    // canopy bounds (from the leaves) so callers can centre the crown
    var b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity };
    leaves.forEach(function (l) { b.x0 = Math.min(b.x0, l.x); b.x1 = Math.max(b.x1, l.x); b.y0 = Math.min(b.y0, l.y); b.y1 = Math.max(b.y1, l.y); });
    return { segs: segs, leaves: leaves, clusters: clusters.length, tones: clusters.map(function (c) { return c.tone; }), end: end,
             canopy: { cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2, rx: (b.x1 - b.x0) / 2, ry: (b.y1 - b.y0) / 2 } };
  }

  // opaque palettes: [back layer, front layer]
  var WOOD = [["#1f3119", "#263b1f", "#2d4626", "#33502b"], ["#2a4223", "#34512b", "#3f6034", "#4b6f3e"]];
  var LEAF = [["#47691a", "#4f7417", "#5a821c", "#668f27"], ["#7aa81f", "#8bbb23", "#9ccb3d", "#b0d65a"]];

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
      // each leaf group keeps its own tone (two neighbouring shades), so groups read as distinct masses
      c2.fillStyle = LEAF[l.layer][(l.cluster < 0 ? 0 : tree.tones[l.cluster]) + (l.shade > 0.6 ? 1 : 0)];
      c2.beginPath();
      leafPath(c2, V.ox + l.x * S, V.oy + l.y * S, l.s * S * 1.9 * lp, l.rot);
      c2.fill();
      l.lp = lp;
    }
  };

  window.Growth = { generate: generate, Grower: Grower };
})();
