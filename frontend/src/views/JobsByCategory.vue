<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Jobs in {{ categoryName }}</h1>
      <div class="job-count text-muted">
        {{ jobs.length }} jobs found
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12" v-for="job in jobs" :key="job.id">
        <router-link 
          :to="'/jobs/' + job.id" 
          class="text-decoration-none"
        >
          <div class="job-card" :class="{ 'featured-job': job.is_featured }">
            <h5 class="job-title">{{ job.title }}</h5>
            <p class="job-company">{{ job.employer?.company_name || 'Company' }}</p>
            
            <div class="job-meta">
              <span><i class="bi bi-calendar3"></i> {{ formatDate(job.created_at) }}</span>
              <span><i class="bi bi-geo-alt"></i> {{ job.location }}</span>
              <span><i class="bi bi-briefcase"></i> {{ job.type }}</span>
            </div>
            
            <p class="job-description">{{ job.description.substring(0, 100) }}...</p>
            
            <div class="job-tags">
              <span class="job-tag">
                <i class="bi bi-cash"></i> {{ job.salary }}
              </span>
              <span class="job-tag">
                <i class="bi bi-person-workspace"></i> {{ job.experience_level }}
              </span>
            </div>
            
            <div class="job-deadline">
              <i class="bi bi-clock"></i> Deadline: {{ formatDate(job.deadline) }}
            </div>
          </div>
        </router-link>
      </div>

      <!-- No jobs found message -->
      <div v-if="jobs.length === 0 && !loading" class="col-12">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No jobs found in this category. Please try another category or check back later.
        </div>
      </div>

      <!-- Loading spinner -->
      <div v-if="loading" class="col-12 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { jobService } from '@/services/jobService';

export default {
  name: 'JobsByCategory',
  setup() {
    const route = useRoute();
    const jobs = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const loadJobs = async () => {
      loading.value = true;
      try {
        const response = await jobService.searchJobs({ 
          industry: route.params.category 
        });
        jobs.value = response.data;
      } catch (err) {
        error.value = 'Error loading jobs';
        console.error('Error:', err);
      } finally {
        loading.value = false;
      }
    };

    // Format category name for display
    const categoryName = computed(() => {
      return route.params.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });

    // Watch for route changes to reload jobs
    watch(() => route.params.category, () => {
      loadJobs();
    });

    onMounted(() => {
      loadJobs();
    });

    return {
      jobs,
      loading,
      error,
      categoryName,
      formatDate
    };
  }
};
</script>

<style scoped>
.job-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.job-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
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