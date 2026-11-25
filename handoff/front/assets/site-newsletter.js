// Newsletter signup dialog, opened from the footer link on every page.
// The form is not connected to a mailing service yet: it says so on submit and sends nothing.
(() => {
  const openers = document.querySelectorAll('[data-newsletter-open]');
  if (!openers.length || !window.HTMLDialogElement) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'site-news-dialog';
  dialog.setAttribute('aria-labelledby', 'sn-title');
  dialog.innerHTML = `<div class="sn-inner">
    <button type="button" class="sn-close">Close</button>
    <h2 id="sn-title">Stay a step<br> ahead.</h2>
    <p>Workshops, funding opportunities and practical ideas, by email.</p>
    <form>
      <div class="sn-field"><label for="sn-first">First name</label><input id="sn-first" name="first_name" autocomplete="given-name" required autofocus></div>
      <div class="sn-field"><label for="sn-last">Last name</label><input id="sn-last" name="last_name" autocomplete="family-name" required></div>
      <div class="sn-field sn-wide"><label for="sn-email">Email address</label><input id="sn-email" name="email" type="email" autocomplete="email" required></div>
      <div class="sn-field"><label for="sn-zip">ZIP code</label><input id="sn-zip" name="zip" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5" title="Five-digit ZIP code" required></div>
      <button type="submit" class="sn-submit">Sign me up</button>
      <p class="sn-status" role="status"></p>
    </form>
  </div>`;
  document.body.append(dialog);

  const form = dialog.querySelector('form');
  const status = dialog.querySelector('.sn-status');
  openers.forEach(opener => opener.addEventListener('click', () => { status.textContent = ''; dialog.showModal(); }));
  dialog.querySelector('.sn-close').addEventListener('click', () => dialog.close());
  // A click on the backdrop lands on the dialog element itself, outside the inner panel.
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = 'Preview only. Nothing was sent or saved.';
  });
})();
