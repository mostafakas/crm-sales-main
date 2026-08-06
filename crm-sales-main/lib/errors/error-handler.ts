import { ApiErrorCode } from "./api-errors";
import { ErrorClassifier } from "./error-classifier";

const USER_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: "Unable to connect. Check your internet connection and try again.",
  TIMEOUT_ERROR: "The request took too long. Please try again.",
  AUTH_ERROR: "Your session has expired. Please log in again.",
  FORBIDDEN_ERROR: "You don't have permission to perform this action.",
  NOT_FOUND_ERROR: "The requested resource could not be found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
};

export interface ErrorHandlerResult {
  message: string;
  code: ApiErrorCode;
  canRetry: boolean;
  requiresAuth: boolean;
}

export function handleError(error: unknown): ErrorHandlerResult {
  const apiError = ErrorClassifier.fromUnknown(error);

  return {
    message: USER_MESSAGES[apiError.code] ?? apiError.message,
    code: apiError.code,
    canRetry: ErrorClassifier.isRetryable(apiError),
    requiresAuth: ErrorClassifier.isAuthError(apiError),
  };
}

export function getErrorMessage(error: unknown): string {
  return handleError(error).message;
}
