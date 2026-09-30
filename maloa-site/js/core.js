/* Shared flags, media addresses and plugin registration. Loaded before every block. */
(function () {
  var root = document.documentElement;
  var hasGsap = !!(window.gsap && window.ScrollTrigger && window.DrawSVGPlugin);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

  /* Demo hosting. The webm files are served with a video/mp4 type by this CDN;
     browsers sniff the container, but self-host them with video/webm in production. */
  var CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3K31NSDIHA0gXz2VXZIk09GnTID/';

  window.MALOA = {
    gsap: hasGsap,
    reduce: matchMedia('(prefers-reduced-motion: reduce)').matches,
    touch: matchMedia('(hover: none), (pointer: coarse)').matches,
    wide: function () { return matchMedia('(min-width: 900px)').matches; },
    saveData: !!(navigator.connection && navigator.connection.saveData),

    /* Leaf loops generated in Higgsfield, hosted on its CDN for the demo.
       webm first, mp4 for Safari; the poster is what phones get. */
    leaves: [
      { webm: CDN + '30f84563-242f-4fc9-bde8-9e82df2991eb.mp4', mp4: CDN + 'fad5d329-8d93-42b3-817c-f40e3bfbb5a4.mp4', poster: CDN + '34566854-68de-4309-a002-0253021a23b1.webp' }, // monstera
      { webm: CDN + '7be90413-4925-4586-bb08-f4323ac8d685.mp4', mp4: CDN + 'e7fa7e12-06ac-4648-9015-4a6f11f749d5.mp4', poster: CDN + '0c179bad-29bb-49ab-95e0-a6032d006055.webp' }, // palm frond
      { webm: CDN + '8ebb9853-a885-4ea1-ad7e-91f6ded93ec9.mp4', mp4: CDN + 'ac8d3080-b601-4b2c-8562-5bb35df6e164.mp4', poster: CDN + 'a6920dcb-73d8-4c0a-895d-82bca308a291.webp' }, // calathea
      { webm: CDN + 'd0b18307-8900-4540-9a3c-3d8e09cef830.mp4', mp4: CDN + '3f27cae8-0d15-4d07-8585-6ee8a9269508.mp4', poster: CDN + '4ff23060-3e3a-493c-88f5-7c1e8fbd62b6.webp' }, // banana leaf
      { webm: CDN + 'd34a5e9c-66f9-4b98-b266-274a6efe6231.mp4', mp4: CDN + '2632655a-db0e-4fdb-ab2d-398cf032aef1.mp4', poster: CDN + '6e61e95a-504f-4a3d-b871-b796f64f480e.webp' }, // pineapple crown
      { webm: CDN + '2bf96699-9ec9-4d15-ab79-798de984d4cb.mp4', mp4: CDN + 'beae11e1-894c-45a7-963c-daee4d036ef0.mp4', poster: CDN + '00e73827-a29a-41f9-ad58-d7878a72ebb5.webp' }  // philodendron
    ]
  };

  // If GSAP failed to load, never leave the intro covering the page
  if (!hasGsap) root.classList.remove('intro-on');
})();
