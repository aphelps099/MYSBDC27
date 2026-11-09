/* MySBDC handoff — small behaviours only. No framework, no dependencies.
   Everything here is progressive: pages read correctly with JavaScript off. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Rail: expand / collapse (same body class the Crown theme uses), remembered per browser.
  const toggle = $('#site-menu-toggle');
  const setMenu = open => {
    document.body.classList.toggle('site-menu-active', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  };
  try { if (localStorage.getItem('mysbdc-menu') === 'open' && innerWidth >= 1200) setMenu(true); } catch (e) {}
  if (toggle) toggle.addEventListener('click', () => {
    const open = !document.body.classList.contains('site-menu-active');
    setMenu(open);
    try { localStorage.setItem('mysbdc-menu', open ? 'open' : 'closed'); } catch (e) {}
  });

  // Close the account menu on outside click or Escape.
  const user = $('.site-user-navigation details');
  if (user) {
    document.addEventListener('click', e => { if (!user.contains(e.target)) user.open = false; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && user.open) { const inside = user.contains(document.activeElement); user.open = false; if (inside) user.querySelector('summary').focus(); } });
  }

  // Pressed-state buttons: language, filter chips, one-click training registration.
  document.addEventListener('click', e => {
    const group = e.target.closest('[data-toggle-group] button');
    if (group) {
      $$('button', group.parentElement).forEach(b => b.setAttribute('aria-pressed', String(b === group)));
      const list = $(group.parentElement.dataset.filters || '');
      if (list) $$('[data-format]', list).forEach(row => {
        const f = group.dataset.value;
        row.hidden = !(f === 'all' || row.dataset.format === f || (f === 'registered' && $('[data-register][aria-pressed=true]', row)));
      });
    }
    const reg = e.target.closest('[data-register]');
    if (reg) {
      const on = reg.getAttribute('aria-pressed') !== 'true';
      reg.setAttribute('aria-pressed', String(on));
      reg.textContent = on ? 'Registered' : 'Register';
      announce(on ? 'You are registered. We sent the details to your email.' : 'Registration cancelled.');
    }
    const view = e.target.closest('[data-show]');
    if (view) {
      e.preventDefault();
      $$('[data-view]').forEach(v => v.hidden = v.dataset.view !== view.dataset.show);
      const h = $('[data-view]:not([hidden]) h1'); if (h) { h.tabIndex = -1; h.focus(); }
    }
  });

  // Switches say their state in words, not colour alone.
  $$('.switch input').forEach(i => {
    const state = $('.state', i.parentElement);
    const paint = () => { if (state) state.textContent = i.checked ? 'On' : 'Off'; };
    i.addEventListener('change', paint); paint();
  });

  // Larger text preference (Settings).
  const large = $('#pref-large-text');
  try { if (localStorage.getItem('mysbdc-text') === 'large') document.documentElement.classList.add('text-large'); } catch (e) {}
  if (large) {
    large.checked = document.documentElement.classList.contains('text-large');
    large.dispatchEvent(new Event('change'));
    large.addEventListener('change', () => {
      document.documentElement.classList.toggle('text-large', large.checked);
      try { localStorage.setItem('mysbdc-text', large.checked ? 'large' : 'default'); } catch (e) {}
    });
  }

  // Settings: each section saves on its own and confirms in words.
  $$('form[data-save]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const saved = $('.saved', f); if (saved) { saved.hidden = false; setTimeout(() => saved.hidden = true, 4000); }
    announce('Your changes are saved.');
  }));
  const links = $$('.settings-nav a');
  if (links.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) links.forEach(a => a.getAttribute('href') === '#' + en.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    }), { rootMargin: '-20% 0px -65% 0px' });
    $$('.settings-section').forEach(s => io.observe(s));
  }

  // Sign in: email link request → confirmation view.
  const signin = $('#signin-form');
  if (signin) signin.addEventListener('submit', e => {
    e.preventDefault();
    $('#sent-to').textContent = signin.email.value;
    $$('[data-view]').forEach(v => v.hidden = v.dataset.view !== 'sent');
    const h = $('[data-view=sent] h1'); h.tabIndex = -1; h.focus();
  });

  // Intake: one question group at a time. Native validation, focus moves to the new heading.
  const intake = $('#intake-form');
  if (intake) {
    const panels = $$('.step-panel', intake), marks = $$('.steps li'), count = $('.steps .count'), whys = $$('[data-why]');
    let at = 0, ready = false;
    const show = n => {
      at = Math.max(0, Math.min(panels.length - 1, n));
      panels.forEach((p, i) => p.classList.toggle('current', i === at));
      marks.forEach((m, i) => { m.className = i < at ? 'done' : i === at ? 'current' : ''; i === at ? m.setAttribute('aria-current', 'step') : m.removeAttribute('aria-current'); });
      whys.forEach(w => w.hidden = +w.dataset.why !== at);
      const last = at >= marks.length;
      $('.steps').hidden = last; $('.why').hidden = last;
      if (count && !last) count.textContent = 'Step ' + (at + 1) + ' of ' + marks.length + ' · ' + marks[at].textContent.trim();
      if (ready) { const h = $('h1', panels[at]); h.tabIndex = -1; h.focus({ preventScroll: true }); scrollTo(0, 0); }
      ready = true;
      $$('[data-echo]', intake).forEach(el => { const src = intake.elements[el.dataset.echo]; if (src && src.value) el.textContent = src.value; });
    };
    intake.addEventListener('click', e => {
      const b = e.target.closest('[data-step]'); if (!b) return;
      e.preventDefault();
      if (b.dataset.step === 'next') {
        const bad = $$('input,select,textarea', panels[at]).find(f => !f.checkValidity());
        if (bad) { bad.reportValidity(); return; }
        show(at + 1);
      } else if (b.dataset.step === 'back') show(at - 1);
      else show(+b.dataset.step);
    });
    const gate = () => { const yes = intake.elements.inbusiness.value === 'yes'; $$('[data-if-business]').forEach(el => el.hidden = !yes); $$('[data-if-idea]').forEach(el => el.hidden = yes); };
    intake.addEventListener('change', e => { if (e.target.name === 'inbusiness') gate(); });
    gate(); show(+(new URLSearchParams(location.search).get('step') || 1) - 1);
  }

  // One polite live region for confirmations.
  function announce(text) {
    let live = $('#live'); if (!live) { live = document.createElement('div'); live.id = 'live'; live.className = 'visually-hidden'; live.setAttribute('role', 'status'); document.body.append(live); }
    live.textContent = ''; setTimeout(() => live.textContent = text, 50);
  }
})();
