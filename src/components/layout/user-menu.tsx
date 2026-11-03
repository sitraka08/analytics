"use client";

import { ChevronsUpDown, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ROUTES } from "@/lib/routes";

type UserMenuProps = {
  user: { name: string; email: string };
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

export function UserMenu({ user, signOut }: UserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<SidebarMenuButton size="lg" />}
        aria-label="Menu du compte"
      >
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full bg-cream-deep font-heading text-xs font-bold text-foreground"
        >
          {initials(user.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">
            {user.name}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </span>
        <ChevronsUpDown aria-hidden className="ml-auto text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-64 gap-1 rounded-2xl p-1.5"
      >
        <div className="px-2.5 pt-1.5 pb-2">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-2.5 py-0.5 text-xs font-medium">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-accent-green"
            />
            Plan gratuit
          </p>
        </div>
        <div className="-mx-1.5 h-px bg-border" />
        <Link
          href={ROUTES.settings}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-foreground [&_svg]:size-4"
        >
          <Settings aria-hidden />
          Paramètres du compte
        </Link>
        {signOut}
      </PopoverContent>
    </Popover>
  );
}
