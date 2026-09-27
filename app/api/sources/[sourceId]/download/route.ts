import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));
  const { data: source, error } = await supabase.from("sources").select("storage_path,title").eq("id", sourceId).single();
  if (error || !source) return NextResponse.json({ error: "Lesson not found or you do not have access" }, { status: 404 });
  const { data: signed, error: signedError } = await supabase.storage.from("source-files").createSignedUrl(source.storage_path, 60, { download: source.title });
  if (signedError || !signed) return NextResponse.json({ error: signedError?.message || "Could not open lesson" }, { status: 500 });
  return NextResponse.redirect(signed.signedUrl);
}
