import { defineStore } from "pinia";
import { jobService } from "@/services/jobService";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    // General job listings
    jobs: [],
    filteredJobs: [],

    // Job details
    currentJob: null,
    isLoadingJob: false,
    jobError: null,

    // Application state
    isApplying: false,
    applicationError: null,
    applicationSuccess: false,

    // Employer specific data
    employerJobs: [],
    jobStats: {
      totalJobs: 0,
      activeJobs: 0,
      totalApplications: 0,
      pendingApplications: 0,
      acceptedApplications: 0,
      rejectedApplications: 0,
    },

    // Filter options for job forms
    filterOptions: {
      jobTypes: [],
      categories: [],
      locations: [],
      educationLevels: [],
      experienceLevels: [],
    },

    // Search filters for job seekers
    searchFilters: {
      keyword: "",
      location: "",
      category: "",
      type: "",
      experience_level: "",
      is_featured: false,
    },

    // UI state
    loading: false,
    error: null,
  }),

  getters: {
    // Job seeker getters
    getFilteredJobs: (state) => state.filteredJobs,
    getActiveJobs: (state) =>
      state.jobs.filter((job) => job.status === "active"),
    getFeaturedJobs: (state) => state.jobs.filter((job) => job.is_featured),
    getCurrentJob: (state) => {
      // Handle both direct job object and nested data structure
      if (!state.currentJob) return null;
      return state.currentJob.data || state.currentJob;
    },
    getJobLoadingState: (state) => state.isLoadingJob,
    getJobError: (state) => state.jobError,
    getApplicationState: (state) => ({
      isApplying: state.isApplying,
      error: state.applicationError,
      success: state.applicationSuccess,
    }),

    // Employer getters
    getEmployerJobs: (state) => state.employerJobs,
    getJobStats: (state) => state.jobStats,
    getFilterOptions: (state) => state.filterOptions,

    // Status getters
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    // Initialize store data
    async initialize() {
      try {
        this.loading = true;
        await Promise.all([this.fetchFilterOptions(), this.fetchJobs()]);
        // Set filtered jobs to all jobs initially
        this.filteredJobs = [...this.jobs];
      } catch (error) {
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
        if (response.data && response.status === "success") {
          this.jobStats = {
            totalJobs: response.data.totalJobs || 0,
            activeJobs: response.data.activeJobs || 0,
            totalApplications: response.data.totalApplications || 0,
            pendingApplications: response.data.pendingApplications || 0,
            acceptedApplications: response.data.acceptedApplications || 0,
            rejectedApplications: response.data.rejectedApplications || 0,
          };
        }
      } catch (error) {
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
          const index = this.employerJobs.findIndex((job) => job.id === jobId);
          if (index !== -1) {
            this.employerJobs[index] = response.data;
          }
          await this.fetchJobStats(); // Refresh stats after updating a job
        }
        return response.data;
      } catch (error) {
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
          const index = this.employerJobs.findIndex((job) => job.id === jobId);
          if (index !== -1) {
            this.employerJobs[index] = response.data;
          }
          await this.fetchJobStats(); // Refresh stats after toggling status
        }
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Job details actions
    async fetchJob(jobId) {
      try {
        this.isLoadingJob = true;
        this.jobError = null;

        const response = await jobService.getJob(jobId);

        // Check if response has nested data
        const jobData = response.data || response;

        if (!jobData || Object.values(jobData).every((val) => val === null)) {
          this.jobError = "No job details found";
          this.currentJob = null;
          return;
        }

        this.currentJob = jobData;
      } catch (error) {
        this.jobError = error.message || "Failed to fetch job details";
        this.currentJob = null;
      } finally {
        this.isLoadingJob = false;
      }
    },

    async submitJobApplication(jobId, applicationData) {
      try {
        this.isApplying = true;
        this.applicationError = null;
        this.applicationSuccess = false;

        const response = await jobService.applyForJob(jobId, applicationData);
        this.applicationSuccess = true;
        return response;
      } catch (error) {
        this.applicationError = error.message;
        throw error;
      } finally {
        this.isApplying = false;
      }
    },

    async fetchUserJobApplications(jobId) {
      try {
        // Validate jobId is a number
        if (!jobId || isNaN(jobId)) {
          throw new Error("Invalid job ID");
        }

        const response = await jobService.checkUserJobApplication(jobId);

        // Validate response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid response from server");
        }

        return {
          data: {
            hasApplied: response.hasApplied || false,
            applicationStatus: response.applicationStatus || null,
            deadlineDate: response.deadlineDate || null,
          },
        };
      } catch (error) {
        console.error("Error in store fetching user job applications:", error);

        // Rethrow to allow component-level error handling
        throw error;
      }
    },

    resetJobDetails() {
      this.currentJob = null;
      this.isLoadingJob = false;
      this.jobError = null;
      this.isApplying = false;
      this.applicationError = null;
      this.applicationSuccess = false;
    },

    // Filter options
    async fetchFilterOptions() {
      try {
        const response = await jobService.getFilterOptions();
        this.filterOptions = {
          ...this.filterOptions,
          ...response,
        };
      } catch (error) {
        this.error = error.message;
      }
    },

    // Job seeker actions
    async fetchJobs(page = 1) {
      try {
        this.loading = true;
        const response = await jobService.getAllJobs(page);
        this.jobs = response.data || [];
        // Set filtered jobs to all jobs when fetching
        this.filteredJobs = [...this.jobs];
      } catch (error) {
        this.error = error.message;
        this.jobs = [];
        this.filteredJobs = [];
      } finally {
        this.loading = false;
      }
    },

    async updateSearchFilters(filters) {
      try {
        this.loading = true;
        // Update searchFilters state with the new filters
        this.searchFilters = {
          // Use filters.keyword directly since that's what the backend expects
          keyword: filters.keyword || "",
          location: filters.location || "",
          category: filters.category || "",
          type: filters.type || "",
          experience_level: filters.experience_level || "",
          is_featured: filters.is_featured || false,
        };

        // Use the backend search API instead of local filtering
        const response = await jobService.searchJobs(this.searchFilters);
        this.filteredJobs = response.data || [];
      } catch (error) {
        this.error = error.message;
        this.filteredJobs = [];
      } finally {
        this.loading = false;
      }
    },

    async resetState() {
      this.searchFilters = {
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        is_featured: false,
      };
      this.error = null;

      // Fetch all jobs when filters are reset
      try {
        this.loading = true;
        const response = await jobService.getAllJobs();
        this.filteredJobs = response.data || [];
      } catch (error) {
        this.error = error.message;
        this.filteredJobs = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
