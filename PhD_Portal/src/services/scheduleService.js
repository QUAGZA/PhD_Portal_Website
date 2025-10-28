import api from "./api";

const scheduleService = {
  /**
   * Create a new schedule event
   */
  createEvent: async (eventData) => {
    try {
      console.log("Creating schedule event:", eventData);
      const response = await api.post("/schedule/create", eventData);
      console.log("Event created:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  /**
   * Get user's schedule events
   */
  getMyEvents: async () => {
    try {
      console.log("Fetching my schedule events...");
      const response = await api.get("/schedule/my-events");
      console.log("Events fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  /**
   * Get events by date range
   */
  getEventsByDateRange: async (startDate, endDate) => {
    try {
      console.log("Fetching events by date range:", startDate, endDate);
      const response = await api.get("/schedule/range", {
        params: { startDate, endDate },
      });
      console.log("Events fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching events by date range:", error);
      throw error;
    }
  },

  /**
   * Get upcoming events
   */
  getUpcomingEvents: async (limit = 5) => {
    try {
      console.log("Fetching upcoming events...");
      const response = await api.get("/schedule/upcoming", {
        params: { limit },
      });
      console.log("Upcoming events fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }
  },

  /**
   * Get specific event by ID
   */
  getEventById: async (id) => {
    try {
      console.log("Fetching event by ID:", id);
      const response = await api.get(`/schedule/${id}`);
      console.log("Event fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  /**
   * Update event
   */
  updateEvent: async (id, eventData) => {
    try {
      console.log("Updating event:", id, eventData);
      const response = await api.put(`/schedule/${id}`, eventData);
      console.log("Event updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  /**
   * Delete event
   */
  deleteEvent: async (id) => {
    try {
      console.log("Deleting event:", id);
      const response = await api.delete(`/schedule/${id}`);
      console.log("Event deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  /**
   * Mark attendance
   */
  markAttendance: async (id, attendance) => {
    try {
      console.log("Marking attendance:", id, attendance);
      const response = await api.put(`/schedule/${id}/attendance`, {
        attendance,
      });
      console.log("Attendance marked:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },
};

export default scheduleService;
