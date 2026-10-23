import assert from 'node:assert/strict';
import {createUploadWizard} from '../assets/upload-wizard.js';
import {esc} from '../assets/data.js';
// Exercise real wizard transitions using metadata-only files, without a browser/network.
const listeners={};let html='',result=null,note='';
globalThis.document={addEventListener:(type,fn)=>listeners[type]=fn,querySelector:selector=>selector==='#upload-note'?{value:note}:selector==='#upload-wizard'?{}:null};
const wizard=createUploadWizard({open:(_,value)=>html=value,esc,icon:()=>'',onComplete:value=>result=value});
const file=(name,size=100)=>({name,size,get arrayBuffer(){throw new Error('File contents must never be accessed')}});
const click=(action,index)=>listeners.click({preventDefault(){},target:{closest:()=>({dataset:{upload:action,index}})}});
wizard.start();click('review');assert.match(html,/Add at least one document/);
wizard.start([file('bad.exe'),file('empty.csv',0),file('oversize.pdf',11*1024*1024)]);assert.doesNotMatch(html,/class="upload-file"/);assert.match(html,/10 MB or smaller/);
wizard.start([file('<img>.csv'),file('<img>.csv'),...Array.from({length:5},(_,i)=>file(`doc${i}.pdf`))]);assert.equal((html.match(/class="upload-file"/g)||[]).length,5);assert.match(html,/&lt;img&gt;\.csv/);assert.doesNotMatch(html,/<img>/);assert.match(html,/up to 5 files/);
click('remove','0');assert.equal((html.match(/class="upload-file"/g)||[]).length,4);
click('review');note='Sample client note';click('back');click('review');assert.match(html,/Sample client note/);
click('finish');await new Promise(resolve=>setTimeout(resolve,750));assert.equal(result.files.length,4);assert.equal(result.status,'received');assert.equal(result.note,'Sample client note');assert.match(html,/All set for Dana/);assert.equal(result.files[0].arrayBuffer,undefined);
// The same metadata checks run for a drag-and-drop entry on the dashboard.
const zone={id:'nextstep-drop',classList:{remove(){}}};listeners.drop({preventDefault(){},target:{closest:()=>zone},dataTransfer:{files:[file('dropped.pdf')]}});assert.match(html,/dropped.pdf/);assert.match(html,/Your documents/);
console.log('PASS: empty/invalid/oversized files, deduplication, limit, escaping, removal, review/back, persistence callback, and drop entry. No file bytes read.');
