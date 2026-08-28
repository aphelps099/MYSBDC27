# MYSBDC website — layout logic

All pages follow the FAV NorCal SBDC design system plus these page-composition rules established on the homepage (`MySBDC Homepage.dc.html`):

1. **Numbered editorial spine** — every major section gets a caps micro-label with a running number ("01 — How we help"). Numbers restart per page and follow scan order.
2. **Band alternation** — sections alternate paper/cream and full-bleed navy; never two same-color bands adjacent. Berry label color on light bands, pool on navy.
3. **Asymmetric two-column grids** — narrow meta column (label + serif question/claim headline + one link or CTA) opposite the content payload (ruled list, metric grid, photo cards).
4. **Photography carries proof** — real client photos from norcalsbdc.org, `saturate(.86–.88) contrast(1.03)`, always grounded: navy caption bar with 5px berry bottom rule (hero) or a 5px berry rule under the image (story cards). Never floating unframed images.
5. **Color-block mosaics only for action moments** — sign-up/partner/newsletter CTAs use edge-to-edge navy + pool + cream blocks; text inside still aligns to the 1400px shell via `padding: … max(48px, calc((100vw - 1400px)/2))`.
6. **One action per section**; short declarative copy pairs; CSS `Arrow` component, no icons.
7. **Shell** — `width:min(1400px,100% - 96px)`; page wrapper `overflow-x:clip`; no fixed min-widths.
8. **Breathing room** — CTAs get ≥44px top margin from text blocks; standalone links go on their own line rather than inline in a paragraph.
9. **No page is a duplicate** — inner pages shift at least two patterns from the homepage (e.g. full-bleed statement hero instead of split hero, quad grid with cross dividers instead of ruled list, centered closing CTA instead of the color-block mosaic). Familiar vocabulary, new sentence.
10. **About-page patterns now in the vocabulary** — pool offset plate behind photos (`padding:0 26px 26px 0` + pool block inset `26px/0/0/26px`, berry rule on the image); "We're…" refrain headlines with italic serif accents; giant stat moments (caps claim above, huge serif number, one sentence below, no rules); client pull-quote band (photo on plate + big serif quote + one-line history); centered statement hero with overlapping client photo strip.
11. **Paired closing blocks** — a section pair can close a page as two side-by-side 4:5 color blocks (cream + navy) sharing the berry rule, with the ghosted America's SBDC star (~8% opacity, bleeding off a corner) as texture on the navy block. Established on the Funding page.
12. **Footer** — compact: one link band, then a single bottom row with the partner-logo plate on paper background (never invert-filtered) + condensed legal text + copyright.
13. **Premium hero style** (special/campaign landing pages, e.g. AWS Initiative) — layered atmospheric gradient over the navy hero: stacked radial glows (cool cobalt from top-right `#2a6a9e59`, deep blue lift from bottom-left `#12395e8c`, faint pool bloom `#8fc5d91f` behind the focal element) on a `linear-gradient(168deg,#16283f,#0f1c2d,#0b1523)` base; fine SVG film grain at `opacity:.5` with `mix-blend-mode:overlay` (baseFrequency .85, 3 octaves); and a 1px pool light-catch hairline along the top edge (`linear-gradient(90deg, transparent → #8fc5d966 38% → transparent)`). All layers `aria-hidden` absolute spans behind a `position:relative` content wrapper.

## Naming and truth (decided — do not drift)

Strategy, decisions, and the brand canon live in **Ground Control** (`ground-control/` in the mysbdc-tools repo); this repo is the design plan of record for web + platform surfaces (ADR 0006). Decided facts every page must respect:

- **ProBiz is specialized advising for contracting readiness** (government / supplier-diversity contracts) — never a label for general advising, which routes to one-on-one advising (ADR 0001).
- The impact workflow is **"Milestone Collection"** internally and **"Share your success"** wherever a client sees it (ADR 0003).
- Capital totals always carry their year: **$513.7M is FY2024; $549M is 2025** (ADR 0008).
- **Never promise an advisor-pairing timeline** in client-facing copy — say how the match is made (county, need, language), not when. The 48-hour first-contact promise is separate and stands (ADR 0009).
- The newsletter's name is undecided (ADR 0007) — don't invent one; the dashboard settings copy updates when it closes.
- Two dashboard layouts are deliberately in play until ADR 0010 closes (leaning card grid).
- "War room" is retired vocabulary (ADR 0011).
