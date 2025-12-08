/**
 * Validation Schemas Tests
 */

const {
  authSchemas,
  userSchemas,
  guideAssignmentSchemas,
  assignmentSchemas,
  paginationSchema,
} = require("../../middlewares/validation");

describe("Validation Schemas", () => {
  describe("Auth Schemas", () => {
    describe("login schema", () => {
      it("should validate correct login data", () => {
        const data = {
          email: "test@example.com",
          password: "password123",
        };

        const { error } = authSchemas.login.validate(data);

        expect(error).toBeUndefined();
      });

      it("should reject invalid email", () => {
        const data = {
          email: "invalid-email",
          password: "password123",
        };

        const { error } = authSchemas.login.validate(data);

        expect(error).toBeDefined();
        expect(error.details[0].path).toContain("email");
      });

      it("should reject short password", () => {
        const data = {
          email: "test@example.com",
          password: "12345",
        };

        const { error } = authSchemas.login.validate(data);

        expect(error).toBeDefined();
        expect(error.details[0].path).toContain("password");
      });

      it("should reject missing required fields", () => {
        const data = {};

        const { error } = authSchemas.login.validate(data, { abortEarly: false });

        expect(error).toBeDefined();
        expect(error.details.length).toBe(2);
      });
    });

    describe("register schema", () => {
      it("should validate correct registration data", () => {
        const data = {
          email: "new@example.com",
          password: "securepass",
          roles: ["Student"],
        };

        const { error } = authSchemas.register.validate(data);

        expect(error).toBeUndefined();
      });

      it("should apply default role if not provided", () => {
        const data = {
          email: "new@example.com",
          password: "securepass",
        };

        const { error, value } = authSchemas.register.validate(data);

        expect(error).toBeUndefined();
        expect(value.roles).toEqual(["Student"]);
      });

      it("should reject invalid role", () => {
        const data = {
          email: "new@example.com",
          password: "securepass",
          roles: ["InvalidRole"],
        };

        const { error } = authSchemas.register.validate(data);

        expect(error).toBeDefined();
      });
    });
  });

  describe("User Schemas", () => {
    describe("addRole schema", () => {
      it("should validate correct role", () => {
        const data = { role: "Guide" };

        const { error } = userSchemas.addRole.validate(data);

        expect(error).toBeUndefined();
      });

      it("should reject invalid role", () => {
        const data = { role: "SuperAdmin" };

        const { error } = userSchemas.addRole.validate(data);

        expect(error).toBeDefined();
      });

      it("should reject missing role", () => {
        const data = {};

        const { error } = userSchemas.addRole.validate(data);

        expect(error).toBeDefined();
      });
    });
  });

  describe("Guide Assignment Schemas", () => {
    describe("assign schema", () => {
      it("should validate correct assignment data", () => {
        const data = {
          studentId: "507f1f77bcf86cd799439011",
          guideId: "507f1f77bcf86cd799439012",
        };

        const { error } = guideAssignmentSchemas.assign.validate(data);

        expect(error).toBeUndefined();
      });

      it("should reject invalid ObjectId", () => {
        const data = {
          studentId: "invalid-id",
          guideId: "507f1f77bcf86cd799439012",
        };

        const { error } = guideAssignmentSchemas.assign.validate(data);

        expect(error).toBeDefined();
      });

      it("should reject missing required fields", () => {
        const data = {
          studentId: "507f1f77bcf86cd799439011",
        };

        const { error } = guideAssignmentSchemas.assign.validate(data);

        expect(error).toBeDefined();
      });
    });

    describe("changeGuide schema", () => {
      it("should validate correct data", () => {
        const data = {
          newGuideId: "507f1f77bcf86cd799439013",
        };

        const { error } = guideAssignmentSchemas.changeGuide.validate(data);

        expect(error).toBeUndefined();
      });
    });
  });

  describe("Assignment Schemas", () => {
    describe("create schema", () => {
      it("should validate correct assignment data", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);

        const data = {
          title: "Research Paper Review",
          description: "Review the attached research paper",
          deadline: futureDate.toISOString(),
        };

        const { error } = assignmentSchemas.create.validate(data);

        expect(error).toBeUndefined();
      });

      it("should reject past deadline", () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);

        const data = {
          title: "Late Assignment",
          deadline: pastDate.toISOString(),
        };

        const { error } = assignmentSchemas.create.validate(data);

        expect(error).toBeDefined();
      });

      it("should reject short title", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);

        const data = {
          title: "AB",
          deadline: futureDate.toISOString(),
        };

        const { error } = assignmentSchemas.create.validate(data);

        expect(error).toBeDefined();
        expect(error.details[0].path).toContain("title");
      });

      it("should apply default status", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);

        const data = {
          title: "New Assignment",
          deadline: futureDate.toISOString(),
        };

        const { error, value } = assignmentSchemas.create.validate(data);

        expect(error).toBeUndefined();
        expect(value.status).toBe("active");
      });
    });
  });

  describe("Pagination Schema", () => {
    it("should apply default values", () => {
      const data = {};

      const { error, value } = paginationSchema.validate(data);

      expect(error).toBeUndefined();
      expect(value.page).toBe(1);
      expect(value.limit).toBe(10);
    });

    it("should validate correct pagination params", () => {
      const data = {
        page: 5,
        limit: 25,
        search: "test",
      };

      const { error, value } = paginationSchema.validate(data);

      expect(error).toBeUndefined();
      expect(value.page).toBe(5);
      expect(value.limit).toBe(25);
    });

    it("should reject page less than 1", () => {
      const data = { page: 0 };

      const { error } = paginationSchema.validate(data);

      expect(error).toBeDefined();
    });

    it("should reject limit greater than 100", () => {
      const data = { limit: 150 };

      const { error } = paginationSchema.validate(data);

      expect(error).toBeDefined();
    });
  });
});
