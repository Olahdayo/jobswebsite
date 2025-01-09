import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Important for CORS with credentials
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    // Register a new employer
    employerRegister: async (employerData) => {
        try {
            const response = await api.post('/employer/register', employerData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_type', 'employer');
                localStorage.setItem('user', JSON.stringify(response.data.employer));
            }
            return response.data;
        } catch (error) {
            console.error('Error registering employer:', error);
            throw error;
        }
    },

    // Register a new job seeker
    jobSeekerRegister: async (jobSeekerData) => {
        try {
            const response = await api.post('/jobseeker/register', jobSeekerData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_type', 'job_seeker');
                localStorage.setItem('user', JSON.stringify(response.data.job_seeker));
            }
            return response.data;
        } catch (error) {
            console.error('Error registering job seeker:', error);
            throw error;
        }
    },

    // Login for employer
    employerLogin: async (credentials) => {
        try {
            const response = await api.post('/employer/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_type', 'employer');
                localStorage.setItem('user', JSON.stringify(response.data.employer));
                
                // Handle remember me
                if (credentials.remember) {
                    localStorage.setItem('remember_token', response.data.remember_token);
                }
            }
            return response.data;
        } catch (error) {
            console.error('Error logging in employer:', error);
            throw error;
        }
    },

    // Login for job seeker
    jobSeekerLogin: async (credentials) => {
        try {
            const response = await api.post('/jobseeker/login', credentials);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user_type', 'job_seeker');
                localStorage.setItem('user', JSON.stringify(response.data.job_seeker));
                
                // Handle remember me
                if (credentials.remember) {
                    localStorage.setItem('remember_token', response.data.remember_token);
                }
            }
            return response.data;
        } catch (error) {
            console.error('Error logging in job seeker:', error);
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                // If no token exists, just clear local storage
                localStorage.clear();
                return { message: 'Logged out successfully' };
            }

            try {
                await api.post('/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.warn('Error during API logout:', error);
                // Continue with local cleanup even if API call fails
            }

            // Clear all local storage items
            localStorage.clear();
            
            return { message: 'Logged out successfully' };
        } catch (error) {
            console.error('Error in logout process:', error);
            // Still clear local storage even if there's an error
            localStorage.clear();
            throw error;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user type
    getUserType: () => {
        return localStorage.getItem('user_type');
    },

    // Get current user data
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if token needs refresh
    checkAndRefreshToken: async () => {
        const token = localStorage.getItem('token');
        if (!token) return false;

        try {
            const response = await api.post('/refresh-token');
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return true;
        } catch (error) {
            console.error('Error refreshing token:', error);
            return false;
        }
    }
};
