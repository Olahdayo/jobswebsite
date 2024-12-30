<template>
  <div class="job-details-page">
    <div class="job-details-container">
      <div v-if="job">
        <!-- Hero Section -->
        <div class="job-hero">
          <div class="hero-content">
            <div class="company-brand">
              <img
                :src="job.companyLogo || '/images/dashboard-default.svg'"
                :alt="job.company"
                class="company-logo"
                loading="lazy"
              />
              <div class="company-info">
                <h1 class="job-title">{{ job.title }}</h1>
                <p class="company-name">
                  <i class="fas fa-building"></i>
                  {{ job.company }}
                </p>
                <div class="job-tags">
                  <span class="tag" :class="{ 'tag-featured': job.featured }">
                    <i
                      class="fas"
                      :class="job.featured ? 'fa-star' : 'fa-briefcase'"
                    ></i>
                    {{ job.featured ? "Featured" : "Active" }}
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
        <div class="quick-info-bar">
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <div>
              <span class="info-label">Posted</span>
              <span class="info-value">{{ formatDate(job.postedDate) }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <span class="info-label">Location</span>
              <span class="info-value">{{ job.location }}</span>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-money-bill-wave"></i>
            <div>
              <span class="info-label">Salary</span>
              <span class="info-value highlight">{{ job.salary }}/month</span>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-users"></i>
            <div>
              <span class="info-label">Applications</span>
              <span class="info-value">Open</span>
            </div>
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
              <p class="description-text">{{ job.description }}</p>
            </div>

            <div class="content-card">
              <div class="card-header">
                <h2 class="section-title">
                  <i class="fas fa-list-check"></i>
                  Requirements
                </h2>
              </div>
              <ul class="requirements-list">
                <li v-for="(req, index) in job.requirements" :key="index">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ req }}</span>
                </li>
              </ul>
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
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";

export default {
  name: "JobDetails",
  
  data() {
    return {
      job: null,
      isSubmitting: false,
      showLoginModal: false,
      hasApplied: false,
      showSuccessModal: false,
      applications: []
    };
  },

  created() {
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();
    this.loadJobDetails();
    if (this.authStore.user) {
      this.checkIfApplied();
    }
  },

  watch: {
    '$route.params.id': function() {
      this.loadJobDetails();
      if (this.authStore.user) {
        this.checkIfApplied();
      }
    }
  },

  methods: {
    handleApply() {
      if (!this.authStore.user) {
        this.$router.push("/login");
        return;
      }

      if (this.authStore.user.type !== "jobseeker") {
        alert("Only job seekers can apply for jobs");
        return;
      }

      const existingApplication = this.applications.find(
        (app) =>
          app.jobId === this.job.id && app.userId === this.authStore.user.id
      );

      if (existingApplication) {
        alert("You have already applied for this job");
        return;
      }

      const newApplication = {
        id: Date.now(),
        jobId: this.job.id,
        userId: this.authStore.user.id,
        status: "pending",
        appliedDate: new Date().toISOString(),
      };

      const existingApplications =
        JSON.parse(localStorage.getItem("applications")) || [];
      existingApplications.push(newApplication);
      localStorage.setItem(
        "applications",
        JSON.stringify(existingApplications)
      );

      this.hasApplied = true;
      alert("Application submitted successfully!");
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    loadJobDetails() {
      const jobId = parseInt(this.$route.params.id);
      this.job = this.jobsStore.jobs.find((j) => j.id === jobId);

      if (!this.job) {
        this.$router.push("/jobs");
      }
    },

    checkIfApplied() {
      if (!this.authStore.user || !this.job) return;

      const applications = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );
      this.hasApplied = applications.some(
        (app) => app.jobId === this.job.id && app.userId === this.authStore.user.id
      );
    }
  }
};
</script>

<style scoped>
.job-details-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Hero Section */
.job-hero {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 3rem 0;
  margin-bottom: 4rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.company-brand {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.company-logo {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  background: white;
  padding: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.job-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.company-name {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Tags */
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
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.tag-featured {
  background: #ffc107;
  color: #000;
}

.tag-type {
  background: rgba(255, 255, 255, 0.3);
}

/* Quick Info Bar */
.quick-info-bar {
  max-width: 1200px;
  margin: -2rem auto 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-item i {
  font-size: 1.5rem;
  color: #3498db;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
}

.info-label {
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
}

.info-value {
  display: block;
  font-weight: 600;
  color: #2c3e50;
}

.info-value.highlight {
  color: #28a745;
}

.content-card {
  background: white;
  border-radius: 1rem;
  padding: 0;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.description-text {
  line-height: 1.8;
  color: #495057;
  padding: 2rem;
}

.requirements-list {
  list-style: none;
  padding: 2rem;
  margin: 0;
}

.apply-button-container {
  margin-top: 2rem;
  text-align: center;
}

.apply-button {
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #0056b3;
}

.loading-container {
  text-align: center;
  margin-top: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.fa-user-lock {
  color: #0d6efd;
}

@media (max-width: 768px) {
  .job-hero {
    padding: 2rem 0;
  }

  .company-brand {
    flex-direction: column;
    text-align: center;
  }

  .job-tags {
    justify-content: center;
  }

  .quick-info-bar {
    margin: -1rem auto 2rem;
    grid-template-columns: 1fr;
    text-align: center;
  }

  .info-item {
    flex-direction: column;
  }
}
</style>
