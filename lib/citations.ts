const stopWords = new Set(["what", "which", "where", "when", "does", "from", "this", "that", "with", "into", "about", "your", "their", "have", "will", "would", "could", "should", "answer"]);

export function relevantExcerpt(content: string | undefined, prompt: string, answer = "") {
  if (!content) return undefined;
  const terms = `${prompt} ${answer}`.toLowerCase().match(/[a-z0-9]{3,}/g)?.filter((term) => !stopWords.has(term)) || [];
  const passages = content.split(/(?<=[.!?])\s+|\n{2,}/).map((part) => part.trim()).filter(Boolean);
  if (passages.length <= 2) return content.slice(0, 900);
  const ranked = passages.map((text, index) => ({ text, index, score: terms.reduce((score, term) => score + (text.toLowerCase().includes(term) ? 1 : 0), 0) })).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score === 0) return passages.slice(0, 2).join(" ").slice(0, 900);
  return passages.slice(Math.max(0, best.index - 1), Math.min(passages.length, best.index + 2)).join(" ").slice(0, 900);
}
