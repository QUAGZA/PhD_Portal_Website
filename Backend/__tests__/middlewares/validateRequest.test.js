/**
 * Validation Middleware Tests
 */

const Joi = require("joi");
const { validateBody, validateQuery, validateParams, validate } = require("../../middlewares/validateRequest");

describe("Validation Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      query: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("validateBody", () => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    it("should pass validation with valid data", () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password123",
      };

      validateBody(schema)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation with missing required fields", () => {
      mockReq.body = {
        email: "test@example.com",
      };

      validateBody(schema)(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Validation failed",
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: "password",
            }),
          ]),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation with invalid email", () => {
      mockReq.body = {
        email: "invalid-email",
        password: "password123",
      };

      validateBody(schema)(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: "email",
            }),
          ]),
        })
      );
    });

    it("should strip unknown fields", () => {
      mockReq.body = {
        email: "test@example.com",
        password: "password123",
        unknownField: "should be removed",
      };

      validateBody(schema)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.body).not.toHaveProperty("unknownField");
    });

    it("should collect all validation errors", () => {
      mockReq.body = {
        email: "invalid-email",
        password: "123", // too short
      };

      validateBody(schema)(mockReq, mockRes, mockNext);

      const response = mockRes.json.mock.calls[0][0];
      expect(response.errors).toHaveLength(2);
    });
  });

  describe("validateQuery", () => {
    const schema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    });

    it("should pass validation with valid query params", () => {
      mockReq.query = {
        page: "2",
        limit: "20",
      };

      validateQuery(schema)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.query.page).toBe(2);
      expect(mockReq.query.limit).toBe(20);
    });

    it("should apply default values", () => {
      mockReq.query = {};

      validateQuery(schema)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.query.page).toBe(1);
      expect(mockReq.query.limit).toBe(10);
    });

    it("should fail validation with invalid query params", () => {
      mockReq.query = {
        page: "-1",
        limit: "200",
      };

      validateQuery(schema)(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.any(Array),
        })
      );
    });
  });

  describe("validateParams", () => {
    const schema = Joi.object({
      id: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
    });

    it("should pass validation with valid params", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };

      validateParams(schema)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should fail validation with invalid ObjectId", () => {
      mockReq.params = {
        id: "invalid-id",
      };

      validateParams(schema)(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: expect.arrayContaining([
            expect.objectContaining({
              field: "id",
            }),
          ]),
        })
      );
    });
  });

  describe("validate (combined)", () => {
    const schemas = {
      body: Joi.object({
        name: Joi.string().required(),
      }),
      query: Joi.object({
        page: Joi.number().default(1),
      }),
      params: Joi.object({
        id: Joi.string().required(),
      }),
    };

    it("should validate body, query, and params together", () => {
      mockReq.body = { name: "Test" };
      mockReq.query = { page: "2" };
      mockReq.params = { id: "123" };

      validate(schemas)(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should collect errors from all sources", () => {
      mockReq.body = {}; // missing name
      mockReq.query = { page: "invalid" };
      mockReq.params = {}; // missing id

      validate(schemas)(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      const response = mockRes.json.mock.calls[0][0];
      expect(response.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
