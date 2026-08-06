import {
  ApiError,
  AuthError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  TimeoutError,
  ValidationError,
} from "./api-errors";

export class ErrorClassifier {
  static fromHttpStatus(status: number, message?: string): ApiError {
    switch (status) {
      case 401:
        return new AuthError(message);
      case 403:
        return new ForbiddenError(message);
      case 404:
        return new NotFoundError(message);
      case 400:
      case 422:
        return new ValidationError(message ?? "Validation failed");
      case 408:
        return new TimeoutError(message);
      default:
        if (status >= 500) return new ServerError(message);
        return new ApiError(
          message ?? "An unexpected error occurred",
          "UNKNOWN_ERROR",
          status
        );
    }
  }

  static fromUnknown(error: unknown): ApiError {
    if (error instanceof ApiError) return error;

    if (error instanceof DOMException && error.name === "AbortError") {
      return new TimeoutError("Request was cancelled");
    }

    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      return new NetworkError();
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return new ApiError(message, "UNKNOWN_ERROR", 0);
  }

  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError;
  }

  static isNetworkError(error: unknown): error is NetworkError {
    return error instanceof NetworkError;
  }

  static isAuthError(error: unknown): error is AuthError {
    return error instanceof AuthError;
  }

  static isValidationError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }

  static isRetryable(error: unknown): boolean {
    if (error instanceof AuthError) return false;
    if (error instanceof ForbiddenError) return false;
    if (error instanceof ValidationError) return false;
    if (error instanceof NotFoundError) return false;
    return true;
  }
}
