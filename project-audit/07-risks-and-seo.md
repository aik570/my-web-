# 07 — Risks, SEO, accessibility and launch

Likelihood/impact: H high · M medium · L low.

## A. Risk register

| ID | Risk | L | I | Evidence | Mitigation |
|---|---|---|---|---|---|
| R1 | **Official price list not delivered on day 1** | M | H | [B] | Price selector and CMS schema depend on it. Ask today; if late, launch with "Preis auf Anfrage" + call/WhatsApp CTA and fill prices after launch |
| R2 | **Live site cannot be inspected from this environment** | H | H | [V] proxy `connect_rejected` | Allow `www.handychirurg.de` in Network settings, or the client sends a full URL list and page texts. Without it, URL preservation and content parity are guesses |
| R3 | **No domain/hosting access** | M | H | [U] | Launch impossible without DNS access. Request on day 1 |
| R4 | **Legal pages incomplete** (legal form, Impressum address, privacy text) | M | H | [B] | Do not launch without a complete Impressum and an updated Datenschutzerklärung. Legal text is the client's responsibility; we only place it |
| R5 | **Third-party requests without consent** (Google Fonts, jsDelivr) | H (today) | M | [V-browser] | Self-host fonts and three.js (T02). Then no cookie banner is needed if no tracking is added |
| R6 | Removing the live repair selector loses the site's main function | H (in concept) | H | [S] vs [V-code] | Rebuild as P0 (T06) |
| R7 | Contradictory facts on the live site: landline vs mobile number, "Filialen in Berlin", "Du"/"Sie" | H | M | [S] | Client confirms (Q1, Q4); new site uses one version everywhere |
| R8 | Unverified claims: "Original-Ersatzteile", "Zertifizierte Techniker", guarantee without duration | M | M | [S] | Use only confirmed wording; UWG (unfair competition) risk |
| R9 | 3D performance on low-end Android / older iPhones; untested on real iOS Safari | M | M | [V-code] tested only in Chromium | Device QA (T14); lazy-load 3D after first paint; fallback already exists |
| R10 | CMS authentication path (Netlify Identity deprecated) | M | M | [B] | Decide login method on day 1; GitHub account for owner as default |
| R11 | Shop photo is a 732 px screenshot crop | H | L | [V-code] | Get originals (D3); else keep small display size |
| R12 | Opening state wrong on public holidays | H | L | [V-code] | Special closures field (C3) |
| R13 | Scope creep from client review | M | M | — | Two review rounds in offer; changes after day 5 go to post-launch list |
| R14 | Single developer for 50+ h of P0 work in 6 days | M | H | see 08 | Second person for intake, content, QA |

## B. SEO

### URLs to preserve [B][S] — unverified list
| Old URL | New target | Action |
|---|---|---|
| `/` | `/` | Same |
| `/franchise` | `/franchise` | Same URL |
| `/datenschutz` | `/datenschutz` | Same URL |
| Impressum (path unknown) | `/impressum` | Keep exact old path, or 301 |
| Any other live URL | best match | **Unknown** — needs crawl or live sitemap (D7). Collect before launch and map 301s |

### Potential SEO losses and fixes
| Issue | Detail | Fix |
|---|---|---|
| H1 keyword loss | Old: „Handy Chirurg Potsdam – Ihre Handy-Reparatur Experten". New: „Notaufnahme für Ihr Handy." | Keep the design line but add the keyword, e.g. „Notaufnahme für Ihr Handy in Potsdam" or a visible kicker H1 + display line |
| Lost text content | Live homepage has 9 benefit cards and shop text; concept is shorter | Carry the confirmed claims; keep the shop paragraph |
| Domain ambiguity | handychirurg.de vs handy-chirurg.de | One canonical domain; 301 the other |
| NAP consistency | Phone differs between live site and new site | Same name/address/phone on site, Google Business Profile, directories |
| Missing basics | No canonical, sitemap.xml, robots.txt, absolute OG image | T12 |
| Structured data | `MobilePhoneStore` exists | Add `url`, `geo`, `image`, `priceRange`; FAQPage for FAQ |
| Price pages | None today | `/preise` adds indexable content for model-specific searches (P1) |

## C. Privacy and security
- No forms, no cookies, no analytics in the concept [V-code]. Keep it that way unless the client asks; any analytics needs consent.
- Google Maps only as an outbound link (no embed) — no consent required.
- CMS: login via provider, 2FA, `/admin` noindex, no secrets in the repository.
- Hosting provider DPA (Auftragsverarbeitungsvertrag) to be signed by the client.
- The Datenschutzerklärung must list: hosting provider, CMS/Git provider (only for editors), server logs, contact by phone/email/WhatsApp.

## D. Accessibility [V-browser][V-code]
| Item | Status |
|---|---|
| Skip link, landmarks, `aria-labelledby` on sections | Present |
| Touch targets | No control under 44×44 px at 390 px width |
| Reduced motion | Intro, reveals, 3D smoothing respect it |
| Keyboard | Menu (Esc), tabs (arrows), accordions work |
| 3D canvas | `aria-hidden`; content duplicated in text — OK |
| Signs with hover arrow but no link | Misleading (I-01) |
| Contrast | White on teal `#2f7a68` ≈ 5:1; grey `#5c6764` on white ≈ 5.9:1 — pass AA. Text at 78–80 % white on teal should be re-measured |
| Story length 520vh | Long scroll on phones before content; consider shorter on mobile |

## E. Performance [V-code]
- HTML 72 KB (≈ 50 KB is inline logo path data). Move logo to a cached SVG file.
- three.js ≈ 155 KB gzip + scene code; loaded on every visit. Defer until after first paint.
- Intro overlay holds the page for ~3 s on every load; play once per session.
- Two ECG canvases redraw every frame while visible (shadow blur): check battery/CPU on phones.

## F. Launch concerns
- DNS switch timing and TTL; SSL issued before switch.
- Redirect map live at switch.
- Google Business Profile: website URL and phone must match the new site.
- Search Console: verify domain, submit sitemap, watch coverage for 2 weeks.
- Keep the old site's hosting until the new site is verified live.
