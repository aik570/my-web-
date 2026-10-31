import fs from 'node:fs';
import markdownIt from 'markdown-it';

const md = markdownIt({ html: false, linkify: true, typographer: true, breaks: true });
// External links in legal texts open in a new tab without passing the opener
const defaultLinkOpen = md.renderer.rules.link_open || ((t, i, o, e, self) => self.renderToken(t, i, o));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  if (/^https?:/.test(tokens[idx].attrGet('href') || '')) { tokens[idx].attrSet('target', '_blank'); tokens[idx].attrSet('rel', 'noopener'); }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

// Text the client still has to confirm is written as [[KLÄREN: …]] in content
// files. It renders as a visible marker, and `npm run check` blocks launch.
const TODO = /\[\[KLÄREN:\s*([^\]]+)\]\]/g;
const markTodos = (html) => html.replace(TODO, '<mark class="todo" title="Vom Kunden zu bestätigen">⚠ $1</mark>');

export default function (eleventyConfig) {
  // Content files are read by data files (prices, legal), not rendered as pages.
  eleventyConfig.ignores.add('src/content/**');
  eleventyConfig.addWatchTarget('src/content/');
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/admin/config.yml': 'admin/config.yml' });

  // Self-hosted vendor files: no third-party requests from the public site.
  eleventyConfig.addPassthroughCopy({
    'node_modules/three/build/three.module.min.js': 'assets/vendor/three.module.min.js',
    'node_modules/three/LICENSE': 'assets/vendor/three.LICENSE.txt',
    'node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2': 'assets/fonts/archivo-latin-wdth.woff2',
    'node_modules/@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2': 'assets/fonts/archivo-latin-ext-wdth.woff2',
    'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2': 'assets/fonts/plex-mono-400.woff2',
    'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2': 'assets/fonts/plex-mono-500.woff2'
  });

  // Decap CMS, self-hosted: main bundle, its lazy chunks and wasm, no source maps.
  const decap = 'node_modules/decap-cms/dist';
  if (fs.existsSync(decap)) {
    const files = {};
    for (const f of fs.readdirSync(decap)) {
      if (/(^|\.)decap-cms\.js$/.test(f) || f.endsWith('.wasm') || f === 'decap-cms.js.LICENSE.txt') files[`${decap}/${f}`] = `admin/${f}`;
    }
    eleventyConfig.addPassthroughCopy(files);
  }

  eleventyConfig.addFilter('md', (s = '') => markTodos(md.render(String(s))));
  eleventyConfig.addFilter('todo', (s = '') => markTodos(String(s)));
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v).replace(/</g, '\\u003c'));
  eleventyConfig.addFilter('euro', (n) => `${Number(n).toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })} €`);
  // Owner-editable amounts inside texts: {befund} = price of the error analysis (site.json, CMS). One source for all pages.
  eleventyConfig.addFilter('fill', (s = '') => {
    const fee = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')).diagnosisFee.amount;
    const eur = `${Number(fee).toLocaleString('de-DE', { minimumFractionDigits: Number.isInteger(fee) ? 0 : 2, maximumFractionDigits: 2 })} €`;
    return String(s).replace(/\{befund\}/g, eur);
  });
  eleventyConfig.addFilter('repairName', (r, types = []) => r.label || (types.find((t) => t.id === r.service) || {}).label || r.service);
  // Price list helpers: [brand, brandSlug, model, modelSlug] for the search; device types; repair types in use.
  eleventyConfig.addFilter('modelIndex', (brands = []) => brands.flatMap((b) => b.models.map((m) => [b.brand, b.slug, m.name, m.slug])));
  eleventyConfig.addFilter('categories', (models = []) => [...new Set(models.map((m) => m.category).filter(Boolean))]);
  // Model offer page: repairs vs. accessories (Nunjucks selectattr cannot compare values)
  eleventyConfig.addFilter('repairsOnly', (rows = []) => rows.filter((r) => r.service !== 'zubehoer'));
  eleventyConfig.addFilter('extrasOnly', (rows = []) => rows.filter((r) => r.service === 'zubehoer'));
  eleventyConfig.addFilter('usedTypes', (models = []) => [...new Set(models.flatMap((m) => m.repairs.map((r) => r.service)))]);
  eleventyConfig.addFilter('nbsp', (s = '') => String(s).replace(/ (\S+)$/, ' $1'));
  eleventyConfig.addFilter('absolute', (p, base) => new URL(p, base).href);
  eleventyConfig.addShortcode('year', () => String(new Date().getFullYear()));

  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: false
  };
}
