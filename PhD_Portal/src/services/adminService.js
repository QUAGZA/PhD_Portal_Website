import axios from 'axios';

const API_BASE_URL = 'http://localhost:9999';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  // User Management
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
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
    const response = await api.delete(`/users/${userId}/roles`, { data: { role } });
    return response.data;
  },

  updateUserPrimaryRole: async (userId, role) => {
    const response = await api.put(`/users/${userId}/primary-role`, { role });
    return response.data;
  },

  // Faculty Coordinator Management
  getFacultyCoordinators: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/faculty-coordinators?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Guide Assignment Management
  assignGuideToStudent: async (studentId, guideId) => {
    const response = await api.post('/guide-assignment/assign', {
      studentId,
      guideId,
    });
    return response.data;
  },

  unassignGuideFromStudent: async (studentId) => {
    const response = await api.delete(`/guide-assignment/unassign/${studentId}`);
    return response.data;
  },

  changeGuideForStudent: async (studentId, newGuideId) => {
    const response = await api.put(`/guide-assignment/change/${studentId}`, {
      newGuideId,
    });
    return response.data;
  },

  getAllStudentsWithGuideStatus: async (page = 1, limit = 10) => {
    const response = await api.get(`/guide-assignment/students?page=${page}&limit=${limit}`);
    return response.data;
  },

  getGuideAssignmentStats: async () => {
    const response = await api.get('/guide-assignment/stats');
    return response.data;
  },

  getAllGuides: async () => {
    const response = await api.get('/guide-assignment/guides');
    return response.data;
  },

  getStudentsForGuide: async (guideId) => {
    const response = await api.get(`/guide-assignment/guide/${guideId}/students`);
    return response.data;
  },

  getGuideForStudent: async (studentId) => {
    const response = await api.get(`/guide-assignment/student/${studentId}/guide`);
    return response.data;
  },

  // System Statistics
  getSystemStats: async () => {
    try {
      const [usersResponse, assignmentStatsResponse] = await Promise.all([
        api.get('/users?page=1&limit=1'), // Just to get total count
        api.get('/guide-assignment/stats'),
      ]);

      const totalUsers = usersResponse.data.pagination?.total || 0;
      const assignmentStats = assignmentStatsResponse.data.stats || {};

      return {
        totalUsers,
        totalStudents: assignmentStats.totalStudents || 0,
        totalGuides: assignmentStats.totalGuides || 0,
        totalFacultyCoordinators: assignmentStats.totalFacultyCoordinators || 0,
        assignedStudents: assignmentStats.assignedStudents || 0,
        unassignedStudents: assignmentStats.unassignedStudents || 0,
        assignmentPercentage: assignmentStats.assignmentPercentage || 0,
        guideWorkload: assignmentStats.guideWorkload || [],
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return {
        totalUsers: 0,
        totalStudents: 0,
        totalGuides: 0,
        totalFacultyCoordinators: 0,
        assignedStudents: 0,
        unassignedStudents: 0,
        assignmentPercentage: 0,
        guideWorkload: [],
      };
    }
  },

  // Schedule Management (Mock implementation)
  getScheduleEvents: async () => {
    // This would be replaced with actual API call when backend is implemented
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          events: [
            {
              _id: '1',
              title: 'Faculty Meeting',
              description: 'Monthly faculty coordination meeting',
              date: '2024-01-20',
              time: '10:00 AM',
              duration: '2 hours',
              location: 'Conference Room A',
              type: 'Meeting',
              attendees: ['Dr. John Smith', 'Dr. Maria Garcia', 'Dr. David Wilson'],
              status: 'Scheduled',
            },
            {
              _id: '2',
              title: 'PhD Defense - Alice Johnson',
              description: 'PhD dissertation defense',
              date: '2024-01-22',
              time: '2:00 PM',
              duration: '3 hours',
              location: 'Auditorium B',
              type: 'Defense',
              attendees: ['Dr. John Smith', 'External Examiner'],
              status: 'Scheduled',
            },
            {
              _id: '3',
              title: 'Research Proposal Review',
              description: 'Review of new research proposals',
              date: '2024-01-25',
              time: '9:00 AM',
              duration: '4 hours',
              location: 'Conference Room C',
              type: 'Review',
              attendees: ['Dr. Maria Garcia', 'Dr. David Wilson'],
              status: 'Scheduled',
            },
            {
              _id: '4',
              title: 'Admission Committee Meeting',
              description: 'Review new PhD applications',
              date: '2024-01-28',
              time: '11:00 AM',
              duration: '3 hours',
              location: 'Conference Room A',
              type: 'Committee',
              attendees: ['Dr. John Smith', 'Dr. Maria Garcia'],
              status: 'Scheduled',
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
          message: 'Event created successfully',
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
          message: 'Event updated successfully',
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
          message: 'Event deleted successfully',
        });
      }, 500);
    });
  },
};

export default adminService;
