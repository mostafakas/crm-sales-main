/**
 * API Service for AlMaster HR System
 * Re-exports the new ApiClient and adds mock implementations for development.
 */

import type { ApiResponse } from "./api/api-client";

export type { ApiResponse };
export { apiClient } from "./api/api-client";

// ─── Domain Data Shapes ───────────────────────────────────────────────────────

export interface EmployeeData {
  fullName: string;
  email: string;
  department?: string;
  jobTitle?: string;
  [key: string]: unknown;
}

export interface TaskData {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  [key: string]: unknown;
}

// ─── Mock Implementations (swap for real endpoints when backend is ready) ─────

export async function submitEmployee(
  data: EmployeeData
): Promise<ApiResponse<void>> {
  console.log("Mock API: Submitting employee data...", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { data: undefined, error: null, status: 200 };
}

export async function submitTask(data: TaskData): Promise<ApiResponse<void>> {
  console.log("Mock API: Submitting new task...", data);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { data: undefined, error: null, status: 200 };
}

export async function generateReport(
  params: Record<string, unknown>
): Promise<ApiResponse<void>> {
  console.log("Mock API: Generating report with params...", params);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { data: undefined, error: null, status: 200 };
}
