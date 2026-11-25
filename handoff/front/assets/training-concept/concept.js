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

const filters = document.querySelector('.training-filters');
const topic = document.querySelector('#topic');
const format = document.querySelector('#format');
const events = [...document.querySelectorAll('.training-event')];
const count = document.querySelector('#result-count');
const empty = document.querySelector('.no-results');
function filterEvents() {
  let visible = 0;
  for (const event of events) {
    const matches = (topic.value === 'all' || event.dataset.topic === topic.value) &&
      (format.value === 'all' || event.dataset.format === format.value);
    event.hidden = !matches;
    if (matches) visible++;
  }
  count.textContent = `${visible} upcoming ${visible === 1 ? 'session' : 'sessions'}`;
  empty.hidden = visible !== 0;
}
filters.addEventListener('change', filterEvents);
filters.addEventListener('submit', event => event.preventDefault());
filters.addEventListener('reset', () => { requestAnimationFrame(filterEvents); });
document.querySelector('#show-all').addEventListener('click', () => { filters.reset(); topic.focus(); });
