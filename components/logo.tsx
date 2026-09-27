import Link from "next/link";

export function Logo({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return <Link href={href} className="logo" aria-label="StudyStackLM home"><span className="logo-mark"><i/><i/><i/></span>{!compact&&<span>StudyStack<span>LM</span></span>}</Link>;
}
