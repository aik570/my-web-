/* Block 1 · Hero (base version)
   - The film autoplays muted and loops (attributes in the HTML, so iOS Safari starts it without script).
   - Pause button for the loop (WCAG 2.2.2). If the browser refuses autoplay (e.g. iOS Low Power Mode),
     the button switches to "play" so the poster is not mistaken for a frozen video.
   - The film pauses while off screen and resumes when it comes back, unless the visitor paused it.
   - Reduced motion or Save-Data: the poster stays, nothing plays until the visitor asks.
   - The film fades in over its poster (the same frame, laid under it in CSS) only once it is playing with
     enough buffered to keep going, so the first seconds never stutter or freeze in view.
   - The copy rises in once the intro has finished (or straight away when there is no intro). */
(function () {
  var M = window.MALOA || {};
  var hero = document.getElementById('hero');
  if (!hero) return;
  var video = hero.querySelector('.hero__video');
  var btn = hero.querySelector('.hero__pause');
  var userPaused = false;

  function setPaused(paused) {
    hero.dataset.userPaused = userPaused ? 'true' : 'false'; // read by the scene script
    btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    btn.setAttribute('aria-label', paused ? 'Video abspielen' : 'Video pausieren');
  }
  function play() {
    var p = video.play();
    if (p && p.catch) p.catch(function () { setPaused(true); ready(); });
  }

  // Show the film: when it plays with data in hand, or whenever it stands still (its poster is then
  // what the video element shows, identical to the still beneath it)
  var ready = function () { video.classList.add('is-ready'); };
  function readyWhenFluent() {
    if (video.readyState >= 4) ready();
    else video.addEventListener('canplaythrough', ready, { once: true });
  }
  setTimeout(ready, 4000);   // a slow line still gets the film rather than a still forever

  if (M.reduce || M.saveData) {
    video.removeAttribute('autoplay');
    video.pause();
    userPaused = true;
    setPaused(true);
    ready();
  }

  video.addEventListener('playing', function () { setPaused(false); readyWhenFluent(); });
  btn.addEventListener('click', function () {
    if (video.paused) { userPaused = false; play(); }
    else { userPaused = true; video.pause(); setPaused(true); }
  });

  // Save battery and decoding time while the Hero is out of view
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { if (!userPaused && video.paused) play(); }
      else if (!video.paused) video.pause();
    }, { threshold: 0.05 }).observe(hero);
  }

  // Entrance
  function reveal() { requestAnimationFrame(function () { hero.classList.add('is-in'); }); }
  if (document.documentElement.classList.contains('intro-on')) {
    document.addEventListener('maloa:intro-done', reveal, { once: true });
    setTimeout(reveal, 12000); // never leave the copy hidden if the intro fails
  } else reveal();
})();
