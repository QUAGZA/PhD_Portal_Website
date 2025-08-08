import api from "./api";

export const userService = {
  // Authentication
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.get("/logout"),

  // User profile
  getUserProfile: () => api.get("/auth/profile"),
  updateUserProfile: (data) => api.put("/auth/profile", data),

  // Document uploads
  uploadDocuments: (formData) => {
    return api.post("/auth/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Override for file uploads
      },
    });
  },

  // Registration process
  submitRegistration: (data) => api.post("/auth/register", data),
};

export default userService;
