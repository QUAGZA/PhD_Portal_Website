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

  const userCopy = { ...user };

  // Handle Mongoose document conversion to plain object if needed
  const userData = userCopy.toObject ? userCopy.toObject() : userCopy;

  // If the user has old role field but no roles array, convert it
  if (userData.role && (!userData.roles || !Array.isArray(userData.roles))) {
    userData.roles = [userData.role];
  }

  // If there's no roles array at all, set default
  if (!userData.roles) {
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

  return normalizedUser.roles.some((role) => roles.includes(role));
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
