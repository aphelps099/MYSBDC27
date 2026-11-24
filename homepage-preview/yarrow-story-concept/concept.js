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

