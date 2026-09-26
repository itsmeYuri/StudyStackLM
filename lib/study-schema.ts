import { z } from "zod";

export const questionType = z.enum(["multiple_choice", "true_false", "fill_blank", "enumeration"]);
export const generatedQuestion = z.object({
  type: questionType,
  prompt: z.string().min(5),
  options: z.array(z.string()).default([]),
  answer: z.string().min(1),
  acceptedAnswers: z.array(z.string()).default([]),
  explanation: z.string().min(5),
  citation: z.object({ chunkId: z.string(), label: z.string() }),
});
export const generatedMaterial = z.object({ title: z.string(), description: z.string(), items: z.array(generatedQuestion).min(1) });

export type GeneratedMaterial = z.infer<typeof generatedMaterial>;

export function normalizeAnswer(value: string) { return value.toLowerCase().trim().replace(/[-‐‑‒–—]/g, " ").replace(/[.,;:!?]/g, "").replace(/\s+/g, " "); }
export function gradeAnswer(type: z.infer<typeof questionType>, response: string, answer: string, accepted: string[] = []) {
  if (type === "enumeration") {
    const expected = answer.split(",").map(normalizeAnswer).filter(Boolean);
    const actual = response.split(/[,;\n]/).map(normalizeAnswer).filter(Boolean);
    const matched = new Set(actual.filter((item) => expected.includes(item))).size;
    return { correct: matched === expected.length, score: expected.length ? matched / expected.length : 0 };
  }
  const valid = [answer, ...accepted].map(normalizeAnswer);
  const correct = valid.includes(normalizeAnswer(response));
  return { correct, score: correct ? 1 : 0 };
}
