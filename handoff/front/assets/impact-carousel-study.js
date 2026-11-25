/* Impact page stories, modern carousel study (November 2026).
   [data-mc]: scroll-snap track with pill progress dots, previous/next and arrow keys; [data-center] snaps to the middle.
   [data-chips]: pill chips with a photo switch one large story. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-mc]').forEach((root) => {
    const track = root.querySelector('[data-track]');
    const items = [...track.children];
    const dots = [...root.querySelectorAll('[data-dot]')];
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const centered = root.hasAttribute('data-center');
    if (!items.length) return;

    // Distance the track must scroll to bring item i to its resting place.
    const delta = (i) => {
      const t = track.getBoundingClientRect();
      const r = items[i].getBoundingClientRect();
      if (centered) return (r.left + r.width / 2) - (t.left + t.width / 2);
      return r.left - (t.left + parseFloat(getComputedStyle(track).paddingLeft));
    };
    const index = () => items.reduce((best, _, i) => (Math.abs(delta(i)) < Math.abs(delta(best)) ? i : best), 0);
    const go = (i) => {
      const target = Math.max(0, Math.min(items.length - 1, i));
      track.scrollBy({ left: delta(target), behavior: reduce ? 'auto' : 'smooth' });
    };
    const update = () => {
      const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const i = !centered && atEnd ? items.length - 1 : index();
      items.forEach((item, n) => item.classList.toggle('is-current', n === i));
      dots.forEach((dot, n) => (n === i ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
      prev.disabled = i === 0;
      next.disabled = i === items.length - 1;
    };

    prev.addEventListener('click', () => go(index() - 1));
    next.addEventListener('click', () => go(index() + 1));
    dots.forEach((dot, n) => dot.addEventListener('click', () => go(n)));
    items.forEach((item, n) => item.addEventListener('click', (event) => {
      if (centered && !item.classList.contains('is-current') && !event.target.closest('a')) go(n);
    }));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index() + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index() - 1); }
    });
    window.addEventListener('resize', update);
    update();
  });

  document.querySelectorAll('[data-chips]').forEach((root) => {
    const tabs = [...root.querySelectorAll('[data-tab]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab, false));
      tab.addEventListener('keydown', (event) => {
        const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
        if (step) { event.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      });
    });
  });
})();
