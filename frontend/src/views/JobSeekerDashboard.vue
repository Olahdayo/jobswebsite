<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">My Dashboard</h1>
        <div class="d-flex align-items-center"></div>
      </div>
    </nav>

    <div class="container py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger m-4">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ error }}
        <button
          @click="retryLoading"
          class="btn btn-outline-danger btn-sm ms-3"
        >
          Retry
        </button>
      </div>

      <div v-else-if="!isLoading && !error">
        <!-- Stats Cards -->
        <div class="row">
          <div class="col-xl-3 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="avatar-sm">
                    <span class="avatar-title bg-primary rounded">
                      <i class="fas fa-paper-plane"></i>
                    </span>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Applications Sent
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ stats.total }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="avatar-sm">
                    <span class="avatar-title bg-warning rounded">
                      <i class="fas fa-clock"></i>
                    </span>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Pending Reviews
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ stats.pending }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="avatar-sm">
                    <span class="avatar-title bg-success rounded">
                      <i class="fas fa-check"></i>
                    </span>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Accepted</h6>
                    <h2 class="card-title mb-0">
                      {{ stats.accepted }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-xl-3 col-md-6">
            <div class="card">
              <div class="card-body">
                <div class="d-flex align-items-start">
                  <div class="avatar-sm">
                    <span class="avatar-title bg-danger rounded">
                      <i class="fas fa-times"></i>
                    </span>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Rejected</h6>
                    <h2 class="card-title mb-0">
                      {{ stats.rejected }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search and Filter -->
        <div class="row mb-3">
          <div class="col-md-6">
            <input
              type="text"
              class="form-control"
              placeholder="Search applications..."
              @input="(e) => handleSearch(e.target.value)"
            />
          </div>
          <div class="col-md-6">
            <select
              class="form-select"
              @change="(e) => handleStatusFilter(e.target.value)"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <!-- Applications List -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Applications</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="error" class="text-center py-5">
              <i class="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
              <h5 class="text-danger">{{ error }}</h5>
              <button @click="retryLoading" class="btn btn-primary mt-3">
                <i class="fas fa-sync-alt me-2"></i>Retry
              </button>
            </div>

            <div v-else-if="applications.length === 0" class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">No applications found</h5>
              <p class="text-muted">
                Start applying for jobs to see them here!
              </p>
            </div>

            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="application in applications"
                    :key="application.id"
                    @click="
                      (jobId) => {
                        goToJobDetails(application.job.id);
                      }
                    "
                  >
                    <td>
                      <h6 class="mb-0">{{ application.jobTitle }}</h6>
                      <small class="text-muted">{{
                        application.job?.type || "Unknown Type"
                      }}</small>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          v-if="application.job?.employer?.logo_url"
                          :src="
                            getCompanyLogo(application.job.employer.logo_url)
                          "
                          :alt="application.companyName"
                          class="company-logo me-2"
                          @error="handleImageError"
                        />
                        <div>
                          <span>{{ application.companyName }}</span>
                          <br />
                          <small class="text-muted">{{
                            application.job?.location || "Location Unknown"
                          }}</small>
                        </div>
                      </div>
                    </td>
                    <td>{{ formatDate(application.created_at) }}</td>
                    <td>
                      <span
                        :class="['badge', getStatusClass(application.status)]"
                      >
                        <i
                          :class="getStatusIcon(application.status)"
                          class="me-1"
                        ></i>
                        {{ application.status || "Unknown" }}
                      </span>
                    </td>
                    <td>
                      <button
                        v-if="application.status === 'pending'"
                        @click.stop="handleCancelApplication(application.id)"
                        class="btn btn-sm btn-outline-danger"
                      >
                        Cancel
                      </button>
                      <button
                        v-if="application.status === 'withdrawn'"
                        @click.stop="handleReapply(application.id)"
                        class="btn btn-sm btn-outline-success"
                      >
                        Reapply
                      </button>
                      <button
                        @click="goToJobDetails(application.job.id)"
                        class="btn btn-sm btn-outline-primary"
                      >
                        View Job Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Find More Jobs -->
        <div class="card border-0 bg-primary text-white">
          <div class="card-body text-center py-5">
            <h2 class="card-title mb-4">
              Ready to find your next opportunity?
            </h2>
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
import { useJobSeekerStore } from "@/stores/jobSeeker";
import { useAuthStore } from "@/stores/auth";
import { useProfileStore } from "@/stores/profile";

export default {
  name: "JobSeekerDashboard",

  data() {
    return {
      jobSeekerStore: useJobSeekerStore(),
      authStore: useAuthStore(),
      profileStore: useProfileStore(),
      searchTerm: "",
      statusFilter: "all",
      user: null,
      isCancelling: null,
    };
  },

  computed: {
    applications() {
      return this.jobSeekerStore.filteredApplications;
    },
    stats() {
      return this.jobSeekerStore.applicationStats;
    },
    isLoading() {
      return this.jobSeekerStore.isLoading;
    },
    error() {
      return this.jobSeekerStore.error;
    },
    pendingApplications() {
      return (
        this.applications?.filter(
          (app) => app.status?.toLowerCase() === "pending"
        ) || []
      );
    },
    approvedApplications() {
      return (
        this.applications?.filter(
          (app) => app.status?.toLowerCase() === "approved"
        ) || []
      );
    },
    recentApplications() {
      if (!this.applications?.length) return [];
      return [...this.applications]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    },
  },

  methods: {
    handleSearch(value) {
      this.jobSeekerStore.setFilter("search", value);
    },

    handleStatusFilter(status) {
      this.jobSeekerStore.setFilter("status", status);
    },

    handleImageError(event) {
      event.target.src = "/images/default-company-logo.png";
      event.target.classList.add("default-logo");
    },

    formatDate(date) {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    getInitials(firstName, lastName) {
      return `${firstName?.charAt(0) || ""}${
        lastName?.charAt(0) || ""
      }`.toUpperCase();
    },

    async handleLogout() {
      try {
        await this.authStore.logout();
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        this.$router.push("/login");
      }
    },

    getStatusClass(status) {
      return {
        "bg-warning": status === "pending",
        "bg-success": status === "accepted",
        "bg-danger": status === "rejected",
        "bg-secondary": status === "withdrawn",
        "bg-light text-dark": !status,
      };
    },

    getStatusIcon(status) {
      switch (status?.toLowerCase()) {
        case "pending":
          return "fas fa-clock";
        case "accepted":
          return "fas fa-check";
        case "rejected":
          return "fas fa-times";
        case "withdrawn":
          return "fas fa-undo";
        default:
          return "fas fa-question";
      }
    },

    async retryLoading() {
      this.error = null;
      await this.jobSeekerStore.loadApplications();
    },

    getCompanyLogo(logoUrl) {
      return logoUrl || "/images/dashboard-default.svg";
    },

    async handleCancelApplication(applicationId) {
      if (confirm("Are you sure you want to cancel this application?")) {
        this.isCancelling = applicationId;
        try {
          const success = await this.profileStore.cancelApplication(
            applicationId
          );
          if (success) {
            await this.jobSeekerStore.loadApplications();
            alert("Application cancelled successfully");
          }
        } catch (error) {
          console.error("Failed to cancel application:", error);
          alert("Failed to cancel application. Please try again.");
        } finally {
          this.isCancelling = null;
        }
      }
    },

    async handleReapply(applicationId) {
      if (confirm("Are you sure you want to reapply for this job?")) {
        try {
          await this.authStore.reapplyForJob(applicationId);
          await this.jobSeekerStore.loadApplications();
          alert("Successfully reapplied for the job");
        } catch (error) {
          console.error("Failed to reapply:", error);
          alert("Failed to reapply for the job. Please try again.");
        }
      }
    },

    goToJobDetails(jobId) {
      if (jobId) {
        this.$router.push({ name: "JobDetails", params: { id: jobId } });
      } else {
        console.error("Job ID is missing");
      }
    },
  },

  async created() {
    try {
      if (!this.authStore.isAuthenticated) {
        this.$router.push({
          name: "Login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }
      this.user = this.authStore.user;
      await this.jobSeekerStore.loadApplications();
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    }
  },
};
</script>

<style scoped>
.company-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.default-logo {
  background-color: #f8f9fa;
  padding: 5px;
}

.avatar-sm {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-title {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}

.table td {
  vertical-align: middle;
}

.table small {
  font-size: 0.85em;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.applications {
  background-color: #4e73df;
}

.stat-icon.pending {
  background-color: #f6c23e;
}

.stat-icon.approved {
  background-color: #1cc88a;
}

.dropdown-menu {
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-weight: 400;
  color: #3a3b45;
}

.dropdown-item:hover {
  background-color: #f8f9fc;
  color: #2e2f37;
}

@media (max-width: 768px) {
  .company-logo{
    display: none;
  }
}
</style>
