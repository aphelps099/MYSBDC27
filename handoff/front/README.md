# NorCal SBDC — public website design handoff

Selected current designs, collected November 24, 2026. Start at [Homepage](index.html). This is the public website collection; the signed-in MySBDC client app stays in the parent directory.

| Page | Local route | Selected source |
| --- | --- | --- |
| Homepage | [./](index.html) | Homepage V3 (`datalands-concept-v3`) |
| Advising | [advising/](advising/index.html) | Advising V3, including advisor section and flow polish |
| Training | [training/](training/index.html) | Rebuilt November 26: two paths, the calendar and on demand |
| About | [about/](about/index.html) | About V5, five-image carousel, edge bleed |
| Stories | [stories/](stories/index.html) | Current Stories concept |
| Funding | [funding/](funding/index.html) | Current Funding concept with currency photography |
| Yarrow Goods | [stories/yarrow-goods/](stories/yarrow-goods/index.html) | Latest detail, All stories underneath Stories |
| Impact | [impact/](impact/index.html) | Approved Legacy-inspired page: fixed seal, 4-over-6 duotone grid, parallax collage |
| Partners | [partners/](partners/index.html) | Option A with rules, built November 25, 2026 |
| News | [news/](news/index.html) | Option A press list, built November 26, 2026 |

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
- Advising, Training and About each open a full-width panel on hover or keyboard focus: one statement on the left, two short lists on the right. Advising topic links open the matching disclosure on the Advising page; Training and About links point to existing page sections and destinations. The Training panel deliberately lists no individual sessions. Funding and Stories are plain links.
- After scrolling, the bar tightens and a Get advising button replaces language and MySBDC, so the button never duplicates the hero's own action.
- At 1100px and below the bar is the wordmark and the word Menu. Menu opens a full-screen index of the five pages with the advising action, MySBDC, Find your local SBDC and language.
- The in-page links that used to sit in the header (Expertise, How it works and so on) moved into the navy title band on Advising, Training, Funding and About. Home, Stories and the Yarrow story no longer carry them. November 25, later: those title-band links are removed from every page (Advising, Training, Funding, About, Impact) as unneeded; the section IDs remain, so menu links into those sections still work.

Checked at 1440, 1180 and 390: no horizontal overflow or script errors on any page; panel reachable by pointer and keyboard and dismissed with Escape; language menu opens and closes; small-screen menu moves focus in, makes the page inert and restores focus on close. Language remains English-only with the coming-soon notice.

## Footer — November 25

All seven pages share one footer, built from the footer study (direction "F4" on wide screens, the call-line layout on phones). File: `assets/site-footer.css`, loaded last on every page; the language menu behaviour lives in `assets/site-nav.js`. The earlier `.network-footer` rules remain in the shared stylesheets but no page uses them.

- Wide screens: "Talk it through with a business advisor.", the phone number at a large but not full-width size and one advising button on the left; Explore and Get in touch lists on the right, starting on the same column as page headlines.
- Phones: the same content with the phone number running edge to edge, then the button and the two lists side by side.
- The official America's SBDC California, Northern CA Network logo (`assets/norcal-sbdc-logo-white.png`, copied from the WordPress theme) sits bottom-left. Social links are words, not icons. The `EN` language control now also lives here and opens upward.
- The partner strip keeps all five logos and the full funding statement unchanged, with the logos beside the statement on wide screens.
- November 25, later: a ghosted America's SBDC star (white at 10%) sits in the lower right of the navy footer on every page, cropped by the corner, after the hero on californiasbdc.org/leadership. When the footer scrolls into view its outline draws itself over about three seconds and then fills (`assets/site-star.css`, `assets/site-star.js`). Reduced motion or no script shows it filled straight away. Checked on all eight pages at 1440 and 390: no overflow or script errors, the star draws, and the footer language menu still opens fully inside the footer.

Checked at 1440, 1180, 820 and 390: no horizontal overflow or script errors on any page; the footer language menu opens within the viewport and closes with Escape. Footer height is about 605px at 1440 (was 832) and about 995px at 390 (was about 1,170).

## Homepage stories — November 26

