import { defineStore } from "pinia";
import { jobService } from "@/services/jobService";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    // General job listings
    jobs: [],
    filteredJobs: [],
    
    // Employer specific data
    employerJobs: [],
    jobStats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0
    },
    
    // Filter options for job forms
    filterOptions: {
      jobTypes: [],
      categories: [],
      locations: [],
      educationLevels: [],
      experienceLevels: []
    },
    
    // Search filters for job seekers
    searchFilters: {
      query: "",
      location: "",
      field: "",
      education: "",
      jobType: "",
    },
    
    // UI state
    loading: false,
    error: null
  }),

  getters: {
    // Job seeker getters
    getFilteredJobs: (state) => state.filteredJobs,
    getActiveJobs: (state) => state.jobs.filter(job => job.status === 'active'),
    getFeaturedJobs: (state) => state.jobs.filter(job => job.featured && job.status === 'active'),
    
    // Employer getters
    getEmployerJobs: (state) => state.employerJobs,
    getJobStats: (state) => state.jobStats,
    getFilterOptions: (state) => state.filterOptions,
    
    // Status getters
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    // Initialize store data
    async initialize() {
      try {
        this.loading = true;
        await Promise.all([
          this.fetchFilterOptions(),
          this.fetchJobs()
        ]);
      } catch (error) {
        console.error('Error initializing jobs store:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Employer specific actions
    async fetchEmployerJobs() {
      try {
        this.loading = true;
        const response = await jobService.getEmployerJobs();
        this.employerJobs = response.data || [];
      } catch (error) {
        console.error('Error fetching employer jobs:', error);
        this.error = error.message;
        this.employerJobs = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchJobStats() {
      try {
        this.loading = true;
        const response = await jobService.getEmployerStats();
        if (response.data && response.status === 'success') {
          this.jobStats = {
            totalJobs: response.data.totalJobs || 0,
            activeJobs: response.data.activeJobs || 0,
            totalApplications: response.data.totalApplications || 0,
            pendingApplications: response.data.pendingApplications || 0,
            acceptedApplications: response.data.acceptedApplications || 0
          };
        }
      } catch (error) {
        console.error('Error fetching job stats:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async createJob(jobData) {
      try {
        this.loading = true;
        const response = await jobService.createJob(jobData);
        if (response.data) {
          this.employerJobs = [...this.employerJobs, response.data];
          await this.fetchJobStats(); 
        }
        return response.data;
      } catch (error) {
        console.error('Job Creation Store Error:', {
          message: error.message,
          response: error.response ? JSON.stringify(error.response, null, 2) : 'No response',
          data: error.response?.data ? JSON.stringify(error.response.data, null, 2) : 'No data'
        });
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateJob(jobId, jobData) {
      try {
        this.loading = true;
        const response = await jobService.updateJob(jobId, jobData);
        if (response.data) {
          const index = this.employerJobs.findIndex(job => job.id === jobId);
          if (index !== -1) {
            this.employerJobs[index] = response.data;
          }
          await this.fetchJobStats(); // Refresh stats after updating a job
        }
        return response.data;
      } catch (error) {
        console.error('Error updating job:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleJobStatus(jobId) {
      try {
        this.loading = true;
        const response = await jobService.toggleJobStatus(jobId);
        if (response.data) {
          const index = this.employerJobs.findIndex(job => job.id === jobId);
          if (index !== -1) {
            this.employerJobs[index] = response.data;
          }
          await this.fetchJobStats(); // Refresh stats after toggling status
        }
        return response.data;
      } catch (error) {
        console.error('Error toggling job status:', error);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Filter options
    async fetchFilterOptions() {
      try {
        const response = await jobService.getFilterOptions();
        this.filterOptions = {
          ...this.filterOptions,
          ...response
        };
      } catch (error) {
        console.error('Error fetching filter options:', error);
        this.error = error.message;
      }
    },

    // Job seeker actions
    async fetchJobs(page = 1) {
      try {
        this.loading = true;
        const response = await jobService.getAllJobs(page);
        this.jobs = response.data || [];
        this.filterJobs();
      } catch (error) {
        console.error('Error fetching jobs:', error);
        this.error = error.message;
        this.jobs = [];
      } finally {
        this.loading = false;
      }
    },

    async searchJobs(filters, page = 1) {
      try {
        this.loading = true;
        const response = await jobService.searchJobs(filters, page);
        this.filteredJobs = response.data || [];
        return response;
      } catch (error) {
        console.error('Error searching jobs:', error);
        this.error = error.message;
        this.filteredJobs = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update search filters
    updateSearchFilters(filters) {
      this.searchFilters = {
        ...this.searchFilters,
        ...filters
      };
      this.filterJobs();
    },

    // Filter jobs based on search filters
    filterJobs() {
      this.filteredJobs = this.jobs.filter(job => {
        const matchQuery = !this.searchFilters.query ||
          job.title.toLowerCase().includes(this.searchFilters.query.toLowerCase()) ||
          job.company.toLowerCase().includes(this.searchFilters.query.toLowerCase());

        const matchLocation = !this.searchFilters.location ||
          job.location === this.searchFilters.location;

        const matchField = !this.searchFilters.field ||
          job.category === this.searchFilters.field;

        const matchType = !this.searchFilters.jobType ||
          job.type === this.searchFilters.jobType;

        const matchEducation = !this.searchFilters.education ||
          job.educationLevel === this.searchFilters.education;

        return matchQuery && matchLocation && matchField && matchType && matchEducation;
      });
    },

    // Reset store state
    resetState() {
      this.jobs = [];
      this.filteredJobs = [];
      this.employerJobs = [];
      this.jobStats = {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        acceptedApplications: 0
      };
      this.error = null;
      this.loading = false;
    }
  }
});
