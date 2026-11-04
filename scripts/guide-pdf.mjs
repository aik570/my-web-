import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); const MarkdownIt = require('markdown-it'); const fs = require('fs'); const path = require('path');
const dir = path.resolve('docs/anleitung');
const NAME = process.argv[2] || 'ADMIN-ANLEITUNG'; const md = new MarkdownIt({ html: false }).render(fs.readFileSync(dir + '/' + NAME + '.md', 'utf8'));
const html = `<!doctype html><html lang="' + (NAME.endsWith('RU') ? 'ru' : 'de') + '"><meta charset="utf-8"><title>Website bearbeiten – Handy Chirurg</title><base href="file://${dir}/">
<style>body{font:11pt/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#222;margin:0}h1{font-size:20pt;color:#1a4a3e}h2{font-size:14pt;color:#1a4a3e;border-top:1px solid #ccd;padding-top:10pt;margin-top:18pt;break-after:avoid}
img{max-width:100%;border:1px solid #ccd;border-radius:4px;margin:6pt 0;break-inside:avoid}table{border-collapse:collapse;width:100%;font-size:10pt;margin:6pt 0}td,th{border:1px solid #ccd;padding:4pt 6pt;text-align:left;vertical-align:top}th{background:#eef4f2}
blockquote{margin:8pt 0;padding:6pt 10pt;background:#fff4d6;border-left:4px solid #c89a00}code{background:#f1f3f2;padding:0 3pt;border-radius:3px}p,li{orphans:3;widows:3}</style>${md}</html>`;
fs.writeFileSync(dir + '/.guide.html', html);
const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://' + dir + '/.guide.html'); await p.waitForTimeout(800);
await p.pdf({ path: dir + '/' + NAME + '.pdf', format: 'A4', margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' }, printBackground: true,
  displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:8pt;width:100%;text-align:center;color:#888">Handy Chirurg · Seite <span class="pageNumber"></span> von <span class="totalPages"></span></div>' });
await b.close(); fs.rmSync(dir + '/.guide.html');
