# Claude Code handoff — reproduce the approved NorCal SBDC Impact page

Date: November 27, 2026

## Your task

Reproduce the approved Impact page exactly from the existing working implementation. Preserve the composition, typography, copy, photographs, duotone filters, spacing, fixed backdrop, parallax, photo crossfades, responsive layout, navigation, and footer. The user has reviewed this version and called it “very very very good work.” Treat it as the visual and behavioral source of truth. Implementation changes should serve faithful reproduction.

The page is already implemented as a working, buildless HTML/CSS/JavaScript page. Begin by opening that page and reading its source. Copy or faithfully port its actual structure and styles; the prose below explains the implementation, but does not replace it.

## Workspace and source of truth

Workspace:

`/Users/ap457/Documents/ChatGPT/WEBSITE 2027 MYSBDC`

Selected checkout:

`/Users/ap457/Documents/ChatGPT/WEBSITE 2027 MYSBDC/services-wordpress`

Handoff branch: `handoff-impact`

Repository: https://github.com/aphelps099/MYSBDC27/tree/handoff-impact/handoff/front/impact

Base HEAD when this handoff was prepared: `5f800cc667c89fcbcaa5cd136ddcac34d53c0dc1`.

**The approved Impact implementation is included on the `handoff-impact` branch. Fetch and check out that branch to obtain it. The earlier base commit alone does not contain the Impact page. This branch preserves the approved design snapshot; do not replace its shared dependencies with newer main-branch versions without comparing the rendered result.**

Read the workspace `HANDOFF.md`, applicable `AGENTS.md` instructions, and `handoff/front/README.md` first. Verify Git status. Other untracked work already exists in `about-layout-study/`, `homepage-preview/services-explore.*`, and `review/`; leave it intact.

The public design collection is `handoff/front/`. The signed-in application in its parent `handoff/` is a separate product. Do not use the dashboard shell or its build script for this page.

## Open the reference implementation

From the selected checkout, reuse the existing server if it is running:

`http://127.0.0.1:8784/handoff/front/impact/`

Otherwise:

```sh
cd '/Users/ap457/Documents/ChatGPT/WEBSITE 2027 MYSBDC/services-wordpress'
python3 -m http.server 8784 --bind 127.0.0.1
```

Open the URL above in a browser. Scroll the entire page; a screenshot cannot reproduce the fixed backdrop and parallax behavior.

## Exact files to use

Paths below are relative to `services-wordpress/`.

| File | Role |
| --- | --- |
| `handoff/front/impact/index.html` | Complete approved markup, copy, inline SVG duotone definitions, shared navigation/footer |
| `handoff/front/impact/impact.css` | All page-specific styling, breakpoints, photo animation, backdrop, type |
| `handoff/front/impact/impact.js` | Parallax, reveal-on-entry, pause/resume, reduced motion, navigation shrink, language-menu dismissal |
| `handoff/front/impact/assets/` | 17 local photographs/backgrounds plus 3 local font files |
| `handoff/front/impact/sources.json` | Original image/font/content URLs |
| `handoff/front/impact/opening-preview.jpg` | Desktop opening reference; shows the correct fixed seal placement |
| `handoff/front/impact/parallax-preview.jpg` | Central collage/statement reference |
| `handoff/front/impact/SHA256SUMS` | Snapshot checksums for the approved runtime files and required shared CSS |
| `handoff/front/assets/refined.css` | Existing base styles and footer |
| `handoff/front/assets/home-design.css` | Existing shared public design styles |
| `handoff/front/assets/advising-concept-v3/concept.css` | Shared navigation and responsive utilities |

Preserve stylesheet order from the HTML: Adobe Fonts kit, refined.css, home-design.css, advising concept.css, then impact.css. The page-specific stylesheet intentionally overrides shared styles. Its custom classes use `legacy-` to avoid collisions with older Impact styles in the shared CSS. Preserve that isolation.

If moving the page elsewhere, include all dependencies above and update relative paths deliberately. Copy inline SVG filters with their IDs and component values intact. Keep real image files; do not replace them with placeholders, generated photos, or generic gradients.

The collection homepage `handoff/front/index.html` now links “Explore our impact” to `impact/`. The collection README and manifest also include this route.

## Approved design and sequence

The reference is California SBDC’s Legacy page, https://www.californiasbdc.org/legacy/. The user also supplied a complete March 23, 2023 Wayback screenshot. That archived screenshot has a substantial text opening which is missing from the current live page. **Our implementation restores that opening before the photos.** Do not remove it after looking only at the current live URL.

The approved order is:

