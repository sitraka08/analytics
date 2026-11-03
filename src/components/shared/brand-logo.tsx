import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { ROUTES } from "@/lib/routes";

export function BrandMark({ className = "size-8" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid place-items-center rounded-lg bg-foreground text-background ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M5 19v-6M12 19V6M19 19v-9" />
      </svg>
    </span>
  );
}

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href={ROUTES.home}
      className={`flex items-center gap-2 text-base font-bold tracking-tight ${className}`}
    >
      <BrandMark />
      {BRAND.name}
    </Link>
  );
}
