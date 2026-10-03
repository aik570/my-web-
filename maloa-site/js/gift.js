/* Block 6 · Gift Card
   - Copy: label, the two headline lines out of their masks, text and button (once).
   - Cards: rise in once, the front card a beat after the back one; then, scrubbed, they drift a little apart
     and turn a touch, as if lifted off the table.
   Reduced motion or no GSAP: the cards rest in place. */
(function () {
  var M = window.MALOA || {};
  var gift = document.getElementById('gutschein');
  if (!gift || !M.gsap || M.reduce) return;

  var back = gift.querySelector('.gift__card--back');
  var front = gift.querySelector('.gift__card--front');

  // The header takes its light version once the light ground is under it (as over Welcome): the
  // gradient at the top of this block is light after ~70% of its band (CSS: up to clamp(260px,28vw,400px))
  ScrollTrigger.create({
    trigger: gift, end: 'bottom top', toggleClass: { targets: '.site-header', className: 'is-light' },
    start: function () {
      var band = Math.min(400, Math.max(260, innerWidth * 0.28));
      return 'top+=' + Math.round(band * 0.7) + ' ' + document.querySelector('.site-header__row').offsetHeight + 'px';
    }
  });

  gsap.timeline({ scrollTrigger: { trigger: gift, start: 'top 55%', once: true } })
    .from(gift.querySelector('.gift__label'), { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' })
    .from(gift.querySelectorAll('.gift__line > span'), { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0.1)
    .from(gift.querySelectorAll('.gift__text, .gift__actions'), { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.45);

  gsap.timeline({ scrollTrigger: { trigger: gift.querySelector('.gift__stage'), start: 'top 85%', once: true } })
    .from(back, { autoAlpha: 0, y: 80, rotation: 2, duration: 1.2, ease: 'power3.out' })
    .from(front, { autoAlpha: 0, y: 110, rotation: 2, duration: 1.3, ease: 'power3.out' }, 0.15);

  // after landing: a gentle drift apart with the scroll (y only, the resting angles stay in CSS)
  gsap.fromTo(back, { yPercent: 6 }, { yPercent: -8, ease: 'none',
    scrollTrigger: { trigger: gift, start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo(front, { yPercent: 10 }, { yPercent: -6, ease: 'none',
    scrollTrigger: { trigger: gift, start: 'top bottom', end: 'bottom top', scrub: true } });
})();
