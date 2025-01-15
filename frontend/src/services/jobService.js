import api from "./api";
// import { useAuthStore } from "@/stores/auth";

export const jobService = {
  // Get all jobs with pagination
  getAllJobs: async (page = 1) => {
    try {
      // console.log("JobService: Making request for page:", page);

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
      // Log the FormData contents for debugging
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      const response = await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error applying for job:", error);
      // Log more detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      throw error;
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
      // console.log("Applications response:", response);
      return response;
    } catch (error) {
      console.error("Error fetching user applications:", error);
      if (error.response) {
        console.error("Error response:", {
          status: error.response.status,
          data: error.response.data,
        });
      }
      throw error;
    }
  },
};
