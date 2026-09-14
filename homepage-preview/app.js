(() => {
  const announcement = document.querySelector('[data-announcement]');
  const dismiss = announcement?.querySelector('.announcement-close');
  if (announcement && dismiss) {
    const storageKey = `mysbdc:announcement:${announcement.dataset.announcement}`;
    try { announcement.hidden = sessionStorage.getItem(storageKey) === 'dismissed'; } catch {}
    dismiss.hidden = false;
    dismiss.addEventListener('click', () => {
      const restoreFocus = announcement.contains(document.activeElement);
      announcement.hidden = true;
      try { sessionStorage.setItem(storageKey, 'dismissed'); } catch {}
      if (restoreFocus) document.querySelector('.site-header .brand')?.focus({ preventScroll: true });
    });
  }
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  function closeMenu(restore = false) {
    if (!button || !nav) return;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Menu'; nav.classList.remove('is-open');
    if (restore) button.focus();
  }
  button?.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close' : 'Menu'; nav.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.getAttribute('href').startsWith('#')) {
      const target = document.querySelector(link.getAttribute('href'));
      closeMenu();
      if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
    } else closeMenu();
  });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && button?.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  nav?.addEventListener('focusout', () => setTimeout(() => { if (!nav.contains(document.activeElement) && document.activeElement !== button) closeMenu(); }, 0));
  window.matchMedia('(min-width: 1101px)').addEventListener('change', () => closeMenu());
  const subscribe = document.querySelector('#newsletter-form button[type=submit]');
  if (subscribe) subscribe.disabled = false;
  document.querySelector('#newsletter-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#newsletter-status');
    status.textContent = 'No subscription was created. Continue to the NorCal SBDC newsletter page to subscribe.';
    status.hidden = false; document.querySelector('#newsletter-live-link').hidden = false;
  });
})();
