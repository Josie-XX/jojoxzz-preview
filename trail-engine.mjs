export const TW=1008,TH=648,BASE=526,MAX_HEALTH=10;
// Disjoint casts, supplemented from the rest of the original 151 species.
const featured=[[1,25,35,39,52,113,133,147],[4,63,81,100,122,137,150],[7,23,58,66,83,95,123,149],[12,37,54,77,86,92,120,131,151]];
const assigned=new Set(featured.flat());
export const casts=featured.map((ids,t)=>[...ids,...Array.from({length:151},(_,i)=>i+1).filter(id=>!assigned.has(id)&&id%4===t)]);
export const layouts=[
 {name:'meadow',stride:640,heights:[0,64,128,64],gaps:[116,204,136,228],pitOffset:190,step:64,plank:124},
 {name:'towers',stride:720,heights:[128,192,64,160],gaps:[236,148,260,164],pitOffset:225,step:64,plank:92},
 {name:'islands',stride:780,heights:[64,176,112,224],gaps:[280,244,300,220],pitOffset:250,step:56,plank:80},
 {name:'terraces',stride:680,heights:[96,0,144,48],gaps:[144,220,128,244],pitOffset:205,step:48,plank:148}
];
export function buildTrail(records,theme=0,variant=0){
 theme=((theme%4)+4)%4;const original=layouts[theme];
 const variants=[null,{stride:original.stride+40,heights:[32,96,160,96],gaps:original.gaps.map(n=>Math.round(n*.8))},{stride:original.stride+100,heights:[64,192,112,224],gaps:original.gaps.map(n=>Math.round(n*1.08))},{stride:original.stride+60,heights:[0,80,160,224],gaps:original.gaps.map(n=>Math.round(n*.95))}];
 const layout={...original,...variants[variant%4]};let npcIndex=0,propIndex=0;
 // Keep editorial order; dates and academic stages never affect placement.
 const sorted=records.map((r,index)=>({...r,index}));
 const items=sorted.map((r,i)=>{const kind=r.kind==='image'?'image':i%2===0?'npc':'item';return{...r,sourceKind:r.kind,kind,npc:kind==='npc'?casts[theme][npcIndex++%casts[theme].length]:null,berry:kind!=='npc'?theme*6+propIndex++%6:null,x:320+i*layout.stride,y:BASE-layout.heights[i%4]};});
 const width=Math.max(1900,items.length*layout.stride+650),pits=[];
 for(let i=0,x=320+layout.pitOffset;x<width-650;i++,x+=layout.stride)pits.push({x,w:layout.gaps[i%4]});
 const terrain=[];let start=0;
 for(const pit of pits){terrain.push({x:start,y:BASE,w:pit.x-start,base:true});start=pit.x+pit.w;}
 terrain.push({x:start,y:BASE,w:width-start,base:true});
 for(const [i,pit] of pits.entries())if(pit.w>180){
  if(theme===2){terrain.push({x:pit.x+55,y:BASE-48,w:66,platform:true},{x:pit.x+pit.w-100,y:BASE-88,w:64,platform:true});}
  else terrain.push({x:pit.x+Math.round(pit.w/2)-38,y:BASE-[32,64,48,24][theme],w:76,platform:true});
 }
 const spots=items.length?items:[{x:920,y:BASE-layout.heights.find(h=>h>0)}];
 for(const item of spots){if(item.y===BASE)continue;
  const height=BASE-item.y,steps=Math.ceil(height/layout.step);
  for(let j=1;j<=steps;j++){
   const y=BASE-Math.min(j*layout.step,height),x=item.x-(steps-j)*88-30;
   const solid=theme===3||(theme===0&&steps===1);
   terrain.push({x,y,w:layout.plank,platform:!solid,solid});
  }
 }
 return{items,width,terrain,pits,theme,layout:layout.name,finish:{flagX:width-340,portalX:width-95,y:BASE}};
}
export function newWalker(){return{x:110,y:BASE,vx:0,vy:0,face:1,grounded:true,camera:0,time:0,coyote:.1,buffer:0,paused:false,health:MAX_HEALTH,gameOver:false,checkpoint:{x:110,y:BASE},hurt:0,encounterLatch:null,returning:null};}
export function capturePose(s,world){if(!s.returning)return{x:s.x,y:s.y,scale:1,alpha:1,open:0};const t=s.returning.t,p=Math.max(0,Math.min(1,(t-.2)/.65)),ease=p*p*(3-2*p);return{x:s.returning.x+(world.finish.portalX-s.returning.x)*ease,y:s.returning.y+(world.finish.y-12-s.returning.y)*ease,scale:1-.97*ease,alpha:1-ease,open:t<.85?Math.min(1,t/.2):Math.max(0,1-(t-.85)/.2)};}
export function nearestItem(s,world){return world.items.filter(r=>Math.abs(r.x-s.x)<66&&Math.abs(r.y-s.y)<43).sort((a,b)=>Math.abs(a.x-s.x)-Math.abs(b.x-s.x))[0]??null;}
export function advanceWalker(s,world,input,dt){
 if(input.blocked||s.paused||s.gameOver)return;
 dt=Math.min(dt,1/30);s.time+=dt;s.hurt=Math.max(0,s.hurt-dt);
 if(s.returning){s.returning.t+=dt;if(s.returning.t>=1.1&&!s.returning.done){s.returning.done=true;return{type:'home'};}return;}
 const dir=Number(!!input.right)-Number(!!input.left);if(dir)s.face=dir;s.vx=dir*(input.run?250:195);
 s.coyote=s.grounded?.12:Math.max(0,s.coyote-dt);s.buffer=input.jump?.13:Math.max(0,s.buffer-dt);
 if(s.buffer>0&&s.coyote>0){s.vy=-485;s.buffer=0;s.coyote=0;s.grounded=false;}
 const oldY=s.y;let nx=Math.max(20,Math.min(world.width-25,s.x+s.vx*dt));
 for(const p of world.terrain){if(!p.solid||s.y<=p.y+2)continue;if(nx+13>p.x&&nx-13<p.x+p.w){if(s.x+13<=p.x+1)nx=p.x-13;else if(s.x-13>=p.x+p.w-1)nx=p.x+p.w+13;}}
 s.x=nx;s.vy+=1200*dt;s.y+=s.vy*dt;s.grounded=false;
 if(s.vy>=0){const floors=world.terrain.filter(p=>s.x+12>p.x&&s.x-12<p.x+p.w&&oldY<=p.y+.5&&s.y>=p.y).sort((a,b)=>a.y-b.y);if(floors[0]){
  const floor=floors[0];s.y=floor.y;s.vy=0;s.grounded=true;
  if(s.x>floor.x+36&&s.x<floor.x+floor.w-36)s.checkpoint={x:s.x,y:s.y};
 }}
 if(s.y>TH+60){s.health=Math.max(0,s.health-1);s.gameOver=s.health===0;Object.assign(s,{x:s.checkpoint.x,y:s.checkpoint.y,vx:0,vy:0,grounded:true,coyote:0,buffer:0,hurt:1.4,encounterLatch:null});s.camera=Math.max(0,Math.min(world.width-TW,s.x-TW*.34));return{type:s.gameOver?'gameover':'fall'};}
 s.camera=Math.max(0,Math.min(world.width-TW,s.x-TW*.34));
 if(s.grounded&&Math.abs(s.x-world.finish.portalX)<42&&Math.abs(s.y-world.finish.y)<10){s.returning={t:0,x:s.x,y:s.y,done:false};s.vx=0;s.vy=0;return{type:'capture'};}
 if(s.encounterLatch){const last=world.items.find(i=>i.id===s.encounterLatch);if(!last||Math.abs(last.x-s.x)>110||Math.abs(last.y-s.y)>90)s.encounterLatch=null;}
 const item=nearestItem(s,world);
 // A stable landing starts the bubble; passing overhead while jumping does not interrupt play.
 if(item&&s.grounded&&s.hurt===0&&s.encounterLatch!==item.id){s.encounterLatch=item.id;return{type:'encounter',item};}
}
