/* Training "Keep learning" plus signs (November 27, 2026), after the homepage stories (home-motion.js, part 3):
   they fade and scale in once the band is in view, then drift at different speeds while scrolling. Without GSAP or
   with reduced motion they simply sit at their resting 5%. */
(() => {
  const band = document.querySelector('.od');
  const plus = document.querySelectorAll('.tr-plus svg');
  if (!band || !plus.length || !window.gsap || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const { gsap } = window;
  gsap.set(plus, { opacity: 0, scale: 0.86 });
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    gsap.to(plus, { opacity: 0.05, scale: 1, duration: 1.4, ease: 'power2.out', stagger: 0.15 });
  }, { rootMargin: '0px 0px -25% 0px' });
  io.observe(band);
  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    plus.forEach((p, i) => gsap.to(p, { y: [-70, -130, -50][i] || -60, ease: 'none',
      scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true } }));
  }
})();
