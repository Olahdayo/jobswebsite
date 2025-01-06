<template>
  <div class="job-details-page">
    <div class="job-details-container">
      <div v-if="job">
        <!-- Hero Section -->
        <div class="job-hero">
          <div class="hero-content">
            <div class="company-brand">
              <img
                :src="job.employer?.logo || defaultCompanyLogo"
                :alt="job.employer?.company_name"
                class="company-logo"
                loading="lazy"
              />
              <div class="company-info">
                <h1 class="job-title">{{ job.title }}</h1>
                <p class="company-name">
                  <i class="fas fa-building"></i>
                  {{ job.employer?.company_name }}
                </p>
                <div class="job-tags">
                  <span class="tag" :class="{ 'tag-featured': job.is_featured }">
                    <i class="fas" :class="job.is_featured ? 'fa-star' : 'fa-briefcase'"></i>
                    {{ job.is_featured ? "Featured" : "Active" }}
                  </span>
                  <span class="tag tag-type">
                    <i class="fas fa-clock"></i>
                    {{ job.type }}
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
              <i class="bi bi-geo-alt"></i>
              {{ job.location }}
            </span>
            <span class="meta-item">
              <i class="bi bi-cash"></i>
              ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}
            </span>
          </div>
        </div>

        <div class="content-grid">
          <div class="main-content">
            <div class="content-card">
              <div class="card-header">
                <h2 class="section-title">
                  <i class="fas fa-file-alt"></i>
                  Job Description
                </h2>
              </div>

              <div class="job-section">
                <h3>Job Description</h3>
                <p>{{ job.description }}</p>
              </div>

              <div class="job-section">
                <h3>Responsibilities</h3>
                <div v-if="job.responsibilities">
                  <ul class="requirements-list">
                    <li v-for="(resp, index) in parseList(job.responsibilities)" :key="index">
                      <i class="fas fa-check-circle"></i>
                      <span>{{ resp }}</span>
                    </li>
                  </ul>
                </div>
                <p v-else class="text-muted">No specific responsibilities listed.</p>
              </div>

              <div class="job-section">
                <h3>Requirements</h3>
                <div v-if="job.requirements">
                  <ul class="requirements-list">
                    <li v-for="(req, index) in parseList(job.requirements)" :key="index">
                      <i class="fas fa-check-circle"></i>
                      <span>{{ req }}</span>
                    </li>
                  </ul>
                </div>
                <p v-else class="text-muted">No specific requirements listed.</p>
              </div>
            </div>

            <div class="mt-4">
              <button
                v-if="!hasApplied"
                @click="handleApply"
                class="apply-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Submitting..." : "Apply Now" }}
              </button>
              <div v-else class="alert alert-success">
                You have already applied for this job
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { jobService } from '@/services/jobService'

export default {
  name: "JobDetails",
  
  data() {
    return {
      job: null,
      isSubmitting: false,
      hasApplied: false,
      defaultCompanyLogo: '/images/dashboard-default.svg'
    };
  },

  async created() {
    this.authStore = useAuthStore();
    await this.loadJobDetails();
    if (this.authStore.user) {
      this.checkIfApplied();
    }
  },

  methods: {
    async loadJobDetails() {
      try {
        const jobId = this.$route.params.id;
        const response = await jobService.getJob(jobId);
        this.job = response.data;
      } catch (error) {
        console.error('Error loading job details:', error);
      }
    },

    formatSalary(amount) {
      if (!amount) return 'Not specified';
      return new Intl.NumberFormat('en-NG').format(amount);
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    parseList(text) {
      if (!text) return [];
      if (Array.isArray(text)) return text;
      
      // Split by periods, semicolons, or newlines
      const items = text.split(/[.;\n]+/)
        .map(item => item.trim())
        .filter(item => item.length > 0)
        .map(item => {
          // Capitalize first letter if it's not already
          return item.charAt(0).toUpperCase() + item.slice(1);
        });
      
      return items;
    },

    async handleApply() {
      if (!this.authStore.user) {
        this.$router.push('/login');
        return;
      }

      if (this.authStore.user.type !== 'jobseeker') {
        alert('Only job seekers can apply for jobs');
        return;
      }

      this.isSubmitting = true;
      try {
        await jobService.applyForJob(this.job.id);
        this.hasApplied = true;
        alert('Application submitted successfully!');
      } catch (error) {
        console.error('Error applying for job:', error);
        alert('Failed to submit application. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    },

    checkIfApplied() {
      // This should be replaced with an actual API call to check application status
      const applications = JSON.parse(localStorage.getItem('applications')) || [];
      this.hasApplied = applications.some(
        app => app.jobId === this.$route.params.id && app.userId === this.authStore.user.id
      );
    }
  }
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
  background: linear-gradient(to right, #2563eb, #3b82f6);
  color: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-content {
  max-width: 1000px;
  margin: 0 auto;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.company-logo {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.company-info {
  flex: 1;
}

.job-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.company-name {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.job-tags {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
}

.tag i {
  font-size: 0.875rem;
}

.tag-featured {
  background-color: #fbbf24;
  color: #92400e;
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

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #3b82f6;
}

.job-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.job-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.job-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.job-section p {
  color: #4b5563;
  line-height: 1.75;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  color: #4b5563;
  line-height: 1.5;
}

.requirements-list li i {
  color: #3b82f6;
  margin-top: 0.25rem;
}

.apply-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.apply-button:hover {
  background-color: #2563eb;
}

.apply-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.alert-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

@media (min-width: 768px) {
  .content-grid {
    grid-template-columns: 2fr 1fr;
  }
  
  .apply-button {
    width: auto;
  }
}
</style>
