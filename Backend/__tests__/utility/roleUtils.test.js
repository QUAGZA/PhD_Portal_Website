/**
 * Role Utilities Tests
 */

const { normalizeUserRoles, hasRole, addRole, removeRole } = require("../../utility/roleUtils");

describe("Role Utilities", () => {
  describe("normalizeUserRoles", () => {
    it("should return user with roles array if already present", () => {
      const user = {
        email: "test@example.com",
        roles: ["Student", "Guide"],
      };

      const normalized = normalizeUserRoles(user);

      expect(normalized.roles).toEqual(["Student", "Guide"]);
    });

    it("should convert single role string to array", () => {
      const user = {
        email: "test@example.com",
        role: "Student",
      };

      const normalized = normalizeUserRoles(user);

      expect(normalized.roles).toEqual(["Student"]);
    });

    it("should default to Student role if no role defined", () => {
      const user = {
        email: "test@example.com",
      };

      const normalized = normalizeUserRoles(user);

      expect(normalized.roles).toEqual(["Student"]);
    });

    it("should handle mongoose document by calling toObject", () => {
      const user = {
        email: "test@example.com",
        roles: ["Admin"],
        toObject: function () {
          return { email: this.email, roles: this.roles };
        },
      };

      const normalized = normalizeUserRoles(user);

      expect(normalized.roles).toEqual(["Admin"]);
    });
  });

  describe("hasRole", () => {
    it("should return true if user has exact role", () => {
      const user = { roles: ["Student", "Guide"] };

      expect(hasRole(user, ["Guide"])).toBe(true);
    });

    it("should return true if user has any of the required roles", () => {
      const user = { roles: ["Student"] };

      expect(hasRole(user, ["Admin", "Student"])).toBe(true);
    });

    it("should return false if user lacks all required roles", () => {
      const user = { roles: ["Student"] };

      expect(hasRole(user, ["Admin", "FacultyCoordinator"])).toBe(false);
    });

    it("should handle legacy single role field", () => {
      const user = { role: "Admin" };

      expect(hasRole(user, ["Admin"])).toBe(true);
    });

    it("should return true for user without roles due to default Student role", () => {
      // normalizeUserRoles defaults to Student when no roles defined
      const user = {};

      expect(hasRole(user, ["Student"])).toBe(true);
    });

    it("should return false for null user", () => {
      expect(hasRole(null, ["Student"])).toBe(false);
    });

    it("should handle string argument for allowedRoles", () => {
      const user = { roles: ["Admin"] };

      expect(hasRole(user, "Admin")).toBe(true);
    });
  });

  describe("addRole", () => {
    it("should add new role to existing roles", () => {
      const user = { roles: ["Student"] };

      const updatedRoles = addRole(user, "Guide");

      expect(updatedRoles).toContain("Student");
      expect(updatedRoles).toContain("Guide");
    });

    it("should not duplicate existing role", () => {
      const user = { roles: ["Student", "Guide"] };

      const updatedRoles = addRole(user, "Student");

      expect(updatedRoles.filter((r) => r === "Student")).toHaveLength(1);
    });

    it("should handle user with legacy single role", () => {
      const user = { role: "Student" };

      const updatedRoles = addRole(user, "Guide");

      expect(updatedRoles).toContain("Student");
      expect(updatedRoles).toContain("Guide");
    });
  });

  describe("removeRole", () => {
    it("should remove role from user", () => {
      const user = { roles: ["Student", "Guide"] };

      const updatedRoles = removeRole(user, "Guide");

      expect(updatedRoles).toContain("Student");
      expect(updatedRoles).not.toContain("Guide");
    });

    it("should return same roles if role not present", () => {
      const user = { roles: ["Student"] };

      const updatedRoles = removeRole(user, "Admin");

      expect(updatedRoles).toEqual(["Student"]);
    });

    it("should keep at least one role when removing the only role", () => {
      // removeRole doesn't remove the last role to prevent user from having no roles
      const user = { role: "Student" };

      const updatedRoles = removeRole(user, "Student");

      // Role is NOT removed because it's the only role
      expect(updatedRoles).toEqual(["Student"]);
    });
  });
});
