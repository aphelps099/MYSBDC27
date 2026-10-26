// The visitor chooses the advisor. Portraits never advance automatically.
const enhanced = new WeakSet();

function enhanceAdvisors() {
  document.querySelectorAll('#dc-root [data-advisor-feature]').forEach(feature => {
    if (enhanced.has(feature)) return;
    enhanced.add(feature);
    const tabs = [...feature.querySelectorAll('[role="tab"]')];
    const panels = [...feature.querySelectorAll('[role="tabpanel"]')];
    function select(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus({preventScroll: true});
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(next, true);
      });
    });
  });
}

document.addEventListener('publicready', enhanceAdvisors);
enhanceAdvisors();
