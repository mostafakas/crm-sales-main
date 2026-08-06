import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import type { 
  BaseQueryFn, 
  FetchArgs, 
  FetchBaseQueryError 
} from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

/**
 * Custom base query wrapper to handle global errors.
 */
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

/**
 * Enhanced base query with automatic retry logic.
 */
export const baseQueryWithRetry = retry(baseQueryWithErrorHandling, {
  maxRetries: 2,
});
