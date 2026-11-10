/* Review controls. Portal behavior remains isolated in the preview iframe. */
(function () {
  'use strict';
  const frame = document.getElementById('review-frame');
  if (!frame) return;
  const status = document.getElementById('review-status');
  const source = frame.getAttribute('src');
  const originalDocument = frame.getAttribute('srcdoc');
  const goToPreview = () => {
    document.getElementById('review-reset').focus({preventScroll:true});
    frame.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'start'});
  };
  const reset = () => {
    if (originalDocument !== null) frame.srcdoc = originalDocument;
    else frame.src = source;
    status.textContent = 'Preview restarted. The sample request and advisor documents have been reset.';
  };
  document.getElementById('review-reset').addEventListener('click', reset);
  document.getElementById('review-open').addEventListener('click', () => { reset(); goToPreview(); });
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'mysbdc-documents:height' && Number.isFinite(message.height)) {
      frame.style.height = Math.max(320, Math.min(5000, message.height)) + 'px';
    } else if (message.type === 'mysbdc-documents:home') {
      reset();
      goToPreview();
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
