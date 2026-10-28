export type Style = "Mixed" | "Classic" | "Meme" | "Weird" | "Fantasy" | "Horror" | "Cozy" | "Competitive" | "Experimental";
export type Genre = "Any" | "Simulator" | "Tycoon" | "Survival" | "Horror" | "Obby" | "Incremental" | "Roleplay" | "Collectathon" | "Social" | "Strategy" | "Tower Defense" | "Exploration" | "Racing" | "Puzzle" | "Combat" | "Adventure";
export type Difficulty = "Easy" | "Moderate" | "Hard";

export type GameIdea = {
  id: string;
  title: string;
  genre: Exclude<Genre, "Any">;
  pitch: string;
  fantasy: string;
  loop: string[];
  mechanics: { name: string; purpose: string }[];
  signature: string;
  progression: string;
  twist: string;
  difficulty: Difficulty;
  estimate: string;
  scores: { label: string; score: number; reason: string }[];
  risks: string[];
};

export type Blueprint = {
  title: string;
  alternatives: string[];
  genre: string;
  audience: string;
  pitch: string;
  fantasy: string;
  pillars: string[];
  coreLoop: string[];
  sessionLoop: string;
  longTermLoop: string;
  mechanics: { name: string; howItWorks: string; purpose: string }[];
  firstFiveMinutes: string[];
  economy: { currencies: string[]; upgrades: string[]; sinks: string[]; risks: string[] };
  world: { layout: string[]; artDirection: string; keyLocations: string[] };
  ui: string[];
  social: string[];
  retention: string[];
  monetization: { product: string; rationale: string }[];
  technical: { server: string[]; client: string[]; persistence: string[]; security: string[] };
  feasibility: { difficulty: Difficulty; estimate: string; skills: string[]; defer: string[] };
  milestones: { name: string; tasks: string[]; doneWhen: string }[];
  risks: { risk: string; mitigation: string }[];
  scores: { label: string; score: number; reason: string }[];
  source: "offline" | "ai";
};