import axios from "axios";

const API_BASE_URL = "http://localhost:9999";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/";
    } else if (error.response?.status === 403) {
      console.error("Access denied. User may not have required role.");
    }
    return Promise.reject(error);
  },
);

const adminService = {
  // Debug endpoint to check user authentication and roles
  debugUserAuth: async () => {
    const response = await api.get("/auth/debug");
    return response.data;
  },

  // User Management
  getAllUsers: async (
    page = 1,
    limit = 10,
    search = "",
    role = "",
    department = "",
    status = "",
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (department) params.append("department", department);
    if (status) params.append("status", status);

    const response = await api.get(`/admin/users?${params}`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  addRoleToUser: async (userId, role) => {
    const response = await api.post(`/users/${userId}/roles`, { role });
    return response.data;
  },

  removeRoleFromUser: async (userId, role) => {
    const response = await api.delete(`/users/${userId}/roles`, {
      data: { role },
    });
    return response.data;
  },

  updateUserPrimaryRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/primary-role`, { role });
    return response.data;
  },

  // Faculty Coordinator Management
  getFacultyCoordinators: async (
    page = 1,
    limit = 10,
    search = "",
    department = "",
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (department) params.append("department", department);

      console.log("Fetching faculty coordinators...");
      const response = await api.get(`/admin/faculty-coordinators?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching faculty coordinators:", error);
      // Return mock data as fallback
      if (error.response?.status === 403) {
        console.warn(
          "Using mock data for faculty coordinators due to 403 error",
        );
        return {
          success: true,
          facultyCoordinators: [],
          pagination: { total: 0, page: 1, pages: 0, limit: 10 },
        };
      }
      throw error;
    }
  },

  // Guide Assignment Management
  assignGuideToStudent: async (studentId, guideId) => {
    const response = await api.post("/guide-assignment/assign", {
      studentId,
      guideId,
    });
    return response.data;
  },

  unassignGuideFromStudent: async (studentId) => {
    const response = await api.delete(
      `/guide-assignment/unassign/${studentId}`,
    );
    return response.data;
  },

  changeGuideForStudent: async (studentId, newGuideId) => {
    const response = await api.put(`/guide-assignment/change/${studentId}`, {
      newGuideId,
    });
    return response.data;
  },

  getAllStudentsWithGuideStatus: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/guide-assignment/students?page=${page}&limit=${limit}`,
    );
    return response.data;
  },

  getGuideAssignmentStats: async () => {
    const response = await api.get("/guide-assignment/stats");
    return response.data;
  },

  getAllGuides: async () => {
    const response = await api.get("/guide-assignment/guides");
    return response.data;
  },

  getStudentsForGuide: async (guideId) => {
    const response = await api.get(
      `/guide-assignment/guide/${guideId}/students`,
    );
    return response.data;
  },

  getGuideForStudent: async (studentId) => {
    const response = await api.get(
      `/guide-assignment/student/${studentId}/guide`,
    );
    return response.data;
  },

  // System Statistics
  getSystemStats: async () => {
    try {
      console.log("Fetching system stats...");
      const response = await api.get("/admin/dashboard/stats");
      console.log("System stats response:", response.data);
      return response.data.stats;
    } catch (error) {
      console.error("Error fetching system stats:", error);
      // Return mock data as fallback for debugging
      if (error.response?.status === 403) {
        console.warn("Using mock data due to 403 error");
        return {
          totalUsers: 0,
          totalStudents: 0,
          totalGuides: 0,
          totalFacultyCoordinators: 0,
          assignedStudents: 0,
          unassignedStudents: 0,
          assignmentPercentage: 0,
          registrationPercentage: 0,
          departmentDistribution: [],
          guideWorkload: [],
        };
      }
      throw error;
    }
  },

  // Recent Activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`/admin/activities?limit=${limit}`);
    return response.data;
  },

  // System Health
  getSystemHealth: async () => {
    const response = await api.get("/admin/system/health");
    return response.data;
  },

  // Schedule Management (Mock implementation - to be replaced with actual API)
  getScheduleEvents: async () => {
    // This would be replaced with actual API call when backend is implemented
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          events: [
            {
              _id: "1",
              title: "Faculty Meeting",
              description: "Monthly faculty coordination meeting",
              date: "2024-01-20",
              time: "10:00 AM",
              duration: "2 hours",
              location: "Conference Room A",
              type: "Meeting",
              attendees: [
                "Dr. John Smith",
                "Dr. Maria Garcia",
                "Dr. David Wilson",
              ],
              status: "Scheduled",
            },
            {
              _id: "2",
              title: "PhD Defense - Alice Johnson",
              description: "PhD dissertation defense",
              date: "2024-01-22",
              time: "2:00 PM",
              duration: "3 hours",
              location: "Auditorium B",
              type: "Defense",
              attendees: ["Dr. John Smith", "External Examiner"],
              status: "Scheduled",
            },
            {
              _id: "3",
              title: "Research Proposal Review",
              description: "Review of new research proposals",
              date: "2024-01-25",
              time: "9:00 AM",
              duration: "4 hours",
              location: "Conference Room C",
              type: "Review",
              attendees: ["Dr. Maria Garcia", "Dr. David Wilson"],
              status: "Scheduled",
            },
            {
              _id: "4",
              title: "Admission Committee Meeting",
              description: "Review new PhD applications",
              date: "2024-01-28",
              time: "11:00 AM",
              duration: "3 hours",
              location: "Conference Room A",
              type: "Committee",
              attendees: ["Dr. John Smith", "Dr. Maria Garcia"],
              status: "Scheduled",
            },
          ],
        });
      }, 500);
    });
  },

  createScheduleEvent: async (eventData) => {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Event created successfully",
          event: { ...eventData, _id: Date.now().toString() },
        });
      }, 500);
    });
  },

  updateScheduleEvent: async (eventId, eventData) => {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Event updated successfully",
          event: { ...eventData, _id: eventId },
        });
      }, 500);
    });
  },

  deleteScheduleEvent: async (eventId) => {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Event deleted successfully",
        });
      }, 500);
    });
  },
};

export default adminService;
