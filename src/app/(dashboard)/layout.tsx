import { cookies } from "next/headers";
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SignOutMenuButton, requireSession } from "@/features/auth";
import { listSites } from "@/features/sites";

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = await requireSession();
  const [sites, cookieStore] = await Promise.all([listSites(user.id), cookies()]);
  // The sidebar remembers its state in its own UI cookie (not tracking): collapsed only when explicitly saved so.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} sites={sites} signOut={<SignOutMenuButton />} />
        <SidebarInset className="md:peer-data-[variant=inset]:rounded-3xl">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-2 rounded-t-3xl bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-5" />
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-sidebar" aria-busy />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
