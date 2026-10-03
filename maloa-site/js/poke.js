/* Block 5 · Poké your style
   - Copy: label, the two headline lines out of their masks, the intro (once).
   - Build, the one strong move: the stage is pinned and one timeline fills the empty bowl: base (rice, then
     salad on top) → protein → vegetables (three groups a beat apart) → mango and pineapple → the sauce spreads
     from where it is poured → coconut chips → sesame in three small showers → the complete photograph.
   - Driven by the scroll position alone (no snapping, nothing scrolls the page): each stage has a rest where
     the bowl holds still (MALOA.rest), and the build plays between rests. Stopping anywhere leaves the bowl as
     it is; going back takes the ingredients out again along the same path.
   - Each ingredient is set down, not dropped: it settles from a little above and a touch larger (nearer the
     camera) to its place while it fades in, with a long, soft ease and no overshoot, no turn on the small
     pieces. Its cut edge is never seen travelling across the bowl: most of the fade happens in the last
     few percent of the way.
   - The sauce spreads out from where it is poured under a soft-edged mask, not a hard circle.
   - The step copy changes in step, not scrubbed (opacity and a small rise); the 01–06 line follows.
   - The light behind the bowl recedes as the bowl fills (a CSS variable, scrubbed).
   Reduced motion or no GSAP: nothing here runs; the finished bowl and the list of steps remain. */
