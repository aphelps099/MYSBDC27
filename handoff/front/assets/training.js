/* Training calendar (November 27, 2026): the format filter, the empty message, and "See more sessions".
   The first three sessions that match the filter show; the button reveals the rest and disappears when there are none. */
(() => {
  const group = document.querySelector('.tc-chips[data-group="format"]');
  const rows = [...document.querySelectorAll('.tc-row')];
  if (!rows.length) return;
  const empty = document.querySelector('.tc-empty');
  const more = document.querySelector('.tc-more');
  const FIRST = 3;
  let filter = 'all';
  let expanded = false;
  const render = () => {
    const matches = rows.filter((row) => filter === 'all' || row.dataset.format === filter);
    rows.forEach((row) => { row.hidden = true; });
    matches.forEach((row, i) => { row.hidden = !expanded && i >= FIRST; });
    if (empty) empty.hidden = matches.length > 0;
    if (more) more.hidden = expanded || matches.length <= FIRST;
  };
  group?.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-value]');
    if (!chip) return;
    group.querySelectorAll('[data-value]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    filter = chip.dataset.value;
    render();
  });
  more?.addEventListener('click', () => {
    const firstHidden = rows.find((row) => row.hidden && (filter === 'all' || row.dataset.format === filter));
    expanded = true;
    render();
    firstHidden?.querySelector('h4 a')?.focus();
  });
  render();
})();
