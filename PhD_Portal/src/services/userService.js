import api from "./api";
import axios from "axios";

export const userService = {
  // Authentication
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),

  // Check auth status
  getAuthStatus: () => api.get("/auth/status"),

  // User profile
  getUserProfile: () => api.get("/auth/profile"),
  updateUserProfile: (data) => api.put("/auth/profile", data),

  // Guide preferences
  submitGuidePreferences: (preferences) =>
    api.post("/guide-preferences/submit", { preferences }),
  getGuidePreferencesPdf: () =>
    api.get("/guide-preferences/pdf", {
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    }),

  // Registration process
  getRegistrationStatus: () => api.get("/registration/status"),
  submitRegistration: (data) => api.post("/registration/register", data),

  // Document operations
  getUserDocuments: () => api.get("/documents/my-documents"),
  downloadDocument: (filename) =>
    api.get(`/documents/download/${filename}`, {
      responseType: "blob",
    }),
  deleteDocument: (filename) => api.delete(`/documents/${filename}`),

  uploadDocuments: (formData) => {
    return api.post("/documents/registration-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default userService;
