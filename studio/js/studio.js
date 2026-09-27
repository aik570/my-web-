/* =========================================================
   AIK Studio

   Every fact about the studio lives in STUDIO. A contact left as
   null is simply not rendered, so the page never shows a made-up
   phone number or an empty row.
   ========================================================= */

var STUDIO = {
  name:      'AIK Studio',
  email:     null,   // 'hallo@aik-studio.de'
  phone:     null,   // '+49 170 0000000'
  whatsapp:  null,   // '491700000000'  digits only, with country code
  instagram: null,   // 'aik.studio'    handle without @
  city:      'Potsdam',
  kleinunternehmer: true,   // shows the § 19 UStG note under the prices
  prices: { start: 490, business: 990, care: 39 }
};

/* German is in the HTML itself, so the page reads without script.
   Only English lives here; German is captured from the DOM on load. */
var EN = {
  'skip': 'Skip to content',
  'nav.work': 'Work', 'nav.prices': 'Prices', 'nav.process': 'Process', 'nav.contact': 'Enquire',
  'hero.eyebrow': 'Web design for small businesses',
  'hero.title': 'Websites that bring <em>customers</em>.',
  'hero.lead': 'I build fast, clear websites for cafés, trades, salons and practices. Fixed price, one person to talk to, and I stay reachable after launch.',
  'hero.cta1': 'Send an enquiry', 'hero.cta2': 'See the work',
  'fact1.k': 'Fixed price', 'fact1.v': 'No hourly meter',
  'fact2.k': 'Mobile first', 'fact2.v': 'Built for the phone',
  'fact3.k': 'DE · EN · RU', 'fact3.v': 'Advice in three languages',
  'work.eyebrow': 'Work', 'work.title': 'Selected projects',
  'case1.tag': 'Real estate · Landing page',
  'case1.text': 'Single-listing page with slideshow, gallery and enquiry form. Mobile load time cut from 2.5 s to 0.9 s.',
  'case1.link': 'View project',
  'slot.title': 'Your project here', 'slot.text': 'I am taking on new clients now.',
  'prices.eyebrow': 'Services & prices', 'prices.title': 'Clear packages, fixed prices',
  'from': 'from', 'month': '/ month',
  'plan1.desc': 'One strong page that shows everything that matters.',
  'plan1.l1': 'One-pager with up to 6 sections', 'plan1.l2': 'Optimised for phones and Google',
  'plan1.l3': 'Contact, map, opening hours', 'plan1.l4': 'Live in about 1–2 weeks',
  'plan2.badge': 'Popular',
  'plan2.desc': 'For businesses that want to show more.',
  'plan2.l1': 'Up to 5 pages', 'plan2.l2': 'Enquiry form',
  'plan2.l3': 'SEO basics and Google Business Profile', 'plan2.l4': 'Bilingual on request',
  'plan3.name': 'Care',
  'plan3.desc': 'You run the business, I look after the website.',
  'plan3.l1': 'Hosting and domain', 'plan3.l2': 'Small changes every month',
  'plan3.l3': 'Backups and updates', 'plan3.l4': 'Cancel monthly',
  'prices.note': 'All prices are final. No VAT is charged under § 19 UStG (small business rule).',
  'process.eyebrow': 'Process', 'process.title': 'Online in four steps',
  's1.t': 'Call', 's1.p': '15 minutes, free. What do you need, who are your customers?',
  's2.t': 'Draft', 's2.p': 'You see the page before it is finished and say what should change.',
  's3.t': 'Launch', 's3.p': 'Domain, hosting, Google: I set it all up.',
  's4.t': 'Care', 's4.p': 'New prices, new photos, new hours: one message is enough.',
  'about.eyebrow': 'About me',
  'about.text': 'I am 22, live in Germany and build websites by hand: no site builder, no agency overhead. You talk directly to the person who builds your site.',
  'contact.eyebrow': 'Contact', 'contact.title': 'Tell me about your project',
  'contact.lead': 'I reply within 24 hours.',
  'f.name': 'Name', 'f.biz': 'Business', 'f.pkg': 'Package', 'f.msg': 'Message',
  'f.unsure': 'Not sure yet', 'f.send': 'Send enquiry',
  'privacy': 'Privacy',
  // strings only the script uses
  'c.email': 'E-mail', 'c.phone': 'Phone', 'c.whatsapp': 'WhatsApp', 'c.instagram': 'Instagram', 'c.city': 'Based in',
  'st.missing': 'Please fill in your name and a message.',
  'st.opening': 'Your e-mail app is opening with the enquiry.',
  'st.noEmail': 'Enquiries are not open yet. Please try again soon.',
  'mail.subject': 'Website enquiry'
};

