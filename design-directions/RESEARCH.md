# MySBDC 2.0 public website: research brief

Prepared November 22, 2026. Phase 1 of the public-site design brief.

## How this research was done, and its limits

- Every site below was opened on November 22, 2026. Pages were read as fetched text and markup, not
  as rendered screens. That is reliable for navigation, copy, structure and stated guidance. It is
  not reliable for colour, type, spacing or motion, so those are only reported where a page states
  them in words.
- Sites that refused the fetch are named as such and are not described: score.org (403), ideo.org
  (403), opensecrets.org, la2050.org, mauifoodbank.org and peacecorps.gov.
- Agency credits are repeated only where a page we opened states them. Everything else is
  "credit not verified".
- The current design was audited by rendering `homepage-preview/` (home, Services, Impact, About)
  at 1440px and reading the theme, blocks and patterns.

## 0. Audit of what exists

### What already works

- **A real voice.** "What's your next move?", "Progress for a business. Possibility for a
  community.", "Good things start here." Short, declarative, human. Keep all of it.
- **Photography as proof.** Named clients, natural colour, readable captions. None of the 18
  reference sites showed visible captions; this is already a point of difference.
- **Restraint.** One action per section, no icon grids, the CSS arrow, line restraint (rule 14).
- **A disciplined palette and two typefaces**, already locked in `theme.json` so editors cannot
  drift.
- **The block model.** Sections are native blocks with fixed internal layout and editable fields.
  That is the right contract for a non-designer editor, and all three directions keep it.
- **The Success Atlas.** Real county outlines from Census data, already in the repo. It is the
  strongest unused asset on the site: nothing on the homepage says "36 counties" visually.
- **The dashboard philosophy** (`handoff/DESIGN.md`): calm, editorial, matte navy, no decorative
  numbering. The public site can share that temperament.

### What feels generic, or is unresolved

- **The homepage is a familiar sequence**: video hero, three cards, testimonial, statement band,
  stats band, two stories, newsletter. Each section is well made. The order is the order of most
  institutional homepages, and nothing in it could only belong to NorCal SBDC.
- **Three equal cards under the hero** is the most common pattern on the web.
- **The video hero** is the heaviest element on the page and sits where rural phone users arrive.
- **Place is absent.** The network's defining fact, local advisors in 36 counties, appears only as
  a number on Impact. "Find your center" is not in the header.
- **Navigation has grown**: Services, Training, Advising, Capital, Programs (Tech, Health,
  Contracting, AI), Impact, About, MySBDC, language. The clearest reference sites run four or five
  flat items.
- **Spanish is a placeholder** ("More languages coming soon").
- **Editors cannot build new pages in the same language.** The approved pages are bespoke blocks
  (`about-*`, `impact-*`), while the three editor patterns (colour cards, figures, columns) come
  from the deck and look like a different site. The gap between "designed pages" and "pages an
  editor can make" is the main structural problem.
- **Repeated link text.** Two "Read story" links on one page fail the USWDS guidance quoted below.
- **CLAUDE.md rules 1 and 15 now disagree in spirit**: numbered section labels on the public site,
  no decorative numbering in the app.

## 1. Reference sites

