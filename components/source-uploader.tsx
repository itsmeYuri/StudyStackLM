"use client";

import { useState } from "react";
import { CheckCircle2, FileUp, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SourceUploader({ groupId }: { groupId: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { setStatus("error"); setMessage("Choose a file smaller than 25 MB."); return; }
    setStatus("uploading"); setMessage("Uploading and preparing the lesson…");
    try {
      if (groupId === "demo-biology" || !process.env.NEXT_PUBLIC_SUPABASE_URL) { await new Promise((r) => setTimeout(r, 900)); setStatus("done"); setMessage(`${file.name} is ready in demo mode.`); return; }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in before uploading.");
      const id = crypto.randomUUID();
      const path = `groups/${groupId}/sources/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: storageError } = await supabase.storage.from("source-files").upload(path, file);
      if (storageError) throw storageError;
      const { error } = await supabase.from("sources").insert({ id, group_id: groupId, uploader_id: user.id, title: file.name, storage_path: path, mime_type: file.type || "application/octet-stream", size_bytes: file.size, status: "queued" });
      if (error) throw error;
      await fetch(`/api/sources/${id}/process`, { method: "POST" });
      setStatus("done"); setMessage("Upload complete. Processing has started.");
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Upload failed. Try again."); }
  }
  return <div className={`upload-zone ${status}`}><input id="source-file" type="file" accept=".pdf,.pptx,.docx,.txt,.md" onChange={(e) => upload(e.target.files?.[0])}/><label htmlFor="source-file">{status === "uploading" ? <LoaderCircle className="spin"/> : status === "done" ? <CheckCircle2/> : <FileUp/>}<strong>{status === "idle" ? "Drop a lesson here or choose a file" : message}</strong><span>{status === "idle" ? "PPTX, PDF, DOCX, TXT, or Markdown · up to 25 MB" : status === "error" ? "Choose another file" : "You can keep working while it processes."}</span></label></div>;
}
