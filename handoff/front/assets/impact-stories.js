/* Impact page stories (November 2026).
   [data-carousel]: a native scroll-snap track with previous/next buttons, a live count and arrow-key support.
   [data-picker]: business names as tabs that swap the large story beside them. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('[data-track]');
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const current = root.querySelector('[data-current]');
    const items = [...track.children];
    if (!items.length) return;

    const offsetOf = (i) => items[i].offsetLeft - items[0].offsetLeft;
    const index = () => {
      let best = 0;
      items.forEach((_, i) => { if (Math.abs(offsetOf(i) - track.scrollLeft) < Math.abs(offsetOf(best) - track.scrollLeft)) best = i; });
      return best;
    };
    const atEnd = () => track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const go = (i) => {
      const target = Math.max(0, Math.min(items.length - 1, i));
      track.scrollTo({ left: offsetOf(target), behavior: reduce ? 'auto' : 'smooth' });
    };
    const update = () => {
      const i = atEnd() ? items.length - 1 : index();
      if (current) current.textContent = String(i + 1);
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = atEnd();
    };

    prev.addEventListener('click', () => go(index() - 1));
    next.addEventListener('click', () => go(index() + 1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index() + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index() - 1); }
    });
    window.addEventListener('resize', update);
    update();
  });

  document.querySelectorAll('[data-picker]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[data-tab]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
        if (event.key in keys) {
          event.preventDefault();
          select(tabs[(i + keys[event.key] + tabs.length) % tabs.length], true);
        }
        if (event.key === 'Home') { event.preventDefault(); select(tabs[0], true); }
        if (event.key === 'End') { event.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  });
})();
