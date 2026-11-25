/* Impact page (November 2026).
   1. Text: a mask-up reveal after techfuturesgroup.org. Every word sits in a clipped box and rises into it with a
      plain ease-out, one line after another; the figure pills rise through their own masks last. No bounce or scale.
      In the three-year section a pool line draws across, and the America's SBDC seal background moves with a gentle
      parallax as the page scrolls (GSAP ScrollTrigger), as on californiasbdc.org.
      Reduced motion, no script or no GSAP leave everything static and visible.
   2. Stories carousel (photo stage): scroll-snap track with pill progress dots, previous/next, swipe and arrow keys. */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = () => root.classList.remove('ic-motion');

  // Group masked words by the line they sit on, in reading order.
  const linesOf = (section) => {
    const lines = [];
    let top = null;
    section.querySelectorAll('.ic-word').forEach((word) => {
      const y = Math.round(word.getBoundingClientRect().top);
      if (top === null || Math.abs(y - top) > 4) { lines.push([]); top = y; }
      lines[lines.length - 1].push(word.firstElementChild);
    });
    return lines;
  };

  /* ---------- Text motion ---------- */
  const animate = (section) => {
    const gsap = window.gsap;
    const lines = linesOf(section);
    const pills = section.querySelectorAll('.ic-mask > .ic-pill');
    const notes = section.querySelectorAll('.ic-period, .ic-close-button, .ic-close-phone');
    const line = section.querySelector('.ic-record-line');
    gsap.set(lines.flat(), { y: 0, yPercent: 110 });
    gsap.set(pills, { y: 0, yPercent: 110 });
    gsap.set(notes, { opacity: 0 });
    if (line) gsap.set(line, { scaleX: 0 });
    section.dataset.motion = 'ready';

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    lines.forEach((words, i) => tl.to(words, { yPercent: 0, duration: 0.8 }, i * 0.11));
    if (line) tl.to(line, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.2);
    tl.to(pills, { yPercent: 0, duration: 0.7, stagger: 0.09 }, '-=0.45')
      .to(notes, { opacity: 1, duration: 0.6, ease: 'power1.out', stagger: 0.08 }, '-=0.35');

    // The seal background shifts gently while the section passes through the window.
    const bg = section.querySelector('.ic-record-bg');
    if (bg && window.ScrollTrigger) {
      gsap.fromTo(bg, { y: -50 }, {
        y: 50, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
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
