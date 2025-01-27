<template>
  <div class="featured-jobs-page bg-light">
    <div class="container py-5">
      <!-- Page Header -->
      <div class="page-header text-center mb-5">
        <h1 class="display-5 fw-bold text-dark">Featured Jobs</h1>
        <p class="lead text-muted">Discover our handpicked selection of premium job opportunities</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading featured jobs...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="featuredJobs.length === 0" class="text-center py-5">
        <div class="alert alert-info" role="alert">
          <i class="fas fa-info-circle me-2"></i>
          No featured jobs available at the moment.
        </div>
      </div>

      <!-- Jobs Grid -->
      <div v-else class="featured-jobs-grid">
        <router-link 
          v-for="job in featuredJobs" 
          :key="job.id"
          :to="{ name: 'JobDetails', params: { id: job.id }}"
          class="job-card-link"
        >
          <div class="card job-card h-100">
            <!-- Card Header -->
            <div class="card-header border-bottom bg-white">
              <div class="d-flex justify-content-between align-items-start">
                <div class="company-info d-flex gap-3">
                  <img 
                    :src="job.employer?.logo_url || '/images/dashboard-default.svg'" 
                    :alt="job.employer?.company_name"
                    class="company-logo rounded"
                    width="60"
                    height="60"
                  />
                  <div>
                    <h5 class="card-title mb-1">{{ job.title }}</h5>
                    <p class="text-muted mb-0">{{ job.employer?.company_name }}</p>
                  </div>
                </div>
                <span class="badge bg-warning text-dark">
                  <i class="fas fa-star me-1"></i>
                  Featured
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <p class="card-text text-muted mb-4">{{ job.description.substring(0, 150) }}...</p>
              
              <div class="job-meta d-flex flex-wrap gap-3 mb-4">
                <div class="meta-item">
                  <i class="fas fa-map-marker-alt text-secondary me-2"></i>
                  <span>{{ job.location }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-briefcase text-secondary me-2"></i>
                  <span>{{ job.type }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-money-bill-wave text-secondary me-2"></i>
                  <span>₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}</span>
                </div>
              </div>

              <div class="job-tags">
                <span class="badge bg-light text-dark me-2">{{ job.experience_level }}</span>
                <span class="badge bg-light text-dark">{{ job.category }}</span>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="card-footer bg-white border-top">
              <div class="d-flex justify-content-between align-items-center">
                <div class="deadline text-muted">
                  <i class="fas fa-clock me-2"></i>
                  <span>Deadline: {{ formatDate(job.deadline) }}</span>
                </div>
                <span class="view-details text-primary">
                  View Details <i class="fas fa-arrow-right ms-2"></i>
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// Import the jobs store
import { useJobsStore } from '@/stores/jobs';

export default {
  name: 'FeaturedJobs',
  
  // Component data
  data() {
    return {
      error: null
    };
  },

  // Computed properties for reactive data
  computed: {
    // Get jobs store instance
    jobsStore() {
      return useJobsStore();
    },

    // Loading state from store
    isLoading() {
      return this.jobsStore.loading;
    },

    // Get featured jobs from store
    featuredJobs() {
      return this.jobsStore.getFeaturedJobs;
    }
  },

  // Methods for component logic
  methods: {
    // Format salary numbers with Nigerian Naira format
    formatSalary(salary) {
      if (!salary) return 'Not specified';
      return new Intl.NumberFormat('en-NG', {
        maximumFractionDigits: 0
      }).format(salary);
    },

    // Format date to readable format
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Load featured jobs from the store
    async loadFeaturedJobs() {
      try {
        await this.jobsStore.initialize();
      } catch (error) {
        console.error('Error loading featured jobs:', error);
        this.error = 'Failed to load featured jobs. Please try again later.';
      }
    }
  },

  // Lifecycle hook - load jobs when component is created
  created() {
    this.loadFeaturedJobs();
  }
};
</script>

<style scoped>
/* Card link styles */
.job-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s;
}

.job-card-link:hover {
  transform: translateY(-4px);
}

/* Grid layout for job cards */
.featured-jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Company logo styles */
.company-logo {
  object-fit: cover;
}

/* Card hover effects */
.job-card {
  transition: box-shadow 0.3s;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Meta item styles */
.meta-item {
  font-size: 0.875rem;
}

/* View details animation */
.view-details i {
  transition: transform 0.2s;
}

.job-card:hover .view-details i {
  transform: translateX(4px);
}

/* Responsive styles */
@media (max-width: 768px) {
  .featured-jobs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
