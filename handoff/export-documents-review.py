#!/usr/bin/env python3
"""Export the review as one offline HTML file and a shareable ZIP.

Run build.py first, then: python3 handoff/export-documents-review.py /path/to/output
The vendor bundle stays byte-for-byte intact inside a data-URL script. Only the
export's mock adapter and presentation bridge are adapted for an opaque file origin.
"""
import base64
import html
import json
import pathlib
import re
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent
DEST = pathlib.Path(sys.argv[1]).expanduser().resolve()
DEST.mkdir(parents=True, exist_ok=True)

def read(name):
    return (ROOT / name).read_text()

def script(source):
    return '<script>' + source.replace('</script', '<\\/script') + '</script>'

# Keep the site typography's system fallbacks; do not redistribute hosted font files.
shared_css = re.sub(r'@import\s+url\([^;]+;', '', read('assets/mysbdc.css'))
frame_css = shared_css + '\n' + read('assets/documents-embed.css')
adapter = read('assets/documents-preview.js').replace(
    'const origin = location.origin;',
    "const origin = 'https://mysbdc-preview.invalid';"
).replace(
    'String(input), origin)',
    "String(input).replace(/^null\\/mysbdc\\//, origin + '/mysbdc/'), origin)"
)
bridge = read('assets/documents-embed.js')
start = bridge.index("    const stylesheet = document.createElement('link');")
end = bridge.index('    const copy = ', start)
bridge = bridge[:start] + '''    const stylesheet = document.createElement('style');
    stylesheet.textContent = ''' + json.dumps(read('assets/documents-widget.css')) + ''';
    root.append(stylesheet);
    loading.hidden = true; host.hidden = false; sendHeight();
''' + bridge[end:]
# Only size and return-navigation messages cross this file-origin frame. The outer
# page still checks both the exact contentWindow and the matching origin.
bridge = bridge.replace('}, location.origin);', "}, '*');")
vendor = base64.b64encode((ROOT / 'assets/vendor/norcal-documents.js').read_bytes()).decode()
frame = '''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>''' + frame_css + '''</style></head><body><main id="main-content">
<div id="documents-embed-content"><p id="documents-loading" role="status">Loading document tools…</p>
<div id="document-tools" data-norcal-documents="window" hidden></div>
<p id="documents-load-error" role="alert" hidden>Document tools could not load. Reopen this preview in your browser.</p>
</div></main>''' + script(adapter) + '<script src="data:text/javascript;base64,' + vendor + '"></script>' + script(bridge) + '</body></html>'

page = read('documents-review.html')
page = re.sub(r'<link rel="stylesheet" href="assets/mysbdc.css[^>]+>', lambda _: '<style>'+shared_css+'</style>', page)
page = re.sub(r'<script defer src="assets/mysbdc.js[^>]+></script>', '', page)
page = re.sub(r'<link rel="stylesheet" href="assets/documents-review.css[^>]+>', lambda _: '<style>'+read('assets/documents-review.css')+'</style>', page)
page = re.sub(r'<script defer src="assets/documents-review.js[^>]+></script>', lambda _: script(read('assets/documents-review.js')), page)
page, frame_count = re.subn(r'(<iframe id="review-frame") data-preview-src="[^"]+"', lambda m: m[1]+' data-preview-document="'+html.escape(frame, quote=True)+'"', page)
assert frame_count == 1, 'Expected one deferred document preview frame'
csp = "default-src 'none'; script-src 'unsafe-inline' data:; style-src 'unsafe-inline'; img-src data: blob:; frame-src 'self' about:; connect-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'"
page = page.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" content="'+csp+'">', 1)
filename = 'MySBDC-document-upload-preview.html'
(DEST / filename).write_text(page)
readme = '''MySBDC document upload review — draft for Cameron and Emumba

Unzip, then open MySBDC-document-upload-preview.html in a desktop web browser.
No account, installation or web server is needed. Forward this ZIP to share it.

This is the supplied document widget with MySBDC presentation styles and an
in-memory mock portal. No selected file is sent or saved by the preview.
The page contains no live endpoint or credential; network connections are blocked.
Downloadable sample files are intentionally saved to the reviewer's device.
Start with the advisor's note, then select Upload your statement to open the
widget. Requests could originate in Emumba's advisor portal or a Neoserra note;
all client actions route through MySBDC. This illustrates the client experience;
it connects to neither source and does not decide when a production request is
created or where a separate request component should sit. Three short discussion points
follow the demo; expand Implementation notes for the technical detail.
Use Start again or reopen the file to reset. Sample downloads and a failure
scenario are available beside the widget under Other demo states.

The standalone version uses system font fallbacks so it works without loading
hosted fonts. The hosted handoff page uses MySBDC's configured brand fonts.
The 90-day retention copy is a sample, not an agreed policy. Authentication,
domain/DNS, sign-out and completion events still need production integration.
'''
with zipfile.ZipFile(DEST / 'MySBDC-document-upload-preview.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(DEST / filename, filename)
    archive.writestr('READ-ME.txt', readme)
print(DEST / filename)
print(DEST / 'MySBDC-document-upload-preview.zip')
