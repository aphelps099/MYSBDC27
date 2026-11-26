/* Training calendar: topic and format filters, the month count and the empty message. */
(() => {
  const groups = [...document.querySelectorAll('.tc-chips[data-group]')];
  if (!groups.length) return;
  const rows = [...document.querySelectorAll('.tc-row')];
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('.tc-empty');
  const state = { topic: 'all', format: 'all' };
  const apply = () => {
    let shown = 0;
    rows.forEach((row) => {
      const ok = (state.topic === 'all' || row.dataset.topic === state.topic) && (state.format === 'all' || row.dataset.format === state.format);
      row.hidden = !ok;
      if (ok) shown += 1;
    });
    if (count) count.textContent = shown === 1 ? '1 training' : shown + ' trainings';
    if (empty) empty.hidden = shown > 0;
  };
  groups.forEach((group) => {
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-value]');
      if (!chip) return;
      group.querySelectorAll('[data-value]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      state[group.dataset.group] = chip.dataset.value;
      apply();
    });
  });
})();
