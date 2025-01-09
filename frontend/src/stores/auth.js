import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("user_type") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async loginAsJobSeeker(credentials) {
      try {
        const response = await authService.jobSeekerLogin(credentials);
        this.setAuthData(response.job_seeker, response.token, 'job_seeker');
        return response;
      } catch (error) {
        console.error('Job seeker login failed:', error);
        throw error;
      }
    },

    async loginAsEmployer(credentials) {
      try {
        const response = await authService.employerLogin(credentials);
        this.setAuthData(response.employer, response.token, 'employer');
        return response;
      } catch (error) {
        console.error('Employer login failed:', error);
        throw error;
      }
    },

    async registerJobSeeker(data) {
      try {
        const response = await authService.jobSeekerRegister(data);
        this.setAuthData(response.job_seeker, response.token, 'job_seeker');
        return response;
      } catch (error) {
        console.error('Job seeker registration failed:', error);
        throw error;
      }
    },

    async registerEmployer(data) {
      try {
        const response = await authService.employerRegister(data);
        this.setAuthData(response.employer, response.token, 'employer');
        return response;
      } catch (error) {
        console.error('Employer registration failed:', error);
        throw error;
      }
    },

    setAuthData(user, token, type) {
      this.user = user;
      this.token = token;
      this.userType = type;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user_type', type);
      localStorage.setItem('user', JSON.stringify(user));
    },

    async logout() {
      try {
        // Clear store state first
        this.user = null;
        this.token = null;
        this.userType = null;

        // Then call the API
        await authService.logout();
        
        // Navigate to home page
        useRouter().push('/');
      } catch (error) {
        console.warn('Error during logout:', error);
        // Still navigate to home page even if there's an error
        useRouter().push('/');
      }
    },

    clearAuthData() {
      this.user = null;
      this.token = null;
      this.userType = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user');
    },

    initAuth() {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('user_type');
      const user = localStorage.getItem('user');

      if (token && userType && user) {
        this.user = JSON.parse(user);
        this.token = token;
        this.userType = userType;
      } else {
        this.clearAuthData();
      }
    }
  }
});
