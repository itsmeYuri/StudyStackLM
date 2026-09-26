import "./app.css";
import { AppFrame } from "@/components/app-frame";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = supabase ? await supabase.auth.getUser() : { data: { user: null } };
  return <AppFrame user={data.user ? { email: data.user.email, name: data.user.user_metadata?.display_name } : undefined}>{children}</AppFrame>;
}
