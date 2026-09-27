"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const allowedExtensions = new Set(["pdf", "pptx", "docx", "txt", "md"]);

export function SourceUploader({ groupId }: { groupId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file?: File) {
    if (!file || status === "uploading") return;
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExtensions.has(extension)) { setStatus("error"); setMessage("That file type is not supported. Choose PDF, PPTX, DOCX, TXT, or Markdown."); return; }
    if (file.size === 0) { setStatus("error"); setMessage("That file is empty. Choose a lesson with readable content."); return; }
    if (file.size > 25 * 1024 * 1024) { setStatus("error"); setMessage("Choose a file smaller than 25 MB."); return; }
    setStatus("uploading"); setMessage(`Preparing ${file.name}…`);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sign in before uploading.");
      const id = crypto.randomUUID();
      const path = `groups/${groupId}/sources/${id}/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error: storageError } = await supabase.storage.from("source-files").upload(path, file);
      if (storageError) throw storageError;
      const { error } = await supabase.from("sources").insert({ id, group_id: groupId, uploader_id: user.id, title: file.name, storage_path: path, mime_type: file.type || "application/octet-stream", size_bytes: file.size, status: "queued" });
      if (error) { await supabase.storage.from("source-files").remove([path]); throw error; }
      const processing = await fetch(`/api/sources/${id}/process`, { method: "POST" });
      const result = await processing.json();
      if (!processing.ok) throw new Error(result.error || "The file uploaded, but processing failed.");
      setStatus("done"); setMessage(`Lesson ready · ${result.chunks} sections extracted.`); router.refresh();
    } catch (reason) { setStatus("error"); setMessage(reason instanceof Error ? reason.message : "Upload failed. Try again."); router.refresh(); }
    finally { if (inputRef.current) inputRef.current.value = ""; }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); void upload(event.dataTransfer.files?.[0]); }
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) { if ((event.key === "Enter" || event.key === " ") && status !== "uploading") { event.preventDefault(); inputRef.current?.click(); } }

  return <div className={`upload-zone ${status} ${dragging ? "dragging" : ""}`} role="button" tabIndex={0} aria-label="Upload lesson file" aria-busy={status === "uploading"} onKeyDown={handleKeyDown} onDragEnter={(event) => { event.preventDefault(); if (status !== "uploading") setDragging(true); }} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }} onDrop={handleDrop}>
    <input ref={inputRef} id="source-file" type="file" accept=".pdf,.pptx,.docx,.txt,.md" disabled={status === "uploading"} onChange={(event) => void upload(event.target.files?.[0])}/>
    <label htmlFor="source-file" onClick={(event) => { if (status === "uploading") event.preventDefault(); }}>{status === "uploading" ? <LoaderCircle className="spin"/> : status === "done" ? <CheckCircle2/> : <FileUp/>}<strong>{dragging ? "Drop the lesson to upload" : status === "idle" ? "Drop a lesson here or choose a file" : message}</strong><span>{status === "idle" || dragging ? "PPTX, PDF, DOCX, TXT, or Markdown · up to 25 MB" : status === "error" ? "Drop another file or choose one from your computer" : "Ready for your group to use."}</span></label>
  </div>;
}
