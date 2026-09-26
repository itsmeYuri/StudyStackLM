"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";

export function CitationDrawer({ label, excerpt }: { label: string; excerpt?: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); if (event.key === "Tab") { event.preventDefault(); closeRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); trigger?.focus(); };
  }, [open]);
  return <><button ref={triggerRef} className="citation-chip" onClick={() => setOpen(true)} aria-haspopup="dialog"><BookOpen size={14}/>{label}</button>{open && <div className="citation-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><aside className="citation-drawer" role="dialog" aria-modal="true" aria-labelledby="citation-title"><header><span className="badge badge-blue">Source reference</span><button ref={closeRef} onClick={() => setOpen(false)} aria-label="Close source"><X/></button></header><div className="source-preview ruled"><span className="sheet-tab">SOURCE</span><small>{label}</small><h2 id="citation-title" className="display">Lesson excerpt</h2><p>{excerpt || "The cited source text will appear here when this material is connected to its uploaded lesson."}</p><mark>This is the lesson text supporting the generated item. Use it to verify the answer without losing your place.</mark></div></aside></div>}</>;
}
