import { createClient as createAdminClient } from "@supabase/supabase-js";

export type LeaderboardEntry = { rank: number; name: string; score: number; maxScore: number; percentage: number; isCurrentUser: boolean };

export async function getLeaderboard(materialId: string, currentUserId: string): Promise<LeaderboardEntry[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const admin = createAdminClient(url, key, { auth: { persistSession: false } });
  const { data } = await admin.from("attempts").select("user_id,score,max_score,submitted_at,answers,profiles(display_name)").eq("material_id", materialId).eq("status", "submitted").order("score", { ascending: false }).order("submitted_at", { ascending: true });
  return (data || []).map((row, index) => {
    const profile = row.profiles as unknown as { display_name?: string } | null;
    const answers = (row.answers || {}) as Record<string, string>;
    const score = Number(row.score || 0); const maxScore = Number(row.max_score || 0);
    return { rank: index + 1, name: answers.__leaderboardAnonymous === "true" ? "Anonymous Student" : profile?.display_name || "Student", score, maxScore, percentage: maxScore ? Math.round((score / maxScore) * 100) : 0, isCurrentUser: row.user_id === currentUserId };
  });
}
