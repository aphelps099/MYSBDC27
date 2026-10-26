// A small image-only parallax. All copy and actions remain fixed and readable.
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let photo,frame=0;
function paint(){
 frame=0;
 if(!photo?.isConnected)return;
 const image=photo.querySelector('img');
 if(motion.matches||innerWidth<=720){image.style.removeProperty('--photo-shift');return;}
 const rect=photo.getBoundingClientRect();
 if(rect.bottom<0||rect.top>innerHeight)return;
 const shift=Math.max(-18,Math.min(18,(innerHeight/2-rect.top-rect.height/2)*.06));
 image.style.setProperty('--photo-shift',`${shift.toFixed(2)}px`);
}
function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
function connect(){const next=document.querySelector('[data-parallax-photo]');if(next&&next!==photo){photo=next;schedule();}}
document.addEventListener('publicready',connect);
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',schedule,{passive:true});
motion.addEventListener('change',schedule);
connect();
