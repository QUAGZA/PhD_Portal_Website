import api from "./api";

const facultyDashboardService = {
  /**
   * Get all students in faculty's department
   */
  getStudents: async () => {
    try {
      console.log("Fetching faculty students...");
      const response = await api.get("/faculty/dashboard/students");
      console.log("Students fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  },

  /**
   * Get all guides in faculty's department
   */
  getGuides: async () => {
    try {
      console.log("Fetching faculty guides...");
      const response = await api.get("/faculty/dashboard/guides");
      console.log("Guides fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching guides:", error);
      throw error;
    }
  },

  /**
   * Get faculty schedule
   */
  getSchedule: async () => {
    try {
      console.log("Fetching faculty schedule...");
      const response = await api.get("/faculty/dashboard/schedule");
      console.log("Schedule fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching schedule:", error);
      throw error;
    }
  },

  /**
   * Get dashboard summary
   */
  getSummary: async () => {
    try {
      console.log("Fetching faculty dashboard summary...");
      const response = await api.get("/faculty/dashboard/summary");
      console.log("Summary fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching summary:", error);
      throw error;
    }
  },
};

export default facultyDashboardService;
