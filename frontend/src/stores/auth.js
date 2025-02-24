import { defineStore } from "pinia";
import { authService } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("user_type") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await authService.login(credentials);
        this.setAuthData(response.user, response.token, response.userType);
        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async registerJobSeeker(data) {
      try {
        const response = await authService.jobSeekerRegister(data);
        return response;
      } catch (error) {
        console.error("Job seeker registration failed:", error);
        throw error;
      }
    },

    async registerEmployer(data) {
      try {
        const response = await authService.employerRegister(data);
        return response;
      } catch (error) {
        console.error("Employer registration failed:", error);
        throw error;
      }
    },

    setAuthData(user, token, type) {
      this.user = user;
      this.token = token;
      this.userType = type;

      localStorage.setItem("token", token);
      localStorage.setItem("user_type", type);
      localStorage.setItem("user", JSON.stringify(user));
    },

    async logout() {
      try {
        // Clear store state first
        this.clearAuthData();

        // Then call the API
        await authService.logout();

        // Return success - let the component handle navigation
        return true;
      } catch (error) {
        console.warn("Error during logout:", error);
        // Still clear data even if API call fails
        this.clearAuthData();
        return false;
      }
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.userType = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      localStorage.removeItem("user");
    },

    initAuth() {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const userType = localStorage.getItem("user_type");

      if (token && user && userType) {
        this.setAuthData(JSON.parse(user), token, userType);
      }
    },

    async reapplyForJob(applicationId) {
      try {
        const response = await authService.reapplyForJob(applicationId);
        return response;
      } catch (error) {
        console.error("Error in reapplyForJob:", error);
        throw error;
      }
    },
  },
});
