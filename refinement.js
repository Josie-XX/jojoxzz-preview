// Approved six-page visual system. Keep all content as accessible bilingual HTML.
import {siteConfig} from './site-config.js?v=10';
// Styles are preloaded in index.html.
import {prepareLettering,prepareQuickLettering,prepareSectionLettering} from './brush-lettering.mjs?v=14';
import {trackTask} from './asset-loader.mjs?v=10';
trackTask('lettering',async()=>{if(!await prepareLettering())throw new Error('Lettering unavailable');});
trackTask('quick-lettering',prepareQuickLettering);
trackTask('section-lettering',prepareSectionLettering);
['时间序列预测','量子机器学习','游戏聊天中的语言识别','优化与决策'].forEach((title,i)=>content.research.items[i].zh=title);
const stage=document.createElement('div');stage.className='stage-copy';stage.innerHTML=`<div class="home-title"><h1 data-zh="你被变成了<br>百变怪！" data-en="You became<br>a Ditto!">你被变成了<br>百变怪！</h1><p class="signature">Josie Z.</p><p class="tags" data-zh="游戏 / 数学 / 创作 / AI" data-en="Games / Math / Creation / AI"></p></div><div class="cave-title"><h1 data-zh="小心！" data-en="Watch out!">小心！</h1><p data-zh="Z 变身利欧路 · 空格碎岩" data-en="Z to become Riolu · Space to smash rocks"></p></div>`;$('.map-wrap').append(stage);
if(siteConfig?.home){const h=siteConfig.home;stage.querySelector('.signature').textContent=h.name;for(const [selector,values] of [['.home-title h1',h.headline],['.tags',h.tags],['.cave-title h1',siteConfig.cave.headline]]){const el=stage.querySelector(selector);const safe=v=>v.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));el.dataset.zh=safe(values[0]);el.dataset.en=safe(values[1]);}document.body.classList.toggle('custom-home-title',h.headline[0]!=='你被变成了\n百变怪！');document.body.classList.toggle('custom-cave-title',siteConfig.cave.headline[0]!=='小心！');}
const links=document.createElement('div');links.className='portal-labels';links.innerHTML=nodes.map((n,i)=>`<button data-open="${n.id}" style="top:${(492-i*68-42)/648*100}%" data-zh="${n.zh}" data-en="${n.en}">${n.zh}</button>`).join('');$('.map-wrap').append(links);
const quickDescriptions=[
 ['关于我 · 教育背景 · 联系方式','About me · Education · Contact'],
 ['数学建模 · AI · 研究项目','Math modeling · AI · Research'],
 ['游戏制作 · 游戏记录','Game development · Play records'],
 ['电影 · 阅读 · 音乐 · 其他兴趣','Films · Books · Music · Interests']
];
const quickWrap=document.createElement('div');quickWrap.className='quick-find-wrap';
const quickFind=document.createElement('button');quickFind.type='button';quickFind.className='quick-find';quickFind.setAttribute('aria-expanded','false');quickFind.setAttribute('aria-controls','quick-find-panel');
quickFind.innerHTML='<span data-zh="快速查找！" data-en="Quick Find!">快速查找！</span>';
const quickPanel=document.createElement('nav');quickPanel.id='quick-find-panel';quickPanel.className='quick-find-panel';quickPanel.hidden=true;quickPanel.setAttribute('aria-label','快速查找 / Quick Find');
quickPanel.innerHTML=nodes.map((n,i)=>`<button type="button" data-open="${n.id}"><span data-zh="${n.zh} ↗" data-en="${n.en} ↗">${n.zh} ↗</span><small data-zh="${quickDescriptions[i][0]}" data-en="${quickDescriptions[i][1]}">${quickDescriptions[i][0]}</small></button>`).join('');
quickWrap.append(quickFind,quickPanel);stage.append(quickWrap);
let quickCloseTimer,quickRestoringFocus=false;
const showQuickFind=(open)=>{clearTimeout(quickCloseTimer);quickPanel.hidden=!open;quickFind.setAttribute('aria-expanded',String(open));};
quickWrap.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showQuickFind(true);});
quickWrap.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')quickCloseTimer=setTimeout(()=>showQuickFind(false),220);});
quickFind.addEventListener('click',e=>{showQuickFind(e.pointerType==='mouse'?true:quickPanel.hidden);});
quickFind.addEventListener('focus',()=>{if(!quickRestoringFocus&&quickFind.matches(':focus-visible'))showQuickFind(true);});
quickWrap.addEventListener('focusout',e=>{if(!quickWrap.contains(e.relatedTarget))showQuickFind(false);});
quickWrap.addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Escape'){e.preventDefault();showQuickFind(false);quickRestoringFocus=true;quickFind.focus();quickRestoringFocus=false;}});
quickPanel.addEventListener('click',e=>{if(e.target.closest('[data-open]'))showQuickFind(false);});
document.addEventListener('pointerdown',e=>{if(!quickWrap.contains(e.target))showQuickFind(false);});
document.querySelector('header').innerHTML='<nav><button data-open="hi" data-zh="认识了吗" data-en="Me Meeting">认识了吗</button><button data-open="archive" data-zh="目录" data-en="Index">目录</button></nav>';
// Preserve the original language handler while relocating the control.
const language=document.createElement('button');language.id='language';language.onclick=()=>{lang=lang==='zh'?'en':'zh';localStorage.setItem('josie-language',lang);renderText();};document.querySelector('header nav').append(language);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=(a,b)=>tr(a,b);
const ditto=()=>'<div class="ditto-stamp" role="img" aria-label="Ditto / 百变怪"></div>';
const heading=(id,zh,en,subZh,subEn)=>`<section class="page-heading">${ditto()}<h2>${t(zh,en)}</h2><p class="page-subtitle">${t(subZh,subEn)}</p></section>`;
const tile=(e,i)=>`<article class="project-tile">${e.image?`<img class="project-image" src="${e.image}" alt="${escapeHTML(t(e.zh,e.en))}">`:`<div class="project-illustration art-${i%4}" aria-hidden="true"><span>${['∿','✧','↗','⌘'][i%4]}</span><i></i></div>`}<p class="meta">${e.meta}</p><h3>${t(e.zh,e.en)}</h3><p>${t(e.desc,e.descEn)}</p></article>`;
const pending=(symbol,zh,en)=>`<article class="collection-item"><div class="collection-art" aria-hidden="true">${symbol}</div><h3>${t(zh,en)}</h3><p>${t('记录待添加','Entries coming soon')}</p></article>`;
fillReader=id=>{
 if(id==='about'||id==='life')id='hi';if(id==='research'||id==='courses')id='make';if(id==='games')id='play';
 const reader=$('#reader');reader.dataset.page=id;
 $('#reader-kicker').innerHTML=`<button data-home>${t('← 返回主页','← Home')}</button><nav>${nodes.map(n=>`<button data-open="${n.id}" ${n.id===id?'aria-current="page"':''}>${n[lang]}</button>`).join('')}</nav><button data-language>${lang==='zh'?'Language · EN':'Language · 中文'}</button>`;
 let html='';
 if(id==='hi')html=`${heading(id,'认识了吗','Me Meeting','游戏 / 数学 / 创作 / AI','Games / Math / Creation / AI')}<div class="hi-layout"><div class="hi-name"><p class="signature">Josie Z.</p><p>${t('从武汉到纽约','From Wuhan to New York')}</p><div class="ditto-portrait" aria-hidden="true"></div></div><div class="hi-notes"><section><h3>${t('学习中','Learning')}</h3><p>${t('在哥伦比亚大学学习运筹学，此前在武汉大学学习应用数学。现在也参与 Scheduling 课程的助教工作。','I study operations research at Columbia University, after studying applied mathematics at Wuhan University. I also support the Scheduling course as a course assistant.')}</p></section><section><h3>${t('最近在做','Making things')}</h3><p>${t('做游戏，也研究模型。项目涉及关卡设计、游戏 AI、时间序列预测和优化。喜欢弄清一个系统怎么运行，再亲手试一试。','I make games and study models. My projects include level design, game AI, time-series forecasting and optimization. I like understanding how a system works and trying it myself.')}</p></section><section><h3>${t('不只这些','Outside projects')}</h3><p>${t('喜欢叙事、角色扮演、卡牌和模拟经营游戏。喜欢唱歌，参加过学生组织和志愿活动，也学习过建筑、文学和芭蕾相关课程。','I enjoy narrative games, RPGs, card games and simulations. I have also enjoyed singing and participated in student organizations and volunteering, and taken courses in architecture, literature and ballet.')}</p></section></div></div><section class="experience-notes"><h3>${t('也做过这些','Other experiences')}</h3>${content.experience.items.slice(1).map(e=>`<details><summary>${t(e.zh,e.en)}</summary><p>${t(e.desc,e.descEn)}</p></details>`).join('')}</section><div class="contact"><a href="mailto:zzxjosie@gmail.com">zzxjosie@gmail.com ↗</a><a href="https://www.linkedin.com/in/josiezzx" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/Josie-XX" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div><p class="sprite-credit">Riolu sprites: CHUNSOFT · <a href="https://github.com/PMDCollab/SpriteCollab/tree/master/sprite/0447" target="_blank" rel="noopener noreferrer">PMDCollab / SpriteCollab</a></p>`;
 else if(id==='make')html=`${heading(id,'实践了吗','Me Practising','项目 · 研究 · 课程与作业','Projects · Research · Coursework')}<div class="project-grid">${content.research.items.map(tile).join('')}</div><section class="course-section"><h3>${t('课程与作业','Courses & assignments')}</h3><p>${t('按主题整理，系列课程合并列出。','Grouped by topic; course sequences are combined.')}</p>${courses.map(c=>`<details><summary>${t(c[0],c[1])}<span>${c[2].length}</span></summary><div class="course-list">${c[2].map(a=>`<span>${t(...a)}</span>`).join('')}</div></details>`).join('')}</section>`;
 else if(id==='play')html=`${heading(id,'创造了吗','Me Creating','做游戏，也玩游戏。','Making games. Playing games.')}<section class="page-section"><h3>${t('我做的游戏','Games I make')}</h3><div class="project-grid games-grid">${content.games.items.map(tile).join('')}</div></section><section class="page-section"><h3>${t('我的游戏记录','Games I play')}</h3><p>${t('叙事、角色扮演、卡牌与模拟经营。这里会放我的游戏截图和记录。','Narrative games, RPGs, card games and simulations. A place for my gameplay captures and notes.')}</p><div class="collection-grid records">${pending('✧','游戏截图待添加','Gameplay captures')}${pending('⌘','游戏记录待添加','Play notes')}${pending('♡','喜欢的时刻待添加','Favorite moments')}</div></section>`;
 else if(id==='watch')html=`${heading(id,'快乐了吗','Me Enjoying','电影 / 书 / 音乐 / 学习笔记','Films / Books / Music / Study notes')}<div class="collection-grid">${pending('▥','电影','Films')}${pending('▤','书','Books')}${pending('♫','音乐','Music')}${pending('✎','学习笔记','Study notes')}</div><p class="empty-note">${t('读过、看过、听过的内容会陆续整理在这里。','I will collect what I read, watch, listen to and learn here.')}</p>`;
 else html=`${heading(id,'快速查找！','Quick Find!','选择一个栏目，直接浏览。','Choose a section to explore.')}<div class="index-grid quick-index">${nodes.map((n,i)=>`<button data-open="${n.id}"><span>${n[lang]} ↗</span><small>${t(...quickDescriptions[i])}</small></button>`).join('')}</div>`;
 $('#reader-content').innerHTML=html;
 if(id==='make')$('#reader-content').insertAdjacentHTML('beforeend',`<section class="course-section"><h3>${t('作业与实验','Assignments & experiments')}</h3><p>${t('概率模型：分布、回归与计算。算法：图、最短路、最小生成树与动态规划。机器学习：分类、回归与模型实验。优化：设施选址、资源分配、投资组合与路径艺术。统计计算：蒙特卡罗、Bootstrap 与 MCMC。量子计算：量子门与线路。','Probabilistic models: distributions, regression and computation. Algorithms: graphs, shortest paths, spanning trees and dynamic programming. Machine learning: classification, regression and model experiments. Optimization: facility location, allocation, portfolios and path art. Statistical computing: Monte Carlo, bootstrap and MCMC. Quantum computing: gates and circuits.')}</p></section>`);
};
document.addEventListener('click',e=>{if(e.target.closest('[data-home]'))$('#reader').close();if(e.target.closest('[data-language]'))language.click();});
const baseRender=renderText;
renderText=()=>{baseRender();document.title='Josie Z. · '+t('个人主页','Personal Website');$('.intro h1').textContent='';language.textContent=lang==='zh'?'Language · EN':'Language · 中文';};
// Detail pages are full-screen, independently scrollable; homepage remains fixed.
const baseOpen=openReader;openReader=id=>{baseOpen(id);$('#reader').scrollTop=0;};
await import('./trail.js?v=11');
