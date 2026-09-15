// Render the existing lettering as ordinary transparent PNGs. CSS luminance
// masks can disappear in iOS WebKit; keep readable HTML until every PNG is ready.
import {loadImage} from './asset-loader.mjs?v=10';
export function tintLettering(data, rgb) {
  for (let i = 0; i < data.length; i += 4) {
    const luminance = (.2126 * data[i] + .7152 * data[i + 1] + .0722 * data[i + 2]) / 255;
    data[i + 3] = Math.round(data[i + 3] * luminance);
    [data[i], data[i + 1], data[i + 2]] = rgb;
  }
  return data;
}

export async function prepareLettering() {
  try {
    const sheets = await Promise.all([
      loadImage('assets/brush-titles-mask.webp').catch(()=>loadImage('assets/brush-titles-mask.png',{attempts:1})),
      loadImage('assets/brush-titles-love-v7.webp').catch(()=>loadImage('assets/brush-titles-love-v7.png',{attempts:1})),
    ]);
    const images = [];
    for (const [index, sheet] of sheets.entries()) {
      for (const [color, rgb] of [['white', [255, 255, 255]], ['ink', [89, 67, 127]]]) {
        const canvas = document.createElement('canvas');
        canvas.width = sheet.naturalWidth;
        canvas.height = sheet.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable');
        ctx.drawImage(sheet, 0, 0);
        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        tintLettering(pixels.data, rgb);
        ctx.putImageData(pixels, 0, 0);
        const url = canvas.toDataURL('image/png');
        await loadImage(url);
        images.push([`--lettering-${index ? 'love' : 'main'}-${color}`, `url("${url}")`]);
      }
    }
    for (const [key, value] of images) document.documentElement.style.setProperty(key, value);
    document.body.classList.add('titles-ready');
    return true;
  } catch {
    // Leave the bilingual HTML visible if loading/conversion is unavailable.
    document.body.classList.remove('titles-ready');
    return false;
  }
}

// Use the same alpha-rendered brush artwork as the four existing portals.
export async function prepareQuickLettering() {
  const sheet = await loadImage('assets/quick-find-mask-v12.png');
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = Math.round(640 * sheet.naturalHeight / sheet.naturalWidth);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(sheet, 0, 0, canvas.width, canvas.height);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  tintLettering(pixels.data, [89, 67, 127]);
  ctx.putImageData(pixels, 0, 0);
  const url = canvas.toDataURL('image/png');
  await loadImage(url);
  document.documentElement.style.setProperty('--lettering-quick-ink', `url("${url}")`);
  document.body.classList.add('quick-lettering-ready');
}

// Four updated names share one brush sheet; keep old names out of loading fallbacks.
export async function prepareSectionLettering() {
  const sheet = await loadImage('assets/section-names-v14.png');
  const cellW = sheet.naturalWidth / 2, cellH = sheet.naturalHeight / 2;
  const output = [];
  for (const [i, id] of ['hi', 'make', 'play', 'watch'].entries()) {
    const cell = document.createElement('canvas');
    cell.width = cellW; cell.height = cellH;
    const ctx = cell.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.drawImage(sheet, (i % 2) * cellW, Math.floor(i / 2) * cellH, cellW, cellH, 0, 0, cellW, cellH);
    const pixels = ctx.getImageData(0, 0, cell.width, cell.height);
    let left=cell.width, right=0, top=cell.height, bottom=0;
    for(let y=0;y<cell.height;y++)for(let x=0;x<cell.width;x++){
      const p=(y*cell.width+x)*4;
      if(pixels.data[p]>50){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    }
    if(right<=left||bottom<=top)throw new Error('Empty section lettering');
    for(const [color,rgb] of [['ink',[89,67,127]],['white',[255,255,255]]]){
      const crop=document.createElement('canvas');crop.width=right-left+13;crop.height=bottom-top+13;
      const out=crop.getContext('2d');if(!out)throw new Error('Canvas unavailable');
      out.drawImage(cell,left,top,right-left+1,bottom-top+1,6,6,right-left+1,bottom-top+1);
      const data=out.getImageData(0,0,crop.width,crop.height);tintLettering(data.data,rgb);out.putImageData(data,0,0);
      const url=crop.toDataURL('image/png');await loadImage(url);
      output.push([`--section-${id}-${color}`,`url("${url}")`]);
    }
  }
  for(const [key,value] of output)document.documentElement.style.setProperty(key,value);
  document.body.classList.add('section-lettering-ready');
}
