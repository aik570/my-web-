/* Block 5 · Poké your style
   - Copy: label, the two headline lines out of their masks, the intro (once).
   - Build, the one strong move: the stage is pinned and one scrubbed timeline fills the empty bowl,
     snapping to each stage: base → protein → vegetables (three groups a beat apart) → mango and pineapple
     → the sauce spreads from where it is poured → coconut chips → sesame in three small showers →
     the complete photograph settles in. Every ingredient drops in from slightly above, a little turned
     and smaller, overshoots a touch and settles (back.out); everything stays once it has landed.
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

  // An ingredient lands: from a little above (and aside), turned and smaller, to rest with a small overshoot
  function drop(tl, el, at, from) {
    tl.fromTo(el, { xPercent: from.x || 0, yPercent: from.y, rotation: from.r || 0, scale: from.s || 0.94 },
      { xPercent: 0, yPercent: 0, rotation: 0, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, at)
      .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power1.out' }, at);
  }

  // Stage k plays in (k-1, k]; the snap points are the labels s0…s7
  var tl = gsap.timeline({ defaults: { immediateRender: true } });
  tl.addLabel('s0', 0);
  drop(tl, L('greens'), 0.15, { x: -6, y: -16, r: -8 });                       tl.addLabel('s1', 1);
  drop(tl, L('tofu'), 1.15, { x: 7, y: -14, r: 7 });                          tl.addLabel('s2', 2);
  drop(tl, L('veg2'), 2.12, { y: -9, r: 14, s: 0.9 });
  drop(tl, L('veg1'), 2.24, { y: -8, r: -12, s: 0.9 });
  drop(tl, L('veg3'), 2.36, { y: -10, r: 10, s: 0.9 });                       tl.addLabel('s3', 3);
  drop(tl, L('mango'), 3.12, { x: -4, y: -14, r: -6 });
  drop(tl, L('pineapple'), 3.3, { y: -9, r: 12, s: 0.9 });                    tl.addLabel('s4', 4);
  // The sauce is poured, not dropped: it spreads out from the top left of the bowl
  tl.fromTo(L('sauce'), { clipPath: 'circle(0% at 26% 36%)', scale: 1.03, opacity: 0.2 },
    { clipPath: 'circle(85% at 26% 36%)', scale: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' }, 4.12);
                                                                              tl.addLabel('s5', 5);
  drop(tl, L('coconut'), 5.1, { x: -9, y: -16, r: -9 });
  ['sesame1', 'sesame2', 'sesame3'].forEach(function (n, i) {
    tl.fromTo(L(n), { yPercent: -5, scale: 1.03, opacity: 0 },
      { yPercent: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'power2.out' }, 5.45 + i * 0.13);
  });                                                                         tl.addLabel('s6', 6);
  // The complete photograph settles in over the stack: same picture, every edge back where it was
  tl.fromTo(L('final'), { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power1.inOut' }, 6.15)
    .fromTo(plate, { scale: 1 }, { scale: 1.025, duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 1 }, 6.1);
  tl.addLabel('s7', 7);
  tl.fromTo(stage, { '--glow': 1 }, { '--glow': 0.35, duration: 7, ease: 'none' }, 0);

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

  ScrollTrigger.create({
    animation: tl, trigger: stage, start: 'top top', pin: true, scrub: 0.6, invalidateOnRefresh: true,
    end: function () { return '+=' + Math.round(innerHeight * 7 * (phoneQuery.matches ? 0.62 : 0.72)); },
    snap: { snapTo: 'labels', duration: { min: 0.25, max: 0.8 }, delay: 0.08, ease: 'power2.inOut', inertia: false },
    onUpdate: sync
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
