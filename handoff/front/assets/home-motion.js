/* Homepage motion (November 2026). See home-motion.css.
   1. Section headlines rise into place line by line as they scroll into view; their supporting text fades up after.
   2. The four figures roll like an odometer from a few percent below each final number, never from zero.
   3. Three oversized plus signs behind the stories fade in and drift at different speeds while scrolling. */
(() => {
  const root = document.documentElement;
  const done = () => root.classList.remove('hm-motion');
  if (!root.classList.contains('hm-motion') || !window.gsap || !window.ScrollTrigger) { done(); return; }
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  /* Run fn once el reaches `frac` of the viewport, or straight away if it is already above that line. */
  const whenSeen = (el, frac, fn) => {
    if (el.getBoundingClientRect().top < window.innerHeight * frac) { fn(); return; }
    ScrollTrigger.create({ trigger: el, start: 'top ' + Math.round(frac * 100) + '%', once: true, onEnter: fn });
  };

  /* 1. Headlines */
  const split = (el) => {
    const counts = [];
    const lines = el.innerHTML.split(/<br\s*\/?>/i).map((part) => {
      const t = document.createElement('span');
      t.innerHTML = part;
      const words = t.textContent.trim().split(/\s+/).filter(Boolean);
      counts.push(words.length);
      return words.map((w) => '<span class="hm-mask"><span class="hm-in">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span></span>').join(' ');
    });
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    el.innerHTML = lines.join('<br> ');
    el.classList.add('hm-split');
    const all = [...el.querySelectorAll('.hm-in')];
    let k = 0;
    return counts.map((n) => { const g = all.slice(k, k + n); k += n; return g; });
  };
  const groups = [
    ['.next-section>h2', '.next-grid>article'],
    ['.hs-intro h2', '.hs-intro>div'],
    ['.impact-intro h2', '.impact-intro p'],
    ['.advising-lead h2', '.advising-description']
  ];
  groups.forEach(([h, fade]) => {
    const head = document.querySelector(h);
    if (!head) return;
    const followers = [...document.querySelectorAll(fade)];
    followers.forEach((f) => f.setAttribute('data-hm-fade', ''));
    const lines = split(head);
    gsap.set(lines.flat(), { yPercent: 110 });
    gsap.set(followers, { opacity: 0, y: 18 });
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
    lines.forEach((words, i) => tl.to(words, { yPercent: 0, duration: 0.9, stagger: 0.03 }, i * 0.12));
    tl.to(followers, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.35);
    whenSeen(head, 0.85, () => tl.play());
  });

  /* 2. Odometer figures */
  document.querySelectorAll('.impact-panel .concept-metrics dd').forEach((dd, index) => {
    const text = dd.textContent.trim();
    const m = text.match(/^([^\d]*)([\d,]+)(.*)$/);
    if (!m) return;
    const [, pre, num, post] = m;
    const final = parseInt(num.replace(/,/g, ''), 10);
    const start = Math.max(0, final - Math.max(9, Math.round(final * 0.03)));
    const digits = String(final).length;
    const cols = [];
    let html = '<span class="hm-sr">' + text + '</span><span class="hm-odo" aria-hidden="true">' + pre;
    [...num].forEach((ch) => {
      if (ch === ',') { html += ','; return; }
      html += '<span class="hm-col"><span class="hm-strip">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => '<span>' + d + '</span>').join('') + '</span></span>';
    });
    dd.innerHTML = html + post + '</span>';
    dd.querySelectorAll('.hm-strip').forEach((s) => cols.push(s));
    // Each wheel is as wide as its final digit, so the settled figure matches the original text exactly.
    const finalDigits = String(final);
    cols.forEach((strip, i) => {
      const probe = document.createElement('span');
      probe.textContent = finalDigits[i];
      strip.parentNode.parentNode.insertBefore(probe, strip.parentNode);
      strip.parentNode.style.width = probe.getBoundingClientRect().width + 'px';
      probe.remove();
    });
    const render = (v) => {
      cols.forEach((strip, i) => {
        const p = digits - 1 - i;
        const unit = Math.pow(10, p);
        const r = v % unit;
        const carry = p === 0 ? 0 : Math.max(0, r - (unit - 1));
        const pos = p === 0 ? v % 10 : (Math.floor(v / unit) + carry) % 10;
        strip.style.transform = 'translateY(' + (-pos) + 'em)';
      });
    };
    const state = { v: start };
    render(start);
    whenSeen(dd, 0.9, () => gsap.to(state, { v: final, duration: 2.4, delay: index * 0.12, ease: 'power2.out', onUpdate: () => render(state.v), onComplete: () => render(final) }));
  });

  /* 3. Plus signs behind the stories */
  const plus = document.querySelectorAll('.hm-plus svg');
  if (plus.length) {
    gsap.set(plus, { opacity: 0, scale: 0.86 });
    whenSeen(document.querySelector('.home-stories'), 0.75, () => gsap.to(plus, { opacity: 0.05, scale: 1, duration: 1.4, ease: 'power2.out', stagger: 0.15 }));
    plus.forEach((p, i) => gsap.to(p, { y: [-70, -130, -50][i] || -60, ease: 'none',
      scrollTrigger: { trigger: '.home-stories', start: 'top bottom', end: 'bottom top', scrub: true } }));
  }

  root.classList.add('hm-ready');
})();
