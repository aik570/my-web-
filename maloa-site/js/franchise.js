/* Franchise page
   - Hero film: a decorative background, no player controls; paused while off screen (saves decoding),
     poster only with reduced motion or Save-Data.
   - Partner videos: a click swaps the thumbnail for the YouTube player (youtube-nocookie), so nothing loads from
     YouTube before the visitor asks for it. Works without GSAP and with reduced motion.
   - Header: light version over the light sections (IntersectionObserver, also without GSAP).
   - Steps rail aligned with the step numbers (wide screens).
   - With GSAP and motion allowed: headline lines rise out of their masks, [data-reveal] items fade up, gentle
     parallax on the store photos, leaves drift at their own depth, the hero film eases in.
   - The large photo ("Auf gesundem Wachstumskurs") opens from its top edge (rounded corners flattening) to full bleed
     while the picture settles from a touch closer. Nothing in it moves up or down with the scroll, so it cannot
     shake; the reveal is smoothed (scrub 0.6) so wheel steps arrive as one movement.
   - Growth story: the illustration's scene rises into place as it comes into view, its far leaves drift a
     little less than it, the near leaf a little more (very small amounts, smoothed): depth, not a 3D effect.
   Reduced motion or no GSAP: everything stands as laid out. */
(function () {
  var M = window.MALOA || {};
  var header = document.querySelector('.site-header');
  var row = document.querySelector('.site-header__row');

  // ---- hero film ----
  var video = document.querySelector('.fr-hero__video');
  if (video) {
    if (M.reduce || M.saveData) {
      video.removeAttribute('autoplay'); video.pause();
    } else {
      var p = video.play && video.play();
      if (p && p.catch) p.catch(function () {});   // autoplay refused (e.g. Low Power Mode): the poster stays
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) video.play().catch(function () {}); else video.pause(); });
        }).observe(video);
      }
    }
  }

  // ---- partner videos: load the player on request ----
  document.querySelectorAll('.fr-video__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      f.title = btn.dataset.title || 'Video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      btn.appendChild(f);
      var play = btn.querySelector('.fr-video__play'); if (play) play.remove();
      btn.style.cursor = 'default';
    });
  });

  // ---- header over light sections ----
  var lights = document.querySelectorAll('.fr-light');
  if (header && 'IntersectionObserver' in window && lights.length) {
    var on = new Set(), io;
    var setup = function () {
      var hh = row ? row.offsetHeight : 72;
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) on.add(e.target); else on.delete(e.target); });
        header.classList.toggle('is-light', on.size > 0);
      }, { rootMargin: '0px 0px ' + (-(innerHeight - hh / 2)) + 'px 0px' });
      lights.forEach(function (s) { io.observe(s); });
    };
    setup();
    addEventListener('resize', function () { io.disconnect(); on.clear(); setup(); });
  }

  // ---- steps rail ----
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

  gsap.utils.toArray('.fr-title, .fr-h2, .fr-cta__title').forEach(function (h) {
    gsap.from(h.querySelectorAll('.fr-line > span'), { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  // Each item has its own trigger (a tween, so a refresh never undoes it); siblings follow a beat apart
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    var sib = Array.prototype.indexOf.call(el.parentNode.querySelectorAll(':scope > [data-reveal]'), el);
    gsap.from(el, { autoAlpha: 0, y: 26, duration: 0.9, ease: 'power3.out', delay: Math.max(0, sib) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  gsap.from('.fr-hero__media', { scale: 1.08, duration: 2.2, ease: 'power3.out' });
  gsap.to('.fr-hero__video', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.fr-hero', start: 'top top', end: 'bottom top', scrub: true } });
  // The large photo: a masked reveal instead of the old up/down parallax (which shook with uneven scroll steps)
  var wide = document.querySelector('.fr-wide');
  if (wide) {
    gsap.timeline({ scrollTrigger: { trigger: wide, start: 'top bottom', end: 'top 20%', scrub: 0.6 } })
      // the picture layer is 116% of the frame (inset -8% 0): 13% of it is the top 7% of the frame plus its overscan
      .fromTo(wide.querySelector('.fr-wide__img'), { clipPath: 'inset(13% 0% 0% 0% round 28px 28px 0px 0px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'sine.inOut' }, 0)
      .fromTo(wide.querySelector('.fr-wide__img img'), { scale: 1.06 }, { scale: 1, ease: 'sine.out' }, 0);
  }

  // Growth story: the scene rises into place once, with the scroll; its layers keep a very small depth drift
  var scene = document.querySelector('.fr-grow__scene');
  if (scene) {
    gsap.fromTo(scene, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: 'power2.out',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'top 70%', scrub: 0.6 } });
    scene.querySelectorAll('[data-depth]').forEach(function (el) {
      var k = parseFloat(el.dataset.depth) || 0.3;
      gsap.fromTo(el, { yPercent: 6 * k }, { yPercent: -6 * k, ease: 'none',
        scrollTrigger: { trigger: '.fr-grow', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
  }
  gsap.utils.toArray('.fr-module__img img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  gsap.utils.toArray('.fr-leaf, .fr-check__palm').forEach(function (leaf) {
    var k = parseFloat(leaf.dataset.speed) || 0.3;
    gsap.fromTo(leaf, { yPercent: 12 * k }, { yPercent: -12 * k, ease: 'none',
      scrollTrigger: { trigger: leaf.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  if (rail) {
    gsap.fromTo(rail, { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 60%', end: 'bottom 75%', scrub: 0.6 } });
  }
})();
