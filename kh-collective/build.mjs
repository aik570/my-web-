/* Build script for the KH concept.
   1. Bundles src/kh3d.js (three.js + SVGLoader + RoomEnvironment) into vendor/kh3d.js
   2. Copies GSAP, ScrollTrigger, Lenis and the Archivo font into vendor/ and fonts/
   Usage (from a folder that has three@0.170.0, gsap@3.12.5, lenis@1.1.13,
   @fontsource-variable/archivo and esbuild installed):
     node build.mjs <that>/node_modules
*/
import { copyFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const nm = process.argv[2];
if (!nm) { console.error('pass the node_modules path'); process.exit(1); }
const { build } = (await import(join(nm, 'esbuild/lib/main.js'))).default;

mkdirSync(join(here, 'vendor'), { recursive: true });
mkdirSync(join(here, 'fonts'), { recursive: true });

await build({
  entryPoints: [join(here, 'src/kh3d.js')],
  bundle: true, minify: true, format: 'iife', target: 'es2019',
  outfile: join(here, 'vendor/kh3d.js'),
  nodePaths: [nm], legalComments: 'eof',
});

const copy = (from, to) => copyFileSync(join(nm, from), join(here, to));
copy('gsap/dist/gsap.min.js', 'vendor/gsap.min.js');
copy('gsap/dist/ScrollTrigger.min.js', 'vendor/ScrollTrigger.min.js');
copy('lenis/dist/lenis.min.js', 'vendor/lenis.min.js');
copy('@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2', 'fonts/archivo-latin.woff2');
copy('@fontsource-variable/archivo/files/archivo-latin-ext-wdth-normal.woff2', 'fonts/archivo-latin-ext.woff2');
// Fonts are inlined as data: URIs so the page also renders correctly when opened from disk
// (browsers refuse file:// font requests).
const { readFileSync, writeFileSync } = await import('node:fs');
const b64 = f => readFileSync(join(here, 'fonts', f)).toString('base64');
const face = (f, range) => `@font-face{font-family:"Archivo";font-style:normal;font-weight:100 900;font-stretch:62% 125%;font-display:swap;src:url(data:font/woff2;base64,${b64(f)}) format("woff2");unicode-range:${range}}`;
writeFileSync(join(here, 'css/fonts.css'),
  '/* Archivo (SIL Open Font License), inlined by build.mjs */\n' +
  face('archivo-latin.woff2', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD') + '\n' +
  face('archivo-latin-ext.woff2', 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF') + '\n');
console.log('built');
