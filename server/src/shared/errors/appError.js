class BaseError extends Error {
  constructor(message, code, status = null, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends BaseError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND_ERROR", 404);
  }
}

class ConflictError extends BaseError {
  constructor(message = "Conflict") {
    super(message, "CONFLICT_ERROR", 409);
  }
}

class ValidationError extends BaseError {
  constructor(message = "Validation error", details = null) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN_ERROR", 403);
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED_ERROR", 401);
  }
}

export {
  BaseError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
