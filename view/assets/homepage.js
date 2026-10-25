// Homepage enhancements stay independent of the design runtime and GSAP loading.
import {language} from './locale.js?v=20261023-advising';
const banners = new WeakSet();
const heroes = new WeakSet();
const dismissalKey = 'mysbdc.rfp-announcement.2026-10';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let gsapReady;

function loadGsap() {
  // The vendor bundle is UMD; it must execute as a classic script, not an ES module.
  return gsapReady ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('./vendor/gsap-3.15.0.min.js', import.meta.url).href;
    script.onload = () => resolve(window.gsap);
    script.onerror = reject;
    document.head.append(script);
  });
}

function updateCloseLabel() {
  const close = document.querySelector('.announcement-close');
  if (!close) return;
  const label = language() === 'es' ? 'Cerrar anuncio' : 'Dismiss announcement';
  close.setAttribute('aria-label', label);
  close.title = label;
}

function enhanceHomepage() {
  const banner = document.querySelector('#dc-root .home-announcement');
  if (banner && !banners.has(banner)) {
    banners.add(banner);
    try { banner.hidden = sessionStorage.getItem(dismissalKey) === 'dismissed'; } catch { /* Storage is optional. */ }
    banner.querySelector('.announcement-close').addEventListener('click', () => {
      banner.hidden = true;
      try { sessionStorage.setItem(dismissalKey, 'dismissed'); } catch { /* The close button still works. */ }
      document.querySelector('.site-logo')?.focus({preventScroll:true});
    });
    updateCloseLabel();
  }

  const hero = document.querySelector('#dc-root .homepage-hero-title');
  if (!hero || heroes.has(hero)) return;
  heroes.add(hero);
  revealHero(hero);
}

async function revealHero(heading) {
  // Content is visible by default, including when animation or font loading fails.
  if (reducedMotion.matches || document.visibilityState === 'hidden') return;
  const started = performance.now();
  try {
    await Promise.all([
      loadGsap(),
      Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 900))])
    ]);
    if (!heading.isConnected || reducedMotion.matches || document.visibilityState === 'hidden' || scrollY > 100 || performance.now() - started > 1600) return;
    const copy = heading.parentElement;
    const targets = [copy.querySelector('p'), ...heading.querySelectorAll('.hero-sentence'), heading.nextElementSibling, copy.lastElementChild].filter(Boolean);
    const timeline = window.gsap.timeline({defaults:{duration:0.8, ease:'power3.out'}});
    timeline.fromTo(targets, {opacity:0, y:20}, {opacity:1, y:0, stagger:0.11, clearProps:'opacity,transform'});
    // Changing accessibility preferences mid-animation immediately restores the text.
    const finish = () => timeline.progress(1);
    reducedMotion.addEventListener('change', finish, {once:true});
    timeline.eventCallback('onComplete', () => reducedMotion.removeEventListener('change', finish));
  } catch { /* No animation should ever prevent the homepage from being readable. */ }
}

document.addEventListener('publicready', enhanceHomepage);
document.addEventListener('languagechange', updateCloseLabel);
enhanceHomepage();
