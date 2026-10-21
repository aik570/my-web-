# AS Beauty Salon: AdSense readiness and legal pages (owner checklist)

As of 2026-10-21. This file is **not** part of the website upload; it is only for the owner and the developer.

## 1. Domain decision (required)

- Live and confirmed: `https://potsdambeautysalon.netlify.app/`
- Before this update, the HTML had the canonical `https://www.as-beautysalon-potsdam.de/`. There was no evidence that this domain is registered or connected to Netlify: no `netlify.toml`, no `CNAME`, no DNS information in the project.
- **Current setting:** the canonical, `og:url`, sitemap, robots.txt and JSON-LD all point to the Netlify address.
- **When a custom domain is connected:**
  1. Netlify → Domain management → Add domain → set it as the primary domain. Netlify then redirects the netlify.app address automatically.
  2. Replace `https://potsdambeautysalon.netlify.app/` with the new domain everywhere in these files:
     - `index.html` (canonical, og:url, og:image, JSON-LD url/image)
     - `impressum.html`, `datenschutz.html` (canonical)
     - `sitemap.xml`, `robots.txt`
  3. Submit the sitemap in Google Search Console.
- **AdSense:** a site is added and verified at the level of a domain the owner controls, and `ads.txt` must sit at the root of that domain. You do not control the root of `netlify.app`. **In practice, AdSense needs your own domain.** Re-check this against the current AdSense Help Center before applying; the Google pages could not be opened from the development environment.

## 2. Missing information: owner to provide (do not invent)

| Item | Where | Why |
|---|---|---|
| Postcode: **14471** (Impressum, Datenschutz) or **14467** (homepage, map, JSON-LD) | all pages | Must be consistent. Inconsistent addresses look untrustworthy. |
| Legal form / registered business name, if there is one | Impressum | § 5 DDG |
| VAT ID (USt-IdNr.), if one exists | Impressum | § 5 Abs. 1 Nr. 6 DDG |
| Hairdressing is a licensed trade: professional title (e.g. Friseurmeister/in) and the country that granted it, responsible Handwerkskammer, Handwerksrolle entry, reference to the Handwerksordnung | Impressum | § 5 Abs. 1 Nr. 3 and 5 DDG |
| Consumer dispute resolution (§ 36 VSBG): statement only required with more than 10 employees | Impressum | Decide whether to include it |
| Data processing agreement (AVV) with Netlify; legal basis for the US data transfer (is Netlify certified under the EU-US Data Privacy Framework?); how long Netlify keeps logs | Datenschutz | The text names the usual legal bases. Have them checked. |
| Opening hours (still marked as unconfirmed) | homepage, JSON-LD | Must be correct |
| TikTok handle `@sajjad.sahgaldi7` (unconfirmed) | homepage | |
| Herren price item "Creatine & Protein": probably meant "Keratin & Protein" | preise.js | Wording on the official price list |
| Payment methods (cash/card), cancellation policy | FAQ, optional | Common customer questions; left out on purpose because unknown |
| Review the FAQ wording ("Gut zu wissen") | homepage | Based only on the price list and existing text |

The Impressum and Datenschutz are **not legal advice**. Have a German lawyer or a reputable generator (e.g. e-recht24, IT-Recht Kanzlei) check them.

## 3. AdSense: steps in the dashboard

1. Connect your own domain first (see 1). Apply only once the site is fully reachable under it.
2. AdSense → Sites → Add site → enter the domain.
3. Verification: choose **one** method.
   - **AdSense code snippet:** copy the `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-…">` snippet into the `<head>` of `index.html`. Only with the real publisher ID, and only once, with no duplicate snippet.
   - **or ads.txt:** create a file `ads.txt` in the root folder (next to `index.html`) with **exactly** the line AdSense shows. It looks like this: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`. **Do not create the file before you have the real ID.**
   - **or meta tag:** the `<meta name="google-adsense-account" content="ca-pub-…">` tag in `<head>`.
4. **Privacy & messaging → European regulations (EEA/UK/CH):** create and publish a consent message. Google's own message is a Google-certified CMP. For users in the EEA, AdSense requires a Google-certified CMP that works with the IAB TCF. Without a published message (or another certified CMP), ads are limited or not served in the EEA. **Do not build a custom banner.**
   - In the message, enable the option that lets visitors change their decision later. A link "Datenschutz-Einstellungen" in the footer is then required (see 4).
5. Request a review, then wait. Google decides. Approval is not guaranteed.

## 4. Changes needed to the code once the ID exists (developer)

- Insert the snippet into `index.html` `<head>`: once only.
- The consent message from AdSense is loaded by the same script. Ads only load according to the consent choice. Do **not** run your own ad tags or scripts before consent.
- Add a footer link "Datenschutz-Einstellungen" that calls `googlefc.showRevocationMessage()`. Check the current name in the Google documentation.
- Extend the Datenschutz page with a section on Google AdSense: provider Google Ireland Limited, cookies/identifiers, IAB TCF, consent under Art. 6 Abs. 1 lit. a DSGVO and § 25 TDDDG, withdrawal, transfer to third countries. Remove the sentence "verwendet keine … Werbedienste".
- `_headers` currently sets no CSP, so the Google scripts are not blocked.
- Ad placement: at most 1–2 units, never in the hero, never between the booking buttons, never inside the price list. Only between sections, for example after the FAQ.
