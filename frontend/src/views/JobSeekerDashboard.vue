<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">My Dashboard</h1>
        <div class="d-flex align-items-center">
          <!-- <div class="dropdown">
            <button
              class="btn btn-link text-dark d-flex align-items-center"
              type="button"
              @click="toggleDropdown"
            >
              <div class="avatar me-2">
                {{ getInitials(user?.first_name, user?.last_name) }}
              </div>
              <span class="me-2">{{ user?.email }}</span>
              <i
                class="fas fa-chevron-down ms-1"
                :class="{ 'rotate-180': isDropdownOpen }"
              ></i>
            </button>
            <ul
              class="dropdown-menu dropdown-menu-end"
              :class="{ show: isDropdownOpen }"
              @click="isDropdownOpen = false"
            >
              <li>
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-user me-2"></i>Profile
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button @click="handleLogout" class="dropdown-item text-danger">
                  <i class="fas fa-sign-out-alt me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div> -->
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
                    <h6 class="card-subtitle text-muted mb-1">
                      Applications Sent
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ applications?.length || 0 }}
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
                  <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Pending Reviews
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ pendingApplications?.length || 0 }}
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
                      {{ approvedApplications?.length || 0 }}
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
            <div v-if="applications?.length === 0" class="text-center py-5">
              <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
              <h5 class="text-muted">No applications yet</h5>
              <p class="mb-0">
                Start applying for jobs to see your applications here.
              </p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="application in recentApplications"
                    :key="application.id"
                  >
                    <td>
                      <h6 class="mb-0">
                        {{ application.job?.title || "Job Removed" }}
                      </h6>
                      <small class="text-muted">{{
                        application.job?.type
                      }}</small>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          :src="
                            getCompanyLogo(application.job?.employer?.logo_url)
                          "
                          class="company-logo me-2"
                          :alt="application.job?.employer?.company_name"
                          @error="handleImageError"
                        />
                        <div>
                          <span>{{
                            application.job?.employer?.company_name ||
                            "Company Removed"
                          }}</span>
                          <br />
                          <small class="text-muted">{{
                            application.job?.location
                          }}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="getStatusClass(application.status)"
                      >
                        {{ application.status || "Unknown" }}
                      </span>
                    </td>
                    <td>
                      <div>{{ formatDate(application.created_at) }}</div>
                      <small class="text-muted">
                        {{
                          application.job?.deadline
                            ? `Deadline: ${formatDate(
                                application.job.deadline
                              )}`
                            : ""
                        }}
                      </small>
                    </td>
                    <td>
                      <router-link
                        :to="`/jobs/${application.job?.id}`"
                        class="btn btn-sm btn-outline-primary"
                        v-if="application.job?.id"
                      >
                        View Job
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Find More Jobs CTA -->
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
import { authService } from "@/services/authService";
import { jobService } from "@/services/jobService";
// import { Dropdown } from "bootstrap";

export default {
  name: "JobSeekerDashboard",

  data() {
    return {
      user: authService.getCurrentUser(),
      applications: [],
      isLoading: true,
      error: null,
      // isDropdownOpen: false,
    };
  },

  computed: {
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

    async loadApplications() {
      try {
        this.isLoading = true;
        const response = await jobService.getUserApplications();

        // Check if response has data property
        if (response?.data?.data) {
          this.applications = response.data.data; // For paginated responses
        } else if (Array.isArray(response?.data)) {
          this.applications = response.data; // For direct array responses
        } else {
          this.applications = [];
          console.warn("Unexpected response format:", response);
        }

        // console.log("Loaded applications:", this.applications);
      } catch (error) {
        console.error("Error loading applications:", error);
        this.error = "Failed to load applications. Please try again later.";

        // More detailed error logging
        // if (error.response) {
        //   console.error("Error details:", {
        //     status: error.response.status,
        //     data: error.response.data,
        //     headers: error.response.headers,
        //   });
        // }
      } finally {
        this.isLoading = false;
      }
    },

    async handleLogout() {
      try {
        await authService.logout();
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        this.$router.push("/login");
      }
    },

    getStatusClass(status) {
      return {
        "bg-warning": status === "pending",
        "bg-success": status === "approved",
        "bg-danger": status === "rejected",
        "bg-secondary": !status,
      };
    },

    async retryLoading() {
      this.error = null;
      await this.loadApplications();
    },

    getCompanyLogo(logoUrl) {
      return logoUrl || "/images/dashboard-default.svg";
    },

    handleImageError(e) {
      e.target.src = "/images/dashboard-default.svg";
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
  },

  async created() {
    try {
      if (!authService.isAuthenticated()) {
        this.$router.push({
          name: "Login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }

      await this.loadApplications();
    } catch (error) {
      console.error("Error initializing dashboard:", error);
    } finally {
      this.isLoading = false;
    }
  },

  // mounted() {
  //   // Initialize all dropdowns
  //   const dropdownElementList = document.querySelectorAll(".dropdown-toggle");
  //   const dropdownList = [...dropdownElementList].map(
  //     (dropdownToggleEl) => new Dropdown(dropdownToggleEl)
  //   );

  //   // Close dropdown when clicking outside
  //   document.addEventListener("click", (e) => {
  //     const dropdown = this.$el.querySelector(".dropdown");
  //     if (!dropdown.contains(e.target)) {
  //       this.isDropdownOpen = false;
  //     }
  //   });
  // },

  // beforeUnmount() {
  //   // Clean up event listener
  //   document.removeEventListener("click", this.closeDropdown);
  // },
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

.company-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f8f9fa; /* Light background for empty images */
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

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #495057;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
}

.dropdown-item i {
  width: 20px;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.dropdown-menu {
  margin-top: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
</style>
