/* Run with: node --test handoff/tests/documents-preview.test.cjs */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto').webcrypto;
const source = fs.readFileSync(require('node:path').join(__dirname,'../assets/documents-preview.js'),'utf8');
function portal() {
  let token;
  let nativeCalls = 0;
  const context = {
    document:{querySelector:()=>({setAttribute:(_,value)=>{token=value;}})},
    location:{origin:'https://preview.example'}, crypto, TextEncoder, URL, Request, Response, FormData, Blob,
    setTimeout:callback=>callback(),
    window:{fetch:async()=>{nativeCalls++; return new Response('asset');}}
  };
  vm.runInNewContext(source,context);
  const call=(path,body,origin='https://preview.example')=>context.window.fetch(origin+path,{method:body===undefined?'GET':'POST',...(body===undefined?{}:{body:JSON.stringify(body)})});
  const put=slot=>{const body=new FormData();body.append('key',slot.fields.key);body.append('file',new Blob(['synthetic sample']),'sample.csv');return context.window.fetch(slot.url,{method:'POST',body});};
  return {context,call,put,token,nativeCalls:()=>nativeCalls};
}
test('preview requires its one-use session and isolates all upload traffic',async()=>{
  const p=portal();
  assert.equal((await p.call('/mysbdc/requests')).status,401);
  assert.equal((await p.call('/mysbdc/session',{token:'wrong'})).status,401);
  assert.equal((await p.call('/mysbdc/session',{token:p.token})).status,200);
  assert.equal((await p.call('/mysbdc/session',{token:p.token})).status,401);
  assert.equal((await p.call('/mysbdc/uploads',{files:[],requestIds:[]})).status,400);
  assert.equal((await p.call('/mysbdc/uploads',{},'https://outside.example')).status,403);
  assert.equal(p.nativeCalls(),0);
});
test('request stays open after a failed file; only a completed upload clears it',async()=>{
  const p=portal(); await p.call('/mysbdc/session',{token:p.token});
  const create=filename=>p.call('/mysbdc/uploads',{files:[{filename,contentType:'text/csv',size:16}],requestIds:['request-statement']}).then(r=>r.json());
  const bad=await create('notsent.csv');
  assert.equal((await p.put(bad.slots[0])).status,403);
  assert.equal((await p.call('/mysbdc/uploads/'+bad.uploadId+'/complete',{})).status,409);
  assert.equal((await (await p.call('/mysbdc/requests')).json()).requests.length,1);
  const good=await create('sample.csv');
  assert.equal((await p.put(good.slots[0])).status,204);
  assert.equal((await p.call('/mysbdc/uploads/'+good.uploadId+'/complete',{})).status,204);
  assert.equal((await (await p.call('/mysbdc/requests')).json()).requests.length,0);
  assert.equal(p.nativeCalls(),0);
});
test('download endpoints return sample PDF and ZIP data without uploaded content',async()=>{
  const p=portal(); await p.call('/mysbdc/session',{token:p.token});
  const list=await (await p.call('/mysbdc/documents')).json();
  const pdf=await p.call('/mysbdc/documents/'+list.documents[0].id+'/download',{});
  assert.equal(pdf.headers.get('content-type'),'application/pdf');
  assert.match(await pdf.text(),/^%PDF-1\.4[\s\S]*Sample only. No client data/);
  const zip=await p.call('/mysbdc/documents/download',{documentIds:list.documents.map(d=>d.id)});
  assert.equal(zip.headers.get('content-type'),'application/zip');
  const bytes=new Uint8Array(await zip.arrayBuffer());
  assert.deepEqual([...bytes.slice(0,4)],[80,75,3,4]);
  assert.deepEqual([...bytes.slice(-22,-18)],[80,75,5,6]);
  assert.equal(new DataView(bytes.buffer).getUint16(bytes.length-12,true),2);
  assert.equal(p.nativeCalls(),0);
});
