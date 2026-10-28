import type { Blueprint, Difficulty, GameIdea, Genre } from "./types";
import { generateTitles } from "./naming";

const genreLoops:Record<string,{loop:string[];mechanics:{name:string;purpose:string}[];signature:string;progression:string;twist:string;difficulty:Difficulty;estimate:string}> = {
  "Simulator": {loop:["Perform a satisfying repeatable action","Earn a resource","Buy an upgrade that changes speed or capability","Unlock a new area with a fresh variation"],mechanics:[{name:"Action mastery","purpose":"Makes the primary action more satisfying and efficient."},{name:"Visible upgrades","purpose":"Shows clear progress in the world and UI."},{name:"Zone unlocks","purpose":"Introduces new targets and small rule changes."}],signature:"A rare event temporarily changes the best way to gather resources.",progression:"Upgrade the core action, unlock themed zones, and collect cosmetic milestones.",twist:"Each new zone adds a small twist to the core action instead of only larger numbers.",difficulty:"Moderate",estimate:"2–4 weeks for a focused MVP"},
  "Tycoon": {loop:["Complete a short task to earn starting cash","Place or upgrade a production station","Collect output and reinvest","Expand the base to unlock a new production choice"],mechanics:[{name:"Modular production","purpose":"Makes base growth visible and understandable."},{name:"Upgrade choices","purpose":"Lets players choose between faster income or new capabilities."},{name:"World expansion","purpose":"Turns progression into a visible spatial reward."}],signature:"Players choose between two production paths that change how their base works.",progression:"Unlock production modules, new rooms, and cosmetic base themes.",twist:"Production modules interact, so layout choices matter.",difficulty:"Moderate",estimate:"3–5 weeks for a focused MVP"},
  "Survival": {loop:["Scout a nearby area","Gather a limited set of resources","Prepare tools or shelter","Survive a changing environmental threat","Return with rewards and improve your next run"],mechanics:[{name:"Resource trade-offs","purpose":"Creates meaningful choices about what to carry."},{name:"Readable threat cycle","purpose":"Builds tension without unfair surprises."},{name:"Safe hub upgrades","purpose":"Gives each run lasting value."}],signature:"A predictable-but-variable environmental event changes routes and priorities.",progression:"Unlock tools, safer routes, and optional challenge modifiers.",twist:"The environment reshapes the safest route each run.",difficulty:"Hard",estimate:"4–8 weeks for a small MVP"},
  "Horror": {loop:["Explore a compact location","Find clues or a required item","Manage noise, light, or another clear risk","Evade a threat","Escape and unlock a new variation"],mechanics:[{name:"Threat telegraphing","purpose":"Makes danger tense but fair."},{name:"Clue-driven exploration","purpose":"Gives players a goal beyond running away."},{name:"Replay variations","purpose":"Changes clue placement or route conditions."}],signature:"The threat reacts to one player behavior, giving players a learnable counter-strategy.",progression:"Unlock new scenarios, badges, and optional challenge variants.",twist:"Players can learn the threat's rules and outsmart it rather than rely on random jumpscares.",difficulty:"Hard",estimate:"4–7 weeks for a small MVP"},
  "Obby": {loop:["Read an obstacle","Attempt a movement challenge","Reach a checkpoint","Learn a new variation","Complete a short themed section"],mechanics:[{name:"Readable obstacle language","purpose":"Players learn rules visually."},{name:"Checkpoints","purpose":"Keep failure from wasting too much time."},{name:"Optional mastery routes","purpose":"Reward skilled players without blocking beginners."}],signature:"A central movement rule evolves through the level.",progression:"Unlock themed stages, time trials, and cosmetic trails.",twist:"Each world remixes one familiar movement rule.",difficulty:"Easy",estimate:"1–3 weeks for a focused MVP"},
  "Incremental": {loop:["Complete a short action","Earn a resource","Buy a meaningful multiplier or automation","Reach a milestone","Unlock a new layer with a new decision"],mechanics:[{name:"Milestone upgrades","purpose":"Avoids a flat stream of tiny stat increases."},{name:"Optional automation","purpose":"Changes the pace of play."},{name:"Reset with a new choice","purpose":"Adds a fresh strategic layer only when justified."}],signature:"Milestones unlock alternate upgrade paths instead of only larger multipliers.",progression:"Unlock automation, new resource layers, and challenge goals.",twist:"Players choose a specialization that changes which upgrades are strongest.",difficulty:"Moderate",estimate:"2–4 weeks for a focused MVP"},
  "Roleplay": {loop:["Enter a social space","Choose an activity or role","Interact with other players","Earn expressive unlocks","Discover another social activity"],mechanics:[{name:"Expressive tools","purpose":"Helps players communicate personality."},{name:"Shared activities","purpose":"Creates easy conversation starters."},{name:"Cosmetic milestones","purpose":"Rewards participation without pay-to-win."}],signature:"A rotating collaborative activity gives strangers a low-pressure reason to interact.",progression:"Unlock emotes, room decorations, titles, and themed cosmetics.",twist:"The world changes small details based on community participation.",difficulty:"Moderate",estimate:"3–5 weeks for a focused MVP"},
  "Collectathon": {loop:["Explore a readable area","Spot a collectible or clue","Use a tool or movement ability to reach it","Complete a collection set","Unlock a new area or cosmetic"],mechanics:[{name:"Collection sets","purpose":"Gives collecting a goal beyond raw quantity."},{name:"Distinct collectible silhouettes","purpose":"Makes discovery readable."},{name:"Ability-gated secrets","purpose":"Turns progression into exploration."}],signature:"Some collectibles reveal a small environmental story when grouped.",progression:"Unlock new tools, areas, and collection displays.",twist:"Collections reveal hidden paths rather than just filling a counter.",difficulty:"Easy",estimate:"2–4 weeks for a focused MVP"},
  "Social": {loop:["Join a shared activity","Express yourself or contribute","Receive a visible social result","Unlock a new activity or decoration","Invite friends into the next activity"],mechanics:[{name:"Quick party activities","purpose":"Give groups something to do immediately."},{name:"Player expression","purpose":"Supports identity and conversation."},{name:"Shared spaces","purpose":"Creates a reason to stay together."}],signature:"Players collectively influence a small feature of the shared space.",progression:"Unlock emotes, decorations, and optional activity variants.",twist:"The hangout subtly evolves through group participation.",difficulty:"Moderate",estimate:"2–5 weeks for a focused MVP"},
  "Puzzle": {loop:["Observe a room and its rule","Test a small interaction","Infer a relationship","Solve a compact challenge","Use the learned rule in a more surprising setup"],mechanics:[{name:"One clear rule at a time","purpose":"Makes puzzles learnable."},{name:"Safe experimentation","purpose":"Encourages discovery without punishment."},{name:"Rule combinations","purpose":"Creates depth from a small mechanic set."}],signature:"Two simple rules combine to produce an unexpected solution.",progression:"Unlock puzzle rooms and optional mastery challenges.",twist:"The final room remixes familiar rules rather than introducing a new system.",difficulty:"Moderate",estimate:"3–5 weeks for a focused MVP"},
  "Racing": {loop:["Choose a short course","Race using one skillful mechanic","Earn a time or placement reward","Improve vehicle handling or cosmetics","Unlock a harder route"],mechanics:[{name:"Readable racing lines","purpose":"Makes mastery visible."},{name:"Short races","purpose":"Supports quick repeat sessions."},{name:"Ghost replay or personal best","purpose":"Encourages self-improvement."}],signature:"Each track has one optional risk-reward shortcut.",progression:"Unlock tracks, cosmetic vehicle parts, and time-trial medals.",twist:"Shortcuts reward route knowledge rather than raw speed alone.",difficulty:"Moderate",estimate:"3–6 weeks for a focused MVP"},
  "Tower Defense": {loop:["Earn starting resources","Place a small set of defenders","Watch enemy waves and identify weaknesses","Earn rewards","Adjust the layout before the next wave"],mechanics:[{name:"Distinct defender roles","purpose":"Creates strategic choices."},{name:"Readable enemy traits","purpose":"Makes counterplay understandable."},{name:"Between-wave planning","purpose":"Lets players adapt rather than spam upgrades."}],signature:"One map feature changes how placement and targeting work.",progression:"Unlock new defender roles and challenge modifiers.",twist:"Terrain creates meaningful placement puzzles.",difficulty:"Hard",estimate:"5–8 weeks for a focused MVP"},
  "Adventure": {loop:["Receive a clear objective","Explore a compact area","Solve a traversal or interaction challenge","Discover a reward or story clue","Unlock the next destination"],mechanics:[{name:"Compact objectives","purpose":"Keeps exploration purposeful."},{name:"Traversal abilities","purpose":"Creates satisfying movement choices."},{name:"Environmental storytelling","purpose":"Rewards curiosity."}],signature:"A tool changes both navigation and how players interpret the environment.",progression:"Unlock tools, destinations, and optional hidden challenges.",twist:"Previously visited spaces gain new meaning after a tool unlock.",difficulty:"Moderate",estimate:"3–6 weeks for a focused MVP"}
};
const fallback = genreLoops["Simulator"];
const genreAliases:Record<string,string> = {"Strategy":"Tycoon","Combat":"Adventure","Exploration":"Adventure"};
function loopFor(genre:string) { return genreLoops[genre] || genreLoops[genreAliases[genre]] || fallback; }
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0;}
export function makeIdea(title:string, genreInput:Genre="Any", seed?:number):GameIdea {
  const genres = Object.keys(genreLoops);
  const genre = (genreInput==="Any" ? genres[(seed ?? hash(title))%genres.length] : genreInput) as Exclude<Genre,"Any">;
  const design=loopFor(genre);
  const titleNoun=title.replace(/^(Grow|Steal|Hatch|Mine|Build|Escape|Collect|Survive|Feed|Raise|Defend|Become|Explore|Merge|Race|Solve|Pet|Deliver|Rescue|Haunt|Launch|Punch)\s+(an?\s+|the\s+|your\s+|every\s+)?/i,"").replace(/ Simulator$/i,"");
  const pitchByGenre:Record<string,string> = {
    Simulator:`Master the central action in ${titleNoun}, unlock new variations, and make each upgrade change how efficiently you play.`,
    Tycoon:`Build a compact ${titleNoun.toLowerCase()} operation, choose what to upgrade, and expand into new production options.`,
    Survival:`Explore a dangerous ${titleNoun.toLowerCase()} environment, prepare for changing threats, and bring resources back to safety.`,
    Horror:`Investigate ${titleNoun.toLowerCase()}, learn the threat's rules, and escape through routes that change between runs.`,
    Obby:`Master a distinctive movement rule across short obstacle stages, checkpoints, and optional skill routes.`,
    "Incremental":`Turn small actions into a growing operation, choose meaningful upgrade paths, and unlock new layers of play.`,
    "Roleplay":`Explore a themed social world, take on expressive roles, and join activities that create stories with other players.`,
    "Collectathon":`Search a colorful world for hidden ${titleNoun.toLowerCase()} discoveries, complete sets, and unlock new places to explore.`,
    "Social":`Join quick group activities, personalize your space, and help the shared world evolve through participation.`,
    "Puzzle":`Discover the rules of ${titleNoun.toLowerCase()} through compact puzzles that combine familiar mechanics in surprising ways.`,
    "Racing":`Race through compact courses, learn risk-reward shortcuts, and improve personal records as new routes unlock.`,
    "Tower Defense":`Place a small roster of defenders, read enemy patterns, and adapt your strategy to terrain and escalating waves.`,
    "Adventure":`Explore a connected set of compact areas, use tools to solve environmental challenges, and uncover optional secrets.`
  };
  const mechanics = design.mechanics;
  const score=(base:number,offset:number)=>Math.max(3,Math.min(9,base+((hash(title+offset)%3)-1)));
  return {
    id:`idea-${hash(title+"|"+genre).toString(36)}`,title,genre,
    pitch:pitchByGenre[genre] || design.twist,
    fantasy:`Feel like the kind of player who can ${title.toLowerCase().replace(/[.!?]$/,"")}, with a world that reacts visibly to your decisions.`,
    loop:design.loop,mechanics,signature:design.signature,progression:design.progression,twist:design.twist,
    difficulty:design.difficulty,estimate:design.estimate,
    scores:[
      {label:"Title clarity",score:score(7,1),reason:"The title suggests a clear action or central fantasy; validate it with playtesters."},
      {label:"Core-loop strength",score:score(7,2),reason:"The loop includes an action, feedback, a reward, and a next goal."},
      {label:"Distinctiveness",score:score(6,3),reason:"The signature mechanic adds a hook, but similarity to existing games still needs human review."},
      {label:"Solo-dev feasibility",score:score(genre==="Obby"||genre==="Collectathon"?8:genre==="Horror"||genre==="Tower Defense"?5:6,4),reason:"Estimate assumes a small MVP, placeholder art, and limited feature scope."}
    ],
    risks:[
      "The core action may become repetitive; test whether the signature mechanic changes decisions rather than only increasing numbers.",
      "The scope can grow quickly; ship one polished gameplay area before adding more zones or systems.",
      "The title and thumbnail may overpromise; make the first session demonstrate the main fantasy quickly."
    ]
  };
}
export function generateIdeas(titles:string[], genre:Genre, seed=1) {
  return titles.map((title,i)=>makeIdea(title,genre,seed+i));
}
export function offlineBlueprint(idea:GameIdea):Blueprint {
  const g=loopFor(idea.genre);
  return {
    title:idea.title, alternatives:[`The ${idea.title.replace(/^(Grow|Steal|Hatch|Mine|Build|Escape|Collect|Survive|Feed|Raise|Defend|Become|Explore|Merge|Race|Solve|Pet|Deliver|Rescue|Haunt|Launch|Punch)\s+/i,"")}`,`${idea.title}: Remix`],
    genre:idea.genre,audience:"Broad Roblox audience; keep controls readable for new players and mobile users.",
    pitch:idea.pitch,fantasy:idea.fantasy,pillars:["One immediately understandable main action","Visible progress after short sessions","A signature twist that changes player decisions"],
    coreLoop:idea.loop,sessionLoop:"Start with a clear objective, complete several short actions, earn a visible reward, make one meaningful upgrade, and reach a new small goal.",
    longTermLoop:idea.progression,
    mechanics:idea.mechanics.map(m=>({name:m.name,howItWorks:`Implement a small first version of ${m.name.toLowerCase()} in one playable area. Add variations only after playtesting.`,purpose:m.purpose})),
    firstFiveMinutes:[
      "Spawn in a safe, visually readable area with one obvious objective.",
      "Use a short contextual prompt to teach the primary action without a long tutorial.",
      "Complete the first action and show clear audiovisual feedback.",
      "Award the first upgrade quickly and explain what changed.",
      "Introduce the signature mechanic in a low-risk situation.",
      "Offer a new goal that demonstrates the next layer of the loop."
    ],
    economy:{currencies:["Start with one earnable soft currency unless the design proves another is needed."],upgrades:["Improve the primary action","Unlock one new gameplay variation","Add one visible cosmetic or world improvement"],sinks:["Core upgrades","Access to a new zone only if it introduces meaningful gameplay"],risks:["Avoid inflation by testing earning rates against upgrade prices.","Keep critical progression achievable without purchases."]},
    world:{layout:["Spawn and onboarding area","One core gameplay area","One small progression-gated area or challenge"],artDirection:"Use a cohesive stylized Roblox look, readable silhouettes, strong color coding, and placeholder assets until the loop is fun.",keyLocations:["Spawn and tutorial point","Main gameplay loop","Upgrade or reward station"]},
    ui:["Simple objective indicator","Currency and progress display only where useful","Contextual interaction prompts","Upgrade comparison that explains the benefit","Clear success and failure feedback"],
    social:["Add optional party or leaderboard features only if they reinforce the genre. For the MVP, test the solo loop first."],
    retention:["Provide short achievable session goals.","Use unlocks that introduce new decisions rather than only bigger numbers.","Plan future updates around new variations of existing systems."],
    monetization:[{product:"Optional cosmetic theme or emote",rationale:"Only add after the free core loop is enjoyable; avoid pay-to-win and preserve full access to essential progression."}],
    technical:{server:["Validate rewards, currency, unlocks, and important actions on the server.","Keep shared game rules in reusable ModuleScripts.","Use RemoteEvents only for requests; validate every request server-side."],client:["Handle UI, camera, local effects, input, and non-authoritative presentation on the client.","Support touch controls and test common mobile screen sizes."],persistence:["Add DataStoreService only when progression needs to survive sessions.","Validate stored data and handle failed loads and saves safely."],security:["Never trust client-supplied currency, reward amounts, damage, inventory, or purchase completion.","Add request throttling and distance/state checks to remote handlers."]},
    feasibility:{difficulty:idea.difficulty,estimate:idea.estimate,skills:["Basic Roblox Studio building","Luau fundamentals","Simple UI and event handling","Testing and debugging"],defer:["Trading or player-to-player economies","Multiple worlds","Complex monetization","Large-scale procedural systems","Cross-server matchmaking"]},
    milestones:[
      {name:"Graybox the core loop",tasks:["Build one small test area","Implement the primary action","Add clear feedback and a basic reward"],doneWhen:"A new player can understand the action and repeat it without developer help."},
      {name:"Add progression",tasks:["Add one currency or progress counter","Implement two upgrades","Show the impact of each upgrade"],doneWhen:"Players can explain what they earned and why the upgrade matters."},
      {name:"Add the signature mechanic",tasks:["Implement the smallest version","Teach it in a safe encounter","Test whether it changes decisions"],doneWhen:"Playtesters can describe how the signature mechanic changes the experience."},
      {name:"Polish and test",tasks:["Improve UI feedback and sound","Test keyboard, controller where relevant, and touch","Fix major exploits and softlocks"],doneWhen:"A short session can be completed repeatedly without a blocking bug."}
    ],
    risks:idea.risks.map((risk,i)=>({risk,mitigation:["Use playtests to change the loop before adding content.","Keep a written must-have list and defer optional systems.","Align the thumbnail and first five minutes with the actual core action."][i%3]})),
    scores:idea.scores,source:"offline"
  };
}