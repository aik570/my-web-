/* Magnetic buttons: the wrapper drifts toward the pointer by 30% of its
   distance from the centre, and springs back on leave.
   Off on touch screens and for reduced motion. */
(function () {
  var M = window.MALOA;
  if (!M.motion || M.touch) return;
  var STRENGTH = .3;
  document.querySelectorAll('.magnetic').forEach(function (el) {
    var toX = gsap.quickTo(el, 'x', { duration: .4, ease: 'power3.out' });
    var toY = gsap.quickTo(el, 'y', { duration: .4, ease: 'power3.out' });
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      toX((e.clientX - (r.left + r.width / 2)) * STRENGTH);
      toY((e.clientY - (r.top + r.height / 2)) * STRENGTH);
    });
    el.addEventListener('pointerleave', function () { toX(0); toY(0); });
  });
})();
