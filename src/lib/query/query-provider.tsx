"use client";

import {
  QueryClientProvider,
  isServer,
  type QueryClient,
} from "@tanstack/react-query";
import { makeQueryClient } from "./make-query-client";

// A new client per server render; one for the whole tab in the browser, so the cache survives navigation.
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) return makeQueryClient();
  return (browserQueryClient ??= makeQueryClient());
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
