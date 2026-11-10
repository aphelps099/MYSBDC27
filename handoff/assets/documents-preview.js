/* Browser-only portal adapter for the supplied Documents component.
   Loaded only in documents-embed.html. No file bytes leave this frame or persist.
   Production must remove this adapter and provide the portal's signed-token flow. */
(function () {
  'use strict';
  const host = document.querySelector('[data-norcal-documents="window"]');
  if (!host) return;
  const origin = location.origin;
  const token = 'mysbdc-preview-' + crypto.randomUUID();
  host.setAttribute('data-token', token);
  const nativeFetch = window.fetch.bind(window);
  const encoder = new TextEncoder();
  const uploads = new Map();
  const slots = new Map();
  let session = false;
  let serial = 0;
  const id = prefix => prefix + '-' + (++serial);
  const advisor = { name: 'Dana Whitfield' };
  // One request matches the next-step note; the widget answers all listed requests on Send.
  let requests = [{ id: 'request-statement', advisorName: advisor.name, note: 'Last month’s profit and loss statement.' }];
  const documents = [
    { id: 'reviewed-plan', filename: 'Business plan, reviewed.pdf', advisorName: advisor.name, sentAt: new Date(Date.now() - 2 * 86400000).toISOString(), downloaded: false },
    { id: 'cash-flow', filename: 'Cash flow forecast.pdf', advisorName: advisor.name, sentAt: new Date(Date.now() - 9 * 86400000).toISOString(), downloaded: false }
  ];
  const json = (status, body) => new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Small, valid sample documents. They contain no uploaded data.
  function samplePdf(name) {
    const safeName = name.replace(/[^\x20-\x7e]/g, '?').replace(/([\\()])/g, '\\$1');
    const stream = 'BT /F1 16 Tf 54 740 Td (MySBDC preview: ' + safeName + ') Tj 0 -28 Td (Sample only. No client data.) Tj ET';
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
    ];
    let pdf = '%PDF-1.4\n';
    const offsets = [];
    objects.forEach((object, index) => { offsets.push(pdf.length); pdf += (index + 1) + ' 0 obj\n' + object + '\nendobj\n'; });
    const start = pdf.length;
    pdf += 'xref\n0 6\n0000000000 65535 f \n';
    offsets.forEach(offset => { pdf += String(offset).padStart(10, '0') + ' 00000 n \n'; });
    return encoder.encode(pdf + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + start + '\n%%EOF\n');
  }
  const crcTable = Array.from({length:256}, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    return value >>> 0;
  });
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function sampleZip(files) {
    const data = [], directory = [], end = [];
    const word = (out, n) => out.push(n & 255, n >>> 8 & 255);
    const long = (out, n) => { word(out, n & 65535); word(out, n >>> 16); };
    for (const file of files) {
      const name = encoder.encode(file.filename), bytes = samplePdf(file.filename), crc = crc32(bytes), offset = data.length;
      long(data, 0x04034b50); word(data,20); word(data,2048); word(data,0); word(data,0); word(data,33);
      long(data,crc); long(data,bytes.length); long(data,bytes.length); word(data,name.length); word(data,0); data.push(...name,...bytes);
      long(directory,0x02014b50); word(directory,20); word(directory,20); word(directory,2048); word(directory,0); word(directory,0); word(directory,33);
      long(directory,crc); long(directory,bytes.length); long(directory,bytes.length); word(directory,name.length); word(directory,0); word(directory,0); word(directory,0); word(directory,0); long(directory,0); long(directory,offset); directory.push(...name);
    }
    long(end,0x06054b50); word(end,0); word(end,0); word(end,files.length); word(end,files.length); long(end,directory.length); long(end,data.length); word(end,0);
    return new Uint8Array([...data,...directory,...end]);
  }
  async function download(files, zip) {
    await wait(300);
    const bytes = zip ? sampleZip(files) : samplePdf(files[0].filename);
    files.forEach(file => { file.downloaded = true; });
    return new Response(bytes, {status:200, headers:{'Content-Type': zip ? 'application/zip' : 'application/pdf'}});
  }

  window.fetch = async function (input, init = {}) {
    const url = new URL(input instanceof Request ? input.url : String(input), origin);
    const path = url.pathname;
    const portalPath = path.startsWith('/mysbdc/');
    const bucketPath = path.startsWith('/__mysbdc-preview-upload/');
    if (!portalPath && !bucketPath) return nativeFetch(input, init);
    // Fail closed for every portal/upload route on another origin.
    if (url.origin !== origin) return json(403, {error:'Preview requests stay in this browser.'});
    const method = (init.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    await wait(180);
    let body = null;
    try { body = typeof init.body === 'string' ? JSON.parse(init.body) : null; }
    catch (_) { return json(400, {error:'Invalid request'}); }
    if (method === 'POST' && path === '/mysbdc/session') {
      if (session || body?.token !== token) return json(401, {error:'Unauthorized'});
      session = true;
      return json(200, {advisor});
    }
    if (!session) return json(401, {error:'Unauthorized'});
    if (bucketPath) {
      if (method !== 'POST' || !(init.body instanceof FormData)) return json(400, {error:'Invalid file'});
      const slot = slots.get(path.split('/').pop());
      if (!slot || init.body.get('key') !== slot.id || !(init.body.get('file') instanceof Blob)) return json(400, {error:'Invalid slot'});
      await wait(450);
      // Synthetic QA convention retained from the supplied preview.
      if (slot.filename.toLowerCase().replace(/[\s_-]/g, '').includes('notsent')) return json(403, {error:'Not sent'});
      slot.arrived = true;
      return new Response(null, {status:204});
    }
    if (method === 'GET' && path === '/mysbdc/requests') return json(200, {requests});
    if (method === 'GET' && path === '/mysbdc/documents') return json(200, {documents, keepDays:90});
    if (method === 'POST' && path === '/mysbdc/uploads') {
      if (!Array.isArray(body?.files) || !body.files.length || !Array.isArray(body.requestIds)) return json(400, {error:'Files required'});
      const uploadId = id('upload');
      const files = body.files.map(file => ({id:id('file'), filename:String(file.filename), arrived:false}));
      files.forEach(file => slots.set(file.id,file));
      uploads.set(uploadId, {files, requestIds:body.requestIds});
      return json(200, {uploadId, slots:files.map(file => ({fileId:file.id, url:origin + '/__mysbdc-preview-upload/' + file.id, fields:{key:file.id}}))});
    }
    const complete = /^\/mysbdc\/uploads\/([^/]+)\/complete$/.exec(path);
    if (method === 'POST' && complete) {
      const upload = uploads.get(decodeURIComponent(complete[1]));
      if (!upload) return json(404, {error:'Not found'});
      if (!upload.files.every(file => file.arrived)) return json(409, {error:'Not all files arrived'});
      requests = requests.filter(request => !upload.requestIds.includes(request.id));
      upload.files.forEach(file => slots.delete(file.id));
      uploads.delete(complete[1]);
      return new Response(null, {status:204});
    }
    const single = /^\/mysbdc\/documents\/([^/]+)\/download$/.exec(path);
    if (method === 'POST' && single) {
      const file = documents.find(file => file.id === decodeURIComponent(single[1]));
      return file ? download([file],false) : json(404,{error:'Not found'});
    }
    if (method === 'POST' && path === '/mysbdc/documents/download') {
      const ids = new Set(body?.documentIds || []);
      const files = documents.filter(file => ids.has(file.id));
      return files.length ? download(files,true) : json(404,{error:'Not found'});
    }
    return json(404, {error:'Not found'});
  };
})();
