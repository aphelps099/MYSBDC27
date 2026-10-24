import {trainings} from './data.js?v=20261023-progress';
import {trainingArtwork,trainingCard} from './training-cards.js?v=20261023-progress';
function fill(){const feature=document.querySelector('[data-training-feature]'),list=document.querySelector('[data-training-upcoming]');if(feature&&!feature.dataset.ready){feature.dataset.ready='true';feature.innerHTML=trainingArtwork(trainings[0])+`<div class="learning-card-actions"><p><strong>Oct 28 · 10:00 AM Pacific</strong><br>90 minutes · No fee</p><a class="btn small" href="sign-in.html?training=pricing">Save a seat</a></div>`;}if(list&&!list.dataset.ready){list.dataset.ready='true';list.innerHTML=[trainings[0],trainings[3],trainings[5]].map(t=>trainingCard(t)).join('');}}
document.addEventListener('publicready',fill);fill();
