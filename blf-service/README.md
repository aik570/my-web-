# BLF Service — website redesign

Redesign of https://www.blfservice.de/ for Baum-Land-Forst (tree care,
tree removal, forestry, landscaping, municipal services; Seddiner See,
Brandenburg). The site is in German. Its focus is recruitment (Jobs/Karriere)
and service inquiries.

**Current state:** Stage 04: Home prototype and tree intro, for review.

**Preview.** Serve the `blf-service/` folder over HTTP:

```
python3 -m http.server 8765
```

Then open `http://localhost:8765/src/index.html`.

| Add to the URL | Effect |
|---|---|
| `?intro=1` | replays the intro |
| `?intro=0` | skips the intro |
| `?review` | shows the internal review notes |

Start with [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

| Where | What |
|---|---|
| `docs/research/` | Asset inventory, content audit, missing information |
| `references/` | Source HTML from the live site and the asset manifest |
| `public/assets/original/` | Assets exactly as served by the live site. Never edited |
| `public/assets/optimized/` | Derived web versions, never wider than the source (`derivatives.json`) |
| `public/fonts/` | Self-hosted fonts with licence files |
| `src/` | Home prototype: HTML, CSS, JS. No build step |
| `scripts/qa/` | Playwright QA for the prototype |
| `scripts/fetch-originals.sh` | Downloads the originals listed in the manifest |

Rules for this project: no invented company facts, no AI-generated or
upscaled substitutes for photographs, and source paths are kept for every
asset.
