import { cookies } from "next/headers";
import { Suspense } from "react";
import { DashboardBreadcrumb } from "@/components/layout/dashboard-breadcrumb";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import {
  HeaderSlot,
  HeaderSlotProvider,
} from "@/components/layout/header-actions";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/lib/query/query-provider";
import { SignOutMenuButton, requireSession } from "@/features/auth";
import { listSites } from "@/features/sites";

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user } = await requireSession();
  const [sites, cookieStore] = await Promise.all([
    listSites(user.id),
    cookies(),
  ]);
  // The sidebar remembers its state in its own UI cookie (not tracking): collapsed only when explicitly saved so.
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <QueryProvider>
      <TooltipProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <HeaderSlotProvider>
            <DashboardSidebar
              user={user}
              sites={sites}
              signOut={<SignOutMenuButton />}
            />
            <SidebarInset className="md:peer-data-[variant=inset]:rounded-3xl">
              <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur md:rounded-t-3xl md:px-6">
                <SidebarTrigger className="-ml-1.5" />
                <Separator orientation="vertical" className="h-5" />
                <DashboardBreadcrumb sites={sites} />
                <HeaderSlot className="ml-auto flex shrink-0 items-center gap-2" />
              </header>
              {children}
            </SidebarInset>
          </HeaderSlotProvider>
        </SidebarProvider>
      </TooltipProvider>
    </QueryProvider>
  );
}

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-sidebar" aria-busy />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
