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
            console.log('JobService: Making request for page:', page);
            
            // Make the API call with axios config
            const response = await api.get('/jobs', {
                params: {
                    page: page
                }
            });
            
            // console.log('JobService: API URL:', response.config.url);
            // console.log('JobService: Raw response:', response.data);
            
            return response.data;
        } catch (error) {
            console.error('JobService: Error fetching jobs:', error);
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

    searchJobs: async (filters, page = 1) => {
        try {
            const currentPage = Math.max(1, parseInt(page));
            const response = await api.get('/jobs/search', {
                params: {
                    ...filters,
                    page: currentPage,
                    per_page: 10
                }
            });
            return {
                data: response.data.data || [],
                total: response.data.total || 0,
                current_page: response.data.current_page || 1,
                per_page: response.data.per_page || 10,
                last_page: response.data.last_page || 1
            };
        } catch (error) {
            console.error('Error searching jobs:', error);
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
            console.error('Error fetching jobs:', error);
            return {
                data: [],
                total: 0
            };
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



    // Get all unique job locations
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

    },



    // Get all filter options

    getFilterOptions: async () => {

        try {

            const [locations, categories] = await Promise.all([

                api.get('/jobs/locations'),

                api.get('/jobs/categories')

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

                    "Graduate Trainee"

                ],

                experienceLevels: [

                    "Entry Level",

                    "Junior Level",

                    "Mid Level",

                    "Senior Level",

                    "Lead/Manager",

                    "Executive"

                ]

            };

        } catch (error) {

            console.error('Error fetching filter options:', error);

            throw error;

        }

    },

    // Get jobs with filters
    getJobs: async (filters = {}, page = 1) => {
        try {
            const response = await api.get('/jobs', {
                params: {
                    page,
                    ...filters
                }
            });
            return response.data;
        } catch (error) {
            console.error('JobService: Error fetching filtered jobs:', error);
            throw error;
        }
    }

};
