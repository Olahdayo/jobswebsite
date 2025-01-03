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

    // Search jobs with filters
    searchJobs: async (params) => {
        try {
            const response = await api.get('/jobs/search', { params });
            return response.data;
        } catch (error) {
            console.error('Error searching jobs:', error);
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
    }
};
