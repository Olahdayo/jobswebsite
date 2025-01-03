<template>
  <div class="container py-5">
    <h1 class="mb-4">Featured Jobs</h1>
    <div class="row g-4">
      <div class="col-12" v-for="job in featuredJobs" :key="job.id">
        <div class="job-card featured-job">
          <h5 class="job-title">{{ job.title }}</h5>
          <p class="job-company">{{ job.employer?.company_name || 'Company' }}</p>
          
          <div class="job-meta">
            <span><i class="bi bi-calendar3"></i> {{ job.created_date }}</span>
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
            <i class="bi bi-clock"></i> Deadline: {{ job.deadline_date }}
          </div>
          
          <div class="mt-3">
            <Button
              :to="'/jobs/' + job.id"
              variant="primary"
              class="w-100"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { jobService } from '@/services/jobService';
import Button from '@/components/Button.vue';

export default {
  name: 'FeaturedJobs',
  components: {
    Button
  },
  setup() {
    const featuredJobs = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const loadFeaturedJobs = async () => {
      loading.value = true;
      try {
        const response = await jobService.searchJobs({ featured: true });
        featuredJobs.value = response.data;
      } catch (err) {
        error.value = 'Error loading featured jobs';
        console.error('Error:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadFeaturedJobs();
    });

    return {
      featuredJobs,
      loading,
      error
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
</style>
