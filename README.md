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

## Direction

One idea: the red heartbeat line from the logo. It runs under the hero and
spikes just before the photo of the shop door, and it runs through the four
repair steps, spiking at "Reparatur". It is not used anywhere else.

| Token | Value | Role |
|---|---|---|
| `--paper` | `#f7f7f4` | Page ground |
| `--ink` | `#17201e` | Type, primary button, the dark band |
| `--teal-d` | `#22604f` | Links. The logo's skyline teal, darkened for contrast |
| `--pulse` | `#c13329` | The heartbeat line only. Taken from the logo |

Type: IBM Plex Sans for text, IBM Plex Mono for labels, hours and numbers.
One primary button (ink), one ghost button, one text link. 2px corners on
controls, square photographs, hairline rules instead of cards.

Sections, each laid out differently: hero (asymmetric, photo bleeds off the
right edge), services as an index list, steps on the pulse line, prices and
guarantee on a dark band with the two real figures, shop with hours table,
request form.

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

1. **Impressum and Datenschutzerklärung.** Required for a German business
   site. Not on the page yet.
2. **Real photographs** in full resolution. The shop photo is cut from a
   phone screenshot (732 px wide). A bench or repair close-up of their own
   would replace the second use of the shop front.
3. The full text of repair steps 3 and 4 from the old site, and any price list.
4. A WhatsApp number, if it differs from the landline.
