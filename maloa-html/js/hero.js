/* Hero: word-by-word headline, scroll-scrubbed turntable video, light parallax. */
(function () {
  var M = window.MALOA;
  var hero = document.querySelector('.hero');
  var title = hero.querySelector('.hero-title');
  var media = hero.querySelector('.hero-media');

  /* Split the headline into words. The full text stays on aria-label so
     screen readers read one sentence, not a list of fragments. */
  var text = title.textContent.trim();
  title.setAttribute('aria-label', text);
  title.innerHTML = text.split(/\s+/).map(function (w) {
    return '<span class="w" aria-hidden="true"><span class="wi">' + w + '</span></span>';
  }).join(' ');

  if (!M.motion) return;

  /* 1. Kinetic typography */
  gsap.fromTo(title.querySelectorAll('.wi'),
    { y: 120, opacity: 0, rotateX: -90 },
    { y: 0, opacity: 1, rotateX: 0, duration: .9, ease: 'power3.out', stagger: .08, delay: .1 });
  gsap.fromTo(hero.querySelectorAll('.hero-fade'),
    { y: 18, opacity: 0 },
    { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .08, delay: .45 });

  /* 2. Media: on wide screens a turntable video whose frame follows the scroll.
        Phones, data-saver and reduced motion keep the poster. */
  var video = null;
  if (M.media.heroVideo && M.wide() && !M.saveData) {
    video = document.createElement('video');
    video.muted = true; video.playsInline = true; video.preload = 'auto';
    video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
    video.poster = M.media.heroPoster;
    video.addEventListener('loadeddata', function () { media.classList.add('has-video'); }, { once: true });
    video.src = M.media.heroVideo;
    media.appendChild(video);
  }
  var target = 0;
  function seek() {
    if (!video || !video.duration || video.seeking) return;
    if (Math.abs(video.currentTime - target) > .01) video.currentTime = target;
  }
  if (video) video.addEventListener('seeked', seek);   // catch up if the scroll moved while seeking

  /* 3 + 4. Scroll: headline lifts and fades, media grows a touch, video scrubs */
  var tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero, start: 'top top', end: 'bottom top', scrub: true,
      onUpdate: function (s) {
        if (!video || !video.duration) return;
        target = s.progress * (video.duration - .05);
        seek();
      }
    }
  });
  tl.to(title, { yPercent: -18, opacity: .4 }, 0)
    .to(media, { scale: 1.05 }, 0);
})();
