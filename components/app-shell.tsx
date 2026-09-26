"use client";

import Link from "next/link";
import { BookOpen, Gauge, Plus, Settings, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { initials } from "@/lib/utils";

export function AppShell({ children, user }: { children: React.ReactNode; user?: { email?: string; name?: string } }) {
  const pathname = usePathname();
  const name = user?.name || "Student";
  const groupMatch = pathname.match(/^\/app\/groups\/([^/]+)/);
  const groupId = groupMatch?.[1];
  const active = (href: string) => href === "/app" ? pathname === href : pathname.startsWith(href);
  return <div className="app-shell"><aside className="group-rail"><Logo compact/><div className="rail-groups"><Link className="rail-group active" href="/app" aria-label="All groups"><Users size={18}/></Link><Link className="rail-group" href="/app/groups/new" aria-label="Add group"><Plus size={18}/></Link></div><Link href="/app/settings" className="rail-bottom" aria-label="Settings"><Settings size={20}/></Link></aside><aside className="context-nav"><Logo/><h2>Your workspace</h2><nav><Link className={active("/app") ? "active" : ""} href="/app"><Gauge size={18}/>Overview</Link><Link className={pathname.startsWith("/app/groups") ? "active" : ""} href={groupId ? `/app/groups/${groupId}` : "/app/groups/new"}><Users size={18}/>Study groups</Link>{groupId && <><Link className={active(`/app/groups/${groupId}/sources`) ? "active" : ""} href={`/app/groups/${groupId}/sources`}>Sources</Link><Link className={active(`/app/groups/${groupId}/library`) ? "active" : ""} href={`/app/groups/${groupId}/library`}>Study library</Link><Link className={active(`/app/groups/${groupId}/generate`) ? "active" : ""} href={`/app/groups/${groupId}/generate`}>Generate</Link></>}</nav><div className="user-chip"><span className="avatar">{initials(name)}</span><div><strong>{name}</strong><span>{user?.email}</span></div></div></aside><main className="app-main"><div className="app-topbar"><div><span className="badge badge-pink">StudyStackLM</span></div><Link className="button button-quiet" href="/app/settings" aria-label="Open settings"><Settings size={19}/></Link></div>{children}</main><nav className="mobile-nav" aria-label="Mobile navigation"><Link className={active("/app") ? "active" : ""} href="/app"><Gauge size={19}/>Home</Link><Link className={pathname.startsWith("/app/groups") ? "active" : ""} href={groupId ? `/app/groups/${groupId}` : "/app/groups/new"}><Users size={19}/>Groups</Link><Link href="/app/groups/new"><Plus size={19}/>New</Link><Link className={active("/app/settings") ? "active" : ""} href="/app/settings"><Settings size={19}/>Settings</Link></nav></div>;
}
