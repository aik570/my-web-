// npm run build && node scripts/test-cms-guide.mjs
// Screenshots for docs/anleitung/ADMIN-ANLEITUNG.md from the real /admin/ (local backend) + checks of
// "add a device" and "edit a text": publish → rebuild → visible on the site. All files restored at the end.
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn, execSync } from 'node:child_process';
const OUTD = 'docs/anleitung/bilder', FILES = ['src/content/prices/apple.json', 'src/_data/home.json', 'src/_data/site.json', 'src/_data/modelImages.json'];
const orig = Object.fromEntries(FILES.map((f) => [f, fs.readFileSync(f, 'utf8')]));
const serve = (root, port) => http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'; fs.readFile(path.join(root, p), (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.yml': 'text/yaml', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' }[path.extname(p)] || 'application/octet-stream' }); r.end(d); }); }).listen(port);
const proxy = spawn('node_modules/.bin/decap-server', [], { env: { ...process.env, PORT: '8081' }, stdio: 'ignore' });
const site = serve('_site', 8080); await new Promise((r) => setTimeout(r, 2500));
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1280, height: 820 }, deviceScaleFactor: 1 });
let failed = 0; const ok = (c, m) => { console.log(`${c ? '  ✓' : '  ✗'} ${m}`); if (!c) failed++; };
const mark = async (loc) => { await loc.evaluate((e) => { e.style.outline = '4px solid #e5242a'; e.style.outlineOffset = '3px'; e.style.borderRadius = '6px'; }); };
const unmark = () => page.evaluate(() => document.querySelectorAll('[style*="outline"]').forEach((e) => { e.style.outline = ''; }));
const shot = async (name) => { await page.waitForTimeout(400); await page.screenshot({ path: `${OUTD}/${name}.png` }); await unmark(); };
const field = async (label, nth = 0, scope = page) => page.locator('#' + await scope.locator('label', { hasText: new RegExp('^' + label) }).nth(nth).getAttribute('for'));
const publish = async (doShot) => {
  const btn = page.getByRole('button', { name: /^Veröffentlichen/ }).first(); await btn.click(); await page.waitForTimeout(600);
  if (doShot) { await mark(page.locator('text=Jetzt veröffentlichen >> visible=true').first()); await shot('09-veroeffentlichen'); }
  await page.locator('text=Jetzt veröffentlichen >> visible=true').first().evaluate((e) => (e.closest('[role="menuitem"]') || e.parentElement).click()); await page.waitForTimeout(3500);
};
try {
  await page.goto('http://localhost:8080/admin/'); await page.waitForTimeout(3500);
  const login = page.getByRole('button', { name: /login|anmelden/i });
  await mark(login.first()); await shot('01-anmelden');
  await login.first().click(); await page.waitForTimeout(3000);
  await shot('02-uebersicht');

  // repair price
  await page.goto('http://localhost:8080/admin/#/collections/preise/entries/apple'); await page.waitForTimeout(4500);
  const item = page.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('[class*="NestedObjectLabel"]', { hasText: /^iPhone 16 Pro Max$/ }) }).first();
  await item.scrollIntoViewIfNeeded(); await mark(item.locator('[class*="NestedObjectLabel"]').first()); await shot('03-modell-finden');
  await item.locator('button').first().click(); await page.waitForTimeout(800);
  const row = item.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('[class*="NestedObjectLabel"]', { hasText: /^akku\b/ }) }).first();
  await row.scrollIntoViewIfNeeded(); await row.locator('button').first().click(); await page.waitForTimeout(700);
  const price = row.locator('input[type="number"]').first(); await price.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 120); await mark(price); await shot('04-preis-aendern');

  // add a device
  await page.reload(); await page.waitForTimeout(5000);
  const add = page.getByRole('button', { name: /Modell hinzufügen/i }).last(); await add.scrollIntoViewIfNeeded(); await mark(add); await shot('05-geraet-hinzufuegen');
  await add.click(); await page.waitForTimeout(900);
  const models = page.locator('[class*="ListItem-listControlItem"]').filter({ has: page.locator('label', { hasText: /^Modell$/ }) });
  const nw = models.last(); await nw.scrollIntoViewIfNeeded();
  await (await field('Modell', 0, nw)).fill('Testgerät X1');
  await nw.getByRole('button', { name: /Reparatur hinzufügen/i }).first().click(); await page.waitForTimeout(700);
  const rep = nw.locator('[class*="ListItem-listControlItem"]').last();
  const svc = rep.locator('input').first(); await svc.click(); await svc.fill('Display'); await page.waitForTimeout(1200);
  await page.locator('[class*="option"]', { hasText: /^Display$/ }).first().click(); await page.waitForTimeout(400);
  await rep.locator('input[type="number"]').first().fill('99');
  await nw.locator('label', { hasText: /^Modell$/ }).first().scrollIntoViewIfNeeded(); await mark(nw); await shot('06-geraet-ausfuellen');
  await publish(true);
  const apple = JSON.parse(fs.readFileSync('src/content/prices/apple.json', 'utf8'));
  const added = apple.models.find((m) => m.name === 'Testgerät X1');
  ok(added && added.repairs[0].service === 'display' && added.repairs[0].price === 99, 'add device: published Testgerät X1 with Display 99 € into apple.json');

  // product photo
  await page.goto('http://localhost:8080/admin/#/collections/einstellungen/entries/produktfotos'); await page.reload(); await page.waitForTimeout(6500);
  const addPhoto = page.getByRole('button', { name: /foto hinzufügen/i }); await addPhoto.scrollIntoViewIfNeeded(); await mark(addPhoto); await shot('07a-foto-hinzufuegen');
  const first = page.locator('[class*="ListItem-listControlItem"]').first(); await first.locator('button').first().click(); await page.waitForTimeout(800);
  const imgBtn = first.getByRole('button', { name: /bild|image|ersetzen|auswählen/i }).first(); await imgBtn.scrollIntoViewIfNeeded(); await mark(first); await shot('07b-foto-ersetzen');

  // opening hours
  await page.goto('http://localhost:8080/admin/#/collections/einstellungen/entries/kontakt'); await page.reload(); await page.waitForTimeout(6000);
  const hours = page.locator('[class*="ControlContainer"]').filter({ has: page.locator('label', { hasText: /^Öffnungszeiten/ }) }).first();
  await hours.scrollIntoViewIfNeeded(); await mark(hours); await shot('08a-oeffnungszeiten');
  const fee = page.locator('[class*="ControlContainer"]').filter({ has: page.locator('label', { hasText: /^Fehleranalyse/ }) }).first();
  await fee.scrollIntoViewIfNeeded(); await mark(fee); await shot('08b-befund');

  // text
  await page.goto('http://localhost:8080/admin/#/collections/inhalte/entries/startseite'); await page.reload(); await page.waitForTimeout(5500);
  const t = page.locator('textarea, input[type="text"]').nth(1); const before = await t.inputValue(); await t.scrollIntoViewIfNeeded(); await mark(t); await shot('08c-text');
  await t.fill(before + ' TEST'); await page.waitForTimeout(300); await publish(false);
  const home = fs.readFileSync('src/_data/home.json', 'utf8');
  ok(home.includes(before + ' TEST'), `edit text: home.json now contains „…${before.slice(-25)} TEST"`);

  // rebuild and check the site
  fs.rmSync('.cache/guide-out', { recursive: true, force: true });
  execSync('npx eleventy --quiet --output=.cache/guide-out', { stdio: 'pipe' });
  const cat = JSON.parse(fs.readFileSync('.cache/guide-out/preise/katalog.json', 'utf8'));
  const m = cat.brands.find((x) => x.slug === 'apple').models.find((x) => x.name === 'Testgerät X1');
  ok(m && m.repairs.some((r) => r[0] === 'display' && r[2] === 99), 'after rebuild: Testgerät X1 is in the Preisrechner catalogue with Display 99 €');
  ok(m && fs.existsSync(`.cache/guide-out/preise/apple/${m.slug}/index.html`), `after rebuild: model page /preise/apple/${m && m.slug}/ exists`);
  ok(fs.readFileSync('.cache/guide-out/index.html', 'utf8').includes(' TEST'), 'after rebuild: the edited text is on the home page');
  // live check screenshot (calculator with the new device)
  const s2 = serve('.cache/guide-out', 8083); const p2 = await b.newPage({ viewport: { width: 1280, height: 820 } });
  await p2.goto(`http://localhost:8083/reparatur-finden/#apple--${m.slug}`); await p2.waitForTimeout(1500);
  ok((await p2.textContent('.fdevice')).includes('Testgerät X1'), 'Preisrechner shows the new device'); await p2.screenshot({ path: `${OUTD}/10-pruefen.png` }); s2.close();
} finally {
  for (const [f, c] of Object.entries(orig)) fs.writeFileSync(f, c);
  fs.rmSync('.cache/guide-out', { recursive: true, force: true });
  await b.close(); site.close(); proxy.kill();
}
console.log(failed ? `${failed} failed` : 'guide flows passed (files restored)'); process.exit(failed ? 1 : 0);