1. Existing NorCal navigation on navy.
2. Spacious centered, uppercase Sentinel headline: “Small business. / Lasting impact.” A large faint SBDC seal stays fixed behind it.
3. A larger Sentinel introductory paragraph followed by a Proxima supporting paragraph, in a centered reading column.
4. Discreet Pause motion control, then a full-width 5-column × 3-row photograph grid. No outer grid margins. Navy gutters. Three cells crossfade slowly between advisors.
5. Two short narrative paragraphs on navy, over the same fixed seal.
6. A full-width blue collage with centered Sentinel statement: “When a small business moves forward, a whole community moves with it.” The collage moves at a different rate from the text when scrolling.
7. “The right support. / A different possibility.” and two paragraphs, plus How advising works.
8. A full-width three-image band: laboratory, electric tractor, wind turbines, using the original Legacy filters.
9. “Real progress. / In people’s own lives.” with the Yarrow Goods account, historical results, story link, and source link.
10. “Your next chapter / starts here.” and a red Get advising button.
11. Existing NorCal footer: Good things start here, navigation/contact/socials, large Norcal SBDC wordmark, real funder logos and disclaimer.

Do not substitute the California logo/header/footer. The Legacy visual treatment belongs inside the existing NorCal public-site shell. No decorative section numbering, extra badges, card UI, scroll-jacking, or new hero controls are needed.

## Typography and dimensions

Use the actual files and CSS rather than approximating the fonts.

- The slab font is **Sentinel Light**, verified from the font name table of California’s `2950reg.woff2`. It is locally stored as `assets/sentinel-light.woff2` and registered as `Impact Sentinel`.
- Some headings use CSS weight 700 on that face to reproduce the reference’s rendered treatment. Do not silently replace this with another serif or an unrelated “slab” font.
- Supporting text/navigation use existing Proxima Nova from `https://use.typekit.net/pkl5rjs.css`. Local Proxima 400/700 files provide the `Impact Proxima` fallback. Footer keeps its existing typography.
- Main navy token: `#0b203d`; backdrop ground: `#071c38`; cream: `#f6f1e6`; pool: `#8fc5d9`. The seal image carries its own tonal treatment. Shared footer navy remains `#1d2c3d`.
- Reading column: max-width 720px; width `calc(100% - 64px)` on desktop and `calc(100% - 40px)` at 600px and below.
- Body paragraphs: 20px, line-height 1.46. Opening lead: 27px Sentinel / 1.45, becoming 25px / 1.4 on mobile.
- Opening headline: clamp(32px, 3.2vw, 46px), uppercase, weight 700, line-height 1.45, tracking .13em. At ≤600px: 30px, tracking .08em, line-height 1.4.
- Opening headline padding: 110px top. Intro starts 105px below the headline block. Mobile uses 62px and 60px respectively.
- Other narrative headings: clamp(34px, 3.2vw, 44px), Sentinel 400, line-height 1.14. Mobile: 36px / 1.13.
- Desktop grid: exactly 15 square cells / five columns, 8px gutters, viewport-edge bleed. At ≤900px gutters are 6px; at ≤600px it becomes three columns / five rows with 5px gutters. At ≥1600px tiles use aspect-ratio 1.12.
- Lower band: three columns, 10px gutters, square images. Mobile keeps three columns with 5px gutters and portrait aspect-ratio .7.
- Central statement band: minimum height 530px, blue `#3f83a2`; mobile minimum 430px. Text remains above the image layer and is centered across the 720px column.

The CSS file is the final authority for all breakpoint interactions, margins, and inherited overrides. Avoid “cleaning up” CSS while reproducing the page unless you verify identical computed results.

## Fixed background and motion — essential behavior

### Fixed seal

`assets/fixed-seal.jpg` is the exact image used by the Legacy reference. `.legacy-backdrop` is fixed to the viewport with `inset:0`, cover sizing, no repeat, pointer-events:none, and z-index 0. Main and footer are positioned above it. Navy prose sections remain transparent so the seal continues behind them; photograph bands and footer cover it.

The seal must stay in the same viewport position as text scrolls. Do not turn it into repeated per-section decorative images. On mobile its background position changes to `40% center` as implemented.

### Collage parallax

`assets/celebration-collage.jpg` is the original Legacy collage. The statement section clips an oversized absolutely positioned background (`inset:-100px 0`). It uses opacity .31 and mix-blend-mode:overlay over `#3f83a2`.

JS calculates the distance between viewport center and statement center, multiplies by .15, and clamps vertical translation to ±90px. Only the image moves; text remains in normal page flow. Updates use a passive scroll listener and requestAnimationFrame. No parallax library is required.

### Image reveals and photo crossfades

