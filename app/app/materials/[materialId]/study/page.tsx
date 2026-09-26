import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { CitationDrawer } from "@/components/citation-drawer";
import { createClient } from "@/lib/supabase/server";
import { generatedMaterial } from "@/lib/study-schema";
export default async function StudyMaterial({ params }: { params: Promise<{ materialId: string }> }) { const { materialId } = await params; const supabase = await createClient(); const { data } = await supabase!.from("materials").select("title,description,type,group_id,content,status").eq("id", materialId).eq("status", "published").single(); if (!data) notFound(); const material = generatedMaterial.parse(data.content); return <div className="study-reader"><Link href={`/app/groups/${data.group_id}/library`} className="button button-quiet"><ArrowLeft/>Back to library</Link><article className="paper-panel ruled"><span className="badge badge-pink">{data.type.replaceAll("_", " ")}</span><h1 className="display">{data.title}</h1><p className="lead">{data.description}</p>{material.items.map((item, index) => <section key={index}><h2>{item.prompt}</h2><p>{item.answer}</p>{item.explanation && <div className="study-callout"><strong>Explanation</strong><p>{item.explanation}</p></div>}<CitationDrawer label={item.citation.label} excerpt={item.explanation}/></section>)}</article></div>; }
