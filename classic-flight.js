import {createFlight,stepFlight,project as perspective,playerPoint,resumeFromContent,clamp} from './flight-engine.mjs';
const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href='fall.css';document.head.append(sheet);
const classic=document.createElement('link');classic.rel='stylesheet';classic.href='jelly.css';document.head.append(classic);classic.onload=resize;
// Four physical destinations; the index remains available without playing.
content.life.items=[...content.experience.items,...content.life.items];content.life.intro=['教育、工作、校园活动与个人兴趣。','Education, work, campus activities and personal interests.'];
nodes.splice(4,1);
const labels=[['游戏项目','Game Projects'],['研究项目','Research'],['课程与作业','Coursework'],['经历与兴趣','Experience & Interests']];
nodes.forEach((n,i)=>{n.zh=labels[i][0];n.en=labels[i][1];if(content[n.id]){content[n.id].zh=n.zh;content[n.id].en=n.en}});
$('.intro h1').dataset.zh='赵卓羲 · 个人主页';$('.intro h1').dataset.en='Josie Zhao · Personal Website';
let flight=createFlight(),boost=false,pointerTarget=null,lastTick=0;
const pauseButton=document.createElement('button');pauseButton.id='flight-pause';$('.intro').append(pauseButton);
const boostButton=document.createElement('button');boostButton.id='flight-boost';boostButton.setAttribute('aria-label','Hold to accelerate / 按住加速');$('.map-wrap').append(boostButton);
const indicator=document.createElement('span');indicator.id='flight-state';indicator.setAttribute('role','status');$('.intro').append(indicator);
const progress=$('#progress'),oldRender=renderText;
renderText=()=>{oldRender();document.title=tr('赵卓羲 · 个人主页','Josie Zhao · Personal Website');$('.world-footer>span').textContent=tr('WASD / 方向键移动 · 空格暂停 · Shift 加速','WASD / Arrows to steer · Space to pause · Shift to accelerate');progress.textContent=`${String(visited.size).padStart(2,'0')} / 04 ${tr('已浏览','VIEWED')}`;$('#reset').textContent=tr('重新开始','Restart');pauseButton.textContent=flight.paused?tr('继续 · Space','Resume · Space'):tr('暂停 · Space','Pause · Space');pauseButton.setAttribute('aria-pressed',String(flight.paused));boostButton.textContent=tr('按住加速','Hold to accelerate');canvas.setAttribute('aria-label',tr('果冻下落场景。方向键或 WASD 移动，空格暂停，Shift 加速。四个浅粉色球打开内容，六个浅蓝色球可直接穿过。','Falling through a jelly world. Arrows or WASD to steer, Space to pause, Shift to accelerate. Four pink balls open content; six blue balls are decorative.'));};
const baseReader=fillReader;fillReader=id=>{baseReader(id);if(nodes.some(n=>n.id===id)){const avatar=document.createElement('img');avatar.src='assets/ditto.png';avatar.className='reader-ditto';avatar.alt=tr('百变怪','Ditto');avatar.width=104;avatar.height=104;$('#reader-content').prepend(avatar)}const title=$('#reader-content h2');if(title)title.textContent=id==='about'?tr('关于赵卓羲','About Josie Zhao'):id==='archive'?tr('内容目录','Contents'):nodes.find(n=>n.id===id)?.[lang]||title.textContent;const lead=$('#reader-content .lead');if(lead&&id==='archive')lead.textContent=tr('选择栏目查看内容。','Select a section to view its content.');};
function togglePause(){flight.paused=!flight.paused;keys.clear();boost=false;pointerTarget=null;renderText()}
pauseButton.onclick=togglePause;
window.addEventListener('keydown',e=>{if($('#reader').open||e.ctrlKey||e.metaKey||e.altKey)return;if(e.code==='Space'){e.preventDefault();if(!e.repeat)togglePause()}if(e.key==='Shift'){boost=true;e.preventDefault()}},true);
window.addEventListener('keyup',e=>{if(e.key==='Shift')boost=false},true);
window.addEventListener('blur',()=>{boost=false;pointerTarget=null;keys.clear()});
boostButton.addEventListener('pointerdown',e=>{e.preventDefault();boostButton.setPointerCapture(e.pointerId);boost=true});['pointerup','pointercancel','lostpointercapture'].forEach(type=>boostButton.addEventListener(type,()=>boost=false));
canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect();pointerTarget={x:clamp(((e.clientX-r.left)/w-.5)/.32,-1,1),y:clamp(((e.clientY-r.top)/h-.65)/.24,-1,1)};canvas.focus({preventScroll:true})});
$('#reader').addEventListener('close',()=>{resumeFromContent(flight);pointerTarget=null;boost=false;lastTick=0});
$('#reset').onclick=()=>{flight=createFlight();visited.clear();pointerTarget=null;boost=false;keys.clear();renderText()};
const assets={};let assetsReady=false,loadFailed=false;
Promise.all([['shelf','assets/jelly-world.png'],['pink','assets/jelly-pink.png'],['blue','assets/jelly-blue.png'],['dive','assets/ditto-faceless.png'],['front','assets/ditto.png']].map(([key,src])=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{assets[key]=im;resolve()};im.onerror=reject;im.src=src}))).then(()=>{const sprite=document.createElement('canvas');sprite.width=assets.front.width;sprite.height=assets.front.height;const paint=sprite.getContext('2d');paint.drawImage(assets.front,0,0);paint.globalCompositeOperation='source-in';paint.drawImage(assets.dive,0,0,sprite.width,sprite.height);assets.dive=sprite;assetsReady=true}).catch(()=>{loadFailed=true});
const P=(x,y,z)=>perspective(x,y,z,w,h);
function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke()}}
// Affine triangles map the generated materials onto perspective game geometry.
function textureTriangle(im,uv,dst){const [s0,s1,s2]=uv,[p0,p1,p2]=dst;const det=s0.x*(s1.y-s2.y)+s1.x*(s2.y-s0.y)+s2.x*(s0.y-s1.y);if(Math.abs(det)<.0001)return;const v=key=>[(p0[key]*(s1.y-s2.y)+p1[key]*(s2.y-s0.y)+p2[key]*(s0.y-s1.y))/det,(p0[key]*(s2.x-s1.x)+p1[key]*(s0.x-s2.x)+p2[key]*(s1.x-s0.x))/det,(p0[key]*(s1.x*s2.y-s2.x*s1.y)+p1[key]*(s2.x*s0.y-s0.x*s2.y)+p2[key]*(s0.x*s1.y-s1.x*s0.y))/det];const x=v('x'),y=v('y');ctx.save();poly(dst);ctx.clip();ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(im,0,0);ctx.restore()}
function quadTexture(im,q){if(!im)return;const a={x:0,y:0},b={x:im.width,y:0},c={x:im.width,y:im.height},d={x:0,y:im.height};textureTriangle(im,[a,b,c],[q[0],q[1],q[2]]);textureTriangle(im,[a,c,d],[q[0],q[2],q[3]])}
function environment(){ctx.fillStyle='#e5f1fc';ctx.fillRect(0,0,w,h);const offset=flight.travel%2.5;
 for(let layer=9;layer>=0;layer--){const z=.15+layer*2.5-offset;if(z<.1)continue;for(let side=0;side<8;side++){const a=side*Math.PI/4,b=(side+1)*Math.PI/4;const q=[P(Math.cos(a)*2.65,Math.sin(a)*1.90,z),P(Math.cos(b)*2.65,Math.sin(b)*1.90,z),P(Math.cos(b)*2.65,Math.sin(b)*1.90,z+2.5),P(Math.cos(a)*2.65,Math.sin(a)*1.90,z+2.5)];ctx.save();ctx.filter='brightness(.94) saturate(.70) contrast(.76)';quadTexture(assets.shelf,q);ctx.restore();poly(q,`rgba(224,239,251,${.23+layer*.025})`);}}
 const fog=ctx.createRadialGradient(w*.5,h*.40,0,w*.5,h*.40,Math.min(w,h)*.56);fog.addColorStop(0,'#f4f7f9');fog.addColorStop(.12,'#ecf2f8e8');fog.addColorStop(.45,'#dce8f044');fog.addColorStop(1,'#b3cbdf00');ctx.fillStyle=fog;ctx.fillRect(0,0,w,h);
 const vignette=ctx.createRadialGradient(w*.5,h*.45,Math.min(w,h)*.2,w*.5,h*.45,Math.max(w,h)*.68);vignette.addColorStop(0,'#172f4900');vignette.addColorStop(1,'#a0c6e936');ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
 for(let i=0;i<38;i++){const z=(i*.59-flight.travel% .59)+.3,a=i*2.399,p=P(Math.cos(a)*1.8,Math.sin(a)*1.25,z),q=P(Math.cos(a)*1.8,Math.sin(a)*1.25,z+(boost?.32:.06));ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=boost?'#f2f8ffb0':'#edf5ff6b';ctx.lineWidth=boost?1.5:.8;ctx.stroke()}}
