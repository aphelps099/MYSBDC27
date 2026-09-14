# MySBDC — refined homepage and special-program signup preview

A modern, Nova-led responsive design preview based on `aphelps099/MYSBDC27` at `f01d1908b67bf043ef5973f9eac1b3bbf1d6f97b`, including its homepage, Advising program inventory, intake, and AWS initiative.

## Design

- Proxima Nova leads the hero, service headings, and specialist section with upright medium/semibold type. Proxima Sera remains a restrained accent in the lower call to action and signup introduction. Retains Adobe kit `pkl5rjs` and system fallbacks.
- “Your business, better.” becomes the main headline, paired with the existing Laila O’Boyle photograph.
- Shorter service summaries, native expandable specialty rows, compact impact figures, two original client stories, and the approved navy/pool/cream action mosaic.
- Mobile layouts stack naturally, with 48–52px primary controls, visible menu text, generous form fields, and no fixed overlays.
- Lightweight one-time native animation replaces GSAP loading. All content remains visible, and motion cancels when reduced motion is enabled.

## Signup behavior

`signup.html?program=tfg` carries a public program slug through selection, contact details, review, and completion. Ten options cover the repository’s program inventory plus general advising. New clients provide contact information and a ZIP; existing clients provide their existing email and optional request details. Back/edit preserves inputs. Start over clears them.

This is an interaction prototype. It performs no authentication, account matching, ZIP-to-center lookup, consent signing, enrollment, email delivery, or API writes. Entries are held only in the page’s memory. No localStorage, sessionStorage, cookies, or personal details in URLs. Newsletter also remains a non-submitting preview. Without JavaScript, native forms cannot submit and live signup links are provided.

The completion panel explicitly explains that nothing was submitted. It links to live general signup or the existing team contact. AWS retains its distinct `aws-sbdc@amazon.com` inquiry path from the supplied AWS Initiative page. Program selection is not automatically passed to the external live form. The MySBDC header link remains the existing dashboard preview and is labeled accordingly.

## Production integration

- Allowlist the program slug on the server, map it to verified program IDs, and preserve source/referral separately from program interest.
- For new clients, carry the selected program into the complete required intake and existing consent process; confirm eligibility and location through authoritative data. A syntactically valid ZIP is not a territory match.
- For existing clients, authenticate or verify account ownership before linking the request. Never infer an existing client record from an unverified email or expose whether an email exists. Reuse verified client records to avoid duplicates.
- Route a request only after successful server response. Add loading, retry, duplicate-request protection, and truthful completion feedback when connected.
- Keep AWS partner inquiries distinct from SBDC enrollment and do not promise funding or acceptance.

## Accessibility and verification

Target: WCAG 2.2 AA. Reference: https://www.w3.org/TR/WCAG22/

Verified with DOM interaction checks: program selection; new and existing paths; invalid input; error-summary focus and field relationships; edit/back/reset; safe text rendering; AWS continuation; menu Escape and focus return; no network writes or stored personal details; valid landmarks, labels, local references, and anchors. JavaScript and CSS syntax checked.

Primary text pairs are 5.47:1 or higher; white on the blue action is 8.19:1. Form borders are 4.24:1 against white (above the 3:1 non-text requirement). Reduced-motion and forced-color rules are included. No conformance certification is claimed: browser reflow, 200%/400% zoom, screen-reader behavior, real font rendering, and third-party destination accessibility still require manual audit. This environment did not provide visual browser testing for the static preview.

Existing photography, logos, and fonts retain supplied URLs. Local partner marks are unchanged. Direct image requests were restricted during this session; actual image loading in a browser was not reverified. The Adobe Fonts stylesheet returned HTTP 200. No substitute client photography was invented.

## Content provenance

Program names and descriptions are adapted from `Advising.dc.html`; the AWS email comes from `AWS Initiative.dc.html`. Existing FY2025 homepage values ($549M, 712, 3,723, $201M) are retained as source draft content, not independently audited; the separate $548M brand figure should be reconciled before launch. Client stories and photo captions are preserved from the previous homepage preview.

Live links were resolved against https://www.norcalsbdc.org/ on September 14, 2026, including https://www.norcalsbdc.org/find-your-sbdc/, https://www.norcalsbdc.org/restaurant-program/, https://www.norcalsbdc.org/services/regional/tfg/, and https://www.norcalsbdc.org/services/regional/ptac/.

## Files

Serve this directory as a static site. `index.html` is the homepage; `signup.html` is the program-aware preview; `refined.css` is the shared design system; `app.js`, `signup.js`, and `motion.js` handle progressive interactions. There is no build step or third-party JavaScript dependency.

## Team-review refinement

The opening uses a continuous white field, stronger upright Proxima Nova, tighter section rhythm, and direct service names. The original stories section is preserved exactly, including its responsive CSS. The signup interactions and existing accessibility behavior are unchanged. The hosted preview remains owner-private; team access must be explicitly configured before sharing the link.

## Color-overlay hero direction

The opening now joins headline and photograph on a full-width navy field. The photograph retains its original color and natural skin tones. A directional navy fade is restricted to the left edge on desktop and top/bottom edges on mobile; the center and right of the portrait have no tint. Solid white/pool type and buttons remain above the image. A solid navy caption preserves readable attribution. The hero photograph is static so the protective gradient cannot shift beneath text. On mobile, the image follows the copy and bleeds to the edges, with a vertical gradient joining them. No theme switch, autoplay, or new image is introduced. The stories section and signup behavior remain unchanged. Image-level contrast still requires browser QA before publication beyond this private design preview.

The blue blend and grayscale filter were removed after review: people must retain natural skin tones.

## Impact page

`impact.html` adds a dedicated, responsive editorial impact page, linked from the main navigation. It uses Proxima Nova, an oversized capital result, three supporting result statements, the two existing natural-color client stories, regional reach, and advising/partnership links. `impact.css` is page-scoped. Existing homepage stories and signup are unchanged.

FY2025 figures are taken directly from the supplied draft ($549M, 712 businesses, 3,723 jobs, $201M sales growth). An “About these numbers” disclosure explains their draft status and that the separate client stories can cover other periods. No invented year comparisons, geographic breakdowns, ROI estimates, downloadable reports, or growth charts are included. Photography retains its original color. Static counts are readable immediately and are not animated from zero.

## Brand color restraint

Hero headlines use one color: white on navy, navy on light backgrounds. Do not split display headlines into red/blue or white/blue phrases. Editorial labels on light surfaces are slate/navy. Red is an optional, rare accent; it is not a heading or label color and does not need to appear in every section. Client photos have no accent border. Semantic validation errors retain their accessible error treatment. Photography stays natural in color. This direction supersedes earlier two-tone headline treatments.

## Open page rhythm

The homepage and impact page use spacing, type scale, alignment, and broad color fields to organize content. Decorative header, section, card, statistic, accordion, photograph, and footer rules have been removed, including mobile navigation separators. Story composition and natural-color images are preserved. Open program rows retain their plus/minus affordance and generous tap targets. Link underlines, the current-page navigation cue, input/button boundaries, and keyboard focus remain. Signup form styles are unchanged. CSS parsing and targeted structural checks cover this refinement; no additional browser audit was performed.
