# MySBDC client app — design handoff

Static, responsive HTML for the signed-in MySBDC experience, written to be lifted into the
`mysbdc` WordPress theme. Open `index.html` for the list of screens.

**Approved design standard:** the refined Home page sets the visual direction for future dashboard
pages. Read [DESIGN.md](DESIGN.md) for the user-approved philosophy: calm editorial typography,
matte navy surfaces, warm paper, softened symbols, and no decorative numbering. `handoff/` is the
source of truth for this work.

```sh
python3 -m http.server 8000      # from the repository root
# http://localhost:8000/handoff/
```

## What is here

| File | Screen | Staging route |
| --- | --- | --- |
| `login.html` | Sign in: Google, Microsoft, emailed link | `/login/` |
| `signup.html` | Create your account | `/register/` (before step 1) |
| `register.html` | Sign-up steps, SBA Form 641 (5 steps + confirmation) | `/register/` |
| `dashboard-new.html` | Default home: new client, no advisor yet | `/` (pre-client) |
| `dashboard.html` | Home: active client | `/` (active client) |
| `documents.html` | Document sharing preview, reached from Home's next step | Proposed `/documents/` |
| `settings.html` | Settings | `/account/`, `/account/settings/`, `/business/` |
| `events.html` | Training: next registered session, live workshops by month, recorded training. Register confirms in place | `/events/` |
| `event.html` | Training: one event | `/events/{event}/` |
| `milestones.html` | Milestones: choose an update to share | `/milestones/` |
| `milestone-hired.html` | Milestone form: hired someone (3 steps) | `/milestones/new/hired-employees/` |
| `milestone-sales.html` | Milestone form: sales grew (3 steps) | `/milestones/new/increased-revenue/` |
| `milestone-funding.html` | Milestone form: got funding (3 steps) | `/milestones/new/received-funding/` |
| `milestone-started.html` | Milestone form: started a business (3 steps, with a "not yet" exit) | `/milestones/new/started-business/` and `/not-started/` |
| `milestone-done.html` | Thank-you, with a prompt to add another | `/milestones/new/*/success/` |
| `resources.html` | Resources: a small collection of five templates and guides | `/resources/` |
| `resource.html` | Resource detail: loan package checklist | `/resources/{resource}/` |
| `resource-plan.html`, `resource-cash-flow.html`, `resource-pricing.html`, `resource-hiring.html` | Matching detail pages for the other four sample resources | `/resources/{resource}/` |

- `assets/mysbdc.css` is the whole design: tokens, shell, components. No framework.
- `assets/mysbdc.js` contains plain JavaScript for the menu, forms, filters, and intake drafts. No jQuery.
- `src/` holds the page bodies and `build.py` wraps them in the shared shell. Edit `src/`, then
  run `python3 handoff/build.py`. The built files are committed, so nothing needs building to view.

## Public website and document sharing

The shared app header includes **SBDC website**, linking to `https://www.norcalsbdc.org/` in a
new tab, beside the language control, with a thin outline and 6px corners. There is no header Help widget. Below 900px the website
link moves into the account menu. Keep the dashboard logo linked to Home.

Home's **Upload a document** action opens `documents.html`. A matte navy context panel and
white document sheet follow the milestone-form vocabulary: serif headings, 6px corners,
quiet color fields, generous spacing, and no hairline dividers. On phones the context panel
becomes a compact banner.

The supplied document component runs inside `documents-embed.html`, isolating its browser-only
portal adapter from the dashboard. It supports file selection, validation, removal, an optional
note, send/error/confirmation states, and sample advisor downloads. The persistent preview
notice and confirmation explicitly say nothing is sent or saved. All advisor/request/document
content is synthetic. Reloading resets the demonstration.

**This is not a production upload service.** See [DOCUMENTS.md](DOCUMENTS.md) for source
provenance, the mock boundary, verification, and the portal integration work still required.

## Shared icon family

`src/_icons.svg` is the single source for the hand-drawn SVG family; `build.py` embeds it in each
page. `icon-study.html` is a design reference, linked only from the handoff index.

- Utility symbols use `i-*` IDs, a 24-unit grid, and the existing 1.75-unit rounded stroke. Use
  `{{icon:name}}` (or `{{icon:name sm}}`) in sources. Keep icons paired with clear text labels.
