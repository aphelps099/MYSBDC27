/* Progressive enhancement: native scroll, full document height, no hidden legal text. */
(() => {
  const footer = document.querySelector('.network-footer');
  const credit = footer?.querySelector('.nf-credit');
  if (!credit || !('ResizeObserver' in window)) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    footer.classList.toggle('has-credit-reveal', !motion.matches && credit.offsetHeight < innerHeight * .75);
  };
  new ResizeObserver(update).observe(credit);
  window.addEventListener('resize', update, { passive: true });
  motion.addEventListener('change', update);
  update();
})();
