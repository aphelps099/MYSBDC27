# Document component handoff

## Source and scope

The client supplied `mysbdc-documents-preview (1).zip` on November 10, 2026. Its
`norcal-documents.js` is preserved byte-for-byte in `assets/vendor/norcal-documents.js`,
including its embedded license notices. SHA-256:

`11d17f4b4f9fd22682013aeeef90e9f7cd4e6ab60965dab7398fb12c81094276`

The accompanying README describes the package as a real interface with a pretend portal
inside the browser. The signed-token format, real portal origin, integrity hash, and sign-out
contract are still to be agreed. No real portal endpoint or credential is included here.

## Integration

- `src/documents.html`: dashboard shell, context panel, preview notice, titled iframe.
- `src/documents-embed.html`: isolated component document, loading/error fallback, ordered scripts.
- `assets/documents-preview.js`: synthetic in-memory session, requests, upload responses, and
  sample PDF/ZIP downloads. It replaces fetch only inside the frame. Upload routes never call
  native fetch, and a portal/upload request to another origin is rejected. File bytes are never
  transmitted or persisted by this adapter. Unrelated fetch requests retain native behavior.
- `assets/documents-widget.css`: styles the component's open shadow root without editing its
  bundled JavaScript. Existing validation, tab behavior, and announcements remain in the vendor.
- `assets/documents-embed.js`: loads that stylesheet, sizes the iframe, makes preview receipt
  copy explicit, and sends the Back to dashboard action to the parent.
- `assets/documents-page.js`: accepts resize/navigation messages only from the intended iframe
  at the same origin. Resize values must be finite and within 320–5000px.

The adapter exposes one requested statement, matching Home. The vendor submits all listed
request IDs with an upload; it does not let the client associate individual files with different
requests. The real integration should confirm this behavior with the portal team.

The supplied client validates PDFs up to 25 MB, Word/Excel up to 10 MB, and CSV/images up to
3 MB. Keep server-side validation authoritative in production. The preview's two downloads
are generated samples containing no client data. Its 90-day retention text is inherited sample
content, not an agreed service promise.

## Production integration still required

1. Agree the portal URL, approved distribution/SRI of the script, session and sign-out behavior,
   request/document response contracts, and final retention/file rules with the portal owner.
2. Have the authenticated server issue the correct short-lived signed token for the current
   client. Never put a signing secret or reusable client token into this static repository.
3. Remove `documents-preview.js`, provide the signed `data-token`, and load the approved portal
   script. The current vendor derives the API origin from its script URL. Confirm CORS,
   cookies, upload destinations, and the intended isolation model on the actual hosting domains.
4. Populate the outer advisor copy and requested-document context from the authenticated
   record. Remove the preview notice and preview-only receipt rewriting only when real delivery
   is working. Keep sizing and navigation behavior as appropriate to the agreed embed model.
5. Validate access control, file delivery, rejection/retry behavior, advisor retrieval, download
   authorization, expiry, and sign-out using the real portal integration.

## Verification

### Emumba review page

`documents-review.html` is a separate, sample-only review surface, linked from the design
index rather than client navigation. It starts at the advisor's note, illustrating the
Neoserra Next Steps custom-field flow, and loads the same document component only after
the client selects its upload action. It provides generated PDF samples, a failed-send
walkthrough, reset controls, agreed product behavior, clearly marked recommendations,
and decisions for Cameron and Emumba. Its parent bridge retains origin and frame checks.
Returning to Home keeps the sample note active; this demo does not save completion. Start
again unloads the frame and resets the demonstration to the note. The API field mapping,
link format, and request-creation timing are intentionally left open for technical review.

To create a standalone file and ZIP for sharing without hosting:

```sh
python3 handoff/build.py
python3 handoff/export-documents-review.py /path/to/output
```

The ZIP contains one HTML file and instructions. Its iframe embeds the unchanged vendor
bundle in a data URL, the styles, and the in-memory mock. The export adapts only the mock
URL handling and presentation bridge for file origins. A content security policy blocks
network connections; hosted fonts use their system fallbacks. The artifact contains no
credentials, client files, or live portal connection. Test by opening the exported file
directly, including samples, upload/recovery, downloads, reset and responsive layout.

```sh
python3 handoff/build.py
node --test handoff/tests/documents-preview.test.cjs
node --check handoff/assets/documents-preview.js
node --check handoff/assets/documents-embed.js
node --check handoff/assets/documents-page.js
git diff --check
```

The adapter tests cover one-use sessions, rejection of a foreign portal origin, failed and
successful upload completion, and generated PDF/ZIP responses without native network calls.
For browser QA, use synthetic files only. A filename containing `notsent` simulates a failed
send; remove it and select a valid file to exercise recovery. Check empty/unsupported files,
the explicit preview confirmation, Back to dashboard, both tabs, and mobile layouts.
