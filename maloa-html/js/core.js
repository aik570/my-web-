/* Shared flags and helpers. Loaded first; every other script reads window.MALOA. */
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = matchMedia('(hover: none), (pointer: coarse)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  // .anim is set in <head> before paint; drop it if GSAP never arrived so nothing stays hidden
  if (!hasGsap) root.classList.remove('anim');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  window.MALOA = {
    reduce: reduce,
    touch: touch,
    gsap: hasGsap,
    motion: hasGsap && !reduce,
    wide: function () { return matchMedia('(min-width: 900px)').matches; },
    saveData: !!(navigator.connection && navigator.connection.saveData),

    /* Media that lives outside the repository. Set a value to null to fall back
       to the poster image. Hosted on the Higgsfield CDN for the demo; move the
       files into the WordPress media library for production. */
    media: {
      heroVideo:  'https://d2ol7oe51mr4n9.cloudfront.net/user_3K31NSDIHA0gXz2VXZIk09GnTID/0d327f70-3a4c-47b1-9cf9-aecae694508b.mp4',
      heroPoster: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3K31NSDIHA0gXz2VXZIk09GnTID/6f229b86-e5a1-4e01-94d1-d55576ca850b.webp'
    }
  };

  // Header turns solid once the page has moved
  var hdr = document.querySelector('.hdr');
  function solid() { hdr.classList.toggle('is-solid', scrollY > 8 || root.classList.contains('menu-open')); }
  addEventListener('scroll', solid, { passive: true });
  solid();
})();
