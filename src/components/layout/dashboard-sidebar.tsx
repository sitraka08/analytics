import { LayoutDashboard, Plus } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { BRAND } from "@/lib/brand";
import { ROUTES } from "@/lib/routes";
import { TONE_BG, type Tone, toneClass } from "@/lib/tones";
import { cn } from "@/lib/utils";
import { SidebarLink } from "./sidebar-link";
import { UserMenu } from "./user-menu";

type DashboardSidebarProps = {
  user: { name: string; email: string };
  sites: { id: string; name: string; domain: string }[];
  /** Sign-out control, provided by the page composition so this component stays feature-agnostic. */
  signOut: React.ReactNode;
};

const TONES = Object.keys(TONE_BG) as Tone[];

/** Letter badge so sites tell apart at a glance, even with the sidebar collapsed to icons. */
function SiteBadge({ name, index }: { name: string; index: number }) {
  return (
    <span
      aria-hidden
      className={cn("grid size-5 shrink-0 place-items-center rounded-md font-heading text-[11px] leading-none font-bold", toneClass(TONES[index % TONES.length]))}
    >
      {name.trim()[0]?.toUpperCase() ?? "?"}
    </span>
  );
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
              {sites.map((site, index) => (
                <SidebarMenuItem key={site.id}>
                  <SidebarLink href={ROUTES.site(site.id)} label={site.name} icon={<SiteBadge name={site.name} index={index} />} />
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
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu user={user} signOut={signOut} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
