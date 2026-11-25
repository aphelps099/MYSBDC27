/* News page: filter pills show all posts, press releases or announcements. Year groups in option B hide when empty. */
(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  if (!buttons.length) return;
  const items = [...document.querySelectorAll('[data-types]')];
  const apply = (filter) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    items.forEach((item) => {
      item.hidden = filter !== 'all' && !item.dataset.types.split(' ').includes(filter);
    });
    document.querySelectorAll('.b-year').forEach((year) => {
      year.hidden = ![...year.querySelectorAll('[data-types]')].some((i) => !i.hidden);
    });
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter)));
})();
