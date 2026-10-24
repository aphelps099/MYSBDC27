const KEY='mysbdc-preview-language';
export function language(){try{return localStorage.getItem(KEY)==='es'?'es':'en'}catch{return 'en'}}
export function setLanguage(value){const lang=value==='es'?'es':'en';try{localStorage.setItem(KEY,lang)}catch{}document.dispatchEvent(new CustomEvent('languagechange',{detail:lang}));return lang}
const spanish={advising:'Asesoría',training:'Capacitación',funding:'Financiamiento',stories:'Historias',about:'Nosotros',login:'Ingresar a MySBDC',start:'Comenzar',menu:'Menú',website:'Volver al sitio',brandTitle:'Tu negocio. Tu equipo. Tu próximo paso.',newBrandCopy:'Asesoría experta y apoyo práctico para tu negocio. Empieza aquí y te ayudaremos a encontrar tu próximo paso.',brandCopy:'Retoma donde lo dejaste. Tu asesoría, documentos y capacitaciones, en un solo lugar.',confidential:'Asesoría confidencial. Siempre sin costo.',welcome:'Qué gusto verte de nuevo.',welcomeCopy:'Ingresa para continuar con tu negocio.',newTitle:'Empecemos.',newCopy:'Crea tu perfil para acceder a asesoría y capacitación sin costo.',email:'Correo electrónico',emailPlaceholder:'tu@empresa.com',sendLink:'Enviarme un enlace de acceso',passwordless:'Sin contraseña. Solo un enlace seguro por correo.',orContinue:'O continúa con',continueWith:'Continuar con',newHere:'¿Aún no tienes cuenta?',createAccount:'Comenzar',haveAccount:'¿Ya tienes cuenta?',signIn:'Ingresar',help:'¿Necesitas ayuda?',helpCopy:'Comunícate con tu centro SBDC o escríbenos a info@norcalsbdc.org para obtener ayuda con tu cuenta.',preview:'Vista previa · El acceso es simulado; no se envían correos ni se crean cuentas.',tryPreview:'Usar cuenta de ejemplo',checkEmail:'Revisa tu correo.',emailReady:'En el servicio real, recibirías un enlace de acceso seguro en:',socialReady:'Continúa a MySBDC.',socialCopy:'En el servicio real, confirmarías tu cuenta con',openPreview:'Abrir vista previa de MySBDC',startProfile:'Comenzar mi perfil',backSignIn:'Volver al inicio de sesión',previewReady:'Vista previa: no se ha enviado ningún correo ni se ha conectado ninguna cuenta.',emailNew:'Tu enlace de acceso',signinLabel:'Acceso a clientes'};
export function t(key,english){return language()==='es'?(spanish[key]||english):english}
export function translateUI(root=document){const lang=language();for(const el of root.querySelectorAll('[data-i18n]')){if(!el.dataset.english)el.dataset.english=el.textContent;const value=t(el.dataset.i18n,el.dataset.english);if(el.textContent!==value)el.textContent=value;el.lang=lang}for(const el of root.querySelectorAll('[data-language]'))if(el.value!==lang)el.value=lang;for(const button of root.querySelectorAll('[data-language-choice]')){const selected=button.dataset.languageChoice===lang;if(button.getAttribute('aria-pressed')!==String(selected))button.setAttribute('aria-pressed',String(selected))}}
document.addEventListener('change',event=>{if(event.target.matches('[data-language]'))setLanguage(event.target.value)});
window.addEventListener('storage',event=>{if(event.key===KEY)document.dispatchEvent(new CustomEvent('languagechange',{detail:language()}))});

// The globe is the only closed-state control; language names live in its disclosure.
document.addEventListener('click',event=>{
 const choice=event.target.closest('[data-language-choice]');
 if(choice){setLanguage(choice.dataset.languageChoice);const picker=choice.closest('.language-control');picker.open=false;picker.querySelector('summary').focus();return}
 for(const picker of document.querySelectorAll('.language-control[open]'))if(!picker.contains(event.target))picker.open=false;
});
document.addEventListener('keydown',event=>{
 const picker=event.target.closest('.language-control');if(!picker)return;
 const options=[...picker.querySelectorAll('[data-language-choice]')];
 if(event.key==='Escape'&&picker.open){event.preventDefault();picker.open=false;picker.querySelector('summary').focus()}
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();picker.open=true;const current=options.indexOf(document.activeElement),next=current<0?(event.key==='ArrowDown'?0:options.length-1):(current+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[next].focus()}
});