var DE_EXTRA = {
  'c.email': 'E-Mail', 'c.phone': 'Telefon', 'c.whatsapp': 'WhatsApp', 'c.instagram': 'Instagram', 'c.city': 'Standort',
  'st.missing': 'Bitte Name und Nachricht ausfüllen.',
  'st.opening': 'Ihr E-Mail-Programm öffnet sich mit der Anfrage.',
  'st.noEmail': 'Anfragen sind noch nicht freigeschaltet. Bitte bald erneut versuchen.',
  'mail.subject': 'Website-Anfrage'
};

(function () {
  var root = document.documentElement;
  var nodes = document.querySelectorAll('[data-i18n]');
  var DE = {};
  Array.prototype.forEach.call(nodes, function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in DE)) DE[k] = el.innerHTML;
  });
  for (var k in DE_EXTRA) DE[k] = DE_EXTRA[k];
  var dict = { de: DE, en: EN };
  var lang = 'de';

  function t(key) { return dict[lang][key] || DE[key] || key; }

  /* ---------- prices and VAT note from STUDIO ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-price]'), function (el) {
    var v = STUDIO.prices[el.getAttribute('data-price')];
    if (v != null) el.textContent = v;
  });
  var vat = document.getElementById('vatNote');
  if (vat && !STUDIO.kleinunternehmer) vat.hidden = true;

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- contact rows: null means not rendered ---------- */
  function renderContacts() {
    var list = document.getElementById('contactRows');
    if (!list) return;
    list.innerHTML = '';
    [
      ['c.email',     STUDIO.email,     STUDIO.email && 'mailto:' + STUDIO.email],
      ['c.phone',     STUDIO.phone,     STUDIO.phone && 'tel:' + STUDIO.phone.replace(/[^\d+]/g, '')],
      ['c.whatsapp',  STUDIO.whatsapp && '+' + STUDIO.whatsapp, STUDIO.whatsapp && 'https://wa.me/' + STUDIO.whatsapp],
      ['c.instagram', STUDIO.instagram && '@' + STUDIO.instagram, STUDIO.instagram && 'https://instagram.com/' + STUDIO.instagram],
      ['c.city',      STUDIO.city,      null]
    ].forEach(function (row) {
      if (!row[1]) return;
      var li = document.createElement('li');
      var inner = document.createElement(row[2] ? 'a' : 'div');
      if (row[2]) {
        inner.href = row[2];
        if (/^https:/.test(row[2])) { inner.target = '_blank'; inner.rel = 'noopener'; }
      } else {
        inner.className = 'contact__static';
      }
      var label = document.createElement('small');
      label.textContent = t(row[0]);
      var val = document.createElement('span');
      val.textContent = row[1];
      inner.appendChild(label);
      inner.appendChild(val);
      li.appendChild(inner);
      list.appendChild(li);
    });
    list.hidden = !list.children.length;
  }

  /* ---------- language ---------- */
  var buttons = document.querySelectorAll('[data-lang]');

  function setLang(next) {
    if (!dict[next]) return;
    lang = next;
    root.lang = next;
    Array.prototype.forEach.call(nodes, function (el) {
      var v = dict[lang][el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
    });
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    renderContacts();
    try { localStorage.setItem('aik-lang', lang); } catch (e) {}
  }

  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  var saved = null;
  try { saved = localStorage.getItem('aik-lang'); } catch (e) {}
  if (saved === 'en') setLang('en'); else renderContacts();

  /* ---------- rise into view ---------- */
  var risers = document.querySelectorAll('.rise');
  if (!root.classList.contains('anim') || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(risers, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.filter(function (e) { return e.isIntersecting; }).forEach(function (entry, n) {
        entry.target.style.transitionDelay = (n * 80) + 'ms';
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(risers, function (el) { io.observe(el); });
  }

  /* ---------- form: opens the mail app, sends nothing itself ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['name', 'msg'].forEach(function (n) {
        var f = form.elements[n];
        var bad = !f.value.trim();
        f.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { f.focus(); ok = false; }
      });
      if (!ok) { status.textContent = t('st.missing'); return; }
      if (!STUDIO.email) { status.textContent = t('st.noEmail'); return; }

      var body = [
        'Name: ' + form.elements.name.value.trim(),
        (lang === 'en' ? 'Business: ' : 'Betrieb: ') + form.elements.biz.value.trim(),
        (lang === 'en' ? 'Package: ' : 'Paket: ') + form.elements.pkg.value,
        '',
        form.elements.msg.value.trim()
      ].join('\n');
      status.textContent = t('st.opening');
      window.location.href = 'mailto:' + STUDIO.email +
        '?subject=' + encodeURIComponent(t('mail.subject')) +
        '&body=' + encodeURIComponent(body);
    });
  }
})();
