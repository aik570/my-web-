/* Franchise page
   - Header: light version over the light sections (IntersectionObserver, so it works without GSAP and with
     reduced motion too).
   - Reveals, once: headline lines rise out of their masks, [data-reveal] items fade up in a short stagger.
   - Two gentle parallaxes: the hero photo and the concept photo drift inside their frames; the hero bowl turns
     slowly, the contact bowl turns the other way.
   - Steps (wide screens): the line joining them fills with the scroll.
   Reduced motion or no GSAP: everything stands as laid out. */
(function () {
  var M = window.MALOA || {};
  var header = document.querySelector('.site-header');
  var row = document.querySelector('.site-header__row');

  // Header over light sections: light while a light section covers the header's band
  var lights = document.querySelectorAll('.fr-light');
  if (header && 'IntersectionObserver' in window && lights.length) {
    var on = new Set();
    var setup = function () {
      var hh = row ? row.offsetHeight : 72;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) on.add(e.target); else on.delete(e.target); });
        header.classList.toggle('is-light', on.size > 0);
      }, { rootMargin: '0px 0px ' + (-(innerHeight - hh / 2)) + 'px 0px' });   // a thin band at the header's middle
      lights.forEach(function (s) { io.observe(s); });
      return io;
    };
    var io = setup();
    addEventListener('resize', function () { io.disconnect(); on.clear(); io = setup(); });
  }

  // Steps rail: aligned with the centres of the step numbers (also without motion)
  var steps = document.querySelector('.fr-steps');
  var rail = steps && steps.querySelector('.fr-steps__rail');
  function placeRail() {
    if (!rail) return;
    var no = steps.querySelector('.fr-step__no');
    rail.style.setProperty('--rail-top', (no.getBoundingClientRect().top - steps.getBoundingClientRect().top + no.offsetHeight / 2) + 'px');
  }
  placeRail();
  addEventListener('resize', placeRail);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeRail);

  if (!M.gsap || M.reduce) return;

  gsap.utils.toArray('.fr-title, .fr-h2').forEach(function (h) {
    gsap.from(h.querySelectorAll('.fr-line > span'), { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12,
      scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
  });
  // Each item carries its own trigger (a tween, not a callback, so a refresh never undoes it);
  // items in the same section follow one another by a beat
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.querySelectorAll(':scope > [data-reveal]'), el);
    gsap.from(el, { autoAlpha: 0, y: 26, duration: 0.9, ease: 'power3.out', delay: Math.max(0, sib) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  gsap.fromTo('.fr-hero__photo img', { yPercent: -6 }, { yPercent: 2, ease: 'none',
    scrollTrigger: { trigger: '.fr-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.fromTo('.fr-hero__bowl', { rotation: -18, y: 0 }, { rotation: 24, y: -40, ease: 'none',
    scrollTrigger: { trigger: '.fr-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.fr-hero__bowl', { autoAlpha: 0, scale: 0.86, rotation: -40, duration: 1.4, ease: 'power3.out', delay: 0.2 });
  gsap.from('.fr-hero__photo', { clipPath: 'inset(8% 0% 8% 12% round 28px 0px 0px 28px)', duration: 1.4, ease: 'power3.inOut' });

  gsap.fromTo('.fr-concept__photo img', { yPercent: -8 }, { yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.fr-concept__photo', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.fr-band img', { yPercent: -6 }, { yPercent: 6, ease: 'none',
    scrollTrigger: { trigger: '.fr-band', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.fr-cta__bowl', { rotation: 20 }, { rotation: -16, ease: 'none',
    scrollTrigger: { trigger: '.fr-cta', start: 'top bottom', end: 'bottom top', scrub: true } });

  if (rail) {
    gsap.fromTo(rail, { '--fill': 0 }, { '--fill': 1, ease: 'none',
      scrollTrigger: { trigger: steps, start: 'top 60%', end: 'bottom 75%', scrub: 0.6 } });
  }
})();
