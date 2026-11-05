// Password login for the website editor (/admin/). Replaces the GitHub/Netlify OAuth login:
// the owner only types a password. Configure in Netlify → Site configuration → Environment variables:
//   ADMIN_PASSWORD  the editor password (long, only for the owner)
//   GITHUB_TOKEN    a GitHub token with write access to this repository (fine-grained: Contents read/write)
// The token never appears in the repository; after a correct password it is handed to the editor in the
// browser (same message format Decap CMS uses for its OAuth popup).
import { timingSafeEqual, createHash } from 'node:crypto';

const page = (body, status = 200) => new Response(`<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Anmelden – Handy Chirurg</title><style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font:16px/1.4 system-ui,sans-serif;background:#f3f8f6;color:#2a2a2a}
form{width:min(22rem,90vw);display:grid;gap:.75rem;padding:1.75rem;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.08)}
h1{margin:0 0 .25rem;font-size:1.25rem}input{font:inherit;padding:.7rem .8rem;border:1px solid #c9e2da;border-radius:8px}
button{font:inherit;font-weight:700;padding:.75rem;border:0;border-radius:8px;background:#2f7a68;color:#fff;cursor:pointer}
.err{margin:0;color:#c8312a;font-size:.9rem}</style></head><body>${body}</body></html>`,
  { status, headers: {
    'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex',
    // the login window may not be framed by other sites (clickjacking) and loads nothing from elsewhere
    'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer',
    'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
  } });

const form = (error = '') => page(`<form method="post" autocomplete="on">
<h1>Website bearbeiten</h1><label for="pw">Passwort</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
${error ? `<p class="err">${error}</p>` : ''}<button type="submit">Anmelden</button></form>`, error ? 401 : 200);

const same = (a, b) => { const h = (s) => createHash('sha256').update(String(s)).digest(); return timingSafeEqual(h(a), h(b)); };

export default async (req) => {
  const password = process.env.ADMIN_PASSWORD, token = process.env.GITHUB_TOKEN;
  if (!password || !token) return page('<form><h1>Noch nicht eingerichtet</h1><p class="err">In Netlify fehlen ADMIN_PASSWORD und/oder GITHUB_TOKEN (Site configuration → Environment variables). Danach neu veröffentlichen.</p></form>', 503);
  if (req.method !== 'POST') return form();
  // only the login form of this site may post a password (no guessing from other websites)
  const from = req.headers.get('origin');
  if (from && from !== 'null' && new URL(from).host !== (req.headers.get('x-forwarded-host') || req.headers.get('host') || new URL(req.url).host)) return page('<form><p class="err">Nicht erlaubt.</p></form>', 403);
  const data = await req.formData();
  if (!same(data.get('password') || '', password)) {
    await new Promise((r) => setTimeout(r, 1500));   // slows down guessing
    return form('Falsches Passwort.');
  }
  const msg = 'authorization:github:success:' + JSON.stringify({ token, provider: 'github' });
  return page(`<form><h1>Angemeldet</h1><p>Einen Moment …</p></form><script>
(function () {
  var origin = location.origin, msg = ${JSON.stringify(msg)};
  if (!window.opener) { document.querySelector('p').textContent = 'Bitte über /admin/ anmelden.'; return; }
  window.addEventListener('message', function (e) { if (e.origin === origin) window.opener.postMessage(msg, origin); }, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>`);
};
