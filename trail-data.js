// Authored order reflects personal relevance, not chronology. Details share encounters.
export function trailRecords(){
 const c=(title,body,image)=>({title,body,...(image?{image}:{})});
 const r=(id,title,cards)=>({id,title,body:cards[0].body,cards,kind:'item'});
 return {
 hi:[
 r('hello',['联系 Josie Z.','Contact Josie Z.'],[
 c(['Hi，我是 Josie Z.','Hi, I’m Josie Z.'],['中文名是赵卓羲。欢迎来我的主页。想交流游戏、创作或其他有趣的事情，可以通过下面的链接找到我。','My Chinese name is Zhao Zhuoxi. Welcome to my website. If you’d like to talk about games, creative work or something else that interests you, you can find me below.'])]),
 r('about-josie',['数学、游戏，还有很多兴趣','Math, games, and many interests'],[
 c(['关于我','A little about me'],['我学数学，喜欢玩游戏，也想自己做游戏。平时感兴趣的东西很多，文学、建筑、音乐、AI，都想多了解一点。','I study mathematics, love playing games, and want to make my own. I’m curious about a lot of things—literature, architecture, music and AI, to name a few.']),
 c(['不只玩，也想做','Playing—and making'],['除了玩游戏，我也在做游戏。用 Godot 做过平台跳跃，用 Unity 写过敌人和 Boss 的行为。接下来还想继续做。','Besides playing games, I make them too. I’ve worked on a Godot platformer and written enemy and boss behavior in Unity. I want to keep making more.'])]),
 r('education',['我的学习背景','My academic background'],[
 c(['数学基础','A foundation in mathematics'],['我在武汉大学学习应用数学，接触了数学与统计相关的课程。这是我接触计算、AI 和游戏制作的知识基础。','I studied applied mathematics at Wuhan University, including mathematics and statistics. That foundation supports my exploration of computing, AI and game-making.']),
 c(['学校经历','My schools'],['高中就读于上海交大附中。在武汉大学时，也参与过学生组织和志愿活动。现在在哥伦比亚大学学习运筹学。','I attended the High School Affiliated to Shanghai Jiao Tong University. At Wuhan University I also took part in student organizations and volunteering. I now study operations research at Columbia University.'])])
 ],
 make:[
 r('thesis',['数学与建模','Mathematics & modeling'],[
 c(['从数学到数据','From mathematics to data'],['我在武汉大学学应用数学。本科毕业论文做的是德国天然气网络流量预测，用时间序列模型来处理这个问题。','I studied applied mathematics at Wuhan University. For my undergraduate thesis, I used time-series models to forecast flows in the German natural-gas network.']),
 c(['做过的尝试','Things I’ve tried'],['论文里，我比较了多种预测模型，做数据处理、训练和滚动评估。我也接触过优化建模和量子机器学习，研究过量子线路中的贫瘠高原问题。','For my thesis, I compared forecasting models and worked on data processing, training and rolling evaluation. I’ve also explored optimization and quantum machine learning, including barren plateaus in quantum circuits.']),
 c(['用路径画 Kirby','Drawing Kirby with a route'],['优化项目里，我做过资源分配和路径相关的问题，还用旅行商路径画过 Kirby。','My optimization projects have included resource allocation and routing. I also used a travelling-salesperson route to draw Kirby.'])]),
 r('toxbuster',['ToxBuster · 游戏聊天识别','ToxBuster · game chat detection'],[
 c(['ToxBuster','ToxBuster'],['我做过 ToxBuster 相关的复现和实验，识别游戏聊天中的有害语言。游戏里的聊天常常很短，也依赖上下文，不能只看某一个词。','I reproduced and ran experiments around ToxBuster to detect toxic language in game chat. Messages are often short and context-dependent, so a single word doesn’t always tell the whole story.']),
 c(['我做了什么','What I worked on'],['我在实验里关注聊天上下文对识别结果的影响，也比较模型的表现。这个项目主要做的是语言识别，不是游戏玩法。','In my experiments, I looked at how chat context affects detection and compared model performance. This project focused on language detection rather than gameplay.'])]),
 r('pokemon-rl',['RL · 宝可梦自动对战','RL · automated Pokémon battles'],[
 c(['让智能体学会对战','Teaching an agent to battle'],['我做过一个宝可梦自动对战的强化学习项目，让智能体在回合制对战里学习怎么决策。','I worked on a reinforcement-learning project for automated Pokémon battles, training an agent to make decisions in turn-based combat.']),
 c(['不同的决策方式','Different ways to make decisions'],['我比较了 DQN、Double DQN 和 Dueling 等方法，观察它们面对不同对手时的表现，也研究了奖励设计会怎样影响它们的选择。','I compared methods including DQN, Double DQN and dueling architectures, looked at performance against different opponents, and studied how reward design affects their choices.'])])
 ],
 play:[
 r('game-making',['2010s Wonders · Game Jam','2010s Wonders · Game Jam'],[
 c(['2010s Wonders','2010s Wonders'],['这是我参与制作的 Godot 复古平台跳跃游戏。两周的团队 Game Jam 里，我参与了关卡设计、玩法调整和协作。','This is a retro Godot platformer I helped make. During the two-week team game jam, I contributed to level design, gameplay iteration and collaboration.']),
 c(['游戏画面','In the game'],['这是 2010s Wonders 的实际画面。','Here’s a screenshot from 2010s Wonders.'],'assets/gamejam.png')]),
 r('elemental-ruins',['Elemental Ruins','Elemental Ruins'],[
 c(['Elemental Ruins','Elemental Ruins'],['这是我们四个人用 Unity 和 C# 制作的 3D 动作 RPG。我主要负责敌人 AI 和战斗相关的实现。','This is a 3D action RPG our four-person team made with Unity and C#. I mainly worked on enemy AI and combat implementation.']),
 c(['敌人和 Boss','Enemies and bosses'],['我写了敌人发现、追踪和攻击玩家的行为，也做了远程投射物、受击反馈和 Boss 的多种攻击。玩家移动、靠近或出招时，敌人都要有对应的反应。','I implemented enemy detection, pursuit and attacks, along with ranged projectiles, hit feedback and multiple boss attacks. Enemies need to respond when the player moves, approaches or attacks.'])]),
 r('game-tastes',['我也喜欢玩游戏','I also love playing games'],[
 c(['最近想玩什么？','What do you feel like playing?'],['我会玩叙事游戏、RPG、卡牌和模拟经营，也玩 DOTA 和宝可梦。如果你有喜欢的游戏，欢迎推荐给我。','I play narrative games, RPGs, card games and simulation games, as well as DOTA and Pokémon. If you have a favorite, send me a recommendation.'])])
 ],
 watch:[
 r('interests',['喜欢的事情不止一种','Many things to love'],[
 c(['爱好广泛','A wide range of interests'],['除了数学和游戏，我也喜欢文学、建筑和芭蕾，对不同的文化、宇宙相关的话题也很好奇。感兴趣的东西挺多，欢迎来跟我聊你喜欢的。','Besides mathematics and games, I like literature, architecture and ballet. I’m also curious about different cultures and the universe. I’m into quite a few things—come tell me what you like.']),
 c(['创作与 AI','Creative work and AI'],['我喜欢创作，也对 AI 很感兴趣。尤其想多试试 AI 和游戏结合起来能做什么。','I enjoy making things and I’m interested in AI. I’d especially like to try more ways of using AI in games.'])]),
 r('singing',['还有，喜欢唱歌','And I like singing'],[
 c(['喜欢唱歌','I like singing'],['唱歌也是我的爱好。有空直接约我 KTV！','I love singing too. If you’re free, let’s go to karaoke!'])])
 ]
 };
}
