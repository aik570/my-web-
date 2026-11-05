/* Konzept Haus Collective — redesign v2 interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ── Mobile menu ── */
  const burger = $('.nav__burger'), menu = $('.menu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ── Split studio lead into words ── */
  const split = $('[data-split]');
  split.innerHTML = split.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');

  /* ── Budget slider: whatever you pick, the answer is the same ── */
  const range = $('.slider__input'), out = $('.slider__out strong');
  const pulse = () => out.animate([{ transform: 'translateY(6px)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
  let lastBand = -1;
  range.addEventListener('input', () => {
    const band = Math.floor(range.value / 34);
    if (band !== lastBand) { lastBand = band; pulse(); }
  });

  /* ── Film ── */
  const film = $('.film'), video = $('.film__video');
  $('.film__frame').addEventListener('click', () => {
    if (video.paused) {
      video.play().then(() => film.classList.add('is-playing')).catch(() => {
        $('.film__cap').textContent = 'Film folgt — Datei video/kh-collective.mp4 einsetzen';
      });
    } else { video.pause(); film.classList.remove('is-playing'); }
  });

  /* ── Cursor ── */
  const cursor = $('.cursor'), label = $('.cursor__label');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      cx += (mx - cx) * .2; cy += (my - cy) * .2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    })();
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-big'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
    });
  }

  const loader = $('.loader');
  if (!hasGsap || reduce) {
    loader.remove();
    $$('.studio__lead .w').forEach(w => { w.style.opacity = 1; });
    $$('.count__val').forEach(el => { el.textContent = el.dataset.to; });
    return;
  }

  /* ───────── GSAP ───────── */
  gsap.registerPlugin(ScrollTrigger);

  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6 });
    }));
  }

  /* Ink drift: the site's signature colour shift, now tied to sections */
  const ink = { c: getComputedStyle(root).getPropertyValue('--blue').trim() };
  const setInk = c => gsap.to(ink, { c, duration: 1.1, ease: 'power2.inOut', overwrite: true, onUpdate: () => root.style.setProperty('--ink', ink.c) });
  $$('[data-ink]').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onEnter: () => setInk(sec.dataset.ink), onEnterBack: () => setInk(sec.dataset.ink),
    });
  });

  /* Loader: the mark draws itself, then the page opens */
  document.body.classList.add('is-loading');
  lenis && lenis.stop();
  gsap.set('.hero__title .t', { yPercent: 105 });
  gsap.set('.hero__glyph', { scale: 0, rotate: -180 });
  gsap.set(['.hero__kicker', '.hero__foot'], { opacity: 0, y: 20 });

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('.loader__mark path', { strokeDashoffset: 0, duration: 1, stagger: .14, ease: 'power3.inOut' }, 0)
    .to('.loader__word', { opacity: .8, duration: .6 }, .5)
    .to('.loader__mark', { rotate: 180, duration: .9, ease: 'power3.inOut' }, 1.35)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 2)
    .set(loader, { display: 'none' })
    .add(() => { document.body.classList.remove('is-loading'); lenis && lenis.start(); }, 2.6)
    .to('.hero__title .t', { yPercent: 0, duration: 1.4, stagger: .09 }, 2.35)
    .to('.hero__glyph', { scale: 1, rotate: 0, duration: 1.6 }, 2.7)
    .to(['.hero__kicker', '.hero__foot'], { opacity: 1, y: 0, duration: 1.1, stagger: .1 }, 2.8);
  gsap.set(loader, { clipPath: 'inset(0 0 0% 0)' });

  /* Hero leaves: rows slide apart, mark spins */
  gsap.to('.hero__title .row:nth-child(1)', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title .row:nth-child(2)', { xPercent: 10, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__glyph', { rotate: 360, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* The fixed mark turns with the whole page */
  gsap.to('.mark svg', { rotate: 720, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 } });

  /* Studio lead inks in word by word */
  gsap.to('.studio__lead .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: '.studio__lead', start: 'top 80%', end: 'bottom 50%', scrub: true } });
  gsap.from('.fact', { y: 40, opacity: 0, duration: 1.2, stagger: .1, scrollTrigger: { trigger: '.facts', start: 'top 85%' } });

  /* 700+ counts up */
  $$('.count__val').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.to, duration: 2.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 80%' }, onUpdate: () => { el.textContent = Math.round(o.v); } });
  });

  /* Places slide in from alternating sides */
  $$('.places__list li').forEach((li, i) => {
    gsap.from(li, { xPercent: i % 2 ? 14 : -14, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 92%' } });
  });

  /* Model title */
  gsap.from('.model__title', { y: 60, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.model__title', start: 'top 85%' } });

  /* Film grows from inset to full frame */
  gsap.fromTo('.film__frame', { clipPath: 'inset(12% 14% 12% 14% round 400px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 2px)', ease: 'none',
    scrollTrigger: { trigger: '.film', start: 'top 90%', end: 'center 55%', scrub: true },
  });

  /* Team portraits: reveal + slow parallax */
  $$('.person__img').forEach(fig => {
    gsap.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: fig, start: 'top 85%' } });
    gsap.fromTo($('img', fig), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Contact headline */
  gsap.set('.contact__title .t', { yPercent: 105 });
  ScrollTrigger.create({ trigger: '.contact__title', start: 'top 80%', once: true,
    onEnter: () => gsap.to('.contact__title .t', { yPercent: 0, duration: 1.4, stagger: .1, ease: 'expo.out' }) });
  gsap.from('.way', { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.contact__ways', start: 'top 85%' } });

  /* Footer mark rises and turns */
  gsap.from('.foot__big svg', { yPercent: 30, rotate: -90, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
