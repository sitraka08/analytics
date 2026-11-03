"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useDashboardNavigate } from "../hooks/use-dashboard-params";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { buildDashboardHref } from "../utils/search-params";

type DashboardLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "scroll" | "prefetch"
> & {
  basePath: string;
  period: Period;
  filters: Filters;
};

/**
 * Link to a period and filters combination. It keeps a real href (middle click, copy link), but a plain click
 * only updates the URL in place when the page reads its data through queries.
 */
export function DashboardLink({
  basePath,
  period,
  filters,
  onClick,
  ...props
}: DashboardLinkProps) {
  const { inPlace, go } = useDashboardNavigate(basePath);

  return (
    <Link
      {...props}
      href={buildDashboardHref(basePath, period, filters)}
      scroll={false}
      // Dozens of these links sit on a page and the in-place ones never load a route: no prefetch.
      prefetch={false}
      onClick={(event) => {
        onClick?.(event);
        if (
          !inPlace ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        go(period, filters);
      }}
    />
  );
}
