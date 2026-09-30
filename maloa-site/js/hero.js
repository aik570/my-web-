/* Block 1 · Hero (base version)
   - The film autoplays muted and loops (attributes in the HTML, so iOS Safari starts it without script).
   - Pause button for the loop (WCAG 2.2.2). If the browser refuses autoplay (e.g. iOS Low Power Mode),
     the button switches to "play" so the poster is not mistaken for a frozen video.
   - The film pauses while off screen and resumes when it comes back, unless the visitor paused it.
   - Reduced motion or Save-Data: the poster stays, nothing plays until the visitor asks.
   - The copy rises in once the intro has finished (or straight away when there is no intro). */
(function () {
  var M = window.MALOA || {};
  var hero = document.getElementById('hero');
  if (!hero) return;
  var video = hero.querySelector('.hero__video');
  var btn = hero.querySelector('.hero__pause');
  var userPaused = false;

  function setPaused(paused) {
    btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    btn.setAttribute('aria-label', paused ? 'Video abspielen' : 'Video pausieren');
  }
  function play() {
    var p = video.play();
    if (p && p.catch) p.catch(function () { setPaused(true); });
  }

  if (M.reduce || M.saveData) {
    video.removeAttribute('autoplay');
    video.pause();
    userPaused = true;
    setPaused(true);
  }

  video.addEventListener('playing', function () { setPaused(false); });
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
