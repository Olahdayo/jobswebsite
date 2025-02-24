import axios from "axios";

const API_URL = "http://localhost:8000/api";

// Add auth token to all requests
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  // Get user profile
  async getUserProfile() {
    const userType = localStorage.getItem("user_type");
    const endpoint =
      userType === "employer" ? "/employer/profile" : "/jobseeker/profile";
    const response = await authAxios.get(endpoint);
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const userType = localStorage.getItem("user_type");
    const baseEndpoint =
      userType === "employer" ? "/employer/profile" : "/jobseeker/profile";

    try {
      const response = await authAxios.put(baseEndpoint, profileData);
      return response.data;
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get user applications
  async getApplications() {
    const response = await authAxios.get("/applications");
    return response.data;
  },

  // Cancel job application
  cancelApplication: async (applicationId) => {
    try {
      console.log("Attempting to cancel application:", {
        applicationId,
        url: `/applications/${applicationId}/cancel`,
        token: localStorage.getItem("token"),
      });

      const response = await authAxios.post(
        `/applications/${applicationId}/cancel`
      );

      console.log("Cancel application response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error cancelling application:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  // Employer-specific methods
  async getEmployerJobs() {
    try {
      const response = await authAxios.get("/employer/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      throw error;
    }
  },

  // Add method for company logo upload
  async uploadCompanyLogo(logoFile) {
    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      const response = await authAxios.post("/employer/upload-logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading company logo:", error);
      throw error;
    }
  },

  // Add this method to your profileService
  async uploadEmployerLogo(formData) {
    try {
      const response = await authAxios.post("/employer/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  },
};
