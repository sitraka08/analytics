import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data prefetched on the server stays fresh long enough to avoid an immediate refetch on hydration.
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Pending queries are streamed to the client, so a slow widget does not block the page.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}
