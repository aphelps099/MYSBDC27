/* Impact page (November 2026).
   1. Sentences: words rise in, in reading order, then the figure pills float in last.
      Uses GSAP when it has loaded; reduced motion, no script or no GSAP leave the text static.
   2. Stories carousel: native scroll-snap track with previous/next buttons, a live count and arrow keys. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = () => root.classList.remove('ic-motion');

  /* ---------- Sentence motion ---------- */
  const animate = (section) => {
    const gsap = window.gsap;
    const words = section.querySelectorAll('.ic-word');
    const pills = section.querySelectorAll('.ic-pill');
    const after = section.querySelectorAll('.ic-period, h2');
    gsap.set(words, { opacity: 0, yPercent: 70 });
    gsap.set(pills, { opacity: 0, y: 48, scale: 0.72 });
    gsap.set(after, { opacity: 0, y: 12 });
    section.dataset.motion = 'ready';
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    tl.to(section.querySelectorAll('h2'), { opacity: 1, y: 0, duration: 0.5 })
      .to(words, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.045 }, 0.1)
      .to(pills, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)', stagger: 0.22 }, '-=0.2')
      .to(section.querySelectorAll('.ic-period'), { opacity: 1, y: 0, duration: 0.6 }, '-=0.5');
    return tl;
  };

  const sections = [...document.querySelectorAll('[data-motion]')];
  const start = () => {
    if (!window.gsap) { reveal(); return; }
    const timelines = new Map(sections.map((s) => [s, animate(s)]));
    reveal();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        timelines.get(entry.target).play();
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    sections.forEach((s) => io.observe(s));
  };
  if (reduce || !sections.length) reveal();
  else if (window.gsap) start();
  else {
    // GSAP is deferred from the CDN; wait for the page load, and never leave the text hidden.
    window.addEventListener('load', start, { once: true });
    window.setTimeout(() => { if (root.classList.contains('ic-motion')) reveal(); }, 4000);
  }

  /* ---------- Stories carousel ---------- */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('[data-track]');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const current = carousel.querySelector('[data-current]');
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
      current.textContent = String((atEnd() ? items.length - 1 : index()) + 1);
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
})();
