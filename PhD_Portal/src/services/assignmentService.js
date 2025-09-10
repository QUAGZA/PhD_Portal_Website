import api from "./api";

// Assignment service for handling all assignment-related API calls
const assignmentService = {
  // Student endpoints
  getAssignmentsByGuide: async () => {
    try {
      const response = await api.get("/assignments/assignedByGuide");
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments by guide:", error);
      throw error;
    }
  },

  getAssignmentById: async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/assignment/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching assignment by ID:", error);
      throw error;
    }
  },

  submitAssignment: async (assignmentData) => {
    try {
      const response = await api.post("/assignments/submit", assignmentData);
      return response.data;
    } catch (error) {
      console.error("Error submitting assignment:", error);
      throw error;
    }
  },

  // Guide endpoints
  getAssignmentsByGuideId: async () => {
    try {
      const response = await api.get("/assignments/assignedBySelf");
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments created by guide:", error);
      throw error;
    }
  },

  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post("/assignments/create", assignmentData);
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  getSubmissionsForAssignment: async (assignmentId) => {
    try {
      const response = await api.get(
        `/assignments/submissions/${assignmentId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions for assignment:", error);
      throw error;
    }
  },

  gradeSubmission: async (gradeData) => {
    try {
      const response = await api.post("/assignments/grade", gradeData);
      return response.data;
    } catch (error) {
      console.error("Error grading submission:", error);
      throw error;
    }
  },

  getNonSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(
        `/assignments/nonSubmissions/${assignmentId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching non-submissions:", error);
      throw error;
    }
  },

  // File upload helper for assignments with attachments
  createAssignmentWithFiles: async (formData) => {
    try {
      const response = await api.post("/assignments/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating assignment with files:", error);
      throw error;
    }
  },

  submitAssignmentWithFiles: async (formData) => {
    try {
      const response = await api.post("/assignments/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting assignment with files:", error);
      throw error;
    }
  },
};

export default assignmentService;
