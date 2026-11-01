import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";
import { cache } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data prefetched on the server stays fresh long enough to avoid an immediate refetch on hydration.
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Pending queries are streamed to the client, so a slow widget does not block the page.
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

// One client per request on the server (never shared between users); one for the whole tab in the browser.
const getServerQueryClient = cache(makeQueryClient);
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) return getServerQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}
