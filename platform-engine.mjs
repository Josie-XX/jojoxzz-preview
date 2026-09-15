export const W=1008,H=648,FLOOR=560;
export const stairs=[{x:520,y:492,w:472},{x:610,y:424,w:382},{x:700,y:356,w:292},{x:790,y:288,w:202}];
export const portals=stairs.map((p,i)=>({x:p.x+p.w-26,y:p.y-22,section:i}));
export const challenges=[430];
export let FAILURE_END=1120,FAILURE_PIT=835,FAILURE_PIT_END=945;
export let caveTerrain=[{x:0,y:FLOOR,w:835,base:true},{x:945,y:FLOOR,w:175,base:true}];
export let caveRocks=[{x:430,y:FLOOR}],caveSpawn={x:100,y:FLOOR};
export function configureCave(c){if(!c)return;caveTerrain=c.terrain;caveRocks=c.rocks;caveSpawn=c.spawn;FAILURE_END=c.width;challenges.splice(0,challenges.length,...c.rocks.map(r=>r.x));const base=c.terrain.filter(p=>p.base).sort((a,b)=>a.x-b.x);const pair=base.findIndex((p,i)=>base[i+1]&&p.x+p.w<base[i+1].x);FAILURE_PIT=pair>=0?base[pair].x+base[pair].w:c.width;FAILURE_PIT_END=pair>=0?base[pair+1].x:c.width;}
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function createGame(){return{scene:'home',x:94,y:FLOOR,vx:0,vy:0,face:1,grounded:true,started:false,time:0,form:'ditto',paused:false,opening:null,attack:null,broken:[],cloud:null,cooldown:0,camera:0,coyote:.1,jumpBuffer:0};}
export function returnHome(s){Object.assign(s,{scene:'home',x:415,y:FLOOR,vx:0,vy:0,grounded:true,started:true,form:'ditto',opening:null,attack:null,cloud:null,cooldown:.7,camera:0,paused:false});}
export function enterFailure(s){Object.assign(s,{scene:'failure',x:caveSpawn.x,y:caveSpawn.y,vx:0,vy:0,grounded:true,started:true,form:'ditto',opening:null,attack:null,cloud:null,camera:0,paused:false});}
export function resumeContent(s){s.ignoredPortal=s.opening?.section??null;s.opening=null;s.cooldown=0;s.vx=0;s.vy=0;}
export function stepGame(s,input,seconds){
 const dt=clamp(seconds,0,1/30);if(input.modal||input.hidden||s.paused)return null;s.time+=dt;
 if(s.cloud!==null)return null;
 if(s.opening){s.opening.t+=dt;if(s.opening.t>=.95&&!s.opening.done){s.opening.done=true;return{type:'page',section:s.opening.section}}return null;}
 if(s.attack){s.attack.t+=dt;if(s.attack.t>=.24&&!s.attack.hit){s.attack.hit=true;if(!s.broken.includes(s.attack.index))s.broken.push(s.attack.index);}if(s.attack.t>=.7){s.cloud=s.attack.index;s.attack=null;return{type:'cloud',index:s.cloud}}return null;}
 const dir=(input.right?1:0)-(input.left?1:0);if(dir){s.started=true;s.face=dir;}if(!s.started)return null;
 if(input.transform&&s.scene==='failure')s.form='riolu';
 if(input.action&&s.scene==='failure'&&s.form==='riolu'){
  const i=challenges.findIndex((x,j)=>!s.broken.includes(j)&&Math.abs(x-s.x)<185&&Math.abs(s.y-caveRocks[j].y)<70&&(x-s.x)*s.face>0);
  if(i>=0){s.attack={index:i,t:0,hit:false};s.vx=0;return{type:'attack',index:i}}
 }
 s.cooldown=Math.max(0,s.cooldown-dt);s.coyote=s.grounded?.10:Math.max(0,s.coyote-dt);
 if(input.jump)s.jumpBuffer=.12;else s.jumpBuffer=Math.max(0,s.jumpBuffer-dt);
 if(s.jumpBuffer>0&&s.coyote>0){s.vy=-470;s.grounded=false;s.coyote=0;s.jumpBuffer=0;}
 s.vx=dir*(input.run?220:180);const oldY=s.y;
 s.x=clamp(s.x+s.vx*dt,20,s.scene==='home'?W-20:FAILURE_END-25);
 if(s.scene==='failure')for(let i=0;i<challenges.length;i++){if(s.broken.includes(i))continue;const x=challenges[i],y=caveRocks[i].y;if(s.y>y-180&&s.y<y+48&&Math.abs(s.x-x)<147)s.x=s.vx>=0?x-147:x+147;}
 s.vy+=1250*dt;s.y+=s.vy*dt;s.grounded=false;
 const floors=(s.scene==='home'?[{x:0,y:FLOOR,w:278},{x:382,y:FLOOR,w:W-382},...stairs]:caveTerrain).slice().sort((a,b)=>a.y-b.y);
 if(s.scene==='failure')for(const p of floors){if(!p.solid||oldY<=p.y+2)continue;if(s.x+12>p.x&&s.x-12<p.x+p.w&&oldY<p.y+648)s.x=s.vx>=0?p.x-12:p.x+p.w+12;}
 if(s.vy>=0)for(const p of floors){if(s.x+12>p.x&&s.x-12<p.x+p.w&&oldY<=p.y+.5&&s.y>=p.y){s.y=p.y;s.vy=0;s.grounded=true;break;}}
 if(s.y>H+70){if(s.scene==='home'){enterFailure(s);return{type:'failure'}}returnHome(s);return{type:'home'};}
 if(s.scene==='home'&&s.cooldown===0&&s.grounded){const ignored=portals[s.ignoredPortal];if(ignored&&Math.hypot(s.x-ignored.x,s.y-18-ignored.y)>65)s.ignoredPortal=null;const p=portals.find(p=>p.section!==s.ignoredPortal&&Math.hypot(s.x-p.x,s.y-18-p.y)<28);if(p){s.opening={section:p.section,t:0,done:false,x:s.x,y:s.y};s.vx=0;return{type:'capture',section:p.section}}}
 s.camera=s.scene==='failure'?clamp(s.x-300,0,FAILURE_END-W):0;
 return null;
}
