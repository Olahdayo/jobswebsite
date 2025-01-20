import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Add auth token to all requests
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

authAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const profileService = {
  // Get user profile
  async getUserProfile() {
    const userType = localStorage.getItem('user_type');
    const endpoint = userType === 'employer' ? '/employer/profile' : '/jobseeker/profile';
    const response = await authAxios.get(endpoint);
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData) {
    const userType = localStorage.getItem('user_type');
    const baseEndpoint = userType === 'employer' ? '/employer/profile' : '/jobseeker/profile';
    
    try {
      // Check if we're uploading a file
      if (profileData instanceof FormData) {
        // console.log('Uploading file...', {
        //   file: profileData.get('profile_picture'),
        //   size: profileData.get('profile_picture').size,
        //   type: profileData.get('profile_picture').type
        // });
        
        const response = await authAxios.post(`${baseEndpoint}/upload-photo`, profileData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json'
          }
        });
        // console.log('Upload response:', response);
        return response.data;
      }

      // Regular profile update
      const response = await authAxios.put(baseEndpoint, profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get user applications
  async getApplications() {
    const response = await authAxios.get('/applications');
    return response.data;
  },

  // Cancel job application
  cancelApplication: async (applicationId) => {
    try {
      console.log('Attempting to cancel application:', {
        applicationId,
        url: `/applications/${applicationId}`,
        token: localStorage.getItem('token')
      });

      const response = await authAxios.delete(`/applications/${applicationId}`);
      
      console.log('Cancel application response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error cancelling application:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
};
