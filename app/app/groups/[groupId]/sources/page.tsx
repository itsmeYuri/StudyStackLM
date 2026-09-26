import { FileCheck2, MoreHorizontal } from "lucide-react";
import { SourceUploader } from "@/components/source-uploader";
import { demoSources } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

export default async function Sources({ params }: { params: Promise<{ groupId: string }> }) { const { groupId } = await params; return <><div className="page-heading"><div><h1 className="display">Source library</h1><p>Add the lessons your group wants to turn into study materials. Original files remain private to group members.</p></div></div><SourceUploader groupId={groupId}/><div className="section-title"><h2>Ready lessons</h2><span className="badge badge-neutral">{demoSources.length} files</span></div><div className="source-table">{demoSources.map((s) => <div className="source-row" key={s.id}><span className="source-icon"><FileCheck2/></span><div><strong>{s.title}</strong><small>{s.pages} slides/pages · Uploaded {formatDate(s.created_at)}</small></div><span className="badge badge-green">Ready</span><button className="button button-quiet" aria-label={`More actions for ${s.title}`}><MoreHorizontal/></button></div>)}</div></> }
