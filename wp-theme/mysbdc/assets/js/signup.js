/* Preview only: no submission API, authentication, or browser storage. */
(() => {
  const programs = {
    general: ['Business advising', 'A starting point for your business questions.', 'https://www.norcalsbdc.org/services/'],
    capital: ['Certified Capital Advisors', 'Support with financing readiness and your sources of capital.', 'https://www.norcalsbdc.org/sbdc-finance-center/'],
    tfg: ['Tech Futures Group', 'Specialized support for technology founders and startups.', 'https://www.norcalsbdc.org/services/regional/tfg/'],
    probiz: ['ProBiz', 'Support with contracting readiness, bid preparation, and certifications.', 'https://www.norcalsbdc.org/services/'],
    eats: ['EATS — Food & Hospitality', 'Business support from food and hospitality specialists.', 'https://www.norcalsbdc.org/restaurant-program/'],
    manufacturing: ['Manufacturing Program', 'Support for production, operations, and business growth.', 'https://www.norcalsbdc.org/services/'],
    ai: ['AI Advising', 'Practical help applying AI to everyday business work.', 'https://www.norcalsbdc.org/services/'],
    aws: ['AWS Small Business Acceleration Initiative', 'Explore cloud and AI implementation support through participating partners.', 'https://www.norcalsbdc.org/services/'],
    apex: ['NorCal APEX Accelerator', 'Specialized help navigating government contracting.', 'https://www.norcalsbdc.org/services/regional/ptac/'],
    vboc: ['NorCal VBOC', 'Business support for veterans and military-connected entrepreneurs.', 'https://www.norcalsbdc.org/services/']
  };
  const $ = id => document.getElementById(id);
  const form = $('signup-form');
  const select = $('program');
  const summary = $('error-summary');
  let step = 1;
  const requested = new URLSearchParams(location.search).get('program');
  if (requested && Object.hasOwn(programs, requested)) select.value = requested;
  const existing = () => form.elements.client.value === 'existing';
  const currentProgram = () => programs[select.value] || programs.general;
  function syncProgram() {
    const [name, description, url] = currentProgram();
    $('context-name').textContent = name;
    $('context-description').textContent = description;
    $('program-source').href = url;
    document.title = `${name} — Get started with MySBDC`;
    // Only public program identifiers appear in the URL, never contact details.
    const next = new URL(location.href);
    next.search = '';
    next.searchParams.set('program', select.value);
    history.replaceState(null, '', next);
  }
  function syncClient() {
    const isExisting = existing();
    $('new-client-fields').hidden = isExisting;
    $('business-fields').hidden = isExisting;
    ['first-name', 'last-name', 'zip'].forEach(id => { $(id).disabled = isExisting; $(id).required = !isExisting; });
    $('business').disabled = isExisting;
    $('step-two-title').textContent = isExisting ? 'Let’s keep you connected.' : 'A little about you.';
    $('details-intro').textContent = isExisting ? 'Use the email already connected to your SBDC account. No new intake in this preview.' : 'All fields are required unless marked optional.';
    $('email-help').textContent = isExisting ? 'Use the email you’ve used with SBDC before.' : 'Use an address where your advisor can reach you.';
  }
  function clearErrors() {
    summary.hidden = true;
    $('error-list').replaceChildren();
    form.querySelectorAll('[aria-invalid]').forEach(field => {
      field.removeAttribute('aria-invalid');
      const ids = (field.getAttribute('aria-describedby') || '').split(' ').filter(id => id && !id.endsWith('-error'));
      if (ids.length) field.setAttribute('aria-describedby', ids.join(' ')); else field.removeAttribute('aria-describedby');
    });
    form.querySelectorAll('.field-error').forEach(el => { el.hidden = true; el.textContent = ''; });
  }
  function validate() {
    clearErrors();
    const errors = [];
    if (!existing()) {
      if (!$('first-name').value.trim()) errors.push(['first-name', 'Enter your first name.']);
      if (!$('last-name').value.trim()) errors.push(['last-name', 'Enter your last name.']);
      if (!/^[0-9]{5}$/.test($('zip').value.trim())) errors.push(['zip', 'Enter a five-digit ZIP code.']);
    }
    $('email').value = $('email').value.trim();
    if (!$('email').value || !$('email').validity.valid) errors.push(['email', 'Enter a valid email address.']);
    for (const [id, message] of errors) {
      const field = $(id), error = $(`${id}-error`);
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
      error.textContent = message; error.hidden = false;
      const li = document.createElement('li'), a = document.createElement('a');
      a.href = `#${id}`; a.textContent = message;
      a.addEventListener('click', event => { event.preventDefault(); field.focus(); });
      li.append(a); $('error-list').append(li);
    }
    if (errors.length) { summary.hidden = false; summary.focus(); return false; }
    return true;
  }
  function addRow(root, label, value) {
    const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = value; row.append(dt, dd); root.append(row);
  }
  function renderReview() {
    const root = $('review-list'); root.replaceChildren();
    addRow(root, 'Support', currentProgram()[0]);
    addRow(root, 'Your path', existing() ? 'Existing SBDC client' : 'New to SBDC');
    if (!existing()) addRow(root, 'Name', `${$('first-name').value.trim()} ${$('last-name').value.trim()}`);
    addRow(root, 'Email', $('email').value);
    if (!existing()) {
      if ($('business').value.trim()) addRow(root, 'Business', $('business').value.trim());
      addRow(root, 'ZIP code', $('zip').value.trim());
    }
    if ($('notes').value.trim()) addRow(root, 'Your question', $('notes').value.trim());
    $('review-next').textContent = existing() ? 'Proposed next step: verify your account, then send the program request using your existing client record.' : 'Proposed next step: complete the required SBDC intake and consent, with your program choice already attached. Program eligibility is reviewed by the team.';
  }
  function renderComplete() {
    const root = $('completion-summary'); root.replaceChildren();
    addRow(root, 'Selected support', currentProgram()[0]);
    addRow(root, 'Your path', existing() ? 'Existing client — additional support' : 'New client — intake next');
    if (existing()) {
      $('completion-copy').textContent = `For help now, contact your current advisor about ${currentProgram()[0]}. You can also contact the network for assistance.`;
      $('live-next').textContent = 'Contact the SBDC team';
      $('live-next').href = 'mailto:info@norcalsbdc.org';
    } else if (select.value === 'aws') {
      $('completion-copy').textContent = 'The AWS initiative has a separate partner inquiry. Start an email to the AWS team to discuss your needs. Nothing from this preview is included.';
      $('live-next').textContent = 'Email the AWS program team';
      $('live-next').href = 'mailto:aws-sbdc@amazon.com?subject=AWS%20SBDC%20Inquiry';
    } else {
      $('completion-copy').textContent = 'To request services now, use the live SBDC signup. This preview does not transfer your details or program selection; mention your chosen program when you sign up.';
      $('live-next').textContent = 'Continue to live SBDC signup';
      $('live-next').href = 'https://www.norcalsbdc.org/join/';
    }
  }
  function show(next, focus = true) {
    step = next; clearErrors();
    form.querySelectorAll('[data-step]').forEach(panel => panel.hidden = Number(panel.dataset.step) !== step);
    $('step-label').hidden = step === 4;
    $('step-label').textContent = `Step ${step} of 3 · ${['', 'Find your path', 'Your details', 'Review'][step] || ''}`;
    if (step === 2) syncClient();
    if (step === 3) renderReview();
    if (step === 4) renderComplete();
    if (focus) form.querySelector(`[data-step="${step}"] h2`).focus();
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (step === 1) show(2);
    else if (step === 2 && validate()) show(3);
    else if (step === 3) show(4);
  });
  form.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => show(step - 1)));
  select.addEventListener('change', syncProgram);
  form.querySelectorAll('[name=client]').forEach(radio => radio.addEventListener('change', syncClient));
  $('restart').addEventListener('click', () => { form.reset(); syncProgram(); syncClient(); show(1); });
  syncProgram(); syncClient(); show(1, false); form.hidden = false;
})();
