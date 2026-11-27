/* Impact page figures (November 27, 2026). Each figure marked data-odo rolls like an odometer from a few percent
   below its final value, as on the homepage figures band, once it scrolls into view. The settled figure matches the
   original text exactly, screen readers get the plain text, and nothing moves with reduced motion or without GSAP. */
(() => {
  const els = [...document.querySelectorAll('[data-odo]')];
  if (!els.length || !window.gsap || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rolls = els.map((el) => {
    const text = el.textContent.trim();
    const m = text.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!m) return null;
    const [, pre, num, post] = m;
    const digitsOnly = num.replace(/[^\d]/g, '');
    const final = parseInt(digitsOnly, 10);
    const start = Math.max(0, final - Math.max(9, Math.round(final * 0.03)));
    let html = '<span class="nb-sr">' + text + '</span><span class="nb-odo" aria-hidden="true">' + pre;
    [...num].forEach((ch) => {
      html += /\d/.test(ch)
        ? '<span class="nb-col"><span class="nb-strip">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => '<span>' + d + '</span>').join('') + '</span></span>'
        : ch;
    });
    el.innerHTML = html + post + '</span>';
    const strips = [...el.querySelectorAll('.nb-strip')];
    // Each wheel is as wide as its final digit.
    strips.forEach((strip, i) => {
      const probe = document.createElement('span');
      probe.textContent = digitsOnly[i];
      strip.parentNode.parentNode.insertBefore(probe, strip.parentNode);
      strip.parentNode.style.width = probe.getBoundingClientRect().width + 'px';
      probe.remove();
    });
    const n = digitsOnly.length;
    const render = (v) => strips.forEach((strip, i) => {
      const p = n - 1 - i;
      const unit = Math.pow(10, p);
      const carry = p === 0 ? 0 : Math.max(0, (v % unit) - (unit - 1));
      const pos = p === 0 ? v % 10 : (Math.floor(v / unit) + carry) % 10;
      strip.style.transform = 'translateY(' + (-pos) + 'em)';
    });
    const state = { v: start };
    render(start);
    return { el, play: (delay) => gsap.to(state, { v: final, duration: 2.2, delay, ease: 'power2.out', onUpdate: () => render(state.v), onComplete: () => render(final) }) };
  }).filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const group = rolls.filter((r) => entry.target.contains(r.el));
      group.forEach((r, i) => r.play(i * 0.12));
    });
  }, { threshold: 0.35 });
  // Figures that share a section start together, staggered.
  new Set(rolls.map((r) => r.el.closest('section'))).forEach((s) => s && io.observe(s));
})();
