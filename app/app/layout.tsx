import "./app.css";
import { AppFrame } from "@/components/app-frame";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect("/login?error=Supabase is not configured");
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");
  return <AppFrame user={data.user ? { email: data.user.email, name: data.user.user_metadata?.display_name } : undefined}>{children}</AppFrame>;
}
