# NorCal SBDC — public website design handoff

Selected current designs, collected November 24, 2026. Start at [Homepage](index.html). This is the public website collection; the signed-in MySBDC client app stays in the parent directory.

| Page | Local route | Selected source |
| --- | --- | --- |
| Homepage | [./](index.html) | Homepage V3 (`datalands-concept-v3`) |
| Advising | [advising/](advising/index.html) | Advising V3, including advisor section and flow polish |
| Training | [training/](training/index.html) | Current Training concept |
| About | [about/](about/index.html) | About V5, five-image carousel, edge bleed |
| Stories | [stories/](stories/index.html) | Current Stories concept |
| Funding | [funding/](funding/index.html) | Current Funding concept with currency photography |
| Yarrow Goods | [stories/yarrow-goods/](stories/yarrow-goods/index.html) | Latest detail, All stories underneath Stories |

Preview from the running repository server: http://127.0.0.1:8784/handoff/front/ . Or run `python3 -m http.server 8784` from the repository root. No build step is required.

## Contents and maintenance

All referenced local CSS, JavaScript, photos and illustrations are included under assets/. This folder has no runtime dependency on homepage-preview or the dashboard assets. Remote business images, videos, logos and Adobe Fonts retain their existing URLs and require network access. No remote media was newly downloaded for packaging.

The seven HTML files are editable handoff pages. The original concepts and earlier versions remain in homepage-preview for comparison. manifest.json maps the selected source pages/assets. notes/ holds original source READMEs as historical provenance; their relative preview links and screenshot references refer to the original studies, not files bundled here. Do not treat those notes as a build manifest or current route map.

Footer navigation and contextual page links connect the designs here. Yarrow cards in Stories and Funding open the included story detail. Its All stories link returns to the included Stories page. The Stories page's full-archive links, source citations, training registrations, intake, outside programs and existing MySBDC app links retain their real/prototype destinations. No backend or translation integration added.

## Design details retained

Navy inner-page title bands; Proxima typography; shared footer; original content and photo treatments. The Yarrow story's redundant Read their story link is removed; All stories sits below Stories. Related story titles retain their blue-to-red underline, while descriptive subtext has no underline on hover. The same description-hover fix is in the original Yarrow concept.

## Navigation — November 25

All seven pages share one header, built from the approved direction in the navigation study ("A7"). Files: `assets/site-nav.css` and `assets/site-nav.js`, loaded last on every page. The earlier per-page `.concept-nav` rules remain in the concept stylesheets but no page uses them.

- One line: wordmark, Advising, Training, Funding, Stories, About, then a compact `EN` language control and MySBDC. The current page carries a light-blue underline.
- Advising opens a full-width panel on hover or keyboard focus. Its topic links open the matching disclosure on the Advising page; program links keep their existing destinations.
- After scrolling, the bar tightens and a Get advising button replaces language and MySBDC, so the button never duplicates the hero's own action.
- At 1100px and below the bar is the wordmark and the word Menu. Menu opens a full-screen index of the five pages with the advising action, MySBDC, Find your local SBDC and language.
- The in-page links that used to sit in the header (Expertise, How it works and so on) moved into the navy title band on Advising, Training, Funding and About. Home, Stories and the Yarrow story no longer carry them.

Checked at 1440, 1180 and 390: no horizontal overflow or script errors on any page; panel reachable by pointer and keyboard and dismissed with Escape; language menu opens and closes; small-screen menu moves focus in, makes the page inert and restores focus on close. Language remains English-only with the coming-soon notice.

## Status and limitations

Local design handoff, not a WordPress deployment. No saved WordPress content was changed. Current versions were selected from this design conversation; homepage story composition remains a previously deferred refinement. Homepage figures were carried over, not newly audited during packaging. Training event listings are a dated static sample, not a live feed. Existing advisor concept images are placeholders and keep their disclosures. Language menus are English-only with a coming-soon notice. MySBDC remains the existing concept destination, not a newly connected authentication flow. Yarrow's833px source photo may soften at large sizes.

All source-specific claims, photo provenance and historical checks are retained in notes/. Current packaging checks are recorded in the workspace HANDOFF.md.

## Collection verification — November24

All7 pages returned HTTP200, unique IDs/oneH1 and valid local anchors.112 local references stay within this folder. All33 bundled assets byte-match their selected sources; JS syntax and whitespace checks passed. Desktop openings of Home/Advising/Training/About/Stories/Funding visually checked; all7 mobile390 layouts checked for overflow and font loading. Stories-to-Yarrow click, About five-slide carousel selection and local advisor image loading verified. Actual hovered related card has no parent/description underline; title remains underlined red. Screenshot: review/story-card-hover.jpg. No push, PR or deployment.
