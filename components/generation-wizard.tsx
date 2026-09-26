"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Check, FileQuestion, Layers3, LoaderCircle, Presentation, Sparkles } from "lucide-react";
import { demoSources } from "@/lib/demo-data";

const formats = [
  { id: "reviewer", label: "Reviewer", icon: BookOpen, description: "Structured notes and key ideas" },
  { id: "flashcards", label: "Flashcards", icon: Layers3, description: "Fast active-recall prompts" },
  { id: "quiz", label: "Quiz", icon: FileQuestion, description: "Short, focused practice" },
  { id: "practice_test", label: "Practice test", icon: Check, description: "Longer mixed assessment" },
  { id: "slide_deck", label: "Slide deck", icon: Presentation, description: "A condensed presentation" },
];

export function GenerationWizard({ groupId }: { groupId: string }) {
  const router = useRouter();
  const [format, setFormat] = useState("quiz"); const [count, setCount] = useState(10); const [difficulty, setDifficulty] = useState("mixed"); const [selected, setSelected] = useState(demoSources.map((s) => s.id)); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [types, setTypes] = useState(["multiple_choice", "true_false", "fill_blank", "enumeration"]);
  async function generate() {
    setLoading(true); setError("");
    try { const res = await fetch("/api/materials/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ groupId, format, count, difficulty, sourceIds: selected, questionTypes: types }) }); const json = await res.json(); if (!res.ok) throw new Error(json.error || "Generation failed"); sessionStorage.setItem(`material:${json.id}`, JSON.stringify({ ...json.material, format })); router.push(`/app/materials/${json.id}/edit`); }
    catch (e) { setError(e instanceof Error ? e.message : "Generation failed"); setLoading(false); }
  }
  return <div className="generator-layout"><section className="generator-main"><div className="wizard-block"><h2>Choose the source</h2><p>Select one or more ready lessons.</p><div className="check-list">{demoSources.map((s) => <label key={s.id}><input type="checkbox" checked={selected.includes(s.id)} onChange={() => setSelected((v) => v.includes(s.id) ? v.filter((id) => id !== s.id) : [...v, s.id])}/><span><strong>{s.title}</strong><small>{s.pages} slides/pages</small></span></label>)}</div></div><div className="wizard-block"><h2>Choose the format</h2><div className="format-picker">{formats.map((f) => <button key={f.id} onClick={() => setFormat(f.id)} className={format === f.id ? "active" : ""}><f.icon/><strong>{f.label}</strong><small>{f.description}</small></button>)}</div></div>{["quiz", "practice_test"].includes(format) && <div className="wizard-block"><h2>Build the question mix</h2><div className="type-picker">{[["multiple_choice","Multiple choice"],["true_false","True / False"],["fill_blank","Fill in the blank"],["enumeration","Enumeration"]].map(([id,label]) => <label key={id}><input type="checkbox" checked={types.includes(id)} onChange={() => setTypes((v) => v.includes(id) ? v.filter((x) => x !== id) : [...v, id])}/>{label}</label>)}</div><div className="generator-fields"><div className="field"><label htmlFor="count">Number of questions</label><input className="input" type="number" id="count" min={3} max={50} value={count} onChange={(e) => setCount(Number(e.target.value))}/></div><div className="field"><label htmlFor="difficulty">Difficulty</label><select className="select" id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}><option value="mixed">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div></div></div>}</section><aside className="paper-panel generation-summary"><span className="badge badge-coral">AI-generated draft</span><h2 className="display">Your next stack</h2><dl><div><dt>Format</dt><dd>{formats.find((f) => f.id === format)?.label}</dd></div><div><dt>Sources</dt><dd>{selected.length} selected</dd></div>{["quiz", "practice_test"].includes(format) && <><div><dt>Length</dt><dd>{count} questions</dd></div><div><dt>Difficulty</dt><dd>{difficulty}</dd></div></>}</dl><p>You can review and edit every item before publishing it to the group.</p>{error && <div className="auth-error" role="alert">{error}</div>}<button disabled={loading || !selected.length || (["quiz","practice_test"].includes(format) && !types.length)} onClick={generate} className="button button-primary">{loading ? <><LoaderCircle className="spin"/>Building your draft…</> : <><Sparkles size={17}/>Generate draft</>}</button></aside></div>;
}