- Editorial symbols use `m-*` IDs and a 64-unit grid with a 2.5-unit rounded stroke. Use an SVG
  with the `pictogram` class and a `<use href="#m-name"/>`. `welcome`, `people`, `growth`, `funding`,
  and `business` are shared across account access, Home, milestone selection, and milestone forms.
- `icon-tone` adds a 14% fill of the inherited ink; `icon-solid` is for tiny solid details. Do not
  add gradients, shadows, extra colors, or a badge behind each icon. Provider logos stay unchanged.
- Decorative SVGs are hidden from assistive technology and cannot receive focus. Card arrows
  retain their existing hover and keyboard-focus behavior. Do not make pictograms separate actions.

## Mapping to the theme

The markup reuses the theme's existing hooks so styles can be moved across without renaming:

| Theme hook | Used for |
| --- | --- |
| `--mysbdc-brand-*` custom properties | Same names and values as `main.css`. New: `navy-soft`, `pool-pale`, `signal-dark` |
| `--mysbdc-navy-*`, `--mysbdc-on-navy*` | Matte dark surfaces, selection states, warm light text and muted accents |
| `#site-menu`, `.primary-navigation .menu-item.active > a > .icon/.label` | The rail |
| `#site-menu-toggle`, `.burger-icon .bar`, `body.site-menu-active` | Widening the rail to a labelled sidebar |
| `#site-branding`, `#site-logo`, `#site-title` | Logo and centre name in the header |
| `#header`, `#site-utility-navigation`, `.site-user-navigation` | Top utility bar and account menu |
| `#page`, `#main-content`, `#footer` | Page frame |
| `.mysbdc-client-next-steps-overview` | The next step: `.memo` (note text), `.memo-from` (author), `.memo-links` (optional link) |
| `.mysbdc-client-milestones-overview` | Milestone band on Home |
| `.mysbdc-client-counselor-overview` | Advisor card |
| `.mysbdc-client-overview` | Business card |
| `.mysbdc-user-upcoming-events`, `article.event`, `.entry-event-date`, `.entry-title`, `.entry-details .detail`, `.btn-event-register` | Event rows |
| `.btn`, `.btn-primary`, `.btn-sm`, `.eyebrow`, `.dropdown-menu`, `.dropdown-item` | Same names as Bootstrap; the values here are the intended look |

## What changed from staging, and why

1. **The shell stays close to the staging theme.** Matte navy header across the top with the hamburger
   (`#site-menu-toggle`), logo and centre name, then the public website link, language and the account menu. Below it,
   the matching `#site-menu` rail with an inset slate-blue active item and a short pool marker; the hamburger widens it to a
   labelled sidebar (`body.site-menu-active`). Two differences: each icon keeps a word under it,
   because icon-only navigation loses less confident users, and below 1200px the widened sidebar
   overlays the page instead of squeezing it.
2. **On phones the rail becomes a four-item bottom tab bar.** The selected tab keeps its inset fill.
   Settings is in the account menu.
3. **The page is warm paper, not white.** Soft gradients plus a fine grain (`--grain`, `--grain-mid`,
   `--navy-depth` tokens). The app header, rail, business card and dark milestone tile use solid
   slate navy, with warm paper text and soft pool accents.
4. **Home is mostly open page, with a few quiet surfaces.**
   - *Your next step* is the advisor's latest note from Neoserra, shown as written in a serif
     reading size, with who wrote it and when. There is no big button and no progress tracker.
     If the note carries a link, it appears as a text link under the note (`.memo-links`), beside
     "Reply to Dana". With no note yet (new client), the same sheet shows a note from the center.
   - *Your business* is the slate-navy card at the top right, with a serif business name and quieter
     supporting facts; on phones it follows the next step.
   - *Your advisor* sits in a light rounded container: name, specialty, Send a message (there is
     no booking), and the resources the advisor picked for this client.
   - *Your milestones* is an open editorial section headed "Progress takes many forms." Four
     solid-colour tiles use small, softened geometric marks for people, sales, capital and a new beginning.
     Each whole tile opens its milestone form; its arrow appears on hover or keyboard focus. The grid
     moves from four columns to two, then compact single-column rows on the narrowest phones.
   - Coming up sits directly on the page.
   Home styles are section 13 of the stylesheet and sized in rem.
