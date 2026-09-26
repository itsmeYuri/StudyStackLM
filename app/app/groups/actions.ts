"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const groupSchema = z.object({ name: z.string().min(3).max(80), subject: z.string().min(2).max(80), description: z.string().max(300).optional() });

export async function createGroup(formData: FormData) {
  const values = groupSchema.safeParse({ name: formData.get("name"), subject: formData.get("subject"), description: formData.get("description") || undefined });
  if (!values.success) redirect("/app/groups/new?error=Please check the group details");
  const supabase = await createClient();
  if (!supabase) redirect("/app/groups/new?error=Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await supabase.rpc("create_group_with_owner", values.data);
  if (error) redirect(`/app/groups/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/app");
  redirect(`/app/groups/${data}`);
}

export async function joinGroup(formData: FormData) {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (code.length < 6) redirect("/app/groups/new?error=Enter a valid join code");
  const supabase = await createClient();
  if (!supabase) redirect("/app/groups/new?error=Supabase is not configured");
  const { data, error } = await supabase.rpc("join_group_by_code", { invite_code: code });
  if (error) redirect(`/app/groups/new?error=${encodeURIComponent(error.message)}`);
  redirect(`/app/groups/${data}`);
}