- IntersectionObserver reveals photographs with opacity only: .9s, cubic-bezier(.5,0,0,1), small staggered delays. No scale/fly-in effects.
- Three advisor cells crossfade on 36-second loops with offset phases. The actual keyframes and phases are in the source. Keep the slow pace.
- Pause motion freezes the crossfades and parallax. Play motion resumes them. The button exposes aria-pressed.
- `prefers-reduced-motion: reduce` disables crossfades, makes reveals immediately visible, resets parallax, and hides the unnecessary motion control. Preference changes are handled while the page is open.
- Page content stays visible if JavaScript fails: reveal hiding is enabled only after initialization.
- Anchor/focus navigation is immediate (`scroll-behavior:auto`); photo effects have their own motion behavior.

## Copy, photography, links

Copy is already adapted to NorCal. Preserve the exact approved HTML text for a faithful rebuild. Do not reintroduce the California reference’s dated GDP, venture-capital, or statewide business-count claims.

The Yarrow figures are explicitly historical, sourced from https://www.norcalsbdc.org/shared/client-stories/yarrow-goods/ : $138,000 is the sum of five listed financing sources; 20% sales growth is explicitly reported. Retain the source link and historical label. These are one client’s results, not regional totals.

Opening photos come from the user-supplied NorCal Brand House library. The central collage, fixed seal, lower photo band, and exact SVG duotone transfer values come from Legacy. Original URLs are recorded in sources.json. The lower wind photograph is illustrative; do not present it as a named client.

Local links connect Advising, Stories, and the Yarrow Goods detail within the collection. Get advising uses the existing real NorCal intake URL. Keep the existing MySBDC destination and the English-only language-menu disclosure. Do not invent integrations.

The new page’s principal photos and fonts are bundled locally. Adobe Fonts and the existing remote partner-logo URLs still require network access. Preserve real funder marks and the required disclaimer.

## Scope and implementation destination

This approved version is a **local static design study in `handoff/front/impact/`**. The user authorized committing and pushing this source handoff as `handoff-impact`. It has not been merged, deployed, or migrated to WordPress. Source publication does not authorize a website deployment.

If asked to rebuild the static page, work in this collection or an explicitly requested destination. If later asked to integrate with the custom MySBDC WordPress theme, read `wp-theme/README.md`, inspect existing Impact templates/content, and port the approved design deliberately. Preserve saved WordPress content and existing block contracts. Never seed over editorial content. For theme CSS/JS covered by `wp-theme/sync-assets.sh`, edit the preview sources and run the sync script rather than editing generated theme copies.

The approved geography-video homepage remains intact; only its local Explore our impact destination was changed. Do not replace that hero with this grid. Do not introduce Astra/Fable, a page builder, or a framework migration.

## Verification before handoff

1. Compare the rebuilt page with the actual working reference at desktop widths and 390px mobile. Review opening, photo grid, prose, central collage, lower photos, closing, and footer.
2. Confirm exactly 15 opening cells, five desktop columns, three mobile columns, full viewport bleed, and no horizontal overflow.
3. Verify Sentinel loads, body type remains 20px, and all photographs/logos load. Preserve face crops and the SVG duotone colors.
4. Scroll: the seal’s viewport top stays at 0 while prose moves; the collage transform changes independently; no background gaps appear at section edges.
5. Test Pause/Play, reduced-motion startup and runtime changes, language menu Escape/outside click, visible keyboard focus, and internal/external links.
6. Check one H1, unique IDs, valid anchors, all local asset paths, JS syntax, and browser errors.
7. Verify the footer’s cream text is visible on navy; preserve all real partner logos, social accessible names, and disclaimer.
8. Update workspace HANDOFF.md with the final checkout, changed files, checks, and publishing status.

Existing verification: desktop and 390px mobile layouts reviewed; no overflow; all page images loaded; fixed seal and changing parallax translation observed; Pause set all three crossfades to paused; full-page composition/footer reviewed; browser error log empty. Node behavior checks passed for parallax math, pause/resume, and reduced-motion startup/preference changes. JS syntax, unique IDs/one H1, 15-cell count, local asset/link/anchor checks, and Git whitespace checks passed. Reduced-motion behavior was checked in a Node DOM stub, not through an OS preference toggle or a physical mobile device.

To verify an unchanged local source snapshot:

```sh
cd '/Users/ap457/Documents/ChatGPT/WEBSITE 2027 MYSBDC/services-wordpress/handoff/front'
shasum -a 256 -c impact/SHA256SUMS
```

Full-page screenshots can misrepresent viewport-fixed backgrounds. Use the live scroll behavior and the saved viewport screenshots when judging seal placement.
