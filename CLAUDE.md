# MYSBDC website — layout logic

The signed-in MySBDC dashboard in `handoff/` follows the user-approved
[dashboard design philosophy](handoff/DESIGN.md), established November 10, 2026. That guidance
takes precedence for app work, including its restrained symbols and removal of decorative numbering.

## Public site: current direction (`handoff/front`, November 2026)

The public-site design studies live in `handoff/front` (seven static pages; decisions are logged in [handoff/front/README.md](handoff/front/README.md)). The rules in this section were set by the user during the November 2026 studies. Where they conflict with the numbered rules further down, this section wins.

**How to work**

- Use the Claude Code design canvas for every design study so the user can follow along. Start a new canvas for new pages.
- Show direction before building. Render three to five options on the real page in the real fonts (Playwright screenshots, because the canvas cannot load the Adobe Fonts kit), place them on the canvas beside the current version with phone views, give a recommendation, and wait for the user's pick.
- One section or one page at a time. Build the pick in real code, check it at desktop, tablet and phone widths, and show screenshots.
- Small adjustments are made directly.
- Work on a branch. Merge to main only when the user says "merge" or "publish". No pull requests unless asked.
- Shared pieces already on every page: header (`assets/site-nav.css`, `site-nav.js`), footer (`assets/site-footer.css`), newsletter signup window (`assets/site-newsletter.css`, `site-newsletter.js`). Change them once, for all pages.

**Design rules**

- Influences: Collins simplicity, Pentagram originality, Paula Scher typography. Confident type in Proxima Nova and Proxima Sera, real business photography, generous spacing.
- Never hairline dividers. Hierarchy comes from spacing, type, alignment and colour fields.
- Avoid eyebrow labels. No decorative section numbering.
- No periods on menu items. Menus do not list individual trainings.
- No card grids and no small button cards; prefer open text columns.
- No oversized decorative SVG accents.
- Borrow from the MySBDC dashboard: its rounded line symbols with a soft fill ([DESIGN.md](handoff/DESIGN.md)), 6px radius, pool accents. Symbols are used small, beside or above text.
- Each section takes space in proportion to its job on the page. Keep sections compact.
- Palette: navy `#1d2c3d`, cream `#f6f1e6`, pool `#8fc5d9`, sand `#e8d5a5`, sage `#cddcd0`, slate `#243b50`, red `#bb3c46` used sparingly. Pool is the colour for special moments such as the signup window. Wine, indigo and hot red were tried and rejected.
- Approved red details: 4px red underline beneath story photos and 2px red underline on story and next-move links.
- Form fields are large with a white fill and a soft edge, never a heavy outline; the firm outline appears on hover and focus. Buttons are pills.
- Client photographs keep natural colour and skin tones; no duotone or halftone treatments.
- Use only real facts and figures from the existing site. Never invent them.
- The newsletter signup is a footer text link that opens a pool dialog, not a band on the page.

## Public site: page-composition rules

Public marketing pages follow the FAV NorCal SBDC design system plus these page-composition rules established on the homepage (`MySBDC Homepage.dc.html`):

