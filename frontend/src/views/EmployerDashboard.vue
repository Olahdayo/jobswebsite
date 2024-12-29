<template>
  <div class="dashboard-container">
    <!-- Dashboard Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container-fluid px-4">
        <h1 class="navbar-brand mb-0 h1 fw-bold">Employer Dashboard</h1>
        <div class="d-flex align-items-center gap-3">
          <button
            @click="openPostJobModal"
            class="btn btn-primary d-flex align-items-center"
          >
            <i class="fas fa-plus-circle me-2"></i>
            Post New Job
          </button>
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
      <!-- Stats Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card stat-card h-100 border-0">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon jobs">
                  <i class="fas fa-briefcase"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle text-muted mb-1">Active Jobs</h6>
                  <h2 class="card-title mb-0">{{ activeJobs.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card h-100 border-0">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon applicants">
                  <i class="fas fa-users"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle text-muted mb-1">
                    Total Applicants
                  </h6>
                  <h2 class="card-title mb-0">{{ totalApplications }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card h-100 border-0">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon pending">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle text-muted mb-1">Pending Review</h6>
                  <h2 class="card-title mb-0">
                    {{ pendingApplications.length }}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
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

        <div class="col-md-3">
          <div class="card stat-card h-100 border-0">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon closed">
                  <i class="fas fa-door-closed"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle text-muted mb-1">Closed Jobs</h6>
                  <h2 class="card-title mb-0">{{ closedJobs.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card stat-card h-100 border-0">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon featured">
                  <i class="fas fa-star"></i>
                </div>
                <div class="ms-3">
                  <h6 class="card-subtitle text-muted mb-1">Featured Jobs</h6>
                  <h2 class="card-title mb-0">{{ featuredJobs.length }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Applications Chart -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white border-bottom-0 py-3">
          <h5 class="card-title mb-0">Application Trends</h5>
        </div>
        <div class="card-body">
          <canvas ref="chartCanvas" height="300"></canvas>
        </div>
      </div>

      <!-- Posted Jobs & Applications -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white border-bottom-0 py-3">
          <h5 class="card-title mb-0">Posted Jobs & Applications</h5>
        </div>
        <div class="card-body">
          <!-- Jobs List -->
          <div class="row g-4">
            <div v-for="job in postedJobs" :key="job.id" class="col-12">
              <div class="card border">
                <!-- Job Header -->
                <div
                  class="card-header bg-light py-3 cursor-pointer"
                  @click="toggleJobDetails(job.id)"
                  :class="{
                    'border-bottom-0': !expandedJobs.includes(job.id),
                    closed: job.status === 'closed',
                  }"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5 class="card-title mb-1">{{ job.title }}</h5>
                      <div class="text-muted small">
                        <span class="me-3">
                          <i class="fas fa-calendar-alt me-1"></i>
                          Posted {{ formatDate(job.postedDate) }}
                        </span>
                        <span class="me-3">
                          <i class="fas fa-map-marker-alt me-1"></i>
                          {{ job.location }}
                        </span>
                        <span class="me-3">
                          <i class="fas fa-briefcase me-1"></i>
                          {{ job.type }}
                        </span>
                        <span>
                          <i class="fas fa-users me-1"></i>
                          {{ getJobApplications(job.id).length }} applicant(s)
                        </span>
                      </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span
                        class="badge rounded-pill"
                        :class="
                          job.status === 'active'
                            ? 'bg-success'
                            : 'bg-secondary'
                        "
                      >
                        {{ job.status }}
                      </span>
                      <span
                        v-if="job.featured"
                        class="badge bg-warning text-dark me-2"
                        title="Featured Job"
                      >
                        <i class="fas fa-star me-1"></i>
                        Featured
                      </span>
                      <button
                        @click.stop="toggleJobStatus(job)"
                        class="btn btn-sm"
                        :class="
                          job.status === 'active'
                            ? 'btn-outline-danger'
                            : 'btn-outline-success'
                        "
                      >
                        <i
                          :class="
                            job.status === 'active'
                              ? 'fas fa-times-circle me-1'
                              : 'fas fa-check-circle me-1'
                          "
                        ></i>
                        {{
                          job.status === "active" ? "Close Job" : "Reopen Job"
                        }}
                      </button>
                      <i
                        class="fas fa-chevron-down transition-transform"
                        :class="{ 'rotate-180': expandedJobs.includes(job.id) }"
                      ></i>
                    </div>
                  </div>
                </div>

                <!-- Applicants Table (Collapsible) -->
                <div
                  v-show="expandedJobs.includes(job.id)"
                  class="collapse-transition"
                >
                  <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                          <tr>
                            <th class="ps-4">Applicant</th>
                            <th>Email</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th class="text-end pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="application in getJobApplications(job.id)"
                            :key="application.userId"
                          >
                            <td class="ps-4">
                              <div class="d-flex align-items-center">
                                <div class="avatar-placeholder me-3">
                                  {{ getApplicantInitials(application.userId) }}
                                </div>
                                <div>
                                  <div class="fw-medium">
                                    {{ getApplicantName(application.userId) }}
                                  </div>
                                  <div class="text-muted small">
                                    {{
                                      getApplicantEducation(application.userId)
                                    }}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{{ getApplicantEmail(application.userId) }}</td>
                            <td>{{ formatDate(application.appliedDate) }}</td>
                            <td>
                              <span
                                class="badge"
                                :class="{
                                  'bg-warning text-dark':
                                    application.status === 'pending',
                                  'bg-success':
                                    application.status === 'approved',
                                  'bg-danger':
                                    application.status === 'rejected',
                                }"
                              >
                                {{ application.status }}
                              </span>
                            </td>
                            <td class="text-end pe-4">
                              <div class="btn-group">
                                <button
                                  @click="
                                    updateApplicationStatus(
                                      application,
                                      'approved'
                                    )
                                  "
                                  class="btn btn-sm btn-outline-success"
                                  :disabled="application.status === 'approved'"
                                >
                                  <i class="fas fa-check me-1"></i>
                                  Approve
                                </button>
                                <button
                                  @click="
                                    updateApplicationStatus(
                                      application,
                                      'rejected'
                                    )
                                  "
                                  class="btn btn-sm btn-outline-danger"
                                  :disabled="application.status === 'rejected'"
                                >
                                  <i class="fas fa-times me-1"></i>
                                  Reject
                                </button>
                                <button
                                  @click="
                                    viewApplicantDetails(application.userId)
                                  "
                                  class="btn btn-sm btn-outline-primary"
                                >
                                  <i class="fas fa-eye me-1"></i>
                                  View Details
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr v-if="getJobApplications(job.id).length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">
                              No applications received yet
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
        </div>
      </div>
    </div>

    <!-- Post Job Modal -->
    <Teleport to="body">
      <PostJobModal
        v-if="showPostJobModal"
        @close="closePostJobModal"
        @submit="handlePostJob"
      />
    </Teleport>

    <SuccessModal
      v-if="showSuccessModal"
      :message="successMessage"
      @close="handleSuccessModalClose"
    />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";
import PostJobModal from "@/components/PostJobModal.vue";
import Chart from "chart.js/auto";
import SuccessModal from "@/components/SuccessModal.vue";

export default {
  name: "EmployerDashboard",
  components: {
    PostJobModal,
    SuccessModal,
  },

  data() {
    return {
      chart: null,
      showPostJobModal: false,
      applications: [],
      totalApplications: 0,
      pendingApplications: [],
      approvedApplications: [],
      authStore: null,
      jobsStore: null,
      isSubmitting: false,
      expandedJobs: [],
      showSuccessModal: false,
      successMessage: "",
    };
  },

  created() {
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();

    // Check if user is logged in
    if (!this.authStore.user) {
      this.$router.push("/login");
      return;
    }

    this.jobsStore.initializeJobs();
    this.loadData();
  },

  computed: {
    postedJobs() {
      if (!this.authStore?.user) return [];
      return this.jobsStore.jobs.filter(
        (job) => job.company === this.authStore.user.companyName
      );
    },

    activeJobs() {
      return this.postedJobs.filter((job) => job.status === "active");
    },

    closedJobs() {
      return this.postedJobs.filter((job) => job.status === "closed");
    },

    featuredJobs() {
      return this.postedJobs.filter((job) => job.featured);
    },
  },

  mounted() {
  this.loadData();
  setTimeout(() => {
    this.initializeChart();
  }, 500);
},

  methods: {
    initializeChart() {
  try {
    if (!this.applications?.length) {
      console.warn('No applications data available');
      return;
    }

    const canvas = this.$refs.chartCanvas;
    if (!canvas) {
      console.warn('Chart canvas not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.warn('Could not get 2D context from canvas');
      return;
    }

    const dates = [
      ...new Set(
        this.applications.map((app) =>
          new Date(app.appliedDate).toLocaleDateString()
        )
      ),
    ].sort((a, b) => new Date(a) - new Date(b));

    const applicationCounts = dates.map(
      (date) =>
        this.applications.filter(
          (app) => new Date(app.appliedDate).toLocaleDateString() === date
        ).length
    );

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Applications",
            data: applicationCounts,
            borderColor: "#0d6efd",
            backgroundColor: "rgba(13, 110, 253, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#0d6efd",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `${context.parsed.y} applications`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 12,
              },
              callback: function (value) {
                if (value % 1 === 0) {
                  return value;
                }
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        animation: {
          duration: 1000,
          easing: "easeInOutQuart",
        },
      },
    });
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
},
    

    getJobApplications(jobId) {
      return this.applications.filter((app) => app.jobId === jobId);
    },

    getApplicantName(userId) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.id === userId);
      return user ? user.name : "Unknown Applicant";
    },

    updateApplicationStatus(application, newStatus) {
      const applications = JSON.parse(
        localStorage.getItem("jobApplications") || "[]"
      );
      const index = applications.findIndex(
        (app) =>
          app.jobId === application.jobId && app.userId === application.userId
      );

      if (index !== -1) {
        applications[index].status = newStatus;
        localStorage.setItem("jobApplications", JSON.stringify(applications));
        location.reload();
      }
    },

    async toggleJobStatus(job) {
      try {
        const newStatus = job.status === "active" ? "closed" : "active";

        // Update job status in localStorage
        const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        const jobIndex = jobs.findIndex((j) => j.id === job.id);
        if (jobIndex !== -1) {
          jobs[jobIndex].status = newStatus;
          localStorage.setItem("jobs", JSON.stringify(jobs));
        }

        // Update job status in store
        const storeJobIndex = this.jobsStore.jobs.findIndex(
          (j) => j.id === job.id
        );
        if (storeJobIndex !== -1) {
          this.jobsStore.jobs[storeJobIndex].status = newStatus;
        }

        // Show success message
        alert(
          `Job ${newStatus === "active" ? "reopened" : "closed"} successfully!`
        );
      } catch (error) {
        console.error("Error updating job status:", error);
        alert("Failed to update job status. Please try again.");
      }
    },

    openPostJobModal() {
      this.showPostJobModal = true;
    },

    closePostJobModal() {
      this.showPostJobModal = false;
    },

    async handlePostJob(jobData) {
      if (this.isSubmitting) return;

      try {
        this.isSubmitting = true;
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const newJobData = {
          id: Date.now(),
          ...jobData,
          company: this.authStore.user.companyName,
          companyLogo: "",
          postedDate: new Date().toISOString(),
          status: "active",
          featured: jobData.featured || false,
        };

        // Add job through store
        await this.jobsStore.addJob(newJobData);

        // Close post job modal
        this.closePostJobModal();

        // Wait for post modal to close before showing success modal
        setTimeout(() => {
          // Show success modal
          this.successMessage = "Job posted successfully!";
          this.showSuccessModal = true;

          // Refresh data
          this.loadData();
        }, 300);
      } catch (error) {
        console.error("Error posting job:", error);
        alert(error.message || "Failed to post job. Please try again.");
      } finally {
        this.isSubmitting = false;
      }
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

    loadData() {
      if (!this.authStore?.user) return;

      // Load jobs posted by the current employer
      const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
      const filteredJobs = allJobs.filter(
        (job) => job.company === this.authStore.user.companyName
      );

      // Load all applications
      const applications = JSON.parse(
        localStorage.getItem("jobApplications") || "[]"
      );

      this.applications = applications.filter((app) => {
        const job = filteredJobs.find((j) => j.id === app.jobId);
        return job !== undefined;
      });

      // Calculate total applications
      this.totalApplications = this.applications.length;

      // Filter applications by status
      this.pendingApplications = this.applications.filter(
        (app) => app.status === "pending"
      );
      this.approvedApplications = this.applications.filter(
        (app) => app.status === "approved"
      );

      // Initialize chart if needed
      if (this.$refs.chartCanvas) {
        this.initializeChart();
      }
    },

    getApplicantInitials(userId) {
      const name = this.getApplicantName(userId);
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    },

    getApplicantEmail(userId) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.id === userId);
      return user ? user.email : "N/A";
    },

    getApplicantEducation(userId) {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.id === userId);
      return user ? user.educationLevel : "N/A";
    },

    viewApplicantDetails(userId) {
      // Implement applicant details view
      alert("Applicant details view to be implemented");
    },

    toggleJobDetails(jobId) {
      const index = this.expandedJobs.indexOf(jobId);
      if (index === -1) {
        this.expandedJobs.push(jobId);
      } else {
        this.expandedJobs.splice(index, 1);
      }
    },

    async toggleFeatured(job) {
      try {
        // Update job featured status in localStorage
        const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
        const jobIndex = jobs.findIndex((j) => j.id === job.id);
        if (jobIndex !== -1) {
          jobs[jobIndex].featured = !jobs[jobIndex].featured;
          localStorage.setItem("jobs", JSON.stringify(jobs));
        }

        // Update job featured status in store
        const storeJobIndex = this.jobsStore.jobs.findIndex(
          (j) => j.id === job.id
        );
        if (storeJobIndex !== -1) {
          this.jobsStore.jobs[storeJobIndex].featured =
            !this.jobsStore.jobs[storeJobIndex].featured;
        }

        // Show success message
        alert(
          `Job ${job.featured ? "removed from" : "added to"} featured listings!`
        );
      } catch (error) {
        console.error("Error updating featured status:", error);
        alert("Failed to update featured status. Please try again.");
      }
    },

    handleSuccessModalClose() {
      // Use setTimeout to ensure proper cleanup
      setTimeout(() => {
        this.showSuccessModal = false;
        this.successMessage = "";

        // Ensure body is scrollable
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("padding-right");
        document.body.classList.remove("modal-open");
      }, 300);
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

.stat-icon.jobs {
  background-color: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}

.stat-icon.applicants {
  background-color: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
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

.accordion-item {
  background-color: transparent;
}

.accordion-button {
  background-color: white;
  padding: 1rem;
}

.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: inherit;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.125);
}

.table td {
  padding: 1rem;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.navbar {
  padding: 1rem 0;
}

.navbar-brand {
  font-size: 1.5rem;
  color: #2c3e50;
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

  .accordion-button {
    padding: 0.75rem;
  }
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #6c757d;
}

.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.btn-group .btn {
  display: inline-flex;
  align-items: center;
}

.card-header {
  background-color: #f8f9fa !important;
}

.badge {
  padding: 0.5em 1em;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.collapse-transition {
  transition: max-height 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.transition-transform {
  transition: transform 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.collapse-transition {
  transition: all 0.3s ease-in-out;
}

.card-header:hover {
  background-color: #f0f2f4 !important;
}

/* Prevent button clicks from triggering card expansion */
.btn {
  position: relative;
  z-index: 1;
}

.stat-icon.closed {
  background-color: rgba(108, 117, 125, 0.1);
  color: #6c757d;
}

/* Optional: Add a visual indicator for closed jobs in the list */
.card-header.closed {
  background-color: #f8f9fa !important;
  opacity: 0.8;
}

.card-header.closed .card-title {
  color: #6c757d;
}

.stat-icon.featured {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

/* Add a subtle star indicator for featured jobs */
.card-header.featured {
  position: relative;
}

.card-header.featured::before {
  content: "★";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #ffc107;
  font-size: 1.2rem;
}

/* Style for the featured checkbox */
.form-check-input:checked {
  background-color: #ffc107;
  border-color: #ffc107;
}
</style>