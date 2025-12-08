/**
 * Validation Middleware
 * Provides request validation using Joi schemas
 */
const { ValidationError } = require("./errorHandler");

/**
 * Create a validation middleware for request body
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Collect all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Replace body with validated/sanitized values
    req.body = value;
    next();
  };
};

/**
 * Create a validation middleware for request query parameters
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.query = value;
    next();
  };
};

/**
 * Create a validation middleware for request params
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/"/g, ""),
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.params = value;
    next();
  };
};

/**
 * Combined validation for body, query, and params
 * @param {Object} schemas - Object with body, query, and/or params schemas
 * @returns {Function} Express middleware
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    // Validate body
    if (schemas.body) {
      const { error, value } = schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `body.${detail.path.join(".")}`,
            message: detail.message.replace(/"/g, ""),
          });
        });
      } else {
        req.body = value;
      }
    }

    // Validate query
    if (schemas.query) {
      const { error, value } = schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `query.${detail.path.join(".")}`,
            message: detail.message.replace(/"/g, ""),
          });
        });
      } else {
        req.query = value;
      }
    }

    // Validate params
    if (schemas.params) {
      const { error, value } = schemas.params.validate(req.params, {
        abortEarly: false,
      });

      if (error) {
        error.details.forEach((detail) => {
          errors.push({
            field: `params.${detail.path.join(".")}`,
            message: detail.message.replace(/"/g, ""),
          });
        });
      } else {
        req.params = value;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  validate,
};
