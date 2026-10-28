import type { Genre, Style } from "./types";

type Noun = { word: string; kind?: "countable" | "plural" | "uncountable"; plural?: string; style?: Style[]; genres?: string[]; weird?: number };
const nouns: Noun[] = [
  {word:"Garden", style:["Classic","Cozy"], genres:["Simulator","Tycoon"]},
  {word:"Egg", style:["Classic","Weird"], genres:["Simulator","Collectathon"]},
  {word:"Brainrot", style:["Meme","Weird"], genres:["Simulator","Social"]},
  {word:"Moon", style:["Fantasy","Weird"], genres:["Adventure","Tycoon"]},
  {word:"Pickle", style:["Meme","Weird"], genres:["Simulator","Collectathon"], weird:3},
  {word:"Kingdom", style:["Fantasy","Classic"], genres:["Strategy","Tycoon"]},
  {word:"Factory", style:["Classic"], genres:["Tycoon","Simulator"]},
  {word:"Dungeon", style:["Fantasy","Horror"], genres:["Adventure","Combat"]},
  {word:"Banana", style:["Meme","Weird"], genres:["Simulator","Collectathon"], weird:3},
  {word:"Dragon", style:["Fantasy"], genres:["Adventure","Combat"]},
  {word:"Island", style:["Classic","Cozy"], genres:["Survival","Adventure"]},
  {word:"Tower", style:["Classic","Competitive"], genres:["Obby","Tower Defense"]},
  {word:"Ghost", style:["Horror","Weird"], genres:["Horror","Adventure"]},
  {word:"Potato", style:["Meme","Weird"], genres:["Simulator","Social"], weird:3},
  {word:"Robot", style:["Fantasy","Classic"], genres:["Combat","Simulator"]},
  {word:"Crystal", style:["Fantasy"], genres:["Collectathon","Simulator"]},
  {word:"Worm", style:["Weird","Meme"], genres:["Simulator","Survival"], weird:3},
  {word:"Portal", style:["Fantasy"], genres:["Puzzle","Adventure"]},
  {word:"Ocean", style:["Cozy","Classic"], genres:["Exploration","Survival"]},
  {word:"Night", style:["Horror"], genres:["Horror","Survival"]},
  {word:"Relic", style:["Fantasy"], genres:["Adventure","Collectathon"]},
  {word:"Meteor", style:["Fantasy","Weird"], genres:["Survival","Simulator"]},
  {word:"Goblin", style:["Fantasy","Meme"], genres:["Adventure","Combat"]},
  {word:"Nugget", style:["Meme","Weird"], genres:["Simulator","Collectathon"], weird:3},
  {word:"Castle", style:["Fantasy","Classic"], genres:["Tycoon","Strategy"]},
  {word:"Racers", kind:"plural", style:["Competitive"], genres:["Racing"]},
  {word:"Crystals", kind:"plural", style:["Fantasy"], genres:["Collectathon","Simulator"]},
  {word:"Zombies", kind:"plural", style:["Horror"], genres:["Survival","Combat"]},
  {word:"Slime", style:["Weird","Fantasy"], genres:["Simulator","Collectathon"]},
  {word:"Cloud", style:["Cozy","Fantasy"], genres:["Adventure","Tycoon"]},
  {word:"Train", style:["Classic"], genres:["Racing","Tycoon"]},
  {word:"Crown", style:["Fantasy","Competitive"], genres:["Strategy","Combat"]},
  {word:"Circus", style:["Weird","Horror"], genres:["Horror","Social"]},
  {word:"Museum", style:["Classic","Weird"], genres:["Roleplay","Puzzle"]},
  {word:"Dimension", style:["Fantasy","Experimental"], genres:["Puzzle","Adventure"]},
  {word:"Chicken", style:["Meme","Weird"], genres:["Simulator","Survival"], weird:2},
  {word:"Shadows", kind:"plural", style:["Horror"], genres:["Horror","Adventure"]},
  {word:"Empire", style:["Classic","Fantasy"], genres:["Tycoon","Strategy"]},
  {word:"Dream", style:["Cozy","Fantasy"], genres:["Adventure","Social"]},
  {word:"Toilet", style:["Meme","Weird"], genres:["Simulator","Social"], weird:3},
  {word:"Meteorite", style:["Fantasy"], genres:["Survival","Simulator"]},
];

