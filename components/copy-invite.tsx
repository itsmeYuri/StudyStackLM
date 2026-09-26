"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CopyInvite({ code }: { code: string }) { const [copied, setCopied] = useState(false); async function copy() { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } return <button type="button" onClick={copy} className="button button-secondary">{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? "Copied" : "Copy code"}</button>; }
