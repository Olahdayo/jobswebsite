<template>
  <div class="job-applications-container">
    <!-- Error Alert -->
    <div v-if="errorMessage" class="container py-3">
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        {{ errorMessage }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="clearErrorMessage"></button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="height: 100vh;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Main Content -->
    <template v-else-if="!errorMessage">
      <!-- Header -->
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container-fluid px-4">
          <h1 class="navbar-brand mb-0 h1 fw-bold">Job Applications</h1>
          <button 
            @click="goToDashboard" 
            class="btn btn-outline-primary"
          >
            <i class="fas fa-arrow-left me-2"></i>
            Back to Dashboard
          </button>
        </div>
      </nav>

      <!-- Job Details Card -->
      <div class="container py-4">
        <div v-if="job" class="card border-0 shadow-sm mb-4">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-3">{{ job.title }}</h5>
            <div class="row">
              <div class="col-md-3">
                <p class="text-muted mb-1">Location</p>
                <p class="fw-bold">{{ job.location }}</p>
              </div>
              <div class="col-md-3">
                <p class="text-muted mb-1">Type</p>
                <p class="fw-bold">{{ job.type }}</p>
              </div>
              <div class="col-md-3">
                <p class="text-muted mb-1">Experience Level</p>
                <p class="fw-bold">{{ job.experience_level }}</p>
              </div>
              <div class="col-md-3">
                <p class="text-muted mb-1">Status</p>
                <span 
                  :class="[
                    'badge',
                    job.is_active ? 'bg-success' : 'bg-secondary'
                  ]"
                >
                  {{ job.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Applications</h5>
              <div class="btn-group">
                <button 
                  class="btn btn-outline-primary"
                  :class="{ active: filter === 'all' }"
                  @click="setFilter('all')"
                >
                  All
                </button>
                <button 
                  class="btn btn-outline-warning"
                  :class="{ active: filter === 'pending' }"
                  @click="setFilter('pending')"
                >
                  Pending
                </button>
                <button 
                  class="btn btn-outline-success"
                  :class="{ active: filter === 'accepted' }"
                  @click="setFilter('accepted')"
                >
                  Accepted
                </button>
                <button 
                  class="btn btn-outline-danger"
                  :class="{ active: filter === 'rejected' }"
                  @click="setFilter('rejected')"
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Resume</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="application in filteredApplications" :key="application.id">
                    <td>{{ application.job_seeker.name }}</td>
                    <td>{{ application.job_seeker.email }}</td>
                    <td>
                      <a 
                        v-if="application.resume_url"
                        :href="application.resume_url" 
                        target="_blank" 
                        class="btn btn-sm btn-outline-primary"
                      >
                        <i class="fas fa-file-pdf me-1"></i>
                        View Resume
                      </a>
                      <span v-else class="text-muted">No Resume</span>
                    </td>
                    <td>{{ formatDate(application.created_at) }}</td>
                    <td>
                      <span 
                        class="badge"
                        :class="{
                          'bg-warning': application.status === 'pending',
                          'bg-success': application.status === 'accepted',
                          'bg-danger': application.status === 'rejected'
                        }"
                      >
                        {{ application.status }}
                      </span>
                    </td>
                    <td>
                      <div class="btn-group" v-if="application.status === 'pending'">
                        <button 
                          class="btn btn-sm btn-success"
                          @click="handleApplicationStatus(application.id, 'accepted')"
                        >
                          Accept
                        </button>
                        <button 
                          class="btn btn-sm btn-danger"
                          @click="handleApplicationStatus(application.id, 'rejected')"
                        >
                          Reject
                        </button>
                      </div>
                      <span v-else>--</span>
                    </td>
                  </tr>
                  <tr v-if="filteredApplications.length === 0">
                    <td colspan="6" class="text-center py-4">
                      <p class="text-muted mb-0">No applications found</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useJobsStore } from '@/stores/jobs';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'JobApplications',
  
  data() {
    return {
      job: null,
      applications: [],
      filter: 'all',
      isLoading: false,
      errorMessage: ''
    };
  },

  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),

    filteredApplications() {
      if (this.filter === 'all') return this.applications;
      return this.applications.filter(app => app.status === this.filter);
    }
  },

  created() {
    this.loadJobData();
  },

  methods: {
    ...mapActions(useJobsStore, ['fetchJobApplications', 'updateApplicationStatus']),

    // Load job and application data
    async loadJobData() {
      // Check authentication
      if (!this.isAuthenticated) {
        this.errorMessage = 'You must be logged in to view job applications.';
        this.$router.push('/login');
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = '';

        const jobId = this.$route.params.id;
        const response = await this.fetchJobApplications(jobId);
        
        this.job = response.job;
        this.applications = response.applications;
      } catch (error) {
        console.error('Error loading job data:', error);
        
        // Handle specific error scenarios
        if (error.response && error.response.status === 403) {
          this.errorMessage = 'You do not have permission to view these job applications.';
          this.$router.push('/dashboard/employer');
        } else {
          this.errorMessage = 'Failed to load job applications. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Handle application status update
    async handleApplicationStatus(applicationId, status) {
      try {
        const jobId = this.$route.params.id;
        await this.updateApplicationStatus(jobId, applicationId, status);
        
        // Reload job data to refresh applications
        await this.loadJobData();
      } catch (error) {
        console.error('Error updating application status:', error);
        this.errorMessage = 'Failed to update application status. Please try again.';
      }
    },

    // Format date for display
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Set filter for applications
    setFilter(filterType) {
      this.filter = filterType;
    },

    // Clear error message
    clearErrorMessage() {
      this.errorMessage = '';
    },

    // Navigate back to dashboard
    goToDashboard() {
      this.$router.push('/dashboard/employer');
    }
  }
};
</script>

<style scoped>
.job-applications-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.btn-group .btn.active {
  z-index: 0;
}
</style>