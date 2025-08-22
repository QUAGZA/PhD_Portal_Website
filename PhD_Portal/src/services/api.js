import axios from "axios";

// Create an axios instance with default config
const API_BASE_URL = "http://localhost:9999"; // Update this to match your backend port

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies/authentication
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token, etc.
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.log("Authentication error: User not authenticated");

      // If we're not already on the login page, redirect there
      if (!window.location.pathname.startsWith("/")) {
        window.location.href = "/";
      }
    }

    // Handle other common errors here
    return Promise.reject(error);
  },
);

export default api;
