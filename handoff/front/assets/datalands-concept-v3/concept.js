const nav=document.querySelector('.site-nav');const updateNav=()=>nav.classList.toggle('scrolled',scrollY>60);addEventListener('scroll',updateNav,{passive:true});addEventListener('pageshow',updateNav);updateNav();const video=document.querySelector('video'),control=document.querySelector('.video-control');if(!matchMedia('(prefers-reduced-motion: reduce)').matches){video.src=video.dataset.src;video.play().then(()=>{control.hidden=false}).catch(()=>{control.hidden=false;control.textContent='Play video'});}else{control.hidden=false;control.textContent='Play video'}control.addEventListener('click',()=>{if(video.paused){if(!video.src)video.src=video.dataset.src;video.play().then(()=>control.textContent='Pause video').catch(()=>control.textContent='Video unavailable')}else{video.pause();control.textContent='Play video'}});
const languageMenu=document.querySelector('.site-nav-language');document.addEventListener('click',event=>{if(!languageMenu.contains(event.target))languageMenu.open=false});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&languageMenu.open){languageMenu.open=false;languageMenu.querySelector('summary').focus()}});

const filmLaunch=document.querySelector('.film-launch');
const filmDialog=document.querySelector('.film-dialog');
const filmMount=document.querySelector('.film-player-mount');
const filmBackground=[document.querySelector('.site-nav'),document.querySelector('main'),document.querySelector('footer')];
function closeFilm(){filmDialog.hidden=true;filmMount.replaceChildren();filmBackground.forEach(e=>e.inert=false);document.body.classList.remove('film-open');filmLaunch.focus()}
filmLaunch.addEventListener('click',event=>{
  event.preventDefault();
  const player=document.createElement('iframe');
  player.src='https://www.youtube-nocookie.com/embed/5s8fBXxKaJc?autoplay=1&rel=0';
  player.title='Your Business, Better — NorCal SBDC brand film';
  player.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  player.referrerPolicy='strict-origin-when-cross-origin';
  player.allowFullscreen=true;
  filmMount.replaceChildren(player);filmDialog.hidden=false;
  filmBackground.forEach(e=>e.inert=true);document.body.classList.add('film-open');
  video.pause();control.textContent='Play video';
  filmDialog.querySelector('.film-close').focus();
});
filmDialog.querySelector('.film-close').addEventListener('click',closeFilm);
document.addEventListener('keydown',event=>{
 if(filmDialog.hidden)return;
 if(event.key==='Escape'){event.preventDefault();closeFilm()}
 if(event.key==='Tab'){
  const items=[...filmDialog.querySelectorAll('button,iframe,a[href]')];
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
});
