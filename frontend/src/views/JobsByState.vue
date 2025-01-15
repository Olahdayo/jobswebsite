<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Jobs in {{ stateName }}</h1>
      <div class="job-count text-muted" v-if="!loading">
        {{ total }} jobs found
      </div>
    </div>

    <div class="row g-4">
      <!-- Loading State -->
      <div v-if="loading" class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="col-12">
        <div class="alert alert-danger text-center">
          <i class="bi bi-exclamation-circle me-2"></i>
          {{ error }}
        </div>
      </div>

      <!-- No Jobs Found -->
      <div v-else-if="!hasJobs" class="col-12">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No jobs found in {{ stateName }}. Please try another state or check back later.
        </div>
      </div>

      <!-- Jobs List -->
      <div v-else class="col-12" v-for="job in jobs" :key="job.id">
        <router-link 
          :to="'/jobs/' + job.id" 
          class="text-decoration-none"
        >
          <div class="job-card" :class="{ 'featured-job': job.is_featured }">
            <h5 class="job-title">{{ job.title }}</h5>
            <p class="job-company">Posted By: {{ job.employer?.company_name || 'Company' }}</p>
            
            <div class="job-meta">
              <span><i class="bi bi-calendar3"></i> {{ job.created_date }}</span>
              <span><i class="bi bi-geo-alt"></i> {{ job.location }}</span>
              <span><i class="bi bi-briefcase"></i> {{ job.type }}</span>
            </div>
            
            <p class="job-description">{{ job.description.substring(0, 100) }}...</p>
            
            <div class="job-tags">
              <span class="job-tag">
                <i class="fas fa-money-bill-wave"></i>
                Salary: ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}
              </span>
              <span class="job-tag">
                <i class="fas fa-graduation-cap"></i>
                Experience: {{ job.experience_level }}
              </span>
            </div>
            
            <div class="job-deadline">
              <i class="bi bi-clock"></i> Deadline: {{ job.deadline_date }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { jobService } from '@/services/jobService';

export default {
  name: 'JobsByState',
  
  data() {
    return {
      jobs: [],
      loading: true,
      error: null,
      total: 0,
      currentPage: 1,
      lastPage: 1,
      min_salary: "",
      max_salary: "",
    };
  },

  computed: {
    stateName() {
      return this.$route.params.state
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    hasJobs() {
      return Array.isArray(this.jobs) && this.jobs.length > 0;
    }
  },

  methods: {
    async loadJobs() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await jobService.getAllJobs();
        console.log('Response from getAllJobs:', response);
        
        if (response && response.data) {
          // Filter jobs by state
          const stateFilter = this.$route.params.state.replace(/-/g, ' ').toLowerCase();
          this.jobs = response.data.filter(job => 
            job.location.toLowerCase().includes(stateFilter)
          );
          
          console.log('Filtered jobs:', this.jobs);
          
          // Update pagination
          this.total = this.jobs.length;
          this.currentPage = 1;
          this.lastPage = Math.ceil(this.total / 10);
        } else {
          console.error('Invalid jobs data:', response);
          this.error = 'Invalid response format from server';
        }
      } catch (err) {
        console.error('Error loading jobs:', err);
        this.error = 'Error loading jobs. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    formatSalary(salary) {
      if (!salary) return "0.00";
      return Number(salary).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'NGN'
      });
    },
  },

  watch: {
    '$route.params.state': {
      handler() {
        this.loadJobs();
      },
      immediate: true
    }
  },

  created() {
    this.loadJobs();
  }
};
</script>

<style scoped>
.job-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  color: inherit;
}

.job-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.job-title {
  color: #1f2937;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.job-company {
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.job-meta i {
  color: #3b82f6;
}

.job-description {
  color: #4b5563;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.job-tag {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.job-tag i {
  font-size: 0.75rem;
  color: #6b7280;
}

.job-deadline {
  color: #dc2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.featured-job {
  border-left: 4px solid #3b82f6;
  background-color: #f8fafc;
}

.job-count {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
}
</style>
