/**
 * Utility functions for handling user roles
 */

/**
 * Ensures that a user's roles are in array format
 * @param {Object} user - User object from database
 * @returns {Object} - User object with roles field as array
 */
const normalizeUserRoles = (user) => {
  if (!user) return null;

  // Handle Mongoose document conversion to plain object if needed
  const userData = user.toObject ? user.toObject() : { ...user };

  // Check if roles exist and are an array
  if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
    return userData;
  }

  // If the user has old role field but no roles array, convert it
  if (userData.role && typeof userData.role === 'string') {
    userData.roles = [userData.role];
    return userData;
  }

  // If there's no roles array at all, set default
  if (!userData.roles || !Array.isArray(userData.roles) || userData.roles.length === 0) {
    userData.roles = ["Student"];
  }

  return userData;
};

/**
 * Check if user has at least one of the required roles
 * @param {Object} user - User object
 * @param {Array|String} requiredRoles - Array of role strings or single role string
 * @returns {Boolean} - True if user has one of the required roles
 */
const hasRole = (user, requiredRoles) => {
  if (!user) return false;

  const normalizedUser = normalizeUserRoles(user);

  // Convert single role string to array
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  console.log("hasRole check:", {
    normalizedUserRoles: normalizedUser.roles,
    requiredRoles: roles,
    comparison: normalizedUser.roles.map(userRole => ({
      userRole,
      matchesAny: roles.some(reqRole => reqRole === userRole)
    }))
  });

  const result = normalizedUser.roles.some((role) => roles.includes(role));
  console.log("hasRole result:", result);

  return result;
};

/**
 * Add a role to user's roles if they don't already have it
 * @param {Object} user - User object
 * @param {String} roleToAdd - Role to add
 * @returns {Array} - Updated roles array
 */
const addRole = (user, roleToAdd) => {
  if (!user) return null;

  const normalizedUser = normalizeUserRoles(user);

  if (!normalizedUser.roles.includes(roleToAdd)) {
    return [...normalizedUser.roles, roleToAdd];
  }

  return normalizedUser.roles;
};

/**
 * Remove a role from user's roles array
 * @param {Object} user - User object
 * @param {String} roleToRemove - Role to remove
 * @returns {Array} - Updated roles array (with at least one role guaranteed)
 */
const removeRole = (user, roleToRemove) => {
  if (!user) return null;

  const normalizedUser = normalizeUserRoles(user);

  // If removing would leave no roles, return unchanged
  if (
    normalizedUser.roles.length === 1 &&
    normalizedUser.roles[0] === roleToRemove
  ) {
    return normalizedUser.roles;
  }

  return normalizedUser.roles.filter((role) => role !== roleToRemove);
};

/**
 * Get primary role for a user (first in the array)
 * @param {Object} user - User object
 * @returns {String|null} - Primary role or null if no roles
 */
const getPrimaryRole = (user) => {
  if (!user) return null;

  const normalizedUser = normalizeUserRoles(user);
  return normalizedUser.roles[0] || null;
};

module.exports = {
  normalizeUserRoles,
  hasRole,
  addRole,
  removeRole,
  getPrimaryRole,
};
