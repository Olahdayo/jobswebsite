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
          <!-- <button
            @click="handleLogout"
            class="btn btn-outline-danger d-flex align-items-center"
          >
            <i class="fas fa-sign-out-alt me-2"></i>
            Logout
          </button> -->
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
                  <h6 class="card-subtitle text-muted mb-1">Total Applications</h6>
                  <h2 class="card-title mb-0">{{ jobStats.totalApplications }}</h2>
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
                  <h6 class="card-subtitle text-muted mb-1">Pending Applications</h6>
                  <h2 class="card-title mb-0">{{ jobStats.pendingApplications }}</h2>
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
                  <h6 class="card-subtitle text-muted mb-1">Accepted Applications</h6>
                  <h2 class="card-title mb-0">{{ jobStats.acceptedApplications }}</h2>
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
                  <h6 class="card-subtitle text-muted mb-1">Rejected Applications</h6>
                  <h2 class="card-title mb-0">{{ jobStats.rejectedApplications }}</h2>
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
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Posted Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in employerJobs" :key="job.id">
                  <td>{{ job.title }}</td>
                  <td>{{ job.location }}</td>
                  <td>{{ job.type }}</td>
                  <td>{{ job.experience_level }}</td>
                  <td>
                    <span 
                      :class="[
                        'badge',
                        job.is_active ? 'bg-success' : 'bg-secondary'
                      ]"
                    >
                      {{ job.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-nowrap">{{ formatDate(job.created_at) }}</td>
                  <td>
                    <div class="btn-group">
                      <button 
                        class="btn btn-sm btn-outline-primary" 
                        @click="viewJob(job.id)"
                      >
                        View
                      </button>
                      <button 
                        class="btn btn-sm"
                        :class="[
                          job.is_active ? 'btn-outline-secondary' : 'btn-outline-success'
                        ]"
                        @click="toggleJobStatus(job.id)"
                      >
                        {{ job.is_active ? 'Deactivate' : 'Activate' }}
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
          </div>
        </div>
      </div>
    </div>

    <!-- Post Job Modal -->
    <Teleport to="body">
      <div v-if="showPostJobModal" class="modal fade show" style="display: block">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Post New Job</h5>
              <button
                type="button"
                class="btn-close"
                @click="closePostJobModal"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="handlePostJob">
                <!-- Job Title -->
                <div class="mb-3">
                  <label class="form-label">Job Title*</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="jobForm.title"
                    required
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <!-- Job Description -->
                <div class="mb-3">
                  <label class="form-label">Job Description*</label>
                  <textarea
                    class="form-control"
                    v-model="jobForm.description"
                    rows="4"
                    required
                    placeholder="Describe the role, responsibilities, and requirements"
                  ></textarea>
                </div>

                <!-- Job Category -->
                <div class="mb-3">
                  <label class="form-label">Job Category*</label>
                  <select class="form-select" v-model="jobForm.category" required>
                    <option value="">Select Category</option>
                    <option v-for="category in filterOptions.categories" 
                            :key="category" 
                            :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>

                <div class="row">
                  <!-- Job Type -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Job Type*</label>
                    <select v-model="jobForm.type" class="form-select" required>
                      <option value="" disabled>Select job type</option>
                      <option 
                        v-for="type in jobTypes" 
                        :key="type" 
                        :value="type"
                      >
                        {{ type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ') }}
                      </option>
                    </select>
                  </div>

                  <!-- Experience Level -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Experience Level*</label>
                    <select class="form-select" v-model="jobForm.experienceLevel" required>
                      <option value="">Select Experience Level</option>
                      <option v-for="level in filterOptions.experienceLevels" 
                              :key="level" 
                              :value="level">
                        {{ level }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <!-- Location -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Location*</label>
                    <select class="form-select" v-model="jobForm.location" required>
                      <option value="">Select Location</option>
                      <option v-for="location in filterOptions.locations" 
                              :key="location" 
                              :value="location">
                        {{ location }}
                      </option>
                    </select>
                  </div>

                  <!-- Education Level -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Education Level*</label>
                    <select class="form-select" v-model="jobForm.educationLevel" required>
                      <option value="">Select Education Level</option>
                      <option v-for="level in filterOptions.educationLevels" 
                              :key="level" 
                              :value="level">
                        {{ level }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <!-- Salary Range -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Salary Range (₦)*</label>
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        v-model="jobForm.salaryMin"
                        required
                        placeholder="Min"
                      />
                      <span class="input-group-text">to</span>
                      <input
                        type="number"
                        class="form-control"
                        v-model="jobForm.salaryMax"
                        required
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <!-- Application Deadline -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Application Deadline*</label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="jobForm.deadline"
                      required
                      :min="today"
                    />
                  </div>
                </div>

                <!-- Skills Required -->
                <div class="mb-3">
                  <label class="form-label">Required Skills*</label>
                  <textarea
                    class="form-control"
                    v-model="jobForm.skills"
                    rows="2"
                    required
                    placeholder="Enter skills separated by commas"
                  ></textarea>
                </div>

                <!-- Benefits -->
                <div class="mb-3">
                  <label class="form-label">Benefits</label>
                  <textarea
                    class="form-control"
                    v-model="jobForm.benefits"
                    rows="2"
                    placeholder="List job benefits separated by commas"
                  ></textarea>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" @click="closePostJobModal">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Posting...' : 'Post Job' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showPostJobModal" class="modal-backdrop fade show"></div>
    </Teleport>

    <Teleport to="body">
      <SuccessModal 
        v-if="showSuccessModal" 
        :message="`Job posted successfully: ${successJobTitle}`"
        @close="handleSuccessModalClose"
      />
    </Teleport>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useJobsStore } from '@/stores/jobs';
import SuccessModal from '@/components/SuccessModal.vue';

export default {
  name: 'EmployerDashboard',
  
  components: {
    SuccessModal
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
        "Not Required"
      ],
      jobTypes: [
        'full-time',
        'part-time', 
        'contract'
      ],
      jobForm: {
        title: '',
        description: '',
        location: '',
        type: '',
        experienceLevel: '',
        salaryMin: null,
        salaryMax: null,
        skills: '',
        benefits: '',
        deadline: '',
        category: '',
        educationLevel: ''
      },
      showPostJobModal: false,
      isSubmitting: false,
      expandedJobId: null,
      authStore: null,
      jobsStore: null,
      showSuccessModal: false,
      successJobTitle: '',
      isJobCreationLoading: false,
      isLoading: false
    };
  },

  computed: {
    employerJobs() {
      return this.jobsStore ? this.jobsStore.getEmployerJobs : [];
    },

    jobStats() {
      return this.jobsStore ? this.jobsStore.getJobStats : {};
    },

    filterOptions() {
      return this.jobsStore ? {
        ...this.jobsStore.getFilterOptions,
        educationLevels: this.educationLevels,
        jobTypes: this.jobTypes
      } : {};
    },

    normalizeJobType() {
      return (type) => {
        const lowercaseType = type.toLowerCase().replace(/\s+/g, '-');
        return this.jobTypes.find(validType => validType === lowercaseType) || 'full-time';
      };
    },

    formatDate() {
      return (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      };
    },

    today() {
      return new Date().toISOString().split('T')[0];
    }
  },

  methods: {
    async loadDashboardData() {
      try {
        this.isLoading = true;
        await Promise.all([
          this.jobsStore.fetchEmployerJobs(),
          this.jobsStore.fetchJobStats(),
          this.jobsStore.fetchFilterOptions()
        ]);
      } catch (error) {
        console.error('Error loading dashboard:', error);
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
        title: '',
        description: '',
        location: '',
        type: 'full-time',
        experienceLevel: '',
        salaryMin: null,
        salaryMax: null,
        skills: '',
        benefits: '',
        deadline: '',
        category: '',
        educationLevel: ''
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
            min: this.jobForm.salaryMin ? parseInt(this.jobForm.salaryMin) : null,
            max: this.jobForm.salaryMax ? parseInt(this.jobForm.salaryMax) : null
          },
          requirements: this.jobForm.skills ? this.jobForm.skills.split(',').map(skill => skill.trim()) : [],
          responsibilities: this.jobForm.benefits ? this.jobForm.benefits.split(',').map(benefit => benefit.trim()) : [],
          deadline: this.jobForm.deadline,
          category: this.jobForm.category,
          education_level: this.jobForm.educationLevel
        };
        
        this.isJobCreationLoading = true;
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (this.jobsStore) {
          await this.jobsStore.createJob(formData);
          
          this.closePostJobModal();
          
          this.successJobTitle = formData.title;
          this.showSuccessModal = true;
          
          await this.loadDashboardData();
        }
      } catch (error) {
        console.error('Error posting job:', error);
        
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          let errorMessage = 'Please correct the following errors:\n';
          Object.keys(errors).forEach(key => {
            errorMessage += `- ${key}: ${errors[key].join(', ')}\n`;
          });
          alert(errorMessage);
        } else {
          alert('Failed to create job. Please try again.');
        }
      } finally {
        this.isJobCreationLoading = false;
        this.isSubmitting = false;
      }
    },

    openPostJobModal() {
      this.showPostJobModal = true;
    },

    toggleJobStatus(jobId) {
      if (this.jobsStore) {
        this.jobsStore.toggleJobStatus(jobId);
      }
    },

    // handleLogout() {
    //   if (this.authStore) {
    //     this.authStore.logout();
    //   }
    // },

    handleSuccessModalClose() {
      this.showSuccessModal = false;
      this.successJobTitle = '';
    },

    viewJob(jobId) {
      this.$router.push({ 
        name: 'JobApplications', 
        params: { jobId: jobId } 
      });
    },
  },

  created() {
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();
    this.loadDashboardData();
  }
}
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
</style>