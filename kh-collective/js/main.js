/* Konzept Haus Collective — "Kreislauf" concept interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ── Clock (Potsdam) ── */
  const clock = $('#clock');
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }).format(new Date());
  };
  tick(); setInterval(tick, 15000);

  /* ── Mobile menu ── */
  const burger = $('.nav__burger');
  const menu = $('.menu');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ── Split manifest into words ── */
  const split = $('[data-split]');
  split.innerHTML = split.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');

  /* ── Loop nodes on the ring ── */
  const steps = $$('.loop__list li');
  const nodesG = $('.loop__nodes');
  const NS = 'http://www.w3.org/2000/svg';
  steps.forEach((li, i) => {
    const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
    const x = 300 + Math.cos(a) * 270, y = 300 + Math.sin(a) * 270;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 7);
    const t = document.createElementNS(NS, 'text');
    const tx = 300 + Math.cos(a) * 306, ty = 300 + Math.sin(a) * 306;
    t.setAttribute('x', tx); t.setAttribute('y', ty + 4);
    t.setAttribute('text-anchor', Math.abs(Math.cos(a)) < .2 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end'));
    t.textContent = '0' + (i + 1);
    nodesG.append(c, t);
  });
  const nodes = $$('.loop__nodes circle');
  const loopTitle = $('.loop__title');
  const loopStep = $('.loop__step');
  let current = -1;
  const setStep = (i) => {
    if (i === current) return;
    current = i;
    steps.forEach((li, j) => li.classList.toggle('is-active', j === i));
    nodes.forEach((n, j) => n.classList.toggle('on', j <= i));
    loopStep.textContent = `0${i + 1} / 0${steps.length}`;
    const name = $('h3', steps[i]).textContent;
    if (hasGsap && !reduce) {
      gsap.to(loopTitle, { yPercent: -30, opacity: 0, duration: .25, ease: 'power2.in', onComplete: () => {
        loopTitle.textContent = name;
        gsap.fromTo(loopTitle, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'power3.out' });
      } });
    } else loopTitle.textContent = name;
  };
  setStep(0);
  steps.forEach((li, i) => li.addEventListener('click', () => setStep(i)));

  /* ── Material passport (example data for the pitch) ── */
  const MATERIALS = [
    { id: 'KH-MP-0001', name: 'Altholz Eiche', origin: 'Dielen, Gründerzeitbau Potsdam', life: 'Tischplatte, geölt', co2: '−84 %', back: 'Ja, über Gute Räume', v: .84 },
    { id: 'KH-MP-0027', name: 'Recycling-Terrazzo', origin: 'Bauschutt & Glasbruch, Berlin', life: 'Tresen & Tischplatten', co2: '−61 %', back: 'Ja, als Granulat', v: .61 },
    { id: 'KH-MP-0043', name: 'Lehmputz', origin: 'Regionaler Lehm, Brandenburg', life: 'Wandoberfläche', co2: '−90 %', back: 'Vollständig kompostierbar', v: .90 },
    { id: 'KH-MP-0058', name: 'Wollfilz', origin: 'Restwolle, Schafhaltung Uckermark', life: 'Polster & Akustik', co2: '−47 %', back: 'Ja, Faserrecycling', v: .47 },
  ];
  const pass = $('.passport__card');
  $$('.passport__tabs button').forEach(btn => btn.addEventListener('click', () => {
    const m = MATERIALS[+btn.dataset.m];
    $$('.passport__tabs button').forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    const body = $('.passport__body', pass);
    const apply = () => {
      $('.passport__id', pass).textContent = m.id;
      $('.passport__name', pass).textContent = m.name;
      ['origin', 'life', 'co2', 'back'].forEach(f => { $(`[data-f="${f}"]`, pass).textContent = m[f]; });
      $('.passport__bar span', pass).style.setProperty('--v', m.v);
    };
    if (hasGsap && !reduce) {
      gsap.to(body, { opacity: 0, y: 8, duration: .2, onComplete: () => { apply(); gsap.to(body, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' }); } });
    } else apply();
  }));

  /* ── Budget tiers ── */
  const tiers = $$('.tier');
  tiers.forEach(t => t.addEventListener('click', () => {
    tiers.forEach(x => { x.classList.toggle('is-active', x === t); x.setAttribute('aria-selected', String(x === t)); });
  }));

  /* ── Cursor ── */
  const cursor = $('.cursor');
  const label = $('.cursor__label');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      cx += (mx - cx) * .18; cy += (my - cy) * .18;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-big'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
    });
    /* magnetic contact disc */
    const mag = $('.magnet');
    mag.addEventListener('mousemove', e => {
      const r = mag.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      mag.style.transform = `translate(${dx * .25}px, ${dy * .25}px)`;
      $('.magnet__inner', mag).style.transform = `translate(${dx * .12}px, ${dy * .12}px)`;
    });
    mag.addEventListener('mouseleave', () => {
      mag.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1), background .4s';
      mag.style.transform = ''; $('.magnet__inner', mag).style.transform = '';
      setTimeout(() => { mag.style.transition = ''; }, 700);
    });
  }

  /* ── Without GSAP / reduced motion: show everything, basic scroll → step mapping ── */
  const loader = $('.loader');
  if (!hasGsap || reduce) {
    loader.remove();
    $$('.manifest__text .w').forEach(w => { w.style.opacity = 1; });
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
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    }));
  }

  /* Loader → hero intro */
  document.body.classList.add('is-loading');
  lenis && lenis.stop();
  gsap.set('.hero__title .word', { yPercent: 110 });
  gsap.set(['.hero__top', '.hero__lede', '.scrollcue'], { opacity: 0, y: 16 });
  gsap.set('.hero__visual', { scale: .6, opacity: 0, rotate: -40 });

  const count = { v: 0 };
  const countEl = $('.loader__count span');
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .to('.loader__ring circle', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0)
    .to(count, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = String(Math.round(count.v)).padStart(3, '0'); } }, 0)
    .to('.loader__count span', { yPercent: -100, duration: .6, ease: 'power3.in' }, 1.7)
    .to('.loader__ring', { scale: 3.2, opacity: 0, duration: 1, ease: 'power3.in' }, 1.7)
    .to(loader, { clipPath: 'circle(0% at 50% 50%)', duration: 1.1, ease: 'expo.inOut' }, 1.9)
    .set(loader, { display: 'none' })
    .add(() => { document.body.classList.remove('is-loading'); lenis && lenis.start(); }, 2.6)
    .to('.hero__title .word', { yPercent: 0, duration: 1.4, stagger: .08 }, 2.3)
    .to('.hero__visual', { scale: 1, opacity: 1, rotate: 0, duration: 1.8 }, 2.5)
    .to(['.hero__top', '.hero__lede', '.scrollcue'], { opacity: 1, y: 0, duration: 1.2, stagger: .08 }, 2.7);
  gsap.set(loader, { clipPath: 'circle(75% at 50% 50%)' });

  /* Hero: title drifts, disc grows as you leave */
  gsap.to('.hero__title', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__visual', { scale: 1.35, yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__clip img', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Manifest: word-by-word ink */
  gsap.to('.manifest__text .w', {
    opacity: 1, stagger: .05, ease: 'none',
    scrollTrigger: { trigger: '.manifest__text', start: 'top 80%', end: 'bottom 45%', scrub: true },
  });
  gsap.from('.field', { y: 40, opacity: 0, duration: 1.2, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.manifest__grid', start: 'top 85%' } });

  /* Generic label reveals */
  $$('.label').forEach(l => gsap.from(l, { opacity: 0, x: -16, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: l, start: 'top 90%' } }));

  /* Kreislauf: pinned, ring draws through five stations */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 761px)', () => {
    const progress = $('.loop__progress');
    ScrollTrigger.create({
      trigger: '.loop', start: 'top top', end: '+=' + (steps.length * 70) + '%',
      pin: '.loop__pin', scrub: true,
      onUpdate: self => {
        progress.style.strokeDashoffset = 1697 * (1 - self.progress);
        setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * .999)));
      },
    });

    /* Projects: horizontal pinned track */
    const track = $('.work__track');
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.work', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
  });
  mm.add('(max-width: 760px)', () => {
    const progress = $('.loop__progress');
    progress.style.strokeDashoffset = 1697 * (1 - 1 / steps.length);
    steps.forEach((li, i) => li.addEventListener('click', () => { progress.style.strokeDashoffset = 1697 * (1 - (i + 1) / steps.length); }));
  });

  /* Image reveals */
  $$('.card__img, .passport__img').forEach(el => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', containerAnimation: undefined } });
  });

  /* Store parallax */
  gsap.fromTo('.store__img img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.store', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* Contact headline */
  gsap.set('.contact__title .word', { yPercent: 110 });
  ScrollTrigger.create({
    trigger: '.contact__title', start: 'top 80%', once: true,
    onEnter: () => gsap.to('.contact__title .word', { yPercent: 0, duration: 1.4, stagger: .1, ease: 'expo.out' }),
  });

  /* Footer wordmark rises */
  gsap.from('.foot__mark', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* Fit the footer wordmark to the full width once fonts are in */
  const fitMark = () => {
    const svg = $('.foot__mark'), t = $('text', svg);
    try { const b = t.getBBox(); svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`); } catch (e) {}
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fitMark(); ScrollTrigger.refresh(); });
  addEventListener('load', () => ScrollTrigger.refresh());
})();
