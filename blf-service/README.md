# BLF Service — website redesign

Redesign of https://www.blfservice.de/ for Baum-Land-Forst (tree care,
tree removal, forestry, landscaping, municipal services; Seddiner See,
Brandenburg). The site is in German. Its focus is recruitment (Jobs/Karriere)
and service inquiries.

**Current state:** Stage 05: the Home page in `src/` is implemented with the
approved D2 opening ("Forest Monument × Living System") followed by all Home
sections. Not published: `noindex`, no deployment, no DNS change. Concept
prototypes A, B, C, D and D2 stay in `concepts/` for reference.

**Preview.** Serve the `blf-service/` folder over HTTP:

```
python3 -m http.server 8765
```

Then open `http://localhost:8765/src/index.html`.

| Add to the URL | Effect |
|---|---|
| `?intro=1` | replays the opening intro |
| `?intro=0` | skips the intro |
| `?rm=1` | reduced-motion version (static stacked page) |
| `?t=1.6` / `?t=end` | freezes the intro at a time, for screenshots |
| `?review` | shows the internal review notes |

QA: `node scripts/qa/home-prototype-qa.js <outdir>` (needs Playwright with
Chromium; not a project dependency).

Start with [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

| Where | What |
|---|---|
| `docs/research/` | Asset inventory, content audit, missing information |
| `references/` | Source HTML from the live site and the asset manifest |
| `public/assets/original/` | Assets exactly as served by the live site. Never edited |
| `public/assets/optimized/` | Derived web versions, never wider than the source (`derivatives.json`) |
| `public/fonts/` | Self-hosted fonts with licence files |
| `src/` | Home page: HTML, CSS, JS (opening stage: `styles/stage.css`, `scripts/{motion,growth,stage}.js`). No build step, no dependencies |
| `concepts/` | Direction prototypes A, B, C (Stage 04B) and D (Stage 04D), plus screenshot boards in `concepts/review/` |
| `scripts/qa/` | Playwright QA for the Home page |
| `docs/screenshots/` | Final screenshots of the Home page |
| `scripts/fetch-originals.sh` | Downloads the originals listed in the manifest |

Rules for this project: no invented company facts, no AI-generated or
upscaled substitutes for photographs, and source paths are kept for every
asset.
