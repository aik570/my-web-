# Konzept Haus Collective — redesign concept "The Voice of Space"

A demo redesign of kh-collective.com for a first meeting with the studio. It is built
on the studio's own identity and copy, with labelled slots where photos will go. Open `index.html` in a browser. There is
no build step.

## Source

All content comes from phone screenshots of the live site (team and about pages),
taken on 5 Nov 2026. The address comes from the site's Impressum via search. Nothing
else is invented, except what is listed under "Gaps".

## Kept from their identity

| Token | Value | Where it came from |
|---|---|---|
| `--blue` | `#1C20FF` | KH mark and body text |
| `--violet` | `#7A2FE6` | text tint mid-page (the colour drifts as you scroll) |
| `--rose` | `#CC4F78` | the pink state of the mark. Their `#CC8395` was deepened for text contrast |
| `--navy` | `#15166E` | dark blue for small text |
| `--paper` | `#FFFFFF` | page ground |
| `--mist` | `#E7E7E7` | video placeholder grey |

- **KH mark:** pinned to the left edge, as on their site. It now turns as you scroll and is redrawn as SVG.
- **Colour drift:** blue → violet → rose → blue. It is now tied to sections instead of running freely.
- **Type:** their wide-tracked grotesk. Archivo stands in, pushed to its widest setting for headlines.
- **Voice:** "Wir geben Räumen eine Stimme. The Voice of Space.", "Old School Telefon", "Be water my friend".

## What the redesign adds

1. Loader: the KH mark draws itself
2. Hero: "THE VOICE OF SPACE" in huge type, with the mark set in as a glyph
3. Studio copy inks in word by word, then their four promises (experience, European makers, sustainable, best terms)
4. **700+** projects counts up. The project types become a kinetic list (hotels, half cruise ships, stadium lounges, a stalactite cave)
5. **Their model as an interaction:** a Low Budget ↔ Einzigartigkeit slider whose answer never changes ("exklusive, identitätsstiftende Räume")
6. Marquee of the furniture brands from Christian's career
7. Film slot that opens from a circle to full frame
8. Team: large portrait slots, one per person
9. Contact: WhatsApp, Email and Old School Telefon as three large rows

## Photo slots

There are no photos yet. Every image place is an animated slot in the brand colours: a drifting
colour field, a 6×6 grid, a scan line, crop marks and the KH mark. Each slot already has its final
crop and is labelled with an ID, a subject and an aspect ratio.

| ID | Subject | Ratio |
|---|---|---|
| R1 | Raum — Hotel / Lobby | 4:5 |
| R2 | Raum — Headquarter | 16:10 |
| R3 | Detail — Material | 1:1 |
| R4 | Raum — Apartment | 3:4 |
| R5 | Detail — Möbel | 4:3 |
| F1 | Imagefilm | 16:9 |
| T1 | Portrait — Christian Hiller | 3:2 |
| T2 | Portrait — Milica Mésterovic | 2:3 |
| T3 | Portrait — David Salcin | 2:3 |

To add a photo, put an `<img src="img/…" alt="…">` inside the figure with `object-fit: cover`.

## Gaps to fill before the meeting

- **Video:** their site has a film, but there is no file yet. Save it as `video/kh-collective.mp4` and slot F1 plays it.
- **Photos:** to be shot. See the slot list above.
- **Contact links:** the WhatsApp, Email and phone links are `#`, because the screenshots don't show the numbers.
- **Partial bios:** the screenshots cut the bios off.
  - Milica's bio is joined from two fragments.
  - David's sentence ends with "David wäre es.", which is reconstructed.
  - Check both against the site.
- **First screen:** the top of their homepage was not captured. The hero uses their own line "The Voice of Space".

## Stack

HTML, CSS and JS. The page uses GSAP 3.12.5 with ScrollTrigger (cdnjs) and Lenis 1.1.13 (unpkg).
Archivo comes from Google Fonts. If GSAP fails to load, or the visitor prefers reduced motion,
the page skips the loader and shows everything as static.
