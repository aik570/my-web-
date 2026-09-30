/* Block 3 · Welcome / About Poké
   - Ground: night → light while the block rises into view (scrubbed), so the dark scene hands over softly.
   - Copy: label fades up, the two headline lines rise out of their own masks one after the other,
     text and link follow; played once, not scrubbed, so reading never waits for the scroll.
   - Photo, the one strong move: it opens from a soft pill shape to its full frame while the picture
     inside settles from a slight zoom, scrubbed, like walking into the photograph.
   - Afterwards a gentle parallax: the picture drifts inside its frame, the copy drifts the other way
     at a different speed (wide screens only).
   Reduced motion or no GSAP: nothing here runs; the CSS gradient and the static layout remain. */
(function () {
  var M = window.MALOA || {};
  var about = document.getElementById('about');
  if (!about || !M.gsap || M.reduce) return;

  var photo = about.querySelector('.about__photo');
  var img = photo.querySelector('img');
  var label = about.querySelector('.about__label');
  var lines = about.querySelectorAll('.about__line > span');
  var follow = about.querySelectorAll('.about__text, .about__cta');
  var body = about.querySelector('.about__body');
  var night = getComputedStyle(document.documentElement).getPropertyValue('--night').trim() || '#000f0f';

  about.classList.add('is-scripted');

  gsap.fromTo(about, { backgroundColor: night }, {
    backgroundColor: '#f4f7f5', ease: 'none',
    scrollTrigger: { trigger: about, start: 'top 70%', end: 'top 15%', scrub: true }
  });

  // The fixed header switches to its light-ground version while this block is under it
  ScrollTrigger.create({ trigger: about, start: 'top 12%', end: 'bottom top', toggleClass: { targets: '.site-header', className: 'is-light' } });

  gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 30%', once: true } })
    .from(label, { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' })
    .from(lines, { yPercent: 105, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0.1)
    .from(follow, { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.45);

  var mm = gsap.matchMedia();
  mm.add({ phone: '(max-aspect-ratio: 4/5), (max-width: 699px)', wide: '(min-aspect-ratio: 4/5) and (min-width: 700px)' }, function (ctx) {
    var phone = ctx.conditions.phone;
    gsap.timeline({ scrollTrigger: { trigger: photo, start: phone ? 'top 92%' : 'top 88%', end: phone ? 'top 30%' : 'center 55%', scrub: 0.8 } })
      .fromTo(photo, { clipPath: phone ? 'inset(8% 10% 8% 10% round 120px)' : 'inset(14% 20% 14% 20% round 400px)' },
                     { clipPath: 'inset(0% 0% 0% 0% round ' + (phone ? '0px' : '24px') + ')', ease: 'power2.inOut' }, 0)
      .fromTo(img, { scale: phone ? 1.12 : 1.22 }, { scale: phone ? 1.02 : 1.06, ease: 'power2.out' }, 0);

    if (!phone) {
      gsap.fromTo(img, { yPercent: -3 }, { yPercent: 3, ease: 'none',
        scrollTrigger: { trigger: photo, start: 'center 55%', end: 'bottom top', scrub: true } });
      gsap.fromTo(body, { y: 40 }, { y: -40, ease: 'none',
        scrollTrigger: { trigger: about, start: 'top 20%', end: 'bottom top', scrub: true } });
    }
  });
})();
