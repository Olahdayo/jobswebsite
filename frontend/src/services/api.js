import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const jobService = {
    getAllJobs: async () => {
        try {
            const response = await api.get('/jobs');
            return response.data;
        } catch (error) {
            console.error('Error fetching jobs:', error);
            throw error;
        }
    },

    getJobById: async (id) => {
        try {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching job details:', error);
            throw error;
        }
    },

    searchJobs: async (query) => {
        try {
            const response = await api.get('/jobs/search', { params: { query } });
            return response.data;
        } catch (error) {
            console.error('Error searching jobs:', error);
            throw error;
        }
    }
};
