import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { OfficeParser } from "officeparser";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";

function splitText(text: string, maxLength = 2200) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = []; let current = "";
  for (const paragraph of paragraphs) { if ((current + paragraph).length > maxLength && current) { chunks.push(current); current = paragraph; } else current += `${current ? "\n\n" : ""}${paragraph}`; }
  if (current) chunks.push(current);
  return chunks;
}

export async function POST(_: Request, { params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params;
  try {
    const sessionClient = await createClient();
    const { data: { user } } = sessionClient ? await sessionClient.auth.getUser() : { data: { user: null } };
    if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return NextResponse.json({ error: "Server processing is not configured" }, { status: 503 });
    const admin = createAdminClient(url, serviceKey);
    const { data: source, error: sourceError } = await admin.from("sources").select("*").eq("id", sourceId).eq("uploader_id", user.id).single();
    if (sourceError || !source) return NextResponse.json({ error: "Source not found" }, { status: 404 });
    await admin.from("sources").update({ status: "processing", error_code: null }).eq("id", sourceId);
    const { data: blob, error: downloadError } = await admin.storage.from("source-files").download(source.storage_path);
    if (downloadError) throw downloadError;
    const extension = source.title.split(".").pop()?.toLowerCase();
    const ast = await OfficeParser.parseOffice(new Uint8Array(await blob.arrayBuffer()), extension === "md" || extension === "txt" ? { fileType: extension } : undefined);
    const generated = await ast.to("text");
    const chunks = splitText(generated.value);
    if (!chunks.length) throw new Error("No readable text was found in this file.");
    let embeddings: number[][] = chunks.map(() => []);
    if (process.env.GEMINI_API_KEY) {
      const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await gemini.models.embedContent({ model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001", contents: chunks, config: { outputDimensionality: 1536 } });
      embeddings = (result.embeddings || []).map((item) => {
        const values = item.values || [];
        const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) || 1;
        return values.map((value) => value / magnitude);
      });
    }
    const rows = chunks.map((content, index) => ({ source_id: sourceId, page_number: index + 1, chunk_index: 0, content, token_count: Math.ceil(content.length / 4), embedding: embeddings[index].length ? embeddings[index] : null, metadata: { extractedFrom: extension } }));
    const { error: chunkError } = await admin.from("source_chunks").insert(rows); if (chunkError) throw chunkError;
    await admin.from("sources").update({ status: "ready", page_count: chunks.length }).eq("id", sourceId);
    return NextResponse.json({ ok: true, chunks: chunks.length });
  } catch (error) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) await createAdminClient(url, serviceKey).from("sources").update({ status: "failed", error_code: error instanceof Error ? error.message.slice(0, 180) : "Processing failed" }).eq("id", sourceId);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Processing failed" }, { status: 500 });
  }
}
