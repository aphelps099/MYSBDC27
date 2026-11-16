/* MySBDC Atlas — the map of shared milestones. No framework, no dependencies, no network requests.
   Reads window.MYSBDC_ATLAS_DATA (assets/atlas-data.js) and the signed-in client's own shared
   milestones, which the milestone forms keep in this browser under `mysbdc-atlas-v1`.
   Design logic and the production data contract are in handoff/ATLAS.md. */
(function () {
  const D = window.MYSBDC_ATLAS_DATA, root = document.querySelector('[data-atlas]');
  if (!D || !root) return;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, attrs = {}) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const KEY = 'mysbdc-atlas-v1';
  const TYPES = D.types; // ['hired','started','funding','sales'] — the index is the pin class t0…t3
  const META = {
    hired:   { feed: 'New hires',     money: false, sub: n => plural(n, 'business') + ' hired' },
    started: { feed: 'New business',  money: false, sub: () => 'Registered and open' },
    funding: { feed: 'New funding',   money: true,  sub: n => plural(n, 'loan, grant or investment', 'loans, grants and investments') },
    sales:   { feed: 'Sales growth',  money: true,  sub: n => plural(n, 'business') + ' grew' },
  };
  function plural(n, one, many) { return num(n) + ' ' + (n === 1 ? one : many || (one.endsWith('s') ? one + 'es' : one.replace(/y$/, 'ie') + 's')); }
  function num(n) { return Math.round(n).toLocaleString('en-US'); }
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
  const monthName = (m, opts = { month: 'long', year: 'numeric' }) => new Date(monthStart.getFullYear(), monthStart.getMonth() + m, 1).toLocaleDateString('en-US', opts);
  // Age (in days) of the last day of month m: a milestone shows "through" that month when it is at least this old.
  const monthCut = m => m >= 11 ? 0 : Math.max(0, Math.ceil((today - new Date(monthStart.getFullYear(), monthStart.getMonth() + m + 1, 0, 12)) / 864e5));

  const pins = [];
  for (let i = 0; i < D.pins.length; i += 6) {
    const town = D.towns[D.pins[i + 4]];
    pins.push({ x: D.pins[i], y: D.pins[i + 1], t: D.pins[i + 2], age: D.pins[i + 3], town: town[0], county: town[1], v: D.pins[i + 5], month: monthOf(dateOf(D.pins[i + 3])), on: true, dim: false });
  }
  D.quotes.forEach(([i, text]) => { if (pins[i]) pins[i].quote = text; });
  const centers = [...new Set(D.counties.map(c => c.c))];

  // ── The signed-in client's own milestones (design preview: kept in this browser only) ──
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
  const state = { county: null, type: 'all', cut: 0, playing: false };
  const [VW, VH] = D.view, PAD = 24, FULL = [-PAD, -PAD, VW + PAD * 2, VH + PAD * 2];
  let view = FULL.slice(), viewAnim = 0;

  // ── Build the map ──
  const svg = $('[data-atlas-svg]'), stage = $('[data-atlas-stage]'), tip = $('[data-atlas-tip]');
  const gCounties = $('[data-atlas-counties]'), gPins = $('[data-atlas-pins]'), gPlaces = $('[data-atlas-places]'), gMine = $('[data-atlas-mine]');
  D.counties.forEach((c, i) => {
    const path = svgEl('path', { d: c.d, class: 'atlas-county' });
    path.dataset.county = i;
    gCounties.append(path); c.el = path;
  });
  D.labels.forEach(([label, x, y, anchor]) => { const t = svgEl('text', { x, y, 'text-anchor': anchor }); t.textContent = label; if (label === D.home.town) t.setAttribute('class', 'home'); gPlaces.append(t); });
  const frag = document.createDocumentFragment();
  pins.forEach(p => { p.el = svgEl('path', { d: `M${p.x} ${p.y}h.01`, class: 'atlas-pin t' + p.t }); frag.append(p.el); });
  gPins.append(frag);

  const select = $('[data-atlas-county]');
  D.counties.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c.n + ' County'; select.append(o); });

  // ── Geometry helpers ──
  const scaleNow = () => { const r = stage.getBoundingClientRect(); return Math.max(view[2] / r.width, view[3] / r.height); }; // SVG units per screen pixel
  const applyView = () => {
    svg.setAttribute('viewBox', view.map(v => v.toFixed(2)).join(' '));
    const u = scaleNow();
    svg.style.setProperty('--u', u.toFixed(4));
    $$('text', gMine).forEach(t => { t.setAttribute('x', +t.dataset.x + 14 * u); t.setAttribute('y', +t.dataset.y + 4.5 * u); });
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
    const el = $(`[data-atlas-total="${type}"]`), from = shown[type] ?? 0;
    cancelAnimationFrame(el._raf);
    if (!animate || still || from === value) { el.textContent = fmt(type, value); shown[type] = value; return; }
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / 700), v = from + (value - from) * (1 - Math.pow(1 - p, 3));
      el.textContent = fmt(type, v); shown[type] = v;
      if (p < 1) el._raf = requestAnimationFrame(tick); else shown[type] = value;
    };
    el._raf = requestAnimationFrame(tick);
  };

  const when = age => age <= 0 ? 'Today' : age === 1 ? 'Yesterday' : age < 14 ? age + ' days ago' : dateOf(age).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const swatch = (type, pending) => { const i = document.createElement('i'); i.className = 'atlas-swatch' + (pending ? ' pending' : ''); i.style.setProperty('--c', `var(--atlas-${type})`); return i; };
  const place = p => p.town + ', ' + D.counties[p.county].n + ' County';

  const render = (animate = true) => {
    const county = state.county, t = tally(county);
    // Pins
    pins.forEach(p => {
      const on = inPeriod(p) && (state.type === 'all' || TYPES[p.t] === state.type), dim = county != null && p.county !== county;
      if (on !== p.on) { p.on = on; p.el.classList.toggle('off', !on); }
      if (dim !== p.dim) { p.dim = dim; p.el.classList.toggle('dim', dim); }
    });
    // Totals (also the legend and the filter)
    TYPES.forEach(type => {
      setTotal(type, type === 'started' ? t[type].n : t[type].sum, animate);
      $(`[data-atlas-sub="${type}"]`).textContent = META[type].sub(t[type].n);
    });
    $('[data-atlas-count]').textContent = num(tally(null).n);
    $('.atlas-totals').classList.toggle('solo', state.type !== 'all');
    $$('[data-atlas-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.atlasType === state.type)));
    // Scope
    const c = county == null ? null : D.counties[county];
    $('[data-atlas-kicker]').textContent = c ? c.c : 'NorCal SBDC network';
    $('[data-atlas-scope]').textContent = c ? c.n + ' County' : 'All of Northern California';
    $('[data-atlas-scope-sub]').textContent = c ? plural(t.n, 'milestone') : centers.length + ' centers · ' + D.counties.length + ' counties';
    $('[data-atlas-totals-title]').textContent = c ? 'In ' + c.n + ' County' : 'Across the network';
    $('[data-atlas-svg-title]').textContent = `Map of ${num(t.n)} milestones shared ${c ? 'in ' + c.n + ' County' : 'across Northern California'}. The same numbers are in the totals and the county table.`;
    svg.classList.toggle('atlas-scoped', !!c);
    D.counties.forEach((k, i) => k.el.classList.toggle('on', i === county));
    select.value = county == null ? '' : county;
    // Latest
    const feed = $('[data-atlas-feed]'); feed.textContent = '';
    const rows = [];
    if (state.cut === 0 && (county == null || county === D.home.county)) counted().filter(i => state.type === 'all' || i.type === state.type).reverse()
      .forEach(i => rows.push({ type: i.type, where: D.home.town + ', ' + D.counties[D.home.county].n + ' County', when: 'Just now', fresh: true }));
    for (let i = pins.length - 1; i >= 0 && rows.length < 6; i--) { const p = pins[i]; if (p.on && !p.dim) rows.push({ type: TYPES[p.t], where: place(p), when: when(p.age) }); }
    rows.slice(0, 6).forEach(r => {
      const li = document.createElement('li'), s = document.createElement('strong'), w = document.createElement('span'), d = document.createElement('span');
      s.textContent = META[r.type].feed; w.className = 'where'; w.textContent = r.where; d.className = 'when'; d.textContent = r.when;
      if (r.fresh) li.className = 'fresh';
      li.append(swatch(r.type), s, d, w); feed.append(li);
    });
    $('[data-atlas-empty]').hidden = rows.length > 0;
    // One quote that fits what is in view. Credited by county only.
    const fig = $('[data-atlas-quote]');
    const own = state.cut === 0 && (county == null || county === D.home.county) ? counted().filter(i => i.quote && (state.type === 'all' || i.type === state.type)).pop() : null;
    const q = own ? { quote: own.quote, county: D.home.county } : pins.filter(p => p.quote && p.on && !p.dim).pop();
    fig.hidden = !q;
    if (q) {
      const k = D.counties[q.county];
      $('[data-atlas-quote-text]').textContent = '“' + q.quote + '”';
      $('[data-atlas-quote-by]').textContent = (/^[AEIOU]/.test(k.n) ? 'An ' : 'A ') + k.n + ' County business owner · ' + k.c;
    }
    // Months
    const counts = Array(12).fill(0);
    pins.forEach(p => { if ((county == null || p.county === county) && (state.type === 'all' || TYPES[p.t] === state.type)) counts[p.month]++; });
    const max = Math.max(1, ...counts), through = throughMonth();
    $$('[data-atlas-months] button').forEach((b, m) => {
      b.firstElementChild.style.setProperty('--h', Math.max(6, Math.round(counts[m] / max * 100)) + '%');
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
      const tr = document.createElement('tr'), th = document.createElement('th'); th.scope = 'row'; th.textContent = c.n; tr.append(th);
      [c.c, num(t.n), num(t.hired.sum), num(t.started.n), money(t.funding.sum), money(t.sales.sum)].forEach((v, i) => { const td = document.createElement('td'); if (i) td.className = 'num'; td.textContent = v; tr.append(td); });
      body.append(tr);
    });
  }
  $('.atlas-table').addEventListener('toggle', renderTable);

  // ── Scope: one county, or everything ──
  const setCounty = (i, focus) => {
    state.county = i;
    zoomTo(i == null ? FULL : countyBox(i));
    hideTip(); render();
    if (focus) $('[data-atlas-scope]').focus({ preventScroll: true });
    announce(i == null ? 'Showing all of Northern California.' : `Showing ${D.counties[i].n} County.`);
  };
  select.addEventListener('change', () => setCounty(select.value === '' ? null : +select.value));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.county != null && !document.body.classList.contains('atlas-present')) setCounty(null); });

  // ── Pointer: counties select; inside a county, the nearest pin explains itself ──
  const toMap = e => { const m = svg.getScreenCTM(); if (!m) return null; const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return [p.x, p.y]; };
  const nearest = (x, y, reach) => {
    let best = null, d = reach * reach;
    for (let i = pins.length - 1; i >= 0; i--) { const p = pins[i]; if (!p.on || p.dim) continue; const q = (p.x - x) ** 2 + (p.y - y) ** 2; if (q < d) { d = q; best = p; } }
    return best;
  };
  function hideTip() { tip.hidden = true; }
  const showTip = (p, e) => {
    const r = stage.getBoundingClientRect(), s = document.createElement('strong');
    s.textContent = META[TYPES[p.t]].feed; tip.textContent = ''; tip.append(s, place(p) + ' · ' + when(p.age));
    tip.style.left = Math.max(120, Math.min(r.width - 120, e.clientX - r.left)) + 'px';
    tip.style.top = Math.max(70, e.clientY - r.top) + 'px';
    tip.hidden = false;
  };
  svg.addEventListener('pointermove', e => {
    const at = toMap(e); if (!at) return;
    const p = nearest(at[0], at[1], 10 * scaleNow());
    p ? showTip(p, e) : hideTip();
  });
  svg.addEventListener('pointerleave', hideTip);
  svg.addEventListener('click', e => {
    const county = e.target.closest('.atlas-county');
    if (!county) { if (state.county != null) setCounty(null); return; }
    const i = +county.dataset.county;
    if (state.county === i) { const at = toMap(e), p = at && nearest(at[0], at[1], 14 * scaleNow()); if (p) { showTip(p, e); return; } }
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
    const li = document.createElement('li'), b = document.createElement('button'), bar = document.createElement('i');
    b.type = 'button'; b.title = monthName(m); b.append(bar); li.append(b); months.append(li);
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

  // ── Your milestones: the receipt, and the pin on the map ──
  const yours = $('[data-atlas-yours]'), list = $('[data-atlas-yours-list]');
  const dot = (x, y, cls) => svgEl('path', { d: `M${x} ${y}h.01`, class: cls });
  const renderMine = () => {
    gMine.textContent = '';
    const visible = mine.filter(i => i.share !== 'private');
    visible.forEach(item => {
      const [x, y] = mineSpot(item), g = svgEl('g', { class: item.status === 'confirmed' ? 'confirmed' : 'pending' });
      g.dataset.id = item.id;
      const core = dot(x, y, 'core'); core.style.stroke = `var(--atlas-${item.type})`;
      const ring = dot(x, y, 'ring'); if (item.status !== 'confirmed') ring.style.stroke = `var(--atlas-${item.type})`;
      g.append(dot(x, y, 'halo'), dot(x, y, 'ripple'), ring, core);
      gMine.append(g);
    });
    if (visible.length) { // One "You" label, beside the newest pin.
      const [x, y] = mineSpot(visible[visible.length - 1]), t = svgEl('text'); t.dataset.x = x; t.dataset.y = y; t.textContent = 'You';
      gMine.append(t);
    }
    svg.classList.toggle('atlas-has-mine', visible.length > 0);
    list.textContent = '';
    yours.hidden = !mine.length;
    const waiting = visible.filter(i => i.status !== 'confirmed').length;
    $('[data-atlas-yours-title]').textContent = !visible.length ? 'Your milestone is private.' : mine.length > 1 ? 'Your milestones are on the map.' : 'Your milestone is on the map.';
    mine.slice().reverse().forEach(item => {
      const li = document.createElement('li'), p = document.createElement('p'), st = document.createElement('p'), actions = document.createElement('div');
      p.textContent = item.summary || META[item.type].feed;
      st.className = 'atlas-yours-state'; actions.className = 'atlas-yours-actions';
      const strong = document.createElement('strong');
      if (item.share === 'private') { strong.textContent = 'Kept off the map.'; st.append(strong, ' Only you and your SBDC team see it.'); }
      else if (item.status === 'confirmed') { strong.textContent = 'Confirmed by Dana.'; st.append(strong, ' It now counts in the totals, shown as ' + D.home.town + ' with no name.'); }
      else { strong.textContent = 'Waiting for Dana to confirm.'; st.append(strong, ' Shown as ' + D.home.town + ', with no name or numbers. It joins the totals once confirmed.'); }
      if (item.share !== 'private') {
        const find = document.createElement('button'); find.type = 'button'; find.className = 'link'; find.textContent = 'Show me on the map';
        find.addEventListener('click', () => locate(item)); actions.append(find);
        if (item.status !== 'confirmed') {
          // Preview control. In production the advisor confirms in Neoserra; the client never sees this button.
          const ok = document.createElement('button'); ok.type = 'button'; ok.className = 'link'; ok.textContent = 'Preview: confirm as Dana';
          ok.addEventListener('click', () => confirmItem(item)); actions.append(ok);
        }
      }
      li.append(swatch(item.type, item.share !== 'private' && item.status !== 'confirmed'), p, st, actions); list.append(li);
    });
    applyView();
    return waiting;
  };
  const ripple = item => {
    const g = $$('g', gMine).find(n => n.dataset.id === item.id), r = g && $('.ripple', g);
    if (r && !still && r.animate) r.animate([{ strokeWidth: '12px', strokeOpacity: .55 }, { strokeWidth: '120px', strokeOpacity: 0 }], { duration: 1500, iterations: 3, easing: 'cubic-bezier(.2,.7,.2,1)' });
  };
  const locate = item => {
    stop(); state.cut = 0; state.type = 'all'; state.county = D.home.county;
    zoomTo(countyBox(D.home.county)); render();
    stage.scrollIntoView({ block: 'center', behavior: still ? 'auto' : 'smooth' });
    setTimeout(() => ripple(item), still ? 0 : 500);
  };
  const confirmItem = item => {
    item.status = 'confirmed'; writeMine(mine);
    renderMine(); render(true); ripple(item);
    announce('Confirmed. Your milestone now counts in the totals.');
  };
  $('[data-atlas-clear]').addEventListener('click', () => { mine = []; writeMine(mine); renderMine(); render(); announce('Preview milestones cleared.'); });

  // Live: a milestone shared in another tab or window of this browser lands here without a reload.
  addEventListener('storage', e => {
    if (e.key !== KEY) return;
    const before = new Set(mine.map(i => i.id)); mine = readMine();
    const added = mine.filter(i => !before.has(i.id) && i.share !== 'private');
    renderMine(); render(true);
    if (added.length) { announce('A new milestone was just shared from ' + D.home.town + '.'); if (document.body.classList.contains('atlas-present')) { zoomTo(countyBox(D.home.county)); state.county = D.home.county; render(); } setTimeout(() => ripple(added[added.length - 1]), 400); }
  });

  // ── Presenting ──
  const presentBtn = $('[data-atlas-present]');
  const present = on => {
    document.body.classList.toggle('atlas-present', on);
    presentBtn.setAttribute('aria-pressed', String(on)); presentBtn.textContent = on ? 'Exit full screen' : 'Present full screen';
    if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
    requestAnimationFrame(() => { view = state.county == null ? FULL.slice() : countyBox(state.county); applyView(); });
  };
  presentBtn.addEventListener('click', () => present(!document.body.classList.contains('atlas-present')));
  document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && document.body.classList.contains('atlas-present')) present(false); });
  addEventListener('resize', () => { if (state.county != null) view = countyBox(state.county); applyView(); });

  function announce(text) {
    let live = $('#live'); if (!live) { live = document.createElement('div'); live.id = 'live'; live.className = 'visually-hidden'; live.setAttribute('role', 'status'); document.body.append(live); }
    live.textContent = ''; setTimeout(() => live.textContent = text, 50);
  }

  // ── Go ──
  const params = new URLSearchParams(location.search);
  if (params.has('reset')) { mine = []; writeMine(mine); }
  if (params.has('present')) document.body.classList.add('atlas-present'), presentBtn.setAttribute('aria-pressed', 'true'), presentBtn.textContent = 'Exit full screen';
  renderMine(); render(false); applyView();
  const newest = mine.filter(i => i.share !== 'private').pop();
  if (newest && params.has('new')) setTimeout(() => locate(newest), 700);
})();