| # | Site | Worth learning | Would not suit us |
|---|---|---|---|
| 1 | [GOV.UK](https://www.gov.uk/) and its [Design System](https://design-system.service.gov.uk/) | The start-page pattern: say what the service does, "how much it costs to use the service and roughly how long it will take", one button, second action as a plain link. Sentence-case buttons. | No photography or proof. A taxonomy built for hundreds of services. |
| 2 | [U.S. Web Design System](https://designsystem.digital.gov/) | The identifier: a strip at the page bottom that "communicates a site's parent agency". A model for our funding plate. Link guidance: "Don't rely on only color", "Don't use the same link text for different URLs on the same page." | The official-government banner. USWDS says not to use it on a .org. |
| 3 | [ca.gov](https://www.ca.gov/) and [California web standards](https://webstandards.ca.gov/web-policies/design-and-ux/design-principles) | Language links in each language's own name (Español), as text, in the header. "Not every Californian has a high-end device." | The state banner and department directory. The new state design system is still a "version 0" placeholder with no components. |
| 4 | [Code for America](https://codeforamerica.org/) | A separate "Partner with us" action for the institutional audience. | A donate-driven header and a policy-news hero. |
| 5 | [GetCalFresh](https://www.getcalfresh.org/) | One action, audience entry links, a trust line naming who runs it, and plain honesty: "You can't apply on this website." | Benefit-application framing. |
| 6 | [SBA](https://www.sba.gov/) | One-word nav labels. Noun label paired with a verb link ("Loans / Find funding"). | Agency messaging in the hero. |
| 7 | [America's SBDC](https://americassbdc.org/) | Network numbers stated plainly. It already features a NorCal client story. | A slogan hero ("Every Business Has a Formula") that never says what the service is. |
| 8 | [norcalsbdc.org](https://www.norcalsbdc.org/) (current) | Four-item nav, one consistent sign-up action, topic filters on events. | No language switch. Event cards send people to four different host sites to register. Center count reads 18 in one place and 16 in another. "Find Your SBDC" sits under About. |
| 9 | [Michigan SBDC](https://michigansbdc.org/) | "No-Cost, Confidential" inside the button label. Language links that are also the start action ("Comenzar: Español"). Intent links ("I Want to Start a Business"). | No center locator on the homepage. |
| 10 | [Pennsylvania SBDC](https://www.pasbdc.org/) | Locations as a top-level item, center assigned by county. Three entry paths: starting, growing, buying or selling. | A 21-link consulting menu. |
| 11 | [Kiva U.S.](https://www.kiva.org/borrow) | Terms up front. Numbered steps with a time estimate on each. "Continue application" for returning users. A proof block citing a third-party study. | Crowdfunding mechanics. |
| 12 | [LiftFund](https://www.liftfund.com/) | Three numbers under one framing sentence. "Our Impact" in the main nav for funders. Credit, as stated in its footer: designed by Texas Creative. | Speed claims. |
| 13 | [Knight Foundation](https://knightfoundation.org/) | The cleanest impact staging seen: three large numerals, one caption each. Stories carry a city. | Grant-maker framing. |
| 14 | [James Irvine Foundation](https://www.irvine.org/) | A one-sentence goal as the whole hero. | No numbers anywhere; funders here expect them. |
| 15 | [Hewlett Foundation](https://hewlett.org/) | Seven sections on the homepage, total. | Grant search as the main task. |
| 16 | [Cal Poly Humboldt](https://www.humboldt.edu/) (our host) | Short headlines that end in a full stop ("Find Your Future Here."). A persistent three-action bar. | Fifteen homepage sections and image-backed mega menus. |
| 17 | [Nava PBC](https://www.navapbc.com/) | The closest structural model: five flat nav items, call to action last, services as outcome phrases, "since 2015" numbers, partner logos. | A long case-study card wall. |
| 18 | [Ad Hoc](https://adhoc.team/) | Proof numbers inside the hero. | Procurement vocabulary. |
| 19 | [Pentagram: NYC Parks](https://www.pentagram.com/work/nyc-parks-1) | A whole civic system from one mark, a short name and two typefaces, with a written rule for partner lock-ups and a look per program family. Page credits: Paula Scher, partner. | Signage-scale expression. |
| 20 | [COLLINS: San Francisco Symphony](https://www.wearecollins.com/case-studies/san-francisco-symphony) | A neutral base plus a palette "inspired by the unique colors and landscape of the Bay Area". Stories that end in a short quantified result. | Sound-reactive type. |

Awards context. [Awwwards](https://www.awwwards.com/about-evaluation/) weights design 40%, usability
30%, creativity 20%, content 10%. The [Webby](https://www.webbyawards.com/judging-criteria/) criteria
are content, structure and navigation, visual design, functionality, interactivity and overall
experience. The Webby Websites category is "Government & Associations"; its 2025 winner was NASA.gov
and its 2026 winner OpenSecrets. In Charitable Organizations/Non-Profit, the 2025 winner was the
Obama Foundation (entrant Accenture Song, per the Webby listing) and Kiva was a nominee. The one
"Government & Civil Innovation" result found, WhiteHouse.gov 2021 (Wide Eye, per the Webby page), is
described there as WordPress with a customised block editor, which is our platform.

## 2. Pattern library of findings

**Architecture and grid.** Award-level institutional pages are short: Hewlett has seven sections,
Nava about the same. Asymmetry comes from one narrow meta column against a payload, which the
current rules already use. Nobody credible relies on a wall of equal cards.

**Navigation.** Four or five flat items with the call to action last (Nava, Knight, Hewlett, Kiva,
Obama Foundation). Mega menus appear only on large institutions and arrive with duplicated links.
Intent menus ("I want to…") work when there are six or fewer intents (Michigan). Locations belong
at the top level for a multi-center network (Pennsylvania). A returning-user action sits beside the
new-user one (Kiva's "Continue application"), which is our MySBDC sign-in.

**Type and voice.** Declarative, full-stop headlines (Humboldt), a goal sentence (Irvine) or a
question (Santa Fe Institute). Two typefaces are enough for a civic system (NYC Parks).

**Buttons and links.** Sentence case. One default button per view; the second action is a link
(GOV.UK). Links underlined unless context makes them obvious. Link text unique and meaningful
(USWDS). The cost goes in or next to the button (Michigan, GOV.UK).

**Photography.** No reference site showed visible captions. Kiva and Knight attach a place to every
story. Statistics locked inside images produced visible errors on two sites.

**Texture and surface.** Not observable by this method, except in case-study prose: COLLINS built
the Symphony palette from Bay Area landscape over a neutral base.

**Motion.** Only carousels, a rotating word, a video hero and scroll anchors were visible in
markup. Nothing found argues for more than one considered idea.

**Data and proof.** Three or four numerals under one framing sentence (Knight, LiftFund, Nava). A
time frame stated with the numbers ("Since 1994", "FY2025"). Third-party sourcing where it exists
(Kiva). Numbers in live text, never in images.

**Language.** Own-language label in the header (ca.gov, GetCalFresh). USWDS: use a two-language
switch only when "equivalent translated content is available". No peer SBDC or foundation we opened
exposes Spanish in the header. That lane is open.

## 3. Where public-sector sites fail, and how the good ones avoid it

| Failure | Seen at | How award-level sites avoid it |
|---|---|---|
| The hero is a slogan that never says what the service is | America's SBDC, current norcalsbdc.org | Say the service, the cost and the next step in the first screen (GOV.UK start page, Michigan, Kiva) |
| Navigation mirrors the org chart | Pennsylvania's 21-link menu, MacArthur, Ford | Four or five items named for what people want |
| The locator is buried | norcalsbdc.org, Michigan | Locations at the top level |
| Registration scatters across systems | norcalsbdc.org events link to four host sites | One registration path. Ours is MySBDC |
| Numbers disagree with each other | norcalsbdc.org (18 vs 16 centers), Kiva (96% vs 96.3%) | One source of truth for figures, edited in one place |
| Proof is locked in images | MacArthur | Live text, real captions |
| Translation is an afterthought | most sites opened | Own-language link in the header, and a Spanish start action |
| Stale trust signals | Bridgespan (2022 badge, 2025 copyright), Humboldt footer typo | Few badges, dated figures, an editor who owns them |
| Compliance text treated as an eyesore | Texas SBDC | Give it a designed home: the USWDS identifier idea, on paper, never inverted |
| Spectacle that costs the phone user | video heroes, GIF cards (frog) | Motion that is one idea, cheap, and off under reduced motion |

## 4. Design principles

Each one rules something out.

1. **Say the service, the cost and the next step before anything else.** Rules out slogan heroes,
   video heroes, and any first screen without "no fee".
2. **One front door, two audiences, no fork.** Entrepreneurs get the task. Funders get evidence on
   the same page, in the same words. Rules out a "For partners" microsite voice and audience
   splash pages.
3. **Local is the proof.** A place, a named person or a dated figure accompanies every claim. Rules
   out unattributed statements, stock imagery and numbers without a year.
4. **If an editor cannot build it from blocks, it does not exist.** Rules out one-off page
   templates and any layout that needs a designer to change a sentence.
5. **Type, colour field and photograph. Nothing else.** Rules out gradients, glows, icon grids,
   shadows and decorative rules. (The premium campaign hero in rule 13 stays a campaign exception.)
6. **One motion idea per direction, and the page is complete without it.** Rules out scroll-driven
   reveals on content, parallax and autoplay.
7. **Spanish is a first-class path.** "Español" sits in the header in its own language, and every
   layout is tested with text 40% longer. Rules out fixed-width buttons, text baked into images and
   a language menu that says "coming soon".

## 5. Sitemap and page types

Primary navigation: **Services · Trainings · Funding · Stories · Impact · About**, then
**Find your center**, **Español**, **MySBDC sign in** and **Get started**.

```
Home
Services (overview)
  Advising
  Funding (access to capital)            also in primary nav
  Specialty programs: Technology · Food & hospitality · Government contracting · Veterans
Trainings (calendar)
  Training detail
  Recorded webinars
Stories (index)
  Story detail
Impact
  Success Atlas
About
  Find your center → Center page (one per local center)
  Partners
  Careers → Role detail
Resources (guides, by stage)
Get started (client profile)     MySBDC sign in (the app, outside this theme)
Utility: Contact · Accessibility · Privacy · Español
```

| Page type | Job | Built from |
|---|---|---|
| Home | Say the service, route the task, show proof | Hero, service list, figures, stories, next trainings, closing action |
| Services overview | Help someone choose | Page header, service entries, specialty list, closing action |
| Service detail (Advising, Funding) | Explain one service and start it | Page header, facts, steps, story, closing action |
| Trainings calendar | Find and register | Page header, filters, schedule, steps |
| Training detail | Decide and register | Event header, facts, what you'll leave with, register |
| Stories index and detail | Proof with a face and a place | Story list; story header, quote, result figures |
| Impact | Evidence for funders | Figures, Atlas link, stories, method note |
| About, Partners | Who we are, who funds us | Statement, people, partner plate, contact |
| Center page | The local door | Center header, advisors, local trainings, contact |
| Careers and role detail | Recruit | Role list; role facts, apply |
| Resources | Self-serve guides | Filterable list by stage |

## Addendum: the Brand House (brand.norcalsbdc.org), reviewed after the first round

The first three directions were rejected as predictable and too reliant on serif type. The brand
site was then studied, and it changes the brief more than any external reference:

- **Type.** "Pages are built almost entirely from Nova. Sera appears only inside reserved
  emphasis." The recipe: a small tracked label above, a Nova headline with at most one Sera word,
  always flush left. Weights 500 and 600 for text, heavy for numerals.
- **Layout.** Square colour blocks set edge to edge with no gaps and no radius, content pinned to
  the floor of the block, generous empty field above it.
- **Colour in use.** Mostly cream and navy, with blue, pool and berry as signals.
- **Labels.** The brand uses a mono face for labels. Per your direction the website does not:
  labels are plain Proxima Nova in sentence case.
- **Photography.** "People, not programs." Tight crops, natural light, real rooms. The Dick Taylor
  portrait used in the mockups is the brand's own lead image.
- **Two palette values differ from `theme.json`**: the brand's Signal `#1B5FAF` and Berry `#C23C3C`
  against the theme's cobalt `#174F91` and berry `#A82F38`, and the brand lists Evergreen
  `#00675C`, which the theme does not. The mockups keep `theme.json`, as the brief fixes it. This
  needs one decision before build.

The round-2 directions in `README.md` follow from this.

## Assumptions

- The repo's Atlas data lists 16 local centers; the brief says 8 regional areas; the live site says
  both 16 and 18. The mockups name centers but never state a count. The count needs one owner.
- Training rows use the repo's sample workshops, moved to December 2026 and January 2027.
- "Español" is shown as a live link. Per USWDS, it should ship only when the Spanish path is real.
- `about-golden-gate.webp` and `about-redwoods-coast.webp` are in the repo with no source noted.
  They are not used in any direction until their provenance is confirmed.
