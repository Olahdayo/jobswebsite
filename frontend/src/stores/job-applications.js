import api from '@/services/api';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useJobApplicationsStore = defineStore('jobApplications', {
  // State management for job applications
  state: () => ({
    applications: [],
    job: null,
    loading: false,
    error: null
  }),

  // Actions to interact with job applications
  actions: {
    /**
     * Fetch job applications for a specific job
     * @param {number} jobId - The ID of the job to fetch applications for
     */
    async fetchJobApplications(jobId) {
      // Reset previous state
      this.applications = [];
      this.job = null;
      this.loading = true;
      this.error = null;

      try {
        // Get current user from auth store
        const authStore = useAuthStore();
        const currentUser = authStore.user;
        const userType = authStore.userType;

        // Validate user type
        const validUserTypes = ['employer', 'admin'];
        const normalizedUserType = userType ? userType.toLowerCase() : null;

        if (!normalizedUserType || !validUserTypes.includes(normalizedUserType)) {
          throw new Error(`Unauthorized access. Invalid user type '${userType}'.`);
        }

        // Fetch job applications with detailed error handling
        const response = await api.get(`/jobs/${jobId}/applications`, {
          headers: {
            'X-User-Type': normalizedUserType,
            'X-User-ID': currentUser?.id
          }
        });

        // Validate response structure
        if (!response.data || !response.data.job || !response.data.applications) {
          throw new Error('Invalid response format: Missing job or applications data');
        }

        // Set job and applications
        this.job = response.data.job;
        this.applications = response.data.applications || [];

        // Log successful fetch
        console.log('Job Applications Fetched', {
          jobId,
          applicationCount: this.applications.length
        });

        // Handle empty applications
        if (this.applications.length === 0) {
          this.error = 'No applications found for this job.';
        }

        return this.applications;
      } catch (error) {
        // Comprehensive error handling
        console.error('Fetch Job Applications Error', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });

        // Detailed error logging
        if (error.response) {
          this.error = error.response.data.message || 
                       `Error ${error.response.status}: Failed to fetch job applications`;
          
          // Specific 403 error handling
          if (error.response.status === 403) {
            console.error('Forbidden Access Details', {
              userType: this.userType,
              jobId
            });
          }
        } else {
          this.error = error.message || 'An unexpected error occurred';
        }

        // Rethrow to allow component-level handling
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear the current job applications state
     */
    clearJobApplications() {
      this.applications = [];
      this.job = null;
      this.loading = false;
      this.error = null;
    },

    // Method to download resume
    downloadResume(applicationId) {
      return api.get(`/job-applications/${applicationId}/download-resume`, {
        responseType: 'blob',
        // Add error handling
        validateStatus: function (status) {
          // Accept successful status codes and 404
          return (status >= 200 && status < 300) || status === 404;
        },
        // Intercept the response to handle error responses
        transformResponse: [function (data, headers) {
          // If the response is a blob, it's a successful file download
          if (data instanceof Blob) {
            return data;
          }
          
          // Try to parse the error response
          try {
            const parsedData = JSON.parse(data);
            return parsedData;
          } catch (e) {
            // If parsing fails, return the original data
            return data;
          }
        }]
      });
    },
  },

  // Getters for easy access to job application data
  getters: {
    /**
     * Get the total number of applications
     * @returns {number}
     */
    totalApplications() {
      return this.applications.length;
    },

    /**
     * Check if there are any applications
     * @returns {boolean}
     */
    hasApplications() {
      return this.applications.length > 0;
    }
  }
});
