# MySBDC Monday showcase

The isolated preview lives at `/MYSBDC27/view/` on GitHub Pages.

- `index.html`: public homepage and links to the existing marketing designs.
- `dashboard.html`: native, responsive client dashboard. Start here for the showcase.
- `sign-in.html`: returning-client demo; `?new=1` selects the new-client journey.
- `intake.html`: five-step preview of the Form 641 journey.
- `calendar.html`: searchable public training schedule.

## Walkthrough

1. Open the dashboard. Use **Upload document → Use sample P&L** to complete the next step.
2. Open Training, search or filter, and register. The event appears in Coming up.
3. Schedule a meeting with Dana. Change the slot and check the updated dashboard.
4. Message Dana, open a resource, and download a sample working template.
5. Share a milestone and check the Milestones tab.
6. Settings includes Active client, Just signed up, and Matching showcase states.
7. Use the public homepage’s Get Started button for the new-client path. Intake has a sample-details shortcut.
8. Use **Reset preview** in the dashboard footer before the next presentation.

## Boundaries

This is a static showcase with sample people and events. Authentication, registrations,
bookings, messages, subscriptions, and milestone submissions are simulated. No backend
calls are made for these actions. Document contents are never read or uploaded; only
the selected filename is retained. Preview state stays in browser localStorage.
The intake illustrates the journey; it is not a complete or submitted SBA Form 641.

The sample date is Monday, October 26, 2026. Events and bookings use consistent dates
after that date. Calendar downloads identify themselves as preview events and use
America/Los_Angeles time. Fonts continue to use the existing licensed Adobe kit.

## Development

Serve the **repository root** (the retained marketing pages share the existing runtime,
tokens, and assets from the parent directory):

```sh
python3 -m http.server 8765 --bind 127.0.0.1
# http://127.0.0.1:8765/view/dashboard.html
```

Dashboard, auth, calendar, and resources use native HTML, CSS and JavaScript modules;
there is no build step. The original design files are unchanged. To refresh the copied
marketing pages, run `python3 view/tools/build_view.py` from the repository root.
The shared public footer is in `view/templates/footer.html`; the build script applies
it to the marketing pages and calendar. Public section headings and dashboard cards
use Proxima Nova, with Proxima Sera reserved for primary page headlines and quotations.

Run `python3 view/tools/verify.py` to check local routes, assets, and script syntax.
Browser verification should cover document completion and reload, registration,
booking, messaging, milestone validation/submission, new-client intake, and phone widths.


## Workflow and document exchange

`workflow.html` is the interactive client journey, timeline, and proposed API blueprint.
It follows the supplied Emumba client-design concept for document exchanges. Vendor API
paths, embed implementation, and production dates remain unconfirmed. The API paths on
this page are proposed MySBDC interfaces, not a claim about existing vendor capabilities.

`dashboard.html?demo=upload` opens the document wizard directly. Add/drop up to five
files, review metadata and an optional note, then finish the local simulation. File
bytes are never read or sent. Only filenames, sizes, a note, and request state are saved.
Open View documents and use Preview advisor return to demonstrate the return/download.
`dashboard.html?demo=milestone#milestones` opens the milestone wizard.

Follow `view/AGENTS.md`: no decorative section numbers, no hairlines outside the footer,
no ornamental navigation arrows, and no preview notice over content.

## Sign-in and navigation refinement

- The default sign-in is for returning clients; `?new=1` keeps the new-client journey and `?training=<id>` retains the registration destination. Google, Microsoft, and email access are simulations, clearly identified in the footer and confirmation state.
- Public pages share `templates/header.html`, `assets/navigation.css`, and `assets/navigation.js`. Marketing page buttons use the same restrained proportions. The native calendar shares the header.
- English is the default. The language dropdown persists an English/Spanish preference locally. The homepage, sign-in, and shared navigation have Spanish copy; other service-page bodies, the dashboard, intake, and workflow documentation remain in English in this preview.
- `assets/sign-in.css` isolates the sign-in layout from the dashboard and intake forms.

## Advising section cleanup

The three advising section overrides are in `templates/advising/`, with scoped styles in `assets/advising.css`. `tools/build_view.py` incorporates them without changing the original Advising design. The testimonial wording and reported results are retained from that design.

The shared language control uses a globe-only disclosure with English and Español choices, keyboard navigation, Escape dismissal, and outside-click dismissal. Public navigation sits beside the logo and uses text-color hover feedback.

## Milestones, stories, and training showcase

- `share-milestone.html` is a dedicated progressive-disclosure experience, linked from every dashboard milestone entry. It collects business starts, distinct funding sources, year-over-year gross revenue, separate jobs created/retained, SBDC contribution, and optional story-contact permission.
- Drafts save in this browser and resume from the dashboard. The review supports edits and category/source changes. Completion saves a stable-ID sample record, displays a thank-you with confetti (disabled for reduced motion), and makes the full record viewable in milestone history. No impact submission, verification, signature, or email happens.
- `assets/milestone-model.js` contains branching, validation, summaries, and record conversion. Run `node view/tools/test_milestones.mjs` for meaningful branching/data checks.
- Training uses the Navy plate direction from the root `Training Thumbnails.dc.html`, adapted with sans-serif titles and no hairlines. `assets/training-cards.js` and `.css` share the four track colors across the training landing page, public calendar, and dashboard. Sample event dates and registration handoffs are retained.
- `templates/story/yarrow.html` is a concise adaptation of https://www.marinsbdc.org/client-stories/yarrow-goods/ (reviewed October 23, 2026). It replaces placeholder copy and the unverified first-hire claim. The original source is linked on the page. The advising excerpt uses the same published quote.
