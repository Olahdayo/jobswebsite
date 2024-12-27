<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">My Dashboard</h1>
        <button
          @click="handleLogout"
          class="btn btn-outline-danger d-flex align-items-center"
        >
          <i class="fas fa-sign-out-alt me-2"></i>
          Logout
        </button>
      </div>
    </nav>

    <div class="container py-4">
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
                  <h6 class="card-subtitle text-muted mb-1">
                    Applications Sent
                  </h6>
                  <h2 class="card-title mb-0">{{ applications.length }}</h2>
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
                  <h2 class="card-title mb-0">
                    {{ pendingApplications.length }}
                  </h2>
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
                  <h2 class="card-title mb-0">
                    {{ approvedApplications.length }}
                  </h2>
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
          <div class="table-responsive">
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
                <tr
                  v-for="application in recentApplications"
                  :key="application.jobId"
                >
                  <td>
                    <h6 class="mb-0">
                      {{ getJobDetails(application.jobId).title }}
                    </h6>
                  </td>
                  <td>{{ getJobDetails(application.jobId).company }}</td>
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
                  <td>{{ formatDate(application.appliedDate) }}</td>
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
          <router-link to="/jobs" class="btn btn-lg btn-light">
            Browse Jobs
            <i class="fas fa-arrow-right ms-2"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";

export default {
  name: "JobSeekerDashboard",

  data() {
    return {
      applications: [],
      authStore: null,
      jobsStore: null,
    };
  },

  computed: {
    pendingApplications() {
      return this.applications.filter((app) => app.status === "pending");
    },

    approvedApplications() {
      return this.applications.filter((app) => app.status === "approved");
    },

    recentApplications() {
      return [...this.applications].sort(
        (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
      );
    },
  },

  created() {
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();
    this.loadApplications();
  },

  methods: {
    loadApplications() {
      // Load applications from localStorage
      this.applications = JSON.parse(
        localStorage.getItem("jobApplications") || "[]"
      ).filter((app) => app.userId === this.authStore.user.id);
    },

    getJobDetails(jobId) {
      return this.jobsStore.jobs.find((job) => job.id === jobId) || {};
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    handleLogout() {
      this.authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.stat-card {
  transition: transform 0.2s;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.stat-card:hover {
  transform: translateY(-5px);
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

.card {
  border-radius: 12px;
}

.card-header {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}

.table > :not(:first-child) {
  border-top: none;
}

.table td {
  padding: 1rem;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.btn-light {
  background-color: white;
  color: #0d6efd;
  border: none;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.2s;
}

.btn-light:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.navbar {
  padding: 1rem 0;
}

.navbar-brand {
  font-size: 1.5rem;
  color: #2c3e50;
}

.btn-outline-danger {
  border-width: 2px;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .stat-card {
    margin-bottom: 1rem;
  }

  .table-responsive {
    border-radius: 12px;
  }
}
</style>
