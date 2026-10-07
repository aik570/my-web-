/* Block 5 · Poké your style
   - Copy: label, the two headline lines out of their masks, the intro (once).
   - Build, the one strong move: the stage is pinned and one timeline fills the empty bowl in six stages, one
     per step of the copy: base (rice, then salad) → protein → vegetables → mango and pineapple → the finish
     (the sauce first, at once, then coconut chips and sesame) → the complete photograph.
   - Compact: about 0.42 of a screen of scroll per stage (phones 0.38), so the whole build takes about two and
     a half screens. Driven by the scroll position alone (no snapping, nothing scrolls the page): each stage has
     a short rest where the bowl holds still (MALOA.rest), the build plays between rests; going back takes the
     ingredients out again along the same path.
   - Each ingredient is put into the bowl, not slid onto it: it grows into view from its own centre under a
     soft-edged mask (so no cut-out outline is ever seen arriving), fades in at the same time, and settles the
     last few pixels down and from a touch larger, with a long, soft ease. No sideways travel, no turn, no
     overshoot. The mask is dropped once the piece is fully in.
   - The sauce spreads out from where it is poured under the same kind of soft mask.
   - The step copy changes in step, not scrubbed (opacity and a small rise); the 01–06 line follows.
     The final state shows only "Your Poké. Your style." and its two actions: the intro and the smaller texts
     step back, so nothing overlaps.
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

  // An ingredient is put in: a soft-edged circle opens from the ingredient's own centre (its --o) while it
  // fades in and settles the last few pixels, so the piece seems to land and spread, never to be dragged.
  function place(tl, el, at, d, drop) {
    var o = (el.style.getPropertyValue('--o') || '50% 50%').trim(), m = { r: 0 };
    function mask() {
      // r 0 → 1: the clear radius grows to 150% of the layer (covers it from any centre), edge 28% soft
      var v = m.r >= 1 ? 'none' : 'radial-gradient(circle at ' + o + ', #000 ' + (m.r * 150 - 28).toFixed(1) + '%, transparent ' + (m.r * 150).toFixed(1) + '%)';
      el.style.webkitMaskImage = v; el.style.maskImage = v;
    }
    tl.fromTo(m, { r: 0 }, { r: 1, duration: d, ease: 'power2.out', onUpdate: mask }, at)
      // solid early: the piece is mostly revealed by the spreading edge, not by a see-through fade
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: d * 0.25, ease: 'sine.out' }, at)
      .fromTo(el, { yPercent: -(drop || 1.2), scale: 1.025 }, { yPercent: 0, scale: 1, duration: d, ease: 'power3.out' }, at);
    mask();
  }

  // Stage k plays in (k-1, k]; the rests are the whole numbers (labels s0…s6)
  var tl = gsap.timeline({ paused: true, defaults: { immediateRender: true } });
  tl.addLabel('s0', 0);
  // 01 base: the rice goes in first and stays under everything, the salad follows on top
  place(tl, L('rice'), 0.04, 0.7, 0.8);
  place(tl, L('greens'), 0.28, 0.66);                                         tl.addLabel('s1', 1);
  // 02 protein
  place(tl, L('tofu'), 1.06, 0.76);                                           tl.addLabel('s2', 2);
  // 03 vegetables, three groups a beat apart
  place(tl, L('veg2'), 2.04, 0.58);
  place(tl, L('veg1'), 2.15, 0.58);
  place(tl, L('veg3'), 2.26, 0.58);                                           tl.addLabel('s3', 3);
  // 04 fruit
  place(tl, L('mango'), 3.04, 0.64);
  place(tl, L('pineapple'), 3.22, 0.6);                                       tl.addLabel('s4', 4);
  // 05 the finish: the sauce is poured straight away as the step begins (it spreads from the top left of
  // the bowl under a soft edge), coconut and sesame follow within the same step
  var pour = { r: 0 }, sauce = L('sauce');
  function pourMask() {
    // fully poured: no mask at all (nothing left to hide, nothing to composite)
    var m = pour.r >= 112 ? 'none' : 'radial-gradient(circle at 26% 36%, #000 ' + (pour.r - 14).toFixed(2) + '%, transparent ' + pour.r.toFixed(2) + '%)';
    sauce.style.webkitMaskImage = m; sauce.style.maskImage = m;
  }
  tl.fromTo(pour, { r: 0 }, { r: 112, duration: 0.62, ease: 'power1.inOut', onUpdate: pourMask }, 4.02)
    .fromTo(sauce, { opacity: 0.35 }, { opacity: 1, duration: 0.5, ease: 'sine.out' }, 4.02);
  place(tl, L('coconut'), 4.32, 0.5);
  ['sesame1', 'sesame2', 'sesame3'].forEach(function (n, i) { place(tl, L(n), 4.5 + i * 0.1, 0.36, 0.6); });
                                                                              tl.addLabel('s5', 5);
  // 06 the complete photograph settles in over the stack: same picture, every edge back where it was
  tl.fromTo(L('final'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'sine.inOut' }, 5.08);
  tl.addLabel('s6', 6);
  tl.fromTo(stage, { '--glow': 1 }, { '--glow': 0.35, duration: 6, ease: 'none' }, 0);
  pourMask();

  // Stage → step copy (one step per stage): base, protein, vegetables, fruit, finish, your poké
  var stepOf = [0, 0, 1, 2, 3, 4, 5];
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
  function sync() { show(stepOf[Math.min(6, Math.ceil(tl.time() - 0.001))] || 0); }

  // The scroll runs a plain 0 → 6 value (scrubbed a little, so a wheel's steps arrive as one movement);
  // the timeline is set to that value with a short rest around every stage
  var drive = { x: 0 };
  gsap.to(drive, {
    x: 6, ease: 'none',
    onUpdate: function () { tl.time(M.rest(drive.x, 6, 0.14)); sync(); },
    scrollTrigger: {
      trigger: stage, start: 'top top', pin: true, anticipatePin: 1, scrub: 0.35, invalidateOnRefresh: true,
      end: function () { return '+=' + Math.round(innerHeight * 6 * (phoneQuery.matches ? 0.38 : 0.42)); }
    }
  });

  // Inline styles set during a refresh are reverted with it: re-apply the copy state afterwards
  ScrollTrigger.addEventListener('refresh', function () {
    var i = active < 0 ? 0 : active;
    steps.forEach(function (s, k) { if (k !== i) { s.classList.remove('is-on'); gsap.set(s, { opacity: 0 }); } });
    active = -1;
    show(stepOf[Math.min(6, Math.ceil(tl.time() - 0.001))] || i);
  });
  show(0);
})();
