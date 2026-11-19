# MySBDC WordPress theme

The public NorCal SBDC website as a WordPress theme. It covers the front end only: the homepage,
Impact, the Success Atlas, the Get started flow, and pages and posts written in the editor.
The signed-in dashboard (`../handoff/`) is a separate app and is not part of this theme.

The theme folder is `mysbdc/`. It is a classic PHP theme with no build step.

## How it relates to the static preview

`../homepage-preview/` stays the place to refine the design. The theme uses the same CSS and
JavaScript files, unchanged, and prints the same HTML around them.

| To change | Edit | Then |
| --- | --- | --- |
| Styles or scripts for the homepage, Impact, Atlas, sign-up, header or footer | `homepage-preview/*.css`, `*.js` | Run `./sync-assets.sh` |
| Header or footer markup | `mysbdc/header.php`, `mysbdc/footer.php`, and the same markup in each preview HTML file | |
| A homepage section's wording or markup | `mysbdc/template-parts/home/<section>.php`, and `homepage-preview/index.html` | |
| Impact, Atlas or Get started markup | `mysbdc/template-parts/page-*.php`, and the matching preview file | |
| The two featured client stories | `mysbdc/template-parts/stories-grid.php` (shared by the homepage and Impact) | |
| Editor-written pages, posts and the section patterns | `mysbdc/assets/css/theme.css` | |

`./sync-assets.sh --check` reports any theme file that no longer matches the preview.
Never edit `refined.css`, `impact.css`, `atlas.css` or the scripts inside the theme: the next sync
overwrites them.

## Install

1. Zip the `mysbdc` folder, or copy it to `wp-content/themes/`.
2. Activate **MySBDC** under Appearance > Themes.
3. Create three pages and choose a template for each under Page > Template:
   **Impact**, **Success Atlas** and **Get started**. Links across the site find these pages by
   their template, so the page titles and addresses are yours to choose.
4. The homepage design shows at the site's front page, whatever Settings > Reading says.

## Publishing from GitHub

`.github/workflows/deploy-theme.yml` checks the theme on every pull request. When a change reaches
`main`, it copies `wp-theme/mysbdc/` to `wp-content/themes/mysbdc/` on WP Engine and clears the
site's cache. It touches nothing outside that theme folder. Until the two values below exist, the
copy step is skipped and only the checks run.

One-time setup:

1. On your computer, make a key pair with no passphrase:
   `ssh-keygen -t ed25519 -f wpengine_deploy -N ""`
   This writes two files: `wpengine_deploy` (private) and `wpengine_deploy.pub` (public).
2. In the WP Engine User Portal, open your profile (top right) > **SSH Keys** > **New SSH Key**
   and paste the contents of `wpengine_deploy.pub`.
3. In the GitHub repository, open Settings > Secrets and variables > Actions.
   - Under **Secrets**, add `WPE_SSHG_KEY_PRIVATE` with the contents of `wpengine_deploy`.
   - Under **Variables**, add `WPE_ENV` with the WP Engine environment name (the short name shown
     in the portal, not the web address).
4. Delete the two key files from your computer.

To publish without a new change, open the Actions tab > WordPress theme > Run workflow.
The workflow has not yet run against WP Engine; expect to confirm the first deploy by eye.

## What you can edit in WordPress

- **Menus** (Appearance > Menus): the header menu and the first two footer columns. Each footer
  column takes its heading from the menu's name. Until a menu is assigned, a location shows the
  links from the design. Sub-menus are not shown. To link to a homepage section, add a custom link
  such as `/#programs`.
- **Appearance > Customize > MySBDC site**: the announcement bar, the MySBDC dashboard address,
  an optional address for every “Get started” button, contact details and social profiles.
  A social mark appears only when its address is filled in.
- **Pages and posts**: written in the editor. A page's excerpt shows as the line under its title.
  The editor offers the site's colours and two typefaces only.
