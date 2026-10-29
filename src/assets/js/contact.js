// Contact form without a server: checks the fields, then opens the visitor's
// e-mail program with the message addressed to the shop. Nothing is sent or
// stored by the website itself.
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;
  var err = document.getElementById('cf-error');
  var f = function (n) { return form.elements[n]; };

  function check() {
    var problems = [];
    if (!f('name').value.trim()) problems.push([f('name'), 'Bitte geben Sie Ihren Namen an.']);
    if (f('telefon').value.trim() && !f('telefon').checkValidity()) problems.push([f('telefon'), 'Die Mobilnummer enthält ungültige Zeichen.']);
    if (f('nachricht').value.trim().length < 10) problems.push([f('nachricht'), 'Bitte beschreiben Sie Ihr Anliegen in mindestens 10 Zeichen.']);
    [f('name'), f('telefon'), f('nachricht')].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    problems.forEach(function (p) { p[0].setAttribute('aria-invalid', 'true'); });
    err.hidden = !problems.length;
    err.textContent = problems.map(function (p) { return p[1]; }).join(' ');
    if (problems.length) problems[0][0].focus();
    return !problems.length;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!check()) return;
    var name = f('name').value.trim();
    var phone = f('telefon').value.trim();
    var body = f('nachricht').value.trim() + '\n\n' + name + (phone ? '\nMobil: ' + phone : '') + '\n';
    var url = 'mailto:' + form.getAttribute('data-email') +
      '?subject=' + encodeURIComponent('Anfrage über die Website von ' + name) +
      '&body=' + encodeURIComponent(body);
    form.dispatchEvent(new CustomEvent('contact:mailto', { detail: url }));   // used by the interaction test
    location.href = url;
  });
})();
