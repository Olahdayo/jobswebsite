<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">My Dashboard</h1>
        <div class="d-flex align-items-center">
          <span class="me-3">Welcome, {{ authStore.user?.first_name || 'User' }}</span>
          <button
            @click="handleLogout"
            class="btn btn-outline-danger d-flex align-items-center"
          >
            <i class="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else>
        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-4">
            <div class="card stat-card h-100 border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="stat-icon applications">
                    <i class="fas fa-paper-plane"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Applications Sent</h6>
                    <h2 class="card-title mb-0">{{ applications?.length || 0 }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card stat-card h-100 border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Pending Reviews</h6>
                    <h2 class="card-title mb-0">{{ pendingApplications?.length || 0 }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card stat-card h-100 border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="stat-icon approved">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Approved</h6>
                    <h2 class="card-title mb-0">{{ approvedApplications?.length || 0 }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Applications -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white border-bottom-0 py-3">
            <h5 class="card-title mb-0">Recent Applications</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="applications?.length === 0" class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">No applications yet</h5>
              <p class="mb-0">Start applying for jobs to see your applications here.</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="application in recentApplications" :key="application.id">
                    <td>
                      <h6 class="mb-0">{{ application.job?.title || 'Job Removed' }}</h6>
                    </td>
                    <td>{{ application.job?.employer?.company_name || 'Company Removed' }}</td>
                    <td>
                      <span
                        :class="[
                          'badge',
                          {
                            'bg-warning': application.status === 'pending',
                            'bg-success': application.status === 'approved',
                            'bg-danger': application.status === 'rejected',
                          },
                        ]"
                      >
                        {{ application.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(application.created_at) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Find More Jobs CTA -->
        <div class="card border-0 bg-primary text-white">
          <div class="card-body text-center py-5">
            <h2 class="card-title mb-4">Ready to find your next opportunity?</h2>
            <router-link to="/JobListings" class="btn btn-lg btn-light">
              Browse Jobs
              <i class="fas fa-arrow-right ms-2"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";
import axios from 'axios';

export default {
  name: "JobSeekerDashboard",

  data() {
    const authStore = useAuthStore();
    const jobsStore = useJobsStore();

    return {
      applications: [],
      isLoading: true,
      error: null,
      authStore,
      jobsStore,
    };
  },

  computed: {
    pendingApplications() {
      return this.applications?.filter((app) => app.status === "pending") || [];
    },

    approvedApplications() {
      return this.applications?.filter((app) => app.status === "approved") || [];
    },

    recentApplications() {
      if (!this.applications) return [];
      return [...this.applications].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 5); // Show only the 5 most recent applications
    },
  },

  async created() {
    try {
      if (!this.authStore.user || !this.authStore.token) {
        this.$router.push('/login');
        return;
      }
      await this.loadApplications();
    } catch (error) {
      console.error('Error loading applications:', error);
      this.error = 'Failed to load applications';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async loadApplications() {
      try {
        const response = await axios.get('/api/jobseeker/applications', {
          headers: {
            'Authorization': `Bearer ${this.authStore.token}`
          }
        });
        this.applications = response.data.data || []; // Handle paginated response
      } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    async handleLogout() {
      try {
        const authStore = useAuthStore();
        await authStore.logout();
        this.$router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
        // Still redirect to home even if there's an error
        this.$router.push('/');
      }
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.stat-card {
  transition: transform 0.2s;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.applications {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.stat-icon.pending {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-icon.approved {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.badge {
  font-weight: 500;
  padding: 0.5em 0.75em;
}

.table > :not(:first-child) {
  border-top: 0;
}
</style>
