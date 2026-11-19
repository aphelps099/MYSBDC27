/* Real rendered lines, measured after fonts settle. Content is always readable. */
(() => {
  const targets = [...document.querySelectorAll('[data-line-reveal]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!targets.length || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const originals = new Map(targets.map(el => [el, el.textContent]));
  const completed = new WeakSet();
  let observer, timer;
  function rebuild() {
    observer?.disconnect();
    targets.forEach(el => { el.getAnimations({subtree:true}).forEach(a=>a.cancel()); el.textContent = originals.get(el); });
    if (motion.matches) return;
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const line = entry.target;
      observer.unobserve(line);
      line.dataset.revealed = 'true';
      completed.add(line.closest('[data-line-reveal]'));
      line.animate([{opacity:.75,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}], {duration:800,fill:'backwards',delay:Number(line.dataset.order)%3*70,easing:'cubic-bezier(.2,.6,.3,1)'});
    }), {rootMargin:'0px 0px -6% 0px',threshold:.5});
    targets.forEach(el => {
      const text = originals.get(el);
      // Measure word positions, keeping the same font, width and natural wrapping.
      const words = text.trim().split(/\s+/).map(word => { const span=document.createElement('span');span.textContent=word+' ';el.append(span);return span; });
      el.firstChild?.nodeType === Node.TEXT_NODE && el.firstChild.remove();
      const groups=[]; let lastTop;
      words.forEach(word => { const top=word.getBoundingClientRect().top;if(lastTop===undefined || Math.abs(top-lastTop)>2){groups.push('');lastTop=top;}groups[groups.length-1]+=word.textContent; });
      el.replaceChildren();
      const accessible=document.createElement('span');accessible.className='about-motion-sr';accessible.textContent=text;el.append(accessible);
      groups.forEach((value,index)=>{const line=document.createElement('span');line.className='about-reveal-line';line.setAttribute('aria-hidden','true');line.textContent=value.trim();line.dataset.order=index;el.append(line);if(completed.has(el))line.dataset.revealed='true';else observer.observe(line);});
    });
  }
  (document.fonts?.ready || Promise.resolve()).then(rebuild);
  let width=innerWidth;
  window.addEventListener('resize',()=>{if(innerWidth===width)return;width=innerWidth;clearTimeout(timer);timer=setTimeout(rebuild,180);},{passive:true});
  motion.addEventListener('change',rebuild);
})();
