import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import { ErrorClassifier } from "../errors/error-classifier";
import { defaultApiConfig } from "./api-config";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  fieldErrors?: Record<string, string | string[]>;
  status: number;
}

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: defaultApiConfig.baseUrl,
    timeout: defaultApiConfig.timeout,
    headers: { "Content-Type": "application/json" },
  });

  // Retry on network errors and 5xx with exponential backoff
  axiosRetry(instance, {
    retries: defaultApiConfig.retryAttempts,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) =>
      axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
  });

  // Request interceptor — attach auth token
  instance.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor — normalize to ApiResponse shape
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

async function request<T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<T>(config);
    return { data: response.data, error: null, status: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;
      const data = error.response?.data;
      const message = data?.message;
      const fieldErrors = data?.errors;
      
      const apiError = status
        ? ErrorClassifier.fromHttpStatus(status, message)
        : ErrorClassifier.fromUnknown(error);
        
      return { 
        data: null, 
        error: apiError.message, 
        fieldErrors,
        status: apiError.status 
      };
    }
    const apiError = ErrorClassifier.fromUnknown(error);
    return { data: null, error: apiError.message, status: apiError.status };
  }
}

export const apiClient = {
  get: <T>(path: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url: path }),

  post: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "POST", url: path, data: body }),

  put: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PUT", url: path, data: body }),

  patch: <T>(path: string, body: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PATCH", url: path, data: body }),

  delete: <T>(path: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url: path }),
};