- **Section patterns** (the editor's Patterns tab > MySBDC sections): Colour cards, Figures on
  navy, and Three columns of points. They carry the look of the MySBDC deck: cream grounds,
  serif headlines, caps labels and solid tiles in sand, sage, pool and slate navy.

## Files

```
mysbdc/
  style.css               Theme name and version only
  functions.php           Loads the files in inc/
  theme.json              Colours, typefaces and widths offered in the editor
  header.php  footer.php  Shared header and footer (a quiet version for Get started)
  front-page.php          Homepage: one file per section in template-parts/home/
  page-templates/         Impact, Success Atlas, Get started
  page.php  single.php  index.php  404.php
  template-parts/         Section and page markup
  patterns/               Section patterns for the editor
  inc/settings.php        Defaults for every Customizer setting
  inc/urls.php            Where links point (Get started, Impact, Atlas, dashboard)
  inc/nav.php             Menus and their default links
  inc/assets.php          Which styles and scripts load on which page
  assets/                 CSS, JS and images
```

## Before launch

These are carried over from the preview as they are, and need a decision or real data:

- **Get started is still a preview.** `signup.js` sends and saves nothing, and the page says so.
  Until it is connected to intake, set “Get started link” in the Customizer to the live form so
  every button goes there.
- **The newsletter form is a preview.** It does not subscribe anyone; it points to the live
  newsletter page.
- **The MySBDC link** points to the dashboard preview until its address is changed in the
  Customizer. The link is labelled “preview” only while that default is in place.
- **Success Atlas** shows sample placement and sample quotes, as its “About this map” note says.
- **Client stories and figures** are written into the templates, and story photos load from
  norcalsbdc.org.
- **Instagram and Facebook** addresses are empty, so those marks are hidden.
- **Browser tab titles** come from WordPress (Settings > General) or an SEO plugin.

## Checked

Built and run against WordPress 7.1 with PHP 8.3. The homepage, Impact, Atlas and Get started
pages were compared with the static preview in a browser at 1440px and 390px: the renders match,
apart from the hidden Instagram and Facebook marks. Assigned menus, Customizer settings, the block
editor and the three patterns were exercised in the same install. Not yet tested: multisite,
other plugins, and browsers other than Chromium.

After adding or renaming a pattern file, raise `Version` in `style.css`; WordPress caches the
pattern list per theme version.

## Editable homepage

The approved homepage is now available as seven native Gutenberg section blocks in
**NorCal SBDC sections**: Video hero, Next move, Client testimonial, Network impact,
Impact results, Success stories, and SBDC Intel. These are custom blocks supplied by
this theme; no separate page-builder plugin is required.

- Open **Pages → Home → Edit**. Click the text to edit it directly.
- Use **List View** to select and reorder whole sections.
- Select a section and use **Block → Links and media** for URLs, alt text, video,
  and poster settings. Images also have a **Change image** control.
- Preview, then **Save/Update**. WordPress stores the block content and revisions.
- The three service cards, two stories, and four results have fixed internal layouts.
  You can change their content without changing spacing, colors, or animation code.
- Header and footer remain shared theme elements, outside the Home page's blocks.
- The newsletter remains a non-submitting demo; editing its text does not connect a
  mailing list. Its disclosure stays visible.

The full layout is also available as the **NorCal SBDC homepage** block pattern.
Its intended destination is the site's front page, whose template loads the homepage
styles and scripts. Blocks depend on the MySBDC theme remaining active.

Deployment does not automatically write page content. Run these explicit WP-CLI
commands once after deploying the block definitions:

```sh
wp mysbdc homepage check
wp mysbdc homepage migrate
```

Migration creates a published Home page, snapshots all approved content into its block
attributes, and selects it under Settings → Reading. It saves the prior reading settings
in `mysbdc_home_migration_backup`. Re-running it preserves existing edits. The page ID
is stored in `mysbdc_editable_home_id`. Future deployments must not reseed page content.

## Editable About page (November 2026)

The **About** page template renders saved Gutenberg content using six new sections:
`mysbdc/about-intro`, `about-advisors`, `about-network`, `about-region`, `about-story`,
and `about-next`. Insert the **NorCal SBDC About page** pattern, then select the
**About** template. The existing homepage block names and defaults are unchanged.

Text, images, alt text, links, and figures are editable with the existing section
editor. Whole sections can be reordered. The shared approved footer and navy inner-page
header remain outside the content. Default navigation links use the local About page
once published; until then they retain the existing public About destination.

- Source styles: `homepage-preview/about.css`; run `wp-theme/sync-assets.sh` after editing.
- Matching static review: `homepage-preview/about.html`.
- Block metadata and fields: `mysbdc/blocks/about-*/`.
- Rendering: `mysbdc/template-parts/about/`; registration: `mysbdc/inc/about-blocks.php`.
- Two landscape images are bundled from the supplied draft; client photography retains
  its supplied public URLs and natural color.

The supplied draft's impact and regional figures are retained for editorial review,
not independently verified. The network section includes an editable reporting note.
Confirm sources and reporting periods before public launch, then edit the note as
appropriate. Laila's testimonial uses the approved homepage quote instead of the
sample draft's different quotation. The final CTA uses the public enrollment URL.

Theme deployment never creates or overwrites a page. After normal PR deployment:

```sh
wp --path=/sites/norcalsbdc --url=https://demo.norcalsbdc.org mysbdc about check
wp --path=/sites/norcalsbdc --url=https://demo.norcalsbdc.org mysbdc about create
```

`create` is explicitly restricted to the demo host, creates a **draft**, and preserves
any existing page at the About slug. It does not change reading settings or Home content.
Review the draft in WordPress before publishing. `check` verifies registration, rendering,
attribute serialization, and output escaping without changing saved pages.

### About study: shorter edition and footer reveal

The current About pattern now contains **three sections**: introduction, advisors,
and a full-width regional photograph with “Rooted here.” and a local-center link.
The network statistics, repeated client quote, and separate closing CTA are omitted.
Their block registrations remain available so previously saved drafts still render;
no existing database content is automatically removed. The region block retains old
attribute keys for compatibility, while its editor shows only the fields now rendered.

The shared Home/About footer wraps its navy content in `.nf-surface`. The funding
panel remains in document order and uses native `position: sticky; bottom: 0` beneath
that surface. This produces the stationary reveal without a negative page z-index,
fixed-height spacer, scroll interception, or hiding legal content. `footer-reveal.js`
enables it only when the panel fits comfortably in the viewport and reduced motion
is off. Without JavaScript, in print, with reduced motion, or on short screens, the
funding panel scrolls normally. Its actual height is observed as images/fonts load.

### Personal storytelling study (latest)

The About pattern now includes **intro → advisors → purpose → region**. The advisor
section uses upright Proxima Sera, a personal introduction and three linked real
North Coast SBDC portraits. `about-purpose` is a new editable block for the national
program history, funding partnership, breadth of advising and Humboldt host tribute.
Existing advisor attribute keys remain registered; the editor exposes its new narrative
and portrait fields instead of the former 2×2 points.

Source checks, November 19, 2026:
- https://americassbdc.org/about-us/history/ — national network enacted in law in 1980;
  earlier pilot began in 1976. Copy does not claim NorCal was founded in 1980.
- https://www.norcalsbdc.org/about/ — SBA/CalOSBA funding and Cal Poly Humboldt Sponsored
  Programs Foundation hosting; regional advising services.
- https://www.northcoastsbdc.org/team/ — Melanie Barnett, Paul Bozzo, Amandeep Singh;
  portraits link to their individual biographies and identify them in image alt text.

`homepage-preview/about-motion.js` measures natural text lines after fonts load and
animates each entering line once (75% to full opacity, 6px rise, 800ms). Original text
remains a single screen-reader passage; duplicate visual lines are aria-hidden. Width
changes remeasure; reduced motion restores static text and cancels animations. No-JS
and print remain readable. Synced to theme with the other preview assets.

### Documentary About study — November 19, 2026

Latest local study uses **intro → possibility → advisors → purpose → region**.
The original opening and shared reveal footer remain. `about-possibility` adds an
editable, staggered photographic composition using CrossFit Firefly and Solectrac
images from the supplied California SBDC Legacy page, plus the existing Jump Aero
client image. Captions identify the businesses without introducing new outcome claims.
The light-blue advisor composition integrates the three verified advisor portraits
with editable typographic phrases. The blue-on-cream history passage is shortened.

`mysbdc_about_study_copy()` supplies explicit copy for newly inserted patterns only;
existing schema defaults were not changed. Local study content was updated explicitly
and backed up in `mysbdc_about_before_documentary_study`. No demo content was changed.
Legacy advisor attributes and purpose link attributes remain registered. Purpose's
program link now lives in the new possibility section; unused purpose link controls
are omitted from the editor. Existing saved paragraphs remain editable.

Visual references: https://www.californiasbdc.org/legacy/ and
https://www.californiasbdc.org/about-sbdc/ . Their statewide statistics were not reused.
The generated illustrated-neighborhood concept was rejected and is not a site asset.

User follow-up: the documentary composition is preferred, but the About-specific
serifs were rejected. Current study uses Proxima Nova for its photographic captions,
advisor phrases, and purpose headline. Advisor photos use CSS grayscale with a muted
blue overlay; original photographs remain intact. The approved shared footer's Sera
heading is unchanged.

### Bolder rhythm and campus feature

The next local iteration changes the possibility heading to a three-part typographic
sequence and varies image scale more strongly. Advisor portraits now use grayscale
with blue/coral duotone treatments. Decorative terminal periods are removed from
About headings/captions; body sentences retain normal punctuation. About copy uses no
em dashes. Shared footer copy is unchanged.

The purpose section now pairs its history and funding story with an editable campus
photograph, replacing the in-section Humboldt logo. Photo and source attribution:
https://www.humboldt.edu/international-students/admitted-students/im-admitted-now-what
(original aerial photo: `/sites/default/files/international-programs/2024-11/hsuaerial.jpg`).
Four new purpose attributes expose the image, alt text, caption, and source URL.
Footer partner logos remain intact. Previous local content is backed up in
`mysbdc_about_before_bold_study`; deployment still never modifies saved content.

### Earlier three-section About study — superseded

The current pattern is **intro → possibility → advisors**, followed by the shared
footer. This supersedes the longer study sequences above. The user requested the
simplicity of startuphumboldt.org/about while retaining the bold typography and
photography of the first three sections. The regional paragraph now lives in the
advisor section. Standalone campus/history and “Rooted here” sections are omitted.
Host/funder recognition remains in the shared footer. Existing block registrations,
templates, and defaults remain available for previously saved content; theme updates
do not remove sections from existing pages. Only the isolated local study was edited.


### Approved About page — publication, November 19, 2026

The approved pattern is **opening → people → connections**: cream introduction
and four client photos; navy advising section with tinted advisor portraits; cream
network context and a three-story testimonial carousel. This supersedes all study
sequences above. `homepage-preview/about-brand-study.html` is the aligned static
preview. `about-brand-study.css` and `about-brand-carousel.js` are now synchronized
assets. Edit these source files, then run `wp-theme/sync-assets.sh`.

The three new blocks expose 68 text, image, attribution and link fields through the
existing Gutenberg editor. The eight earlier About block contracts remain available
for saved drafts; no existing defaults were changed. The carousel has three editable
stories, manual dot navigation, keyboard arrows/Home/End, touch swipe, stable height,
reduced-motion styling and a readable no-JavaScript fallback. It never auto-advances.

Quotes link to their original stories: Laila O’Boyle / The Early Rise on NorCal SBDC,
Mieko Scott / Hella Nuts on Butte College SBDC, and Jonathan LaRiviere / Scoot Science
on NorCal SBDC. No draft financial figures or invented testimonials are published.

Deployment changes theme files only. To create a missing About draft on the demo,
use `wp --path=/sites/norcalsbdc --url=https://demo.norcalsbdc.org mysbdc about create`,
or insert the NorCal SBDC About page pattern into a new page and choose the About
template. Existing pages are preserved by the creation command. Publishing is a
separate, intentional action. `mysbdc about check` validates the initial pattern.

## Impact page

The approved Impact composition uses four native dynamic blocks: `mysbdc/impact-intro`,
`mysbdc/impact-feature`, `mysbdc/impact-stories`, and `mysbdc/impact-results`. Insert the
NorCal SBDC Impact page pattern into a page using the Impact template. Copy, photos,
links, categories, and result values are editable; section layouts remain structured.
The six-story collection initially shows four, with accessible disclosure for two more.
The source assets are `homepage-preview/impact-study.css` and `impact-study.js`; run
`wp-theme/sync-assets.sh` after edits. The aligned static study is `impact-study.html`.
The template renders saved content, with the old layout retained only for empty legacy
pages. Deployment never creates pages or replaces editorial content.
