/* Manually controlled client stories. All stories remain readable without JS. */
(() => {
  const carousel = document.querySelector('.bs-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.bs-client-story')];
  const controls = carousel.querySelector('.bs-carousel-dots');
  if (!controls) return;
  const dots = [...controls.querySelectorAll('button')];
  const status = carousel.querySelector('.bs-carousel-status');
  if (slides.length < 2 || slides.length !== dots.length) return;
  let current = 0;

  function select(index, announce = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.toggleAttribute('inert', !active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
    if (announce) status.textContent = `Story ${current + 1} of ${slides.length}: ${slides[current].dataset.storyName}`;
  }

  slides.forEach((slide, i) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}: ${slide.dataset.storyName}`);
  });
  select(0, false);
  carousel.classList.add('is-enhanced');
  carousel.setAttribute('aria-roledescription', 'carousel');
  controls.hidden = false;

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => select(index));
    dot.addEventListener('keydown', event => {
      if (event.repeat) return;
      let next;
      if (event.key === 'ArrowRight') next = current + 1;
      else if (event.key === 'ArrowLeft') next = current - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = slides.length - 1;
      else return;
      event.preventDefault();
      select(next);
      dots[current].focus({preventScroll:true});
    });
  });

  const track = carousel.querySelector('.bs-carousel-track');
  let start;
  track.addEventListener('pointerdown', event => {
    start = event.isPrimary && event.pointerType === 'touch' && !event.target.closest('a,button')
      ? {x:event.clientX, y:event.clientY, id:event.pointerId} : null;
  });
  track.addEventListener('pointercancel', () => { start = null; });
  track.addEventListener('pointerup', event => {
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < Math.abs(dx) * .6) {
      // If a story link had keyboard focus before a touch interaction, keep it
      // out of the newly inert slide while retaining a visible focus target.
      const moveFocus = slides[current].contains(document.activeElement);
      select(current + (dx < 0 ? 1 : -1));
      if (moveFocus) dots[current].focus({preventScroll:true});
    }
  });
})();
