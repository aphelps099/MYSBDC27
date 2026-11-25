const header = document.querySelector('.concept-nav');
const language = document.querySelector('.language-control');
function updateHeader() { header?.classList.toggle('scrolled', window.scrollY > 30); }
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && language?.open) {
    language.open = false;
    language.querySelector('summary').focus();
  }
});
document.addEventListener('click', event => {
  if (language?.open && !language.contains(event.target)) language.open = false;
});

// Manual regional carousel; never advances while someone is reading.
const regionCarousel = document.querySelector('.region-carousel');
if (regionCarousel) {
  const slides = [...regionCarousel.querySelectorAll('.region-slide')];
  const dots = [...regionCarousel.querySelectorAll('.region-dot')];
  const status = regionCarousel.querySelector('.region-carousel-status');
  let currentSlide = 0;
  function showRegionSlide(index, focusDot = false) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === currentSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      dots[i].setAttribute('aria-pressed', String(active));
    });
    status.textContent = slides[currentSlide].getAttribute('aria-label');
    if (focusDot) dots[currentSlide].focus();
  }
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showRegionSlide(index));
    dot.addEventListener('keydown', event => {
      const targets = { ArrowRight: currentSlide + 1, ArrowLeft: currentSlide - 1, Home: 0, End: slides.length - 1 };
      if (!(event.key in targets)) return;
      event.preventDefault();
      showRegionSlide(targets[event.key], true);
    });
  });
  const slideArea = regionCarousel.querySelector('.region-slides');
  let swipeStart = null;
  slideArea.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') swipeStart = { x: event.clientX, y: event.clientY };
  });
  slideArea.addEventListener('pointercancel', () => { swipeStart = null; });
  slideArea.addEventListener('pointerup', event => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) showRegionSlide(currentSlide + (dx < 0 ? 1 : -1));
  });
}