The homepage stories section is now a compact layout (`assets/home-stories.css`): one featured business with a slate card beside its photo, and two smaller stories beneath. It replaces the tall staggered showcase so that stories read as proof on the way to advising, not as a destination. Same three businesses, copy and story destinations. One outlined "See more stories" button under the heading replaces the "Explore more businesses" and "Watch our story" links, so the brand film is no longer linked from the homepage (its dialog markup and script remain, unused). The category chips and the separate closing line are gone. The red rules stay under all three photos on wide screens; on narrow screens the featured photo drops its rule because the card overlaps it. The section is about 1,190px tall at 1440 (was about 2,950) and about 1,350px at 390 (was about 2,510). The earlier `.v3-*` showcase rules remain in the concept stylesheet but the page no longer uses them, apart from the section's own `v3-showcase` class.

## Homepage figures — November 26

The homepage figures band puts its four figures in one row on screens wider than 700px (`assets/home-figures.css`), at about 88px instead of 158px. The band is about 573px tall at 1440 (was 963). Each caption carries the matching MySBDC dashboard symbol at 24px (coins, storefront, two people, rising columns), since the four figures are the same four milestones the dashboard collects. Wording, figures, colour and the impact link are unchanged, and phones keep the live two-by-two layout.

## Homepage advisor section — November 26

"Work with an advisor" on the homepage is now a split layout (`assets/home-advisor.css`): heading, sentence, button and a small round advisor portrait on the left, and a tall photograph filling the right half edge to edge. The four-topic accordion and the "Find your local SBDC" link left this section; the topics remain in the Advising menu and on the Advising page, and the link remains in the footer and the About menu. Both images (`assets/home-advisor-scene.jpg`, `assets/home-advisor-portrait.jpg`) are AI-generated concept images supplied by the user, and the section carries the same notice as the Advising page until real photographs replace them. The two images were generated separately, so the portrait and the advisor in the scene are not the same face.

## Homepage hero, network logo — November 26

The hero now fills 90% of the window height (90svh, at least 600px; it was the full height with an 800px minimum), so the next section shows beneath it. The America’s SBDC California, Northern CA Network logo sits large above the headline (about 245px wide at 1440, 150px on phones). `assets/norcal-sbdc-logo-white-400.png` is a white version made from the 400px colour logo on norcalsbdc.org, with the CALIFORNIA lettering knocked out of its bar like the official white mark; replace it with a vector original from the brand files when available.

## News page — November 26

New page, `news/index.html` with `assets/news.css` and `assets/news.js`. Rebuilt the same day as the "journal" direction from the News-as-a-blog canvas: one centred reading column (820px) on cream, the intro and three filter pills (All, Press releases, Announcements), then every post with a cover above it, its type, date and read time, a Proxima Sera headline, the summary and "Keep reading". Covers are solid 6px tiles in navy, pool, sand, sage or slate with a short topic in Proxima Sera; navy and slate ones carry the ghosted America's SBDC star. The one post with a real photo (Tim Murrill, State Star) uses it, and the three job posts run without a cover. Read times are each post's word count / 220, rounded. It closes on pool with Get the newsletter and media inquiries. The 11 posts, dates, types, summaries and links are from norcalsbdc.org/about/news; the uncategorised "A Typographic Legend: Jan Middendorp" post is left out. "News" is in the About menu's network list on every page. Checked at 1440, 820 and 390 with no overflow or script errors.

## Homepage hero and newsletter signup — November 25

The hero keeps the video and drops the oversized wordmark, since the header already carries the name (`assets/home-hero.css`). The headline is now the large line along the foot of the video, with the sentence and button to its right; at 1000px and below the three stack in one column and the headline is sized to hold two lines.

The newsletter signup is a text link, "Get the newsletter", in the footer of every page (`assets/site-newsletter.css`, `assets/site-newsletter.js`). It opens a pool-blue dialog with a large headline, asking for first name, last name, email address and ZIP code. A sand band on the homepage was tried first and removed as too large. The form is not connected to a mailing service: submitting shows "Preview only. Nothing was sent or saved." and sends nothing. It needs a real destination before launch. In the same footer list, MySBDC is now a slim outlined button.

## Homepage "What's your next move?" — November 25

The three-column layout is unchanged. Each column now opens with the matching MySBDC dashboard symbol (door, coins, rising columns) with a pool fill, and the three links take the red underline used on "Read story" (`assets/home-next.css`).

## Impact page — November 25

