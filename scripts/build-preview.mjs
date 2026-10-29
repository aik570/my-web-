#!/usr/bin/env node
// Builds a self-contained preview of the site that works from any folder or
// sub-path (no server rewrites): every page becomes one flat file
// (/preise/apple/iphone-13/ → preise-apple-iphone-13.html) and all links,
// scripts, styles and fonts use relative paths. Used for the claude.ai
// Artifact preview and for opening the site without a web server setup.
//
//   node scripts/build-preview.mjs [--src=.cache/preview-site] [--out=.cache/preview] [--assets=map.json]
//
// --assets: JSON map { "assets/js/main.js": "/_blob/…" } — files that are
// served from elsewhere (Artifact asset store); they are referenced by that
// URL and not copied. Admin (CMS), sitemap and robots are left out: the CMS
// needs the hosted site.

import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `=${d}`).split('=').slice(1).join('=');
const SRC = path.resolve(arg('src', '.cache/preview-site'));
const OUT = path.resolve(arg('out', '.cache/preview'));
const MAP = arg('assets', '') ? JSON.parse(fs.readFileSync(arg('assets', ''), 'utf8')) : {};

const flat = (p) => {
  if (p === '/' || p === '') return 'index.html';
  if (p.endsWith('.html')) return p.replace(/^\//, '').replace(/\//g, '-');
  return p.replace(/^\/|\/$/g, '').replace(/\//g, '-') + '.html';
};
const assetRef = (p, fromDir) => MAP[p.replace(/^\//, '')] || path.posix.relative(fromDir, p.replace(/^\//, '')) || '.';

// Rewrites one root-relative URL found in a page (pages live at the bundle root).
function rewriteUrl(u) {
  if (!u.startsWith('/') || u.startsWith('//')) return u;
  const [pathPart, hash] = u.split('#');
  const [p] = pathPart.split('?');
  if (p.startsWith('/assets/') || p.endsWith('.json') || p.endsWith('.xml') || p.endsWith('.txt')) return assetRef(p, '') + (hash ? '#' + hash : '');
  if (p.startsWith('/admin')) return 'index.html';
  return flat(p) + (hash !== undefined ? '#' + hash : '');
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const full = path.join(d, e.name);
  const rel = path.relative(SRC, full).split(path.sep).join('/');
  if (e.isDirectory()) { if (rel !== 'admin') walk(full); return; }
  if (rel.endsWith('.html')) pages.push(rel);
  else if (rel.startsWith('assets/') || rel.endsWith('katalog.json')) {
    if (MAP[rel] || rel.endsWith('.gitkeep') || rel.endsWith('LICENSE.txt')) return;
    let body = fs.readFileSync(full);
    const dir = path.posix.dirname(rel);
    if (rel.endsWith('.css')) body = body.toString().replace(/url\((\/assets\/[^)]+)\)/g, (_, u) => `url(${assetRef(u, dir)})`);
    if (rel.endsWith('.js')) body = rewriteJs(body.toString(), rel);
    fs.mkdirSync(path.join(OUT, dir), { recursive: true });
    fs.writeFileSync(path.join(OUT, rel), body);
  }
});

// Module imports and URLs built in scripts.
function rewriteJs(js, rel) {
  const dir = path.posix.dirname(rel);
  js = js.replace(/import\((['"])(\.{1,2}\/[^'"]+)\1\)/g, (m, q, spec) => `import(${q}${MAP[path.posix.join(dir, spec)] || spec}${q})`);
  js = js.replace(/from\s*(['"])(\.{1,2}\/[^'"]+)\1/g, (m, q, spec) => `from ${q}${MAP[path.posix.join(dir, spec)] || spec}${q}`);
  // selector.js: link to the model offer page
  js = js.replace(`href="/preise/' + b.slug + '/' + m.slug + '/#'`, `href="preise-' + b.slug + '-' + m.slug + '.html#'`);
  return js;
}

walk(SRC);
for (const rel of pages) {
  let html = fs.readFileSync(path.join(SRC, rel), 'utf8');
  html = html.replace(/\s(href|src|action)="([^"]*)"/g, (m, a, u) => ` ${a}="${rewriteUrl(u)}"`);
  html = html.replace(/\ssrcset="([^"]*)"/g, (m, s) => ` srcset="${s.split(',').map((part) => { const [u, w] = part.trim().split(/\s+/); return rewriteUrl(u) + (w ? ' ' + w : ''); }).join(', ')}"`);
  html = html.replace(/"catalogue":"\/preise\/katalog\.json"/, `"catalogue":"${assetRef('/preise/katalog.json', '')}"`);
  // price overview search builds model links in an inline script
  html = html.replace(`'/preise/' + m[1] + '/#' + m[3]`, `'preise-' + m[1] + '.html#' + m[3]`);
  html = html.replace(/<link rel="canonical"[^>]*>/, '');
  const name = rel === 'index.html' ? 'index.html' : flat('/' + rel.replace(/index\.html$/, ''));
  fs.writeFileSync(path.join(OUT, name), html);
}
// Entry page for the claude.ai Artifact: the home page without its own
// document skeleton (the Artifact host adds one), title first.
const home = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
const bodyClass = (home.match(/<body class="([^"]*)"/) || [])[1] || '';
const entry = '<title>Handy Chirurg Vorschau</title>\n' +
  `<script>document.documentElement.lang='de';document.addEventListener('DOMContentLoaded',function(){document.body.className+=' ${bodyClass}'})</script>\n` +
  home.replace(/<!DOCTYPE html>\s*/i, '').replace(/<html[^>]*>\s*/, '').replace(/<\/?head>\s*/g, '').replace(/<title>[^<]*<\/title>\s*/, '')
    .replace(/<meta charset="UTF-8">\s*/, '').replace(/<meta name="viewport"[^>]*>\s*/, '')
    .replace(/<body[^>]*>/, '').replace(/<\/body>\s*<\/html>\s*$/, '');
fs.writeFileSync(path.join(OUT, '..', path.basename(OUT) + '-entry.html'), entry);
console.log(`${pages.length} pages → ${OUT}`);
