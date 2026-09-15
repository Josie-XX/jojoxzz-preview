// Public read-only content. Authoring credentials and endpoints live outside this site.
export const siteConfig=await fetch('world-config.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
export function authoredWorld(id,fallback){const saved=siteConfig?.routes?.[id];return saved?structuredClone({...saved,layout:'custom',pits:[]}):fallback();}
