"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useMemo } from "react";
import type { Filters } from "../schemas/filters";
import type { Period } from "../schemas/period";
import { parseDashboardQuery } from "../utils/dashboard-query";
import { buildDashboardHref } from "../utils/search-params";

/** Period and filters currently in the URL. Next keeps `useSearchParams` in sync with `history.pushState`. */
export function useDashboardParams(): { period: Period; filters: Filters } {
  const key = useSearchParams().toString();
  return useMemo(() => parseDashboardQuery(Object.fromEntries(new URLSearchParams(key))), [key]);
}

// True under <DashboardNavigationProvider>: the page reads its data through queries, so changing the URL
// in place is enough. Elsewhere (server-rendered lists) a real navigation is needed.
const InPlaceNavigationContext = createContext(false);

export function DashboardNavigationProvider({ children }: { children: React.ReactNode }) {
  return <InPlaceNavigationContext.Provider value>{children}</InPlaceNavigationContext.Provider>;
}

export function useDashboardNavigate(basePath: string) {
  const router = useRouter();
  const inPlace = useContext(InPlaceNavigationContext);

  const go = useCallback(
    (period: Period, filters: Filters) => {
      const href = buildDashboardHref(basePath, period, filters);
      if (inPlace) window.history.pushState(null, "", href);
      else router.push(href, { scroll: false });
    },
    [basePath, inPlace, router],
  );

  return { inPlace, go };
}
