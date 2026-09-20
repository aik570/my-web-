/* =========================================================
   MARAAL — plain JS, no dependencies.
   Two canvases (a tower elevation and a floor plan) are drawn
   as hairline drafting, plus the register, clock, menu and form.
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- palette straight from the CSS tokens, so there is one source ---- */

  var css = getComputedStyle(document.documentElement);
  var C = {
    ink:    css.getPropertyValue('--ink').trim()      || '#0c1416',
    ink2:   css.getPropertyValue('--ink-2').trim()    || '#101b1e',
    stone:  css.getPropertyValue('--stone').trim()    || '#e9e3d8',
    stone3: css.getPropertyValue('--stone-3').trim()  || '#6d7a78',
    brass:  css.getPropertyValue('--brass').trim()    || '#c19a62'
  };

  var MONO = '10px "IBM Plex Mono", ui-monospace, monospace';

  /* =========================================================
     the register: one record per address
     DEMO DATA — replace with the live file.
     Plans are normalised 0..1 room rectangles [x, y, w, h].
     ========================================================= */

  var UNITS = [
    {
      ref: 'MR-041', addr: 'Sky Duplex, Burj Vista',
      aspect: 'South-west', bearing: 225, beds: 4, tenure: 'Freehold',
      span: '18.4 m',
      rooms: [
        [.08, .08, .50, .34, 'Reception'],
        [.60, .08, .32, .34, 'Dining'],
        [.08, .44, .30, .22, 'Kitchen'],
        [.40, .44, .26, .22, 'Study'],
        [.68, .44, .24, .22, 'Bed 4'],
        [.08, .68, .36, .24, 'Principal'],
        [.46, .68, .22, .24, 'Bed 2'],
        [.70, .68, .22, .24, 'Bed 3']
      ],
      terrace: [.08, .94, .84, .04]
    },
    {
      ref: 'MR-027', addr: 'Frond K Villa, Palm Jumeirah',
      aspect: 'North, to the sea', bearing: 0, beds: 6, tenure: 'Freehold',
      span: '31.0 m',
      rooms: [
        [.06, .06, .40, .40, 'Living'],
        [.50, .06, .44, .22, 'Majlis'],
        [.50, .30, .20, .16, 'Kitchen'],
        [.74, .30, .20, .16, 'Pantry'],
        [.06, .50, .26, .20, 'Bed 5'],
        [.36, .50, .26, .20, 'Bed 6'],
        [.66, .50, .28, .20, 'Staff'],
        [.06, .74, .44, .20, 'Principal'],
        [.54, .74, .40, .20, 'Guest suite']
      ],
      pool: [.06, .96, .88, .03]
    },
    {
      ref: 'MR-063', addr: 'Residence 18, Jumeirah Bay',
      aspect: 'East, to the creek', bearing: 90, beds: 3, tenure: 'Freehold',
      span: '14.2 m',
      rooms: [
        [.10, .10, .52, .40, 'Living'],
        [.66, .10, .24, .22, 'Kitchen'],
        [.66, .36, .24, .14, 'Utility'],
        [.10, .56, .38, .34, 'Principal'],
        [.52, .56, .18, .34, 'Bed 2'],
        [.74, .56, .16, .34, 'Bed 3']
      ]
    },
    {
      ref: 'MR-019', addr: 'Half-floor, Bluewaters Island',
      aspect: 'West, to the marina', bearing: 270, beds: 5, tenure: 'Freehold',
      span: '22.6 m',
      rooms: [
        [.06, .10, .34, .46, 'Reception'],
        [.44, .10, .26, .26, 'Dining'],
        [.74, .10, .20, .26, 'Kitchen'],
        [.44, .40, .50, .16, 'Gallery'],
        [.06, .62, .30, .28, 'Principal'],
        [.40, .62, .18, .28, 'Bed 2'],
        [.62, .62, .16, .28, 'Bed 3'],
        [.82, .62, .12, .28, 'Bed 4']
      ]
    },
    {
      ref: 'MR-008', addr: 'Lake Mansion, Emirates Hills',
      aspect: 'South, to the lake', bearing: 180, beds: 7, tenure: 'Freehold',
      span: '38.5 m',
      rooms: [
        [.05, .05, .44, .30, 'Hall'],
        [.53, .05, .42, .30, 'Drawing room'],
        [.05, .39, .28, .22, 'Kitchen'],
        [.37, .39, .26, .22, 'Family'],
        [.67, .39, .28, .22, 'Cinema'],
        [.05, .65, .40, .30, 'Principal'],
        [.49, .65, .22, .30, 'Bed 2'],
        [.75, .65, .20, .30, 'Bed 3']
      ],
      pool: [.05, .97, .90, .02]
    },
    {
      ref: 'MR-052', addr: 'Garden Residence, Dubai Hills',
      aspect: 'North-east', bearing: 45, beds: 4, tenure: 'Freehold',
      span: '16.8 m',
      rooms: [
        [.09, .09, .46, .36, 'Living'],
        [.59, .09, .32, .18, 'Kitchen'],
        [.59, .31, .32, .14, 'Dining'],
        [.09, .51, .34, .40, 'Principal'],
        [.47, .51, .22, .40, 'Bed 2'],
        [.73, .51, .18, .40, 'Bed 3']
      ],
      terrace: [.09, .95, .82, .04]
    }
  ];

  /* =========================================================
     canvas helpers
     ========================================================= */

  function fit(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth || canvas.width;
    var ratio = canvas.getAttribute('height') / canvas.getAttribute('width');
    var h = w * ratio;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function label(ctx, text, x, y, color, align) {
    ctx.save();
    ctx.font = MONO;
    ctx.fillStyle = color;
    ctx.textAlign = align || 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* =========================================================
     hero: schematic tower elevation, level 74-75 marked
     ========================================================= */

  var elevation = document.getElementById('elevation');

  function drawElevation() {
    if (!elevation) return;

    var f = fit(elevation);
    var ctx = f.ctx, W = f.w, H = f.h;

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;

    var padX = Math.max(34, W * 0.13);
    var groundY = H * 0.9;
    var topY = H * 0.06;

    /* horizon and sea, drawn thin so the type keeps the weight */
    ctx.strokeStyle = 'rgba(233,227,216,.16)';
    line(ctx, 0, groundY, W, groundY);

    for (var s = 1; s <= 5; s++) {
      ctx.strokeStyle = 'rgba(233,227,216,' + (0.10 - s * 0.014).toFixed(3) + ')';
      line(ctx, W * (0.02 + s * 0.02), groundY + s * 7, W - W * 0.04, groundY + s * 7);
    }

    /* the tower: two setbacks, so it reads as a drawing not a bar */
    var bw = W - padX * 2;
    var b1 = { x: padX, w: bw, top: H * 0.34 };
    var b2 = { x: padX + bw * 0.10, w: bw * 0.80, top: H * 0.16 };
    var b3 = { x: padX + bw * 0.22, w: bw * 0.56, top: topY };

    ctx.strokeStyle = 'rgba(233,227,216,.42)';
    ctx.strokeRect(b1.x, b1.top, b1.w, groundY - b1.top);
    ctx.strokeRect(b2.x, b2.top, b2.w, b1.top - b2.top);
    ctx.strokeRect(b3.x, b3.top, b3.w, b2.top - b3.top);

    /* floor lines */
    var floors = 46;
    var step = (groundY - topY) / floors;
    ctx.strokeStyle = 'rgba(233,227,216,.09)';

    for (var i = 1; i < floors; i++) {
      var y = groundY - i * step;
      var seg = y < b3.top ? null : (y < b2.top ? b3 : (y < b1.top ? b2 : b1));
      if (seg) line(ctx, seg.x, y, seg.x + seg.w, y);
    }

    /* the marked level */
    var markY = groundY - step * 34;
    var markH = step * 2;

    ctx.fillStyle = 'rgba(193,154,98,.16)';
    ctx.fillRect(b2.x, markY - markH, b2.w, markH);
    ctx.strokeStyle = C.brass;
    ctx.strokeRect(b2.x, markY - markH, b2.w, markH);

    /* leader line out to the label */
    ctx.strokeStyle = 'rgba(193,154,98,.55)';
    line(ctx, b2.x + b2.w, markY - markH / 2, W - 6, markY - markH / 2);
    ctx.beginPath();
    ctx.arc(b2.x + b2.w, markY - markH / 2, 2, 0, Math.PI * 2);
    ctx.fillStyle = C.brass;
    ctx.fill();

    label(ctx, 'LEVEL 74–75', W - 6, markY - markH / 2 - 12, C.brass, 'right');
    label(ctx, '512 m²  ·  SW', W - 6, markY - markH / 2 + 12, C.stone3, 'right');

    /* height dimension on the left, the way a drawing carries one */
    var dx = padX - 16;
    ctx.strokeStyle = 'rgba(233,227,216,.28)';
    line(ctx, dx, topY, dx, groundY);
    line(ctx, dx - 4, topY, dx + 4, topY);
    line(ctx, dx - 4, groundY, dx + 4, groundY);

    ctx.save();
    ctx.translate(dx - 8, (topY + groundY) / 2);
    ctx.rotate(-Math.PI / 2);
    label(ctx, '302 m', 0, 0, C.stone3, 'center');
    ctx.restore();

    label(ctx, 'GROUND', padX, groundY + 16, C.stone3, 'left');
  }

  /* =========================================================
     register: list + plan panel
     ========================================================= */

  var planCanvas = document.getElementById('planCanvas');
  var current = 0;

  function drawPlan(unit) {
    if (!planCanvas) return;

    var f = fit(planCanvas);
    var ctx = f.ctx, W = f.w, H = f.h;

    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;

    var pad = Math.max(24, W * 0.07);
    var iw = W - pad * 2;
    var ih = H - pad * 2 - 30;

    var strip = unit.terrace || unit.pool;
    /* rooms give up the lower band when the unit has a terrace or a pool,
       so no label ever lands on a partition */
    var roomZone = strip ? 0.84 : 1;

    function X(n) { return pad + n * iw; }
    function Y(n) { return pad + n * ih; }
    function Yr(n) { return pad + n * ih * roomZone; }

    /* outer envelope, heavier than the partitions */
    ctx.strokeStyle = 'rgba(233,227,216,.55)';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(X(0.02), Y(0.02), iw * 0.96, ih * 0.96);
    ctx.lineWidth = 1;

    /* rooms */
    unit.rooms.forEach(function (r) {
      var x = X(r[0]), y = Yr(r[1]), w = iw * r[2], h = ih * roomZone * r[3];

      ctx.strokeStyle = 'rgba(233,227,216,.30)';
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = 'rgba(233,227,216,.025)';
      ctx.fillRect(x, y, w, h);

      if (w > 54 && h > 26) {
        label(ctx, r[4].toUpperCase(), x + 7, y + 13, 'rgba(233,227,216,.45)');
      }
    });

    /* outdoor band, hatched, in the strip the rooms left free */
    if (strip) {
      var sx = X(0.05), sw = iw * 0.90;
      var sy = Y(0.90), sh = 11;

      ctx.strokeStyle = 'rgba(193,154,98,.5)';
      ctx.strokeRect(sx, sy, sw, sh);

      ctx.strokeStyle = 'rgba(193,154,98,.22)';
      for (var hx = sx + 2; hx < sx + sw - 2; hx += 9) {
        line(ctx, hx, sy + sh - 1, Math.min(hx + 7, sx + sw - 1), sy + 1);
      }
      label(ctx, unit.terrace ? 'TERRACE' : 'POOL', sx, sy - 9, 'rgba(193,154,98,.7)');
    }

    /* compass: north up, the aspect marked in brass.
       Bottom right, where a drawing carries it and nothing else sits. */
    var r0 = 12;
    var cx = W - pad - r0 - 2;
    var cy = H - 28 - r0;

    ctx.strokeStyle = 'rgba(233,227,216,.25)';
    ctx.beginPath();
    ctx.arc(cx, cy, r0, 0, Math.PI * 2);
    ctx.stroke();
    line(ctx, cx, cy - r0 - 4, cx, cy - r0 + 4);
    label(ctx, 'N', cx, cy - r0 - 12, C.stone3, 'center');

    var a = (unit.bearing - 90) * Math.PI / 180;
    ctx.strokeStyle = C.brass;
    ctx.lineWidth = 1.4;
    line(ctx, cx, cy, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineWidth = 1;

    /* scale bar carrying the unit's real span */
    var by = H - 16, bx = pad, bw2 = Math.min(120, iw * 0.4);
    ctx.strokeStyle = 'rgba(233,227,216,.35)';
    line(ctx, bx, by, bx + bw2, by);
    line(ctx, bx, by - 4, bx, by + 4);
    line(ctx, bx + bw2 / 2, by - 3, bx + bw2 / 2, by + 3);
    line(ctx, bx + bw2, by - 4, bx + bw2, by + 4);
    label(ctx, '0', bx, by - 12, C.stone3, 'center');
    label(ctx, unit.span, bx + bw2, by - 12, C.stone3, 'center');
  }

  function select(i) {
    var unit = UNITS[i];
    if (!unit) return;
    current = i;

    var rows = document.querySelectorAll('.row');
    Array.prototype.forEach.call(rows, function (row, n) {
      var on = n === i;
      row.classList.toggle('is-on', on);
      row.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    var set = function (id, value) {
      var el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set('planRef', unit.ref);
    set('sAddr', unit.addr);
    set('sAspect', unit.aspect);
    set('sBeds', String(unit.beds));
    set('sTenure', unit.tenure);

    drawPlan(unit);
  }

  var body = document.getElementById('regBody');

  if (body) {
    body.addEventListener('click', function (e) {
      var row = e.target.closest('.row');
      if (row) select(Number(row.getAttribute('data-unit')));
    });

    body.addEventListener('keydown', function (e) {
      var row = e.target.closest('.row');
      if (!row) return;

      var i = Number(row.getAttribute('data-unit'));

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select(i);
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        var next = e.key === 'ArrowDown' ? i + 1 : i - 1;
        var target = document.querySelector('.row[data-unit="' + next + '"]');
        if (target) { target.focus(); select(next); }
      }
    });
  }

  /* =========================================================
     Dubai clock — the desk is there, so the page says so
     ========================================================= */

  var clock = document.getElementById('clock');

  function tick() {
    if (!clock) return;
    var now = new Date();
    try {
      clock.textContent = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false
      }).format(now);
      clock.setAttribute('datetime', now.toISOString());
    } catch (err) {
      clock.textContent = '';
    }
  }
  tick();
  window.setInterval(tick, 20000);

  /* =========================================================
     menu
     ========================================================= */

  var menuBtn = document.getElementById('menuBtn');
  var sheetNav = document.getElementById('sheetNav');

  function closeMenu() {
    if (!menuBtn || !sheetNav) return;
    sheetNav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && sheetNav) {
    menuBtn.addEventListener('click', function () {
      var open = sheetNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    sheetNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* =========================================================
     enquiry form
     ========================================================= */

  var form = document.getElementById('enquiryForm');
  var ok = document.getElementById('formOk');

  function fail(input, message) {
    var fld = input.closest('.fld');
    var slot = document.querySelector('[data-err="' + input.id + '"]');
    if (fld) fld.classList.toggle('is-bad', Boolean(message));
    if (slot) slot.textContent = message || '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function check(input) {
    var v = input.value.trim();

    if (!v) {
      fail(input, input.tagName === 'SELECT' ? 'Choose a band.' : 'Required.');
      return false;
    }
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      fail(input, 'Check the address.');
      return false;
    }
    fail(input, '');
    return true;
  }

  if (form) {
    var must = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(must, function (input) {
      input.addEventListener('blur', function () { check(input); });
      input.addEventListener('input', function () {
        if (input.closest('.fld').classList.contains('is-bad')) check(input);
      });
      input.addEventListener('change', function () {
        if (input.tagName === 'SELECT') check(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var good = true, first = null;

      Array.prototype.forEach.call(must, function (input) {
        if (!check(input)) {
          good = false;
          if (!first) first = input;
        }
      });

      if (!good) {
        if (first) first.focus();
        if (ok) ok.hidden = true;
        return;
      }

      /* Demo only: nothing is sent. Point this at your endpoint to go live. */
      if (ok) ok.hidden = false;
      form.reset();
    });
  }

  /* =========================================================
     draw now, redraw on resize
     ========================================================= */

  function paint() {
    drawElevation();
    drawPlan(UNITS[current]);
  }

  paint();

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(paint);
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(paint, reduce ? 0 : 140);
  });
})();
