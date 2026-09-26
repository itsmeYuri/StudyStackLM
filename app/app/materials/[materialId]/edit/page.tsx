import { MaterialEditor } from "@/components/material-editor";
import { createClient } from "@/lib/supabase/server";
import { generatedMaterial } from "@/lib/study-schema";
import { notFound } from "next/navigation";
export default async function EditMaterial({ params }: { params: Promise<{ materialId: string }> }) { const { materialId } = await params; const supabase = await createClient(); const { data } = await supabase!.from("materials").select("type,content").eq("id", materialId).single(); if (!data) notFound(); const material = generatedMaterial.parse(data.content); return <><div className="page-heading"><div><h1 className="display">Review the draft</h1><p>AI created the structure. You decide what is accurate and ready for your group.</p></div></div><MaterialEditor materialId={materialId} initialMaterial={material} materialType={data.type}/></>; }
