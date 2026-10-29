// Legal pages are Markdown files in src/content/legal, edited through the CMS.
// Front matter is a few "key: value" lines; the body is Markdown.

import fs from 'node:fs';
import path from 'node:path';

const DIR = 'src/content/legal';

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return { ...data, body: m ? m[2] : raw };
}

export default function () {
  const out = {};
  for (const f of fs.readdirSync(DIR)) if (f.endsWith('.md')) out[path.basename(f, '.md')] = { slug: path.basename(f, '.md'), ...parse(path.join(DIR, f)) };
  return out;
}
