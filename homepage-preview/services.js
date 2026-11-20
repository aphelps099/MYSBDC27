(() => {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('services-entered');
    observer.unobserve(entry.target);
  }), {threshold: .12});
  document.querySelectorAll('.services-page-content .scene-copy, .services-page-content .advising-invitation').forEach(el => observer.observe(el));
})();
