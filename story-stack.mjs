export function createStory(count,reducedMotion=false){return {index:0,count,elapsed:0,paused:reducedMotion};}
export function turnStory(state,delta){state.index=Math.max(0,Math.min(state.count-1,state.index+delta));state.elapsed=0;state.paused=true;}
export function tickStory(state,dt,duration,blocked=false){
 if(blocked||state.paused||state.index>=state.count-1)return false;
 state.elapsed+=dt;
 if(state.elapsed<duration)return false;
 state.index++;state.elapsed=0;return true;
}
export function storyDuration(text){return Math.max(10,Math.min(24,/[\u3400-\u9fff]/.test(text)?text.length/5:text.split(/\s+/).length/2.5));}
