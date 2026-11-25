/* News story: the Copy link button copies the page address. */
document.addEventListener('click',e=>{const b=e.target.closest('[data-copy-link]');if(!b)return;navigator.clipboard&&navigator.clipboard.writeText(location.href).then(()=>{b.textContent='Link copied'})})
