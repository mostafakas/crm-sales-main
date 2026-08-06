export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export const defaultApiConfig: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  timeout: 30_000,
  retryAttempts: 3,
  retryDelay: 1_000,
};
