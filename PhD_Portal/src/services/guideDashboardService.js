import api from './api';

/**
 * Guide Dashboard Service
 * Handles all API calls for guide dashboard features
 */

/**
 * Get assigned students with progress and attendance
 */
export const getAssignedStudents = async () => {
  try {
    const response = await api.get('/guide/dashboard/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned students:', error);
    throw error;
  }
};

/**
 * Get guide's assignments with submission statistics
 */
export const getGuideAssignments = async () => {
  try {
    const response = await api.get('/guide/dashboard/assignments');
    return response.data;
  } catch (error) {
    console.error('Error fetching guide assignments:', error);
    throw error;
  }
};

/**
 * Get guide's schedule events for a specific week
 * @param {string} weekStart - ISO date string for week start
 */
export const getGuideSchedule = async (weekStart = null) => {
  try {
    const params = weekStart ? { weekStart } : {};
    const response = await api.get('/guide/dashboard/schedule', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching guide schedule:', error);
    throw error;
  }
};

/**
 * Get dashboard summary statistics
 */
export const getDashboardSummary = async () => {
  try {
    const response = await api.get('/guide/dashboard/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

/**
 * Get guide profile information
 */
export const getGuideProfile = async () => {
  try {
    const response = await api.get('/guide/dashboard/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching guide profile:', error);
    throw error;
  }
};

/**
 * Get detailed student profile by ID
 * @param {string} studentId - Student's user ID
 */
export const getStudentProfile = async (studentId) => {
  try {
    const response = await api.get(`/guide/dashboard/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

export default {
  getAssignedStudents,
  getGuideAssignments,
  getGuideSchedule,
  getDashboardSummary,
  getGuideProfile,
  getStudentProfile,
};
