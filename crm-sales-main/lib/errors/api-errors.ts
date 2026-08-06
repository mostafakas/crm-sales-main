export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT_ERROR"
  | "AUTH_ERROR"
  | "FORBIDDEN_ERROR"
  | "NOT_FOUND_ERROR"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(
    message: string,
    code: ApiErrorCode,
    status: number,
    details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Network connection failed") {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiError {
  constructor(message = "Request timed out") {
    super(message, "TIMEOUT_ERROR", 0);
    this.name = "TimeoutError";
  }
}

export class AuthError extends ApiError {
  constructor(message = "Authentication required") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You don't have permission to perform this action") {
    super(message, "FORBIDDEN_ERROR", 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "The requested resource was not found") {
    super(message, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 422, details);
    this.name = "ValidationError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "An internal server error occurred") {
    super(message, "SERVER_ERROR", 500);
    this.name = "ServerError";
  }
}
