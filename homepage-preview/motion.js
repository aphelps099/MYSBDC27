/* Optional one-time movement. Content remains visible even if scripting fails. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const running = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (preference.matches) continue;
      const animation = entry.target.animate([{ transform: 'translateY(14px)' }, { transform: 'translateY(0)' }], { duration: 600, easing: 'cubic-bezier(.2,.7,.3,1)' });
      running.add(animation); animation.finished.then(() => running.delete(animation)).catch(() => {});
    }
  }, { threshold: .12 });
  document.querySelectorAll('.hero-copy, .homepage:not(.color-overlay) .hero-photo, .service, .programs-intro, .story').forEach(el => observer.observe(el));
  preference.addEventListener('change', event => { if (event.matches) { observer.disconnect(); running.forEach(animation => animation.cancel()); running.clear(); } });
})();
