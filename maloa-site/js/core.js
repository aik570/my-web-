/* Shared flags, media addresses and plugin registration. Loaded before every block. */
(function () {
  var root = document.documentElement;
  var hasGsap = !!(window.gsap && window.ScrollTrigger && window.DrawSVGPlugin);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  window.MALOA = {
    gsap: hasGsap,
    reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch: matchMedia('(hover: none), (pointer: coarse)').matches,
    wide: function () { return matchMedia('(min-width: 900px)').matches; },
    saveData: !!(navigator.connection && navigator.connection.saveData),

    /* Leaf loops generated in Higgsfield, hosted on its CDN for the demo.
       webm first, mp4 for Safari; the poster is what phones get. */
    leaves: [
      /* filled in once the renders are approved: { webm: '', mp4: '', poster: '' } × 6 */
    ]
  };

  // If GSAP failed to load, never leave the intro covering the page
  if (!hasGsap) root.classList.remove('intro-on');
})();
