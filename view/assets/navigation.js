import {language,translateUI} from './locale.js?v=20261023-advising';
import {translateHomepage,translateFooter} from './translations.js?v=20261025-footer-navy';
function enhanceNavigation(){
 translateUI();
 translateFooter(language());
 const home=/\/(?:index\.html)?$/.test(location.pathname);
 if(home){translateHomepage(language());document.documentElement.lang=language()}
 for(const header of document.querySelectorAll('.site-header')){header.lang=language();const page=location.pathname.split('/').pop(),active=page==='calendar.html'?'training.html':page?.startsWith('story-')?'stories.html':page;for(const a of header.querySelectorAll('.site-nav a')){if(a.getAttribute('href')===active)a.setAttribute('aria-current','page')}}
}
new MutationObserver(enhanceNavigation).observe(document,{childList:true,subtree:true});
document.addEventListener('languagechange',enhanceNavigation);
document.addEventListener('publicready',enhanceNavigation);
document.addEventListener('click',event=>{
 const toggle=event.target.closest('.site-menu-toggle');
 if(toggle){const header=toggle.closest('.site-header'),open=!header.classList.contains('is-open');header.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));return}
 for(const header of document.querySelectorAll('.site-header.is-open'))if(!header.contains(event.target)||event.target.closest('.site-nav a'))closeMenu(header);
});
function closeMenu(header){header.classList.remove('is-open');header.querySelector('.site-menu-toggle')?.setAttribute('aria-expanded','false')}
document.addEventListener('keydown',event=>{if(event.key==='Escape')for(const header of document.querySelectorAll('.site-header.is-open')){closeMenu(header);header.querySelector('.site-menu-toggle').focus()}});
enhanceNavigation();
