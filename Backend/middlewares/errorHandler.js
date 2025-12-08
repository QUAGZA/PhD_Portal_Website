/**
 * Centralized Error Handler Middleware
 * Provides consistent error responses across the API
 */

// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = "Bad Request", errorCode = "BAD_REQUEST") {
    super(message, 400, errorCode);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", errorCode = "UNAUTHORIZED") {
    super(message, 401, errorCode);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden", errorCode = "FORBIDDEN") {
    super(message, 403, errorCode);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found", errorCode = "NOT_FOUND") {
    super(message, 404, errorCode);
  }
}

class ConflictError extends AppError {
  constructor(message = "Conflict", errorCode = "CONFLICT") {
    super(message, 409, errorCode);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation Error", errors = [], errorCode = "VALIDATION_ERROR") {
    super(message, 400, errorCode);
    this.errors = errors;
  }
}

class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", errorCode = "INTERNAL_ERROR") {
    super(message, 500, errorCode);
  }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle MongoDB CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new BadRequestError(message, "INVALID_ID");
};

/**
 * Handle MongoDB duplicate key error
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ConflictError(message, "DUPLICATE_FIELD");
};

/**
 * Handle MongoDB validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = "Invalid input data";
  return new ValidationError(message, errors);
};

/**
 * Handle Joi validation error
 */
const handleJoiValidationError = (err) => {
  const errors = err.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message.replace(/"/g, ""),
  }));
  const message = "Validation failed";
  return new ValidationError(message, errors);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new UnauthorizedError("Invalid token. Please log in again.", "INVALID_TOKEN");
};

const handleJWTExpiredError = () => {
  return new UnauthorizedError("Your token has expired. Please log in again.", "TOKEN_EXPIRED");
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errorCode: err.errorCode,
    errors: err.errors,
    stack: err.stack,
    error: err,
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥:", err);

    res.status(500).json({
      success: false,
      status: "error",
      message: "Something went wrong!",
      errorCode: "INTERNAL_ERROR",
    });
  }
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    // Handle specific error types
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError" && err.errors) error = handleValidationErrorDB(err);
    if (err.isJoi) error = handleJoiValidationError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 Not Found routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  // Error classes
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  // Middleware
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
