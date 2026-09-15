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
