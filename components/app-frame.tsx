"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import type { GroupSummary } from "@/lib/types";

export function AppFrame({ children, user, groups, isAdmin = false, themeMode="system", accentTheme="rose" }: { children: React.ReactNode; user?: { email?: string; name?: string }; groups: GroupSummary[]; isAdmin?: boolean; themeMode?:string; accentTheme?:string }) {
  const pathname = usePathname();
  useEffect(()=>{const root=document.documentElement;const media=matchMedia("(prefers-color-scheme: dark)");const apply=()=>{root.dataset.theme=themeMode==="system"?(media.matches?"dark":"light"):themeMode;root.dataset.accent=accentTheme;};apply();media.addEventListener("change",apply);return()=>media.removeEventListener("change",apply);},[themeMode,accentTheme]);
  const focusedStudy = /\/app\/materials\/[^/]+\/(attempt|study)$/.test(pathname);
  return focusedStudy ? <>{children}</> : <AppShell user={user} groups={groups} isAdmin={isAdmin}>{children}</AppShell>;
}
