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
  const svgEl = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);

  const KEY = 'mysbdc-atlas-v1';
  const TYPES = D.types; // ['hired','started','funding','sales'] — the index is the mark class t0…t3
  const META = {
    hired:   { feed: 'New hires',    money: false },
    started: { feed: 'New business', money: false },
    funding: { feed: 'New funding',  money: true },
    sales:   { feed: 'Sales growth', money: true },
  };
  const PLACES = ['Eureka', 'Redding', 'Sacramento', 'San Francisco', 'San Jose']; // the few names kept on the map
  const num = n => Math.round(n).toLocaleString('en-US');
  const plural = (n, one) => num(n) + ' ' + one + (n === 1 ? '' : 's');
  function money(n) {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(n >= 1e8 ? 0 : 1).replace(/\.0$/, '') + 'M';
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
    pins.push({ x: D.pins[i], y: D.pins[i + 1], t: D.pins[i + 2], age: D.pins[i + 3], town: town[0], county: town[1], major: !!town[4], v: D.pins[i + 5], month: monthOf(dateOf(D.pins[i + 3])), on: true, dim: false });
  }
  // Featured marks: success stories first, then testimonies.
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
  const state = { county: null, type: 'all', cut: 0, playing: false, story: null, pinned: false };
  const [VW, VH] = D.view, PAD = 24, REGION = [-PAD, -PAD, VW + PAD * 2, VH + PAD * 2];
  let view = REGION.slice(), viewAnim = 0;

  // ── Build the map ──
  const svg = $('[data-atlas-svg]'), stage = $('[data-atlas-stage]'), tip = $('[data-atlas-tip]'), pop = $('[data-atlas-pop]');
  const gContext = $('[data-atlas-context]'), gCounties = $('[data-atlas-counties]'), gPins = $('[data-atlas-pins]'), gPlaces = $('[data-atlas-places]'), gMine = $('[data-atlas-mine]'), gStories = $('[data-atlas-story-pins]');
  const dot = (x, y, cls) => svgEl('path', { d: `M${x} ${y}h.01`, class: cls });
  // The surroundings: sea is the field itself; then two pale bands along every shore, the neighbouring land,
  // the state lines and a few atlas labels. Context only: nothing here is interactive.
  if (D.context) {
    const land = D.context.land + D.counties.map(c => c.d).join('');
    gContext.append(svgEl('path', { d: land, class: 'atlas-shore outer' }), svgEl('path', { d: land, class: 'atlas-shore inner' }), svgEl('path', { d: land, class: 'atlas-shore line' }),
      svgEl('path', { d: D.context.land, class: 'atlas-context-land' }), svgEl('path', { d: D.context.lines, class: 'atlas-context-lines' }));
    D.context.labels.forEach(([text, x, y, kind, anchor]) => { const t = svgEl('text', { x, y, class: 'atlas-geo ' + kind, 'text-anchor': anchor || 'start' }); t.textContent = text; gContext.append(t); });
  }
  D.counties.forEach((c, i) => {
    const path = svgEl('path', { d: c.d, class: 'atlas-county' });
    path.dataset.county = i;
    gCounties.append(path); c.el = path;
  });
  D.labels.filter(l => PLACES.includes(l[0])).forEach(([label, x, y, anchor]) => { const t = svgEl('text', { x, y, 'text-anchor': anchor }); t.textContent = label; if (label === D.home.town) t.setAttribute('class', 'home'); gPlaces.append(t); });
  const frag = document.createDocumentFragment();
  pins.forEach(p => { p.el = dot(p.x, p.y, 'atlas-pin t' + p.t); frag.append(p.el); });
  gPins.append(frag);

  const select = $('[data-atlas-county]');
  D.counties.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c.n + ' County'; select.append(o); });

  // ── Geometry helpers ──
  const scaleNow = () => view[2] / (svg.getBoundingClientRect().width || 1); // SVG units per screen pixel
  // The SVG fills the whole field. `frame` returns the view that fits a box of map units inside the stage
  // (the clear area between the controls) and lets the surroundings run out to the field's edges.
  const frame = box => {
    const st = stage.getBoundingClientRect(), sv = svg.getBoundingClientRect(); if (!st.width || !sv.width) return box.slice();
    const k = Math.max(box[2] / st.width, box[3] / st.height), cx = box[0] + box[2] / 2, cy = box[1] + box[3] / 2;
    return [cx - k * (st.left + st.width / 2 - sv.left), cy - k * (st.top + st.height / 2 - sv.top), k * sv.width, k * sv.height];
  };
  const toStage = (x, y) => { const m = svg.getScreenCTM(), r = stage.getBoundingClientRect(); if (!m) return [0, 0]; const p = new DOMPoint(x, y).matrixTransform(m); return [p.x - r.left, p.y - r.top]; };
  const applyView = () => {
    svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' '));
    const u = scaleNow();
    svg.style.setProperty('--u', u.toFixed(4));
    // Scale bar: the longest round distance that fits in about 110 pixels at this zoom.
    const perMile = 1 / (u * (D.miles || .3417)), miles = [250, 100, 50, 25, 10, 5, 2, 1].find(m => m * perMile <= 112) || 1;
    $('[data-atlas-scale-bar]').style.width = (miles * perMile).toFixed(1) + 'px';
    $('[data-atlas-scale-label]').textContent = miles + ' mi';
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
    const [x0, y0, x1, y1] = D.counties[i].b, w = Math.max(150, (x1 - x0) * 1.3), h = Math.max(150, (y1 - y0) * 1.3);
    return frame([(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h]);
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
  const place = p => p.town + ', ' + D.counties[p.county].n + ' County';

  // ── Latest: one quiet line that takes turns through the most recent milestones in view ──
  const latestLine = $('[data-atlas-latest]');
  let latest = [], latestAt = 0, latestTimer = 0;
  const showLatest = animate => {
    latestLine.textContent = '';
    const r = latest[latestAt % (latest.length || 1)];
    if (!r) { latestLine.textContent = 'Nothing shared here yet in this period.'; return; }
    const sw = el('i', 'atlas-swatch'); sw.style.setProperty('--c', `var(--atlas-${r.type})`);
    latestLine.append(sw, el('strong', '', META[r.type].feed), ' · ' + r.where + ' · ' + r.when);
    if (animate && !still && latestLine.animate) latestLine.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: 'cubic-bezier(.2,.7,.3,1)' });
  };
  const setLatest = () => {
    const county = state.county, rows = [];
    if (state.cut === 0 && (county == null || county === D.home.county)) counted().filter(i => state.type === 'all' || i.type === state.type).reverse()
      .forEach(i => rows.push({ type: i.type, where: D.home.town + ', ' + D.counties[D.home.county].n + ' County', when: 'Just now' }));
    // Across the region, favour towns a visitor will recognise; inside a county, take whatever is newest.
    for (const majorOnly of county == null ? [true, false] : [false]) {
      for (let i = pins.length - 1; i >= 0 && rows.length < 5; i--) { const p = pins[i]; if (p.on && !p.dim && (!majorOnly || p.major) && !rows.some(r => r.pin === p)) rows.push({ pin: p, type: TYPES[p.t], where: place(p), when: when(p.age) }); }
      if (rows.length >= 3) break;
    }
    const same = rows.length === latest.length && rows.every((r, i) => r.where === latest[i].where && r.type === latest[i].type && r.when === latest[i].when);
    if (same) return;
    latest = rows; latestAt = 0; showLatest(false);
  };
  if (!still) latestTimer = setInterval(() => { if (latest.length > 1 && !state.playing && !document.hidden) { latestAt++; showLatest(true); } }, 4200);

  const render = (animate = true) => {
    const county = state.county, t = tally(county);
    // Marks
    pins.forEach(p => {
      const on = inPeriod(p) && (state.type === 'all' || TYPES[p.t] === state.type), dim = county != null && p.county !== county;
      if (on !== p.on) { p.on = on; p.el.classList.toggle('off', !on); }
      if (dim !== p.dim) { p.dim = dim; p.el.classList.toggle('dim', dim); }
    });
    // Totals: the tiles are also the legend and the filter
    TYPES.forEach(type => setTotal(type, type === 'started' ? t[type].n : t[type].sum, animate));
    $('.atlas-tiles').classList.toggle('solo', state.type !== 'all');
    $$('[data-atlas-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.atlasType === state.type)));
    // Scope
    const c = county == null ? null : D.counties[county];
    $('[data-atlas-scope-sub]').textContent = plural(t.n, 'milestone') + (c ? ' · ' + c.c : ' · ' + D.counties.length + ' counties');
    $('[data-atlas-svg-title]').textContent = `Map of ${num(t.n)} milestones shared ${c ? 'in ' + c.n + ' County' : 'across Northern California'}. The same numbers are in the totals and the county table.`;
    $('[data-atlas-count]').textContent = num(pins.length + counted().length);
    svg.classList.toggle('atlas-scoped', !!c);
    D.counties.forEach((k, i) => k.el.classList.toggle('on', i === county));
    $$('.atlas-story', gStories).forEach((g, i) => g.classList.toggle('far', county != null && stories[i].county !== county));
    select.value = county == null ? '' : county;
    setLatest();
    // Months
    const counts = Array(12).fill(0);
    pins.forEach(p => { if ((county == null || p.county === county) && (state.type === 'all' || TYPES[p.t] === state.type)) counts[p.month]++; });
    const max = Math.max(1, ...counts), through = throughMonth();
    $$('[data-atlas-months] button').forEach((b, m) => {
      b.firstElementChild.style.setProperty('--h', Math.max(10, Math.round(counts[m] / max * 100)) + '%');
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
      [c.c, num(t.n), money(t.funding.sum), money(t.sales.sum), num(t.started.n), num(t.hired.sum)].forEach((v, i) => tr.append(el('td', i ? 'num' : '', v)));
      body.append(tr);
    });
  }
  $('details.atlas-table').addEventListener('toggle', renderTable);

  // ── Scope: one county, or everything ──
  const setCounty = i => {
    endIntro(); state.county = i;
    zoomTo(i == null ? frame(REGION) : countyBox(i));
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
  const showTip = (p, e) => {
    const r = stage.getBoundingClientRect();
    tip.textContent = ''; tip.append(el('strong', '', META[TYPES[p.t]].feed), place(p) + ' · ' + when(p.age));
    tip.style.left = Math.max(120, Math.min(r.width - 120, e.clientX - r.left)) + 'px';
    tip.style.top = Math.max(70, e.clientY - r.top) + 'px';
    tip.hidden = false;
  };
  svg.addEventListener('pointermove', e => {
    if (e.target.closest('.atlas-story')) { hideTip(); return; }
    const at = toMap(e); if (!at) return;
    const p = nearest(at[0], at[1], 9 * scaleNow());
    p ? showTip(p, e) : hideTip();
  });
  svg.addEventListener('pointerleave', hideTip);
  svg.addEventListener('click', e => {
    if (e.target.closest('.atlas-story')) return; // story marks handle their own clicks
    closeStory();
    const county = e.target.closest('.atlas-county');
    if (!county) { if (state.county != null) setCounty(null); return; }
    const i = +county.dataset.county;
    if (state.county === i) { const at = toMap(e), p = at && nearest(at[0], at[1], 14 * scaleNow()); if (p) { showTip(p, e); return; } }
    setCounty(state.county === i ? null : i);
  });

  // ── Type filter: the four tiles. Choose one to isolate it; choose it again for all four. ──
  $$('[data-atlas-type]').forEach(b => b.addEventListener('click', () => {
    endIntro();
    state.type = state.type === b.dataset.atlasType ? 'all' : b.dataset.atlasType;
    render(false);
    announce(state.type === 'all' ? 'Showing every kind of milestone.' : `Showing only ${META[state.type].feed.toLowerCase()} on the map.`);
  }));

  // ── Time: months and Play ──
  const months = $('[data-atlas-months]'), playBtn = $('[data-atlas-play]'), playLabel = $('[data-atlas-play-label]');
  for (let m = 0; m < 12; m++) {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.title = monthName(m); b.append(document.createElement('i')); li.append(b); months.append(li);
    b.addEventListener('click', () => { endIntro(); stop(); state.cut = m === throughMonth() && state.cut > 0 ? 0 : monthCut(m); render(); });
  }
  let playRaf = 0, playTimer = 0, introRaf = 0;
  function stop() {
    cancelAnimationFrame(playRaf); clearInterval(playTimer);
    if (!state.playing) return;
    state.playing = false; playBtn.setAttribute('aria-pressed', 'false'); playLabel.textContent = state.cut === 0 ? 'Play the year' : 'Continue';
  }
  const play = () => {
    const oldest = pins[0].age;
    endIntro(); closeStory();
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

  // Arrival: once, on load, the year fills in and the totals count up. Skipped for reduced motion.
  let introOn = false;
  function endIntro() { if (!introOn) return; introOn = false; cancelAnimationFrame(introRaf); state.cut = 0; render(false); }
  const intro = () => {
    const oldest = pins[0].age, t0 = performance.now(), dur = 1900;
    introOn = true; state.cut = oldest; render(false);
    const tick = now => {
      if (!introOn) return;
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 2.2);
      state.cut = Math.round(oldest * (1 - e)); render(false);
      if (p < 1) introRaf = requestAnimationFrame(tick); else introOn = false;
    };
    introRaf = requestAnimationFrame(tick);
  };

  // ── Ringed marks: two success stories and three testimonies. Hover or focus shows one; a click keeps it open. ──
  const cards = $('[data-atlas-cards]');
  const county = s => D.counties[s.county].n + ' County';
  const by = s => s.kind === 'story' ? s.name + ' · ' + s.meta : (/^[AEIOU]/.test(D.counties[s.county].n) ? 'An ' : 'A ') + county(s) + ' business owner';
  let closeTimer = 0;
  const later = () => { clearTimeout(closeTimer); closeTimer = setTimeout(() => { if (!state.pinned) closeStory(); }, 220); };
  stories.forEach((s, i) => {
    const g = svgEl('g', { class: 'atlas-story is-' + s.kind, tabindex: '0', role: 'button', 'aria-expanded': 'false',
      'aria-label': s.kind === 'story' ? `Success story: ${s.name}, ${s.meta}. ${s.title}` : `In their words, ${county(s)}: ${s.title}` });
    g.dataset.story = i;
    g.append(dot(s.x, s.y, 'hit'), dot(s.x, s.y, 'glow'), dot(s.x, s.y, 'ring'), dot(s.x, s.y, 'gap'));
    if (s.kind === 'story') g.append(dot(s.x, s.y, 'core'));
    g.addEventListener('pointerenter', e => { if (e.pointerType !== 'touch' && !state.pinned) { clearTimeout(closeTimer); openStory(i); } });
    g.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') later(); });
    g.addEventListener('focus', () => { if (!state.pinned) openStory(i); });
    g.addEventListener('blur', later);
    g.addEventListener('click', () => { const same = state.story === i && state.pinned; closeStory(); if (!same) { openStory(i); state.pinned = true; g.classList.add('pinned'); } });
    g.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault(); openStory(i); state.pinned = true; g.classList.add('pinned');
      if (s.kind === 'story') $('[data-atlas-pop-link]').focus({ preventScroll: true });
    });
    gStories.append(g); s.el = g;
    if (s.kind !== 'story') return;
    // The story below the map: a photograph paired with a colour block that carries one figure. The pair is the link.
    const li = el('li'), a = el('a', 'atlas-card is-' + (s.tone || 'funding')), photo = el('span', 'atlas-card-photo'), img = document.createElement('img');
    a.href = s.href; a.target = '_blank'; a.rel = 'noopener';
    img.src = s.img; img.alt = s.alt; img.loading = 'lazy'; img.style.objectPosition = img.style.transformOrigin = s.pos || '50% 50%'; img.style.setProperty('--zoom', s.zoom || 1);
    photo.append(img);
    const block = el('span', 'atlas-card-block'), placeLine = el('span', 'atlas-card-place'); placeLine.append(el('i', 'atlas-ring'), s.place || s.town);
    const name = el('span', 'atlas-card-name', s.name); name.append(el('span', 'atlas-arrow'));
    block.append(placeLine, el('strong', 'atlas-card-figure', s.figure || ''), el('span', 'atlas-card-title', s.line || s.title), name);
    a.append(photo, block);
    li.append(a); cards.append(li);
    const lit = on => s.el.classList.toggle('lit', on);
    a.addEventListener('pointerenter', () => lit(true)); a.addEventListener('pointerleave', () => lit(false));
    a.addEventListener('focus', () => lit(true)); a.addEventListener('blur', () => lit(false));
  });
  pop.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  pop.addEventListener('pointerleave', later);
  pop.addEventListener('focusout', later);
  pop.addEventListener('focusin', () => clearTimeout(closeTimer));
  function placePop() {
    if (state.story == null) return;
    const s = stories[state.story], [px, py] = toStage(s.x, s.y), r = stage.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    const left = px + 20 + w <= r.width + 12 ? px + 20 : px - 20 - w;
    pop.style.left = Math.max(-12, Math.min(r.width - w + 12, left)) + 'px';
    pop.style.top = Math.max(0, Math.min(r.height - h - 8, py - h / 2)) + 'px';
  }
  function openStory(i) {
    const s = stories[i], link = $('[data-atlas-pop-link]'), photo = $('[data-atlas-pop-photo]'), img = $('[data-atlas-pop-img]');
    hideTip();
    stories.forEach((k, n) => { k.el.classList.toggle('open', n === i); k.el.classList.remove('pinned'); k.el.setAttribute('aria-expanded', String(n === i)); });
    state.story = i; state.pinned = false;
    $('[data-atlas-pop-title]').textContent = s.kind === 'story' ? s.title : '“' + s.title + '”';
    $('[data-atlas-pop-by]').textContent = by(s);
    link.hidden = photo.hidden = s.kind !== 'story';
    if (s.kind === 'story') { link.href = s.href; link.setAttribute('aria-label', 'Read the ' + s.name + ' story'); img.src = s.img; img.alt = s.alt; img.style.objectPosition = s.popPos || s.pos || '50% 50%'; img.style.transformOrigin = s.popOrigin || s.popPos || s.pos || '50% 50%'; img.style.setProperty('--zoom', s.popZoom || (s.popPos ? 1 : s.zoom) || 1); }
    pop.className = 'atlas-pop is-' + s.kind; pop.hidden = false; placePop();
  }
  function closeStory(focusBack) {
    clearTimeout(closeTimer);
    if (state.story == null) return;
    const s = stories[state.story]; s.el.classList.remove('open', 'pinned'); s.el.setAttribute('aria-expanded', 'false');
    state.story = null; state.pinned = false; pop.hidden = true;
    if (focusBack) s.el.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (state.story != null) closeStory(pop.contains(document.activeElement));
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
    endIntro(); stop(); closeStory(); state.cut = 0; state.type = 'all'; state.county = D.home.county;
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

  // ── Presenting: the site steps away; the ringed marks take turns on the map ──
  const presentBtn = $('[data-atlas-present]');
  let tour = 0;
  const present = on => {
    document.body.classList.toggle('atlas-present', on);
    presentBtn.setAttribute('aria-pressed', String(on));
    if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    clearInterval(tour); closeStory();
    if (on && !still && stories.length) { // A slow tour of the ringed marks. Any pointer or key press ends it.
      let n = -1;
      tour = setInterval(() => { if (state.playing || state.county != null || state.pinned) return; n = (n + 1) % stories.length; openStory(n); }, 7000);
      const end = () => { clearInterval(tour); removeEventListener('pointerdown', end); removeEventListener('keydown', end); };
      addEventListener('pointerdown', end); addEventListener('keydown', end);
    }
    requestAnimationFrame(() => { view = state.county == null ? frame(REGION) : countyBox(state.county); applyView(); });
  };
  presentBtn.addEventListener('click', () => present(true));
  $('[data-atlas-present-exit]').addEventListener('click', () => { present(false); presentBtn.focus(); });
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('atlas-present')) present(false); });
  addEventListener('resize', () => { view = state.county == null ? frame(REGION) : countyBox(state.county); applyView(); });

  function announce(text) {
    let live = $('#live'); if (!live) { live = el('div', 'visually-hidden'); live.id = 'live'; live.setAttribute('role', 'status'); document.body.append(live); }
    live.textContent = ''; setTimeout(() => live.textContent = text, 50);
  }

  // ── Go ──
  if (params.has('reset')) { mine = []; writeMine(mine); }
  view = frame(REGION);
  renderMine(); render(false); applyView();
  if (params.has('present')) present(true);
  const newest = mine.filter(i => i.share !== 'private').pop();
  if (newest && params.has('new')) setTimeout(() => locate(newest), 700);
  else if (!still && !params.has('still')) intro();
})();
