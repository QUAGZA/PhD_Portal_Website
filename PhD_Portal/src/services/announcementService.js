import api from "./api";

const announcementService = {
  /**
   * Create a new announcement
   */
  createAnnouncement: async (formData) => {
    try {
      console.log("Creating announcement...");
      const response = await api.post("/announcements/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Announcement created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating announcement:", error);
      throw error;
    }
  },

  /**
   * Get user's relevant announcements
   */
  getMyAnnouncements: async () => {
    try {
      console.log("Fetching my announcements...");
      const response = await api.get("/announcements/my-announcements");
      console.log("Announcements fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      throw error;
    }
  },

  /**
   * Get all announcements (for admin/faculty)
   */
  getAllAnnouncements: async (params = {}) => {
    try {
      console.log("Fetching all announcements...");
      const response = await api.get("/announcements/all", { params });
      console.log("All announcements fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all announcements:", error);
      throw error;
    }
  },

  /**
   * Get specific announcement by ID
   */
  getAnnouncementById: async (id) => {
    try {
      console.log("Fetching announcement by ID:", id);
      const response = await api.get(`/announcements/${id}`);
      console.log("Announcement fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching announcement:", error);
      throw error;
    }
  },

  /**
   * Update announcement
   */
  updateAnnouncement: async (id, formData) => {
    try {
      console.log("Updating announcement:", id);
      const response = await api.put(`/announcements/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Announcement updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating announcement:", error);
      throw error;
    }
  },

  /**
   * Delete announcement
   */
  deleteAnnouncement: async (id) => {
    try {
      console.log("Deleting announcement:", id);
      const response = await api.delete(`/announcements/${id}`);
      console.log("Announcement deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting announcement:", error);
      throw error;
    }
  },

  /**
   * Mark announcement as viewed
   */
  markAsViewed: async (id) => {
    try {
      console.log("Marking announcement as viewed:", id);
      const response = await api.post(`/announcements/${id}/view`);
      console.log("Marked as viewed:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking as viewed:", error);
      throw error;
    }
  },

  /**
   * Toggle announcement active status
   */
  toggleActiveStatus: async (id) => {
    try {
      console.log("Toggling announcement status:", id);
      const response = await api.put(`/announcements/${id}/toggle-active`);
      console.log("Status toggled:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error toggling status:", error);
      throw error;
    }
  },
};

export default announcementService;
