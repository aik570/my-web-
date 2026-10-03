/* Block 0 · Intro
   idle   stone disc breathes in the jungle, light glances over it, rays drift
   start  on a small scroll / swipe / key / tap (or after 7 s):
          1. press: the disc sinks into the leaves (anticipation)
          2. jump: it lifts toward the camera and flips like a coin
          3. land: bounces onto the dark side; ring draws, letters slide out of the "m",
             tagline opens from the centre
          4. fly-through: the camera passes through the disc into the Hero
   Never blocks ordering: the header sits above it, the skip button ends it at once,
   further scrolling plays it faster, and it runs once per browser session.
   Reduced motion: the dark disc fades in and out, nothing moves. */
(function () {
  var M = window.MALOA;
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('intro-on')) return;

  var q = function (s) { return intro.querySelector(s); };
  var bg = q('.intro__bg'), rays = q('.intro__rays'), coin = q('.coin'), body = q('.coin__body'),
      shadow = q('.coin__shadow'), front = q('.coin__face--front'), back = q('.coin__face--back'),
      ringLine = q('.coin__ring-line'), ringEdge = q('.coin__ring-edge'),
      letters = [].slice.call(intro.querySelectorAll('.glyph')), tag = q('.coin__tag'),
      hint = q('.intro__hint'), skip = q('.intro__skip'),
      shines = [].slice.call(intro.querySelectorAll('.coin__shine'));
  var others = letters.filter(function (g) { return !g.classList.contains('glyph--m'); });

  function done() {
    try { sessionStorage.setItem('maloa-intro', '1'); } catch (e) {}
    root.classList.remove('intro-on');
    intro.remove();
    document.dispatchEvent(new CustomEvent('maloa:intro-done'));
  }

  function onIntent(fn) {
    var sy = null, fired = false;
    function go() { if (fired) return; fired = true; off(); fn(); }
    function wheel(e) { if (e.deltaY > 2) go(); }
    function tstart(e) { sy = e.touches[0].clientY; }
    function tmove(e) { if (sy !== null && sy - e.touches[0].clientY > 8) go(); }
    function key(e) { if (/^(ArrowDown|PageDown| |Spacebar|Enter)$/.test(e.key)) go(); }
    function off() {
      removeEventListener('wheel', wheel); removeEventListener('touchstart', tstart);
      removeEventListener('touchmove', tmove); removeEventListener('keydown', key);
      coin.removeEventListener('click', go);
    }
    addEventListener('wheel', wheel, { passive: true });
    addEventListener('touchstart', tstart, { passive: true });
    addEventListener('touchmove', tmove, { passive: true });
    addEventListener('keydown', key);
    coin.addEventListener('click', go);
    return go;
  }

  skip.addEventListener('click', function () { clearTimeout(auto); done(); });
  var auto;

  /* ---- Reduced motion: show the finished dark disc, fade it away ---- */
  if (M.reduce) {
    gsap.set(body, { rotationY: 180 });
    gsap.set([hint, rays], { autoAlpha: 0 });
    gsap.from(coin, { opacity: 0, duration: .4 });
    var leave = function () { gsap.to(intro, { opacity: 0, duration: .4, onComplete: done }); };
    onIntent(leave);
    setTimeout(leave, 2500);
    return;
  }

  /* ---- Idle ---- */
  gsap.set(ringLine, { drawSVG: '0%' });
  gsap.set(ringEdge, { opacity: 0 });
  gsap.set(others, { opacity: 0, x: -120 });
  gsap.set(tag, { clipPath: 'inset(0 50% 0 50%)' });
  gsap.set(back.querySelector('.glyph--m'), { opacity: 1 });

  var idle = gsap.timeline();
  idle.from(bg, { scale: 1.12, duration: 2.4, ease: 'power2.out' }, 0)
      .from(coin, { opacity: 0, scale: .9, duration: 1.2, ease: 'power3.out' }, .3)
      .from(hint, { opacity: 0, y: 10, duration: .8, ease: 'power2.out' }, 1.2);
  var loops = [
    gsap.to(coin, { scale: 1.015, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    gsap.to(rays, { xPercent: 6, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
    gsap.to(shines[0], { xPercent: 160, duration: 2.2, ease: 'power2.inOut', repeat: -1, repeatDelay: 2.4, delay: 1.4 }),
    gsap.fromTo(hint.querySelector('i'), { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: 'power2.inOut', repeat: -1, repeatDelay: .3 })
  ];

  /* ---- The jump ---- */
  var tl = gsap.timeline({ paused: true, onComplete: done });
  tl.add(function () { loops.forEach(function (t) { t.kill(); }); gsap.to(coin, { scale: 1, duration: .2 }); }, 0)
    .to(hint, { autoAlpha: 0, y: 10, duration: .3 }, 0)
    // 1. press into the leaves
    .to(body, { scale: .93, duration: .22, ease: 'power2.in' }, 0)
    .to(shadow, { scale: .96, y: 8, opacity: .9, duration: .22, ease: 'power2.in' }, 0)
    // 2. lift toward the camera, flip in the air
    .addLabel('jump', .22)
    .to(body, { y: '-7vh', scale: 1.14, duration: .5, ease: 'power3.out' }, 'jump')
    .to(body, { rotationY: 180, duration: 1, ease: 'power2.inOut' }, 'jump')
    .to(shadow, { y: 70, scale: .82, opacity: .35, duration: .5, ease: 'power3.out' }, 'jump')
    // 3. land on the dark side and settle
    .to(body, { y: 0, scale: 1, duration: .7, ease: 'bounce.out' }, 'jump+=.5')
    .to(shadow, { y: 16, scale: 1, opacity: .75, duration: .7, ease: 'bounce.out' }, 'jump+=.5')
    .addLabel('land', 'jump+=1.05')
    .to(ringLine, { drawSVG: '100%', duration: 1, ease: 'power2.inOut' }, 'land-=.25')
    .to(ringEdge, { opacity: .7, duration: .8 }, 'land')
    .to(others, { opacity: 1, x: 0, duration: .8, ease: 'power3.out', stagger: .07 }, 'land-=.1')
    .to(tag, { clipPath: 'inset(0 0% 0 0%)', duration: .9, ease: 'power2.inOut' }, 'land+=.35')
    .fromTo(shines[1], { xPercent: -10 }, { xPercent: 160, duration: 1.4, ease: 'power2.inOut' }, 'land+=.4')
    // 4. hold, then fly through the disc
    .addLabel('fly', 'land+=2.1')
    .to(coin, { scale: 16, duration: 1.1, ease: 'power3.in' }, 'fly')
    .to(bg, { scale: 1.35, duration: 1.1, ease: 'power3.in' }, 'fly')
    .to(rays, { opacity: 0, duration: .5 }, 'fly')
    .to(intro, { opacity: 0, duration: .45, ease: 'power1.out' }, 'fly+=.75');

  var start = onIntent(function () {
    clearTimeout(auto);
    idle.progress(1);
    tl.play();
    // Scrolling again while it plays: move along faster
    setTimeout(function () {
      function hurry() { tl.timeScale(2.5); removeEventListener('wheel', hurry); removeEventListener('touchmove', hurry); }
      addEventListener('wheel', hurry, { passive: true });
      addEventListener('touchmove', hurry, { passive: true });
    }, 400);
  });
  auto = setTimeout(start, 7000);
})();
