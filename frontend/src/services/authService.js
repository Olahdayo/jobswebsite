import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Register a new employer
  employerRegister: async (employerData) => {
    try {
      const response = await api.post("/employer/register", employerData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", "employer");
        localStorage.setItem("user", JSON.stringify(response.data.employer));
      }
      return response.data;
    } catch (error) {
      console.error("Error registering employer:", error);
      throw error;
    }
  },

  // Register a new job seeker
  jobSeekerRegister: async (jobSeekerData) => {
    try {
      const response = await api.post("/jobseeker/register", jobSeekerData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", "job_seeker");
        localStorage.setItem("user", JSON.stringify(response.data.job_seeker));
      }
      return response.data;
    } catch (error) {
      console.error("Error registering job seeker:", error);
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_type", response.data.userType);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("user_type");

    // Clear local storage first to ensure user is logged out even if API call fails
    localStorage.clear();

    if (!token) {
      return { message: "Logged out successfully" };
    }

    try {
      // Try to call the appropriate logout endpoint based on user type
      const logoutEndpoint =
        userType === "employer" ? "/employer/logout" : "/jobseeker/logout";
      await api.post(
        logoutEndpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.warn("Error during API logout:", error);
    }

    return { message: "Logged out successfully" };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // Get current user type
  getUserType: () => {
    return localStorage.getItem("user_type");
  },

  // Get current user data
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Check if token needs refresh
  checkAndRefreshToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await api.post("/refresh-token");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  },

  // Add this method to your authService
  async updateProfile(profileData) {
    try {
      const response = await api.put("/jobseeker/profile", profileData);
      return response;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Add this method to authService
  async reapplyForJob(applicationId) {
    try {
      const response = await api.post(`/applications/${applicationId}/reapply`);
      return response.data;
    } catch (error) {
      console.error("Error reapplying for job:", error);
      throw error;
    }
  },
};