(function () {
  var M = window.MALOA || {};
  var poke = document.getElementById('poke');
  if (!poke || !M.gsap || M.reduce) return;

  var stage = poke.querySelector('.poke__stage');
  var plate = poke.querySelector('.poke__plate');
  var steps = gsap.utils.toArray(poke.querySelectorAll('.poke__step'));
  var dots = gsap.utils.toArray(poke.querySelectorAll('.poke__progress span'));
  var L = function (n) { return poke.querySelector('.poke__layer--' + n); };
  var phoneQuery = matchMedia('(max-aspect-ratio: 4/5), (max-width: 699px)');

  poke.classList.add('is-scripted');

  gsap.timeline({ scrollTrigger: { trigger: stage, start: 'top 75%', once: true } })
    .from('.poke__label', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' })
    .from('.poke__line > span', { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0.1)
    .from('.poke__intro', { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out' }, 0.45);

  // An ingredient is set down: from a little above (and aside) and a touch larger, to rest, fading in
  // on the way. power3.out: it arrives softly, nothing overshoots, nothing wobbles when the scroll does.
  function place(tl, el, at, from) {
    var d = from.d || 0.75;
    tl.fromTo(el, { xPercent: from.x || 0, yPercent: from.y, rotation: from.r || 0, scale: from.s || 1.04 },
      { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: d, ease: 'power3.out' }, at)
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: d * 0.55, ease: 'sine.out' }, at);
  }

  // Stage k plays in (k-1, k]; the rests are the whole numbers (labels s0…s7)
  var tl = gsap.timeline({ paused: true, defaults: { immediateRender: true } });
  tl.addLabel('s0', 0);
  // Stage 01, the base: the rice settles first and stays under everything, the salad follows on top
  place(tl, L('rice'), 0.05, { y: -3, s: 1.02, d: 0.8 });
  place(tl, L('greens'), 0.25, { x: -1.5, y: -5, r: -2 });                     tl.addLabel('s1', 1);
  place(tl, L('tofu'), 1.1, { x: 1.5, y: -5, r: 2 });                          tl.addLabel('s2', 2);
  place(tl, L('veg2'), 2.05, { y: -4, s: 1.05, d: 0.6 });
  place(tl, L('veg1'), 2.17, { y: -4, s: 1.05, d: 0.6 });
  place(tl, L('veg3'), 2.29, { y: -4, s: 1.05, d: 0.6 });                      tl.addLabel('s3', 3);
  place(tl, L('mango'), 3.05, { x: -1, y: -5, r: -2 });
  place(tl, L('pineapple'), 3.25, { y: -4, s: 1.05, d: 0.65 });                tl.addLabel('s4', 4);
  // The sauce is poured, not dropped: it spreads out from the top left of the bowl under a soft edge
  var pour = { r: 0 }, sauce = L('sauce');
  function pourMask() {
    // fully poured: no mask at all (nothing left to hide, nothing to composite)
    var m = pour.r >= 112 ? 'none' : 'radial-gradient(circle at 26% 36%, #000 ' + (pour.r - 14).toFixed(2) + '%, transparent ' + pour.r.toFixed(2) + '%)';
    sauce.style.webkitMaskImage = m; sauce.style.maskImage = m;
  }
  tl.fromTo(pour, { r: 0 }, { r: 112, duration: 0.85, ease: 'power1.inOut', onUpdate: pourMask }, 4.05)
    .fromTo(sauce, { opacity: 0.35, scale: 1.015 }, { opacity: 1, scale: 1, duration: 0.85, ease: 'sine.out' }, 4.05);
                                                                              tl.addLabel('s5', 5);
  place(tl, L('coconut'), 5.05, { x: -1.5, y: -5, r: -2 });
  ['sesame1', 'sesame2', 'sesame3'].forEach(function (n, i) {
    place(tl, L(n), 5.4 + i * 0.13, { y: -2.5, s: 1.02, d: 0.45 });
  });                                                                         tl.addLabel('s6', 6);
  // The complete photograph settles in over the stack: same picture, every edge back where it was
  tl.fromTo(L('final'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'sine.inOut' }, 6.1);
  tl.addLabel('s7', 7);
  tl.fromTo(stage, { '--glow': 1 }, { '--glow': 0.35, duration: 7, ease: 'none' }, 0);
  pourMask();

  // Stage → step copy: base, protein, vegetables, fruit, (sauce, toppings) finish, your poké
  var stepOf = [0, 0, 1, 2, 3, 4, 4, 5];
  var active = -1;
  function show(i) {
    if (i === active) return;
    var dir = active < 0 || i > active ? 1 : -1;
    if (active >= 0) {
      steps[active].classList.remove('is-on');
      gsap.to(steps[active], { opacity: 0, y: -14 * dir, duration: 0.24, ease: 'power2.in', overwrite: true });
    }
    steps[i].classList.add('is-on');
    gsap.fromTo(steps[i], { opacity: 0, y: 18 * dir }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: active < 0 ? 0 : 0.22, overwrite: true });   // the new copy rises once the old one has mostly gone
    dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); d.classList.toggle('is-done', k < i); });
    poke.classList.toggle('is-final', i === steps.length - 1);
    active = i;
  }
  function sync() { show(stepOf[Math.min(7, Math.ceil(tl.time() - 0.001))] || 0); }

  // The scroll runs a plain 0 → 7 value (scrubbed a little, so a wheel's steps arrive as one movement);
  // the timeline is set to that value with a rest around every stage
  var drive = { x: 0 };
  gsap.to(drive, {
    x: 7, ease: 'none',
    onUpdate: function () { tl.time(M.rest(drive.x, 7, 0.18)); sync(); },
    scrollTrigger: {
      trigger: stage, start: 'top top', pin: true, anticipatePin: 1, scrub: 0.35, invalidateOnRefresh: true,
      end: function () { return '+=' + Math.round(innerHeight * 7 * (phoneQuery.matches ? 0.62 : 0.72)); }
    }
  });

  // Inline styles set during a refresh are reverted with it: re-apply the copy state afterwards
  ScrollTrigger.addEventListener('refresh', function () {
    var i = active < 0 ? 0 : active;
    steps.forEach(function (s, k) { if (k !== i) { s.classList.remove('is-on'); gsap.set(s, { opacity: 0 }); } });
    active = -1;
    show(stepOf[Math.min(7, Math.ceil(tl.time() - 0.001))] || i);
  });
  show(0);
})();
