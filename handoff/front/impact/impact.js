(() => {
  const page = document.body;
  const header = document.querySelector('.concept-nav');
  const language = document.querySelector('.language-control');
  const toggle = document.querySelector('.motion-toggle');
  const statement = document.querySelector('.legacy-statement');
  const photo = document.querySelector('.statement-photo');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let scheduled = false;
  let observer;

  function render() {
    scheduled = false;
    header?.classList.toggle('scrolled', window.scrollY > 30);
    if (!paused && !reduce.matches) {
      const rect = statement.getBoundingClientRect();
      if (rect.bottom > -100 && rect.top < innerHeight + 100) {
        const offset = Math.max(-90, Math.min(90, (innerHeight / 2 - rect.top - rect.height / 2) * .15));
        photo.style.transform = `translate3d(0,${offset.toFixed(2)}px,0)`;
      }
    }
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(render); }
  }
  function syncMotion() {
    observer?.disconnect();
    const reduced = reduce.matches;
    toggle.hidden = reduced;
    page.classList.toggle('motion-paused', paused || reduced);
    if (reduced) {
      photo.style.transform = 'none';
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    } else if ('IntersectionObserver' in window) {
      page.classList.add('motion-ready');
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
        });
      }, { threshold: .04 });
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => observer.observe(el));
    }
    schedule();
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
    syncMotion();
  });
  reduce.addEventListener('change', syncMotion);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && language?.open) { language.open = false; language.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => {
    if (language?.open && !language.contains(event.target)) language.open = false;
  });
  syncMotion();
})();
