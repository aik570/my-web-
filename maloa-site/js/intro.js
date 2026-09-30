/* Block 0 · Intro
   1. ring and M trace themselves (DrawSVG, 1.5s)
   2. "MA'LOA" pops: scale .8 → overshoot → 1, back.out(2)
   3. six leaves bloom, then sway on their own loops
   4. leaves fly outward, the layer fades, the Hero is revealed
   Never blocks ordering: the header sits above it, any scroll, key or tap
   fast-forwards it, and it only plays once per browser session.
   Reduced motion: the mark fades in and out, nothing else moves. */
(function () {
  var M = window.MALOA;
  var root = document.documentElement;
  var intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('intro-on')) return;

  var ring = intro.querySelector('.logo-ring');
  var mPath = intro.querySelector('.logo-m');
  var mark = intro.querySelector('.intro__mark');
  var wordmark = intro.querySelector('.intro__wordmark');
  var leaves = [].slice.call(intro.querySelectorAll('.leaf'));
  var skip = intro.querySelector('.intro__skip');

  function done() {
    try { sessionStorage.setItem('maloa-intro', '1'); } catch (e) {}
    root.classList.remove('intro-on');
    intro.remove();
    document.dispatchEvent(new CustomEvent('maloa:intro-done'));
  }

  /* ---- Reduced motion: fade only ---- */
  if (M.reduce) {
    leaves.forEach(function (l) { l.remove(); });
    gsap.timeline({ onComplete: done })
      .from(mark, { opacity: 0, duration: .4 })
      .to(intro, { opacity: 0, duration: .4 }, '+=.8');
    return;
  }

  /* ---- Leaf media: video on wide screens, poster on phones ---- */
  var useVideo = M.wide() && !M.saveData;
  leaves.forEach(function (l, i) {
    var src = M.leaves[i];
    if (!src) { l.hidden = true; return; }
    var el;
    if (useVideo && (src.webm || src.mp4)) {
      el = document.createElement('video');
      el.muted = true; el.loop = true; el.playsInline = true; el.preload = 'auto';
      el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
      if (src.poster) el.poster = src.poster;
      if (src.webm) el.appendChild(Object.assign(document.createElement('source'), { src: src.webm, type: 'video/webm' }));
      if (src.mp4)  el.appendChild(Object.assign(document.createElement('source'), { src: src.mp4,  type: 'video/mp4' }));
    } else {
      el = new Image(); el.decoding = 'async'; el.alt = ''; el.src = src.poster;
    }
    l.appendChild(el);
  });
  leaves = leaves.filter(function (l) { return !l.hidden; });
  var videos = leaves.map(function (l) { return l.querySelector('video'); }).filter(Boolean);

  /* Where each leaf flies: straight out from the centre of the screen */
  function outward(l) {
    var r = l.getBoundingClientRect();
    var dx = r.left + r.width / 2 - innerWidth / 2, dy = r.top + r.height / 2 - innerHeight / 2;
    var len = Math.hypot(dx, dy) || 1, reach = Math.max(innerWidth, innerHeight) * .9;
    return { x: dx / len * reach, y: dy / len * reach };
  }

  /* Gentle sway, independent per leaf so they never move in unison */
  var sway = [];
  function startSway() {
    leaves.forEach(function (l, i) {
      sway.push(gsap.to(l, { y: '+=' + (8 + i % 3 * 4), rotation: (i % 2 ? 1 : -1) * (3 + i % 3), duration: 2.2 + i * .23, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
    videos.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  }

  gsap.set([ring, mPath], { drawSVG: '0%' });
  gsap.set(wordmark, { opacity: 0, scale: .8 });
  gsap.set(leaves, { opacity: 0, scale: .4 });

  var tl = gsap.timeline({ onComplete: function () { sway.forEach(function (t) { t.kill(); }); done(); } });
  tl.to(ring,  { drawSVG: '100%', duration: 1.5, ease: 'power2.inOut' }, 0)
    .to(mPath, { drawSVG: '100%', duration: .9,  ease: 'power2.inOut' }, .5)
    .to(wordmark, { opacity: 1, scale: 1, duration: .7, ease: 'back.out(2)' }, 1.35)
    .add(startSway, 1.5)
    .to(leaves, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', stagger: { each: .08, from: 'random' } }, 1.5)
    .addLabel('out', 3.6)
    .add(function () { sway.forEach(function (t) { t.kill(); }); }, 'out')
    .to(leaves, {
      x: function (i, l) { return outward(l).x; },
      y: function (i, l) { return outward(l).y; },
      rotation: function (i) { return (i % 2 ? 1 : -1) * 70; },
      scale: 1.25, opacity: 0, duration: 1.1, ease: 'power3.in', stagger: .04
    }, 'out')
    .to(mark, { scale: .92, opacity: 0, duration: .6, ease: 'power2.in' }, 'out+=.35')
    .to(intro, { opacity: 0, duration: .5, ease: 'power1.out' }, 'out+=.75');

  /* Any intent to move on plays the rest at 5× speed */
  function hurry() {
    tl.timeScale(5);
    removeEventListener('wheel', hurry); removeEventListener('touchmove', hurry); removeEventListener('keydown', hurry);
  }
  addEventListener('wheel', hurry, { passive: true });
  addEventListener('touchmove', hurry, { passive: true });
  addEventListener('keydown', hurry);
  skip.addEventListener('click', function () { tl.progress(1); });
})();
