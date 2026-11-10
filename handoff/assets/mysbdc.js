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
      const sel = group.parentElement.dataset.filters; const list = sel ? $(sel) : null;
      if (list) $$('[data-format]', list).forEach(row => {
        const f = group.dataset.value;
        row.hidden = !(f === 'all' || row.dataset.format === f || (f === 'registered' && $('[data-register][aria-pressed=true]', row)));
      });
    }
    if (group && group.parentElement.dataset.filter) applyFilters();
    const save = e.target.closest('[data-save]');
    if (save) {
      const on = save.getAttribute('aria-pressed') !== 'true';
      save.setAttribute('aria-pressed', String(on));
      save.querySelector('span').textContent = on ? 'Saved' : 'Save';
      applyFilters();
    }
    const only = e.target.closest('[data-saved-only]');
    if (only) { only.setAttribute('aria-pressed', String(only.getAttribute('aria-pressed') !== 'true')); applyFilters(); }
    const reg = e.target.closest('[data-register]');
    if (reg) {
      const on = reg.getAttribute('aria-pressed') !== 'true';
      // A recommended workshop can also appear in the schedule. Keep both controls in step.
      const peers = reg.dataset.registration ? $$('[data-register]').filter(b => b.dataset.registration === reg.dataset.registration) : [reg];
      peers.forEach(b => {
        b.setAttribute('aria-pressed', String(on));
        b.textContent = on ? 'Registered' : 'Register';
      });
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

  // Step forms (Form 641 and the milestone forms): one question group at a time.
  // Native validation; focus moves to the new heading. A panel with data-when="field=value" is
  // skipped unless that answer was given; a panel with data-end hides the progress and help.
  const flow = $('form[data-stepper]') || $('#intake-form');
  if (flow) {
    const panels = $$('.step-panel', flow), marks = $$('.steps li'), count = $('.steps .count'), whys = $$('[data-why]');
    const val = n => { const el = flow.elements[n]; return el ? String(el.value ?? '') : ''; };
    const open = p => { const c = p.dataset.when; if (!c) return true; const [k, v] = c.split('='); return val(k) === v; };
    const label = n => {
      const el = flow.elements[n]; if (!el) return '';
      const picked = el instanceof RadioNodeList ? [...el].find(i => i.checked) : null;
      if (picked) { const t = picked.closest('label'); return (t && $('strong', t) ? $('strong', t).textContent : picked.value).trim(); }
      return String(el.value ?? '').trim();
    };
    let at = 0, ready = false;
    const show = (n, dir = 1) => {
      n = Math.max(0, Math.min(panels.length - 1, n));
      while (!open(panels[n]) && n + dir >= 0 && n + dir < panels.length) n += dir;
      at = n;
      const panel = panels[at], mark = +(panel.dataset.mark ?? at), last = panel.hasAttribute('data-end') || mark >= marks.length;
      panels.forEach((p, i) => p.classList.toggle('current', i === at));
      marks.forEach((m, i) => { m.className = i < mark ? 'done' : i === mark ? 'current' : ''; i === mark ? m.setAttribute('aria-current', 'step') : m.removeAttribute('aria-current'); });
      whys.forEach(w => w.hidden = +w.dataset.why !== mark);
      const steps = $('.steps'), why = $('.why');
      if (steps) steps.hidden = last; if (why) why.hidden = last;
      if (count && !last) {
        const mins = (count.dataset.mins || '').split(',')[mark];
        count.textContent = 'Step ' + (mark + 1) + ' of ' + marks.length + (mins ? ' · about ' + mins + (mins === '1' ? ' minute' : ' minutes') + ' left' : count.hasAttribute('data-short') ? '' : ' · ' + marks[mark].textContent.trim());
      }
      if (ready) { const h = $('h1', panel); h.tabIndex = -1; h.focus({ preventScroll: true }); scrollTo(0, 0); }
      ready = true;
      $$('[data-echo]', flow).forEach(el => { const t = label(el.dataset.echo); if (t) el.textContent = t; });
      $$('[data-echo-list]', flow).forEach(el => { const picked = $$('input[name="' + el.dataset.echoList + '"]:checked', flow).map(i => i.value.toLowerCase()); if (picked.length) el.textContent = picked.length > 1 ? picked.slice(0, -1).join(', ') + ' and ' + picked.at(-1) : picked[0]; });
      $$('[data-show-if]', flow).forEach(el => { const [k, v] = el.dataset.showIf.split('='); el.hidden = val(k) !== v; });
    };
    flow.addEventListener('click', e => {
      const inc = e.target.closest('[data-inc]');
      if (inc) { const f = $('input', inc.closest('.stepper')); f.value = Math.max(0, (+f.value || 0) + +inc.dataset.inc); return; }
      const b = e.target.closest('[data-step]'); if (!b) return;
      e.preventDefault();
      if (b.dataset.step === 'next') {
        const bad = $$('input,select,textarea', panels[at]).find(f => !f.closest('[hidden]') && !f.checkValidity());
        if (bad) { bad.reportValidity(); return; }
        if (b.dataset.href) { location.href = b.dataset.href; return; }
        show(at + 1, 1);
      } else if (b.dataset.step === 'back') show(at - 1, -1);
      else show(+b.dataset.step, 1);
    });
    const gate = () => {
      if (flow.elements.inbusiness) { const yes = val('inbusiness') === 'yes'; $$('[data-if-business]').forEach(el => el.hidden = !yes); $$('[data-if-idea]').forEach(el => el.hidden = yes); }
      $$('[data-show-if]', flow).forEach(el => { const [k, v] = el.dataset.showIf.split('='); el.hidden = val(k) !== v; });
    };
    // "Pick up to three": once three are ticked, the rest are disabled until one is cleared.
    const limit = () => $$('[data-max]', flow).forEach(g => { const boxes = $$('input[type=checkbox]', g), full = boxes.filter(b => b.checked).length >= +g.dataset.max; boxes.forEach(b => b.disabled = full && !b.checked); });
    flow.addEventListener('change', () => { gate(); limit(); });
    limit();
    gate(); show(+(new URLSearchParams(location.search).get('step') || 1) - 1);
  }

  // Congratulations page: a line that fits the milestone, and a burst of confetti (skipped for reduced motion).
  const cheer = $('[data-congrats]');
  if (cheer) {
    const lines = { hired: 'New hires are a big step.', sales: 'Growing sales is hard-won.', funding: 'New funding opens doors.', started: 'Opening your doors is a big day.' };
    const t = new URLSearchParams(location.search).get('type'); if (lines[t]) cheer.textContent = lines[t];
  }
  const field = $('[data-confetti]');
  if (field) {
    const colors = ['#1B5FAF', '#8FC5D9', '#C23C3C', '#00675C', '#F0C75E', '#0F1C2D'], still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frac = x => x - Math.floor(x);
    for (let i = 0; i < 64; i++) {
      const a = frac(Math.sin(i * 12.9898) * 43758.5453), b = frac(Math.sin(i * 78.233) * 12543.123), c = frac(Math.sin(i * 39.425) * 9871.77), k = i % 3, el = document.createElement('i');
      el.style.cssText = `left:${Math.round(a * 100)}%;top:${Math.round(b * b * 170)}px;width:${[10, 7, 16][k]}px;height:${[10, 18, 6][k]}px;border-radius:${k ? '2px' : '50%'};background:${colors[i % 6]};transform:rotate(${Math.round(c * 300 - 150)}deg);animation-delay:${(c * .5).toFixed(2)}s` + (still ? ';animation:none' : '');
      field.append(el);
    }
  }

  // One polite live region for confirmations.
  // Training and Resources filters. Each [data-filter="topic"] group filters [data-item] by data-topic, and so on.
  function applyFilters() {
    const want = {};
    $$('[data-filter]').forEach(g => { const on = $('[aria-pressed=true]', g); want[g.dataset.filter] = on ? on.dataset.value : 'all'; });
    const only = $('[data-saved-only]');
    const savedOnly = only && only.getAttribute('aria-pressed') === 'true';
    const plural = (n, el) => n + ' ' + el.dataset.noun + (n === 1 ? '' : 's');
    let shown = 0;
    $$('[data-item]').forEach(item => {
      const ok = Object.entries(want).every(([k, v]) => v === 'all' || item.dataset[k] === v) && (!savedOnly || $('[data-save][aria-pressed=true]', item));
      item.hidden = !ok; if (ok) shown++;
    });
    $$('[data-group]').forEach(g => {
      const n = $$('[data-item]:not([hidden])', g).length;
      g.hidden = !n; const c = $('[data-group-count]', g); if (c) c.textContent = plural(n, c);
    });
    const count = $('[data-count]'); if (count) count.textContent = plural(shown, count);
    const sc = $('[data-saved-count]'); if (sc) sc.textContent = $$('[data-save][aria-pressed=true]', $('.res-grid') || document).length;
    const empty = $('[data-empty]'); if (empty) empty.hidden = shown > 0;
  }

  function announce(text) {
    let live = $('#live'); if (!live) { live = document.createElement('div'); live.id = 'live'; live.className = 'visually-hidden'; live.setAttribute('role', 'status'); document.body.append(live); }
    live.textContent = ''; setTimeout(() => live.textContent = text, 50);
  }
})();
