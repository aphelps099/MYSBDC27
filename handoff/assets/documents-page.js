/* Only layout and navigation messages cross the document-preview frame boundary. */
(function () {
  'use strict';
  const frame = document.getElementById('documents-frame');
  if (!frame) return;
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    if (message.type === 'mysbdc-documents:height' && Number.isFinite(message.height)) {
      frame.style.height = Math.max(320, Math.min(5000, Math.ceil(message.height))) + 'px';
    }
    if (message.type === 'mysbdc-documents:home') location.assign('dashboard.html');
  });
})();
