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

Run `python3 view/tools/verify.py` to check local routes, assets, and script syntax.
Browser verification should cover document completion and reload, registration,
booking, messaging, milestone validation/submission, new-client intake, and phone widths.
