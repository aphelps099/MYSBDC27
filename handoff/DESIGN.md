# MySBDC dashboard — approved design philosophy

Approved by the user on November 10, 2026. The refined Home page establishes the design standard
for future MySBDC dashboard pages: its editorial milestone section, softened symbols, matte navy
shell, and slate-navy business card are the reference. Carry this approach forward as pages evolve.

## Design intent

Calm, human, and editorial. Aim for the care and precision of a considered studio identity:
deliberate proportions, confident typography, generous space, and a restrained palette. The app
should feel welcoming and useful to a small-business owner. Let composition do the work; decoration
should support the content and the next action.

## The visual language

- **Aim for a minimal UI.** Every visible element should help the client understand or complete
  their task. Remove redundant prompts, repeated labels, and links that only point to nearby
  content, such as “Explore live workshops” above the workshop list. Let the page's structure
  guide people; keep actions where they are useful.
- **Typography creates hierarchy.** Proxima Sera brings warmth to editorial headlines, advisor
  notes, and business names. Proxima Nova keeps navigation, facts, labels, and controls clear.
  Give important words room; keep supporting details quieter but comfortably readable.
- **Use open layouts and a few meaningful surfaces.** Align content carefully, balance narrow
  supporting columns against the main content, and separate sections with space. Avoid wrapping
  every item in a card or repeating decorative dividers. Adapt the composition to each page's task.
- **Navy is matte and layered through solid colour.** The header and rail share a deep navy;
  business cards and other focal dark surfaces use a lighter slate navy. Warm cream text and soft
  pool accents make these areas feel welcoming. No gradients, grain, glows, or soft shadows on
  these surfaces.
- **Keep the palette disciplined.** Warm paper grounds the page. Pool, sage, sand, and navy can
  distinguish meaningful actions, as on the milestone tiles. Berry is a sparse accent.
- **Keep edges and depth restrained.** Cards and tiles use the shared 6px radius. A solid pool
  offset plate may emphasize one focal surface, as on the next-step note; it is not a general
  card shadow. Prefer colour, spacing, and alignment for separation.
- **Symbols are supporting elements.** Use small, softened geometric marks with enough breathing
  room. Preserve the quieter milestone symbols and rounded asterisk. Avoid oversized, sharp,
  aggressive, or dominant illustrations.
- **No decorative numbering.** Do not restore the milestone labels “01 / 02 / 03 / 04” or introduce
  numbered editorial section labels across the dashboard. Real counts and useful form-step
  indicators remain appropriate.
- **Navigation stays quiet and explicit.** Keep icons paired with words. Selected items use an
  inset slate fill and a subtle pool cue. Carry the same treatment into the mobile bottom tabs.
- **Milestones stay focused on sharing.** Show the four update choices without a history or
  previous-update records. Tile arrows appear only on hover or keyboard focus, including on Home.
- **Training reflects supported workflows.** Show registered sessions, browsable workshops, and
  recorded training. Do not imply advisor-curated training recommendations until advisors have a
  supported way to share them into the client dashboard. Recorded training has no progress tracking:
  omit completion bars, module steps, and resume claims. Its card arrows appear only on hover or
  keyboard focus. Filters keep accessible group names without redundant visible labels.
- **Write with reassurance and clarity.** Short, human language and one clear priority per section
  help the user understand their next step. Preserve useful secondary links without competing CTAs.

## Shared navy tokens

Use the variables in `assets/mysbdc.css` instead of introducing near-duplicate colours.

| Token | Value | Role |
| --- | --- | --- |
| `--mysbdc-navy-shell` | `#192C3F` | Header and navigation rail |
| `--mysbdc-navy-surface` | `#243B50` | Business card and focal dark tiles |
| `--mysbdc-navy-selected` | `#304B62` | Selected navigation fill |
| `--mysbdc-on-navy` | `#F5F1E8` | Primary text on navy |
| `--mysbdc-on-navy-muted` | `#BECCD5` | Supporting text on navy |
| `--mysbdc-on-navy-accent` | `#AFD2DF` | Links and accents on navy |

These surface tokens complement the existing brand navy used for text and controls.

## Carrying the standard forward

`handoff/` is the source of truth for the signed-in app. Use `src/dashboard.html`,
`src/dashboard-new.html`, and the shared stylesheet as the reference, with the
[handoff README](README.md) for build and interaction details. Edit page sources in `src/` and
shared assets, then run `python3 handoff/build.py` from the repository root when implementation
changes require regenerated pages.

This philosophy takes precedence over the public marketing site's composition rules for dashboard
work. Existing form-specific colour washes and cropped icons are legacy patterns, not the default
for new pages; refresh them deliberately when those forms are in scope. Keep unrelated flows intact.

Review new work at desktop and phone widths. Preserve readable contrast, visible keyboard focus,
clear labels, comfortable touch targets, and reduced-motion support. The design should stay calm
and usable when content grows, the sidebar expands, or the layout becomes a mobile view.
