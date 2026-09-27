import Link from "next/link";
import { ExternalLink, FileCheck2, FileWarning, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SourceUploader } from "@/components/source-uploader";
import { formatDate } from "@/lib/utils";
import type { SourceSummary } from "@/lib/types";

export default async function Sources({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const supabase = await createClient();
  const { data } = await supabase!.from("sources").select("id,title,status,page_count,created_at,error_code").eq("group_id", groupId).neq("status", "archived").order("created_at", { ascending: false });
  const sources = (data || []) as SourceSummary[];
  return <><div className="page-heading"><div><h1 className="display">Source library</h1><p>Open uploaded lessons at any time, or turn a ready lesson into a reviewer and other study materials.</p></div></div><SourceUploader groupId={groupId}/><div className="section-title"><h2>Lessons</h2><span className="badge badge-neutral">{sources.length} files</span></div>{sources.length === 0 ? <div className="paper-panel empty"><FileCheck2/><h2>No sources uploaded</h2><p>Choose a supported lesson above to begin.</p></div> : <div className="source-table">{sources.map((source) => <div className="source-row" key={source.id}><span className="source-icon">{source.status === "failed" ? <FileWarning/> : <FileCheck2/>}</span><div className="source-details"><strong>{source.title}</strong><small>{source.page_count ? `${source.page_count} extracted sections · ` : ""}Uploaded {formatDate(source.created_at)}{source.error_code ? ` · ${source.error_code}` : ""}</small></div><span className={`badge ${source.status === "ready" ? "badge-green" : source.status === "failed" ? "badge-coral" : "badge-pink"}`}>{source.status}</span><div className="source-actions"><Link className="button button-quiet" href={`/api/sources/${source.id}/download`} target="_blank" aria-label={`Open ${source.title}`}><ExternalLink size={16}/>Open lesson</Link>{source.status === "ready" && <Link className="button button-secondary" href={`/app/groups/${groupId}/generate?source=${source.id}&format=reviewer`}><Sparkles size={16}/>Use as reviewer</Link>}</div></div>)}</div>}</>;
}
