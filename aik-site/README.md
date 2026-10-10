# AIK Studio website

Premium websites for ambitious businesses. English first, German at `/de/`.

The visual system follows `docs/aik-studio/visual-identity-v1.md`: palette (§3), type (§4), motion (§8) and website application (§9).

The A135 Langley listing in the repository root is a separate portfolio piece. It is not part of this site.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step and no third-party requests.

```
index.html         English homepage
de/index.html      German homepage (same structure)
css/site.css       tokens, base, components
js/site.js         header state and mobile menu
fonts/             Space Grotesk + Inter, variable WOFF2, self-hosted (SIL OFL 1.1)
```

The fonts are self-hosted rather than loaded from Google Fonts, so visitors' IP addresses are not sent to a third party (GDPR). Only the Latin subset loads for English and German; the Latin-Ext files load only if a page uses those characters.

Run locally:

```
python3 -m http.server 8765 --directory aik-site
```

## Status

| Part | State |
|---|---|
| Tokens, fonts, base styles | Done |
| Header: text wordmark, navigation, EN/DE switch, mobile menu | Done |
| Hero: static composition, which is also the reduced-motion and no-JS fallback for the future cinematic opening | Done |
| Work (MA'LOA concept), Services, Pricing, Process, FAQ, Contact, Footer | Not started. The navigation anchors point to sections that don't exist yet |
| Cinematic opening (homepage only) | Not started; needs approved assets |
| Logo | Not approved. The header uses a neutral text wordmark ("AIK Studio") until it is |
