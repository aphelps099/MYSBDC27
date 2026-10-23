// Local interaction mock only. File bytes are never read, stored, or transmitted.
export function createUploadWizard({open,esc,icon,onComplete}) {
 let files=[],step='files',note='',error='',timer;
 const allowed=/\.(pdf|xlsx?|csv|docx?)$/i;
 const size=n=>n<1024*1024?Math.max(1,Math.round(n/1024))+' KB':(n/1024/1024).toFixed(1)+' MB';
 const actions=(label,action,cls='btn')=>`<button type="button" class="${cls}" data-upload="${action}">${label}</button>`;
 const list=removable=>files.map((f,i)=>`<div class="upload-file"><span class="upload-file-type">${esc(f.name.split('.').pop().toUpperCase())}</span><div><strong>${esc(f.name)}</strong><small>${size(f.size)} · ${f.sample?'Sample document':'Selected on your device'}</small></div>${removable?`<button class="text-btn" data-upload="remove" data-index="${i}" aria-label="Remove ${esc(f.name)}">Remove</button>`:icon('check')}</div>`).join('');
 function render(){
 const steps=['Add documents','Review','Confirmation'];
 const n=step==='files'?0:step==='review'?1:2;
 let content='';
 if(step==='files')content=`<h2>Your documents.<br>One simple handoff.</h2><p class="muted">Dana requested your September profit and loss statement before your next session.</p><div id="file-drop" class="upload-dropzone">${icon('upload')}<h3>Drag &amp; drop your files here</h3><p>PDF, Excel, CSV, or Word<br>Up to 5 files · 10 MB each in this preview</p><label class="btn" for="document-file">Browse files</label><input class="upload-native-input" type="file" id="document-file" multiple accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"><span class="tiny">Files stay on your device in this showcase.</span></div><div class="upload-files" aria-live="polite">${list(true)}</div><p class="error" role="alert">${esc(error)}</p><div class="upload-sample">${actions('Try with sample documents','sample','text-btn')}</div><div class="actions">${actions('Review documents','review')}${actions('Cancel','cancel','text-btn')}</div>`;
 if(step==='review')content=`<h2>Ready for Dana?</h2><p class="muted">Check your documents and add a note before you finish.</p><div class="upload-recipient"><span class="avatar">DW</span><div><strong>Dana Whitfield</strong><p>North Coast SBDC · Your advisor</p></div><span class="badge">September P&amp;L</span></div><div class="upload-files">${list(false)}</div><div class="field" style="margin-top:24px"><label for="upload-note">Anything Dana should know? <span class="muted">Optional</span></label><textarea id="upload-note" maxlength="500" placeholder="For example: these are preliminary figures.">${esc(note)}</textarea></div><div class="upload-expect"><h3>What happens next</h3><p>Dana reviews the documents, then your next step updates here in MySBDC.</p></div><div class="actions">${actions('Finish preview upload','finish')}${actions('Back to documents','back','text-btn')}</div><p class="demo-note">This is a mockup. Finishing saves document names and your note in this browser; it does not send files or email.</p>`;
 if(step==='sending')content=`<h2>Finishing your handoff.</h2><p class="muted">Previewing the upload confirmation.</p><div class="upload-progress" role="progressbar" aria-label="Simulated upload progress"><span></span></div><div class="upload-files">${list(false)}</div><p class="demo-note">Animation only. No network transfer is happening.</p>`;
 if(step==='done')content=`<div class="success-mark">${icon('check')}</div><h2>All set for Dana.</h2><p class="muted">Your documents are attached to this sample request. Your next step now shows “Awaiting advisor review.”</p><div class="upload-files">${list(false)}</div><div class="upload-expect"><h3>One place to pick up again.</h3><p>When Dana returns the finished document, you’ll find it in this same place. No new account or extra sign-in.</p></div><div class="actions">${actions('Back to my dashboard','cancel')}${actions('View how it works','workflow','text-btn')}</div><p class="demo-note">Preview complete. No documents or confirmation emails were sent.</p>`;
 open('Documents for your next step',`<div id="upload-wizard"><div class="upload-steps" aria-label="Upload progress">${steps.map((s,i)=>`<span ${i===n?'aria-current="step"':''} class="${i<n?'complete':''}">${s}</span>`).join('')}</div>${content}</div>`);
 }
 function add(incoming){error='';for(const file of incoming){if(!allowed.test(file.name)){error+='Choose PDF, Excel, CSV, or Word files. ';continue}if(file.size<=0||file.size>10*1024*1024){error+='Each file must contain data and be 10 MB or smaller. ';continue}if(files.some(f=>f.name===file.name&&f.size===file.size))continue;if(files.length>=5){error+='You can add up to 5 files. ';break}files.push({name:file.name,size:file.size,sample:!!file.sample})}render()}
 function start(incoming=[]){clearTimeout(timer);files=[];note='';error='';step='files';incoming.length?add(incoming):render()}
 document.addEventListener('click',event=>{const el=event.target.closest('[data-upload]');if(!el)return;event.preventDefault();const action=el.dataset.upload;
 if(action==='sample')add([{name:'Northstar_September_PL.csv',size:211,sample:true},{name:'Northstar_Cash_Flow.xlsx',size:18640,sample:true}]);
 if(action==='remove'){files.splice(Number(el.dataset.index),1);render()}
 if(action==='review'){if(!files.length){error='Add at least one document, or try the sample documents.';render();return}step='review';render()}
 if(action==='back'){note=document.querySelector('#upload-note')?.value||note;step='files';render()}
 if(action==='finish'){note=document.querySelector('#upload-note')?.value.trim()||'';step='sending';render();timer=setTimeout(()=>{onComplete({name:files[0].name,files:files.map(f=>({...f})),note,sample:files.every(f=>f.sample),status:'received'});step='done';if(document.querySelector('#upload-wizard'))render()},650)}
 if(action==='cancel'){clearTimeout(timer);document.querySelector('#sheet').close()}
 if(action==='workflow')location.href='workflow.html#documents';
 });
 document.addEventListener('change',event=>{if(event.target.id==='document-file'&&document.querySelector('#upload-wizard'))add([...event.target.files])});
 document.addEventListener('dragover',event=>{const zone=event.target.closest('#file-drop,#nextstep-drop');if(zone){event.preventDefault();zone.classList.add('is-dragging')}});
 document.addEventListener('dragleave',event=>{const zone=event.target.closest('#file-drop,#nextstep-drop');if(zone&&!zone.contains(event.relatedTarget))zone.classList.remove('is-dragging')});
 document.addEventListener('drop',event=>{const zone=event.target.closest('#file-drop,#nextstep-drop');if(!zone)return;event.preventDefault();zone.classList.remove('is-dragging');zone.id==='nextstep-drop'?start([...event.dataTransfer.files]):add([...event.dataTransfer.files])});
 return {start};
}