function book(b){
 const p=P(b.x,b.y,b.z),size=p.k*.58,im=b.interactive?assets.pink:assets.blue;
 if(!im)return;
 const opening=flight.opening?.uid===b.uid?clamp(flight.opening.elapsed/.42,0,1):0;
 ctx.save();ctx.translate(p.x,p.y);
 if(!b.interactive)ctx.globalAlpha=.70;
 if(opening){
  const glow=ctx.createRadialGradient(0,0,0,0,0,size*.55);glow.addColorStop(0,'#fff9fddd');glow.addColorStop(1,'#ffe9f000');ctx.fillStyle=glow;ctx.fillRect(-size,-size,size*2,size*2);
  ctx.drawImage(im,0,0,im.width,im.height/2,-size/2,-size/2-opening*size*.27,size,size/2*(1-opening*.3));
  ctx.drawImage(im,0,im.height/2,im.width,im.height/2,-size/2,opening*size*.15,size,size/2);
 }else ctx.drawImage(im,-size/2,-size/2,size,size);
 if(b.interactive&&b.z<9&&!opening){
  const fs=clamp(size*.105,14,22);ctx.font=fs+'px Georgia, "Songti SC", serif';ctx.textAlign='center';ctx.textBaseline='middle';
  const label=nodes[b.section][lang],tw=ctx.measureText(label).width,yy=-size*.56-fs;
  ctx.fillStyle='#fffffff0';ctx.beginPath();ctx.roundRect(-tw/2-13,yy-fs*.8,tw+26,fs*1.6,8);ctx.fill();ctx.fillStyle='#624857';ctx.fillText(label,0,yy);
 }
 ctx.restore();
}
function drawPlayer(){
 const ps=playerPoint(flight,w,h);let size=clamp(w*.105,82,145),x=ps.x,y=ps.y,alpha=1;
 if(flight.opening){const b=flight.books.find(b=>b.uid===flight.opening.uid),p=P(b.x,b.y,b.z),t=clamp((flight.opening.elapsed-.2)/.66,0,1),ease=t*t*(3-2*t);x+=(p.x-x)*ease;y+=(p.y-y)*ease;size*=1-ease*.93;alpha=1-ease;}
 ctx.save();ctx.translate(x,y);ctx.rotate(flight.x*.08);ctx.globalAlpha=alpha;
 // Invert the original front silhouette vertically; no new rear-view anatomy.
 ctx.scale(1,-1);const stretch=boost&&!flight.paused?1.12:1;
 if(assetsReady)ctx.drawImage(assets.dive,-size/2,-size/2,size,size*stretch);
 ctx.restore();
}
function status(){indicator.textContent=loadFailed?tr('素材加载失败，请刷新。','Assets could not load. Please refresh.'):!assetsReady?tr('正在加载场景…','Loading scene…'):flight.paused?tr('已暂停','Paused'):flight.opening?tr('正在进入…','Entering…'):boost?tr('加速下落','Accelerating'):tr('下落中','Descending');hint.textContent=tr('浅粉色球：进入内容 · 浅蓝色球：直接穿过','Pink: open content · Blue: pass through');}
function animate(t){const dt=lastTick?Math.min((t-lastTick)/1000,.05):0;lastTick=t;let dx=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0),dy=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);if(dx||dy)pointerTarget=null;if(pointerTarget){const x=pointerTarget.x-flight.x,y=pointerTarget.y-flight.y,len=Math.hypot(x,y);if(len<.025)pointerTarget=null;else{dx=x/len;dy=y/len}}
 const event=stepFlight(flight,{dx,dy,boost,modal:$('#reader').open||!assetsReady,hidden:document.hidden},dt,w,h);if(event?.type==='capture'){keys.clear();boost=false;pointerTarget=null}if(event?.type==='enter'){openReader(nodes[event.section].id)}
 ctx.clearRect(0,0,w,h);environment();const sorted=flight.books.slice().sort((a,b)=>b.z-a.z);sorted.forEach(b=>{if(b.z>-.35)book(b)});drawPlayer();status();requestAnimationFrame(animate)}
if(reduced)flight.paused=true;renderText();resize();$('.map-wrap').classList.add('ready');requestAnimationFrame(animate);
