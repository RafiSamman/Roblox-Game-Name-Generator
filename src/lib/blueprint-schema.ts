import { z } from "zod";
const shortText = z.string().trim().min(1).max(1200);
const list = z.array(shortText).max(20);
export const blueprintSchema = z.object({
  title: shortText,
  alternatives: list,
  genre: shortText,
  audience: shortText,
  pitch: shortText,
  fantasy: shortText,
  pillars: list,
  coreLoop: list,
  sessionLoop: shortText,
  longTermLoop: shortText,
  mechanics: z.array(z.object({name:shortText,howItWorks:shortText,purpose:shortText})).min(2).max(8),
  firstFiveMinutes: list,
  economy: z.object({currencies:list,upgrades:list,sinks:list,risks:list}),
  world: z.object({layout:list,artDirection:shortText,keyLocations:list}),
  ui: list,
  social: list,
  retention: list,
  monetization: z.array(z.object({product:shortText,rationale:shortText})).max(12),
  technical: z.object({server:list,client:list,persistence:list,security:list}),
  feasibility: z.object({difficulty:z.enum(["Easy","Moderate","Hard"]),estimate:shortText,skills:list,defer:list}),
  milestones: z.array(z.object({name:shortText,tasks:list,doneWhen:shortText})).min(3).max(8),
  risks: z.array(z.object({risk:shortText,mitigation:shortText})).min(2).max(8),
  scores: z.array(z.object({label:shortText,score:z.number().int().min(1).max(10),reason:shortText})).max(12),
});
export type BlueprintData = z.infer<typeof blueprintSchema>;