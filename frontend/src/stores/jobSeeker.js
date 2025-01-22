import { defineStore } from 'pinia';
import api from '@/services/api';

export const useJobSeekerStore = defineStore('jobSeeker', {
  state: () => ({
    applications: [],
    isLoading: false,
    error: null,
    filters: {
      status: 'all',
      search: ''
    },
    stats: {
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      rejectedApplications: 0,
      withdrawnApplications: 0
    }
  }),

  getters: {
    // Get filtered applications based on status and search
    filteredApplications: (state) => {
      let filtered = state.applications;

      // Filter by status
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(app => app.status === state.filters.status);
      }

      // Filter by search term
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(app => 
          app.jobTitle?.toLowerCase().includes(searchTerm) ||
          app.companyName?.toLowerCase().includes(searchTerm) ||
          app.job?.location?.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    },

    // Calculate statistics
    applicationStats: (state) => {
      return {
        total: state.applications.length,
        pending: state.applications.filter(app => app.status === 'pending').length,
        accepted: state.applications.filter(app => app.status === 'accepted').length,
        rejected: state.applications.filter(app => app.status === 'rejected').length,
        withdrawn: state.applications.filter(app => app.status === 'withdrawn').length
      };
    }
  },

  actions: {
    // Set filters
    setFilter(filterType, value) {
      this.filters[filterType] = value;
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        status: 'all',
        search: ''
      };
    },

    // Load applications
    async loadApplications() {
      try {
        this.isLoading = true;
        this.error = null;

        const response = await api.get('/applications');
        
        if (response?.data?.data) {
          this.applications = response.data.data.map(application => ({
            ...application,
            companyName: application.job?.employer?.company_name || 'Unknown Company',
            jobTitle: application.job?.title || 'Job No Longer Available'
          }));

          // Update stats
          this.stats = {
            totalApplications: this.applications.length,
            pendingApplications: this.applications.filter(app => app.status === 'pending').length,
            acceptedApplications: this.applications.filter(app => app.status === 'accepted').length,
            rejectedApplications: this.applications.filter(app => app.status === 'rejected').length,
            withdrawnApplications: this.applications.filter(app => app.status === 'withdrawn').length
          };
        } else {
          this.applications = [];
          console.warn("Unexpected response format:", response);
          this.error = "Unable to load applications. Please try again.";
        }
      } catch (error) {
        console.error("Error loading applications:", error);
        this.error = error.message || "Failed to load applications";
        this.applications = [];
      } finally {
        this.isLoading = false;
      }
    },

    // Apply for a job
    async applyForJob(formData) {
      try {
        const response = await api.post("/applications", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        });

        // Reload applications after successful application
        await this.loadApplications();
        
        return response.data;
      } catch (error) {
        console.error("Error applying for job:", error);
        
        if (error.response?.status === 422) {
          // Validation errors or duplicate application
          throw new Error(error.response.data.message || 
            'There was a problem with your application.');
        } else if (error.response?.status === 401) {
          throw new Error('Please log in to apply for this job.');
        } else if (error.response?.status === 403) {
          throw new Error('You are not authorized to apply for this job.');
        } else if (error.response?.status === 404) {
          throw new Error('This job posting is no longer available.');
        }
        
        throw new Error('Failed to submit application. Please try again.');
      }
    },

    // Cancel application
    async cancelApplication(applicationId) {
      try {
        await api.post(`/applications/${applicationId}/cancel`);
        await this.loadApplications(); // Reload applications after cancellation
        return true;
      } catch (error) {
        console.error("Error canceling application:", error);
        throw new Error('Failed to cancel application. Please try again.');
      }
    }
  }
});
