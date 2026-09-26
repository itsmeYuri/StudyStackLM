import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Plus, Sparkles, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { GroupSummary, MaterialSummary } from "@/lib/types";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase!.auth.getUser();
  const { data: memberships } = await supabase!.from("group_members").select("role, groups(id,name,subject,description,created_at)").eq("user_id", user!.id);
  const groups = (memberships || []).flatMap((row) => row.groups ? [row.groups as unknown as GroupSummary] : []);
  const groupIds = groups.map((group) => group.id);
  const { data: recent } = groupIds.length ? await supabase!.from("materials").select("id,group_id,title,description,type,status,content,updated_at").in("group_id", groupIds).eq("status", "published").order("updated_at", { ascending: false }).limit(6) : { data: [] };
  const materials = (recent || []) as MaterialSummary[];
  const firstGroup = groups[0];
  return <><div className="page-heading"><div><h1 className="display">Your study space</h1><p>Open a group, continue a published material, or turn a ready lesson into something new.</p></div>{firstGroup ? <Link className="button button-primary" href={`/app/groups/${firstGroup.id}/generate`}><Sparkles size={18}/>Generate material</Link> : <Link className="button button-primary" href="/app/groups/new"><Plus size={18}/>Create your first group</Link>}</div>{groups.length === 0 ? <section className="paper-panel empty"><Users size={34}/><h2 className="display">Your first group starts here</h2><p>Create a private class space or join one using an invitation code.</p><Link className="button button-primary" href="/app/groups/new">Create or join a group</Link></section> : <><div className="section-title"><h2>Your groups</h2><Link href="/app/groups/new">Create or join a group</Link></div><div className="group-list">{groups.map((group) => <Link href={`/app/groups/${group.id}`} className="paper-panel group-row" key={group.id}><span className="badge badge-pink">{group.subject}</span><h3>{group.name}</h3><p>{group.description || "A private shared study space."}</p><div className="group-meta"><span><Users size={14}/> Open group</span><span><BookOpen size={14}/> View materials</span></div></Link>)}</div></>}<div className="section-title"><h2>Recent materials</h2>{firstGroup && <Link href={`/app/groups/${firstGroup.id}/library`}>View library</Link>}</div>{materials.length === 0 ? <div className="paper-panel empty"><BookOpen size={30}/><h2>No published materials yet</h2><p>Upload a source in one of your groups, then generate and publish a study material.</p></div> : <div className="activity-list">{materials.map((item) => <Link key={item.id} href={`/app/materials/${item.id}/${["quiz","practice_test"].includes(item.type) ? "attempt" : "study"}`} className="activity-row"><span className="avatar">{["quiz","practice_test"].includes(item.type) ? <FileText size={17}/> : <BookOpen size={17}/>}</span><p><strong>{item.title}</strong><br/><small>{item.type.replaceAll("_", " ")}</small></p><small>{formatDate(item.updated_at)} <ArrowRight size={13}/></small></Link>)}</div>}</>;
}
