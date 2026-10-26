# Handy Chirurg Potsdam

Website for the Handy Chirurg repair shop at Dortustraße 23, 14467 Potsdam.
Plain HTML, CSS and JavaScript. No framework, no build step.

```
index.html
css/style.css
js/main.js
img/           shop front photo; the logo is inline SVG in index.html
references/    the client's screenshots and the brief
```

## Direction (concept v3: a clinic for phones)

The brand is "Handy Chirurg", so the page is presented like a clinic, in the
brand's own colours: skyline teal `#2f7a68`, heartbeat red `#c8312a`, logo
charcoal `#2a2a2a`, on clinical white and mint. Type is Archivo at its widest
setting, echoing the spaced capitals of the logo, with IBM Plex Mono for
monitor and chart labels.

- **Intro.** The real logo, traced to SVG (`lg-sky`, `lg-pulse`, `lg-word`
  in the inline `<defs>`), is revealed by a monitor sweep with a glowing dot
  riding the heartbeat line; lettering and stethoscope rise in, then the logo
  flies into the header. Click skips it. Off with reduced motion.
- **Hero.** "Notaufnahme für Ihr Handy." with a patient monitor that shows
  the live opening state (Potsdam time) as a running ECG trace.
- **3D story.** Aufnahme (cracked) → Im OP (exploded, each layer labelled
  with its repair) → Entlassen (screen lit, heartbeat drawn).
- **Sections.** Services as wayfinding signs, the 25 € diagnosis as a
  findings form, the promises as "Patientenrechte" (§ 1–4), the process as a
  treatment path, opening hours as a door board, FAQ as "Sprechstunde", a
  full-width monitor under the phone number, franchise, footer Impressum.

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
