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
| `events.html` | Training | `/events/` |
| `milestones.html` | Milestones | `/milestones/` |
| `resources.html` | Resources | `/resources/` |

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
| `body.site-menu-active` | Widening the rail to a labelled sidebar (optional) |
| `#header`, `#site-utility-navigation`, `.site-user-navigation` | Top utility bar and account menu |
| `#page`, `#main-content`, `#footer` | Page frame |
| `.mysbdc-client-next-steps-overview` | The next step (headline, button, progress) |
| `.mysbdc-client-counselor-overview` | Advisor card |
| `.mysbdc-client-overview` | Business card |
| `.mysbdc-user-upcoming-events`, `article.event`, `.entry-event-date`, `.entry-title`, `.entry-details .detail`, `.btn-event-register` | Event rows |
| `.btn`, `.btn-primary`, `.btn-sm`, `.eyebrow`, `.dropdown-menu`, `.dropdown-item` | Same names as Bootstrap; the values here are the intended look |

## What changed from staging, and why

1. **The rail always shows a word under each icon.** Icon-only navigation is the first thing
   that loses a less confident user. `body.site-menu-active` still widens it to a full sidebar,
   but the menu button is gone because the labels are always visible.
2. **On phones the rail becomes a bottom tab bar**, within thumb reach, instead of a hidden menu.
   It has four items; Settings is in the account menu.
3. **The rail and top bar are light.** Cream rail, white page. Navy is the colour of words, not surfaces.
4. **Home has no cards.** One white page: a greeting, the next step as a large serif headline with
   one filled button, a named progress line, then plain typographic lists. The business summary sits
   top right (down to 980px wide) and moves directly under the next step on phones. A new client
   sees the same layout with "We're matching you with your advisor" and a three-step line.
   Home styles are section 13 of the stylesheet, scoped to `.home`, and sized in rem.
5. **Sign-in has no password.** Google, Microsoft, or a link by email.
6. **Form 641 is five short steps** with a plain-language "why we ask" panel beside each one,
   optional SBA questions clearly marked optional, and a phone alternative.
7. **Settings is one page**, in sections that save independently.

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
- **Form 641 fields.** The steps cover contact, business, goals, optional demographics and the
  signed request for counseling. Check the field list and agreement wording against the current SBA form
  and what Neoserra requires before build.
- **Data not yet on staging.** The next-step task, the lender-package checklist, advisor photo and bio,
  advisor-picked resources and milestone history are designed here but need a source in Neoserra or WordPress.
- **Spanish.** The language control is designed; no Spanish copy is included.

All names, dates, numbers and the advisor are sample content. Photos are the repository's existing preview images.
