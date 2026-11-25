/* Impact page (November 2026).
   1. Sentences: words rise in, in reading order, then the figure pills snap into place, fast, one after another.
      In the three-year section a pool line draws across and the ghosted America's SBDC seal fades in, then drifts
      slowly as the page scrolls (GSAP ScrollTrigger).
      Reduced motion, no script or no GSAP leave everything static and visible.
   2. Stories carousel (photo stage): scroll-snap track with pill progress dots, previous/next, swipe and arrow keys. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = () => root.classList.remove('ic-motion');

  /* ---------- Sentence motion ---------- */
  const animate = (section) => {
    const gsap = window.gsap;
    const words = section.querySelectorAll('.ic-word');
    const pills = section.querySelectorAll('.ic-pill');
    const line = section.querySelector('.ic-record-line');
    const seal = section.querySelector('.ic-seal');
    gsap.set(words, { opacity: 0, yPercent: 70 });
    gsap.set(pills, { opacity: 0, scale: 0.35 });
    gsap.set(section.querySelectorAll('.ic-period, h2'), { opacity: 0, y: 12 });
    if (line) gsap.set(line, { scaleX: 0 });
    if (seal) gsap.set(seal, { opacity: 0 });
    section.dataset.motion = 'ready';

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    if (seal) tl.to(seal, { opacity: 0.08, duration: 1.6, ease: 'power2.out' }, 0);
    if (line) tl.to(line, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0.15);
    tl.to(section.querySelectorAll('h2'), { opacity: 1, y: 0, duration: 0.5 }, 0)
      .to(words, { opacity: 1, yPercent: 0, duration: 0.7, stagger: 0.045 }, 0.1)
      .to(pills, { opacity: 1, duration: 0.08, stagger: 0.11 }, '-=0.25')
      .to(pills, { scale: 1, duration: 0.3, ease: 'back.out(2.6)', stagger: 0.11 }, '<')
      .to(section.querySelectorAll('.ic-period'), { opacity: 1, y: 0, duration: 0.5 }, '-=0.1');

    // The seal drifts upward and turns slightly while the section passes through the window.
    if (seal && window.ScrollTrigger) {
      gsap.fromTo(seal, { yPercent: 14, rotation: -7 }, {
        yPercent: -10, rotation: 5, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      });
    }
    return tl;
  };

  const sections = [...document.querySelectorAll('[data-motion]')];
  const start = () => {
    if (!window.gsap) { reveal(); return; }
    if (window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
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
    const items = [...track.children];
    const dots = [...carousel.querySelectorAll('[data-dot]')];
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    if (!items.length) return;

    // Distance the track must scroll to bring item i to the start edge.
    const delta = (i) => items[i].getBoundingClientRect().left - (track.getBoundingClientRect().left + parseFloat(getComputedStyle(track).paddingLeft));
    const index = () => items.reduce((best, _, i) => (Math.abs(delta(i)) < Math.abs(delta(best)) ? i : best), 0);
    const atEnd = () => track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const go = (i) => {
      const target = Math.max(0, Math.min(items.length - 1, i));
      track.scrollBy({ left: delta(target), behavior: reduce ? 'auto' : 'smooth' });
    };
    const update = () => {
      const i = atEnd() ? items.length - 1 : index();
      dots.forEach((dot, n) => (n === i ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
      prev.disabled = i === 0;
      next.disabled = i === items.length - 1;
    };

    prev.addEventListener('click', () => go(index() - 1));
    next.addEventListener('click', () => go(index() + 1));
    dots.forEach((dot, n) => dot.addEventListener('click', () => go(n)));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); go(index() + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); go(index() - 1); }
    });
    window.addEventListener('resize', update);
    update();
  });
})();
