<template>
  <div class="jobs-container">
    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        @input="handleSearch" 
        type="text" 
        placeholder="Search jobs..."
        class="search-input"
      />
    </div>

    <div class="jobs-grid">
      <div v-for="job in jobs" :key="job.id" class="job-card">
        <div class="job-header">
          <h3>{{ job.title }}</h3>
          <span class="job-type" :class="job.type">{{ job.type }}</span>
        </div>
        <div class="company-info">
          <img :src="job.employer.logo_url" alt="Company logo" class="company-logo" />
          <div>
            <p class="company-name">{{ job.employer.company_name }}</p>
            <p class="location">{{ job.location }}</p>
          </div>
        </div>
        <div class="job-details">
          <p class="salary">${{ job.salary.toLocaleString() }} / year</p>
          <p class="experience">{{ job.experience_level }}</p>
        </div>
        <div class="job-description">
          {{ job.description.substring(0, 150) }}...
        </div>
        <div class="job-footer">
          <button @click="viewJob(job.id)" class="view-button">View Details</button>
          <span class="deadline">Deadline: {{ formatDate(job.deadline) }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Loading jobs...
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { jobService } from '@/services/api';
import { useRouter } from 'vue-router';

export default {
  name: 'Jobs',
  setup() {
    const router = useRouter();
    const jobs = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchQuery = ref('');

    const loadJobs = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await jobService.getAllJobs();
        jobs.value = data;
      } catch (err) {
        error.value = 'Failed to load jobs. Please try again later.';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const handleSearch = async () => {
      if (searchQuery.value.trim()) {
        loading.value = true;
        try {
          const data = await jobService.searchJobs(searchQuery.value);
          jobs.value = data;
        } catch (err) {
          error.value = 'Search failed. Please try again.';
        } finally {
          loading.value = false;
        }
      } else {
        loadJobs();
      }
    };

    const viewJob = (id) => {
      router.push(`/jobs/${id}`);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    onMounted(loadJobs);

    return {
      jobs,
      loading,
      error,
      searchQuery,
      handleSearch,
      viewJob,
      formatDate
    };
  }
};
</script>

<style scoped>
.jobs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.job-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-5px);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
}

.job-header h3 {
  margin: 0;
  color: #2c3e50;
}

.job-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.job-type.full-time { background: #e3f2fd; color: #1976d2; }
.job-type.part-time { background: #f3e5f5; color: #9c27b0; }
.job-type.contract { background: #e8f5e9; color: #388e3c; }

.company-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.company-name {
  margin: 0;
  font-weight: 600;
  color: #455a64;
}

.location {
  margin: 0;
  font-size: 14px;
  color: #78909c;
}

.job-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.salary {
  color: #2e7d32;
  font-weight: 600;
}

.experience {
  color: #455a64;
}

.job-description {
  color: #546e7a;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-button {
  background: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.view-button:hover {
  background: #1565c0;
}

.deadline {
  font-size: 12px;
  color: #78909c;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #455a64;
}

.error {
  color: #d32f2f;
}
</style>
