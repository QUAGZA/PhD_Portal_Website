import api from "./api";

const studentDashboardService = {
  /**
   * Get student's courses with progress
   */
  getCourses: async () => {
    try {
      console.log("Fetching student courses...");
      const response = await api.get("/student/dashboard/courses");
      console.log("Courses fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  /**
   * Get student's assignments
   */
  getAssignments: async () => {
    try {
      console.log("Fetching student assignments...");
      const response = await api.get("/student/dashboard/assignments");
      console.log("Assignments fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  },

  /**
   * Get announcements
   */
  getAnnouncements: async () => {
    try {
      console.log("Fetching announcements...");
      const response = await api.get("/student/dashboard/announcements");
      console.log("Announcements fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  /**
   * Get course progress overview
   */
  getProgress: async () => {
    try {
      console.log("Fetching student progress...");
      const response = await api.get("/student/dashboard/progress");
      console.log("Progress fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching progress:", error);
      throw error;
    }
  },

  /**
   * Get resources
   */
  getResources: async () => {
    try {
      console.log("Fetching resources...");
      const response = await api.get("/student/dashboard/resources");
      console.log("Resources fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw error;
    }
  },

  /**
   * Get dashboard summary
   */
  getSummary: async () => {
    try {
      console.log("Fetching dashboard summary...");
      const response = await api.get("/student/dashboard/summary");
      console.log("Summary fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  },
};

export default studentDashboardService;
