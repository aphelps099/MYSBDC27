# MySBDC client app — design handoff

Static, responsive HTML for the signed-in MySBDC experience, written to be lifted into the
`mysbdc` WordPress theme. Open `index.html` for the list of screens.

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
| `settings.html` | Settings | `/account/`, `/account/settings/`, `/business/` |
| `events.html` | Training: advisor pick, live sessions by month, short courses. Register confirms in place | `/events/` |
| `event.html` | Training: one event | `/events/{event}/` |
| `milestones.html` | Milestones: choose a type, plus history | `/milestones/` |
| `milestone-hired.html` | Milestone form: hired someone (3 steps) | `/milestones/new/hired-employees/` |
| `milestone-sales.html` | Milestone form: sales grew (3 steps) | `/milestones/new/increased-revenue/` |
| `milestone-funding.html` | Milestone form: got funding (3 steps) | `/milestones/new/received-funding/` |
| `milestone-started.html` | Milestone form: started a business (3 steps, with a "not yet" exit) | `/milestones/new/started-business/` and `/not-started/` |
| `milestone-done.html` | Thank-you, with a prompt to add another | `/milestones/new/*/success/` |
| `resources.html` | Resources: advisor picks, library with topic, type and Saved filters, recorded webinars | `/resources/` |
| `resource.html` | Resources: one resource | `/resources/{resource}/` |

- `assets/mysbdc.css` is the whole design: tokens, shell, components. No framework.
- `assets/mysbdc.js` is about 120 lines of plain JavaScript (menu, steps, switches). No jQuery.
- `src/` holds the page bodies and `build.py` wraps them in the shared shell. Edit `src/`, then
  run `python3 handoff/build.py`. The built files are committed, so nothing needs building to view.

## Mapping to the theme

The markup reuses the theme's existing hooks so styles can be moved across without renaming:

| Theme hook | Used for |
| --- | --- |
| `--mysbdc-brand-*` custom properties | Same names and values as `main.css`. New: `navy-soft`, `pool-pale`, `signal-dark` |
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

1. **The shell stays close to the staging theme.** Navy header across the top with the hamburger
   (`#site-menu-toggle`), logo and centre name, then help, language and the account menu. Below it,
   the navy `#site-menu` rail with a pool bar on the active item; the hamburger widens it to a
   labelled sidebar (`body.site-menu-active`). Two differences: each icon keeps a word under it,
   because icon-only navigation loses less confident users, and below 1200px the widened sidebar
   overlays the page instead of squeezing it.
2. **On phones the rail becomes a four-item bottom tab bar.** Settings is in the account menu.
3. **The page is warm paper, not white.** Soft gradients plus a fine grain (`--grain`, `--grain-mid`,
   `--navy-depth` tokens). No flat white or flat navy surfaces.
4. **Home is mostly open page, with a few quiet surfaces.**
   - *Your next step* is the advisor's latest note from Neoserra, shown as written in a serif
     reading size, with who wrote it and when. There is no big button and no progress tracker.
     If the note carries a link, it appears as a text link under the note (`.memo-links`), beside
     "Reply to Dana". With no note yet (new client), the same sheet shows a note from the center.
   - *Your business* is the navy card at the top right; on phones it follows the next step.
   - *Your advisor* sits in a light rounded container: name, specialty, Send a message (there is
     no booking), and the resources the advisor picked for this client.
   - *Your milestones* is an open editorial section headed "Progress takes many forms." Four numbered,
     solid-colour tiles use custom geometric marks for people, sales, capital and a new beginning.
     Each whole tile opens its milestone form; the last update and history link sit below. The grid
     moves from four columns to two, then compact single-column rows on the narrowest phones.
   - Coming up sits directly on the page.
   Home styles are section 13 of the stylesheet and sized in rem.
5. **Sign-in has no password.** Google, Microsoft, or a link by email.
6. **Form 641 is five short steps** with a plain-language "why we ask" panel beside each one,
   optional SBA questions clearly marked optional, and a phone alternative.
7. **Settings is one page**, in sections that save independently.

## Sign-up (Form 641)

`register.html` uses the same card, controls and step script as the milestone forms, in one colour
(pool blue) with a different corner icon per step. Fields, options and wording follow the original
`MySBDC Intake.dc.html`: about you (name, email from the account, phone, ZIP with matched center,
language); in business today; how long (or how far along, for people not open yet); the business
(name, kind, set-up, employees, sales range, up to three help topics); review and sign (summary
sentences, request for counseling with the full text behind a disclosure, required agreement, optional
SBA survey consent, typed signature). The last panel is an animated tick, with no confetti.
It does not ask for a home address or the optional SBA demographic questions; add them if the
current SBA form or Neoserra requires them.

## Milestone forms

Each milestone type is its own short form, matching the staging routes. The design is minimal:
- One white card per screen (`.ms-card[data-type]`). The milestone's colour is a single straight wash
  from the top-right corner fading to white, with a bold white icon (`.ms-giant`) cropped off that corner.
  Colours: blue hired, green sales, gold funding, coral started. Buttons are navy on every form.
- Progress is one row: the milestone name, three short dashes and "Step 1 of 3".
- One serif question per step. Counts are a large serif number between round − and + buttons.
  Choices are soft filled rows. Help is one quiet line (`.ms-tip`), not a sidebar.
- The review step is a sentence built from the answers (`data-echo`), then "Did the SBDC help?" and a typed name.
- `milestone-done.html` is a congratulations page with confetti (skipped for reduced motion) and a
  line that fits the milestone (`?type=`).
- Steps are `<section class="step-panel">` inside `form[data-stepper]`; the same script runs Form 641.
  `data-when="field=value"` skips a panel unless that answer was given (the "not yet" branch);
  `data-show-if="field=value"` shows a field only for that answer (loan type appears only for loans).
The fields are a starting set drawn from the earlier preview; check them against what Neoserra's
milestone records require.

## Surface rule: flat

App surfaces are solid colours with a 6px radius. No gradients, no grain and no soft drop shadows on
cards, panels, bands or tiles. Separation comes from colour and spacing. The one shadow in the
vocabulary is the brand's solid offset plate (`box-shadow: 10px 10px 0 <colour>`, the About page's pool
plate at a smaller scale), used on a single focal surface per page; on Home that is the next step.

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
  advisor-picked resources and milestone history are designed here but need a source in Neoserra or WordPress.
- **Placeholder links.** Help, Get help, Privacy, Accessibility and "Talk to someone now" point at `#help`-style anchors until real destinations exist.
- **Fonts.** The Typekit kit serves Proxima Nova at 300, 400, 500, 700 and 900 only, so the stylesheet uses those weights.
- **Spanish.** The language control is designed; no Spanish copy is included.

All names, dates, numbers and the advisor are sample content. Photos are the repository's existing preview images.
