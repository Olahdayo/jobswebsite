<template>
  <div class="jobs-by-category">
    <div class="category-header">
      <div class="container">
        <h1 class="page-title">Browse Jobs by Category</h1>
        <p class="page-subtitle">Find your next career opportunity in your preferred field</p>
      </div>
    </div>

    <div class="container main-content">
      <div class="current-category">
  <h2>{{ selectedCategory || 'All Categories' }}</h2>
  <span class="job-count">{{ jobs.length }} {{ jobs.length === 1 ? 'Job' : 'Jobs' }} Available</span>
</div>
      <!-- Category Selection -->
      <div class="category-selector">
        <label>Select Category:</label>
        <select 
          v-model="selectedCategory"
          @change="loadJobsByCategory"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
 

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading jobs...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>{{ error }}</p>
      </div>

      <!-- No Jobs Found -->
      <div v-else-if="jobs.length === 0" class="no-jobs-message">
        <i class="fas fa-search"></i>
        <p>No jobs found in this category.</p>
        <button @click="selectedCategory = ''" class="btn-view-all">View All Categories</button>
      </div>
 
      
      <!-- Jobs Grid -->
      <div v-else class="jobs-grid">
        <!-- Current Category Display -->
        <div v-for="job in jobs" :key="job.id" class="job-card">
          <div class="job-card-header">
            <h2>{{ job.title }}</h2>
            <span class="job-type" :class="job.type">{{ job.type }}</span>
          </div>
          
          <div class="company-info">
            <img 
              :src="job.employer?.logo_url || '/images/dashboard-default.svg'" 
              :alt="job.employer?.company_name"
              class="company-logo"
            >
            <div>
              <h3>{{ job.employer?.company_name }}</h3>
              <p class="location">
                <i class="fas fa-map-marker-alt"></i>
                {{ job.location }}
              </p>
            </div>
          </div>

          <div class="job-description">{{ job.description }}</div>

          <div class="job-meta">
            <div class="salary">
              <i class="fas fa-money-bill-wave"></i>
              {{ formatSalary(job.min_salary) }} - {{ formatSalary(job.max_salary) }}
            </div>
            <div class="experience">
              <i class="fas fa-briefcase"></i>
              {{ job.experience_level }}
            </div>
          </div>

          <router-link 
            :to="{ name: 'JobDetails', params: { id: job.id }}"
            class="view-details-btn"
          >
            View Details
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jobService } from '@/services/jobService'

export default {
  name: 'JobsByCategory',
  data() {
    return {
      categories: [],
      selectedCategory: '',
      jobs: [],
      loading: false,
      error: null
    }
  },
  async created() {
    await this.loadCategories();
    if (this.$route.params.category) {
      this.selectedCategory = this.$route.params.category.replace(/-/g, ' ');
      await this.loadJobsByCategory();
    }
  },
  methods: {
    async loadCategories() {
      try {
        this.loading = true;
        const response = await jobService.getAllJobs();
        
        // Extract unique categories
        this.categories = [...new Set(response.data.map(job => job.category))].filter(Boolean);
      } catch (error) {
        this.error = 'Failed to load categories';
        console.error('Error loading categories:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadJobsByCategory() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await jobService.getAllJobs();
        
        if (this.selectedCategory) {
          // Filter jobs by selected category
          this.jobs = response.data.filter(job => 
            job.category.toLowerCase() === this.selectedCategory.toLowerCase()
          );
        } else {
          // Show all jobs if no category selected
          this.jobs = response.data;
        }
      } catch (error) {
        this.error = 'Failed to load jobs';
        console.error('Error loading jobs:', error);
      } finally {
        this.loading = false;
      }
    },
    
    formatSalary(amount) {
      if (!amount) return "0.00";
      return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'NGN'
      });
    }
  },
  
  watch: {
    // Watch for route changes
    '$route.params.category': {
      handler(newCategory) {
        this.selectedCategory = newCategory ? newCategory.replace(/-/g, ' ') : '';
        this.loadJobsByCategory();
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.jobs-by-category {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.category-header {
  background: linear-gradient(135deg, #0056b3 0%, #007bff 100%);
  padding: 3rem 0;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  padding: 2rem 0;
}

.category-selector {
  margin-bottom: 2rem;
  max-width: 400px;
}

.category-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #495057;
}

.category-selector select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.category-selector select:focus {
  border-color: #007bff;
  outline: none;
}

.loading-state {
  text-align: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message, .no-jobs-message {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.error-message i, .no-jobs-message i {
  font-size: 2rem;
  color: #dc3545;
  margin-bottom: 1rem;
}

.btn-view-all {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-view-all:hover {
  background-color: #0056b3;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.job-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.job-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.job-card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.job-type {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.job-type.full-time { background: #ebf8ff; color: #2b6cb0; }
.job-type.part-time { background: #faf5ff; color: #6b46c1; }
.job-type.contract { background: #f0fff4; color: #2f855a; }

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.company-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 1rem;
  object-fit: cover;
}

.company-info h3 {
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
  color: #4a5568;
}

.location {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.location i {
  margin-right: 0.5rem;
}

.job-description {
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.salary i, .experience i {
  margin-right: 0.5rem;
  color: #007bff;
}

.view-details-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background-color: #0056b3;
}

.view-details-btn i {
  margin-left: 0.5rem;
}

.current-category {
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-category h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.job-count {
  background: #e6f3ff;
  color: #0056b3;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}



@media (max-width: 768px) {
  .category-header {
    padding: 2rem 0;
  }

  .page-title {
    font-size: 2rem;
  }

  .jobs-grid {
    grid-template-columns: 1fr;
  }

  .job-card {
    margin-bottom: 1rem;
  }
  .current-category {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .job-count {
    align-self: flex-start;
  }
}
</style>