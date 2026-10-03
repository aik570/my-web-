/* Block 4 · Ma'loa Favorites
   - Head: label fades up, the two headline lines rise out of their masks, the intro follows (once),
     as soon as the headline comes into view.
   - Stage, the one strong move: every bowl sits on a large wheel whose centre lies off to the right
     (phones: below). The wheel is driven by the scroll position alone: as the stage comes up, the first bowl
     already rolls into the ring; once the stage is pinned, each further screen of scroll turns the wheel by one
     bowl. Each bowl rests in the ring for a while (MALOA.rest) and the wheel eases between rests, so it reads
     like a snap, but nothing ever scrolls the page: stopping anywhere leaves the wheel where it is, going back
     retraces the same path, and no bowl can be skipped. Each bowl spins a little more than the wheel turns,
     like on a turntable, and shrinks and fades with its distance from the ring.
   - Text changes in step, not scrubbed: the island name rises out of its mask (from below going forward,
     from above going back), type, ingredients and kcal follow, the kcal counts to the new value.
   - The index under the stage scrolls to a bowl's resting point.
   Reduced motion or no GSAP: nothing here runs; the static list remains. */
(function () {
  var M = window.MALOA || {};
  var favs = document.getElementById('favorites');
  if (!favs || !M.gsap || M.reduce) return;

  var stage = favs.querySelector('.favs__stage');
  var items = gsap.utils.toArray(favs.querySelectorAll('.fav'));
  var bowls = items.map(function (li) { return li.querySelector('.fav__bowl'); });
  var texts = items.map(function (li) { return li.querySelector('.fav__text'); });
  var links = gsap.utils.toArray(favs.querySelectorAll('.favs__index a'));
  var n = items.length;
  var spin = [0, -24, 18, -12, 30];   // each bowl's own resting angle, so no two land alike
  var phoneQuery = matchMedia('(max-aspect-ratio: 4/5), (max-width: 699px)');

  favs.classList.add('is-scripted');

  // Head
  gsap.timeline({ scrollTrigger: { trigger: favs.querySelector('.favs__title'), start: 'top 92%', once: true } })
    .from('.favs__label', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out' })
    .from('.favs__line > span', { yPercent: 150, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0.1)
    .from('.favs__intro', { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out' }, 0.45);

  // Wheel geometry, re-read on every refresh (resize, orientation)
  var geo = {};
  function measure() {
    geo.phone = phoneQuery.matches;
    geo.bs = bowls[0].offsetWidth;
    geo.R = geo.bs * (geo.phone ? 1.6 : 1.3);
    geo.step = (geo.phone ? 48 : 40) * Math.PI / 180;
    fitNames();
  }

  // The island names are set as large as their column allows: the longest word decides
  function fitNames() {
    texts.forEach(function (t) {
      var h = t.querySelector('.fav__name');
      h.style.removeProperty('--fit');
      var size = parseFloat(getComputedStyle(h).fontSize);
      var over = h.scrollWidth / h.clientWidth;
      if (over > 1) h.style.setProperty('--fit', Math.floor(size / over) + 'px');
    });
  }

  var state = { p: -0.7 };   // before the stage arrives the first bowl waits just off the ring (LEAD below)
  function render() {
    for (var k = 0; k < n; k++) {
      var d = k - state.p;
      var a = d * geo.step;
      var dist = Math.min(Math.abs(d), 1.4);
      gsap.set(bowls[k], {
        x: geo.phone ? geo.R * Math.sin(a) : geo.R * (1 - Math.cos(a)),
        y: geo.phone ? geo.R * (1 - Math.cos(a)) : geo.R * Math.sin(a),
        rotation: spin[k % spin.length] + d * 58,
        scale: 1 - dist * 0.3,
        opacity: Math.max(0, 1 - dist * (geo.phone ? 1.1 : 0.7)),
        zIndex: 10 - Math.round(dist * 5)
      });
    }
    var i = Math.max(0, Math.min(n - 1, Math.round(state.p)));
    if (i !== active) show(i, active);
  }

  // Text: opacity only (never visibility), so every bowl stays readable to screen readers
  var active = -1;
  var kcal = { v: +items[0].dataset.kcal };
  function show(i, prev) {
    var dir = prev < 0 || i > prev ? 1 : -1;
    if (prev >= 0) {
      texts[prev].classList.remove('is-on');
      gsap.to(texts[prev], { opacity: 0, y: -16 * dir, duration: 0.3, ease: 'power2.in', overwrite: true });
      links[prev] && links[prev].removeAttribute('aria-current');
    }
    var t = texts[i];
    t.classList.add('is-on');
    links[i] && links[i].setAttribute('aria-current', 'true');
    gsap.set(t, { opacity: 1, y: 0, overwrite: true });
    var num = t.querySelector('.fav__kcal-n');
    gsap.timeline({ defaults: { overwrite: true } })
      .fromTo(t.querySelector('.fav__name > span'), { yPercent: 110 * dir }, { yPercent: 0, duration: 0.9, ease: 'power4.out' }, 0.05)
      .fromTo(t.querySelectorAll('.fav__type, .fav__ing, .fav__kcal'), { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 0.12)
      .to(kcal, { v: +items[i].dataset.kcal, duration: 0.8, ease: 'power2.out', onUpdate: function () { num.textContent = Math.round(kcal.v); } }, 0.12);
    active = i;
  }

  // One pin; one driver over lead-in + pin. The driver's tween only runs a 0 → 1 value (scrubbed a little,
  // so a wheel's steps arrive as one movement); render() turns it into the wheel position.
  var LEAD = 0.7;   // how far (in bowls) the first bowl travels into the ring while the stage comes up
  var pinST = ScrollTrigger.create({
    trigger: stage, start: 'top top', pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    end: function () { return '+=' + Math.round(innerHeight * (n - 1) * (phoneQuery.matches ? 0.75 : 0.9)); }
  });
  var drive = { t: 0 };
  var driver = gsap.to(drive, {
    t: 1, ease: 'none', onUpdate: function () { if (driver) { state.p = wheelAt(drive.t); render(); } },
    scrollTrigger: {
      trigger: stage, start: 'top 85%', end: function () { return pinST.end; }, scrub: 0.35, invalidateOnRefresh: true,
      onRefresh: function () { measure(); render(); }
    }
  });
  function wheelAt(t) {
    var st = driver.scrollTrigger, s = st.start + t * (st.end - st.start);
    if (s < pinST.start) return -LEAD * (1 - (s - st.start) / Math.max(1, pinST.start - st.start));
    return M.rest((s - pinST.start) / Math.max(1, pinST.end - pinST.start) * (n - 1), n - 1, 0.22, 'smooth');
  }

  // Inline styles set while ScrollTrigger refreshes are reverted with it, so the text state is
  // (re)applied once a refresh has finished: the current bowl's text on, every other one off
  ScrollTrigger.addEventListener('refresh', function () {
    var i = Math.max(0, Math.min(n - 1, Math.round(state.p)));
    texts.forEach(function (t, k) { if (k !== i) { t.classList.remove('is-on'); gsap.set(t, { opacity: 0 }); } });
    active = -1;
    show(i, -1);
  });

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      // the middle of bowl i's rest
      scrollTo({ top: pinST.start + (pinST.end - pinST.start) * i / (n - 1), behavior: 'smooth' });
    });
  });

  // (names are fitted with the metrics of the face on screen: core.js refreshes once the web font is in)
  measure();
  render();
})();
