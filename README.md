# MYSBDC 2027 — website draft

Draft of the 2027 MySBDC / NorCal SBDC website. Every page is a self-rendering
design file (`*.dc.html`) that loads the shared runtime (`support.js`) and the
FAV NorCal SBDC design system (`_ds/`) at view time.

## Preview

**`index.html` is the preview entry point** — it lists every page, screen, and
creative asset by section. Serve the repo root as a static site and open `/`:

```sh
# local preview
python3 -m http.server 8000
# → http://localhost:8000/
```

Or point any static host (GitHub Pages, Netlify, Vercel) at the repo root.
Pages fetch React from unpkg and fonts from Adobe Typekit, so the preview
needs internet access; there is no build step.

## What's here

| Section | Files |
| --- | --- |
| Marketing site | `MySBDC Homepage.dc.html`, `About`, `Advising`, `Funding`, `Trainings`, `Training Calendar`, `Resources`, `Stories` (+ two `Story - …` pages), `Partners`, `Careers`, `Role - Business Advisor`, `AWS Initiative` |
| MySBDC app | `MySBDC Sign In`, `MySBDC Intake`, `MySBDC Dashboard` (+ rail version) |
| Campaign & creative | `Training Deck`, `Training Thumbnails`, `Training Marketing Video`, `Training Series Video`, `Evergreen Ads` |
| Working files | `Client Journey`, `Mosaic Explorations`, `MySBDC Dashboard export.html` (static export), `MySBDC Dashboard.html` (bundled build) |

Supporting directories: `_ds/` (design-system tokens + bundle), `assets/`
(site imagery), `uploads/` (reference screenshots), plus the runtime and
canvas tooling scripts (`support.js`, `deck-stage.js`, `image-slot.js`,
`*.jsx`).

Layout and composition rules for new pages live in `CLAUDE.md`.
