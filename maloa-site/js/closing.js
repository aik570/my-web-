/* Block 7 · Closing
   - Headline lines rise out of their masks, then the lead and the two actions (once).
   - The three columns fade up one after another (once).
   - The wordmark rises into its frame with the scroll, as if the page settles on it.
   Reduced motion or no GSAP: everything stands. */
(function () {
  var M = window.MALOA || {};
  var el = document.getElementById('kontakt');
  if (!el || !M.gsap || M.reduce) return;

  gsap.timeline({ scrollTrigger: { trigger: el.querySelector('.closing__top'), start: 'top 80%', once: true } })
    .from(el.querySelectorAll('.closing__line > span'), { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12 })
    .from(el.querySelectorAll('.closing__lead, .closing__actions'), { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.35);

  gsap.from(el.querySelectorAll('.closing__col'), { autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: el.querySelector('.closing__info'), start: 'top 88%', once: true } });

  gsap.fromTo(el.querySelector('.closing__word span'), { yPercent: 45 }, { yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: el.querySelector('.closing__word'), start: 'top bottom', end: 'bottom bottom', scrub: true } });
})();
