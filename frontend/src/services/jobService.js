import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create an axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS with credentials
});

export const jobService = {
    // Get all jobs with pagination
    getAllJobs: async (page = 1) => {
        try {
            const response = await api.get(`/jobs?page=${page}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    // Get recent jobs
    getRecentJobs: async () => {
        try {
            const response = await api.get('/jobs/recent');
            return response.data;
        } catch (error) {
            console.error('Error fetching recent jobs:', error);
            throw error;
        }
    },

    // Get job counts by state
    getJobCountsByState: async () => {
        try {
            const response = await api.get('/jobs/by-state');
            return response.data;
        } catch (error) {
            console.error('Error fetching job counts by state:', error);
            throw error;
        }
    },

    // Get job counts by category
    getJobCountsByCategory: async () => {
        try {
            const response = await api.get('/jobs/by-category');
            return response.data;
        } catch (error) {
            console.error('Error getting job counts by category:', error);
            throw error;
        }
    },

    // Search jobs
    searchJobs: async (params) => {
        try {
            // console.log('Search Params:', params); 
            const response = await api.get('/jobs/search', { params });
            // console.log('Search Response:', response); 
            
            // Extract the data and meta from the nested response
            const { data: { data: jobs, meta } } = response;
            return { data: jobs, meta };
        } catch (error) {
            console.error('Error in searchJobs:', error);
            throw error;
        }
    },

    // Get a single job by ID
    getJobById: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching job details:', error);
            throw error;
        }
    },

    // Apply for a job
    applyForJob: async (jobId, userId) => {
        try {
            const response = await api.post(`/jobs/${jobId}/apply`, { userId });
            return response.data;
        } catch (error) {
            console.error('Error applying for job:', error);
            throw error;
        }
    },

    // Get all jobs
    getAllJobs: async () => {
        try {
            const response = await api.get('/jobs');
            return response.data;
        } catch (error) {
            console.error('Error fetching all jobs:', error);
            throw error;
        }
    },

    // Get a single job by ID
    getJob: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job:', error);
            throw error;
        }
    },

    // Get jobs by location
    getJobsByLocation: async (location) => {
        try {
            const response = await api.get(`/jobs/location/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs by location:', error);
            throw error;
        }
    },

    // Get all locations
    getLocations: async () => {
        try {
            const response = await api.get('/jobs/locations');
            return response.data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    },

    // Get all categories
    getCategories: async () => {
        try {
            const response = await api.get('/jobs/categories');
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get jobs by category
    getJobsByCategory: async (category) => {
        try {
            const response = await api.get(`/jobs/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs by category:', error);
            throw error;
        }
    },

    // Get featured jobs
    getFeaturedJobs: async () => {
        try {
            const response = await api.get('/jobs/featured');
            // Ensure we're returning the data property of the response
            return response.data;
        } catch (error) {
            console.error('Error fetching featured jobs:', error);
            throw error;
        }
    },

    // Apply for a job
    applyForJob: async (jobId, data) => {
        try {
            const response = await api.post(`/jobs/${jobId}/apply`, data);
            return response.data;
        } catch (error) {
            console.error('Error applying for job:', error);
            throw error;
        }
    },

    // Get stats
    getStats: async () => {
        try {
            const response = await api.get('/jobs/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }
    }
};
