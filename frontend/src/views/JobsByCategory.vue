<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Jobs by Category</h1>
    
    <!-- Category Selection -->
    <div class="mb-8">
      <label class="block text-gray-700 text-sm font-bold mb-2">Select Category:</label>
      <select 
        v-model="selectedCategory"
        @change="loadJobsByCategory"
        class="block w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <!-- No Jobs Found -->
    <div v-else-if="jobs.length === 0" class="text-center py-8">
      <p class="text-gray-600">No jobs found in this category.</p>
    </div>

    <!-- Jobs List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="job in jobs" :key="job.id" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h2 class="text-xl font-semibold mb-2">{{ job.title }}</h2>
        <p class="text-gray-600 mb-2">{{ job.employer.company_name }}</p>
        <div class="mb-4">
          <span class="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-2">
            {{ job.type }}
          </span>
          <span class="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
            {{ job.location }}
          </span>
        </div>
        <p class="text-gray-700 mb-4 line-clamp-3">{{ job.description }}</p>
        <div class="flex justify-between items-center">
          <span class="text-gray-600">
            ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}
          </span>
          <router-link 
            :to="{ name: 'JobDetails', params: { id: job.id }}"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jobService from '@/services/jobService'

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
    await this.loadCategories()
    if (this.$route.params.category) {
      this.selectedCategory = this.$route.params.category
      await this.loadJobsByCategory()
    }
  },
  methods: {
    async loadCategories() {
      try {
        this.loading = true
        const response = await jobService.getCategories()
        this.categories = response
      } catch (error) {
        this.error = 'Failed to load categories'
        console.error('Error loading categories:', error)
      } finally {
        this.loading = false
      }
    },
    async loadJobsByCategory() {
      try {
        this.loading = true
        this.error = null
        if (this.selectedCategory) {
          const response = await jobService.getJobsByCategory(this.selectedCategory)
          this.jobs = response
        } else {
          const response = await jobService.getAllJobs()
          this.jobs = response
        }
      } catch (error) {
        this.error = 'Failed to load jobs'
        console.error('Error loading jobs:', error)
      } finally {
        this.loading = false
      }
    },
    formatSalary(amount) {
      return new Intl.NumberFormat('en-NG').format(amount)
    }
  }
}
</script>