5. **Sign-in has no password.** Google, Microsoft, or a link by email.
6. **Form 641 is five short steps** with contextual help, a grouped review, and explicit browser-only
   draft saving. Existing optional questions remain marked optional.
7. **Settings is one page**, in sections that save independently.

## Training listing

`events.html` carries the refined Home design into Training: an editorial introduction and a compact,
full-width next-session panel for an existing registration. Live workshops sit on the open
page, grouped by month, with times visible before opening the details. Topic and format filters
update the workshop count and show a clear empty state when no sessions match. The filter groups
retain accessible names without redundant visible “Topic” and “Format” labels.
The introduction has no extra call to action; the workshop list is already on the page.

Recorded training uses solid sand, pool, sage, and navy tiles with serif titles and arrows that appear
only on hover or keyboard focus. Each tile shows a duration and “Watch training.” No module steps,
completion counts, or resume state are shown: viewing progress will not be tracked.
The layout adapts from four training columns to two, then one on phones; workshop actions stay
comfortably sized on narrow screens. Listing styles are scoped under section 17 of the stylesheet.

There are no advisor-curated training recommendations: advisors currently have no supported way to
share them into the client dashboard. Registration remains a local preview interaction; recording,
calendar, and cancellation destinations remain placeholders pending integration.

## Resources

`resources.html` starts with five existing sample resources: the one-page business plan, cash flow
forecast, loan package checklist, pricing worksheet, and first-hire guide. Each is one whole-card
link with a serif title, brief description, file information, and a small pool, sage, sand, or navy
category pill. The pill is a label, not a separate control. White cards have no border or shadow;
space separates them, with no hairline rules. Arrows appear on hover or keyboard focus. The grid
moves from three columns to two, then one on phones. No recommendation feature, filter bars,
saved states, counts, or webinar section.

Each card opens its own static detail page; `resource.html` retains the loan-checklist route.
The detail layout mirrors the milestone forms with a compact color context panel and white reading
sheet. A short overview, contents, and practical usage note lead to the file actions. The five items
and their descriptions are sample content, not a confirmed launch inventory. Download and document
links remain handoff placeholders until the actual files are supplied. No saving or tracking is implied.
Resources styles are scoped in section 22 of the stylesheet; shared Training behavior is unchanged.

## Sign-in, signup, and Form 641

`login.html` and `signup.html` share a matte navy introduction and white account-access sheet.
The serif greeting, open-door pictogram, 6px controls, and warm paper background carry the approved
Home language through onboarding. Mobile shortens the introduction and removes supporting
promotional copy so the account controls are closer to the top. The email confirmation uses an
h2 under the page's existing h1; returning to the form restores focus to the email field.

`register.html` keeps its five-step questionnaire and conditional business/planning paths. The
navy context panel offers help for each step beside the white form sheet; phones get a compact
banner. Its controls share the milestone form styles. Review groups contact details, business,
and priorities, followed by the unchanged counseling agreement and signature fields. Empty
answers now replace previous summary values. The agreement disclosure remains collapsible.

“Save progress” explicitly stores an intake draft **only in this browser** under
`mysbdc-intake-draft-v1`. It restores the saved answers, selections, and step on a subsequent
visit. Edits after a save show “Unsaved changes.” Storage errors show a message instead of a
false success. Signature, agreement, and survey consent are never stored; completion clears
the draft. This is a local prototype convenience, not an authenticated account or server record.
The production integration must replace this with the intended account-scoped draft service.

Authentication providers, email delivery, account email, center matching, language switching,
signed-form delivery, and final submission remain handoff placeholders. The confirmation copy
shows the intended production state; it does not mean an email was sent or a client record created.

Fields, options, defaults, branching, and agreement text follow the original intake design.
Phone now uses `type="tel"`. The field set still does not include home address or optional SBA
demographics; verify the current SBA and Neoserra requirements before production integration.
Account styles are section 20 of the stylesheet; intake refinements are section 21.

## Milestone overview

