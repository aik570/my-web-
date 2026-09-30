/* Full-screen menu: toggle, Escape, focus kept inside while open, focus returned on close. */
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  var hdr = document.querySelector('.hdr');
  var label = btn.querySelector('.label');

  function focusables() {
    return [].slice.call(hdr.querySelectorAll('a, button')).concat([].slice.call(menu.querySelectorAll('a, button')));
  }
  function setOpen(open) {
    root.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    label.textContent = open ? 'Schließen' : 'Menü';
    menu.inert = !open;
    hdr.classList.toggle('is-solid', open || scrollY > 8);
    if (open) { var first = menu.querySelector('a'); if (first) first.focus({ preventScroll: true }); }
    else btn.focus({ preventScroll: true });
  }
  menu.inert = true;
  btn.addEventListener('click', function () { setOpen(!root.classList.contains('menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    var f = focusables(), i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });
})();
