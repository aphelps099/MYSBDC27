/* Progressive disclosure; all stories remain available without JavaScript. */
(() => {
  const button = document.querySelector('.is-more-button');
  const extra = [...document.querySelectorAll('[data-extra-story]')];
  const status = document.querySelector('.is-more [role="status"]');
  if (!button || !extra.length) return;
  extra.forEach(story => { story.hidden = true; });
  button.hidden = false;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    extra.forEach(story => { story.hidden = !expanded; });
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Show fewer stories' : 'See more stories';
    status.textContent = expanded ? `${extra.length} more client stories shown.` : 'Showing four client stories.';
    if (expanded) {
      extra[0].querySelector('h3').focus({preventScroll:true});
      extra[0].scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    } else {
      button.scrollIntoView({block:'center', behavior:'instant'});
    }
  });
})();
