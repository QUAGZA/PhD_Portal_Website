/**
 * Error Handler Middleware Tests
 */

const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  InternalServerError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
} = require("../../middlewares/errorHandler");

describe("Error Classes", () => {
  describe("AppError", () => {
    it("should create an error with message and status code", () => {
      const error = new AppError("Test error", 400, "TEST_ERROR");

      expect(error.message).toBe("Test error");
      expect(error.statusCode).toBe(400);
      expect(error.errorCode).toBe("TEST_ERROR");
      expect(error.status).toBe("fail");
      expect(error.isOperational).toBe(true);
    });

    it("should set status to 'error' for 5xx status codes", () => {
      const error = new AppError("Server error", 500);

      expect(error.status).toBe("error");
    });
  });

  describe("BadRequestError", () => {
    it("should create a 400 error with default message", () => {
      const error = new BadRequestError();

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Bad Request");
      expect(error.errorCode).toBe("BAD_REQUEST");
    });

    it("should create a 400 error with custom message", () => {
      const error = new BadRequestError("Invalid input", "INVALID_INPUT");

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Invalid input");
      expect(error.errorCode).toBe("INVALID_INPUT");
    });
  });

  describe("UnauthorizedError", () => {
    it("should create a 401 error", () => {
      const error = new UnauthorizedError("Please login");

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Please login");
    });
  });

  describe("ForbiddenError", () => {
    it("should create a 403 error", () => {
      const error = new ForbiddenError("Access denied");

      expect(error.statusCode).toBe(403);
      expect(error.message).toBe("Access denied");
    });
  });

  describe("NotFoundError", () => {
    it("should create a 404 error", () => {
      const error = new NotFoundError("User not found");

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("User not found");
    });
  });

  describe("ConflictError", () => {
    it("should create a 409 error", () => {
      const error = new ConflictError("User already exists");

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("User already exists");
    });
  });

  describe("ValidationError", () => {
    it("should create a 400 error with validation errors", () => {
      const errors = [
        { field: "email", message: "Email is required" },
        { field: "password", message: "Password is too short" },
      ];
      const error = new ValidationError("Validation failed", errors);

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Validation failed");
      expect(error.errors).toEqual(errors);
    });
  });

  describe("InternalServerError", () => {
    it("should create a 500 error", () => {
      const error = new InternalServerError();

      expect(error.statusCode).toBe(500);
      expect(error.message).toBe("Internal Server Error");
    });
  });
});

describe("asyncHandler", () => {
  it("should pass successful result through", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const handler = asyncHandler(mockFn);
    const req = {};
    const res = { json: jest.fn() };
    const next = jest.fn();

    await handler(req, res, next);

    expect(mockFn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("should catch errors and pass to next", async () => {
    const error = new Error("Test error");
    const mockFn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(mockFn);
    const req = {};
    const res = {};
    const next = jest.fn();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("notFoundHandler", () => {
  it("should create a 404 error for unmatched routes", () => {
    const req = { originalUrl: "/api/unknown" };
    const res = {};
    const next = jest.fn();

    notFoundHandler(req, res, next);

    expect(next).toHaveBeenCalled();
    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.message).toBe("Route /api/unknown not found");
  });
});

describe("errorHandler", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    process.env.NODE_ENV = "development";
  });

  it("should handle operational errors in development", () => {
    const error = new BadRequestError("Invalid input");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        status: "fail",
        message: "Invalid input",
        errorCode: "BAD_REQUEST",
      })
    );
  });

  it("should include stack trace in development", () => {
    const error = new AppError("Test error", 400);

    errorHandler(error, mockReq, mockRes, mockNext);

    const response = mockRes.json.mock.calls[0][0];
    expect(response.stack).toBeDefined();
  });

  it("should handle operational errors in production", () => {
    process.env.NODE_ENV = "production";
    const error = new NotFoundError("User not found");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    const response = mockRes.json.mock.calls[0][0];
    expect(response.stack).toBeUndefined();
  });

  it("should mask non-operational errors in production", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("Database connection failed");
    error.isOperational = false;

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Something went wrong!",
      })
    );

    consoleSpy.mockRestore();
  });

  it("should handle default error without statusCode", () => {
    const error = new Error("Unknown error");

    errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
