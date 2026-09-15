// Bounded loading: stalled mobile webviews must not leave the game waiting forever.
export function loadImage(url,{timeoutMs=10000,attempts=2,ImageClass=Image}={}) {
  return new Promise((resolve,reject)=>{
    let attempt=0;
    function run(){
      attempt++;
      const im=new ImageClass();
      let done=false;
      const timer=setTimeout(()=>finish(new Error('Image timed out: '+url)),timeoutMs);
      function finish(error){
        if(done)return;done=true;clearTimeout(timer);im.onload=im.onerror=null;
        if(error){if(attempt<attempts)run();else reject(error);}else resolve(im);
      }
      im.onload=()=>finish(im.naturalWidth?null:new Error('Empty image: '+url));
      im.onerror=()=>finish(new Error('Image unavailable: '+url));
      im.src=url+(attempt>1?(url.includes('?')?'&':'?')+'retry='+attempt:'');
    }
    run();
  });
}

const jobs=new Map(),listeners=new Set();
function notify(){for(const listener of listeners)listener();}
export function trackTask(key,task){
  const job={status:'loading',run:null};
  job.run=()=>{
    job.status='loading';notify();
    return Promise.resolve().then(task).then(()=>{job.status='ready';notify();},()=>{job.status='failed';notify();});
  };
  jobs.set(key,job);job.run();
  return job;
}
export function watchAsset(key,url,ready){
  return trackTask(key,()=>loadImage(url).catch(error=>{
    if(!url.endsWith('.webp'))throw error;
    return loadImage(url.replace(/\.webp$/,'.png'),{attempts:1});
  }).then(ready));
}
export function retryAssets(){for(const job of jobs.values())if(job.status==='failed')job.run();}
export function assetNotice(container){
  const box=document.createElement('div');box.className='asset-notice';box.setAttribute('role','status');
  box.innerHTML='<span class="asset-message"></span><button type="button"><span lang="zh">重试图片</span><span lang="en">Retry images</span></button>';
  const button=box.querySelector('button');button.onclick=retryAssets;container.append(box);
  function update(){
    const failed=[...jobs.values()].some(j=>j.status==='failed'),pending=[...jobs.values()].some(j=>j.status==='loading');
    box.hidden=!failed&&!pending;button.hidden=!failed;
    box.querySelector('.asset-message').innerHTML=failed?'<span lang="zh">部分图片未能加载，已使用简化显示，可继续探索。</span><span lang="en">Some images could not load. You can keep exploring with simplified graphics.</span>':'<span lang="zh">图片加载中，可先探索。</span><span lang="en">Images are loading. You can explore now.</span>';
  }
  listeners.add(update);update();return ()=>{listeners.delete(update);box.remove();};
}

// Apply movement before optional pointer capture. Some in-app webviews throw
// on capture; that should never prevent the input from reaching the game.
export function bindGameButton(button,onPress,onRelease){
  const release=e=>{button.classList.remove('is-held');onRelease();};
  button.addEventListener('pointerdown',e=>{
    e.preventDefault();button.classList.add('is-held');onPress();
    try{button.setPointerCapture?.(e.pointerId);}catch{}
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture','pointerleave'])button.addEventListener(type,release);
  // Older embedded browsers may not expose Pointer Events.
  if(typeof window!=='undefined'&&!('PointerEvent' in window)){
    button.addEventListener('touchstart',e=>{e.preventDefault();button.classList.add('is-held');onPress();},{passive:false});
    for(const type of ['touchend','touchcancel'])button.addEventListener(type,release);
  }
}

export function fallbackSheet(kind){
  return Array.from({length:kind==='riolu'?19:4},(_,frame)=>{
    const c=document.createElement('canvas');c.width=kind==='riolu'?16:48;c.height=kind==='riolu'?20:48;
    const g=c.getContext('2d'),r=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
    if(kind==='ditto'){
      r(8,19,32,23,'#80bde1');r(13,13,8,10,'#9ed8f4');r(28,12,7,11,'#9ed8f4');r(5,28,38,11,'#9ed8f4');
      r(13,41,10,4,'#80bde1');r(29,40,9,4,'#80bde1');r(16,26,2,3,'#4b5480');r(30,26,2,3,'#4b5480');r(22,33,7,2,'#4b5480');
    }else if(kind==='riolu'){
      r(3,0,3,7,'#5c6099');r(10,0,3,7,'#5c6099');r(3,5,10,8,'#81c5e7');r(3,8,10,3,'#515980');r(5,8,2,2,'#fff');r(10,8,2,2,'#fff');
      r(5,12,7,5,'#91cee7');r(2,12,3,4,'#515980');r(12,12,3,4,'#515980');r(5,17,3,3,'#515980');r(10,17-(frame%2),3,3,'#515980');
    }else if(frame===0){
      r(9,8,30,32,'#fff1f6');r(13,4,22,8,'#edb5ce');r(9,12,30,12,'#edb5ce');r(8,23,32,4,'#77628f');r(21,20,8,10,'#fff');
    }else if(frame===1){
      r(7,17,35,29,'#84759e');r(13,7,24,31,'#aea1c4');r(18,2,12,13,'#c8bedb');r(9,32,30,5,'#9686ae');
    }else{
      r(7,23,35,21,'#d9b981');r(7,frame===3?6:15,35,10,'#ad8b69');r(22,23,6,13,'#fff0bd');
    }
    return c;
  });
}
