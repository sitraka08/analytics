"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  /** Active only on this exact path instead of the whole subtree. */
  exact?: boolean;
};

export function SidebarLink({ href, label, icon, exact }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SidebarMenuButton
      render={<Link href={href} />}
      isActive={isActive}
      tooltip={label}
      className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
    >
      {icon}
      <span>{label}</span>
    </SidebarMenuButton>
  );
}
