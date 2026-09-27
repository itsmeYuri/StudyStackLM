"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import type { GroupSummary } from "@/lib/types";

export function AppFrame({ children, user, groups, isAdmin = false }: { children: React.ReactNode; user?: { email?: string; name?: string }; groups: GroupSummary[]; isAdmin?: boolean }) {
  const pathname = usePathname();
  const focusedStudy = /\/app\/materials\/[^/]+\/(attempt|study)$/.test(pathname);
  return focusedStudy ? <>{children}</> : <AppShell user={user} groups={groups} isAdmin={isAdmin}>{children}</AppShell>;
}
