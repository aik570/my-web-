/* Hero → leaves → Welcome, one pinned, scrubbed scene (GSAP + ScrollTrigger).
   Progress 0 → 1 over the pin:
   0.00–0.34  leaves come in from the edges (near ones travel most), the copy lifts away,
              the film pulls back and dims
   0.34–0.56  the leaves close in a little, the nearest grow as if coming towards the camera
   0.52–0.96  the leaves part like a curtain and leave the frame; the Welcome opens between them
              as a widening circle with a soft, feathered edge (a mask, never a hard cut), settling from
              a slight zoom; its bowl turns into place
   0.80–0.98  the bowl's small caption (name, ingredients, kcal: the same facts as in Favorites) rises in
              (no headline here: the Welcome headline appears once, in the About block)
   Phones: three leaves, shorter travel, no 3D turn, shorter pin.
   Reduced motion or no GSAP: nothing here runs; the Welcome block simply follows the Hero. */
(function () {
  var M = window.MALOA || {};
  var scene = document.getElementById('scene');
  if (!scene || !M.gsap || M.reduce) return;

  var hero = scene.querySelector('.hero');
  var video = hero.querySelector('.hero__video');
  var media = hero.querySelector('.hero__media');
  var copy = hero.querySelectorAll('.hero__content, .hero__scroll, .hero__pause');
  var dim = scene.querySelector('.scene__dim');
  var welcome = scene.querySelector('.welcome');
  var inner = welcome.querySelector('.welcome__inner');
  var visual = welcome.querySelector('.welcome__visual');
  var note = welcome.querySelector('.welcome__note');
  var leaves = [].slice.call(scene.querySelectorAll('.leaf'));

  scene.classList.add('scene--cinematic');
  ScrollTrigger.config({ ignoreMobileResize: true }); // iOS address bar must not re-lay out the pin

  leaves.forEach(function (l) {
    var d = l.getAttribute('data-dir').split(',');
    l._dx = +d[0]; l._dy = +d[1]; l._depth = +l.getAttribute('data-depth');
  });

  // The film is hidden once the Welcome covers it: stop decoding it, resume on the way back
  var autoPaused = false;
  function syncVideo(progress) {
    if (progress > 0.97) {
      if (!video.paused) { video.pause(); autoPaused = true; }
    } else if (autoPaused && hero.dataset.userPaused !== 'true') {
      autoPaused = false;
      var p = video.play(); if (p && p.catch) p.catch(function () {});
    }
  }

  var mm = gsap.matchMedia();
  mm.add({ phone: '(max-aspect-ratio: 4/5)', wide: '(min-aspect-ratio: 4/5)' }, function (ctx) {
    var phone = ctx.conditions.phone;
    // travel in vw / vh per depth unit, 3D turn in degrees
    var T = phone ? { enter: 44, close: 7, exit: 78, turn: 0 } : { enter: 58, close: 15, exit: 96, turn: 9 };
    var vw = function () { return innerWidth / 100; };
    var vh = function () { return innerHeight / 100; };
    // the Welcome opens as a circle centred on its bowl
    var at = '50% 50%';
    var active = leaves.filter(function (l) { return getComputedStyle(l).display !== 'none'; });

    // The opening circle: a radial mask whose edge fades over 18% of the screen's half-diagonal, so the
    // Welcome swells out of the dark instead of being cut in. Once fully open the mask is dropped.
    var open = { r: 0 };
    function openMask() {
      var R = Math.hypot(innerWidth, innerHeight) / 2, f = R * 0.18, r = open.r * (R + f);
      var m = open.r >= 1 ? 'none' : 'radial-gradient(circle at ' + at + ', #000 ' + Math.max(0, r - f).toFixed(1) + 'px, transparent ' + r.toFixed(1) + 'px)';
      welcome.style.webkitMaskImage = m; welcome.style.maskImage = m;
    }
    openMask();

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: phone ? '+=150%' : '+=220%',
        pin: true,
        scrub: phone ? 0.35 : 0.5,       // a little lag reads as weight; more reads as delay
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) { syncVideo(self.progress); }
      }
    });

    active.forEach(function (l) {
      var k = l._depth, dx = l._dx, dy = l._dy, rot = +l.getAttribute('data-rot') || 0;
      gsap.set(l, { rotation: rot, transformPerspective: 1200, force3D: true });
      tl.fromTo(l,
        { x: function () { return dx * T.enter * k * vw(); }, y: function () { return dy * T.enter * k * vh(); }, rotationY: dx * T.turn * 1.6, scale: 1 },
        { x: 0, y: 0, rotationY: dx * T.turn * 0.4, ease: 'power2.out', duration: 0.34 }, 0)
        .to(l, { x: function () { return -dx * T.close * k * vw(); }, y: function () { return -dy * T.close * k * vh(); },
          rotationY: 0, rotation: rot + dx * 3 * k, scale: 1 + 0.1 * k, ease: 'sine.inOut', duration: 0.22 }, 0.34)
        .to(l, { x: function () { return dx * T.exit * k * vw(); }, y: function () { return dy * T.exit * k * vh(); },
          rotationY: -dx * T.turn, rotation: rot + dx * 6 * k, scale: 1 + 0.25 * k, ease: 'power2.in', duration: 0.42 }, 0.56);
    });

    tl.to(copy, { autoAlpha: 0, y: -40, ease: 'power2.in', duration: 0.18 }, 0)
      .to(media, { scale: phone ? 0.94 : 0.88, ease: 'sine.inOut', duration: 0.56 }, 0)
      .to(dim, { opacity: 0.55, ease: 'sine.inOut', duration: 0.5 }, 0.08)
      .fromTo(open, { r: 0 }, { r: 1, ease: 'power2.inOut', duration: 0.44, onUpdate: openMask }, 0.52)
      .fromTo(inner, { scale: 1.1 }, { scale: 1, ease: 'power2.out', duration: 0.48 }, 0.52)
      .fromTo(visual, { rotation: -12, y: function () { return 6 * vh(); } }, { rotation: 0, y: 0, ease: 'power2.out', duration: 0.46 }, 0.54);
    if (note) tl.fromTo(note, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.18 }, 0.8);

    return function () { syncVideo(0); welcome.style.webkitMaskImage = welcome.style.maskImage = ''; };
  });

  // The intro locks scrolling; measure again once it has gone
  document.addEventListener('maloa:intro-done', function () { ScrollTrigger.refresh(); });
})();