1. **No numbered spine** — sections are not numbered, and caps micro-labels above headlines are avoided. (This replaces the earlier numbered editorial spine.)
2. **Band alternation** — sections alternate paper/cream and full-bleed navy; never two same-color bands adjacent. Use neutral navy/slate labels on light bands, pool or white on navy. Keep hero headlines single-color; reserve red/berry for sparse thin accent rules, never split red/blue headlines.
3. **Asymmetric two-column grids** — narrow meta column (question or claim headline + one link or CTA) opposite the content payload (open list, metric grid, photo stories).
4. **Photography carries proof** — real client photos from norcalsbdc.org, natural color and skin tones. Ground photographs through composition, readable captions, and aligned story text. Hero and story photos do not need framing or accent borders.
5. **Color-block mosaics only for action moments** — sign-up/partner/newsletter CTAs use edge-to-edge navy + pool + cream blocks; text inside still aligns to the 1400px shell via `padding: … max(48px, calc((100vw - 1400px)/2))`.
6. **One action per section**; short declarative copy pairs; CSS `Arrow` component. The only pictograms are the MySBDC dashboard symbols, used small.
7. **Shell** — `width:min(1400px,100% - 96px)`; page wrapper `overflow-x:clip`; no fixed min-widths.
8. **Breathing room** — CTAs get ≥44px top margin from text blocks; standalone links go on their own line rather than inline in a paragraph.
9. **No page is a duplicate** — inner pages shift at least two patterns from the homepage (e.g. full-bleed statement hero instead of split hero, open metric grid instead of an editorial list, centered closing CTA instead of the color-block mosaic). Familiar vocabulary, new sentence.
10. **About-page patterns now in the vocabulary** — pool offset plate behind photos (`padding:0 26px 26px 0` + pool block inset `26px/0/0/26px`, berry rule on the image); "We're…" refrain headlines with italic serif accents; giant stat moments (caps claim above, huge serif number, one sentence below, no rules); client pull-quote band (photo on plate + big serif quote + one-line history); centered statement hero with overlapping client photo strip.
11. **Paired closing blocks** — a section pair can close a page as two side-by-side 4:5 color blocks (cream + navy) sharing the berry rule, with the ghosted America's SBDC star (~8% opacity, bleeding off a corner) as texture on the navy block. Established on the Funding page.
12. **Footer** — as built in `handoff/front/assets/site-footer.css`: advisor line, phone number and one button on the left; "Explore" and "Get in touch" lists on the right, with "Get the newsletter" as a text link and MySBDC as a slim outlined button; then the official logo, text social links and language menu; then the partner logos on paper background (never invert-filtered) with condensed legal text and copyright.
13. **Premium hero style** (special/campaign landing pages, e.g. AWS Initiative) — layered atmospheric gradient over the navy hero: stacked radial glows (cool cobalt from top-right `#2a6a9e59`, deep blue lift from bottom-left `#12395e8c`, faint pool bloom `#8fc5d91f` behind the focal element) on a `linear-gradient(168deg,#16283f,#0f1c2d,#0b1523)` base; fine SVG film grain at `opacity:.5` with `mix-blend-mode:overlay` (baseFrequency .85, 3 octaves); and a 1px pool light-catch hairline along the top edge (`linear-gradient(90deg, transparent → #8fc5d966 38% → transparent)`). All layers `aria-hidden` absolute spans behind a `position:relative` content wrapper.

14. **Line restraint** — the refined homepage and impact page use spacing, typography, alignment, and broad color fields for hierarchy. Keep repeated decorative section rules, metric dividers, and accordion separators removed. Preserve the approved homepage exceptions: 4px berry underlines beneath story photos and matching 2px berry underlines on “Read story” and next-move links with navy text. The earlier 2px navy rules above the three service columns are removed. Impact-page photos remain unframed. Other red rules are optional and rare. Preserve meaningful control boundaries, keyboard focus, link cues, and accessible form states.

15. **MySBDC app standard** (`handoff/`, the signed-in client app) — follow [DESIGN.md](handoff/DESIGN.md). Use calm editorial typography, open layouts, matte navy and slate surfaces, warm cream text, restrained pool accents, solid 6px-radius tiles, and small softened symbols. No decorative section numbering. Existing form washes and cropped icons are legacy patterns to revisit when those forms are in scope, not a template for new dashboard pages.

16. **WordPress theme** (`wp-theme/mysbdc/`, public site only) — follow [wp-theme/README.md](wp-theme/README.md). `homepage-preview/` remains the design source: edit its CSS and JS there, then run `wp-theme/sync-assets.sh`; never edit the synced copies in the theme. Markup changes to the header, footer or a section go in both the preview HTML and the matching theme template. Editor-built inner pages and the section patterns (cream grounds, Proxima Sera headlines, caps labels, solid 8px-radius tiles in sand, sage, pool and slate navy, after the MySBDC deck) are styled in `wp-theme/mysbdc/assets/css/theme.css`.
