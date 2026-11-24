# About V5 — combined direction, November 24, 2026

User prefers V4's minimalist image overlap into the navy title band, but the original `about-concept/?review=desktop-final` content and stronger heading weights. This separate version combines those choices. All earlier concepts remain unchanged.

Preview: http://127.0.0.1:8784/homepage-preview/about-concept-v5/

## Latest: five images, no captions, edge treatment

User requested five images without captions, then suggested images bleeding to the page edge. Gallery now contains Golden Gate, North Coast, Lake Tahoe, Sacramento and Mount Shasta. Five centered dot buttons; no visible captions. Accessible image descriptions, named controls and live slide announcements retained. Manual advance/keyboard/swipe behavior preserved. The regional image reaches the right viewport edge above700px, both edges on mobile; text remains inset. Hero and other content unchanged.

Three added photographs saved locally from Unsplash, with image size metadata checked. Sources/credits (not visible captions):
- Lake Tahoe / Richard Hedrick: https://unsplash.com/photos/a-large-body-of-water-surrounded-by-trees-iLRuvUlZxIc — images.unsplash.com/photo-1687707985204-9bfdabce482f
- Sacramento / Leo_Visions: https://unsplash.com/photos/golden-tower-bridge-over-calm-water-at-dusk-0wE3AAOTvWE — images.unsplash.com/photo-1763924988461-cae38ca2446f
- Mount Shasta / Clay Elliot: https://unsplash.com/photos/white-and-black-mountain-under-blue-sky-during-daytime-Alowh7ERf34 — images.unsplash.com/photo-1601502200081-b85beca6e0c1
- License checked: https://unsplash.com/license . Golden Gate/North Coast remain the existing concept assets with previously noted provenance limits.

Observed all five dot selections update image, selected state and accessible announcement. All5 images loaded, zero gallery figcaptions, one selected dot, stable desktop gallery height536px. Last-to-first keyboard wrapping passed. Desktop1280, tablet768 and mobile390/320 showed no horizontal overflow; image right equals viewport right, and mobile left equals0. Current screenshots: region-edge-preview.jpg and region-edge-mobile-preview.jpg. Five-images screenshots show the intermediate inset version; earlier carousel screenshots show two slides. JS syntax, IDs/targets/local files and whitespace pass. No deployment.

## Earlier two-image regional carousel update

User requested a light-blue image underline and multiple regional views with dots. Replaced the red regional image rule with pool blue. Golden Gate and North Coast imagery now form a two-slide manual carousel with changing captions, native44px dot buttons, selected state, screen-reader announcements, arrow/Home/End keyboard navigation and horizontal touch/pen swipes. No autoplay. Both slides occupy one stable grid footprint; opacity transition respects reduced motion.

North Coast reuses the supplied `../assets/about-redwoods-coast.webp` already referenced by About.dc.html. No new image generated/downloaded. Original acquisition/provenance was not re-established; treat as existing concept imagery. Geographic caption stays broad.

Desktop994/1280 and mobile390 inspected; no overflow320/390/1280. Both images load; dot click and Enter activation, keyboard direction/wrapping, focus, live caption and selected states checked. Carousel height stayed539px across desktop transitions; mobile buttons44×44. Swipe and reduced-motion branches inspected in source, not emulated in browser. Local targets/IDs/files and JS syntax/whitespace checks pass. Current proofs are region-carousel-preview.jpg and region-carousel-mobile-preview.jpg; full-page screenshots below predate the carousel. Other copy/layout remains unchanged.

## Initial V5 composition

- Original main copy is preserved word for word, in the same reading order, including dated FFY2022–2024 impact figures, region/history, partner explanation and closing invitation.
- Original Laila/The Early Rise photo and source story link retained. The photo extends78px into the navy band on desktop; clean edges, no offset shadow or red rule on the hero.
- Headings use Proxima Nova600, matching the computed original page weight; body remains400 at original supporting sizes.
- Three advising principles now form a compact three-column group. The original decorative connected-businesses vector is omitted in this minimalist variation.
- Region copy/count sit together alongside the Golden Gate image, which has a red bottom rule only. Impact and partner/invitation spacing tightened without removing content.
- Original navigation, MySBDC/language control and complete footer are retained. Language menu remains a truthful concept placeholder for additional languages.

No new facts, images, results or testimonials were introduced. Content provenance remains the original concept and its README. This is local preview work; no theme or WordPress changes, publishing or deployment.

Checks: HTTP200, JavaScript syntax, exact original main-copy comparison, exact footer comparison, one H1, unique IDs, local asset and anchor checks, whitespace. Inspected desktop1280 full page and994 people section; mobile390 opening/principles and tablet768 hero. No horizontal overflow320/390/768/1280. All7 images loaded. Computed all main H2 weights600, desktop hero overlap78px. Tested section anchors, back-to-top, language keyboard Enter/Escape and focus return. Viewport reset, QA tab closed; V5 left in canvas. Screenshots: opening-preview.jpg, desktop-preview.jpg, mobile-preview.jpg. User acceptance pending.