const verbs = [
  {v:"Grow", genres:["Simulator","Tycoon"], styles:["Classic","Cozy","Mixed"]},
  {v:"Steal", genres:["Simulator","Combat","Social"], styles:["Classic","Meme","Weird","Mixed"]},
  {v:"Hatch", genres:["Simulator","Collectathon"], styles:["Classic","Cozy","Fantasy","Mixed"]},
  {v:"Mine", genres:["Simulator","Incremental"], styles:["Classic","Fantasy","Mixed"]},
  {v:"Build", genres:["Tycoon","Strategy"], styles:["Classic","Cozy","Mixed"]},
  {v:"Escape", genres:["Horror","Obby","Adventure"], styles:["Classic","Horror","Mixed"]},
  {v:"Collect", genres:["Collectathon","Simulator"], styles:["Classic","Fantasy","Mixed"]},
  {v:"Survive", genres:["Survival","Horror"], styles:["Classic","Horror","Competitive","Mixed"]},
  {v:"Feed", genres:["Simulator","Cozy"], styles:["Cozy","Weird","Meme","Mixed"]},
  {v:"Raise", genres:["Simulator","Tycoon"], styles:["Classic","Fantasy","Cozy","Mixed"]},
  {v:"Defend", genres:["Tower Defense","Strategy"], styles:["Classic","Fantasy","Competitive","Mixed"]},
  {v:"Become", genres:["Roleplay","Simulator","Combat"], styles:["Classic","Meme","Fantasy","Mixed"]},
  {v:"Explore", genres:["Exploration","Adventure"], styles:["Classic","Fantasy","Cozy","Mixed"]},
  {v:"Merge", genres:["Incremental","Simulator"], styles:["Classic","Weird","Meme","Mixed"]},
  {v:"Race", genres:["Racing","Competitive"], styles:["Classic","Competitive","Mixed"]},
  {v:"Solve", genres:["Puzzle"], styles:["Classic","Experimental","Mixed"]},
  {v:"Pet", genres:["Collectathon","Simulator"], styles:["Cozy","Classic","Mixed"]},
  {v:"Deliver", genres:["Racing","Simulator"], styles:["Classic","Weird","Meme","Mixed"]},
  {v:"Rescue", genres:["Adventure","Roleplay"], styles:["Classic","Cozy","Fantasy","Mixed"]},
  {v:"Haunt", genres:["Horror","Social"], styles:["Horror","Weird","Mixed"]},
  {v:"Launch", genres:["Simulator","Racing"], styles:["Fantasy","Weird","Mixed"]},
  {v:"Punch", genres:["Combat","Simulator"], styles:["Meme","Competitive","Mixed"]},
];

const templates = [
  (v:string,n:string)=>`${v} ${article(n)} ${n}`,
  (v:string,n:string)=>`${v} the ${n}`,
  (v:string,n:string)=>`${v} Your ${n}`,
  (v:string,n:string)=>`${v} Every ${pluralize(n)}`,
  (v:string,n:string)=>`${v} ${n}`,
];

function article(word:string) {
  const first = word.trim().toLowerCase();
  const exceptionsAn = /^(hour|honest|honor|heir)/.test(first);
  const exceptionsA = /^(university|unicorn|user|unit|european|one)/.test(first);
  return exceptionsAn || (!exceptionsA && /^[aeiou]/.test(first)) ? "an" : "a";
}
function pluralize(word:string) {
  const known:Record<string,string> = {Egg:"Eggs",Garden:"Gardens",Island:"Islands",Tower:"Towers",Factory:"Factories",Kingdom:"Kingdoms",Dragon:"Dragons",Crystal:"Crystals",Goblin:"Goblins",Banana:"Bananas",Potato:"Potatoes",Worm:"Worms",Robot:"Robots",Relic:"Relics",Castle:"Castles",Ghost:"Ghosts",Slime:"Slimes",Crown:"Crowns",Chicken:"Chickens",Toilet:"Toilets",Moon:"Moons",Pickle:"Pickles",Meteor:"Meteors",Portal:"Portals",Train:"Trains",Dream:"Dreams"};
  return known[word] || (word.endsWith("s") ? word : `${word}s`);
}
function rng(seed:number) { let x = seed >>> 0; return () => { x += 0x6D2B79F5; let t=x; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
export function generateTitles(opts:{count:number;style:Style;genre:Genre;keyword?:string;articleOnly?:boolean;absurdity:number;seed?:number}) {
  const random = rng(opts.seed ?? Math.floor(Math.random()*2**31));
  const result:string[] = [];
  const eligibleVerbs = verbs.filter(v => (opts.style==="Mixed" || v.styles.includes(opts.style)) && (opts.genre==="Any" || v.genres.includes(opts.genre)));
  let pool = nouns.filter(n => (opts.style==="Mixed" || !n.style || n.style.includes(opts.style)) && (opts.genre==="Any" || !n.genres || n.genres.includes(opts.genre)) && ((n.weird||0) <= opts.absurdity+1));
  if (opts.keyword?.trim()) {
    const key = opts.keyword.trim().replace(/[^\p{L}\p{N} -]/gu,"").slice(0,32);
    if (key) pool = pool.filter(n=>n.word.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(n.word.toLowerCase()));
    if (!pool.length && key) pool = [{word:key[0].toUpperCase()+key.slice(1), style:["Mixed"]}];
  }
  if (!eligibleVerbs.length) return [];
  if (!pool.length) pool = nouns.filter(n => opts.genre==="Any" || !n.genres || n.genres.includes(opts.genre));
  let attempts=0;
  while(result.length<Math.min(Math.max(opts.count,1),25) && attempts<opts.count*80+100) {
    attempts++;
    const verb=eligibleVerbs[Math.floor(random()*eligibleVerbs.length)].v;
    const noun=pool[Math.floor(random()*pool.length)].word;
    const tIndex=opts.articleOnly ? Math.floor(random()*2) : Math.floor(random()*templates.length);
    let title=templates[tIndex](verb,noun);
    if (opts.style==="Meme" && random()<0.28) title = `${title} Simulator`;
    title=title.replace(/\s+/g," ").trim();
    if (!result.some(x=>x.toLowerCase()===title.toLowerCase())) result.push(title);
  }
  return result;
}
