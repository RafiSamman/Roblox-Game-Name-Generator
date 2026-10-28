 "use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, Shuffle, Heart, Copy, Download, ChevronDown, ChevronUp, WandSparkles, Gamepad2, SlidersHorizontal, BookmarkCheck, Trash2, Zap, BrainCircuit, Check, AlertCircle, RefreshCw, X, Search, FileJson, FileText, Settings2, Layers3 } from "lucide-react";
import { generateTitles } from "@/lib/naming";
import { generateIdeas, offlineBlueprint } from "@/lib/concepts";
import { downloadText, ideaToMarkdown, safeFilename } from "@/lib/export";
import type { Blueprint, GameIdea, Genre, Style } from "@/lib/types";

const styles:Style[]=["Mixed","Classic","Meme","Weird","Fantasy","Horror","Cozy","Competitive","Experimental"];
const genres:Genre[]=["Any","Simulator","Tycoon","Survival","Horror","Obby","Incremental","Roleplay","Collectathon","Social","Strategy","Tower Defense","Exploration","Racing","Puzzle","Combat","Adventure"];
const STORE="bloxidea:v1";
type Saved={idea:GameIdea; blueprint?:Blueprint; savedAt:number};

export default function Home() {
  const [style,setStyle]=useState<Style>("Mixed");
  const [genre,setGenre]=useState<Genre>("Any");
  const [absurdity,setAbsurdity]=useState(2);
  const [keyword,setKeyword]=useState("");
  const [articleOnly,setArticleOnly]=useState(false);
  const [count,setCount]=useState(10);
  const [ideas,setIdeas]=useState<GameIdea[]>([]);
  const [favorites,setFavorites]=useState<Saved[]>([]);
  const [expanded,setExpanded]=useState<string|null>(null);
  const [blueprints,setBlueprints]=useState<Record<string,Blueprint>>({});
  const [loading,setLoading]=useState<string|null>(null);
  const [notice,setNotice]=useState("");
  const [view,setView]=useState<"generator"|"saved">("generator");
  const [showSettings,setShowSettings]=useState(false);
  const [aiEnabled,setAiEnabled]=useState(false);
  const [ready,setReady]=useState(false);
  const [seed,setSeed]=useState(27);

  useEffect(()=>{
    try {
      const raw=localStorage.getItem(STORE);
      if(raw){const data=JSON.parse(raw);if(Array.isArray(data.favorites))setFavorites(data.favorites);if(data.settings){setStyle(data.settings.style||"Mixed");setGenre(data.settings.genre||"Any");setAbsurdity(data.settings.absurdity??2);setArticleOnly(!!data.settings.articleOnly);setAiEnabled(!!data.settings.aiEnabled);}}
    } catch { setNotice("Saved browser data could not be read. You can continue and save new ideas."); }
    setReady(true);
  },[]);
  useEffect(()=>{if(!ready)return;try{localStorage.setItem(STORE,JSON.stringify({favorites,settings:{style,genre,absurdity,articleOnly,aiEnabled}}));}catch{setNotice("Browser storage is unavailable. Your current session still works.");}},[ready,favorites,style,genre,absurdity,articleOnly,aiEnabled]);
  const shownIdeas=useMemo(()=>view==="saved"?favorites.map(x=>x.idea):ideas,[view,favorites,ideas]);

  function generate() {
    setSeed(s=>s+1);
    const titles=generateTitles({count,style,genre,keyword,articleOnly,absurdity,seed:seed+1});
    const results=generateIdeas(titles,genre,seed+1);
    setIdeas(results);setView("generator");setExpanded(null);
    setNotice(results.length?`${results.length} fresh ${results.length===1?"idea":"ideas"} generated.`:"No matching titles found. Try loosening a filter.");
  }
  function save(idea:GameIdea) {
    setFavorites(old=>old.some(x=>x.idea.id===idea.id)?old.filter(x=>x.idea.id!==idea.id):[{idea,blueprint:blueprints[idea.id],savedAt:Date.now()},...old]);
    setNotice(favorites.some(x=>x.idea.id===idea.id)?"Removed from favorites.":"Saved to favorites.");
  }
  async function copy(text:string) {
    try { await navigator.clipboard.writeText(text);setNotice("Copied to clipboard."); }
    catch { setNotice("Clipboard access was blocked by the browser. Try selecting and copying the text manually."); }
  }
  function getBlueprint(idea:GameIdea) {
    return blueprints[idea.id] || favorites.find(x=>x.idea.id===idea.id)?.blueprint || offlineBlueprint(idea);
  }
  async function expand(idea:GameIdea) {
    if(expanded===idea.id){setExpanded(null);return;}
    setExpanded(idea.id);
    if(blueprints[idea.id] || favorites.find(x=>x.idea.id===idea.id)?.blueprint) return;
    setLoading(idea.id);
    if(aiEnabled) {
      try {
        const response=await fetch("/api/generate-blueprint",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:idea.title,idea})});
        const data=await response.json();
        if(response.ok && data.blueprint) {
          setBlueprints(old=>({...old,[idea.id]:data.blueprint}));
          setFavorites(old=>old.map(x=>x.idea.id===idea.id?{...x,blueprint:data.blueprint}:x));
          setNotice("AI blueprint generated.");
          setLoading(null);return;
        }
        setNotice(`${data.error||"AI unavailable"} Using the offline blueprint instead.`);
      } catch { setNotice("AI request failed. Using the offline blueprint instead."); }
    }
    setBlueprints(old=>({...old,[idea.id]:offlineBlueprint(idea)}));
    setLoading(null);
  }
  function exportIdea(idea:GameIdea,asJson=false) {
    const bp=expanded===idea.id?getBlueprint(idea):blueprints[idea.id]||favorites.find(x=>x.idea.id===idea.id)?.blueprint;
    const content=asJson?JSON.stringify({idea,blueprint:bp||null},null,2):ideaToMarkdown(idea,bp);
    downloadText(`${safeFilename(idea.title)}.${asJson?"json":"md"}`,content,asJson?"application/json":"text/markdown");
  }
  function removeAll(){if(confirm("Delete all saved favorites from this browser? This cannot be undone.")){setFavorites([]);setNotice("All saved ideas were removed.");}}
  function remix(idea:GameIdea){const t=generateTitles({count:1,style,genre:idea.genre,keyword:keyword||undefined,articleOnly,absurdity,seed:seed+Date.now()%100000})[0];if(t){const next=generateIdeas([t],idea.genre,seed+3)[0];setIdeas(old=>[next,...old.filter(x=>x.id!==next.id)]);setView("generator");setExpanded(null);setNotice("Remixed into a new concept.");}}
  function similar(idea:GameIdea){const next={...idea,id:`${idea.id}-variant-${Date.now()}`,title:`${idea.title}: After Dark`,pitch:`${idea.pitch} This variant introduces a riskier challenge mode and a different strategic choice.`,twist:`${idea.twist} The variant adds a timed challenge that changes the optimal route.`};setIdeas(old=>[next,...old]);setView("generator");setExpanded(null);setNotice("Created a variant. Review it before treating it as a distinct concept.");}
  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="BloxIdea Studio home"><span className="brand-mark"><Layers3 size={22}/></span><span>BloxIdea<span className="brand-light"> Studio</span></span></a>
      <nav className="topnav">
        <button className={view==="generator"?"nav-link active":"nav-link"} onClick={()=>setView("generator")}><WandSparkles size={16}/> Generator</button>
        <button className={view==="saved"?"nav-link active":"nav-link"} onClick={()=>setView("saved")}><BookmarkCheck size={16}/> Saved <span className="nav-count">{favorites.length}</span></button>
      </nav>
      <button className="icon-button settings-btn" onClick={()=>setShowSettings(v=>!v)} aria-label="Settings"><Settings2 size={18}/></button>
    </header>

    <section className="hero">
      <div className="eyebrow"><span className="live-dot"/> YOUR NEXT ROBLOX GAME STARTS HERE</div>
      <h1>From random idea<br/>to <span className="gradient-text">real game plan.</span></h1>
      <p className="hero-copy">Cook up catchy titles, discover a gameplay hook, and expand the best ideas into a blueprint you can actually build.</p>
      <div className="hero-chips"><span><Zap size={14}/> Offline-first</span><span><BrainCircuit size={14}/> Optional AI blueprints</span><span><Gamepad2 size={14}/> Solo-dev friendly</span></div>
    </section>

    {showSettings&&<section className="settings-panel panel">
      <div className="section-heading"><div><span className="eyebrow">PREFERENCES</span><h2>Generation settings</h2></div><button className="icon-button" onClick={()=>setShowSettings(false)} aria-label="Close settings"><X size={18}/></button></div>
      <label className="toggle-row"><span><strong>AI blueprint expansion</strong><small>Use Gemini to expand an idea into a detailed blueprint. Offline mode always works.</small></span><input type="checkbox" checked={aiEnabled} onChange={e=>setAiEnabled(e.target.checked)}/></label>
      <p className="muted tiny">AI runs only when you expand a concept. Set GEMINI_API_KEY and optionally GEMINI_MODEL on your server or Vercel.</p>
    </section>}

    {view==="generator"&&<section className="generator-panel panel">
      <div className="section-heading"><div><div className="section-kicker"><Sparkles size={15}/> THE IDEA ENGINE</div><h2>What are we cooking?</h2><p>Mix a naming style with a genre, then let the generator surprise you.</p></div><div className="engine-icon"><Shuffle size={24}/></div></div>
      <div className="control-grid">
        <label className="field"><span>Naming style</span><select value={style} onChange={e=>setStyle(e.target.value as Style)}>{styles.map(s=><option key={s}>{s}</option>)}</select></label>
        <label className="field"><span>Game genre</span><select value={genre} onChange={e=>setGenre(e.target.value as Genre)}>{genres.map(g=><option key={g}>{g}</option>)}</select></label>
        <label className="field keyword-field"><span>Keyword <em>optional</em></span><div className="input-wrap"><Search size={16}/><input value={keyword} onChange={e=>setKeyword(e.target.value)} maxLength={32} placeholder="e.g. moon, slime, school"/></div></label>
      </div>
      <div className="range-row"><label htmlFor="absurdity">Absurdity level <strong>{["Sensible","Playful","Weird","Unhinged"][absurdity]}</strong></label><input id="absurdity" type="range" min="0" max="3" value={absurdity} onChange={e=>setAbsurdity(Number(e.target.value))}/><span className="range-ends"><span>Grounded</span><span>Unhinged</span></span></div>
      <div className="toggle-row formula-toggle"><span><strong>Emphasize article-based titles</strong><small>Examples: Steal the Crown, Hatch an Egg, Build Your Kingdom</small></span><input type="checkbox" checked={articleOnly} onChange={e=>setArticleOnly(e.target.checked)}/></div>
      <div className="generate-row"><div className="count-pills" role="group" aria-label="Number of ideas">{[1,10,25].map(n=><button key={n} className={count===n?"count-pill selected":"count-pill"} onClick={()=>setCount(n)}>{n} idea{n===1?"":"s"}</button>)}</div><button className="primary-button" onClick={generate}><Sparkles size={17}/> Generate ideas <span className="button-shine">↗</span></button></div>
    </section>}

    {notice&&<div className="notice" role="status"><span><Check size={15}/>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss notification"><X size={14}/></button></div>}

    <section className="results-section">
      <div className="results-header"><div><div className="section-kicker">{view==="saved"?<><Heart size={15}/> YOUR COLLECTION</>:<><Sparkles size={15}/> THE IDEA DROP</>}</div><h2>{view==="saved"?"Saved ideas":"Freshly generated"}</h2><p>{view==="saved"?"Your saved concepts live in this browser.":"Pick a title that sparks something. Expand it to reveal the actual game plan."}</p></div>{view==="saved"&&favorites.length>0&&<button className="subtle-button danger" onClick={removeAll}><Trash2 size={15}/> Clear all</button>}</div>
      {shownIdeas.length===0?<div className="empty-state"><div className="empty-icon"><WandSparkles size={26}/></div><h3>{view==="saved"?"Your idea vault is empty":"Ready to cook?"}</h3><p>{view==="saved"?"Generate a few ideas and save the ones with potential.":"Choose your filters and generate your first batch. No API key needed."}</p>{view==="saved"?<button className="secondary-button" onClick={()=>setView("generator")}>Back to generator</button>:<button className="primary-button" onClick={generate}><Sparkles size={16}/> Generate first ideas</button>}</div>:
      <div className="ideas-grid">{shownIdeas.map((idea,index)=>{
        const isSaved=favorites.some(x=>x.idea.id===idea.id);
        const isExpanded=expanded===idea.id;
        const bp=getBlueprint(idea);
        const isLoading=loading===idea.id;
        return <article className={`idea-card ${isExpanded?"expanded":""}`} key={idea.id}>
          <div className="card-topline"><span className="genre-tag">{idea.genre}</span><span className="idea-number">IDEA {String(index+1).padStart(2,"0")}</span></div>
          <h3>{idea.title}</h3><p className="idea-pitch">{idea.pitch}</p>
          <div className="loop-box"><span className="mini-label">CORE LOOP</span><div className="loop-steps">{idea.loop.slice(0,3).map((step,i)=><span key={step}>{step}{i<2&&<b> → </b>}</span>)}</div></div>
          <div className="signature"><span className="signature-icon"><Zap size={15}/></span><div><span className="mini-label">THE HOOK</span><p>{idea.signature}</p></div></div>
          <div className="card-meta"><span className={`difficulty ${idea.difficulty.toLowerCase()}`}>{idea.difficulty}</span><span><SlidersHorizontal size={13}/>{idea.estimate}</span></div>
          <div className="card-actions">
            <button className="expand-button" onClick={()=>expand(idea)}>{isExpanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>} {isExpanded?"Hide blueprint":"Expand blueprint"}</button>
            <button className={`icon-button favorite-button ${isSaved?"favorited":""}`} onClick={()=>save(idea)} aria-label={isSaved?"Remove favorite":"Save favorite"}><Heart size={17} fill={isSaved?"currentColor":"none"}/></button>
            <button className="icon-button" onClick={()=>copy(idea.title)} aria-label="Copy title"><Copy size={16}/></button>
          </div>
          {isExpanded&&<div className="blueprint">
            {isLoading?<div className="loading-state"><span className="spinner"/><p>Building the blueprint…</p><small>Connecting the title to a playable loop, systems, and MVP milestones.</small></div>:<>
              <div className="blueprint-heading"><div><span className="section-kicker"><Layers3 size={14}/> GAME DESIGN BLUEPRINT</span><h4>{bp.title}</h4></div><span className={`source-tag ${bp.source}`}>{bp.source==="ai"?"AI generated":"Offline blueprint"}</span></div>
              <div className="blueprint-section"><h5>01 / Core gameplay loop</h5><ol className="numbered-list">{bp.coreLoop.map((x,i)=><li key={x}><span>{i+1}</span>{x}</li>)}</ol><p className="blueprint-paragraph"><strong>Session loop:</strong> {bp.sessionLoop}</p><p className="blueprint-paragraph"><strong>Long-term progression:</strong> {bp.longTermLoop}</p></div>
              <div className="blueprint-section"><h5>02 / Mechanics that matter</h5><div className="mechanic-list">{bp.mechanics.map(m=><div className="mechanic-item" key={m.name}><strong>{m.name}</strong><p>{m.howItWorks}</p><small>{m.purpose}</small></div>)}</div></div>
              <div className="blueprint-section"><h5>03 / First five minutes</h5><ol className="plain-list">{bp.firstFiveMinutes.map((x,i)=><li key={x}>{x}</li>)}</ol></div>
              <div className="blueprint-section"><h5>04 / World & presentation</h5><p className="blueprint-paragraph">{bp.world.artDirection}</p><ul className="plain-list">{bp.world.layout.map(x=><li key={x}>{x}</li>)}</ul><h6>UI essentials</h6><ul className="plain-list">{bp.ui.slice(0,5).map(x=><li key={x}>{x}</li>)}</ul></div>
              <div className="blueprint-section"><h5>05 / Progression & retention</h5><h6>Upgrades</h6><ul className="plain-list">{bp.economy.upgrades.map(x=><li key={x}>{x}</li>)}</ul><h6>Reasons to return</h6><ul className="plain-list">{bp.retention.map(x=><li key={x}>{x}</li>)}</ul></div>
              <div className="blueprint-section"><h5>06 / Roblox implementation notes</h5><div className="tech-grid"><div><h6>Server</h6><ul className="plain-list">{bp.technical.server.map(x=><li key={x}>{x}</li>)}</ul></div><div><h6>Client</h6><ul className="plain-list">{bp.technical.client.map(x=><li key={x}>{x}</li>)}</ul></div></div><h6>Security reminders</h6><ul className="plain-list">{bp.technical.security.map(x=><li key={x}>{x}</li>)}</ul></div>
              <div className="blueprint-section"><h5>07 / MVP build order</h5><div className="milestones">{bp.milestones.map((m,i)=><div className="milestone" key={m.name}><div className="milestone-number">{String(i+1).padStart(2,"0")}</div><div><strong>{m.name}</strong><ul className="plain-list">{m.tasks.map(t=><li key={t}>{t}</li>)}</ul><p className="done-when"><Check size={13}/> Done when: {m.doneWhen}</p></div></div>)}</div></div>
              <div className="blueprint-section"><h5>08 / Risks to watch</h5>{bp.risks.map(r=><div className="risk-item" key={r.risk}><AlertCircle size={15}/><div><strong>{r.risk}</strong><p>{r.mitigation}</p></div></div>)}</div>
              <div className="blueprint-section"><h5>09 / Design scorecard</h5><div className="scores">{bp.scores.map(s=><div className="score-row" key={s.label}><div><span>{s.label}</span><small>{s.reason}</small></div><strong>{s.score}<small>/10</small></strong></div>)}</div><p className="muted tiny">Heuristic design checks, not predictions of popularity or revenue. Development time is an estimate.</p></div>
              <div className="blueprint-section"><h5>10 / Scope guardrails</h5><p className="blueprint-paragraph"><strong>Difficulty:</strong> {bp.feasibility.difficulty} · <strong>Estimate:</strong> {bp.feasibility.estimate}</p><h6>Build later, not now</h6><ul className="plain-list">{bp.feasibility.defer.map(x=><li key={x}>{x}</li>)}</ul><p className="blueprint-paragraph"><strong>Monetization:</strong> {bp.monetization.map(x=>x.product).join("; ")}. Keep purchases optional and fair.</p></div>
              <div className="blueprint-footer"><span><Check size={14}/> Blueprint ready to refine</span><div><button className="secondary-button small" onClick={()=>copy(ideaToMarkdown(idea,bp))}><Copy size={14}/> Copy blueprint</button><button className="secondary-button small" onClick={()=>exportIdea(idea,false)}><Download size={14}/> Markdown</button><button className="secondary-button small" onClick={()=>exportIdea(idea,true)}><FileJson size={14}/> JSON</button></div></div>
            </>}
          </div>}
          <div className="card-bottom"><button onClick={()=>remix(idea)}><RefreshCw size={14}/> Remix</button><button onClick={()=>similar(idea)}><WandSparkles size={14}/> Variant</button><button onClick={()=>exportIdea(idea,false)}><FileText size={14}/> Export</button></div>
        </article>
      })}</div>}
    </section>
    <footer className="footer"><div className="brand small-brand"><span className="brand-mark"><Layers3 size={16}/></span><span>BloxIdea<span className="brand-light"> Studio</span></span></div><span>Made for builders, not just brainstormers.</span><span className="footer-note">Offline generation · Local saves · Optional AI</span></footer>
  </main>;
}