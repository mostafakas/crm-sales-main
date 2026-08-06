import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRetry } from "./baseQuery";

/**
 * Base API for all services.
 * Uses advanced base query with error handling and retry logic.
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Employee", "Task", "Message", "User", "Department"],
  endpoints: () => ({}),
});
