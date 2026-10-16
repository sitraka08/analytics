import { Globe, LayoutDashboard, Plus } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BRAND } from "@/lib/brand";
import { ROUTES } from "@/lib/routes";
import { SidebarLink } from "./sidebar-link";

type DashboardSidebarProps = {
  user: { name: string; email: string };
  sites: { id: string; name: string; domain: string }[];
  /** Sign-out control, provided by the page composition so this component stays feature-agnostic. */
  signOut: React.ReactNode;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DashboardSidebar({ user, sites, signOut }: DashboardSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="px-3 pt-4">
        <Link href={ROUTES.home} className="flex items-center gap-2 text-base font-bold tracking-tight">
          <BrandMark className="size-8 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">{BRAND.name}</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarLink href={ROUTES.dashboard} label="Vue d'ensemble" icon={<LayoutDashboard aria-hidden />} exact />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Mes sites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sites.map((site) => (
                <SidebarMenuItem key={site.id}>
                  <SidebarLink href={ROUTES.site(site.id)} label={site.name} icon={<Globe aria-hidden />} />
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarLink href={ROUTES.newSite} label="Ajouter un site" icon={<Plus aria-hidden />} exact />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex items-center gap-3 px-2 py-1 group-data-[collapsible=icon]:hidden">
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-cream-deep text-sm font-bold">
            {initials(user.name)}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-muted-foreground">{user.email}</span>
          </span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>{signOut}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
