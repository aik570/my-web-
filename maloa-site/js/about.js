/* Block 3 · Welcome / About Poké
   - Ground: night → light while the block rises into view (scrubbed), so the dark scene hands over softly.
   - Copy: label fades up, the two headline lines rise out of their own masks one after the other,
     text and link follow; played once, not scrubbed, so reading never waits for the scroll.
   - Photo, the one strong move: it opens from an off-centre pill to its full frame while the picture
     inside settles from a closer crop, scrubbed, like walking into the photograph; afterwards it keeps
     a slow push-in and drift inside the mask.
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

  // The fixed header switches to its light-ground version only once the ground under it is light:
  // when most of the night band at the top of this block has passed below the header's bottom edge.
  // Earlier, light pills would sit on the dark scene; later, light text would sit on the light ground.
  ScrollTrigger.create({
    trigger: about,
    start: function () {
      var band = parseFloat(getComputedStyle(about, '::before').height) || 0;
      var hh = document.querySelector('.site-header__row').offsetHeight;
      return 'top+=' + Math.round(band * 0.7) + ' ' + hh + 'px';
    },
    // ...and back to the dark version once the next block's (Favorites) light band has mostly passed
    endTrigger: document.getElementById('favorites') || about,
    end: function () {
      var next = document.getElementById('favorites');
      if (!next) return 'bottom top';
      var band = parseFloat(getComputedStyle(next, '::before').height) || 0;
      return 'top+=' + Math.round(band * 0.7) + ' ' + document.querySelector('.site-header__row').offsetHeight + 'px';
    },
    toggleClass: { targets: '.site-header', className: 'is-light' }
  });

  gsap.timeline({ scrollTrigger: { trigger: about, start: 'top 30%', once: true } })
    .from(label, { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' })
    // 150%, not 100%: the line box is .88em tall and the umlauts reach above it, so a shorter drop
    // leaves the dots of "STÜCK" peeking inside the mask before the lines rise
    .from(lines, { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0.1)
    .from(follow, { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out', stagger: 0.1 }, 0.45);

  var mm = gsap.matchMedia();
  mm.add({ phone: '(max-aspect-ratio: 4/5), (max-width: 699px)', wide: '(min-aspect-ratio: 4/5) and (min-width: 700px)' }, function (ctx) {
    var phone = ctx.conditions.phone;
    // Reveal: an off-centre pill (so it reads organic, not geometric) opens to the full frame while the
    // picture settles from a closer crop and drifts back to centre. Scale stays at or under 1.3 → 1.06
    // so faces and bowls near the edges are only ever trimmed by a few percent.
    // The reveal completes while the photo is in its reading position: its top at 38% of the screen on
    // wide screens, its bottom at 85% on phones. Later ends left the frame slightly inset at rest
    // (a gap at the right edge on desktop, side margins on phones, where the page cannot scroll that far).
    var revealEnd = phone ? 'bottom 85%' : 'top 38%';
    gsap.timeline({ scrollTrigger: { trigger: photo, start: phone ? 'top 95%' : 'top 92%', end: revealEnd, scrub: 0.8 } })
      .fromTo(photo,
        { clipPath: phone ? 'inset(12% 16% 14% 12% round 160px 160px 160px 160px)' : 'inset(26% 30% 18% 34% round 999px 999px 999px 999px)' },
        { clipPath: phone ? 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' : 'inset(0% 0% 0% 0% round 28px 0px 0px 28px)', ease: 'power3.inOut' }, 0)
      .fromTo(img, { scale: phone ? 1.2 : 1.3, xPercent: phone ? 0 : 4 }, { scale: phone ? 1.03 : 1.06, xPercent: 0, ease: 'power2.out' }, 0);

    // After the reveal the picture keeps living inside its mask: a slow push-in and drift,
    // the frame itself moves a little, the copy moves the other way at a different speed.
    gsap.timeline({ scrollTrigger: { trigger: photo, start: revealEnd, end: 'bottom top', scrub: true } })
      // The drift never exceeds the overscan ((scale - 1) / 2), so the frame's edge never shows
      .fromTo(img, { yPercent: phone ? -1.5 : -3 }, { yPercent: phone ? 1.5 : 3, scale: phone ? 1.07 : 1.12, ease: 'none' }, 0);

    if (!phone) {
      gsap.fromTo(photo, { y: 50 }, { y: -50, ease: 'none',
        scrollTrigger: { trigger: about, start: 'top 60%', end: 'bottom top', scrub: true } });
      gsap.fromTo(body, { y: 70 }, { y: -30, ease: 'none',
        scrollTrigger: { trigger: about, start: 'top 20%', end: 'bottom top', scrub: true } });
    }
  });
})();
