"""Build franchise-presentation.html: franchise.html as ONE file for sharing (Telegram, mail, any browser).
CSS and local JS are inlined, local images become data: URIs (the 1400/900 px variants only), the logo
mask SVG is inlined. Still loaded from the web: Google Fonts, GSAP (jsDelivr), the leaf cut-outs (CDN).
Run from maloa-site/:  python3 tools/build-standalone.py"""
import re, base64, pathlib, mimetypes
root = pathlib.Path(__file__).resolve().parent.parent
s = (root / 'franchise.html').read_text()
def data_uri(rel):
    p = (root / rel).resolve(); mt = mimetypes.guess_type(p.name)[0] or ('image/webp' if p.suffix == '.webp' else 'application/octet-stream')
    return f'data:{mt};base64,' + base64.b64encode(p.read_bytes()).decode()
def inline_css(m):
    css = (root / m.group(1)).read_text()
    css = re.sub(r'url\((\.\./assets/[^)]+)\)', lambda u: 'url("' + data_uri('css/' + u.group(1)) + '")', css)
    return '<style>\n' + css + '</style>'
s = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', inline_css, s)
s = re.sub(r'<script src="(js/[^"]+)" defer></script>',
           lambda m: '<script>\naddEventListener("DOMContentLoaded",function(){\n' + (root / m.group(1)).read_text() + '});\n</script>', s)
# images: keep one sharp variant per picture, inline it, drop srcset
def big(rel):
    for a, b in (('-800.webp', '-1400.webp'), ('-560.webp', '-900.webp')):
        if rel.endswith(a) and (root / rel.replace(a, b)).exists(): return rel.replace(a, b)
    return rel
s = re.sub(r'\s(?:imagesrcset|srcset)="[^"]*"', '', s)
s = re.sub(r'<link rel="preload" as="image"[^>]*>\n?', '', s)
s = re.sub(r'src="(assets/[^"]+)"', lambda m: 'src="' + data_uri(big(m.group(1))) + '"', s)
# links back into the site point at the live repo build, since this file travels alone
s = s.replace('href="index.html', 'href="https://aik570.github.io/my-web-/maloa-site/index.html')
s = s.replace('<meta name="viewport"', '<!-- STANDALONE BUILD of franchise.html (tools/build-standalone.py), do not edit. -->\n<meta name="viewport"', 1)
(root / 'franchise-presentation.html').write_text(s)
print('franchise-presentation.html', round(len(s) / 1024), 'KB')
