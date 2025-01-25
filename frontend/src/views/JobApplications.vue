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
import { defineComponent } from 'vue';
import { useJobApplicationsStore } from '@/stores/job-applications';
import { useAuthStore } from '@/stores/auth';


export default defineComponent({
  name: 'JobApplications',
  
  setup() {
    const jobApplicationsStore = useJobApplicationsStore();
    const authStore = useAuthStore();

    return {
      jobApplicationsStore,
      authStore
    };
  },

  data() {
    return {
      jobId: this.$route.params.jobId
    };
  },

  computed: {
    applications() {
      return this.jobApplicationsStore.applications;
    },
    job() {
      return this.jobApplicationsStore.job;
    },
    loading() {
      return this.jobApplicationsStore.loading;
    },
    error() {
      return this.jobApplicationsStore.error;
    }
  },

  methods: {
    async fetchJobApplications() {
      try {
        // Validate user type before fetching
        const userType = this.authStore.userType;
        const validUserTypes = ['employer', 'admin'];

        if (!userType || !validUserTypes.includes(userType)) {
          throw new Error(`Unauthorized access. Invalid user type '${userType}'.`);
        }

        // Use the store method to fetch job applications
        await this.jobApplicationsStore.fetchJobApplications(this.jobId);
      } catch (error) {
        // Handle navigation for unauthorized access
        if (error.response && error.response.status === 403) {
          this.$router.push('/dashboard/employer');
        }
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
  },

  created() {
    // Fetch job applications when component is created
    this.fetchJobApplications();
  },

  // Optional: Clear store state when component is destroyed
  beforeUnmount() {
    this.jobApplicationsStore.clearJobApplications();
  }
});
</script>

<style scoped>
.job-applications-container {
  max-width: 1200px;
}
</style>