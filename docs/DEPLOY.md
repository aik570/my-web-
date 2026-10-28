# Deployment: preview and production

No DNS or production domain change without explicit approval.

## A. Local preview (works now)

```
npm ci
npm run build          # preview build: "Vorschau" marker, noindex, labelled test prices
npx http-server _site -p 8080 -c-1     # or: npm run dev
```
CMS locally: `npm run cms` (port 8081) + `npm run dev`, then http://localhost:8080/admin/.

## B. Netlify preview from the current branch (needs a Netlify account)

Builds the existing branch `claude/zealous-bohr-71wesv` as a **branch deploy** (context `branch-deploy`): marked "Vorschau", `noindex`, test prices clearly labelled. Production is never published from this setup.

1. Netlify → *Add new site → Import an existing project → GitHub* → install the Netlify GitHub App for the repository `aik570/my-web-` (repository owner must approve).
2. Build settings are read from `netlify.toml` (`npm ci && npm run build`, publish `_site`, Node 22). Leave them.
3. *Site configuration → Build & deploy → Branches and deploy contexts*:
   - **Production branch:** `main` (does not exist in this repository, so no production deploy happens — verify that Netlify accepts it; otherwise choose a branch that is never pushed).
   - **Branch deploys:** "Let me add individual branches" → `claude/zealous-bohr-71wesv`.
4. Trigger a deploy of that branch. Preview URL: `https://claude-zealous-bohr-71wesv--<site-name>.netlify.app`.
5. Do **not** add a custom domain.

CMS on the preview (optional, to test the real login → save → deploy loop):
1. GitHub → *Settings → Developer settings → OAuth Apps → New*: Homepage `https://<site-name>.netlify.app`, Callback `https://api.netlify.com/auth/done`.
2. Netlify → *Site configuration → Access & security → OAuth → Install provider → GitHub* → paste Client ID and Secret. The secret stays at Netlify; never commit it.
3. If the login popup fails on the branch URL, add `site_domain: <site-name>.netlify.app` under `backend:` in `src/admin/config.yml`.
4. Open `https://claude-zealous-bohr-71wesv--<site-name>.netlify.app/admin/`, log in with a GitHub account that has **Write** access to the repository, change one price, *Veröffentlichen*. Expected: a commit "CMS: preise … geändert" on `claude/zealous-bohr-71wesv`, a new branch deploy, the new price on `/preise/` after ~1 minute. Revert the test change afterwards (CMS or git).

## C. Production (after the launch blockers are resolved)

Ownership — everything belongs to the client; the developer is a removable collaborator:

| Item | Owner | Developer access |
|---|---|---|
| GitHub organisation + repository (e.g. `handy-chirurg/website`) | Client | Collaborator, *Maintain* or *Write* |
| Netlify team + site | Client | Team member |
| GitHub OAuth App for the CMS | Client organisation | — |
| Domain / DNS (handychirurg.de) | Client | Only if the client delegates |
| CMS editors | Client staff (own GitHub accounts, 2FA on) | — |

Steps:
1. Create the client repository and push this branch as `main`:
   `git push <client-remote> claude/zealous-bohr-71wesv:main`
2. In `src/admin/config.yml` set `backend.repo` to the client repository and `backend.branch: main`.
3. Netlify site from the client repository, production branch `main`. The production context runs `npm run check`: the deploy **fails on purpose** while any launch blocker remains (official prices not verified, legal placeholders, wrong CMS repository).
4. OAuth provider as in B, with the client's OAuth App and the production domain.
5. Give each editor **Write** access to the repository. If `main` gets branch protection, it must allow these users to push (or switch the CMS to `publish_mode: editorial_workflow`, which works through pull requests).
6. Deploy notifications (failed deploys) to the maintainer's e-mail.
7. Domain: only after written approval. Add `www.handychirurg.de` in Netlify, set DNS at the registrar, enable HTTPS, then activate the second-domain redirect in `netlify.toml` once the canonical domain is confirmed.
8. After switch: submit `https://www.handychirurg.de/sitemap.xml` in Google Search Console; update the website/phone in the Google Business Profile.
