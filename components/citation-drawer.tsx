"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";

export function CitationDrawer({ label, excerpt }: { label: string; excerpt?: string | null }) {
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
  return <><button type="button" ref={triggerRef} className="citation-chip" onClick={() => setOpen(true)} aria-haspopup="dialog"><BookOpen size={14}/>{label}</button>{open && <div className="citation-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><aside className="citation-drawer" role="dialog" aria-modal="true" aria-labelledby="citation-title"><header><span className="badge badge-blue">Original lesson</span><button type="button" ref={closeRef} onClick={() => setOpen(false)} aria-label="Close source"><X/></button></header><div className="source-preview ruled"><span className="sheet-tab">SOURCE</span><small>{label}</small><h2 id="citation-title" className="display">From your uploaded lesson</h2>{excerpt ? <p className="source-excerpt">{excerpt}</p> : <div className="source-unavailable"><strong>Source passage unavailable</strong><p>This older material no longer has a matching extracted passage. Generate it again from the source to restore its citation.</p></div>}</div></aside></div>}</>;
}
