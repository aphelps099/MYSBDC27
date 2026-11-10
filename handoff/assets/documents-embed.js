/* Presentation bridge for the supplied component's open shadow root.
   No minified vendor code is edited. Only this local preview changes receipt copy. */
(function () {
  'use strict';
  function mount() {
    const host = document.getElementById('document-tools');
    const loading = document.getElementById('documents-loading');
    const error = document.getElementById('documents-load-error');
    const root = host.shadowRoot;
    const content = document.getElementById('documents-embed-content');
    let previousHeight = 0;
    const sendHeight = () => {
      const height = Math.ceil(content.getBoundingClientRect().height);
      if (height === previousHeight) return;
      previousHeight = height;
      parent.postMessage({type:'mysbdc-documents:height', height}, location.origin);
    };
    new ResizeObserver(sendHeight).observe(content);
    if (!root) { loading.hidden = true; error.hidden = false; sendHeight(); return; }
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'assets/documents-widget.css' + location.search;
    stylesheet.addEventListener('load', () => { loading.hidden = true; host.hidden = false; sendHeight(); });
    stylesheet.addEventListener('error', () => { loading.hidden = true; error.hidden = false; sendHeight(); });
    root.append(stylesheet);
    const copy = (selector, text) => {
      const element = root.querySelector(selector);
      if (element && element.textContent !== text) element.textContent = text;
    };
    const previewReceipt = () => {
      copy('.nc-sent__eyebrow','Preview complete');
      copy('.nc-sent .nc-heading','Your upload preview is complete.');
      copy('.nc-sent__text','Your files have not been sent to Dana or saved. This preview shows how sharing documents will work.');
      root.querySelectorAll('[aria-label="Files sent"]').forEach(element => element.setAttribute('aria-label','Files previewed'));
      const time = root.querySelector('.nc-receipt__at');
      if (time?.textContent.startsWith('Sent today')) time.textContent = time.textContent.replace('Sent today','Previewed today');
      root.querySelectorAll('.nc-file[data-phase="sent"] .nc-file__status').forEach(element => {
        if (element.textContent.trim() === 'Sent') element.textContent = 'Previewed';
      });
    };
    new MutationObserver(previewReceipt).observe(root, {subtree:true,childList:true,characterData:true});
    previewReceipt();
    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (button?.textContent === 'Back to dashboard') {
        event.preventDefault();
        event.stopImmediatePropagation();
        parent.postMessage({type:'mysbdc-documents:home'}, location.origin);
      }
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();
