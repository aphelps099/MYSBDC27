/* Success Atlas — the public map of shared milestones. No framework, no dependencies, no network requests.
   Reads window.MYSBDC_ATLAS_DATA (atlas-data.js). For design review it also reads milestones shared
   from the MySBDC dashboard preview (../handoff) in this browser, kept under `mysbdc-atlas-v1`, so a
   milestone can be seen arriving. Design logic and the production data contract are in ATLAS.md. */
(function () {
  const D = window.MYSBDC_ATLAS_DATA, root = document.querySelector('[data-atlas]');
  if (!D || !root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KEY = 'mysbdc-atlas-v1';
  const TYPES = D.types; // ['hired','started','funding','sales'] — the index is the mark class t0…t3
  const META = {
    hired:   { feed: 'New hires',    money: false },
    started: { feed: 'New business', money: false },
    funding: { feed: 'New funding',  money: true },
    sales:   { feed: 'Sales growth', money: true },
  };
  const num = n => Math.round(n).toLocaleString('en-US');
  const plural = (n, one) => num(n) + ' ' + one + (n === 1 ? '' : 's');
  function money(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + 'M';
    if (n >= 1e4) return '$' + Math.round(n / 1e3).toLocaleString('en-US') + 'K';
    return '$' + num(n);
  }
  const fmt = (type, n) => META[type].money ? money(n) : num(n);

  // ── Data ──
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const dateOf = age => new Date(today.getTime() - age * 864e5);
  const monthStart = new Date(today.getFullYear(), today.getMonth() - 11, 1);
  const monthOf = d => Math.max(0, Math.min(11, (d.getFullYear() - monthStart.getFullYear()) * 12 + d.getMonth() - monthStart.getMonth()));
  const monthName = m => new Date(monthStart.getFullYear(), monthStart.getMonth() + m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  // Age (in days) of the last day of month m: a milestone shows "through" that month when it is at least this old.
  const monthCut = m => m >= 11 ? 0 : Math.max(0, Math.ceil((today - new Date(monthStart.getFullYear(), monthStart.getMonth() + m + 1, 0, 12)) / 864e5));

  const pins = [];
  for (let i = 0; i < D.pins.length; i += 6) {
    const town = D.towns[D.pins[i + 4]];
    pins.push({ x: D.pins[i], y: D.pins[i + 1], t: D.pins[i + 2], age: D.pins[i + 3], town: town[0], county: town[1], v: D.pins[i + 5], month: monthOf(dateOf(D.pins[i + 3])), on: true, dim: false });
  }
  // Featured marks. Success stories first, then testimonies, so the cards read as two even rows.
  const stories = (D.stories || []).slice().sort((a, b) => (a.kind === 'story' ? 0 : 1) - (b.kind === 'story' ? 0 : 1));

  // ── Design preview: milestones shared from the dashboard preview in this browser ──
  const readMine = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      return saved && saved.version === 1 && Array.isArray(saved.items) ? saved.items.filter(i => TYPES.includes(i.type)) : [];
    } catch (e) { return []; }
  };
  const writeMine = items => { try { localStorage.setItem(KEY, JSON.stringify({ version: 1, items })); } catch (e) {} };
  let mine = readMine();
  const mineSpot = item => D.home.slots[mine.indexOf(item) % D.home.slots.length];
  const counted = () => mine.filter(i => i.share !== 'private' && i.status === 'confirmed');

  // ── State ──
  const state = { county: null, type: 'all', cut: 0, playing: false, story: null };
  const [VW, VH] = D.view, PAD = 24, FULL = [-PAD, -PAD, VW + PAD * 2, VH + PAD * 2];
  let view = FULL.slice(), viewAnim = 0;

  // ── Build the map ──
  const svg = $('[data-atlas-svg]'), stage = $('[data-atlas-stage]'), tip = $('[data-atlas-tip]'), pop = $('[data-atlas-pop]');
  const gCounties = $('[data-atlas-counties]'), gPins = $('[data-atlas-pins]'), gPlaces = $('[data-atlas-places]'), gMine = $('[data-atlas-mine]'), gStories = $('[data-atlas-story-pins]');
  const dot = (x, y, cls) => svgEl('path', { d: `M${x} ${y}h.01`, class: cls });
  D.counties.forEach((c, i) => {
    const path = svgEl('path', { d: c.d, class: 'atlas-county' });
    path.dataset.county = i;
    gCounties.append(path); c.el = path;
  });
  D.labels.forEach(([label, x, y, anchor]) => { const t = svgEl('text', { x, y, 'text-anchor': anchor }); t.textContent = label; if (label === D.home.town) t.setAttribute('class', 'home'); gPlaces.append(t); });
  const frag = document.createDocumentFragment();
  pins.forEach(p => { p.el = dot(p.x, p.y, 'atlas-pin t' + p.t); frag.append(p.el); });
  gPins.append(frag);

  const select = $('[data-atlas-county]');
  D.counties.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c.n + ' County'; select.append(o); });

  // ── Geometry helpers ──
  const scaleNow = () => { const r = stage.getBoundingClientRect(); return Math.max(view[2] / r.width, view[3] / r.height); }; // SVG units per screen pixel
  const toStage = (x, y) => { const m = svg.getScreenCTM(), r = stage.getBoundingClientRect(); if (!m) return [0, 0]; const p = new DOMPoint(x, y).matrixTransform(m); return [p.x - r.left, p.y - r.top]; };
  const applyView = () => {
    svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' '));
    const u = scaleNow();
    svg.style.setProperty('--u', u.toFixed(4));
    $$('text', gMine).forEach(t => { t.setAttribute('x', +t.dataset.x + 14 * u); t.setAttribute('y', +t.dataset.y + 4.5 * u); });
    placePop();
  };
  const zoomTo = target => {
    cancelAnimationFrame(viewAnim);
    if (still) { view = target.slice(); applyView(); return; }
    const from = view.slice(), t0 = performance.now(), dur = 650;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      view = from.map((v, i) => v + (target[i] - v) * e);
      applyView();
      if (p < 1) viewAnim = requestAnimationFrame(tick);
    };
    viewAnim = requestAnimationFrame(tick);
  };
  const countyBox = i => {
    const [x0, y0, x1, y1] = D.counties[i].b, r = stage.getBoundingClientRect(), aspect = r.width / r.height;
    let w = Math.max(150, (x1 - x0) * 1.3), h = Math.max(150, (y1 - y0) * 1.3);
    if (w / h > aspect) h = w / aspect; else w = h * aspect;
    return [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
  };

  // ── Totals for whatever is in view (county + period). The type filter never changes the totals. ──
  const inPeriod = p => p.age >= state.cut;
  const tally = county => {
    const out = { n: 0 }; TYPES.forEach(t => out[t] = { n: 0, sum: 0 });
    pins.forEach(p => { if (inPeriod(p) && (county == null || p.county === county)) { const t = out[TYPES[p.t]]; t.n++; t.sum += p.v; out.n++; } });
    if (state.cut === 0) counted().forEach(i => { if (county == null || county === D.home.county) { const t = out[i.type]; t.n++; t.sum += i.type === 'started' ? 1 : +i.amount || 0; out.n++; } });
    return out;
  };

  const shown = {}; // last rendered number per total, for the count-up
  const setTotal = (type, value, animate) => {
    const node = $(`[data-atlas-total="${type}"]`), from = shown[type] ?? 0;
    cancelAnimationFrame(node._raf);
    if (!animate || still || from === value) { node.textContent = fmt(type, value); shown[type] = value; return; }
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / 700), v = from + (value - from) * (1 - Math.pow(1 - p, 3));
      node.textContent = fmt(type, v); shown[type] = v;
      if (p < 1) node._raf = requestAnimationFrame(tick); else shown[type] = value;
    };
    node._raf = requestAnimationFrame(tick);
  };

  const when = age => age <= 0 ? 'Today' : age === 1 ? 'Yesterday' : age < 14 ? age + ' days ago' : dateOf(age).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const swatch = type => { const i = el('i', 'atlas-swatch'); i.style.setProperty('--c', `var(--atlas-${type})`); return i; };
  const place = p => p.town + ', ' + D.counties[p.county].n + ' County';

  const render = (animate = true) => {
    const county = state.county, t = tally(county);
    // Marks
    pins.forEach(p => {
      const on = inPeriod(p) && (state.type === 'all' || TYPES[p.t] === state.type), dim = county != null && p.county !== county;
      if (on !== p.on) { p.on = on; p.el.classList.toggle('off', !on); }
      if (dim !== p.dim) { p.dim = dim; p.el.classList.toggle('dim', dim); }
    });
    // Totals (also the legend and the filter)
    TYPES.forEach(type => setTotal(type, type === 'started' ? t[type].n : t[type].sum, animate));
    $('.atlas-totals').classList.toggle('solo', state.type !== 'all');
    $$('[data-atlas-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.atlasType === state.type)));
    // Scope
    const c = county == null ? null : D.counties[county];
    $('[data-atlas-scope-sub]').textContent = plural(t.n, 'milestone') + (c ? ' · ' + c.c : ' · ' + D.counties.length + ' counties');
    $('[data-atlas-svg-title]').textContent = `Map of ${num(t.n)} milestones shared ${c ? 'in ' + c.n + ' County' : 'across Northern California'}. The same numbers are in the totals and the county table.`;
    svg.classList.toggle('atlas-scoped', !!c);
    D.counties.forEach((k, i) => k.el.classList.toggle('on', i === county));
    $$('.atlas-story', gStories).forEach((g, i) => g.classList.toggle('far', county != null && stories[i].county !== county));
    select.value = county == null ? '' : county;
    // Latest: three quiet lines
    const feed = $('[data-atlas-feed]'); feed.textContent = '';
    const rows = [];
    if (state.cut === 0 && (county == null || county === D.home.county)) counted().filter(i => state.type === 'all' || i.type === state.type).reverse()
      .forEach(i => rows.push({ type: i.type, where: D.home.town + ', ' + D.counties[D.home.county].n + ' County', when: 'Just now', fresh: true }));
    for (let i = pins.length - 1; i >= 0 && rows.length < 3; i--) { const p = pins[i]; if (p.on && !p.dim) rows.push({ type: TYPES[p.t], where: place(p), when: when(p.age) }); }
    rows.slice(0, 3).forEach(r => {
      const li = el('li', r.fresh ? 'fresh' : ''), what = el('span', 'what');
      what.append(el('strong', '', META[r.type].feed), ' · ' + r.where);
      li.append(swatch(r.type), what, el('span', 'when', r.when)); feed.append(li);
    });
    $('[data-atlas-empty]').hidden = rows.length > 0;
    // Months
    const counts = Array(12).fill(0);
    pins.forEach(p => { if ((county == null || p.county === county) && (state.type === 'all' || TYPES[p.t] === state.type)) counts[p.month]++; });
    const max = Math.max(1, ...counts), through = throughMonth();
    $$('[data-atlas-months] button').forEach((b, m) => {
      b.firstElementChild.style.setProperty('--h', Math.max(8, Math.round(counts[m] / max * 100)) + '%');
      b.classList.toggle('later', m > through);
      b.setAttribute('aria-pressed', String(m === through && state.cut > 0));
      b.setAttribute('aria-label', `Through ${monthName(m)}: ${plural(counts[m], 'milestone')} that month`);
    });
    if (!state.playing) $('[data-atlas-through]').textContent = state.cut === 0 ? 'The last 12 months' : 'Through ' + monthName(through);
    renderTable();
  };
  function throughMonth() { for (let m = 0; m < 12; m++) if (monthCut(m) <= state.cut) return m; return 11; }

  function renderTable() {
    const body = $('[data-atlas-rows]'); if (!body.closest('details').open) return;
    body.textContent = '';
    D.counties.map((c, i) => [c, tally(i)]).sort((a, b) => b[1].n - a[1].n).forEach(([c, t]) => {
      const tr = document.createElement('tr'), th = el('th', '', c.n); th.scope = 'row'; tr.append(th);
      [c.c, num(t.n), money(t.funding.sum), num(t.started.n), num(t.hired.sum), money(t.sales.sum)].forEach((v, i) => tr.append(el('td', i ? 'num' : '', v)));
      body.append(tr);
    });
  }
  $('details.atlas-table').addEventListener('toggle', renderTable);

  // ── Scope: one county, or everything ──
  const setCounty = i => {
    state.county = i;
    zoomTo(i == null ? FULL : countyBox(i));
    hideTip(); render();
  };
  select.addEventListener('change', () => { closeStory(); setCounty(select.value === '' ? null : +select.value); });

  // ── Pointer: counties select; inside a county, the nearest mark explains itself ──
  const toMap = e => { const m = svg.getScreenCTM(); if (!m) return null; const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return [p.x, p.y]; };
  const nearest = (x, y, reach) => {
    let best = null, d = reach * reach;
    for (let i = pins.length - 1; i >= 0; i--) { const p = pins[i]; if (!p.on || p.dim) continue; const q = (p.x - x) ** 2 + (p.y - y) ** 2; if (q < d) { d = q; best = p; } }
    return best;
  };
  function hideTip() { tip.hidden = true; }
  const showTip = (strong, text, e) => {
    const r = stage.getBoundingClientRect();
    tip.textContent = ''; tip.append(el('strong', '', strong), text);
    tip.style.left = Math.max(120, Math.min(r.width - 120, e.clientX - r.left)) + 'px';
    tip.style.top = Math.max(70, e.clientY - r.top) + 'px';
    tip.hidden = false;
  };
  svg.addEventListener('pointermove', e => {
    const s = e.target.closest('.atlas-story');
    if (s) { const st = stories[+s.dataset.story]; showTip(st.kind === 'story' ? st.name : 'In their words', st.kind === 'story' ? st.meta : D.counties[st.county].n + ' County', e); return; }
    const at = toMap(e); if (!at) return;
    const p = nearest(at[0], at[1], 9 * scaleNow());
    p ? showTip(META[TYPES[p.t]].feed, place(p) + ' · ' + when(p.age), e) : hideTip();
  });
  svg.addEventListener('pointerleave', hideTip);
  svg.addEventListener('click', e => {
    const s = e.target.closest('.atlas-story');
    if (s) { hideTip(); const i = +s.dataset.story; state.story === i ? closeStory() : openStory(i); return; }
    closeStory();
    const county = e.target.closest('.atlas-county');
    if (!county) { if (state.county != null) setCounty(null); return; }
    const i = +county.dataset.county;
    if (state.county === i) { const at = toMap(e), p = at && nearest(at[0], at[1], 14 * scaleNow()); if (p) { showTip(META[TYPES[p.t]].feed, place(p) + ' · ' + when(p.age), e); return; } }
    setCounty(state.county === i ? null : i);
  });

  // ── Type filter: the four totals. Choose one to isolate it; choose it again for all four. ──
  $$('[data-atlas-type]').forEach(b => b.addEventListener('click', () => {
    state.type = state.type === b.dataset.atlasType ? 'all' : b.dataset.atlasType;
    render(false);
    announce(state.type === 'all' ? 'Showing every kind of milestone.' : `Showing only ${META[state.type].feed.toLowerCase()} on the map.`);
  }));

  // ── Time: months and Play ──
  const months = $('[data-atlas-months]'), playBtn = $('[data-atlas-play]'), playLabel = $('[data-atlas-play-label]');
  for (let m = 0; m < 12; m++) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.title = monthName(m); b.append(document.createElement('i')); li.append(b); months.append(li);
    b.addEventListener('click', () => { stop(); state.cut = m === throughMonth() && state.cut > 0 ? 0 : monthCut(m); render(); });
  }
  let playRaf = 0, playTimer = 0;
  function stop() {
    cancelAnimationFrame(playRaf); clearInterval(playTimer);
    if (!state.playing) return;
    state.playing = false; playBtn.setAttribute('aria-pressed', 'false'); playLabel.textContent = state.cut === 0 ? 'Play the year' : 'Continue';
  }
  const play = () => {
    const oldest = pins[0].age;
    closeStory();
    if (state.cut === 0) state.cut = oldest;
    state.playing = true; playBtn.setAttribute('aria-pressed', 'true'); playLabel.textContent = 'Pause';
    const through = $('[data-atlas-through]');
    const frame = () => { render(false); through.textContent = state.cut === 0 ? 'The last 12 months' : dateOf(state.cut).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); };
    if (still) { // Step month by month instead of a continuous sweep.
      let m = throughMonth();
      playTimer = setInterval(() => { m++; state.cut = m >= 11 ? 0 : monthCut(m); frame(); if (state.cut === 0) { stop(); render(false); } }, 900);
      frame(); return;
    }
    const from = state.cut, t0 = performance.now(), dur = 11000 * (from / oldest);
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      state.cut = Math.round(from * (1 - p)); frame();
      if (p < 1) playRaf = requestAnimationFrame(tick); else { stop(); render(false); announce('The last 12 months are on the map.'); }
    };
    playRaf = requestAnimationFrame(tick);
  };
  playBtn.addEventListener('click', () => state.playing ? (stop(), render(false)) : play());

  // ── Featured marks: a few success stories and testimonies. Ringed on the map, cards below it. ──
  const cards = $('[data-atlas-cards]');
  const by = s => s.kind === 'story' ? s.name + ' · ' + s.meta : (/^[AEIOU]/.test(D.counties[s.county].n) ? 'An ' : 'A ') + D.counties[s.county].n + ' County business owner';
  const kindLabel = s => s.kind === 'story' ? 'Success story' : 'In their words';
  stories.forEach((s, i) => {
    // The mark: a ring around a centre, larger than a milestone and reachable by keyboard.
    const g = svgEl('g', { class: 'atlas-story', tabindex: '0', role: 'button', 'aria-expanded': 'false', 'aria-label': `${kindLabel(s)}: ${s.kind === 'story' ? s.name + ', ' + s.meta : D.counties[s.county].n + ' County'}` });
    g.dataset.story = i;
    g.append(dot(s.x, s.y, 'hit'), dot(s.x, s.y, 'glow'), dot(s.x, s.y, 'ring'), dot(s.x, s.y, 'gap'), dot(s.x, s.y, 'core'));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); state.story === i ? closeStory(true) : openStory(i, true); } });
    gStories.append(g); s.el = g;
    // The card.
    const li = el('li', 'atlas-card is-' + s.kind), body = el('div', 'atlas-card-body');
    li.dataset.story = i;
    if (s.kind === 'story') {
      const img = document.createElement('img');
      img.src = s.img; img.alt = s.alt; img.loading = 'lazy'; img.style.objectPosition = s.pos || '50% 50%';
      const fig = el('div', 'atlas-card-photo'); fig.append(img); li.append(fig);
      body.append(el('p', 'atlas-pill', kindLabel(s)), el('h3', '', s.title), el('p', 'atlas-card-by', by(s)));
    } else {
      body.append(el('p', 'atlas-pill', kindLabel(s)), el('blockquote', '', '“' + s.title + '”'), el('p', 'atlas-card-by', by(s)));
    }
    const actions = el('div', 'atlas-card-actions'), find = el('button', 'atlas-link', 'Show on the map');
    find.type = 'button';
    find.addEventListener('click', () => { stage.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' }); openStory(i); s.el.focus({ preventScroll: true }); });
    if (s.kind === 'story') { const a = el('a', 'atlas-link', 'Read story'); a.href = s.href; a.target = '_blank'; a.rel = 'noopener'; a.setAttribute('aria-label', 'Read the ' + s.name + ' story'); actions.append(a); }
    actions.append(find); body.append(actions); li.append(body); cards.append(li);
    const lit = on => s.el.classList.toggle('lit', on);
    li.addEventListener('pointerenter', () => lit(true)); li.addEventListener('pointerleave', () => lit(false));
    li.addEventListener('focusin', () => lit(true)); li.addEventListener('focusout', () => lit(false));
  });
  function placePop() {
    if (state.story == null) return;
    const s = stories[state.story], [px, py] = toStage(s.x, s.y), r = stage.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    const left = px + 22 + w <= r.width - 4 ? px + 22 : px - 22 - w;
    pop.style.left = Math.max(4, Math.min(r.width - w - 12, left)) + 'px';
    pop.style.top = Math.max(4, Math.min(r.height - h - 12, py - h / 2)) + 'px';
  }
  function openStory(i, focus) {
    const s = stories[i], link = $('[data-atlas-pop-link]');
    stories.forEach((k, n) => { k.el.classList.toggle('open', n === i); k.el.setAttribute('aria-expanded', String(n === i)); });
    state.story = i;
    $('[data-atlas-pop-kind]').textContent = kindLabel(s);
    $('[data-atlas-pop-title]').textContent = s.kind === 'story' ? s.title : '“' + s.title + '”';
    $('[data-atlas-pop-by]').textContent = by(s);
    link.hidden = s.kind !== 'story'; if (s.kind === 'story') { link.href = s.href; link.setAttribute('aria-label', 'Read the ' + s.name + ' story'); }
    const photo = $('[data-atlas-pop-photo]'), img = $('[data-atlas-pop-img]');
    photo.hidden = s.kind !== 'story'; if (s.kind === 'story') { img.src = s.img; img.alt = s.alt; img.style.objectPosition = s.pos || '50% 50%'; }
    pop.className = 'atlas-pop is-' + s.kind; pop.hidden = false; placePop();
    $$('.atlas-card', cards).forEach((c, n) => c.classList.toggle('current', n === i));
    if (focus) $('[data-atlas-pop-title]').focus({ preventScroll: true });
  }
  function closeStory(focusBack) {
    if (state.story == null) return;
    const s = stories[state.story]; s.el.classList.remove('open'); s.el.setAttribute('aria-expanded', 'false');
    state.story = null; pop.hidden = true;
    $$('.atlas-card.current', cards).forEach(c => c.classList.remove('current'));
    if (focusBack) s.el.focus({ preventScroll: true });
  }
  $('[data-atlas-pop-close]').addEventListener('click', () => closeStory(true));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (state.story != null) closeStory(pop.contains(document.activeElement) || gStories.contains(document.activeElement));
    else if (state.county != null && !document.fullscreenElement) setCounty(null);
  });

  // ── Preview milestones: a mark on the map, and one clearly labelled strip that stands in for the advisor ──
  const strip = $('[data-atlas-preview]'), stripText = $('[data-atlas-preview-text]'), confirmBtn = $('[data-atlas-confirm]');
  const renderMine = () => {
    gMine.textContent = '';
    const visible = mine.filter(i => i.share !== 'private'), waiting = visible.filter(i => i.status !== 'confirmed');
    visible.forEach(item => {
      const [x, y] = mineSpot(item), g = svgEl('g', { class: item.status === 'confirmed' ? 'confirmed' : 'pending' });
      g.dataset.id = item.id; g.style.setProperty('--c', `var(--atlas-${item.type})`);
      g.append(dot(x, y, 'halo'), dot(x, y, 'ripple'), dot(x, y, 'ring'), dot(x, y, 'core'));
      gMine.append(g);
    });
    if (visible.length) { // One "New" label, beside the newest mark.
      const [x, y] = mineSpot(visible[visible.length - 1]), t = svgEl('text'); t.dataset.x = x; t.dataset.y = y; t.textContent = 'New';
      gMine.append(t);
    }
    svg.classList.toggle('atlas-has-mine', visible.length > 0);
    strip.hidden = !mine.length;
    confirmBtn.hidden = !waiting.length;
    const kinds = list => list.map(i => META[i.type].feed.toLowerCase()).join(', '), town = D.home.town;
    stripText.textContent = waiting.length
      ? `${waiting.length === 1 ? 'A milestone was' : waiting.length + ' milestones were'} just shared from the MySBDC dashboard in this browser: ${kinds(waiting)}, ${town}. On the live site a milestone appears here once its advisor confirms it.`
      : visible.length ? `${plural(visible.length, 'confirmed milestone')} from the MySBDC dashboard in this browser ${visible.length === 1 ? 'is' : 'are'} on the map: ${kinds(visible)}, ${town}.`
      : 'The milestone shared from the MySBDC dashboard in this browser was kept off the map, as its owner chose.';
    applyView();
  };
  const ripple = item => {
    const g = $$('g', gMine).find(n => n.dataset.id === item.id), r = g && $('.ripple', g);
    if (r && !still && r.animate) r.animate([{ strokeWidth: '12px', strokeOpacity: .4 }, { strokeWidth: '120px', strokeOpacity: 0 }], { duration: 1500, iterations: 3, easing: 'cubic-bezier(.2,.7,.2,1)' });
  };
  const locate = item => {
    stop(); closeStory(); state.cut = 0; state.type = 'all'; state.county = D.home.county;
    zoomTo(countyBox(D.home.county)); render();
    if (!document.body.classList.contains('atlas-present')) stage.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
    setTimeout(() => ripple(item), still ? 0 : 500);
  };
  confirmBtn.addEventListener('click', () => {
    const waiting = mine.filter(i => i.share !== 'private' && i.status !== 'confirmed'); if (!waiting.length) return;
    waiting.forEach(i => i.status = 'confirmed'); writeMine(mine);
    renderMine(); render(true); waiting.forEach(ripple);
    announce('Confirmed. The milestone now counts in the totals.');
  });
  $('[data-atlas-clear]').addEventListener('click', () => { mine = []; writeMine(mine); renderMine(); render(); announce('Preview milestones cleared.'); });

  // Live: a milestone shared in another tab or window of this browser lands here without a reload.
  addEventListener('storage', e => {
    if (e.key !== KEY) return;
    const before = new Set(mine.map(i => i.id)); mine = readMine();
    const added = mine.filter(i => !before.has(i.id) && i.share !== 'private');
    renderMine(); render(true);
    if (added.length) { announce('A new milestone was just shared from ' + D.home.town + '.'); locate(added[added.length - 1]); }
  });

  // ── Presenting: the site steps away; the stories take turns on the map ──
  const presentBtn = $('[data-atlas-present]');
  let tour = 0;
  const present = on => {
    document.body.classList.toggle('atlas-present', on);
    presentBtn.setAttribute('aria-pressed', String(on));
    if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    clearInterval(tour); closeStory();
    if (on && !still && stories.length) { // A slow tour of the featured marks. Any pointer or key press ends it.
      let n = -1;
      tour = setInterval(() => { if (state.playing || state.county != null) return; n = (n + 1) % stories.length; openStory(n); }, 7000);
      const end = () => { clearInterval(tour); removeEventListener('pointerdown', end); removeEventListener('keydown', end); };
      addEventListener('pointerdown', end); addEventListener('keydown', end);
    }
    requestAnimationFrame(() => { view = state.county == null ? FULL.slice() : countyBox(state.county); applyView(); });
  };
  presentBtn.addEventListener('click', () => present(true));
  $('[data-atlas-present-exit]').addEventListener('click', () => { present(false); presentBtn.focus(); });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('atlas-present')) present(false); });
  addEventListener('resize', () => { if (state.county != null) view = countyBox(state.county); applyView(); });

  function announce(text) {
    let live = $('#live'); if (!live) { live = el('div', 'visually-hidden'); live.id = 'live'; live.setAttribute('role', 'status'); document.body.append(live); }
    live.textContent = ''; setTimeout(() => live.textContent = text, 50);
  }

  // ── Go ──
  const params = new URLSearchParams(location.search);
  if (params.has('reset')) { mine = []; writeMine(mine); }
  renderMine(); render(false); applyView();
  if (params.has('present')) present(true);
  const newest = mine.filter(i => i.share !== 'private').pop();
  if (newest && params.has('new')) setTimeout(() => locate(newest), 700);
})();
