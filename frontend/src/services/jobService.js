import api from "./api";
// import { useAuthStore } from "@/stores/auth";

export const jobService = {
  // Get all jobs with pagination
  getAllJobs: async (page = 1) => {
    try {

      // Make the API call with axios config
      const response = await api.get("/jobs", {
        params: {
          page: page,
        },
      });

      return response.data;
    } catch (error) {
      console.error("JobService: Error fetching jobs:", error);
      throw error;
    }
  },

  // Get recent jobs

  getRecentJobs: async () => {
    try {
      const response = await api.get("/jobs/recent");

      return response.data;
    } catch (error) {
      console.error("Error fetching recent jobs:", error);

      throw error;
    }
  },

  // Get job counts by state

  getJobCountsByState: async () => {
    try {
      const response = await api.get("/jobs/by-state");

      return response.data;
    } catch (error) {
      console.error("Error fetching job counts by state:", error);

      throw error;
    }
  },

  // Get job counts by category

  getJobCountsByCategory: async () => {
    try {
      const response = await api.get("/jobs/by-category");

      return response.data;
    } catch (error) {
      console.error("Error getting job counts by category:", error);

      throw error;
    }
  },

  // Search jobs

  searchJobs: async (filters, page = 1) => {
    try {
      const currentPage = Math.max(1, parseInt(page));
      const response = await api.get("/jobs/search", {
        params: {
          ...filters,
          page: currentPage,
          per_page: 10,
        },
      });
      return {
        data: response.data.data || [],
        total: response.data.total || 0,
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || 10,
        last_page: response.data.last_page || 1,
      };
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw error;
    }
  },

  // Get a single job by ID

  getJob: async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      // Log the response structure for debugging
      // console.log("Job response:", response);
      return response.data; // Return just the data portion
    } catch (error) {
      console.error("Error fetching job details:", error);
      throw error;
    }
  },

  // Apply for a job
  applyForJob: async (formData) => {
    try {
      // Log FormData contents for debugging (excluding file contents)
      const formDataEntries = {};
      for (let [key, value] of formData.entries()) {
        if (key !== 'resume') {
          formDataEntries[key] = value;
        } else {
          formDataEntries[key] = 'File present';
        }
      }
      console.log('Submitting application with data:', formDataEntries);

      const response = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      console.log('Application submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        // Handle specific error cases
        if (error.response.status === 422) {
          // Validation errors or duplicate application
          const errorMessage = error.response.data.message || 
            'There was a problem with your application.';
          throw new Error(errorMessage);
        } else if (error.response.status === 401) {
          throw new Error('Please log in to apply for this job.');
        } else if (error.response.status === 403) {
          throw new Error('You are not authorized to apply for this job.');
        } else if (error.response.status === 404) {
          throw new Error('This job posting is no longer available.');
        } else if (error.response.status === 500) {
          throw new Error('An error occurred while submitting your application. Please try again later.');
        }
      }
      
      // Generic error
      throw new Error('Failed to submit application. Please try again.');
    }
  },

  // Get all jobs

  getAllJobs: async () => {
    try {
      const response = await api.get("/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return {
        data: [],
        total: 0,
      };
    }
  },

  // Get jobs by location

  getJobsByLocation: async (location) => {
    try {
      const response = await api.get(`/jobs/location/${location}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching jobs by location:", error);

      throw error;
    }
  },

  // Get all unique job locations
  getLocations: async () => {
    try {
      const response = await api.get("/jobs/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  // Get all categories

  getCategories: async () => {
    try {
      const response = await api.get("/jobs/categories");

      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);

      throw error;
    }
  },

  // Get jobs by category

  getJobsByCategory: async (category) => {
    try {
      const response = await api.get(`/jobs/category/${category}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching jobs by category:", error);

      throw error;
    }
  },

  // Get featured jobs

  getFeaturedJobs: async () => {
    try {
      const response = await api.get("/jobs/featured");

      // Ensure we're returning the data property of the response

      return response.data;
    } catch (error) {
      console.error("Error fetching featured jobs:", error);

      throw error;
    }
  },

  // Get stats

  getStats: async () => {
    try {
      const response = await api.get("/jobs/stats");

      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);

      throw error;
    }
  },

  // Get all filter options

  getFilterOptions: async () => {
    try {
      const [locations, categories] = await Promise.all([
        api.get("/jobs/locations"),

        api.get("/jobs/categories"),
      ]);

      return {
        locations: locations.data,

        categories: categories.data,

        jobTypes: [
          "Full-time",

          "Part-time",

          "Contract",

          "Remote",

          "Internship",

          "Graduate Trainee",
        ],

        experienceLevels: [
          "Entry Level",

          "Junior Level",

          "Mid Level",

          "Senior Level",

          "Lead/Manager",

          "Executive",
        ],
      };
    } catch (error) {
      console.error("Error fetching filter options:", error);

      throw error;
    }
  },

  // Get jobs with filters
  getJobs: async (filters = {}, page = 1) => {
    try {
      const response = await api.get("/jobs", {
        params: {
          page,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error("JobService: Error fetching filtered jobs:", error);
      throw error;
    }
  },

  async getUserApplications() {
    try {
      const response = await api.get("/applications");
      
      // More robust response handling
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Log the response for debugging
      console.log("Applications response:", response.data);
      
      // Return the entire response
      return response;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Full error response:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
        
        // Handle specific error cases
        if (error.response.status === 401) {
          console.warn('User session expired. Redirecting to login.');
        } else if (error.response.status === 500) {
          console.error('Internal Server Error. Please contact support.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      throw error;
    }
  },

  // Get employer's jobs
  getEmployerJobs: async () => {
    try {
      const response = await api.get("/employer/jobs");
      return response.data;
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      throw error;
    }
  },

  // Get employer stats
  getEmployerStats: async () => {
    try {
      const response = await api.get("/employer/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching employer stats:", error);
      throw error;
    }
  },

  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post("/jobs", jobData);
      return response.data;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Update a job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  },

  // Toggle job status
  toggleJobStatus: async (jobId) => {
    try {
      const response = await api.patch(`/employer/jobs/${jobId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error("Error toggling job status:", error);
      throw error;
    }
  },

  // Get job applications
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/employer/jobs/${jobId}/applications`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (jobId, applicationId, status) => {
    try {
      const response = await api.patch(
        `/employer/jobs/${jobId}/applications/${applicationId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  },
};
