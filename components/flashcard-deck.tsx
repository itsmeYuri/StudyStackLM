"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { GeneratedMaterial } from "@/lib/study-schema";
import { CitationDrawer } from "@/components/citation-drawer";

export function FlashcardDeck({ title, description, groupId, items, citationExcerpts }: { title: string; description: string; groupId: string; items: GeneratedMaterial["items"]; citationExcerpts: Record<string, string> }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = items[index];
  function move(nextIndex: number) { setIndex(nextIndex); setFlipped(false); }
  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setFlipped((value) => !value); }
    if (event.key === "ArrowLeft" && index > 0) move(index - 1);
    if (event.key === "ArrowRight" && index < items.length - 1) move(index + 1);
  }
  return <div className="flashcard-study"><header className="flashcard-header"><Link href={`/app/groups/${groupId}/library`} className="button button-quiet"><ArrowLeft/>Back to library</Link><div><span className="badge badge-pink">Flashcards</span><h1 className="display">{title}</h1><p>{description}</p></div><span className="flashcard-count">{index + 1} / {items.length}</span></header><div className="flashcard-progress" aria-hidden="true"><i style={{ width: `${((index + 1) / items.length) * 100}%` }}/></div><div className="flashcard-stage"><div className={`flashcard ${flipped ? "is-flipped" : ""}`} role="button" tabIndex={0} aria-pressed={flipped} aria-label={`${flipped ? "Answer" : "Question"} card ${index + 1} of ${items.length}. Press Enter or Space to flip.`} onClick={() => setFlipped((value) => !value)} onKeyDown={handleKey}><div className="flashcard-inner"><section className="flashcard-face flashcard-front"><span className="card-kicker">Question Â· {index + 1}</span><h2>{card.prompt}</h2><span className="flip-hint"><RotateCcw size={16}/>Click to reveal the answer</span></section><section className="flashcard-face flashcard-back"><span className="card-kicker">Answer</span><h2>{card.answer}</h2>{card.explanation && <div className="flashcard-explanation"><strong>Why this is right</strong><p>{card.explanation}</p></div>}<div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}><CitationDrawer label={card.citation.label} excerpt={citationExcerpts[card.citation.chunkId]}/></div><span className="flip-hint"><RotateCcw size={16}/>Click the card to see the question</span></section></div></div></div><footer className="flashcard-controls"><button type="button" className="button button-secondary" disabled={index === 0} onClick={() => move(index - 1)}><ArrowLeft/>Previous</button><button type="button" className="button button-primary" onClick={() => index === items.length - 1 ? move(0) : move(index + 1)}>{index === items.length - 1 ? "Start again" : "Next card"}<ArrowRight/></button></footer><p className="flashcard-shortcuts">Use the left and right arrow keys to move. Press Space to flip.</p></div>;
}
