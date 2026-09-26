"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured");
  const { error } = await supabase.auth.signInWithPassword({ email: String(formData.get("email")), password: String(formData.get("password")) });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/app");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect("/signup?error=Supabase is not configured");
  const email = String(formData.get("email"));
  const { error } = await supabase.auth.signUp({ email, password: String(formData.get("password")), options: { data: { display_name: String(formData.get("name")) } } });
  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/app");
}

export async function signOut() { const supabase = await createClient(); await supabase?.auth.signOut(); redirect("/"); }
