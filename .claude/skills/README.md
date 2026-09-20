# Installed skills

Third-party agent skills, vendored so every session picks them up.
Installed 2026-09-20.

| Skill | Source | Runs here? |
|---|---|---|
| `design-taste-frontend` | Leonxlnx/taste-skill | Yes |
| `design-taste-frontend-v1` | Leonxlnx/taste-skill | Yes |
| `redesign-existing-projects` | Leonxlnx/taste-skill | Yes |
| `minimalist-ui` | Leonxlnx/taste-skill | Yes |
| `industrial-brutalist-ui` | Leonxlnx/taste-skill | Yes |
| `high-end-visual-design` | Leonxlnx/taste-skill | Yes |
| `full-output-enforcement` | Leonxlnx/taste-skill | Yes |
| `gpt-taste` | Leonxlnx/taste-skill | Yes |
| `stitch-design-taste` | Leonxlnx/taste-skill | Yes, output is a DESIGN.md for Google Stitch |
| `image-to-code` | Leonxlnx/taste-skill | No — needs image generation |
| `imagegen-frontend-web` | Leonxlnx/taste-skill | No — needs image generation |
| `imagegen-frontend-mobile` | Leonxlnx/taste-skill | No — needs image generation |
| `brandkit` | Leonxlnx/taste-skill | No — needs image generation |
| `impeccable` | pbakaus/impeccable | Yes |
| `playwright-cli` | microsoft/playwright-cli | Yes |

## Not installed

| Source | Why |
|---|---|
| goabstract/Awesome-Design-Tools | A link directory, not a skill. 22 MB of nothing executable |
| getdesign.md | Blocked by the session network proxy, could not be read |

## Conflict with the project's own rules

The project rule is plain HTML, CSS and JS: no GSAP, no Framer Motion, no
frameworks. Some installed skills assume the opposite:

| Skill | Assumes |
|---|---|
| `design-taste-frontend` | React (32 mentions), GSAP (23), Tailwind (12) |
| `gpt-taste` | GSAP (9), React (4) |
| `design-taste-frontend-v1` | Framer Motion (8), React (5), Tailwind (3) |
| `high-end-visual-design` | Framer Motion, React, Tailwind (1 each) |

Skills are contextual, not automatic. The project rule wins: take the
design thinking from these, not their stack.

## Licences

Each skill keeps its upstream licence. `impeccable` is Apache 2.0.
Check the source repositories before redistributing.
