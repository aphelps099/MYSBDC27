// Site navigation behaviour: scrolled state, language menu, Advising panel dismissal and the small-screen menu.
(() => {
  const nav = document.querySelector('[data-site-nav]');
  if (!nav) return;

  // Past the hero, the bar tightens and swaps language/MySBDC for the advising button.
  const updateScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', updateScrolled, { passive: true });
  window.addEventListener('pageshow', updateScrolled);
  updateScrolled();

  // A link to one Advising topic opens that topic when the page arrives.
  const openTarget = () => {
    const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (target instanceof HTMLDetailsElement) target.open = true;
  };
  window.addEventListener('hashchange', openTarget);
  openTarget();

  // The header and the footer each carry a language menu.
  const languages = [...document.querySelectorAll('.site-nav-language, .site-footer-language')];
  document.addEventListener('click', event => {
    languages.forEach(language => { if (language.open && !language.contains(event.target)) language.open = false; });
  });

  // Escape closes the Advising panel even while the pointer or focus is still on it.
  const panelItems = [...nav.querySelectorAll('.site-nav-item')];
  const restorePanel = () => nav.classList.remove('panel-dismissed');
  panelItems.forEach(item => {
    item.addEventListener('mouseleave', restorePanel);
    item.addEventListener('focusout', event => { if (!item.contains(event.relatedTarget)) restorePanel(); });
  });

  const menu = nav.querySelector('.site-menu');
  const toggle = nav.querySelector('.site-nav-toggle');
  const close = nav.querySelector('.site-menu-close');
  const background = () => [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

  function setMenu(open) {
    if (!menu || !toggle) return;
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('site-menu-open', open);
    background().forEach(element => { element.inert = open; });
    (open ? close : toggle)?.focus();
  }
  toggle?.addEventListener('click', () => setMenu(true));
  close?.addEventListener('click', () => setMenu(false));
  menu?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', event => {
    if (event.matches && menu && !menu.hidden) setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (menu && !menu.hidden) { setMenu(false); return; }
      const openLanguage = languages.find(language => language.open);
      if (openLanguage) { openLanguage.open = false; openLanguage.querySelector('summary').focus(); return; }
      const openItem = panelItems.find(item => item.matches(':hover, :focus-within'));
      if (openItem) nav.classList.add('panel-dismissed');
      return;
    }
    if (event.key === 'Tab' && menu && !menu.hidden) {
      const items = [...menu.querySelectorAll('a[href], button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();

// Menu panels (November 2026): a very fast GSAP entrance each time a panel opens. The panel fades in and drops 6px,
// then its statement and links step in 18ms apart (all settled in about 0.45s). Skipped for reduced motion or if GSAP is not on the page.
(() => {
  const nav = document.querySelector('[data-site-nav]');
  if (!nav || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  nav.querySelectorAll('.site-nav-item').forEach(item => {
    const panel = item.querySelector('.site-nav-panel');
    if (!panel) return;
    let open = false;
    const play = () => {
      if (open || !window.gsap) return;
      open = true;
      const bits = panel.querySelectorAll('.site-nav-panel-lede > *, .site-nav-panel-list > li');
      window.gsap.killTweensOf([panel, ...bits]);
      window.gsap.fromTo(panel, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out', clearProps: 'opacity,transform' });
      window.gsap.fromTo(bits, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.26, ease: 'power3.out', stagger: 0.018, delay: 0.03, clearProps: 'opacity,transform' });
    };
    const reset = () => { open = false; };
    item.addEventListener('mouseenter', play);
    item.addEventListener('focusin', play);
    item.addEventListener('mouseleave', () => { if (!item.contains(document.activeElement)) reset(); });
    item.addEventListener('focusout', event => { if (!item.contains(event.relatedTarget) && !item.matches(':hover')) reset(); });
  });
})();
