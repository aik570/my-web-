# Handy Chirurg Potsdam

Website for the Handy Chirurg repair shop at Dortustraße 23, 14467 Potsdam.
Plain HTML, CSS and JavaScript. No framework, no build step.

```
index.html
css/style.css
js/main.js
img/           logo and two crops of the shop front
references/    the client's screenshots and the brief
```

## Direction (concept v2)

The page tells one story with one object. A phone arrives with a cracked
screen, opens into its layers as you scroll (display, logic board, battery,
frame, back glass, each labelled with the repair it stands for) and closes
again repaired, its screen drawing the heartbeat line from the logo. The
same red line draws itself in the intro, under the wordmark in the bar, in
the repair steps and under the phone number.

- 3D: Three.js 0.160 from jsDelivr via an import map, `js/phone.js`. The
  phone is built from primitives, no downloaded model. Drag to rotate.
- Scroll drives a `--p` custom property on `#story`; the text scenes fade
  on it in CSS, the 3D pose reads it in JS.
- Without WebGL, or if the CDN fails, the story collapses to its hero after
  8 s. With reduced motion there is no intro and no reveal animation.
- Dark for the story, light for the facts. Type: Geist and Geist Mono.

## Content sources

All copy comes from the client's current site and their WhatsApp Business
profile (screenshots in `references/`). Nothing was invented: the figures
"ab 25 €" and "ca. 60 Minuten" are the shop's own. The page uses "Sie"
throughout; the old site mixed "Sie" and "Du".

Left out on purpose:

- The send-in service and "beiden Filialen in Berlin": that copy was taken
  over from the Berlin site and may not apply to Potsdam.
- The workshop photos and the cracked-screen hero from the old site. They
  look like stock photography and must not stand in for this shop.
- The cartoon doctor mascot.

## Behaviour

- Opening status is computed in Europe/Berlin time: "Jetzt geöffnet" or when
  the shop opens next. Today's row in the hours table is marked. Without
  JavaScript the static hours show.
- The request form builds an e-mail to potsdam@handy-chirurg.de and opens the
  visitor's mail app. The page itself sends and stores nothing.
- No map embed (no third-party requests before consent); a link opens
  Google Maps instead.
- LocalBusiness structured data in `<head>`.

## Still needed from the client

1. **Impressum.** A short version is in the footer (Malake Mansour,
   USt-IdNr., VSBG statement). Legal form must be added. Datenschutz links to
   the existing page on handychirurg.de.
2. **Real photographs** in full resolution. The shop photo is cut from a
   phone screenshot (732 px wide). A bench or repair close-up of their own
   would replace the second use of the shop front.
3. The full text of repair steps 3 and 4 from the old site, and any price list.
4. A WhatsApp number, if it differs from the landline.
