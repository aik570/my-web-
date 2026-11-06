/* Konzept Haus Collective — redesign concept v3 */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* Image sizes (px) of everything in media/img, for correct aspect ratios before load */
  const SIZE = {'start-1':[1600,307],'start-2':[1023,1518],'leisten-1':[1600,2133],'leisten-2':[1600,960],'leisten-3':[1600,900],'projekte-00':[1600,1067],'projekte-bu':[1600,1066],'projekte-floorplan':[1600,1066],'projekte-lecoeur-plan':[1600,1066],'projekte-kitchen':[1600,1066],'gr-hh-00':[1600,1200],'gr-hh-01':[1600,1200],'gr-hh-02':[1600,1136],'gr-hh-03':[1600,1142],'gr-hh-04':[1600,1200],'gr-hh-05':[1600,1200],'gr-hh-06':[1600,1266],'gr-hh-07':[1600,1200],'gr-hh-08':[1600,1200],'gr-hh-09':[1600,1200],'gr-hh-10':[1600,1200],'gr-hh-11':[1600,1199],'gr-hh-12':[1600,1200],'gr-hh-13':[1600,1199],'bu-00':[1600,1067],'bu-01':[1600,1067],'bu-02':[1600,1067],'bu-03':[1600,1066],'bu-04':[1600,1067],'bu-05':[1600,1067],'bu-06':[1600,1067],'bu-07':[1600,1066],'bu-08':[1600,1066],'bu-09':[1600,1067],'bu-10':[1600,1066],'bu-11':[1600,1066],'bu-12':[1600,1067],'lc-00':[1600,1066],'lc-01':[1600,1066],'lc-02':[1600,1066],'lc-03':[1600,1066],'lc-04':[1600,1067],'lc-05':[1600,1066],'lc-06':[1600,1066],'lc-07':[1600,1066],'lc-08':[1600,1066],'lc-09':[1600,1066],'lc-10':[1600,1066],'lc-11':[1600,1066],'lc-12':[1600,1067],'lc-13':[1600,1066],'lc-14':[1600,1067],'lc-15':[1600,1067]};
  const SAFE_NAME = /^[a-z0-9-]+$/;          // only our own file names ever become URLs
  const SAFE_MEDIA = /^media\/(img|video)\/[a-z0-9-]+\.(webp|mp4)$/;
  const imgUrl = n => `media/img/${n}.webp`;

  /* ── Section colours ── */
  const meta = $('meta[name="theme-color"]');
  let logo = null;
  let ink = getComputedStyle(root).getPropertyValue('--c-start').trim() || '#8f30ff';
  const setInk = hex => {
    if (!/^#[0-9a-f]{6}$/i.test(hex) || hex === ink) return;
    ink = hex;
    if (hasGsap && !reduce) {
      const o = { c: getComputedStyle(root).getPropertyValue('--ink').trim() || hex };
      gsap.to(o, { c: hex, duration: .9, ease: 'power2.inOut', overwrite: true, onUpdate: () => root.style.setProperty('--ink', o.c) });
    } else root.style.setProperty('--ink', hex);
    meta && meta.setAttribute('content', hex);
    logo && logo.setColor(hex);
  };

  /* ── Split leads into words (DOM only, no HTML strings) ── */
  $$('[data-split]').forEach(el => {
    [...el.childNodes].forEach(node => {
      if (node.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(document.createTextNode(part)); return; }
        const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s);
      });
      node.replaceWith(frag);
    });
  });

  /* ── Mobile menu ── */
  const burger = $('.nav__burger'), menu = $('#menu');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    menu.hidden = !open;
    if (open) $('a', menu).focus();
  };
  burger.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ── Lightbox ── */
  const lb = $('.lightbox'), lbImg = $('.lightbox__img'), lbCount = $('.lightbox__count');
  let lbList = [], lbI = 0, lbReturn = null;
  const lbShow = () => {
    const n = lbList[lbI];
    if (!SAFE_NAME.test(n)) return;
    lbImg.src = imgUrl(n);
    lbImg.alt = `Projektbild ${lbI + 1} von ${lbList.length}`;
    lbCount.textContent = `${lbI + 1} / ${lbList.length}`;
  };
  const lbOpen = (list, i, from) => {
    lbList = list; lbI = i; lbReturn = from || document.activeElement;
    lbShow(); lb.hidden = false; document.body.style.overflow = 'hidden';
    lenis && lenis.stop(); $('.lightbox__close').focus();
  };
  const lbClose = () => {
    lb.hidden = true; document.body.style.overflow = ''; lenis && lenis.start();
    lbReturn && lbReturn.focus && lbReturn.focus();
  };
  const lbStep = d => { lbI = (lbI + d + lbList.length) % lbList.length; lbShow(); };
  $('.lightbox__close').addEventListener('click', lbClose);
  $('.lightbox__prev').addEventListener('click', () => lbStep(-1));
  $('.lightbox__next').addEventListener('click', () => lbStep(1));
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  addEventListener('keydown', e => {
    if (!lb.hidden) {
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'ArrowLeft') lbStep(-1);
      if (e.key === 'Tab') { // keep focus inside the dialog
        const f = $$('button', lb); const i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    } else if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
  });

  /* ── Project strips (drag to scroll, click to enlarge) ── */
  const dragScroll = el => {
    let down = false, x0 = 0, s0 = 0, moved = 0;
    el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; s0 = el.scrollLeft; el.classList.add('is-drag'); });
    addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - x0); el.scrollLeft = s0 - (e.clientX - x0); });
    addEventListener('pointerup', () => { down = false; el.classList.remove('is-drag'); });
    el.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    el.addEventListener('wheel', e => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.stopPropagation(); }, { passive: true });
  };
  const projects = $$('.project').map(p => {
    const list = p.dataset.images.split(',').filter(n => SAFE_NAME.test(n) && SIZE[n]);
    const strip = $('.strip', p);
    list.forEach((n, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${$('h3', p).textContent} — Bild ${i + 1} vergrößern`);
      b.style.setProperty('--ar', `${SIZE[n][0]} / ${SIZE[n][1]}`);
      b.dataset.cursor = 'Ansehen';
      const img = new Image(); img.loading = 'lazy'; img.decoding = 'async'; img.alt = ''; img.src = imgUrl(n);
      img.width = SIZE[n][0]; img.height = SIZE[n][1];
      b.append(img);
      b.addEventListener('click', () => lbOpen(list, i, b));
      strip.append(b);
    });
    dragScroll(strip);
    return { el: p, list, title: $('h3', p).textContent.trim() };
  });

  /* ── 3D ring gallery (CSS 3D) ── */
  const ringSpin = $('.ring__spin'), ringNow = $('.ring__now'), ringPin = $('.ring__pin');
  const ringPicks = [
    [0, 'gr-hh-00'], [1, 'bu-00'], [2, 'lc-00'], [0, 'gr-hh-02'], [1, 'bu-05'], [2, 'lc-02'],
    [0, 'gr-hh-05'], [1, 'bu-01'], [2, 'lc-05'], [0, 'gr-hh-07'], [1, 'bu-09'], [2, 'lc-07'],
    [0, 'gr-hh-10'], [1, 'bu-02'], [2, 'lc-12'], [0, 'gr-hh-13'], [1, 'bu-04'], [2, 'lc-14'],
  ];
  const ringItems = ringPicks.map(([p, n]) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ring__item'; b.dataset.cursor = 'Ansehen';
    b.setAttribute('aria-label', `${projects[p].title} — Bild vergrößern`);
    const img = new Image(); img.alt = ''; img.decoding = 'async'; img.src = imgUrl(n);
    b.append(img);
    b.addEventListener('click', () => { if (!ringDragged) lbOpen(projects[p].list, Math.max(0, projects[p].list.indexOf(n)), b); });
    ringSpin.append(b);
    return { b, p };
  });
  let ringR = 0, ringBase = 0, ringDragAngle = 0, ringVel = 0, ringDragged = false;
  const layoutRing = () => {
    const w = Math.min(Math.max(innerWidth * .2, 170), 340);
    const n = ringItems.length;
    ringR = Math.round((w * 1.12) / (2 * Math.tan(Math.PI / n)));
    ringItems.forEach(({ b }, i) => {
      b.style.setProperty('--w', w + 'px');
      b.style.transform = `rotateY(${(360 / n) * i}deg) translateZ(${ringR}px)`;
    });
    $('.ring__stage').style.setProperty('--rz', `${-ringR * .55}px`);
  };
  const renderRing = () => {
    const a = ringBase + ringDragAngle;
    ringSpin.style.transform = `rotateY(${a}deg)`;
    const n = ringItems.length, step = 360 / n;
    const front = ((Math.round(-a / step) % n) + n) % n;
    const t = projects[ringItems[front].p].title;
    if (ringNow.textContent !== t) ringNow.textContent = t;
  };
  layoutRing(); renderRing();
  addEventListener('resize', layoutRing);
  (() => { // drag with inertia
    let down = false, x0 = 0, last = 0, lastT = 0;
    ringPin.addEventListener('pointerdown', e => { down = true; ringDragged = false; x0 = last = e.clientX; lastT = performance.now(); ringPin.classList.add('is-drag'); ringVel = 0; });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - last; last = e.clientX;
      const now = performance.now(); ringVel = dx / Math.max(1, now - lastT) * 16; lastT = now;
      if (Math.abs(e.clientX - x0) > 6) ringDragged = true;
      ringDragAngle += dx * .25; renderRing();
    });
    addEventListener('pointerup', () => {
      if (!down) return; down = false; ringPin.classList.remove('is-drag');
      const glide = () => { if (Math.abs(ringVel) < .05) return; ringVel *= .94; ringDragAngle += ringVel * .25; renderRing(); requestAnimationFrame(glide); };
      if (!reduce) glide();
      setTimeout(() => { ringDragged = false; }, 0);
    });
  })();
  ringPin.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { ringDragAngle -= 360 / ringItems.length; renderRing(); }
    if (e.key === 'ArrowLeft') { ringDragAngle += 360 / ringItems.length; renderRing(); }
  });

  /* ── Services: image peek follows the cursor ── */
  const peek = $('.peek'), peekImg = $('img', peek);
  if (finePointer) {
    $$('.services li').forEach(li => {
      li.addEventListener('mouseenter', () => {
        const src = li.dataset.img;
        if (SAFE_MEDIA.test(src)) peekImg.src = src;
        peek.classList.add('is-on');
      });
      li.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
    });
    addEventListener('mousemove', e => { peek.style.left = e.clientX + 'px'; peek.style.top = e.clientY + 'px'; }, { passive: true });
  }

  /* ── Videos: load and play only while on screen ── */
  const vids = $$('video.lazyvideo');
  const vio = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
    if (isIntersecting) {
      if (!v.src && SAFE_MEDIA.test(v.dataset.src)) { v.src = v.dataset.src; }
      if (!reduce) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  }), { rootMargin: '200px 0px' });
  vids.forEach(v => vio.observe(v));
  // tap a framed film to pause/play
  $$('figure[data-cursor="Play"]').forEach(f => f.addEventListener('click', () => {
    const v = $('video', f); if (!v) return;
    if (!v.src && SAFE_MEDIA.test(v.dataset.src)) v.src = v.dataset.src;
    v.paused ? v.play().catch(() => {}) : v.pause();
  }));

  /* ── Cursor ── */
  const cursor = $('.cursor'), cLabel = $('.cursor__label');
  if (finePointer) {
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { cx += (mx - cx) * .2; cy += (my - cy) * .2; cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { cLabel.textContent = t.dataset.cursor; cursor.classList.add('is-big'); } else cursor.classList.remove('is-big');
    });
  }

  /* ── 3D mark ── */
  const canvas = $('.hero__gl');
  if (window.KH3D) { try { logo = KH3D.mountLogo(canvas, { color: ink }); } catch (e) { logo = null; } }
  if (!logo) { document.body.classList.add('no-webgl'); canvas.remove(); }

  /* ── Section colour switching (works without GSAP too) ── */
  const colorSecs = $$('[data-color]');
  const navLinks = $$('.nav__links a');
  const cio = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    setInk(en.target.dataset.color);
    const id = en.target.id || (en.target.closest('[id]') || {}).id;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  colorSecs.forEach(s => cio.observe(s));

  /* ── Hide nav on scroll down ── */
  const nav = $('.nav'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY; nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden); lastY = y;
  }, { passive: true });

  const loader = $('.loader');
  let lenis = null;

  if (!hasGsap || reduce) {
    loader.remove(); document.body.classList.remove('is-loading');
    $$('.lead .w').forEach(w => { w.style.opacity = 1; });
    return;
  }

  /* ───────── Motion (GSAP) ───────── */
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    root.style.scrollBehavior = 'auto';
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault(); lenis.scrollTo(target, { duration: 1.6, offset: -10 });
      history.replaceState(null, '', a.getAttribute('href'));
    }));
  }

  /* Loader → hero */
  lenis && lenis.stop();
  gsap.set('.hero__title .t', { yPercent: 110 });
  gsap.set(['.hero__foot', '.hero__clip'], { opacity: 0, y: 30 });
  const done = () => { document.body.classList.remove('is-loading'); lenis && lenis.start(); };
  const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
    .to('.loader__mark', { rotate: 180, scale: .6, duration: .8, ease: 'power3.inOut' })
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, '-=.2')
    .set(loader, { display: 'none' })
    .add(done, '-=.5')
    .to('.hero__title .t', { yPercent: 0, duration: 1.4, stagger: .09 }, '-=.6')
    .to('.hero__clip', { opacity: 1, y: 0, duration: 1.4, stagger: .12 }, '<.2')
    .to('.hero__foot', { opacity: 1, y: 0, duration: 1 }, '<.3');
  gsap.set(loader, { clipPath: 'inset(0 0 0% 0)' });
  const bar = gsap.to('.loader__bar span', { scaleX: .85, duration: 1.6, ease: 'power2.out' });
  let started = false;
  const go = () => { if (started) return; started = true; bar.kill(); gsap.to('.loader__bar span', { scaleX: 1, duration: .3, onComplete: () => intro.play() }); };
  Promise.all([document.fonts ? document.fonts.ready : 0, new Promise(r => setTimeout(r, 900))]).then(go);
  setTimeout(go, 4000); // never hold the page hostage

  /* Hero: the 3D mark turns away as you scroll */
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: s => logo && logo.setProgress(s.progress) });
  gsap.to('.hero__clip--video', { yPercent: -40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__clip--img', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: -30, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
  gsap.to('.hero__fallback', { rotate: 200, scale: .6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Leads ink in word by word */
  $$('.lead').forEach(l => gsap.to($$('.w', l), { opacity: 1, stagger: .04, ease: 'none', scrollTrigger: { trigger: l, start: 'top 82%', end: 'bottom 50%', scrub: true } }));

  /* Section titles rise */
  $$('.sec__title').forEach(t => {
    gsap.set($$('.t', t), { yPercent: 110 });
    ScrollTrigger.create({ trigger: t, start: 'top 88%', once: true, onEnter: () => gsap.to($$('.t', t), { yPercent: 0, duration: 1.3, stagger: .08, ease: 'expo.out' }) });
  });

  /* Frames open like shutters, then drift */
  $$('.frame').forEach(f => {
    gsap.fromTo(f, { clipPath: 'inset(18% 12% 18% 12% round 400px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 85%' } });
    const m = $('img, video', f);
    if (m) gsap.fromTo(m, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* Lists slide in */
  gsap.from('.cols p', { y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.cols', start: 'top 85%' } });
  $$('.services li').forEach((li, i) => gsap.from(li, { xPercent: i % 2 ? 8 : -8, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: li, start: 'top 94%' } }));
  gsap.from('.partners li', { y: 24, opacity: 0, duration: .8, stagger: .025, ease: 'power3.out', scrollTrigger: { trigger: '.partners', start: 'top 85%' } });
  gsap.from('.way', { y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.ways', start: 'top 88%' } });

  /* Ring: pinned, scroll turns it a full circle and tilts it */
  ScrollTrigger.create({
    trigger: '.ring', start: 'top top', end: '+=180%', pin: '.ring__pin', scrub: 1,
    onUpdate: s => { ringBase = -s.progress * 360; renderRing(); },
  });
  const stage = $('.ring__stage');
  ScrollTrigger.create({ trigger: '.ring', start: 'top top', end: '+=180%', scrub: true,
    onUpdate: s => stage.style.setProperty('--rx', `${-22 + s.progress * 26}deg`) });

  /* Manifest sign */
  gsap.from('.manifest__sign span', { yPercent: 100, opacity: 0, duration: 1.4, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.manifest__sign', start: 'top 85%' } });
  gsap.fromTo('.foot__mark', { rotate: -180, scale: .5 }, { rotate: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
