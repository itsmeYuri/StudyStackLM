import { QuizPlayer } from "@/components/quiz-player";
import { QuizResults } from "@/components/quiz-results";
import { createClient } from "@/lib/supabase/server";
import { generatedMaterial } from "@/lib/study-schema";
import { relevantExcerpt } from "@/lib/citations";
import { getLeaderboard } from "@/lib/leaderboard";
import { notFound } from "next/navigation";

const typeOrder = { multiple_choice: 0, true_false: 1, fill_blank: 2, enumeration: 3 } as const;

export default async function Attempt({ params }: { params: Promise<{ materialId: string }> }) {
  const { materialId } = await params; const supabase = await createClient(); const { data: { user } } = await supabase!.auth.getUser();
  const { data } = await supabase!.from("materials").select("title,group_id,content,status").eq("id", materialId).eq("status", "published").single(); if (!data || !user) notFound();
  const { data: existing } = await supabase!.from("attempts").select("id,score,max_score,answers").eq("material_id", materialId).eq("user_id", user.id).eq("status", "submitted").maybeSingle();
  if (existing) { const answers = (existing.answers || {}) as Record<string, string>; return <QuizResults attemptId={existing.id} groupId={data.group_id} score={Number(existing.score || 0)} maxScore={Number(existing.max_score || 0)} initialAnonymous={answers.__leaderboardAnonymous === "true"} initialLeaderboard={await getLeaderboard(materialId, user.id)}/>; }
  const material = generatedMaterial.parse(data.content); const chunkIds = [...new Set(material.items.map((item) => item.citation.chunkId))]; const { data: chunks } = chunkIds.length ? await supabase!.from("source_chunks").select("id,content").in("id", chunkIds) : { data: [] }; const chunkContent = Object.fromEntries((chunks || []).map((chunk) => [chunk.id, chunk.content]));
  const questions = material.items.map((item, index) => ({ id: `${materialId}-${index}`, type: item.type, prompt: item.prompt, options: item.options, answer: item.answer, explanation: item.explanation, citation: item.citation.label, sourceExcerpt: relevantExcerpt(chunkContent[item.citation.chunkId], item.prompt, item.answer), acceptedAnswers: item.acceptedAnswers })).sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  return <QuizPlayer materialId={materialId} title={data.title} groupId={data.group_id} initialQuestions={questions}/>;
}
