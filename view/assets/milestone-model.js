export const DRAFT_KEY='mysbdc-showcase-v1-milestone-draft';
export const TODAY='2026-10-26';
export const TYPES=[
 ['start','I started my business','You opened your doors or began selling a product or service.','spark'],
 ['funding','I secured funding','Your own investment, a loan, a grant, or outside investment.','funding'],
 ['sales','My sales changed','Share your annual gross revenue and compare it with last year.','sales'],
 ['jobs','I supported jobs','New full-time or part-time hires, or existing jobs you kept.','jobs']
];
export const SOURCES=[
 ['own','My own investment','Personal funds you put into the business.'],
 ['loan','A loan or line of credit','SBA, bank, micro-loan, credit line, or equipment financing.'],
 ['grant','A business grant','An award from a public, private, or nonprofit funder.'],
 ['equity','Outside investment','Capital from an investor in exchange for ownership.'],
 ['other','Another funding source','Funding that does not fit the options above.']
];
export const LOAN_TYPES=['SBA loan','Bank loan','Micro-loan','Line of credit','Equipment financing','Other loan'];
export const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
export const freshDraft=()=>({version:1,id:crypto.randomUUID(),step:'choose',types:[],sources:[],funding:{},businessName:'',startDate:'',startEstimated:false,startActivity:'',salesYear:'2025',salesMonth:'12',salesBasis:'records',revenue:'',previousRevenue:'343000',previousUnknown:false,fullTime:'0',partTime:'0',retainedFull:'0',retainedPart:'0',jobsFrom:'',jobsDate:'',jobsNotes:'',support:'',story:'',contact:false,name:'',confirmed:false});
export function steps(d){return ['choose',...(d.types.includes('start')?['start']:[]),...(d.types.includes('funding')?['sources',...SOURCES.filter(([s])=>d.sources.includes(s)).map(([s])=>'funding-'+s)]:[]),...(d.types.includes('sales')?['sales']:[]),...(d.types.includes('jobs')?['jobs']:[]),'context','review'];}
export const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(n));
export function numeric(v){const s=String(v??'').trim().replace(/[$,\s]/g,'');return /^\d+(\.\d{1,2})?$/.test(s)?Number(s):NaN;}
const dateValid=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&v>='1900-01-01'&&v<=TODAY&&!Number.isNaN(Date.parse(v+'T12:00:00'))&&new Date(v+'T12:00:00Z').toISOString().slice(0,10)===v;
const optionalRow=(label,value)=>value?[[label,value]]:[];
const basisLabels={records:'Bookkeeping / profit & loss statement',tax:'Business tax return',estimate:'Best estimate — needs confirmation'};
export function validate(d,step){
 if(step==='choose'&&!d.types.length)return 'Choose at least one area of progress.';
 if(step==='start'){
  if(!d.businessName?.trim())return 'Add the name of the business you started.';
  if(!dateValid(d.startDate))return 'Add a business start date on or before October 26, 2026.';
 }
 if(step==='sources'&&!d.sources.length)return 'Choose at least one funding source, or go back and remove funding.';
 if(step.startsWith('funding-')){
  const k=step.slice(8),f=d.funding[k]||{};
  if(k==='loan'&&!LOAN_TYPES.includes(f.loanType))return 'Choose the type of loan or financing you secured.';
  if(!Number.isFinite(numeric(f.amount))||!(numeric(f.amount)>0))return 'Enter a funding amount greater than zero, with no more than two decimal places.';
  if(k!=='own'&&!['approved','received'].includes(f.status))return 'Choose whether the funding is approved or already received.';
  if(!dateValid(f.date))return 'Add the approval or investment date, on or before October 26, 2026.';
 }
 if(step==='sales'){
  if(!['2024','2025'].includes(d.salesYear))return 'Choose a completed fiscal year.';
  if(!/^(?:[1-9]|1[0-2])$/.test(String(d.salesMonth)))return 'Choose the month your fiscal year ends.';
  if(!Number.isFinite(numeric(d.revenue)))return 'Enter your gross revenue as zero or a positive amount.';
  if(!d.previousUnknown&&!Number.isFinite(numeric(d.previousRevenue)))return 'Enter last year’s gross revenue, or select “I don’t have the previous year’s figure.”';
  if(!basisLabels[d.salesBasis])return 'Choose where these revenue figures came from.';
 }
 if(step==='jobs'){
  const keys=['fullTime','partTime','retainedFull','retainedPart'],counts=keys.map(k=>Number(d[k]));
  if(counts.some((n,i)=>!/^\d+$/.test(String(d[keys[i]]))||!Number.isSafeInteger(n)||n<0||n>1000000)||!counts.some(n=>n>0))return 'Enter whole numbers, with at least one job created or retained.';
  if(!dateValid(d.jobsDate))return 'Add an as-of date on or before October 26, 2026.';
  if(d.jobsFrom&&(!dateValid(d.jobsFrom)||d.jobsFrom>d.jobsDate))return 'The beginning of your jobs update must be on or before the as-of date.';
 }
 if(step==='context'&&!['yes','partly','unsure','no'].includes(d.support))return 'Choose how SBDC contributed. “Not sure” is okay.';
 if(step==='review'){
  if(!d.name.trim())return 'Add your name to confirm this sample update.';
  if(!d.confirmed)return 'Confirm that you have reviewed your sample information.';
 }
 return '';
}
export function reviewGroups(d){const list=[];
 if(d.types.includes('start'))list.push({step:'start',title:'Business launched',rows:[['Started doing business',d.startDate+(d.startEstimated?' (approximate)':'')],['Business name',d.businessName],...optionalRow('What you launched',d.startActivity)]});
 if(d.types.includes('funding'))for(const [key,label] of SOURCES.filter(([k])=>d.sources.includes(k))){
  const f=d.funding[key]||{};
  list.push({step:'funding-'+key,title:label,rows:[['Amount',money(numeric(f.amount))],...optionalRow('Financing type',f.loanType),...(key==='own'?[]:[['Status',f.status==='received'?'Funds received':'Approved / committed']]),[key==='own'?'Date invested':'Date approved / committed',f.date],...optionalRow('Source / provider',f.provider),...optionalRow('Use of funding',f.purpose)]});
 }
 if(d.types.includes('sales')){
  const current=numeric(d.revenue),prior=numeric(d.previousRevenue),diff=current-prior;
  list.push({step:'sales',title:'Sales & revenue',rows:[[`${d.salesYear} gross revenue`,money(current)],['Fiscal year ends',MONTHS[Number(d.salesMonth)-1]],...(d.previousUnknown?[[`${Number(d.salesYear)-1} gross revenue`,'Not available — advisor follow-up']]:[[`${Number(d.salesYear)-1} gross revenue`,money(prior)],['Change',`${diff<0?'−':'+'}${money(Math.abs(diff))}${prior>0?' ('+(diff/prior*100).toFixed(1)+'%)':''}`]]),['Figures based on',basisLabels[d.salesBasis]]]});
 }
 if(d.types.includes('jobs'))list.push({step:'jobs',title:'People & jobs',rows:[['New full-time jobs',d.fullTime],['New part-time jobs',d.partTime],['Full-time jobs retained',d.retainedFull],['Part-time jobs retained',d.retainedPart],...optionalRow('Since',d.jobsFrom),['As of',d.jobsDate],...optionalRow('Jobs context',d.jobsNotes)]});
 list.push({step:'context',title:'Your SBDC experience',rows:[['SBDC contributed',{yes:'Yes',partly:'In part',unsure:'Not sure',no:'No'}[d.support]],...optionalRow('Your note',d.story),['Story follow-up',d.contact?'You may contact me first':'No story contact requested']]});
 return list;
}
export function toRecord(d){
 const sources=SOURCES.filter(([k])=>d.sources.includes(k)).map(([k])=>k),total=sources.reduce((n,k)=>n+numeric(d.funding[k]?.amount),0);
 const created=Number(d.fullTime)+Number(d.partTime),retained=Number(d.retainedFull)+Number(d.retainedPart),bits=[];
 if(d.types.includes('start'))bits.push('Business launched');
 if(d.types.includes('funding'))bits.push(money(total)+' in funding');
 if(d.types.includes('sales'))bits.push(money(numeric(d.revenue))+' annual revenue');
 if(d.types.includes('jobs'))bits.push(`${created} job${created===1?'':'s'} created · ${retained} retained`);
 return {id:d.id,date:TODAY,title:bits.join(' · '),detail:d.story||'Your business progress, captured in one place.',preview:true,status:'preview-review-pending',reportedAt:new Date().toISOString(),values:{
  ...(d.types.includes('start')?{businessStarted:d.startDate,businessName:d.businessName,startEstimated:!!d.startEstimated,startActivity:d.startActivity}:{}),
  ...(d.types.includes('funding')?{funding:total,fundingSources:Object.fromEntries(sources.map(k=>[k,{...d.funding[k],amount:numeric(d.funding[k].amount)}]))}:{}),
  ...(d.types.includes('sales')?{salesYear:Number(d.salesYear),salesMonth:Number(d.salesMonth),salesBasis:d.salesBasis,revenue:numeric(d.revenue),previousRevenue:d.previousUnknown?null:numeric(d.previousRevenue),sales:d.previousUnknown?null:numeric(d.revenue)-numeric(d.previousRevenue)}:{}),
  ...(d.types.includes('jobs')?{jobs:created,fullTime:Number(d.fullTime),partTime:Number(d.partTime),retainedFull:Number(d.retainedFull),retainedPart:Number(d.retainedPart),jobsFrom:d.jobsFrom,jobsDate:d.jobsDate,jobsNotes:d.jobsNotes}:{})
 },sbdcContribution:d.support,storyContact:d.contact,confirmedBy:d.name.trim(),review:reviewGroups(d)};
}
