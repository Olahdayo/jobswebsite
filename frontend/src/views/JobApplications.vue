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
                    <td>{{ getApplicantName(application) }}</td>
                    <td>{{ getApplicantEmail(application) }}</td>
                    <td>
                      {{ 
                        (application.job_seeker && application.job_seeker.phone) || 
                        (application.phone) || 
                        'Not provided' 
                      }}
                    </td>
                    <td>
                      <button 
                        v-if="application.resume_url || (application.job_seeker && application.job_seeker.resume_url)" 
                        @click="downloadResume(application)" 
                        class="btn btn-sm btn-outline-primary" 
                        target="_blank"
                      >
                        View Resume
                      </button>
                      <span v-else class="text-muted">No Resume</span>
                    </td>
                    <td>{{ new Date(application.created_at).toLocaleDateString() }}</td>
                    <td>
                      <span 
                        :class="[
                          'badge', 
                          getStatusBadgeClass(application.status)
                        ]"
                      >
                        {{ application.status }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group">
                        <button 
                          class="btn btn-sm btn-outline-success"
                          v-if="application.status !== 'withdrawn'"
                          @click="updateApplicationStatus(application.id, 'accepted')"
                        >
                          Accept
                        </button>
                        <button 
                          class="btn btn-sm btn-outline-danger"
                          v-if="application.status !== 'withdrawn'"
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
import { useJobApplicationsStore } from '@/stores/job-applications';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'JobApplications',
  
  data() {
    return {
      jobId: this.$route.params.jobId,
      jobApplicationsStore: useJobApplicationsStore(),
      authStore: useAuthStore()
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
      // Show confirmation prompt
      const applicant = this.applications.find(app => app.id === applicationId);
      const applicantName = this.getApplicantName(applicant);
      const action = status === 'accepted' ? 'accept' : 'reject';
      
      if (!confirm(`Are you sure you want to ${action} ${applicantName}'s application?`)) {
        return;
      }

      try {
        await this.jobApplicationsStore.updateApplicationStatus(applicationId, status);
        // Show success message
        this.$toast?.success(`Application ${status} successfully`) || 
          alert(`Application ${status} successfully`);
      } catch (error) {
        console.error('Failed to update application status', error);
        // Show error message from the API if available, otherwise show a generic message
        const errorMessage = error?.details?.message || error?.message || 'Failed to update application status';
        this.$toast?.error(errorMessage) || alert(errorMessage);
      }
    },
    downloadResume(application) {
  const resumeUrl = application.resume_url || (application.job_seeker && application.job_seeker.resume_url);
  if (resumeUrl) {
    window.open(resumeUrl, '_blank'); 
  }
},
    getApplicantName(application) {

      if (application.job_seeker) {
       

        // Combine first and last name from job_seeker
        const firstName = application.job_seeker.first_name || '';
        const lastName = application.job_seeker.last_name || '';
        
        // Prefer full name if both first and last names exist
        if (firstName && lastName) {
          const fullName = `${firstName} ${lastName}`.trim();
          return fullName;
        }
      }

      return `Applicant #${application.id}`;
    },
    getApplicantEmail(application) {
      // Check if job_seeker exists and has an email
      if (application.job_seeker && application.job_seeker.email) {
        return application.job_seeker.email;
      }

      if (application.email) {
        return application.email;
      }

      return 'Email not provided';
    },
    getStatusBadgeClass(status) {
      switch (status ? status.toLowerCase() : '') {
        case 'accepted': return 'bg-success';
        case 'rejected': return 'bg-danger';
        case 'pending': return 'bg-warning';
        default: return 'bg-secondary';
      }
    }
  },

  created() {
    this.fetchJobApplications();
  },

  beforeUnmount() {
    this.jobApplicationsStore.clearJobApplications();
  }
};
</script>

<style scoped>
.job-applications-container {
  max-width: 1200px;
}
</style>