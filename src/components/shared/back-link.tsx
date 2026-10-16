import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex h-9 items-center gap-2 rounded-full border-[1.5px] border-foreground/15 bg-surface pr-4 pl-3 text-sm font-medium transition-colors hover:border-foreground/35 hover:bg-cream-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {children}
    </Link>
  );
}
