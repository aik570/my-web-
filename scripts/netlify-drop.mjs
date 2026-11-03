// Builds a folder for manual upload (Netlify "Deploy manually") with _headers/_redirects generated
// from netlify.toml, and zips it:  node scripts/netlify-drop.mjs  →  handychirurg-site.zip
// Note: a manual upload is not connected to GitHub – CMS saves go to GitHub but do not rebuild this copy.
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const OUT = '.cache/netlify-drop';
fs.rmSync(OUT, { recursive: true, force: true });
execSync(`npx eleventy --quiet --output=${OUT}`, { stdio: 'inherit', env: { ...process.env, SITE_CONTEXT: 'branch-deploy' } });
const toml = fs.readFileSync('netlify.toml', 'utf8');
const headers = [...toml.matchAll(/\[\[headers\]\]\s*\n\s*for = "([^"]+)"\s*\n\s*\[headers\.values\]\n((?:\s+[^\[\n].*\n?)*)/g)]
  .map(([, path, body]) => path + '\n' + body.split('\n').filter((l) => /=/.test(l) && !l.trim().startsWith('#')).map((l) => { const [k, ...v] = l.split('='); return `  ${k.trim()}: ${v.join('=').trim().replace(/^"|"$/g, '').replace(/\\"/g, '"')}`; }).join('\n'));
fs.writeFileSync(`${OUT}/_headers`, headers.join('\n') + '\n');
const redirects = [...toml.matchAll(/\[\[redirects\]\]\s*\n((?:\s*\w+\s*=.*\n?)+)/g)].map(([, b]) => {
  const g = (k) => (b.match(new RegExp(`${k}\\s*=\\s*"?([^"\\n]+)"?`)) || [])[1];
  return `${g('from')} ${g('to')} ${g('status') || 301}${g('force') === 'true' ? '!' : ''}`;
});
if (fs.existsSync('_site/_redirects')) fs.copyFileSync('_site/_redirects', `${OUT}/_redirects`);
else fs.writeFileSync(`${OUT}/_redirects`, redirects.join('\n') + '\n');
fs.rmSync('handychirurg-site.zip', { force: true });
execSync(`cd ${OUT} && zip -qr ../../handychirurg-site.zip .`);
console.log('handychirurg-site.zip', (fs.statSync('handychirurg-site.zip').size / 1e6).toFixed(1), 'MB;', headers.length, 'header blocks,', redirects.length, 'toml redirects');