`milestones.html` uses Home's four solid-color tiles and softened symbols. There are no giant
corner icons, gradients, or decorative numbers. Keep this screen focused on sharing an update:
no milestone history or previous-update records. Arrows stay hidden until hover or keyboard focus,
on both Home and the overview. At small widths the tiles become two columns, then compact
single-column rows. Overview styling is scoped to section 19.

## Milestone forms

Each milestone type is its own short form, matching the staging routes. The four forms carry the
approved Home vocabulary into a focused question-and-answer layout:
- A solid colour identity panel sits beside a white question sheet, with the same small, softened
  symbol as its Home tile. Colours are pool for hired, sage for sales, sand for funding, and matte
  slate navy for started. There are no colour washes, cropped icons, or decorative numbers.
- On phones the identity panel becomes a compact banner. Cards and controls use 6px corners;
  primary actions remain navy, with clear focus and selected states.
- Progress uses three short dashes, meaningful step names for assistive technology, and
  "Step 1 of 3". These numbers communicate actual progress.
- One serif question per step. Counts use a large serif number with generous − and + controls.
  Choices are soft filled rows with visible radio states. Help stays beside its related question.
- The review step is a sentence built from the answers (`data-echo`), then "Did the SBDC help?" and a typed name.
- `milestone-done.html` uses a quiet checkmark, a line that fits the milestone (`?type=`), a link back to milestones,
  and four compact colour links for sharing another update.
- Steps are `<section class="step-panel">` inside `form[data-stepper]`; the same script runs Form 641.
  `data-when="field=value"` skips a panel unless that answer was given (the "not yet" branch);
  `data-show-if="field=value"` shows a field only for that answer (loan type appears only for loans).
Shared form and confirmation styling is in section 18 of the stylesheet. These remain static
handoff forms pending backend integration.
The fields are a starting set drawn from the earlier preview; check them against what Neoserra's
milestone records require.

## Surface rule: flat

App surfaces are solid colours with a 6px radius. No gradients, no grain and no soft drop shadows on
cards, panels, bands or tiles. Separation comes from colour and spacing. The one shadow in the
vocabulary is the brand's solid offset plate (`box-shadow: 10px 10px 0 <colour>`, the About page's pool
plate at a smaller scale), used on a single focal surface per page; on Home that is the next step.
The form washes described above are existing exceptions, not the default for new dashboard pages.
See [DESIGN.md](DESIGN.md) for the approved direction as pages are developed or refreshed.

## Accessibility

- Text is 17px minimum for reading, 15px minimum anywhere. A "Larger text" switch in Settings scales everything.
- Every button, link and field is at least 48px tall. Fields are 56px.
- Labels are always visible above fields. Placeholders are examples only.
- State is never colour alone: switches say On/Off, registered buttons change their word, steps have names.
- Visible focus ring on everything; skip link; landmarks and headings in order; `aria-current` on navigation.
- Honours `prefers-reduced-motion`.
- Colour pairs were chosen for WCAG AA contrast. This has not been through a formal audit or screen-reader testing.

## Decisions for Crown and NorCal SBDC to confirm

- **Authentication.** Staging uses email and password. These designs assume Google and Microsoft
  sign-in plus an emailed link. That is a build decision, not only a style change.
- **Words.** The designs say *Training*, *Advisor* and *Session* where staging says *Events*,
  *Counselor* and *Meetings*. Routes can stay as they are.
- **Promises in the copy.** "Usually within two business days", "replies within one business day"
  and "the link works for 15 minutes" are placeholders for real service levels.
- **Form 641 fields.** The steps follow the original Intake design, which has no home address and no
  demographic questions. Check the field list and agreement wording against the current SBA form
  and what Neoserra requires before build.
- **Data not yet on staging.** The next-step note (text, author, date and optional link from Neoserra), advisor photo,
  advisor-picked resources are designed here but need a source in Neoserra or WordPress.
- **Placeholder links.** Help, Get help, Privacy, Accessibility and "Talk to someone now" point at `#help`-style anchors until real destinations exist.
- **Fonts.** The Typekit kit serves Proxima Nova at 300, 400, 500, 700 and 900 only, so the stylesheet uses those weights.
- **Spanish.** The language control is designed; no Spanish copy is included.

All names, dates, numbers and the advisor are sample content. Photos are the repository's existing preview images.
