export const LOOP_DEPTH=15;
export const CONTACT_DEPTH=.58;
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function project(x,y,z,w,h){const k=Math.min(w,h)*1.08/(z+1.1);return{x:w*.5+x*k,y:h*.40+y*k,k};}
export function playerPoint(s,w,h){return{x:w*.5+s.x*w*.32,y:h*.65+s.y*h*.24};}
export function createFlight(){
 const spots=[[-.32,.38],[.28,.50],[-.24,.53],[.32,.34]];
 const books=Array.from({length:10},(_,i)=>{const interactive=i%3===0,section=interactive?i/3:null;
 const [x,y]=interactive?spots[section]:[Math.sin(i*2.399)*.68,.34+Math.cos(i*2.399)*.25];
 return{uid:interactive?'section-'+section:'npc-'+i,section,z:2.5+i*1.5,x,y,interactive,passed:false};});
 return{x:0,y:.32,books,time:0,paused:false,opening:null,cooldown:0,travel:0};
}
export function overlaps(s,b,w,h,padding=0){const p=project(b.x,b.y,b.z,w,h),c=playerPoint(s,w,h);return Math.hypot(c.x-p.x,c.y-p.y)<p.k*.235+padding;}
export function resumeFromContent(s){s.cooldown=.65;s.opening=null;for(const b of s.books)if(b.z<1.1){b.z+=LOOP_DEPTH;b.passed=false}}
export function stepFlight(s,input,seconds,w,h){
 const dt=clamp(seconds,0,.05);if(s.paused||input.modal||input.hidden)return null;
 if(s.opening){s.opening.elapsed+=dt;if(s.opening.elapsed>=1.05&&!s.opening.entered){s.opening.entered=true;return{type:'enter',section:s.opening.section}}return null;}
 let dx=input.dx||0,dy=input.dy||0;const len=Math.hypot(dx,dy);if(len>1){dx/=len;dy/=len}
 s.x=clamp(s.x+dx*dt,-1,1);s.y=clamp(s.y+dy*dt,-1,1);s.cooldown=Math.max(0,s.cooldown-dt);
 const advance=2*(input.boost?2.8:1)*dt;s.time+=dt;s.travel+=advance;
 let contact=null;
 for(const b of s.books){const before=b.z;b.z-=advance;
  if(b.interactive&&before>=CONTACT_DEPTH&&b.z<CONTACT_DEPTH&&!b.passed&&s.cooldown===0&&overlaps(s,{...b,z:CONTACT_DEPTH},w,h,8))contact=b;
  if(b.z<-.50){b.z+=LOOP_DEPTH;b.passed=false}
 }
 if(contact){contact.passed=true;contact.z=CONTACT_DEPTH;s.opening={uid:contact.uid,section:contact.section,elapsed:0,entered:false};return{type:'capture',section:contact.section};}
 return null;
}
