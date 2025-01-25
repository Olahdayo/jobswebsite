<template>
  <div class="job-applications-container container py-4">
    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Job Applications</h4>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-secondary" 
                @click="$router.go(-1)"
              >
                <i class="fas fa-arrow-left me-2"></i>Back
              </button>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            <div v-else-if="applications.length === 0" class="text-center py-4">
              <p class="text-muted mb-0">No applications found for this job.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Resume</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="application in applications" :key="application.id">
                    <td>{{ application.name }}</td>
                    <td>{{ application.email }}</td>
                    <td>{{ application.phone }}</td>
                    <td>
                      <a 
                        v-if="application.resume_path" 
                        :href="application.resume_path" 
                        target="_blank" 
                        class="btn btn-sm btn-outline-primary"
                      >
                        View Resume
                      </a>
                      <span v-else class="text-muted">No Resume</span>
                    </td>
                    <td>{{ formatDate(application.created_at) }}</td>
                    <td>
                      <span 
                        :class="[
                          'badge', 
                          getStatusClass(application.status)
                        ]"
                      >
                        {{ application.status }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <button 
                          class="btn btn-sm btn-outline-success"
                          @click="updateApplicationStatus(application.id, 'accepted')"
                        >
                          Accept
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger"
                          @click="updateApplicationStatus(application.id, 'rejected')"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

export default {
  name: 'JobApplications',
  props: {
    jobId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      applications: [], 
      job: null,
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchJobApplications();
  },
  methods: {
    async fetchJobApplications() {
      try {
        this.loading = true;
        this.error = null;

        // Ensure jobId is valid
        if (!this.jobId) {
          throw new Error('Invalid Job ID');
        }

        // Get current user from auth store
        const authStore = useAuthStore();
        const currentUser = authStore.user;
        const userType = authStore.userType;

        // Detailed logging of authentication state
        // console.log('Authentication State:', {
        //   isAuthenticated: authStore.isAuthenticated,
        //   userType: userType,
        //   user: currentUser,
        //   tokenPresent: !!authStore.token
        // });

        // Enhanced user type validation
        const validUserTypes = ['employer', 'admin'];
        const normalizedUserType = userType ? userType.toLowerCase() : null;

        if (!normalizedUserType || !validUserTypes.includes(normalizedUserType)) {
          console.warn('Invalid User Type Check', {
            originalUserType: userType,
            normalizedUserType: normalizedUserType,
            validTypes: validUserTypes
          });
          
          // Log the entire user object for debugging
          console.log('Full User Object:', currentUser);
          
          // Provide more context about the authorization failure
          throw new Error(`Unauthorized access. Invalid user type '${userType}'.`);
        }

        // Fetch job applications with detailed error handling
        const response = await api.get(`/jobs/${this.jobId}/applications`, {
          // Add extra headers for debugging
          headers: {
            'X-User-Type': normalizedUserType,
            'X-User-ID': currentUser?.id
          }
        });

        // console.log('Full API Response:', {
        //   status: response.status,
        //   headers: response.headers,
        //   data: response.data
        // });

        // Log raw response data for debugging
        // console.log('Raw Response Data:', JSON.stringify(response.data));

        // Validate response structure
        if (!response.data || !response.data.job || !response.data.applications) {
          throw new Error('Invalid response format: Missing job or applications data');
        }

        // Set job details
        this.job = response.data.job;

        // Ensure response has applications array
        this.applications = response.data.applications || [];

        // console.log('Parsed Applications:', {
        //   count: this.applications.length,
        //   details: this.applications
        // });

        // Additional validation
        if (this.applications.length === 0) {
          this.error = 'No applications found for this job.';
        }
      } catch (error) {
        console.error('Job Applications Error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        
        // Detailed error handling
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error Response Details:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
          
          this.error = error.response.data.message || 
                       `Error ${error.response.status}: Failed to fetch job applications`;
          
          // Specific error handling
          if (error.response.status === 403) {
            // Log details about the forbidden error
            console.error('Forbidden Access Details:', {
              userType: this.userType,
              userId: this.currentUser?.id,
              jobId: this.jobId
            });
            
            this.$router.push('/dashboard/employer');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          this.error = 'No response from server. Please check your network connection.';
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
          this.error = error.message || 'An unexpected error occurred';
        }
      } finally {
        this.loading = false;
      }
    },
    async updateApplicationStatus(applicationId, status) {
      try {
        await api.patch(`/job-applications/${applicationId}/status`, 
          { status }
        );
        // Update local state
        const application = this.applications.find(app => app.id === applicationId);
        if (application) {
          application.status = status;
        }
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Failed to update application status');
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      switch(status.toLowerCase()) {
        case 'pending': return 'bg-warning text-dark';
        case 'accepted': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
      }
    }
  }
}
</script>

<style scoped>
.job-applications-container {
  max-width: 1200px;
}
</style>