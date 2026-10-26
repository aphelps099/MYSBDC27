import {trainingCard} from './training-cards.js?v=20261026-calm';
import {trainings} from './data.js?v=20261023-progress';
const $=selector=>document.querySelector(selector);
let query='',topic='All topics',format='All';
$('#calendar-topic').innerHTML=['All topics',...new Set(trainings.map(t=>t.topic))].map(t=>`<option>${t}</option>`).join('');
$('#calendar-formats').innerHTML=['All','Online','In person'].map(f=>`<button class="chip" data-format="${f}" aria-pressed="${f===format}">${f}</button>`).join('');
function render(){
  document.querySelectorAll('[data-format]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.format===format)));
  const found=trainings.filter(t=>(format==='All'||t.format===format)&&(topic==='All topics'||topic===t.topic)&&`${t.title} ${t.topic} ${t.location}`.toLowerCase().includes(query.toLowerCase()));
  $('#calendar-count').textContent=`${found.length} upcoming training${found.length===1?'':'s'}`;
  $('#calendar-list').innerHTML=found.length?found.map(t=>trainingCard(t)).join(''):'<div class="no-results"><h2>No trainings match.</h2><p>Try another topic or a broader search.</p><button class="btn secondary" id="clear-calendar">Clear filters</button></div>';
}
document.addEventListener('input',event=>{
  if(event.target.id==='calendar-search'){query=event.target.value;render()}
});
document.addEventListener('change',event=>{
  if(event.target.id==='calendar-topic'){topic=event.target.value;render()}
});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-format]');
  if(button){format=button.dataset.format;render()}
  if(event.target.id==='clear-calendar'){
    query='';topic='All topics';format='All';
    $('#calendar-search').value='';$('#calendar-topic').value=topic;
    render();$('#calendar-search').focus();
  }
});
render();
