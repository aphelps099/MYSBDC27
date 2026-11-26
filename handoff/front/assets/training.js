/* Training calendar: the format filter and the empty message. */
(() => {
  const group = document.querySelector('.tc-chips[data-group="format"]');
  if (!group) return;
  const rows = [...document.querySelectorAll('.tc-row')];
  const empty = document.querySelector('.tc-empty');
  group.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-value]');
    if (!chip) return;
    group.querySelectorAll('[data-value]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    let shown = 0;
    rows.forEach((row) => {
      row.hidden = chip.dataset.value !== 'all' && row.dataset.format !== chip.dataset.value;
      if (!row.hidden) shown += 1;
    });
    if (empty) empty.hidden = shown > 0;
  });
})();
