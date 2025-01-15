<template>
  <div class="featured-jobs-page">
    <div class="container py-5">
      <div class="page-header mb-5">
        <h1 class="text-3xl font-bold text-gray-900">Featured Jobs</h1>
        <p class="text-gray-600 mt-2">Discover our handpicked selection of premium job opportunities</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="featuredJobs.length === 0" class="text-center py-5">
        <p class="text-gray-600">No featured jobs available at the moment.</p>
      </div>

      <div v-else class="featured-jobs-grid">
        <router-link 
          v-for="job in featuredJobs" 
          :key="job.id"
          :to="{ name: 'JobDetails', params: { id: job.id }}"
          class="job-card-link"
        >
          <div class="job-card">
            <div class="card-header">
              <div class="company-info">
                <img 
                  :src="job.employer?.logo_url || '/images/dashboard-default.svg'" 
                  :alt="job.employer?.company_name"
                  class="company-logo"
                />
                <div>
                  <h2 class="job-title">{{ job.title }}</h2>
                  <p class="company-name">{{ job.employer?.company_name }}</p>
                </div>
              </div>
              <div class="featured-badge">
                <i class="fas fa-star"></i>
                Featured
              </div>
            </div>

            <div class="card-body">
              <p class="job-description">{{ job.description.substring(0, 150) }}...</p>
              
              <div class="job-meta">
                <div class="meta-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ job.location }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-briefcase"></i>
                  <span>{{ job.type }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-money-bill-wave"></i>
                  <span>₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}</span>
                </div>
              </div>

              <div class="job-tags">
                <span class="tag">{{ job.experience_level }}</span>
                <span class="tag">{{ job.category }}</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="deadline">
                <i class="fas fa-clock"></i>
                <span>Deadline: {{ formatDate(job.deadline) }}</span>
              </div>
              <span class="view-details">
                View Details <i class="fas fa-arrow-right"></i>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { jobService } from '@/services/jobService';

export default {
  name: 'FeaturedJobs',
  
  setup() {
    const featuredJobs = ref([]);
    const loading = ref(true);

    const loadFeaturedJobs = async () => {
      try {
        const response = await jobService.getFeaturedJobs();
        featuredJobs.value = response.data;
      } catch (error) {
        console.error('Error loading featured jobs:', error);
      } finally {
        loading.value = false;
      }
    };

    const formatSalary = (amount) => {
      return new Intl.NumberFormat('en-NG').format(amount);
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    onMounted(() => {
      loadFeaturedJobs();
    });

    return {
      featuredJobs,
      loading,
      formatSalary,
      formatDate
    };
  }
};
</script>

<style scoped>
.featured-jobs-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
}

.featured-jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.job-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s;
}

.job-card-link:hover {
  transform: translateY(-4px);
}

.job-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.job-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.company-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.featured-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-badge i {
  color: #f59e0b;
}

.card-body {
  padding: 1.5rem;
  flex: 1;
}

.job-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.job-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.meta-item i {
  color: #3b82f6;
  width: 16px;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deadline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.deadline i {
  color: #ef4444;
}

.view-details {
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-details i {
  transition: transform 0.2s;
}

.job-card:hover .view-details i {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .featured-jobs-grid {
    grid-template-columns: 1fr;
  }

  .job-meta {
    grid-template-columns: 1fr;
  }

  .card-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
