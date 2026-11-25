/* America's SBDC star accent: draw each .sbdc-star once it scrolls into view. See site-star.css. */
(() => {
  const stars = document.querySelectorAll('.sbdc-star');
  if (!stars.length) return;
  document.documentElement.classList.add('sbdc-star-ready');
  const draw = (star) => star.classList.add('is-drawn');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    stars.forEach(draw);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      draw(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  stars.forEach((star) => io.observe(star));
})();
