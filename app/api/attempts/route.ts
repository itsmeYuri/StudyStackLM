import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getLeaderboard } from "@/lib/leaderboard";

const submitSchema = z.object({ materialId: z.string().uuid(), answers: z.record(z.string(), z.string()), score: z.number().nonnegative(), maxScore: z.number().positive() });
const privacySchema = z.object({ attemptId: z.string().uuid(), anonymous: z.boolean() });

export async function POST(request: Request) {
  try {
    const input = submitSchema.parse(await request.json()); const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { data: existing } = await supabase.from("attempts").select("id").eq("material_id", input.materialId).eq("user_id", user.id).eq("status", "submitted").maybeSingle();
    if (existing) return NextResponse.json({ error: "You have already completed this quiz. Each student gets one attempt." }, { status: 409 });
    const { data: attempt, error } = await supabase.from("attempts").insert({ material_id: input.materialId, user_id: user.id, status: "submitted", answers: { ...input.answers, __leaderboardAnonymous: "false" }, score: input.score, max_score: input.maxScore, submitted_at: new Date().toISOString() }).select("id").single();
    if (error) throw error;
    return NextResponse.json({ ok: true, attemptId: attempt.id, leaderboard: await getLeaderboard(input.materialId, user.id) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save attempt" }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try {
    const input = privacySchema.parse(await request.json()); const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Supabase unavailable" }, { status: 503 });
    const { data: { user } } = await supabase.auth.getUser(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { data: attempt } = await supabase.from("attempts").select("id,material_id,answers").eq("id", input.attemptId).eq("user_id", user.id).single();
    if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    const answers = (attempt.answers || {}) as Record<string, string>;
    const { error } = await supabase.from("attempts").update({ answers: { ...answers, __leaderboardAnonymous: String(input.anonymous) } }).eq("id", input.attemptId).eq("user_id", user.id); if (error) throw error;
    return NextResponse.json({ ok: true, leaderboard: await getLeaderboard(attempt.material_id, user.id) });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update leaderboard privacy" }, { status: 400 }); }
}
