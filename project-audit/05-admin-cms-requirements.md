# 05 — Admin panel and CMS requirements

## A. What exists today

| Capability | In repository | On live site |
|---|---|---|
| Admin panel / CMS | **None** [V-code] | Unknown [U]. The hosting platform of handychirurg.de is not known |
| Authentication, roles | None [V-code] | Unknown |
| Data storage | None; all content is hard-coded in `index.html` [V-code] | Unknown. The repair selector implies a price/model dataset somewhere |
| Publishing workflow | None (manual file edits + git) [V-code] | Unknown |
| Backups | Git history only [V-code] | Unknown |

**No admin feature is functional today.** Every item in the matrix below must be built.

## B. Recommended architecture (for approval)

The concept is a static page with a 3D scene and no server code. The simplest maintainable path keeps it static and adds a Git-based CMS.

| Option | Description | Pros | Cons | Fit for 6 days |
|---|---|---|---|---|
| **A — Static generator + Git CMS (recommended)** | Eleventy (11ty) templates render the concept from JSON/Markdown content files. Decap CMS (or the compatible Sveltia CMS) at `/admin` edits those files. Each save is a commit; the host rebuilds automatically | No server, no database, no plugin updates. Fast and secure. Full version history = backup and rollback. Design and 3D carried over 1:1 | Owner needs a login via a Git provider (GitHub account) or an auth bridge. Editing very large nested price lists in the UI is clumsy | **Yes** |
| B — WordPress custom theme + ACF | Port the concept into a theme; content in ACF fields and custom post types | Familiar UI, mature roles, media library, backup plugins | PHP hosting, ongoing core/plugin updates and security patching. More build time to port the 3D page into a theme | Possible, tighter |
| C — Custom admin (Node + database) | Own login, own editor | Full control | Most code, own security responsibility (auth, sessions, CSRF, uploads) | **No** |

**Recommendation: Option A.** Hosting on Netlify or Cloudflare Pages (both offer a data processing agreement). If the client requires hosting in Germany or already pays for a German host, decide before day 1 (Q14) — it changes the deploy setup.

Notes on A:
- **Authentication:** Netlify Identity, the classic Decap login, has been announced as deprecated. Plan for GitHub login (owner gets a free GitHub account with access to this one repository) or an OAuth bridge. Verify the current state on day 1 before configuring.
- **Prices:** if the price list has more than ~150 rows, keep it as a CSV/Excel upload in the CMS (owner exports from the same sheet they already maintain), validated at build time, instead of hundreds of nested form rows.
- Editable content is never stored in browser state or `localStorage`. It is committed to the repository and rebuilt.

## C. Requirements matrix

Permissions for all types: **Owner (editor)** can edit and publish; **Developer (admin)** can edit schema and templates. No public write access. All types: **must be built**.

| # | Content type | Editable fields | Data structure | Where it appears | Validation | Priority |
|---|---|---|---|---|---|---|
| C1 | **Business info** | Name, street, postcode, city, phone (display + dial format), WhatsApp number, email, Google Maps URL | Single `site.json` | Header, hero monitor, board, call section, footer, JSON-LD, meta | Phone E.164 (`+49…`), email format, postcode 5 digits, required fields | **P0** |
| C2 | **Opening hours** | Per weekday: open/closed, from, to | Array of 7 in `site.json` | Header chip, monitor, hours table, footer, JSON-LD | `HH:MM`, from < to | **P0** |
| C3 | **Special closures / holidays** | Date, label, closed or alternative hours | List in `site.json` | Monitor and chip override, optional banner | Valid date; past entries ignored | P1 |
| C4 | **Services** | Title, short text, duration note, pictogram (choice of 4–8), order, visible | Collection `services/*.json` | HOME-04 signs, 3D tags, `/preise` grouping | Title ≤ 30 chars, text ≤ 140 | **P0** |
| C5 | **Brands and models** | Brand name, models (name, device type), order | Collection or part of price sheet | Price selector, `/preise` | Unique names per brand | **P0** |
| C6 | **Prices** | Brand, model, repair type, price (€), "ab" flag, note (e.g. "Original / kompatibel"), availability, updated date | CSV upload or collection | Price selector result, `/preise` table | Price numeric ≥ 0 or "auf Anfrage"; repair type from C4; no duplicate brand+model+repair | **P0** |
| C7 | **Diagnosis fee** | Amount, text | `site.json` | HOME-05, FAQ | Numeric | **P0** |
| C8 | **Homepage texts** | Hero kicker, H1, lede, CTA labels; scene texts (2); section headings and ledes; promises § 1–4 | `home.json` | HOME-01 … HOME-11 | Length limits per field to protect the layout (e.g. H1 ≤ 40 chars) | P1 |
| C9 | **Process steps** | Two tracks × steps: title, text | `home.json` | HOME-07 | 3–5 steps per track | P1 |
| C10 | **FAQ** | Question, answer, order, visible | Collection `faq/*.md` | HOME-09, `/faq` later, FAQPage JSON-LD | Required Q and A | P1 |
| C11 | **Franchise** | Intro, offers list, requirements list, contact email | `franchise.json` | HOME-11, `/franchise` | Email format | P1 |
| C12 | **Legal pages** | Impressum, Datenschutz (rich text) | Markdown files | `/impressum`, `/datenschutz` | Required; changes logged in git | **P0** |
| C13 | **SEO per page** | Title, description, social image | Front matter / `seo` object per page | `<head>`, OG/Twitter tags | Title ≤ 60, description 120–160 chars, image ≥ 1200×630 | P1 |
| C14 | **Media** | Shop photos, social image, alt text | `img/uploads/` via CMS media library | HOME-08, OG | JPEG/PNG/WebP, max ~3 MB upload; alt text required; resized at build | P1 |

**CMS-managed content types: 14** (C1–C14). If only P0 is delivered: 7 types (C1, C2, C4, C5, C6, C7, C12).

Not editable by design: logo and its animation, 3D phone model, colours, typography, layout. These are brand and code assets.

## D. Security, persistence, backup and publishing

| Requirement | Plan under option A |
|---|---|
| Secure access | CMS login through the Git provider (or OAuth bridge); 2FA strongly recommended for the owner account. `/admin` excluded from indexing |
| Validation | Field rules in the CMS config, plus a build-time check that fails the deploy on invalid prices, hours or phone formats (the live site keeps the last good version) |
| Persistence | Content files in the repository; one commit per publish |
| Backup and rollback | Full git history; any earlier version can be restored. Optional weekly repository export |
| Publishing workflow | Option 1: save = publish (simplest). Option 2: editorial workflow "Draft → Ready → Published" with preview. Recommend option 1 plus preview deploys |
| Audit trail | Commit author and timestamp for each change |
| Uploads | Images only; size and type limited; stored in repo |

## E. What must be verified before building

1. Size and format of the official price list (Q7). Determines CSV vs form editing.
2. Whether the owner (or Коля's team) will edit content, and who receives CMS access (Q15).
3. Hosting and domain access for handychirurg.de (Q13, Q14).
