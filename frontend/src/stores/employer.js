import { defineStore } from "pinia";
import { profileService } from "@/services/profileService";

export const useEmployerStore = defineStore("employer", {
  state: () => ({
    jobs: [],
    profile: null,
    error: null,
    loading: false,
  }),

  actions: {
    async getJobs() {
      try {
        const response = await profileService.getEmployerJobs();
        if (response?.data) {
          this.jobs = response.data;
          return { data: this.jobs };
        }
        return { data: [] };
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    },

    async updateProfile(profileData) {
      this.loading = true;
      try {
        const response = await profileService.updateProfile(profileData);
        this.profile = response.employer;
        return response;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update profile";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async uploadLogo(formData) {
      this.loading = true;
      try {
        const response = await profileService.uploadEmployerLogo(formData);
        if (response.employer) {
          this.profile = response.employer;
        }
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to upload logo";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      this.loading = true;
      try {
        const response = await profileService.getUserProfile();
        this.profile = response;
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to fetch profile";
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
