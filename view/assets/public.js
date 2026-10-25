import './navigation.js?v=20261025-footer-navy';
import {esc,trainings} from './data.js?v=20261023-workflow';
const current=location.pathname.split('/').pop()||'index.html';
const dialog=document.createElement('dialog');dialog.className='public-dialog';dialog.setAttribute('aria-labelledby','public-dialog-title');document.body.append(dialog);
function show(title,content){dialog.innerHTML=`<button class="close" aria-label="Close dialog">×</button><h2 id="public-dialog-title">${esc(title)}</h2>${content}`;dialog.querySelector('.close').onclick=()=>dialog.close();dialog.showModal();}
function infer(a){const t=a.textContent.trim().replace(/\s+/g,' ').toLowerCase(),section=a.closest('[data-screen-label]')?.getAttribute('data-screen-label')||'';if(a.hasAttribute('aria-label')&&a.getAttribute('aria-label').includes('home'))return 'index.html';
 const exact={advising:'advising.html',training:'training.html',funding:'funding.html',stories:'stories.html',about:'about.html',resources:'resources.html','log in':'sign-in.html'};
 if(exact[t])return exact[t];if(section==='How we help'){if(t.startsWith('advising'))return 'advising.html';if(t.startsWith('training'))return 'training.html';if(t.startsWith('funding'))return 'funding.html';}if(t.includes('start in mysbdc')||t.includes('meet your advisor')||t.includes('dream with us')||t.includes('find your sbdc')||t.includes('start with an advisor')||t.includes('apply to tech futures'))return 'sign-in.html?new=1';if(t.includes('read client stories'))return 'stories.html';if(t.includes('meet our partners')||t.includes('partner with the finance'))return 'partners.html#inquire';if(t.includes('browse all courses'))return 'dashboard.html#resources';if(t.includes('get started')||t.includes('tell us once')||t.includes('sign up for advising'))return 'sign-in.html?new=1';if(t.includes('log in'))return 'sign-in.html';if(t.includes('jump aero'))return 'story-jump-aero.html';if(t.includes('yarrow goods'))return 'story-yarrow-goods.html';if(t.includes('all success stories')||t==='see more stories')return 'stories.html';if(t.includes('advising people'))return 'advising.html';if(t.includes('training knowledge'))return 'training.html';if(t.includes('funding capital'))return 'funding.html';if(section==='Announcement'||t.includes('explore current rfps')||t.includes('funders + hosts'))return 'partners.html#inquire';if(t.includes('impact report'))return '#preview-impact';if(t.includes('save a seat'))return 'sign-in.html?training=pricing';if(section==='Upcoming trainings'){const found=trainings.find(x=>t.includes(x.title.toLowerCase()));return found?'sign-in.html?training='+found.id:'calendar.html'}if(t.includes('in your inbox'))return '#site-footer';if(t.includes('calendar')||t.includes('trainings'))return 'calendar.html';if(section==='Resource library')return 'dashboard.html#resources';return '#preview-detail';
}
function enhance(){const root=document.querySelector('#dc-root');if(!root||!root.querySelector('header'))return;for(const a of root.querySelectorAll('a[href="#"]')){a.href=infer(a)}
 for(const a of root.querySelectorAll('header nav a')){const path=new URL(a.href).pathname.split('/').pop();if(path===current){a.setAttribute('aria-current','page')}}
 for(const a of root.querySelectorAll('a[style*="background"]')){if(a.closest('header,footer'))continue;const style=a.getAttribute('style');if(style.includes('inline-flex')&&style.includes('border-radius'))a.classList.add('preview-button')}
 for(const notice of document.querySelectorAll('.preview-note'))if(!notice.closest('.site-footer'))notice.remove();
 if(current==='training.html'){for(const node of root.querySelectorAll('a'))if(node.textContent.trim()==='Free · Register in 2 minutes')node.textContent='Free · One-click registration'}
 document.dispatchEvent(new Event('publicready'));
}
const obs=new MutationObserver(enhance);obs.observe(document,{childList:true,subtree:true});enhance();
document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a)return;const hash=new URL(a.href,location.href).hash;if(hash==='#preview-impact'){event.preventDefault();const proof=document.querySelector('[data-screen-label="The proof"]');show('The impact is in the work.',`<p>${esc(proof?.innerText||'Explore the outcomes of no-fee advising across Northern California.')}</p><p>Figures shown are retained from the existing design draft.</p><a class="public-action" href="stories.html">Explore client stories</a>`)}if(hash==='#preview-detail'&&a.matches('.advising-program')){event.preventDefault();show(a.querySelector('h3').textContent,`<p>${esc(a.querySelector('p').textContent)}</p><p style="padding:15px 18px;background:#e8eff2;border-radius:7px;color:#375c70;font-size:13px">${esc(a.querySelector('.advising-program-proof').textContent)}</p><p>Your SBDC advisor can help you connect with the right specialist for your business.</p><a class="public-action" href="sign-in.html?new=1">Connect with an advisor</a>`);return}if(hash==='#preview-detail'){event.preventDefault();const section=a.closest('[data-screen-label]')?.getAttribute('data-screen-label');const title=a.querySelector('h2,h3,strong')?.textContent||a.textContent.trim().slice(0,75);show(title,`<p>${esc(a.textContent.trim())}</p><p>${section==='Story grid'?'Explore the featured stories in this preview, or see how MySBDC brings advising and practical tools together.':'Explore this part of the service through the MySBDC preview.'}</p><a class="public-action" href="${section==='On-demand'?'dashboard.html#resources':section==='Story grid'?'stories.html':'sign-in.html?new=1'}">${section==='Story grid'?'Back to stories':section==='On-demand'?'Explore resources':'Get started'}</a>`)}
 if(a.href.startsWith('mailto:')||a.href.startsWith('tel:')){event.preventDefault();show('Start a conversation.',`<p>Contact the NorCal SBDC team at <strong>info@norcalsbdc.org</strong> or <strong>(833) ASK-SBDC</strong>.</p><p>Monday–Friday, 9 AM–5 PM.</p><a class="public-action" href="sign-in.html?new=1">Explore the client journey</a>`)}
});
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||dialog.contains(button)||button.closest('[data-footer-newsletter]'))return;const t=button.textContent.trim();if(/subscribe|sign me up|join the list/i.test(t)){event.preventDefault();show('A little useful news.',`<p>Funding opportunities, practical tools, and trainings near you.</p><form id="preview-newsletter"><label for="news-email">Email address</label><input id="news-email" type="email" required placeholder="you@example.com"><button class="public-action" type="submit">Preview subscription</button></form><p style="font-size:12px">Showcase only. No subscription or email will be sent.</p>`)}});
dialog.addEventListener('submit',event=>{event.preventDefault();if(event.target.id==='preview-newsletter'){dialog.close();show('You’re on the preview list.',`<p>This shows the subscription confirmation. No email address was sent or added to a mailing list.</p><a class="public-action" href="dashboard.html">Explore MySBDC</a>`)}});
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});

// Keep the footer signup in place; this showcase never sends or stores the address.
document.addEventListener('submit', event => {
 const form=event.target.closest('[data-footer-newsletter]');
 if(!form)return;
 event.preventDefault();
 const input=form.querySelector('input');
 if(!input)return;
 input.required=true;
 if(!input.checkValidity()){input.reportValidity();return;}
 input.value='';
 form.classList.add('is-complete');
 form.querySelector('.newsletter-fields').hidden=true;
 const confirmation=form.querySelector('.newsletter-success');
 confirmation.hidden=false;
 confirmation.focus({preventScroll:true});
});
