<template>
  <div class="job-details-page">
    <!-- Loading state -->
    <div v-if="isLoading" class="text-center p-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="loadError" class="alert alert-danger m-4">
      {{ loadError }}
    </div>

    <!-- Job details -->
    <div v-else-if="job" class="job-details-container">
        <div class="job-hero">
          <div class="hero-content">
            <div class="company-brand">
              <img
                :src="companyLogo"
                :alt="job?.employer?.company_name"
                class="company-logo"
                loading="lazy"
                @error="handleImageError"
              />
              <div class="company-info">
                <h1 class="job-title">{{ job?.title }}</h1>
                <h2 class="company-name">
                  <i class="bi bi-building"></i>
                  {{ job?.employer?.company_name }}
                </h2>
                <div class="job-meta">
                  <p class="meta-item">
                    <i class="bi bi-geo-alt"></i>
                    {{ job?.location }}
                  </p>
                  <p class="meta-item">
                    <i class="bi bi-briefcase"></i>
                    {{ job?.type }}
                  </p>
                  <p class="meta-item" v-if="job?.salary_range">
                    <i class="bi bi-cash"></i>
                    {{ formatSalary(job?.salary_range) }}
                  </p>
                </div>
                <div class="job-tags">
                  <span class="tag" :class="{ 'tag-featured': job?.is_featured }">
                    <i class="bi" :class="job?.is_featured ? 'bi-star-fill' : 'bi-star'"></i>
                    {{ job?.is_featured ? 'Featured' : 'Standard' }}
                  </span>
                  <span class="tag tag-level">
                    <i class="bi bi-bar-chart"></i>
                    {{ job?.experience_level }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Info Bar -->
        <div class="job-meta">
          <div class="d-flex flex-wrap gap-3">
            <span class="meta-item">
              <i class="bi bi-calendar3"></i>
              Posted: {{ formatDate(job.created_at) }}
            </span>
            <span class="meta-item">
              <i class="bi bi-clock"></i>
              Deadline: {{ formatDate(job.deadline) }}
            </span>
            <span class="meta-item">
              <i class="bi bi-cash"></i>
            ₦{{ formatSalary(job.min_salary) }} - ₦{{
              formatSalary(job.max_salary)
            }}
            </span>
          </div>
        </div>

        <div class="content-grid">
          <div class="main-content">
            <div class="content-card">
              <section class="job-section">
                <h3 class="section-title">
                  <i class="bi bi-file-text"></i>
                  Job Description
                </h3>
                <div class="section-content" v-html="job?.description"></div>
              </section>

              <section class="job-section">
                <h3 class="section-title">
                  <i class="bi bi-list-task"></i>
                  Key Responsibilities
                </h3>
                <ul class="requirements-list">
                  <li v-for="(item, index) in parseList(job?.responsibilities)" :key="'resp-'+index">
                    {{ item }}
                  </li>
                </ul>
              </section>

              <section class="job-section">
                <h3 class="section-title">
                  <i class="bi bi-check-circle"></i>
                  Requirements
                </h3>
                <ul class="requirements-list">
                  <li v-for="(item, index) in parseList(job?.requirements)" :key="'req-'+index">
                    {{ item }}
                  </li>
                </ul>
              </section>
            </div>

            <div class="mt-4">
              <button 
                @click="handleApply" 
                class="btn btn-primary btn-lg"
                :disabled="isApplying"
              >
                <i class="bi bi-send me-2"></i>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

    <!-- No job found -->
    <div v-else class="alert alert-warning m-4">Job not found</div>

    <!-- Application Modal -->
    <div
      class="modal fade"
      id="applicationModal"
      tabindex="-1"
      ref="applicationModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">
              <i class="bi bi-briefcase me-2"></i>
              Apply for {{ job?.title }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitApplication" class="application-form">
              <!-- Cover Letter -->
              <div class="mb-4">
                <label for="coverLetter" class="form-label">
                  <i class="bi bi-file-text me-2"></i>
                  Cover Letter <span class="text-danger">*</span>
                </label>
                <div class="form-text mb-2">
                  Write a compelling cover letter explaining why you're the best
                  candidate for this position. Minimum 100 characters required.
                </div>
                <textarea
                  id="coverLetter"
                  v-model="applicationForm.coverLetter"
                  class="form-control"
                  rows="6"
                  required
                  minlength="100"
                  :class="{ 'is-invalid': formErrors.coverLetter }"
                ></textarea>
                <div class="invalid-feedback" v-if="formErrors.coverLetter">
                  {{ formErrors.coverLetter }}
                </div>
                <div class="form-text mt-1">
                  {{ applicationForm.coverLetter.length }} / 100 characters
                  minimum
                </div>
              </div>

              <!-- Resume Upload -->
              <div class="mb-4">
                <label for="resume" class="form-label">
                  <i class="bi bi-file-earmark-pdf me-2"></i>
                  Resume/CV <span class="text-danger">*</span>
                </label>
                <div class="form-text mb-2">
                  Upload your latest resume in PDF, DOC, or DOCX format. Maximum
                  file size: 5MB
                </div>
                <input
                  type="file"
                  id="resume"
                  class="form-control"
                  @change="handleResumeUpload"
                  accept=".pdf,.doc,.docx"
                  required
                  :class="{ 'is-invalid': formErrors.resume }"
                />
                <div class="invalid-feedback" v-if="formErrors.resume">
                  {{ formErrors.resume }}
                </div>
                <div class="form-text mt-1" v-if="applicationForm.resume">
                  Selected file: {{ applicationForm.resume.name }} ({{
                    formatFileSize(applicationForm.resume.size)
                  }})
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2 mt-4">
                <button 
                  type="button" 
                  class="btn btn-outline-secondary" 
                  data-bs-dismiss="modal"
                  :disabled="isApplying"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isApplying || !isFormValid"
                >
                  <span
                    v-if="isApplying"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  <i v-else class="bi bi-send me-2"></i>
                  {{ isApplying ? "Submitting..." : "Submit Application" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" ref="successModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              Application Submitted
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body text-center">
            <div class="my-4">
              <i
                class="bi bi-check-circle-fill text-success"
                style="font-size: 4rem"
              ></i>
            </div>
            <h4 class="mb-3">Thank you for applying!</h4>
            <p>
              Your application has been successfully submitted for
              {{ job?.title }}.
            </p>
            <p class="text-muted">
              The employer will review your application and contact you if
              they're interested.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Modal -->
    <div class="modal fade" id="errorModal" tabindex="-1" ref="errorModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Error
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body text-center">
            <div class="my-4">
              <i
                class="bi bi-x-circle-fill text-danger"
                style="font-size: 4rem"
              ></i>
            </div>
            <p class="mb-0">{{ errorMessage }}</p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";
import { Modal } from "bootstrap";

export default {
  name: "JobDetails",
  data() {
    return {
      applicationForm: {
        coverLetter: "",
        resume: null,
      },
      formErrors: {
        coverLetter: "",
        resume: "",
      },
      applicationModal: null,
      successModal: null,
      errorModal: null,
      errorMessage: "",
      defaultCompanyLogo: "/images/dashboard-default.svg",
    };
  },

  computed: {
    authStore() {
      return useAuthStore();
    },
    jobsStore() {
      return useJobsStore();
    },
    job() {
      return this.jobsStore.getCurrentJob;
    },
    isLoading() {
      return this.jobsStore.getJobLoadingState;
    },
    loadError() {
      return this.jobsStore.getJobError;
    },
    isApplying() {
      return this.jobsStore.getApplicationState.isApplying;
    },
    isFormValid() {
      return (
        this.applicationForm.coverLetter.length >= 100 &&
        this.applicationForm.resume &&
        !this.formErrors.coverLetter &&
        !this.formErrors.resume
      );
    },
    companyLogo() {
      if (!this.job) return this.defaultCompanyLogo;
      // Check all possible paths for the logo
      return this.job.employer?.logo || this.job.company_logo || this.job.logo || this.defaultCompanyLogo;
    },
  },

  created() {
    this.loadJobDetails();
  },

  mounted() {
    this.applicationModal = new Modal(this.$refs.applicationModal);
    this.successModal = new Modal(this.$refs.successModal);
    this.errorModal = new Modal(this.$refs.errorModal);

    // Add event listener for modal close
    this.$refs.applicationModal.addEventListener('hidden.bs.modal', this.resetForm);
  },

  beforeUnmount() {
    // Remove event listener
    this.$refs.applicationModal.removeEventListener('hidden.bs.modal', this.resetForm);
    this.hideModals();
  },

  methods: {
    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    handleResumeUpload(event) {
      const file = event.target.files[0];
      this.formErrors.resume = "";

      if (!file) {
        this.applicationForm.resume = null;
        return;
      }

      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedTypes.includes(file.type)) {
        this.formErrors.resume = "Please upload a PDF, DOC, or DOCX file";
        event.target.value = "";
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.formErrors.resume = "File size must be less than 5MB";
        event.target.value = "";
        return;
      }

      this.applicationForm.resume = file;
    },

    handleImageError(event) {
      event.target.src = this.defaultCompanyLogo;
    },

    async handleApply() {
      if (!this.authStore.isAuthenticated) {
        this.$router.push({
          name: "Login",
          query: { redirect: this.$route.fullPath },
        });
        return;
      }

      // Check if user is an employer
      if (this.authStore.user?.role === "employer") {
        this.showSuccessMessage("Employers cannot apply for jobs");
        return;
      }

      // Check if the job deadline has passed
      const deadline = new Date(this.job.deadline);
      if (deadline < new Date()) {
        this.showSuccessMessage("This job posting has expired");
        return;
      }

      this.applicationModal.show();
    },

    async submitApplication() {
      if (!this.isFormValid) return;

      try {
        const formData = new FormData();
        formData.append("cover_letter", this.applicationForm.coverLetter);
        formData.append("resume", this.applicationForm.resume);

        await this.jobsStore.submitJobApplication(this.job.id, formData);
        
        this.hideModals();
        this.resetForm(); // Reset form after successful submission
        this.successModal.show();
        
      } catch (error) {
        console.error("Application submission error:", error);
        this.errorMessage = error.message || 'Failed to submit application. Please try again.';
        this.errorModal.show();
      }
    },

    async loadJobDetails() {
      const jobId = this.$route.params.id;
      if (!jobId) return;
      
      await this.jobsStore.fetchJob(jobId);
    },

    formatSalary(amount) {
      return amount ? amount.toLocaleString() : "Not specified";
    },

    formatDate(date) {
      if (!date) return "Not specified";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    parseList(text) {
      if (!text) return [];
      // Remove brackets and quotes, then split by commas
      return text
        .replace(/[\[\]"]/g, '')
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    },

    showSuccessMessage(message) {
      alert(message);
    },

    hideModals() {
      if (this.applicationModal) this.applicationModal.hide();
      if (this.successModal) this.successModal.hide();
      if (this.errorModal) this.errorModal.hide();
    },

    resetForm() {
      this.applicationForm = {
        coverLetter: "",
        resume: null,
      };
      this.formErrors = {
        coverLetter: "",
        resume: "",
      };
      // Reset file input
      const fileInput = document.getElementById('resume');
      if (fileInput) fileInput.value = '';
    },
  },
};
</script>

<style scoped>
.job-details-page {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 2rem 0;
}

.job-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.job-hero {
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  padding: 3rem 0;
  margin-bottom: 2rem;
  color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.company-brand {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
}

.company-logo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  background-color: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.company-info {
  flex: 1;
}

.job-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-name {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-name i {
  font-size: 1.5rem;
  opacity: 0.9;
}

.job-meta {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  font-size: 1.125rem;
  margin: 0;
}

.meta-item i {
  font-size: 1.25rem;
  opacity: 0.9;
  width: 1.5rem;
  text-align: center;
}

.job-tags {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tag-featured {
  background-color: rgba(255, 255, 255, 0.2);
}

.tag-level {
  background-color: rgba(66, 153, 225, 0.2);
}

.job-meta {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.meta-item i {
  color: #3b82f6;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.main-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}

.content-card {
  margin-bottom: 2rem;
}

.job-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #4a5568;
  font-size: 1.25rem;
}

.section-content {
  color: #4a5568;
  line-height: 1.6;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.requirements-list li {
  position: relative;
  padding-left: 2rem;
  color: #4a5568;
  line-height: 1.5;
}

.requirements-list li::before {
  content: "•";
  position: absolute;
  left: 0.5rem;
  color: #4299e1;
  font-size: 1.25rem;
  line-height: 1;
}

.modal .bi {
  font-size: 3rem;
}

.application-form {
  max-width: 100%;
}

.application-form textarea {
  resize: vertical;
  min-height: 150px;
}

.application-form .form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.modal-header {
  border-bottom: 0;
}

.modal-footer {
  border-top: 0;
}

.bi {
  vertical-align: -0.125em;
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
  }
}
</style>
