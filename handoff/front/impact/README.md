# Impact — Legacy study

Approved visual direction, November 27, 2026. Buildless static page: open `index.html` through the collection HTTP server at http://127.0.0.1:8784/handoff/front/impact/ .

The detailed implementation/Claude handoff is [CLAUDE-HANDOFF.md](CLAUDE-HANDOFF.md). It includes exact source paths, typography, layer behavior, measurements, responsive rules, verification, and publishing boundaries.

Reference: https://www.californiasbdc.org/legacy/ plus the user’s complete March 23, 2023 Wayback capture. The archived text opening is restored before the user’s approved full-width 5×3 grid. Body copy is adapted for NorCal; Yarrow historical outcomes are attributed. The current live Legacy page omits that opening.

Assets and source provenance: [sources.json](sources.json). All principal images and three fonts are local. Existing Adobe Fonts and funder logos remain remote. The exact original duotone definitions are inline in index.html. Shared CSS dependencies live in ../assets/ and must accompany the page. Page-specific classes use legacy- to avoid shared Impact selector collisions.

Motion: viewport-fixed seal, clipped .15-rate collage parallax, .9-second opacity reveals, three 36-second advisor crossfades. Pause/resume and reduced-motion behavior are implemented. Mobile preserves the entire photo set in three columns.

Checks: desktop and390px visual review; all images loaded; no overflow; fixed background/parallax observed; pause verified; full page/footer reviewed; browser error log empty. JS syntax, HTML IDs/anchors/local paths,15tiles, and whitespace checks passed. Reduced-motion initialization/runtime preference changes verified in a Node DOM stub, not an OS toggle. SHA256SUMS records local runtime dependencies relative to the front directory.

Source handoff branch: `handoff-impact`, authorized for commit and push November 27. No merge, website deployment, WordPress content change, or migration. Shared CSS and other page designs are unchanged; the collection homepage’s Explore our impact link now points here.
