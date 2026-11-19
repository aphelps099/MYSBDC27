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
