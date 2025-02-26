<template>
  <div class="dashboard-container">
    <!-- Simple Alert for success/error messages -->
    <div
      v-if="showAlert"
      class="alert alert-{{ alertType }} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3"
      role="alert"
    >
      {{ alertMessage }}
      <button
        type="button"
        class="btn-close"
        @click="showAlert = false"
        aria-label="Close"
      ></button>
    </div>

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
        </div>
      </div>
    </nav>

    <div class="container py-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
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
                    <h6 class="card-subtitle text-muted mb-1">Total Jobs</h6>
                    <h2 class="card-title mb-0">{{ jobStats.totalJobs }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card stat-card h-100 border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="stat-icon active">
                    <i class="fas fa-check-circle"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">Active Jobs</h6>
                    <h2 class="card-title mb-0">{{ jobStats.activeJobs }}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-3">
            <div class="card stat-card h-100 border-0">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="stat-icon applications">
                    <i class="fas fa-users"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Total Applications
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ jobStats.totalApplications }}
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
                  <div class="stat-icon pending">
                    <i class="fas fa-clock"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Pending Applications
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ jobStats.pendingApplications }}
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
                  <div class="stat-icon accepted">
                    <i class="fas fa-check"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Accepted Applications
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ jobStats.acceptedApplications }}
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
                  <div class="stat-icon rejected">
                    <i class="fas fa-times"></i>
                  </div>
                  <div class="ms-3">
                    <h6 class="card-subtitle text-muted mb-1">
                      Rejected Applications
                    </h6>
                    <h2 class="card-title mb-0">
                      {{ jobStats.rejectedApplications }}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Posted Jobs -->
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom-0 py-3">
            <h5 class="card-title mb-0">Posted Jobs</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Posted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="job in paginatedJobs" :key="job.id">
                    <td>{{ job.title }}</td>
                    <td>{{ job.location }}</td>
                    <td>{{ job.type }}</td>
                    <td>
                      <div class="d-flex flex-column">
                        <span class="fw-bold text-primary">
                          Total Applications:
                          {{ job.applications_count?.total || 0 }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        :class="[
                          'badge',
                          job.is_active ? 'bg-success' : 'bg-secondary',
                        ]"
                      >
                        {{ job.is_active ? "Active" : "Inactive" }}
                      </span>
                    </td>
                    <td class="text-nowrap">
                      {{ formatDate(job.created_at) }}
                    </td>
                    <td>
                      <div class="btn-group">
                        <button
                          class="btn btn-sm btn-outline-info"
                          @click="viewApplications(job.id)"
                          data-title="View Applications"
                        >
                          <i class="fas fa-list-ul"></i>
                        </button>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="viewJobDetails(job)"
                          data-title="View Details"
                        >
                          <i class="fas fa-eye"></i>
                        </button>
                        <button
                          class="btn btn-sm"
                          :class="[
                            job.is_active
                              ? 'btn-outline-secondary'
                              : 'btn-outline-success',
                            { disabled: loadingStates[job.id] },
                          ]"
                          @click="toggleJobStatus(job.id)"
                          :data-title="
                            job.is_active ? 'Deactivate Job' : 'Activate Job'
                          "
                        >
                          <template v-if="loadingStates[job.id]">
                            <span
                              class="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          </template>
                          <i
                            v-else
                            :class="[
                              'fas',
                              job.is_active ? 'fa-toggle-off' : 'fa-toggle-on',
                            ]"
                          ></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="employerJobs.length === 0">
                    <td colspan="7" class="text-center py-4">
                      <p class="text-muted mb-0">No jobs posted yet</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- Pagination Controls -->
              <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center">
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === 1 }"
                  >
                    <a
                      class="page-link"
                      @click="changePage(currentPage - 1)"
                      tabindex="-1"
                      style="cursor: pointer"
                      >Previous</a
                    >
                  </li>
                  <li
                    class="page-item"
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: page === currentPage }"
                  >
                    <a
                      class="page-link"
                      @click="changePage(page)"
                      style="cursor: pointer"
                      >{{ page }}</a
                    >
                  </li>
                  <li
                    class="page-item"
                    :class="{ disabled: currentPage === totalPages }"
                  >
                    <a
                      class="page-link"
                      @click="changePage(currentPage + 1)"
                      style="cursor: pointer"
                      >Next</a
                    >
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Job Modal -->
    <Teleport to="body">
      <div
        v-if="showPostJobModal"
        class="modal fade show"
        style="display: block; z-index: 10050"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content job-post-modal">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">
                <i class="bi bi-plus-circle me-2"></i>
                Post New Job
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="closePostJobModal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handlePostJob" class="job-post-form">
                <div class="row">
                  <!-- Job Title -->
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Job Title*</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="jobForm.title"
                      required
                      placeholder="Enter job title"
                    />
                  </div>

                  <!-- Job Description -->
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Job Description*</label>
                    <textarea
                      class="form-control"
                      v-model="jobForm.description"
                      rows="4"
                      required
                      placeholder="Describe the job responsibilities and expectations"
                    ></textarea>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="form-label">Education Level*</label>
                    <select
                      class="form-select"
                      v-model="jobForm.educationLevel"
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="Secondary School">Secondary School</option>
                      <option value="OND">OND</option>
                      <option value="HND">HND</option>
                      <option value="Bachelor's Degree">
                        Bachelor's Degree
                      </option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Professional Certification">
                        Professional Certification
                      </option>
                      <option value="Not Required">Not Required</option>
                    </select>
                  </div>
                  <!-- Location and Job Type -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Location*</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="jobForm.location"
                      required
                      placeholder="City, State"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Job Type*</label>
                    <select class="form-select" v-model="jobForm.type" required>
                      <option value="">Select Job Type</option>
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>

                  <!-- Experience Level and Category -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Experience Level*</label>
                    <select
                      class="form-select"
                      v-model="jobForm.experienceLevel"
                      required
                    >
                      <option value="">Select Experience Level</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Job Category*</label>
                    <select
                      class="form-select"
                      v-model="jobForm.category"
                      required
                    >
                      <option value="" disabled selected>
                        Select a category
                      </option>
                      <option
                        v-for="category in jobCategories"
                        :key="category"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                  </div>

                  <!-- Salary Range -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Minimum Salary (₦)*</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="jobForm.salaryMin"
                      required
                      min="0"
                      placeholder="Minimum salary"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Maximum Salary (₦)*</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model="jobForm.salaryMax"
                      required
                      min="0"
                      placeholder="Maximum salary"
                    />
                  </div>

                  <!-- Skills and Benefits -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Required Skills*</label>
                    <textarea
                      class="form-control"
                      v-model="jobForm.skills"
                      rows="2"
                      required
                      placeholder="Enter skills separated by commas"
                    ></textarea>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Benefits</label>
                    <textarea
                      class="form-control"
                      v-model="jobForm.benefits"
                      rows="2"
                      placeholder="List job benefits separated by commas"
                    ></textarea>
                  </div>

                  <!-- Deadline -->
                  <div class="col-md-12 mb-3">
                    <label class="form-label">Application Deadline*</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="jobForm.deadline"
                      :min="today"
                      required
                    />
                  </div>

                  <div class="col-12">
                    <div class="form-check">
                      <input
                        v-model="jobForm.featured"
                        type="checkbox"
                        class="form-check-input"
                        id="featuredJob"
                      />
                      <label class="form-check-label" for="featuredJob">
                        Feature this job posting
                        <span class="badge bg-warning text-dark ms-2"
                          >Premium</span
                        >
                      </label>
                      <div class="text-muted small mt-1">
                        Featured jobs appear prominently on the homepage and
                        receive higher visibility
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="closePostJobModal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isSubmitting"
                  >
                    {{ isSubmitting ? "Posting..." : "Post Job" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showPostJobModal"
        class="modal-backdrop fade show"
        style="z-index: 1040"
      ></div>
    </Teleport>

    <Teleport to="body">
      <SuccessModal
        v-if="showSuccessModal"
        :message="`Job posted successfully: ${successJobTitle}`"
        @close="handleSuccessModalClose"
      />
    </Teleport>

    <JobDetailsModal
      v-if="selectedJob"
      :show="showJobDetailsModal"
      :job="selectedJob"
      @close="closeJobDetailsModal"
    />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";
import { useEmployerStore } from "@/stores/employer";
import SuccessModal from "@/components/SuccessModal.vue";
import JobDetailsModal from "@/components/JobDetailsModal.vue";

export default {
  name: "EmployerDashboard",

  components: {
    SuccessModal,
    JobDetailsModal,
  },

  data() {
    return {
      educationLevels: [
        "Secondary School",
        "OND",
        "HND",
        "Bachelor's Degree",
        "Master's Degree",
        "PhD",
        "Professional Certification",
        "Not Required",
      ],
      jobTypes: ["full-time", "part-time", "contract"],
      jobCategories: [
        "Technology",
        "Healthcare",
        "Education",
        "Finance",
        "Sales",
        "Marketing",
        "Engineering",
        "Customer Service",
        "Administration",
        "Human Resources",
        "Manufacturing",
        "Retail",
        "Construction",
        "Hospitality",
        "Media",
        "Legal",
        "Transportation",
        "Others",
      ],
      jobForm: {
        title: "",
        description: "",
        location: "",
        type: "",
        experienceLevel: "",
        salaryMin: null,
        salaryMax: null,
        skills: "",
        benefits: "",
        deadline: "",
        category: "",
        educationLevel: "",
        featured: false,
      },
      showPostJobModal: false,
      isSubmitting: false,
      expandedJobId: null,
      authStore: null,
      jobsStore: null,
      employerStore: null,
      showSuccessModal: false,
      successJobTitle: "",
      isJobCreationLoading: false,
      isLoading: true,
      jobs: [],
      jobStats: {
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
      },
      defaultJob: {
        applications_count: {
          total: 0,
        },
      },
      showJobDetailsModal: false,
      selectedJob: null,
      currentPage: 1,
      itemsPerPage: 10,
      loadingStates: {},
      showAlert: false,
      alertMessage: "",
      alertType: "",
    };
  },

  computed: {
    employerJobs() {
      return this.jobs.map((job) => ({
        ...job,
        applications_count: {
          total: job.applications_count?.total || 0,
          pending: job.applications_count?.pending || 0,
          accepted: job.applications_count?.accepted || 0,
          rejected: job.applications_count?.rejected || 0,
        },
      }));
    },

    paginatedJobs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.employerJobs.slice(start, start + this.itemsPerPage);
    },

    totalPages() {
      return Math.ceil(this.employerJobs.length / this.itemsPerPage);
    },

    jobStats() {
      return this.jobsStore ? this.jobsStore.getJobStats : {};
    },

    filterOptions() {
      return this.jobsStore
        ? {
            ...this.jobsStore.getFilterOptions,
            educationLevels: this.educationLevels,
            jobTypes: this.jobTypes,
          }
        : {};
    },

    normalizeJobType() {
      return (type) => {
        const lowercaseType = type.toLowerCase().replace(/\s+/g, "-");
        return (
          this.jobTypes.find((validType) => validType === lowercaseType) ||
          "full-time"
        );
      };
    },

    formatDate() {
      return (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };
    },

    today() {
      return new Date().toISOString().split("T")[0];
    },
  },

  methods: {
    async loadDashboardData() {
      try {
        this.isLoading = true;

        // Initialize stores
        this.authStore = useAuthStore();
        this.jobsStore = useJobsStore();
        this.employerStore = useEmployerStore();

        // Fetch data in parallel
        await Promise.all([this.loadJobs(), this.loadStats()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    closePostJobModal() {
      this.showPostJobModal = false;
      this.resetJobForm();
    },

    resetJobForm() {
      this.jobForm = {
        title: "",
        description: "",
        location: "",
        type: "full-time",
        experienceLevel: "",
        salaryMin: null,
        salaryMax: null,
        skills: "",
        benefits: "",
        deadline: "",
        category: "",
        educationLevel: "",
        featured: false,
      };
    },

    async handlePostJob() {
      try {
        this.isSubmitting = true;

        const formData = {
          title: this.jobForm.title,
          description: this.jobForm.description,
          location: this.jobForm.location,
          type: this.normalizeJobType(this.jobForm.type),
          experience_level: this.jobForm.experienceLevel,
          salary: {
            min: this.jobForm.salaryMin
              ? parseInt(this.jobForm.salaryMin)
              : null,
            max: this.jobForm.salaryMax
              ? parseInt(this.jobForm.salaryMax)
              : null,
          },
          requirements: this.jobForm.skills
            ? this.jobForm.skills.split(",").map((skill) => skill.trim())
            : [],
          responsibilities: this.jobForm.benefits
            ? this.jobForm.benefits.split(",").map((benefit) => benefit.trim())
            : [],
          deadline: this.jobForm.deadline,
          category: this.jobForm.category,
          education_level: this.jobForm.educationLevel,
          featured: this.jobForm.featured,
        };

        this.isJobCreationLoading = true;

        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (this.jobsStore) {
          await this.jobsStore.createJob(formData);

          this.closePostJobModal();

          this.successJobTitle = formData.title;
          this.showSuccessModal = true;

          await this.loadDashboardData();
        }
      } catch (error) {
        console.error("Error posting job:", error);

        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          const errors = error.response.data.errors;
          let errorMessage = "Please correct the following errors:\n";
          Object.keys(errors).forEach((key) => {
            errorMessage += `- ${key}: ${errors[key].join(", ")}\n`;
          });
          alert(errorMessage);
        } else {
          alert("Failed to create job. Please try again.");
        }
      } finally {
        this.isJobCreationLoading = false;
        this.isSubmitting = false;
      }
    },

    openPostJobModal() {
      this.showPostJobModal = true;
    },

    async toggleJobStatus(jobId) {
      console.log("Toggling job status for job ID:", jobId);
      try {
        const job = this.jobs.find((j) => j.id === jobId);
        if (!job) {
          console.log("Job not found");
          return;
        }

        const newStatus = !job.is_active;
        const action = newStatus ? "activate" : "deactivate";

        // Show confirmation dialog
        if (!confirm(`Are you sure you want to ${action} this job?`)) {
          console.log("Action cancelled by user");
          return;
        }

        // Update loading state
        this.loadingStates[jobId] = true;

        const response = await this.jobsStore.toggleJobStatus(jobId);
        console.log("Response from toggleJobStatus:", response);

        if (response?.data?.data) {
          // Update the local job status
          const jobIndex = this.jobs.findIndex((j) => j.id === jobId);
          if (jobIndex !== -1) {
            this.jobs[jobIndex] = {
              ...this.jobs[jobIndex],
              is_active: response.data.data.is_active,
              applications_count: response.data.data.applications_count,
            };
          }

          // Show success message
          const statusText = response.data.data.is_active
            ? "activated"
            : "deactivated";
          alert(`Job has been successfully ${statusText}`);
          console.log(
            "Alert message set:",
            `Job has been successfully ${statusText}`
          );
        }

        // Refresh job stats
        await this.loadStats();
      } catch (error) {
        console.error("Error toggling job status:", error);
        // Show error message
        alert(error.response?.data?.message || "Failed to update job status");
      } finally {
        this.loadingStates[jobId] = false;
      }
    },

    handleSuccessModalClose() {
      this.showSuccessModal = false;
      this.successJobTitle = "";
    },

    viewJobDetails(job) {
      this.selectedJob = job;
      this.showJobDetailsModal = true;
    },

    closeJobDetailsModal() {
      this.showJobDetailsModal = false;
      this.selectedJob = null;
    },

    async loadJobs() {
      try {
        const response = await this.employerStore.getJobs();
        if (response?.data) {
          // Ensure each job has the required properties
          this.jobs = response.data.map((job) => ({
            ...job,
            applications_count: job.applications_count || {
              total: 0,
              pending: 0,
              accepted: 0,
              rejected: 0,
            },
          }));
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
        this.jobs = [];
      }
    },

    async loadStats() {
      try {
        await this.jobsStore.fetchJobStats();
      } catch (error) {
        console.error("Error loading job stats:", error);
      }
    },

    viewApplications(jobId) {
      this.$router.push({
        name: "JobApplications",
        params: { jobId: jobId },
      });
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      window.scrollTo(0, 0); // Scroll to top
    },
  },

  async created() {
    await this.loadDashboardData();
  },
};
</script>

<style scoped>
.dashboard-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  position: relative;
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

.stat-icon.active {
  background-color: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.stat-icon.applications {
  background-color: rgba(111, 66, 193, 0.1);
  color: #6f42c1;
}

.stat-icon.pending {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.stat-icon.accepted {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.stat-icon.rejected {
  background-color: #fecaca;
  color: #dc2626;
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

.table td {
  vertical-align: middle;
}

.applications-count {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25em 0.5em;
}

.btn-group {
  gap: 0.25rem;
}

.btn-group .btn {
  border-radius: 0.25rem !important;
  padding: 0.375rem 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-group .btn i {
  font-size: 0.875rem;
}

/* Custom tooltip styles */
.btn {
  position: relative;
}

[data-title] {
  position: relative;
  cursor: pointer;
}

[data-title]:hover::after {
  content: attr(data-title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.5rem;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  white-space: nowrap;
  z-index: 1000;
  margin-bottom: 5px;
}

[data-title]:hover::before {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
  margin-bottom: -5px;
}

.btn-group {
  gap: 0.25rem;
}

.btn-group .btn {
  border-radius: 0.25rem !important;
  padding: 0.375rem 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-group .btn i {
  font-size: 0.875rem;
}

/* Add these new styles */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Optional: Add a subtle animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-overlay {
  animation: fadeIn 0.3s ease-in-out;
}

/* Style loading text */
.loading-content p {
  font-size: 1rem;
  margin-top: 1rem;
  color: #6c757d;
}

.alert {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  width: 400px;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style>
