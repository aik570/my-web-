# Deployment: preview and production

No DNS or production domain change without explicit approval.

## Settings at a glance

| Setting | Value | Where |
|---|---|---|
| Build command | `npm ci && npm run build` (production adds `&& npm run check`) | `netlify.toml` |
| Publish directory | `_site` | `netlify.toml` |
| Node | 22 (`NODE_VERSION`) | `netlify.toml` |
| Environment variables | **None required.** `CONTEXT` is set by Netlify itself (`production`, `deploy-preview`, `branch-deploy`) | — |
| Secrets | Only the GitHub OAuth **client secret**, stored in Netlify (*Access & security → OAuth*). Never in the repository | Netlify |
| Redirects, headers (CSP, HSTS, noindex for `/admin/`) | as committed | `netlify.toml` |
| 404 page | `_site/404.html`, served automatically by Netlify | — |

Build behaviour by context: previews are marked "Vorschau" and `noindex`; production runs the launch gate (`npm run check`) and **fails on purpose** while any blocker is open (unverified prices, legal review markers, CMS still pointing at the work repository).

## A. Local preview (works now)

```
npm ci
npm run build          # preview build: "Vorschau" marker, noindex
npx http-server _site -p 8080 -c-1     # or: npm run dev
```
CMS locally: `npm run cms` (port 8081) + `npm run dev`, then http://localhost:8080/admin/.

## B. Visual preview without Git (Netlify Drop, ~2 minutes)

For a quick look by the client only. No CMS, and redirects from `netlify.toml` are not applied.
1. `SITE_CONTEXT=branch-deploy npm run build` (or use the prepared `handy-chirurg-preview.zip`, unzipped).
2. Log in at https://app.netlify.com (client's account) → *Sites* → drag the `_site` folder onto the drop area.
3. Open the `*.netlify.app` URL, check it shows the "Vorschau" marker. Do not add a domain.

## C. Recommended: client-owned repository and Netlify site from the start

This avoids connecting the work repository to anything permanent. Everything below is done **by the client** (or by us after they invite us); we never use personal accounts as the long-term owner.

### C1. Client creates (≈10 minutes)
1. **GitHub organisation** (free), e.g. `handy-chirurg`, owner = client e-mail, 2FA on. Create an empty **private** repository, e.g. `handy-chirurg/website`.
2. Invite the developer as collaborator with **Write** (Maintain is not needed).
3. **Netlify team** on the client's e-mail (free tier is enough). Invite the developer as team member (*Developer* role).

### C2. Developer moves the code (≈5 minutes)
```
git remote add client git@github.com:handy-chirurg/website.git
git push client claude/zealous-bohr-71wesv:preview      # review branch
```
Then in `src/admin/config.yml`: `repo: handy-chirurg/website`, `branch: preview`, commit and push to `client/preview`. (Before launch: `branch: main`, see C5.)

### C3. Netlify site (client or developer as team member)
1. *Add new site → Import an existing project → GitHub* → authorise the **Netlify GitHub App for the client organisation, only for this repository**.
2. Build settings come from `netlify.toml`; leave them.
3. *Branches and deploy contexts*: **Production branch `main`** (not pushed yet → nothing is published as production); **Branch deploys: `preview`**.
4. Deploy. Preview URL: `https://preview--<site-name>.netlify.app`. Do **not** add a custom domain.

### C4. CMS login (GitHub OAuth through Netlify)
How it works (checked in the Decap source): the login popup opens `https://api.netlify.com/auth?provider=github&site_id=<site domain>`; Netlify exchanges the code with GitHub using the OAuth App secret stored at Netlify and hands the CMS a GitHub token. Decap requests the GitHub scope **`repo`**.
1. GitHub → **organisation** *Settings → Developer settings → OAuth Apps → New*: Homepage `https://<site-name>.netlify.app`, Callback `https://api.netlify.com/auth/done`.
2. Netlify → *Site configuration → Access & security → OAuth → Install provider → GitHub* → paste Client ID and Client Secret.
3. If the popup fails on the branch URL, add `site_domain: <site-name>.netlify.app` under `backend:` in `src/admin/config.yml`.
4. **Test** on `https://preview--<site-name>.netlify.app/admin/`: log in → open a brand → change one price → *Veröffentlichen* → expect a commit "CMS: preise … geändert" on `preview`, a new branch deploy, the new price on `/preise/<marke>/` after ~1–2 minutes → revert the change.

### Minimum permissions

| Who | Permission | Why |
|---|---|---|
| Netlify GitHub App | Read access to **this one repository** (contents, metadata), commit statuses/deploy hooks as requested by the app | To build on every push |
| GitHub OAuth App | Belongs to the client organisation; no extra permissions to grant | Login for the CMS |
| CMS editor (shop staff) | Own GitHub account, **Write** on this repository, 2FA on | Every *Veröffentlichen* is a commit. Note: the `repo` scope lets the CMS token reach all repositories the editor can access — use an account that only belongs to this organisation |
| Developer | Write on the repository, *Developer* in the Netlify team; removable at any time | Maintenance |
| Domain/DNS | Stays with the client; changed only after written approval | Launch |

## D. Production launch (after all blockers are resolved and the client approved the preview)
1. Set `backend.branch: main` in `src/admin/config.yml`; `git push client preview:main`.
2. Netlify builds `main` as production; `npm run check` must pass, otherwise the deploy fails and nothing changes.
3. Deploy notifications (failed deploys) to the maintainer's e-mail.
4. Domain — **only after written approval**: add `www.handychirurg.de` in Netlify, change DNS at the registrar, enable HTTPS, then activate the second-domain redirect in `netlify.toml` once the canonical domain is confirmed.
5. Update the GitHub OAuth App homepage to the final domain.
6. After the switch: submit `https://www.handychirurg.de/sitemap.xml` in Google Search Console; update website and phone in the Google Business Profile.
7. If `main` gets branch protection, it must allow the editors to push (or switch the CMS to `publish_mode: editorial_workflow`).

## E. Alternative: temporary preview from the work repository
Only if the client accounts are not ready yet: Netlify site from `aik570/my-web-`, production branch set to a name that does not exist and is never pushed, e.g. `handy-chirurg-production` (there is no `main`; the default branch belongs to another project), branch deploy `claude/zealous-bohr-71wesv`. OAuth as in C4. Remove the site once C is done.
