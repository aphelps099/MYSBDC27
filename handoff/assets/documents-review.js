/* Review controls. Portal behavior remains isolated in the preview iframe. */
(function () {
  'use strict';
  const frame = document.getElementById('review-frame');
  if (!frame) return;
  const status = document.getElementById('review-status');
  const source = frame.getAttribute('data-preview-src');
  const originalDocument = frame.getAttribute('data-preview-document');
  const note = document.getElementById('review-note');
  const upload = document.getElementById('review-upload');
  const stage = document.getElementById('review-stage');
  let loaded = false;
  const showNote = () => {
    upload.hidden = true;
    note.hidden = false;
    stage.textContent = 'Home · Client view';
    status.textContent = 'The sample note stays active. This demo does not save next-step completion.';
    document.getElementById('review-open').focus({preventScroll:true});
    note.scrollIntoView({behavior:'auto',block:'nearest'});
  };
  const openUpload = () => {
    note.hidden = true;
    upload.hidden = false;
    stage.textContent = 'Document upload · Client view';
    if (!loaded) {
      if (originalDocument !== null) frame.srcdoc = originalDocument;
      else frame.src = source;
      loaded = true;
    }
    status.textContent = 'Opened from the advisor’s note. Selecting this link does not complete the request.';
    document.getElementById('review-back').focus({preventScroll:true});
    upload.scrollIntoView({behavior:'auto',block:'start'});
  };
  const reset = () => {
    frame.removeAttribute('srcdoc');
    frame.removeAttribute('src');
    loaded = false;
    showNote();
    status.textContent = 'Preview restarted at the advisor’s note. The sample documents have been reset.';
  };
  document.getElementById('review-reset').addEventListener('click', reset);
  document.getElementById('review-open').addEventListener('click', openUpload);
  document.getElementById('review-back').addEventListener('click', showNote);
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'mysbdc-documents:height' && Number.isFinite(message.height)) {
      frame.style.height = Math.max(320, Math.min(5000, message.height)) + 'px';
    } else if (message.type === 'mysbdc-documents:home') {
      showNote();
    }
  });
  function samplePdf() {
    const stream = 'BT /F1 18 Tf 54 740 Td (MySBDC document preview) Tj 0 -32 Td /F1 12 Tf (Synthetic sample. No client or financial data.) Tj 0 -22 Td (Choose this file in the preview to try the upload flow.) Tj ET';
    const objects = ['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>','<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
    let pdf = '%PDF-1.4\n';
    const offsets = [];
    objects.forEach((object,index) => { offsets.push(pdf.length); pdf += (index+1)+' 0 obj\n'+object+'\nendobj\n'; });
    const start = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach(offset => { pdf += String(offset).padStart(10,'0')+' 00000 n \n'; });
    return pdf+'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+start+'\n%%EOF\n';
  }
  document.querySelectorAll('[data-sample]').forEach(button => button.addEventListener('click', () => {
    const filename = button.dataset.sample === 'notsent' ? 'mysbdc-sample-notsent.pdf' : 'mysbdc-sample-statement.pdf';
    const url = URL.createObjectURL(new Blob([samplePdf()],{type:'application/pdf'}));
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url),1000);
    status.textContent = filename+' prepared for download. Choose it in the upload window to try the flow.';
  }));
})();
