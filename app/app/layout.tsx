import "./app.css";
import { AppFrame } from "@/components/app-frame";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { GroupSummary } from "@/lib/types";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  const [{data:memberships},{data:profile}]=await Promise.all([supabase.from("group_members").select("role,joined_at,groups(id,name,subject,description,created_at)").eq("user_id", data.user.id).order("joined_at", { ascending: true }),supabase.from("profiles").select("display_name,is_admin,theme_mode,accent_theme").eq("id",data.user.id).maybeSingle()]);
  const groups = (memberships || []).flatMap((row) => row.groups ? [{...(row.groups as unknown as GroupSummary),role:row.role}] : []);
  const admins=(process.env.ADMIN_EMAILS||"").split(",").map(value=>value.trim().toLowerCase()).filter(Boolean);
  return <AppFrame groups={groups} user={{ email: data.user.email, name: profile?.display_name||data.user.user_metadata?.display_name }} isAdmin={profile?.is_admin===true||admins.includes((data.user.email||"").toLowerCase())} themeMode={profile?.theme_mode} accentTheme={profile?.accent_theme}>{children}</AppFrame>;
}
