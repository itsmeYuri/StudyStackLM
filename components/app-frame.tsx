"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "@/components/app-shell";

export function AppFrame({ children, user }: { children: React.ReactNode; user?: { email?: string; name?: string } }) {
  const pathname = usePathname();
  const focusedStudy = /\/app\/materials\/[^/]+\/(attempt|study)$/.test(pathname);
  return focusedStudy ? <>{children}</> : <AppShell user={user}>{children}</AppShell>;
}
