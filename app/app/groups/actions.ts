"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const groupSchema = z.object({ name: z.string().min(3).max(80), subject: z.string().min(2).max(80), description: z.string().max(300).optional() });

export async function createGroup(formData: FormData) {
  const values = groupSchema.safeParse({ name: formData.get("name"), subject: formData.get("subject"), description: formData.get("description") || undefined });
  if (!values.success) redirect("/app/groups/new?error=Please check the group details");
  const supabase = await createClient();
  if (!supabase) redirect("/app/groups/new?error=Supabase is not configured");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) redirect("/app/groups/new?error=Server group creation is not configured");
  const admin = createAdminClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const groupId = crypto.randomUUID();
  const { error: groupError } = await admin.from("groups").insert({ id: groupId, owner_id: user.id, ...values.data });
  if (groupError) redirect(`/app/groups/new?error=${encodeURIComponent(groupError.message)}`);
  const code = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  const [{ error: memberError }, { error: inviteError }] = await Promise.all([
    admin.from("group_members").insert({ group_id: groupId, user_id: user.id, role: "owner" }),
    admin.from("group_invites").insert({ group_id: groupId, code, created_by: user.id, expires_at: new Date(Date.now() + 30 * 86400000).toISOString() }),
  ]);
  if (memberError || inviteError) {
    await admin.from("groups").delete().eq("id", groupId);
    redirect(`/app/groups/new?error=${encodeURIComponent(memberError?.message || inviteError?.message || "Could not finish group setup")}`);
  }
  revalidatePath("/app", "layout");
  redirect(`/app/groups/${groupId}`);
}

export async function joinGroup(formData: FormData) {
  const code = String(formData.get("code") || "").trim().toUpperCase();
  if (code.length < 6) redirect("/app/groups/new?error=Enter a valid join code");
  const supabase = await createClient();
  if (!supabase) redirect("/app/groups/new?error=Supabase is not configured");
  const { data, error } = await supabase.rpc("join_group_by_code", { invite_code: code });
  if (error) redirect(`/app/groups/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/app", "layout");
  redirect(`/app/groups/${data}`);
}

export async function rotateInvite(formData: FormData) {
  const groupId = String(formData.get("group_id") || "");
  if (!z.string().uuid().safeParse(groupId).success) redirect("/app?error=Invalid group");
  const supabase = await createClient();
  if (!supabase) redirect("/login");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase.from("group_invites").update({ revoked_at: new Date().toISOString() }).eq("group_id", groupId).is("revoked_at", null);
  const code = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("group_invites").insert({ group_id: groupId, code, created_by: user.id, expires_at: expires });
  if (error) redirect(`/app/groups/${groupId}/members?error=${encodeURIComponent(error.message)}`);
  revalidatePath(`/app/groups/${groupId}/members`);
  redirect(`/app/groups/${groupId}/members?created=1`);
}
