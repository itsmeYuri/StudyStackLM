"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function saveSettings(formData: FormData) { const supabase = await createClient(); if (!supabase) redirect("/login"); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login"); const displayName = String(formData.get("display_name") || "").trim(); if (displayName.length < 2) redirect("/app/settings?error=Display name is too short"); const { error } = await supabase.from("profiles").update({ display_name: displayName, locale: String(formData.get("locale") || "en"), reduce_motion: formData.get("reduce_motion") === "on", large_study_text: formData.get("large_study_text") === "on", updated_at: new Date().toISOString() }).eq("id", user.id); if (error) redirect(`/app/settings?error=${encodeURIComponent(error.message)}`); revalidatePath("/app", "layout"); redirect("/app/settings?saved=1"); }
