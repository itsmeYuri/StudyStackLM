import Link from "next/link";
import { BookOpen, FileUp, Sparkles, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { GroupSummary, MaterialSummary } from "@/lib/types";
import { isGroupOwner } from "@/lib/group-access";

export default async function GroupPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params; const supabase = await createClient(); const {data:{user}}=await supabase!.auth.getUser(); const owner=!!user&&await isGroupOwner(supabase!,groupId,user.id);
  const [{ data: group }, { count: sourceCount }, { count: memberCount }, { data: materialRows, count: materialCount }] = await Promise.all([
    supabase!.from("groups").select("id,name,subject,description,created_at").eq("id", groupId).single(),
    supabase!.from("sources").select("id", { count: "exact", head: true }).eq("group_id", groupId).eq("status", "ready"),
    supabase!.from("group_members").select("user_id", { count: "exact", head: true }).eq("group_id", groupId),
    supabase!.from("materials").select("id,group_id,title,description,type,status,content,updated_at", { count: "exact" }).eq("group_id", groupId).order("updated_at", { ascending: false }).limit(3),
  ]);
  if (!group) notFound(); const typedGroup = group as GroupSummary; const materials = (materialRows || []) as MaterialSummary[];
  return <><div className="page-heading"><div><span className="badge badge-pink">{typedGroup.subject}</span><h1 className="display">{typedGroup.name}</h1><p>{typedGroup.description || "A private shared study space."}</p></div>{owner&&<Link className="button button-primary" href={`/app/groups/${groupId}/generate`}><Sparkles size={17}/>Create from a lesson</Link>}</div><div className="group-summary"><div><strong>{sourceCount || 0}</strong><span>ready sources</span></div><div><strong>{materialCount || 0}</strong><span>study materials</span></div><div><strong>{memberCount || 0}</strong><span>members</span></div></div><div className="group-work-grid"><section><div className="section-title"><h2>Latest materials</h2><Link href={`/app/groups/${groupId}/library`}>Open library</Link></div>{materials.length ? <div className="material-strip">{materials.map((m, index) => <Link key={m.id} className={`material-paper paper-${index}`} href={`/app/materials/${m.id}/${["quiz","practice_test"].includes(m.type) ? "attempt" : "study"}`}><span className="badge badge-neutral">{m.type.replaceAll("_", " ")}</span><h3>{m.title}</h3><p>{m.status}</p></Link>)}</div> : <div className="paper-panel empty"><BookOpen/><h2>No materials yet</h2><p>Upload a lesson, then create the first study material.</p></div>}</section><aside className="paper-panel quick-panel"><h2 className="display">What would you like to do?</h2><Link href={`/app/groups/${groupId}/sources`}><FileUp/>{owner?"Manage lessons":"View lessons"}</Link>{owner&&<Link href={`/app/groups/${groupId}/generate`}><Sparkles/>Generate material</Link>}<Link href={`/app/groups/${groupId}/library`}><BookOpen/>Open the library</Link><Link href={`/app/groups/${groupId}/members`}><Users/>Manage members</Link></aside></div></>;
}
