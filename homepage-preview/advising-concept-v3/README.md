# Advising V3 — image-first hero

November24,2026. User approves the vector-art direction and asks for a hero driven by real business imagery. Separate V3 preserves V2 at6dfdf9e.

Preview: http://127.0.0.1:8784/homepage-preview/advising-concept-v3/
Compare: http://127.0.0.1:8784/homepage-preview/advising-concept-v2/

Combined the former text hero and Dick Taylor photo section into a single image-first opening. Large real business photograph on the left, “Big decisions. Everyday details.” headline and concise advising message/CTA on the right. The photograph crosses the navy-to-cream transition with pool backing and red lower edge. On mobile the photograph leads, followed by caption, headline, description and CTA.

Conversation artwork retained at smaller supporting scale; conversation-light.svg adapts the original colors for cream. Plan/book artwork and all lower-page markup, navigation, links and footer unchanged from V2. Existing source/provenance notes in ../advising-concept/README.md apply. No new outcome claims. Original concepts and production theme unchanged.

Observed: HTTP200, JS syntax, SVG XML and Git whitespace checks. Desktop1440/994, tablet768 and mobile390 visually checked, no horizontal overflow; all9 images loaded. Adjusted tablet photo height to retain both owners’ faces. Main CTA remains visible within the844px mobile review viewport. Header/footer/sections from expertise onward compared identical to V2. Desktop/mobile screenshots saved. Viewport reset, V3 and V2 retained. No push, PR, deployment or WordPress writes. User acceptance pending.

## Header polish — November24,2026

User rejected red photo edges and blue offset backing on these pages. Added a clear Advising H1 within the navy band; former hero message is now H2. Both current studies load `../concept-page-headers.css` for consistent clean photo treatment, cream opening, aligned columns, restrained headlines and mobile spacing. Lower-page markup verified unchanged. Desktop/mobile390 inspected; no overflow; computed photo border0 and backing pseudo-element none. New header-polish-preview.jpg records the current opening; earlier screenshots are historical. No theme or WordPress changes.

## Meet your business person — November 24, 2026

Added a short advisor introduction between the opening and expertise sections. Three large black-and-white portraits, slightly staggered on desktop, stack cleanly on mobile. Pale pool/cream background uses existing tokens. New isolated `advisors.css` does not affect Training. All other markup verified unchanged.

These are temporary existing North Coast SBDC photographs, with real names and concise specialties verified against official profiles, not invented advisors. Final photography and selection remain open:

- [Melanie Barnett](https://www.northcoastsbdc.org/team-members/melanie-barnett/): food businesses and financial projections.
- [Paul Bozzo](https://www.northcoastsbdc.org/team-members/paul-bozzo/): business planning and funding.
- [Amandeep Singh](https://www.northcoastsbdc.org/team-members/amandeep-singh/): e-commerce and web development.

Image URLs were already present in the About study. Visible concept note discloses temporary selection. CTA uses existing local-center finder. No availability or matching guarantees. Desktop 994/1440 and mobile 390 visually checked, portraits loaded, no horizontal overflow. `advisors-preview.jpg` captures the current section. No theme/WordPress changes or publishing.

## Split photography composition — November 24, 2026

User supplied a reference with centered text and a small portrait on the left and a tall full-height photograph on the right. Replaced the three-person gallery with that composition, retaining Proxima Nova, cream/navy, clean image edges and existing center-finder action. Earlier gallery is preserved at `f354b4c` and in `advisors-preview.jpg`. Current screenshot: `advisors-split-preview.jpg`.

Two new images generated using built-in image_gen: `assets/advisor-portrait-concept.png` and `assets/advising-conversation-concept.png`. Both depict fictional models, explicitly disclosed in visible copy and alt text; no real identities or biographies are attached. Full prompts and provenance: `assets/image-prompts.md`. Originals copied into project, no external generated-image dependency.

Checked desktop 994/1440 and mobile 390: both images loaded, crops visually inspected, no horizontal overflow. Section becomes a single column on mobile. Rest of page markup compared unchanged; Training and shared styles untouched. No WordPress changes or publication. New composition awaits user review.

## Section placement — November 24, 2026

Moved the unchanged Meet your business person split section to the end of main, replacing Keep learning, after How it works and immediately before the footer. Removed trailing section margin for a clean transition. Other markup verified unchanged. Current context screenshot: advisors-closing-preview.jpg. No publication or WordPress changes.
