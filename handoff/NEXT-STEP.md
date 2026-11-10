# Your next step — agreed behavior

Product decision recorded November 10, 2026 from the user's supplied conversation notes.
This is the specification for the Home sheet. It is not a claim that the data sources,
completion storage, or notifications are implemented in the static handoff.

See [the illustrated design reference](next-step-study.html) for each sheet state with attached
product notes. The examples are static and use no account data.

## One sheet, one next step

Keep the same sheet, “Your next step” label, serif note, signature and one primary action.
Do not leave the sheet empty or remove it. Show the advisor's text as written. App-generated
copy should be brief, usually one sentence, and signed **North Coast SBDC**. Use Dana's photo
and name only for a note actually written by Dana.

An active advisor note always wins. A new or revised note replaces the currently displayed
fallback or Done receipt. A milestone nudge never replaces an advisor note, and **there is no
milestone nudge in this next-step system at all**. The existing milestones band remains on Home.

## Selection order

| Priority | When eligible | Example | Primary action | Signature |
| --- | --- | --- | --- | --- |
| Advisor note | Latest note has not been completed for this client and this note version | “Please upload last month's profit and loss statement before we meet.” | Upload a document, or the note's actual action | Advisor photo and name |
| Documents waiting | At least one returned document is available and has not been downloaded | “Dana sent back your business plan with her notes.” | Download it / View documents | North Coast SBDC |
| Something coming up | An actual upcoming advising session or registered training is within the agreed reminder window | “Your session with Dana is Thursday at 2:00 PM.” | View session / View training | North Coast SBDC |
| Caught up | None of the above applies | “You're all caught up. When you're ready for the next thing, tell Dana what's on your mind.” | Send a message | North Coast SBDC |

Done is a temporary receipt following completion, not another source in the fallback order.
Keep it for the rest of that visit unless a new advisor note arrives. On the next visit, evaluate
the order again, excluding the completed note and fulfilled document requests.

Start with these approved states only. Do not add profile-gap prompts, inferred training
recommendations, advisor-resource picks, or milestone nudges to the selector. The early brainstorm
included these; they are not part of the agreed first release.

The new-client Home still has its center-authored matching message until an advisor is assigned.
It must not say “Send a message to Dana” when there is no advisor. Define the center contact route
for this stage before connecting the fallback to real accounts.

## What clears a step

| Step | Completion evidence | Receipt |
| --- | --- | --- |
| Requested upload | The portal confirms that the relevant upload completed for the linked request | “Done. Your statement is with Dana.” plus the confirmed completion time |
| Returned document | A confirmed download of the relevant document | “Done. Your document was downloaded.” plus its time |
| Note with an action the app cannot observe | Client chooses the quiet **Mark as done** action | “Done. You marked this step complete.” plus its time |
| Upcoming reminder | The event has ended or is cancelled | Retire the reminder; never claim that the client attended |

Use “Mark as done” only for an active advisor note whose completion cannot be detected, such as
“Call your bank.” A mark-as-done acknowledgement is not proof of upload, download, or attendance.
Do not offer it on automated fallback messages. Do not complete a note merely because its link
was opened, a file was selected, or an unrelated document was uploaded.

The intended completion receipt uses a small green check and the actual recorded time. Keep
wording specific to the action; a manual check-off must not say a statement was delivered.
Store the completion first, then show Done. On failure, retain the active step and allow retry.

## Persistence and notifications

Neoserra does not record this completion in the proposed flow. **MySBDC must store it**, scoped
to the authenticated client and the exact source note ID plus version/update identifier. Keep
completion time, completion method, relevant document/request ID, and the acting client.
Do not use one global “done” flag, or the next note could be hidden by the previous completion.
Do not rely on browser storage for the production completion record.

Keep the completion receipt for the current visit while preserving the completed-note record
across later visits and devices. The precise definition/expiry of a visit needs agreement with
the authentication implementation; reloading Home should not immediately erase the receipt.

The proposed advisor notification uses **Resend**, sent by the backend after a confirmed
completion. Use a completion ID to deduplicate retries. Email delivery failure must not undo a
completed step or tell the client to upload again. No Resend email is sent by this handoff.
Confirm notification rules for passive event expiry and returned-document downloads before
integration; expiry must never be reported as a client completing or attending a session.

## Integration requirements for Cameron and Emumba

- **Neoserra:** provide stable note ID/version, advisor identity, written text and action metadata.
  Confirm how edits, replacements and removal are represented. An edited note is a new actionable
  version; old completion must not silently hide it.
- **Documents:** ask Emumba for a supported completion event/callback with request ID, document
  ID, upload ID, outcome and timestamp. It must fire after portal confirmation, not selection or
  an upload attempt. Agree origin/authentication and deduplication for that signal.
- **Waiting documents:** use eligible document IDs and downloaded state. The supplied widget's
  “Ready for you” total includes downloaded documents, so its count alone cannot drive this step.
  Confirm a supported way to open the relevant download or Ready for you tab.
- **Schedule:** use actual sessions and registered training, with end times, timezone and
  cancellation state. Agree the look-ahead window and choose the earliest eligible event.
  Do not imply inferred recommendations or a join URL that is unavailable.
- **MySBDC:** provide account-scoped completion storage, receipt lifecycle and authenticated
  completion endpoints. A newly arrived advisor note overrides an older receipt.
- **Messaging/Resend:** agree the client message destination and advisor notification payload.
  Keep sensitive document contents out of notification email.

The existing upload demo posts only iframe sizing and navigation messages. It does not provide
a production completion event, and its synthetic send/download must never complete a real note.

## Current handoff and acceptance checks

`dashboard.html` remains a static example of an active advisor upload request. Its single primary
action opens the document preview. `dashboard-new.html` shows the center's matching message.
The fallback selector, Done receipt, account persistence and Resend delivery are planned here,
not wired to simulated data or implemented as a fake production workflow.

When the backend work is implemented, verify:

- An unfinished advisor note beats every fallback; its exact completed version stays cleared.
- A new/revised note appears immediately, including during a previous Done receipt.
- Failed and unrelated uploads never clear the current request.
- Already-downloaded documents do not produce a waiting prompt; retained downloads stay available.
- Expired/cancelled reminders clear without claiming attendance, using the correct timezone.
- Completion survives reloads, later visits and other devices, scoped to the correct client.
- Done lasts for the agreed visit; the next visit selects the next eligible state.
- Duplicate completion callbacks produce one record and at most one notification.
- App-generated text always carries the center signature; no note or milestone nudge is fabricated.
