# Konzept Haus Collective — redesign concept "Kreislauf"

A demo redesign of kh-collective.com, built for a first meeting with the studio.
Open `index.html` in a browser. There is no build step.

## What we know about the client

Collected from public sources. The live site could not be read from the build environment,
so check this against the current site before the meeting.

- **Who:** Konzept Haus Collective GmbH, a "Kreativ Studio für Raumkonzepte und Circular Interior Design".
- **Where:** Potsdam (website). Register entries also name Michendorf and Rheda-Wiedenbrück.
- **Team:** architects, interior architects, furniture enthusiasts and branding experts.
- **Promise:** highly individual, ready-to-build concepts "in allen Budgetebenen".
- **Fields (from the register):** needs analysis, brand-led concepts, buying and selling furniture, installation, for living, hospitality and office.
- **Sister brand:** *Gute Räume*, a concept store at ABC-Straße 15, Hamburg, with B2B Residential and Hospitality.

## Three directions

| | Direction | Idea | Risk |
|---|---|---|---|
| **A** | **Kreislauf** (chosen) | The circle is the brand. Every interaction loops: the preloader ring, the orbiting hero, a pinned five-step cycle, and a material passport. Warm lime plaster, ink, one terracotta accent. | Needs real project photography to land. |
| B | Dark Gallery | Cinematic black, full-bleed photos, slow crossfades. Feels like Joseph Dirand or Studio KO. | Looks like every luxury studio and hides the circular story. |
| C | Raumplan | Swiss grid, floor plans, technical line drawings, mono type. Feels like OMA or Office KGDVS. | Too cold for a studio that sells warmth and furniture. |

**Why A:** "circular" is the one thing that sets them apart from other interior studios, and A is the only direction where it shapes the site itself, not just the copy.

## Reference studios

- **Norm Architects:** restraint, negative space, material calm.
- **Studio David Thulstrup:** editorial project pages, colour used as a material.
- **Spacon & X:** circular furniture done credibly, which is close to KH's story.
- **Note Design Studio:** playful type set against serious interiors.
- **Kinfolk / Fantastic Frank:** photo-led editorial rhythm.

## Page structure

1. Preloader: a ring draws to 100 and opens into the hero
2. Hero: "Räume, die im Kreis denken." with an orbiting photo disc
3. Studio manifesto: words ink in as you scroll, plus the three fields (Wohnen, Hospitality, Büro)
4. **Kreislauf:** a pinned ring with five stations (Bedarfsanalyse → Konzept → Material → Montage → Rückführung)
5. Projekte: a pinned horizontal rail, with a circularity metric on every card
6. **Materialpass:** an interactive material passport (origin, second life, CO₂, take-back)
7. Budgetebenen: three tiers
8. Disciplines marquee
9. Gute Räume: the Hamburg concept store
10. Contact: a magnetic e-mail disc, then the footer wordmark

## Before showing it

- **Placeholders:** project names, the metrics on the cards and the material passport values are invented for the pitch. They are labelled on the page. Replace them with real data.
- **Images:** four are AI-generated mood images on a Higgsfield CDN (`d8j0ntlcm91z4.cloudfront.net`). Download them into `img/` before the meeting, or swap in the studio's own photos.
- **Contact details:** the e-mail address is a guess (`hallo@…`). The address comes from search results.

## Stack

HTML, CSS and JS. The page uses GSAP 3.12.5 with ScrollTrigger (cdnjs) and Lenis 1.1.13 (unpkg).
Fonts are Instrument Serif, Geist and Geist Mono from Google Fonts. If GSAP fails to load, or the
visitor prefers reduced motion, the page skips the loader and shows everything as static.
