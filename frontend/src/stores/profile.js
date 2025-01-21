import { defineStore } from 'pinia';
import { profileService } from '@/services/profileService';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    loading: false,
    error: null
  }),

  getters: {
    userProfile: (state) => state.profile,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    profilePictureUrl: (state) => {
      if (!state.profile?.profile_picture) return '/images/defaultavatar.jpg';
      return state.profile.profile_picture.startsWith('http') 
        ? state.profile.profile_picture
        : `http://localhost:8000/storage/${state.profile.profile_picture}`;
    }
  },

  actions: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const response = await profileService.getUserProfile();
        this.profile = response.data || response;
        
        // Convert skills string to array if needed
        if (this.profile && typeof this.profile.skills === 'string') {
          this.profile.skills = this.profile.skills.split(',').map(skill => skill.trim());
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch profile';
        console.error('Error fetching profile:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(profileData) {
      this.loading = true;
      this.error = null;
      try {
        // Convert skills string to array if it's a string
        if (typeof profileData.skills === 'string') {
          profileData.skills = profileData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
        }

        // Convert years_of_experience to number
        if (profileData.years_of_experience) {
          profileData.years_of_experience = Number(profileData.years_of_experience);
        }

        const response = await profileService.updateProfile(profileData);
        this.profile = response.data || response;

        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update profile';
        console.error('Error updating profile:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async uploadProfilePicture(formData) {
      this.loading = true;
      this.error = null;
      try {
        // console.log('Uploading with formData:', formData);
        const response = await profileService.updateProfile(formData);
        if (response.user) {
          this.profile = response.user;
        }
        return true;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        this.error = error.response?.data?.message || 'Failed to upload profile picture';
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Cancel a job application
    async cancelApplication(applicationId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await profileService.cancelApplication(applicationId);
        
        // If profile exists, update its applications
        if (this.profile && Array.isArray(this.profile.applications)) {
          this.profile.applications = this.profile.applications.filter(
            app => app.id !== applicationId
          );
        }
        
        return true;
      } catch (error) {
        console.error('Error cancelling application:', error);
        this.error = error.response?.data?.message || 'Failed to cancel application';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});
