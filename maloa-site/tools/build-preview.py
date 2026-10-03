"""Build preview.html from index.html: CSS and local JS inlined, intro plays on every load.
Run from maloa-site/:  python3 tools/build-preview.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'index.html').read_text()
s = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
           lambda m: '<style>\n' + (root / m.group(1)).read_text() + '</style>', s)
s = re.sub(r'<script src="(js/[^"]+)" defer></script>',
           lambda m: '<script>\naddEventListener("DOMContentLoaded",function(){\n' + (root / m.group(1)).read_text() + '});\n</script>', s)
s = s.replace("try { if (!sessionStorage.getItem('maloa-intro')) document.documentElement.classList.add('intro-on'); }\ncatch (e) { document.documentElement.classList.add('intro-on'); }",
              "document.documentElement.classList.add('intro-on');")
s = s.replace('<meta name="viewport"', '<!-- PREVIEW BUILD: generated from index.html by tools/build-preview.py, do not edit. Intro replays on every load. -->\n<meta name="viewport"', 1)
(root / 'preview.html').write_text(s)
print('preview.html', len(s), 'bytes')