New page, `impact/index.html`, with `assets/impact.css` and `assets/impact.js`. Chosen from four directions and three review rounds on the Impact design canvas. The homepage "Explore our impact" link and the About menu's "Our results" link on every page now open it.

- Navy title band, then the FY 2025 results as one sentence on pool: $549M capital accessed, 712 businesses started, 3,723 jobs created, $201M sales growth, each figure in a white pill. The text uses a mask-up reveal after techfuturesgroup.org: every word sits in a clipped box and rises into it with a plain ease-out, one line after another, and the figure pills rise through their own masks last; no bounce or scale (GSAP 3.12.5 and ScrollTrigger from cdnjs). The three-year sentence and the closing headline reveal the same way when they scroll into view. Reduced motion shows everything at once; if GSAP fails to load the text appears on page load, and never stays hidden past four seconds.
- "The people behind it": a photo-stage carousel of five client stories (Yarrow Goods, Jump Aero, The Early Rise, Circosphere, Hella Nuts). Wide photos with 6px corners, each story on a white card set into the photo, the next story peeking in. Pill progress dots (the current story is a wide navy pill), solid navy round arrows, swipe and arrow keys; See more stories sits beside the heading. Results are shown only where the existing site publishes one ($138K, $12M).
- "Over three years" on navy: $1.56B, $474M, 111K and 99% from the live About page (FFY 2022–2024), with its note that no multipliers are used and results are verified annually by third-party research. Figures in pool pills. After the California SBDC homepage's second section: a 2px pool line that fades to the right draws across under the sentence as the section comes into view, and the section's background is California SBDC's own America's SBDC accredited-member seal artwork (`assets/impact-seal-bg.jpg`, copied from californiasbdc.org's homepage), used as there: cover, 97% opacity, 25% grayscale, shifting with a gentle parallax as the page scrolls (GSAP ScrollTrigger).
- "Thank you to our partners": the About page's funding and host statement, links to partners and funding disclosures, and the five partner logos in full colour on white.
- Closing bookend on pool, echoing the opening: "Your business, next." left-aligned with "next." in a white pill, and beside it one sentence, the Get no-fee advising button and the (833) ASK-SBDC number.

Checked at 1440, 820 and 390: no horizontal overflow or script errors, motion finishes with nothing left hidden, reduced-motion and blocked-GSAP fallbacks show all text, carousel buttons, dots and keys move one story at a time; the seal background stays still with reduced motion or without GSAP. The FY 2025 figures come from the demo impact page and homepage, and need final reporting confirmation before launch.

## Partners page — November 25

New page, `partners/index.html` with `assets/partners.css`, chosen on the Partners design canvas. Layout follows californiasbdc.org/sbdc-partners as grouped rows (a heading and short text beside the partners), without boxes, on one cream ground with a 2px navy rule across the content width between sections. The pool "Partner with us." close is the one colour moment. The About menu's "Our partners" on every page, and "Meet our partners" on About and Impact, now open it.

- Content is from norcalsbdc.org/partners: SBA and GO-Biz (federal & state funding); Cal Poly Humboldt (financial hosting, copy beside the campus photo); BBB of Northeast California (local partner); and the 16 host partner logos in an open grid. Partner links are the ones that page uses.
- Service partners: NorCal APEX Accelerators, and Pacific Northwest Regional VBOC, which its own site now describes as "formerly NorCal VBOC" (name, logo and description from norcalvboc.org).
- Corporate partners: Amazon Web Services (the AWS Small Business Acceleration Initiative line from the AWS Initiative page), OpenAI and Verizon. OpenAI and Verizon show a marked "[Partnership description to come.]" placeholder until real copy is supplied. Their wordmarks are from Wikimedia Commons, saved in `assets/partners/`; replace them with brand-kit files if partner agreements require.
- Logos supplied on white backgrounds blend into the cream; the white BBB mark sits on a small navy tile.
- To confirm: the 16 hosts (norcalsbdc.org announces 2027 host partners have been selected) and two names read from logos, "San Francisco Office of Economic and Workforce Development" and "Siskiyou Economic Development Council" (used as image alt text).

Checked at 1440, 820 and 390: no horizontal overflow or script errors, every image loads, one h1, local links resolve, the footer star draws.

## Status and limitations

Local design handoff, not a WordPress deployment. No saved WordPress content was changed. Current versions were selected from this design conversation; homepage story composition remains a previously deferred refinement. Homepage figures were carried over, not newly audited during packaging. Training event listings are a dated static sample, not a live feed. Existing advisor concept images are placeholders and keep their disclosures. Language menus are English-only with a coming-soon notice. MySBDC remains the existing concept destination, not a newly connected authentication flow. Yarrow's833px source photo may soften at large sizes.

All source-specific claims, photo provenance and historical checks are retained in notes/. Current packaging checks are recorded in the workspace HANDOFF.md.

## Collection verification — November24

All7 pages returned HTTP200, unique IDs/oneH1 and valid local anchors.112 local references stay within this folder. All33 bundled assets byte-match their selected sources; JS syntax and whitespace checks passed. Desktop openings of Home/Advising/Training/About/Stories/Funding visually checked; all7 mobile390 layouts checked for overflow and font loading. Stories-to-Yarrow click, About five-slide carousel selection and local advisor image loading verified. Actual hovered related card has no parent/description underline; title remains underlined red. Screenshot: review/story-card-hover.jpg. No push, PR or deployment.

## Berry-glow gradient, menu and star timing (November 2026)

- A gradient after the californiasbdc.org menu, made in our colours: a berry glow from the top left (`#bb3c46` at low
  strength) over navy that deepens to the bottom right. It is used in one place only, to keep it special (it was tried on the open menu and taken off):
  - the About page "Local knowledge. Shared expertise." band (`assets/about-concept-v5/concept.css`, end of file),
    which is now one three-column grid: the headline spans two columns, the intro sits over the third principle, and
    the small headlines no longer orphan a word;
- The footer star (`assets/site-star.css`, `site-star.js`) now rises and turns into place while its outline draws, in
  about 1.6 seconds instead of 4, and starts as soon as it enters the screen.

## News story page (November 2026)

`news/sbdcs-google-grant-for-ai-training/index.html`, with `assets/news-story.css` and `assets/news-story.js` (loaded
after `news.css`), the "journal" direction from the News story canvas. Built for the one post we have in full, the
Google $10M AI grant release from America's SBDC, word for word. "All news" link, type, date and read time, a
Proxima Sera headline across a 1120px header, the standfirst, the post's cover at the same width, then a 740px reading
column: the source line, the release, one pull-quote taken from it (Lisa Gevelber), the two About sections on a sand
tile, share links (LinkedIn, Email, Copy link), More news and the pool newsletter close. The News page links this post
here; the other ten still link to norcalsbdc.org until their text is brought over. Same slug as the WordPress post.
Checked at 1440, 820 and 390 with no overflow or script errors; Copy link works.

## Training page (November 26)

`training/index.html` with `assets/training.css` and `assets/training.js`, direction B from the Training canvas. Two of
the page's illustrations stay (`assets/training-concept/assets/`): the calendar beside "On the calendar." and the
conversation in the close. The open book and the video drawing are no longer used.

- Opening: the photo hero kept from the earlier page (Freeline Surf Shop, "Learn it. Put it to work."), then two colour
  blocks, navy "Join a live session." (next session named) and pool "Learn on your own schedule."
- On the calendar, kept simple after the earlier page: one line saying registration happens in MySBDC, three format
  pills (All, In person, Online), then one row per session: a pool date tile, format, place and time, the title (links
  to the center's session page), one sentence, and Log in to register. A fuller calendar after `Training Calendar.dc.html`
  (month column, topic chips, tags, More details) was tried and set aside as too busy.
- Keep learning (on demand), on navy, kept simple after the earlier page: the heading, one line and Watch in MySBDC, then
  two featured recordings as typographic cards after `Training Thumbnails.dc.html`: a solid 16:9 tile (pool or sand),
  the navy network logo (`assets/norcal-sbdc-logo-navy-400.png`), a ghosted Proxima Sera initial, the title in Proxima
  Sera, "Recorded webinar · presenter" and a navy play button. Planning Your Business large on the left, How to SEO like
  a Pro beside it with More ways to learn (the learning library) below. Closes with "Make it work for your business.",
  Get no-fee advising and Explore advising, beside the conversation illustration.
- Only real content: the three December sessions (checked November 24, 2026) and two real webinars and presenters. Every
  Log in, Register and Watch link goes to the MySBDC concept link the menu uses, to be swapped for the real sign-in.
  Checked at 1440, 820 and 390: no overflow or script errors; the filter shows 3, 2 (in person) and 1 (online).

## Homepage motion and menu (November 26)

- "Our region" is removed from the About menu on every page.
- `assets/home-motion.css` and `assets/home-motion.js` (GSAP 3.12.5 + ScrollTrigger from cdnjs), homepage only:
  - section headlines (What's your next move, Northern California at work, Small business, Work with an advisor) rise
    into place word by word, line by line, as they scroll into view; their supporting text fades up just after;
  - the four figures roll like an odometer: each digit is its own wheel, starting about 3% below the final figure (never
    from zero) and settling on the real number over about 2.4 seconds. Each wheel is sized to its final digit, so the
    settled figure matches the original text; screen readers get the plain figure;
  - three oversized plus signs at 5% cream sit along the right edge behind the stories, fade in, and drift at different
    speeds while scrolling.
  Reduced motion skips all of it, and a head fallback shows everything if the script does not run within 4 seconds.
  Checked at 1440 and 390: no overflow or script errors; every headline ends visible and every figure ends exact.

## About page, images (November 26)

- The "Local knowledge" band is flat navy again; the berry-glow gradient was dropped to keep the theme tight. Its
  three-column grid stays; its intro paragraph ("A business plan, a financing question…") is removed.
- The closing "Let's work on your business." now pairs with the Churn grand-opening photo
  (`assets/about-churn-grand-opening.jpg`, from norcalsbdc.org), larger, bleeding off the left edge with a 4px red line beneath,
  captioned "A grand opening at Churn". The results band stays pool. Other images from the About images canvas (the
  client mosaics, the celebrating duotone, the accredited seal, the region collage) are not used for now.

## Menu panels animate in (November 26)

`assets/site-nav.js`: each desktop menu panel (Advising, Training, About) gets a very fast GSAP entrance when it opens:
the panel fades in and drops 6px over 0.18s, then its statement and links rise 10px into place 18ms apart, all settled in
about 0.45s. GSAP 3.12.5 core now loads on every page (before `site-nav.js`). Skipped for reduced motion; without GSAP
the panel simply appears as before.

## Specialty programs page (November 27)

New page `advising/programs/index.html` with `assets/programs.css`. The "Specialty programs" heading in the Advising
menu links here on every page (`site-nav-panel-head`).

- Title band with an Advising link above "Specialty programs", then "Specialist support, when you need it."
- The four main programs as a pool and navy mosaic (direction C from the canvas, without sand or sage): SBDC Finance
  Center (to our Funding page), Tech Futures Group (with the ghosted star), ProBiz and Norcal APEX Accelerator, each with
  a one-line purpose, a short description and, where published, a figure ($250M+ working capital since 2018; $700M+
  raised, $68M+ grants, 2,700+ jobs; 870+ clients and $500M+ in contracts last year).
- More programs as index rows: EATS (Restaurants & Hospitality), the AWS Small Business Acceleration Initiative (links
  to `view/aws-initiative.html` at the repository root), Pacific Northwest Regional VBOC and Outsmart Disaster.
- A navy quote band: Mieko and Kamari Scott of Hella Nuts (`assets/programs-hella-nuts.jpg`, from norcalsbdc.org) on a
  pool offset plate, with Mieko's quote from their client story and a link to it.
- Closes with "Not sure which program fits?" and Get no-fee advising.
Copy is from norcalsbdc.org, apexnorcal.org, our Funding page and the AWS Initiative page. Checked at 1440, 820 and 390:
no overflow, no broken local links.

## Impact page — approved Legacy version (November 27)

`impact/` is now the approved Impact page from the `handoff-impact` branch (commit d33e268, rebuild notes in
`impact/CLAUDE-HANDOFF.md`). Everything inside `<main>`, the SVG duotone filters, the fixed seal backdrop, `impact.css`,
the 17 local photographs and the 3 local fonts are byte-identical to that snapshot. Two deliberate changes put it in the
current site shell: the page uses the current `site-nav` header and `site-footer` (the approved snapshot carried the older
concept-nav header and network footer), with `impact/shell.css` stacking the footer above the fixed seal and giving the
menu bar the page's #0b203d; and `impact.js` guards the old header lookup (`header?.classList`). `SHA256SUMS` describes the
approved snapshot, so `index.html` and `impact.js` no longer match it by design; every other listed file does.
The earlier Impact page (pool sentence, carousel, record with seal, partner thank-you) is replaced; its files
(`assets/impact.css`, `assets/impact.js`, `assets/impact-seal-bg.jpg`) are no longer used by any page and remain in git
history. Checked against the approved original at 1440 and 390: the desktop body is pixel-identical; on phone every
element sits at the same offset (0px difference); 15 grid cells, no overflow, all 21 images and Sentinel load; the seal
stays at viewport top while scrolling; the collage translates independently (−77px to +47px); Pause sets all three
crossfades to paused and Play resumes; the menu opens; no script errors.

### Impact, November 27 later: grid and navy

- Opening grid: four large squares over six smaller ones, full bleed with 10px navy gutters (6px under 900px, 5px on
  phone, where it becomes two large per row then three small per row). Ten cells from the approved photos: New Age Meats,
  Churn, Paul Bozzo, Dorenda Haynes; Circosphere, Dick Taylor, After-School Snack Attack, Shawn Walker-Smith, Marin Auto
  Works, Cha-Cha Sweets. The three crossfades stay (Paul Bozzo, Dorenda Haynes, Shawn Walker-Smith cells); the detail
  close-ups and the Freeline tile are dropped. Duotone filters are the original Legacy ones.
- Navy: the page now uses the site's core navy #1d2c3d (was #0b203d / #071c38). The seal backdrop is the original
  image remapped onto #1d2c3d with the same faint lift (`impact/assets/fixed-seal-navy.jpg`; the original remains).
- Both changes live in `impact/shell.css`; `impact.css` is untouched. Checked at 1440, 820 and 390: 10 cells, square,
  no overflow, all images load, no script errors.

## Impact page — told in numbers (November 27)

Direction B from the Impact evolution II canvas, built on the approved Legacy page. The page was reading too dark, so it moves onto the site's cream ground and tells its story through figures. `impact/numbers.css` and `impact/numbers.js` load after `impact.css` and `shell.css`; the approved files are otherwise untouched.

- Kept from the approved page: the four-over-six opening grid with its crossfades and Pause motion control, the blue parallax statement band (now cream Proxima Sera), the three-photo band and `impact.js`.
- Ground and type: the standard navy "Impact" title band, then cream; the fixed seal backdrop is gone and navy is used for two bands only. Proxima Nova headlines, Proxima Sera for the opening line, the statement and every figure. Photos in natural colour, with no duotone, per the brand photography rules ("heavy brand-color filters" are a don't).
- Chapters: 712 businesses started, 3,723 jobs created (navy), the statement band, $549M capital accessed with $201M sales growth (FY 2025), then "Over three years" on navy ($1.56B, $474M, 111K, 99%, FFY 2022–2024, with the no-multipliers note). Each figure rolls like the homepage odometer from about 3% below its value when its section scrolls into view; reduced motion or no GSAP shows the plain figures.
- Story: "One owner's numbers" now features Marin Auto Works (published client story: $503,000 SBA loan after bank rejections, 3 full-time employees hired; advisor Richard Strezo) with the team photo and a 4px red line under it. It replaces the Yarrow Goods cut-out portrait.
- Photo band: Freeline Surf Shop, Steve Heckeroth's electric tractor and Kamet Automation's lab (from brand.norcalsbdc.org photography), replacing a lab shot that repeated the grid and a stock-style wind farm.
- Close: centred pool block, "Your next chapter starts here.", navy pill to no-fee advising.

Checked at 1440, 820 and 390: no horizontal overflow or script errors, every figure settles on its exact published text. The FY 2025 figures still need final reporting confirmation before launch.

## Funding — capital tiles, slimmer page (November 27)

Option B from the Funding colour study canvas, in `assets/funding-concept/capital.css` (loaded after `concept.css`). This is where the brand site's other colours enter the site, each with its brand role: berry `#C23C3C` for the one headline figure, evergreen `#00675C` (growth) for the second, pool for the advising promise. Proxima Nova throughout.

- Hero: the stock dollar-bill photo is replaced by the Marin Auto Works team in their shop (a real SBA-loan client, from its published story); the photo is shorter.
- Results become a tile block: a Marin Auto Works photo tile ("Turned down by the banks. Approved for a $503,000 SBA loan."), a berry $250M+ tile, an evergreen 594+ tile and a pool "No fee. Confidential." tile with the funding-advisor link. Sources sit under the tiles.
- Slimmer: tighter section padding and smaller headlines; the Yarrow Goods story and the separate lenders section are removed. Lenders get one line in the close. Desktop height went from 5,056px to 3,953px.

Impact page: the figures now use Proxima Nova bold instead of Proxima Sera (less Sera across the site); Sera stays only for the opening line and the parallax statement.

Checked at 1440, 820 and 390: no horizontal overflow or script errors, no broken local links.

## Advising — red rules (November 27)

After the California SBDC client-story pages (Red line study canvas). `assets/advising-concept-v3/rules.css`, Advising only:
a 6px berry (#C23C3C) rule sits 20px under the hero headline "Big decisions. Everyday details.", running the width of
the text column, and a short 48px navy dash (berry on pool read poorly) sits under each of the three step headings in the pool "A conversation.
Then a plan." band. Those headlines are set tighter (line-height .98–1.04, a little more negative tracking) so the rule
reads as part of the headline. Checked at 1440, 820 and 390 with no overflow.

## Stories — story hero with the red rule (November 27)

Direction A from the Stories opening canvas, in `assets/stories-concept/lead.css`. The page title and the lead story
(Jump Aero, $12M) share one navy band: "Stories", then extra space, then the client name with a 6px berry rule across
the text column, the line, the figure and the link. The aircraft image bleeds off the right edge and drops into the
cream; the pool offset plate is gone. Less space under "More business stories." The Yarrow Goods photo is no longer
used here: its card is replaced by Marin Auto Works (published story, $503,000 SBA loan). Below 1050px the hero stacks.
Checked at 1440, 820 and 390: no overflow, no broken local links.

## Stories — organised story index (November 27)

Option B from the Stories canvas, after californiasbdc.org/about/clients, in `assets/stories-concept/grid.css`. "More
business stories." becomes an even three-column index of six published client stories (Marin Auto Works, The Early Rise,
Circosphere, Hella Nuts, Kamet Automation, Cha-Cha Sweets): equal 4:3 photos, the name, a short berry dash, the place
and one line, the whole card a link, with "All client stories" beside the heading. Two columns on tablets, one on phones.
The separate Circosphere band is folded into the grid. Checked at 1440, 820 and 390: no overflow, no broken local links.

## Homepage — red rule in "Work with an advisor." (November 27)

The same 6px berry rule as the Advising hero sits 20px under the "Work with an advisor." headline, across the text column
(`assets/home-advisor.css`); the headline is set a touch tighter. Works with the headline reveal motion and reduced motion.

Stories close (November 27): the two "There's more to the story" / "What are you working on?" blocks are replaced by one
slim pool row: "What are you working on?", one line and a navy "Get no-fee advising" pill (`assets/stories-concept/grid.css`).

## About — red rules (November 27)

`assets/about-concept-v5/rules.css`: the 6px berry rule sits tight under "We're your business people." and under the
closing "Let's work on your business.", as on Advising and the homepage. The Churn photo's caption ("A grand opening at
Churn") is removed. Checked at 1440, 820 and 390 with no overflow.

## Red rule, final spec (November 27)

Every red rule under a headline is now 5px of berry #C23C3C, 10px under the headline, with the headline at
line-height 1: Advising hero, homepage "Work with an advisor.", About opening and closing, and the Stories hero.
(Navy dashes on pool and the short dashes in the Stories grid are unchanged.)

## About — one giant figure (November 27)

Option C from the About results canvas, in `assets/about-concept-v5/rules.css`: in "Small businesses. Shared progress."
$1.56B takes the left column at full size; 111K and 99% stack on the right, aligned with the intro text, with a short
navy dash between them. One column on phones. Checked at 1440, 820 and 390: no overflow, no broken local links.

## Content slop — first cut and the audit note (November 27)

The Funding hero loses its lead-in paragraph ("New equipment. A bigger space. Room to grow…"): headline, button and
the assurance line only. A site-wide content sweep is logged in `notes/content-audit.md`, and the rule is now item 17
in the root `CLAUDE.md`.
