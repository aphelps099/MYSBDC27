(()=>{
const header=document.querySelector('.site-header');
let headerTick=false;
function updateHeader(){const compact=header.classList.contains('is-scrolled');header.classList.toggle('is-scrolled',compact?window.scrollY>24:window.scrollY>72);headerTick=false;}
window.addEventListener('scroll',()=>{if(!headerTick){headerTick=true;requestAnimationFrame(updateHeader);}},{passive:true});
updateHeader();

document.querySelector('#intel-signup button[type=submit]').disabled=false;
document.querySelector('#intel-signup').addEventListener('submit',event=>{event.preventDefault();const status=document.querySelector('#intel-status');status.textContent='That’s the inline signup experience. This preview hasn’t subscribed you or saved your email.';status.hidden=false;});
const d=document.querySelector('#film-dialog');const filmPreview=document.querySelector('#film-preview');if(d && filmPreview){filmPreview.onclick=()=>d.showModal();d.querySelector('button').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});}
})();

(() => {
  const section = document.querySelector('.impact-statement');
  if (!section || !('IntersectionObserver' in window)) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let entered = false;
  let frame = 0;
  let entrances = [];

  function update() {
    frame = 0;
    if (!visible || reducedMotion.matches) return;
    const rect = section.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1,
      (innerHeight - rect.top) / (innerHeight + rect.height)));
    const travel = innerWidth <= 700 ? 10 : 24;
    section.style.setProperty('--seal-shift', `${((progress * 2 - 1) * travel).toFixed(2)}px`);
  }

  function schedule() {
    if (visible && !reducedMotion.matches && !frame) frame = requestAnimationFrame(update);
  }

  function enter() {
    if (entered || reducedMotion.matches) return;
    entered = true;
    if (!Element.prototype.animate) return;
    entrances = [...section.querySelector('.impact-statement-copy').children].map((element, index) =>
      element.animate([
        { opacity: .65, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 700,
        delay: index * 90,
        easing: 'cubic-bezier(.22,.61,.36,1)',
        fill: 'backwards'
      })
    );
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    section.classList.toggle('motion-active', visible && !reducedMotion.matches);
    if (visible) schedule();
    if (entry.intersectionRatio >= .15) enter();
  }, { threshold: [0, .15] });
  observer.observe(section);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', () => {
    section.classList.toggle('motion-active', visible && !reducedMotion.matches);
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      entrances.forEach(animation => animation.cancel());
      section.style.removeProperty('--seal-shift');
    } else {
      schedule();
    }
  });
})();

(() => {
  const video = document.querySelector('.hero-footage');
  const button = document.querySelector('.hero-video-toggle');
  if (!video || !button) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let wantsPlayback = !motion.matches && !navigator.connection?.saveData;
  let visible = true;

  function syncButton() {
    const playing = !video.paused;
    button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    button.querySelector('.video-toggle-label').textContent = playing ? 'Pause video' : 'Play video';
    button.querySelector('.video-toggle-icon').textContent = playing ? 'Ⅱ' : '▶';
  }
  async function play() {
    if (!video.src) video.src = video.dataset.src;
    try { await video.play(); } catch { syncButton(); }
  }
  function reconcile() {
    if (wantsPlayback && visible && !document.hidden) play();
    else video.pause();
  }
  video.addEventListener('play', syncButton);
  video.addEventListener('pause', syncButton);
  video.addEventListener('error', () => {
    wantsPlayback = false;
    video.pause();
    button.hidden = true;
  });
  button.addEventListener('click', () => {
    wantsPlayback = video.paused;
    reconcile();
  });
  motion.addEventListener('change', () => {
    wantsPlayback = !motion.matches && !navigator.connection?.saveData;
    reconcile();
  });
  document.addEventListener('visibilitychange', reconcile);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      reconcile();
    }).observe(video);
  }
  syncButton();
  reconcile();
})();
