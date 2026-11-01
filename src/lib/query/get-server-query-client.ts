import "server-only";
import { cache } from "react";
import { makeQueryClient } from "./make-query-client";

/** One client per request, never shared between users. */
export const getServerQueryClient = cache(makeQueryClient);
