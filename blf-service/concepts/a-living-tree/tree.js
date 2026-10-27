/*
 * Direction A, "Living Tree": procedural, seeded trees drawn on Canvas 2D.
 * An artwork inspired by the emblem's tree. It is NOT the logo and is never
 * presented as the logo; the authentic emblem appears separately and unaltered.
 */
(function () {
  "use strict";
  var C = window.Concept;

  /*
   * Unit space: base of the trunk at (0,0), up is negative y, the whole tree is
   * about 1 unit tall. Timing in seconds relative to the tree's own start.
   */
  function generate(seed, maxDepth) {
    var r = C.rng(seed);
    var segs = [], leaves = [];
    function branch(x, y, ang, len, w, depth, t0) {
      var x1 = x + Math.sin(ang) * len, y1 = y - Math.cos(ang) * len;
      var bend = (r() - 0.5) * 0.3 * len;
      var cx = (x + x1) / 2 + Math.cos(ang) * bend, cy = (y + y1) / 2 + Math.sin(ang) * bend;
      var dur = 0.1 + len * 0.55;
      var layer = depth < 3 ? 1 : (r() < 0.3 ? 0 : r() < 0.65 ? 1 : 2);
      segs.push({ x0: x, y0: y, cx: cx, cy: cy, x1: x1, y1: y1, w0: w, w1: w * 0.72, depth: depth,
                  t0: t0, t1: t0 + dur, layer: layer });
      if (depth >= maxDepth - 1) {                                // leaves on the last two levels
        var n = depth >= maxDepth ? 5 + Math.floor(r() * 4) : 2 + Math.floor(r() * 2);
        for (var i = 0; i < n; i++) {
          var f = depth >= maxDepth ? 0.55 + r() * 0.5 : r();
          var px = x + (x1 - x) * f, py = y + (y1 - y) * f;
          var side = r() < 0.5 ? -1 : 1;
          leaves.push({ x: px, y: py, s: 0.011 + r() * 0.008,
                        rot: ang + side * (0.6 + r() * 0.7), layer: layer, shade: r(), tip: t0 + dur * f });
        }
      }
      if (depth >= maxDepth) return;
      var kids = depth === 0 ? 2 : (r() < 0.35 ? 3 : 2);
      for (var k = 0; k < kids; k++) {
        var dir = kids === 3 ? (k - 1) : (k === 0 ? -1 : 1);
        var spread = dir * (0.3 + r() * 0.32) + (r() - 0.5) * 0.14;
        if (depth === 0) spread *= 0.7;
        branch(x1, y1, ang * 0.85 + spread, len * (0.72 + r() * 0.1), w * (0.62 + r() * 0.08),
               depth + 1, t0 + dur * 0.8);
      }
    }
    branch(0, 0, (r() - 0.5) * 0.05, 0.27, 0.042, 0, 0);
    // leaves open in groups by canopy sector (centre first), never before their twig exists
    var minX = Infinity, maxX = -Infinity;
    leaves.forEach(function (l) { minX = Math.min(minX, l.x); maxX = Math.max(maxX, l.x); });
    leaves.forEach(function (l) {
      var g = Math.min(5, Math.floor((l.x - minX) / (maxX - minX + 1e-6) * 6));
      l.t0 = l.tip + [2, 3, 1, 4, 0, 5][g] * 0.05 + r() * 0.06;
    });
    return { segs: segs, leaves: leaves };
  }

  function partial(s, p) {
    var ax = s.x0 + (s.cx - s.x0) * p, ay = s.y0 + (s.cy - s.y0) * p;
    var bx = s.cx + (s.x1 - s.cx) * p, by = s.cy + (s.y1 - s.cy) * p;
    return { cx: ax, cy: ay, x: ax + (bx - ax) * p, y: ay + (by - ay) * p };
  }

  // pointed leaf: two quadratic arcs
  function leafPath(ctx, x, y, len, rot) {
    var w = len * 0.42, c = Math.cos(rot), s = Math.sin(rot);
    function P(u, v) { return [x + u * s + v * c, y - u * c + v * s]; }
    var a = P(0, 0), b = P(len, 0), l = P(len * 0.5, -w), rr = P(len * 0.5, w);
    ctx.moveTo(a[0], a[1]);
    ctx.quadraticCurveTo(l[0], l[1], b[0], b[1]);
    ctx.quadraticCurveTo(rr[0], rr[1], a[0], a[1]);
  }

  var BRANCH = ["#30502a", "#3d6334", "#4f7a42", "#5b8a4b"];
  var LEAF = ["#8bbb23", "#9ccb3d", "#7aa81f", "#b0d65a"];

  /*
   * opts: { ox, oy, scale, t (seconds since this tree started), alpha, parallax, light (0..1), rim (bool) }
   */
  function draw(ctx, tree, o) {
    var S = o.scale, t = o.t;
    ctx.lineCap = "round";
    for (var layer = 0; layer < 3; layer++) {
      var px = (o.parallax || 0) * (layer - 1) * 8;
      var aL = [0.5, 0.8, 1][layer] * (o.alpha == null ? 1 : o.alpha);
      for (var i = 0; i < tree.segs.length; i++) {
        var s = tree.segs[i];
        if (s.layer !== layer || t < s.t0) continue;
        var p = C.ease((t - s.t0) / (s.t1 - s.t0)), q = partial(s, p);
        ctx.globalAlpha = aL;
        ctx.strokeStyle = BRANCH[Math.min(3, Math.floor(s.depth / 2.5))];
        ctx.lineWidth = Math.max(0.5, (s.w0 + (s.w1 - s.w0) * p) * S);
        ctx.beginPath();
        ctx.moveTo(o.ox + s.x0 * S + px, o.oy + s.y0 * S);
        ctx.quadraticCurveTo(o.ox + q.cx * S + px, o.oy + q.cy * S, o.ox + q.x * S + px, o.oy + q.y * S);
        ctx.stroke();
        if (o.rim && o.light > 0 && s.depth < 4) {                 // light grazes the upper-right edge
          ctx.globalAlpha = 0.22 * o.light * aL;
          ctx.strokeStyle = "#e9e3d6";
          ctx.lineWidth = Math.max(0.4, s.w0 * S * 0.18);
          var off = s.w0 * S * 0.35;
          ctx.beginPath();
          ctx.moveTo(o.ox + s.x0 * S + px + off, o.oy + s.y0 * S);
          ctx.quadraticCurveTo(o.ox + q.cx * S + px + off, o.oy + q.cy * S, o.ox + q.x * S + px + off, o.oy + q.y * S);
          ctx.stroke();
        }
      }
      for (var j = 0; j < tree.leaves.length; j++) {
        var l = tree.leaves[j];
        if (l.layer !== layer || t < l.t0) continue;
        var lp = C.ease((t - l.t0) / 0.3);
        var lit = o.light > 0 && l.x > 0 ? 1 : 0;                  // leaves facing the light turn brighter
        ctx.globalAlpha = aL * lp;
        ctx.fillStyle = LEAF[lit && l.shade > 0.55 ? 3 : Math.floor(l.shade * 3)];
        ctx.beginPath();
        leafPath(ctx, o.ox + l.x * S + px, o.oy + l.y * S, l.s * S * 1.9 * lp, l.rot);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  window.LivingTree = { generate: generate, draw: draw };
})();
