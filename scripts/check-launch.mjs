#!/usr/bin/env node
// Launch gate: lists everything that must be resolved before the site goes live.
// Exit code 1 while blockers remain. Run: npm run check

import fs from 'node:fs';
import path from 'node:path';

const blockers = [];
const warnings = [];
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// 1. Prices must come from the official list, imported and verified
const meta = read('src/_data/pricesMeta.json');
const official = fs.existsSync('src/content/prices') ? fs.readdirSync('src/content/prices').filter((f) => f.endsWith('.json')) : [];
if (!official.length) blockers.push('Preisliste: keine offiziellen Preise in src/content/prices – Datei vom Kunden importieren (npm run import:prices)');
else if (meta.status !== 'verified') blockers.push(`Preisliste: Status „${meta.status}" – Stichproben gegen die Vorlage prüfen, dann im CMS auf „Geprüft" setzen`);

// 1b. CMS must point to the client's production repository and an existing branch
const cms = fs.readFileSync('src/admin/config.yml', 'utf8');
const repo = (cms.match(/^\s+repo:\s*([^\s#]+)/m) || [])[1];
const branch = (cms.match(/^\s+branch:\s*([^\s#]+)/m) || [])[1];
if (repo === 'aik570/my-web-') blockers.push(`CMS: backend.repo ist das gemeinsame Arbeits-Repository „${repo}" – Produktions-Repository des Kunden eintragen (src/admin/config.yml)`);
try {
  const { execSync } = await import('node:child_process');
  const out = execSync(`git ls-remote --heads https://github.com/${repo}.git ${branch}`, { stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 }).toString();
  if (!out.trim()) blockers.push(`CMS: Branch „${branch}" existiert nicht in ${repo}`);
} catch (e) { warnings.push(`CMS: Branch „${branch}" in ${repo} nicht prüfbar (${e.message.split('\n')[0]})`); }

// 2. No open [[KLÄREN: …]] markers in content
const files = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p); else if (/\.(json|md|njk)$/.test(p)) files.push(p);
});
walk('src');
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const m of txt.matchAll(/\[\[KLÄREN:\s*([^\]]+)\]\]/g)) blockers.push(`${f}: ${m[1].trim()}`);
}

// 3. Business data that is still open
const site = read('src/_data/site.json');
if (!site.whatsapp) warnings.push('WhatsApp-Nummer nicht eingetragen (Knopf wird nicht angezeigt)');
if (site.publicHolidays === 'unknown') warnings.push('Feiertagsregel offen (Seite zeigt an Feiertagen „bitte vorher anrufen")');
if (!meta.vatNote) warnings.push('Preisliste: kein Hinweis zur Umsatzsteuer (z. B. „Alle Preise inkl. MwSt.") – Angabe vom Inhaber bestätigen lassen (CLIENT-APPROVAL-CHECKLIST Punkt 6)');
const fr = read('src/_data/franchise.json');
if (!fr.contactEmail) warnings.push('Franchise: keine E-Mail für Anfragen (Knopf ruft die Ladennummer an)');

// 4. Social image size (JPEG header)
try {
  const img = path.join('src', site.seo.image);
  const buf = fs.readFileSync(img);
  for (let i = 2; i < buf.length;) {
    if (buf[i] !== 0xff) break;
    const marker = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc2) {
      const w = buf.readUInt16BE(i + 7);
      if (w < 1200) warnings.push(`Vorschaubild ${site.seo.image} ist nur ${w} px breit (empfohlen ≥ 1200 px, Originalfoto anfordern)`);
      break;
    }
    i += 2 + len;
  }
} catch (e) { warnings.push(`Vorschaubild nicht prüfbar: ${e.message}`); }

// 5. Build output exists
if (!fs.existsSync('_site/index.html')) blockers.push('Kein Build vorhanden – npm run build');

console.log(`\nStartbereitschaft\n`);
blockers.forEach((b) => console.log(`  ✗ ${b}`));
warnings.forEach((w) => console.log(`  ! ${w}`));
console.log(blockers.length ? `\n${blockers.length} Blocker – noch nicht veröffentlichen.` : '\nKeine Blocker.');
process.exit(blockers.length ? 1 : 0);
