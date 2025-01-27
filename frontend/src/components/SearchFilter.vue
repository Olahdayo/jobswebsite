<template>
  <div class="search-filter">
    <div class="filter-header">
      <h4 class="mb-0">Search Filters</h4>
    </div>

    <div class="filter-content">
      <div v-if="activeFilters.length" class="active-filters p-3">
        <h5>Active Filters:</h5>
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="(filter, index) in activeFilters"
            :key="index"
            class="badge bg-primary d-flex align-items-center"
          >
            {{ filter.label }}
            <button
              type="button"
              class="btn-close btn-close-white ms-2"
              @click="removeFilter(filter.key)"
              aria-label="Remove filter"
            ></button>
          </span>
        </div>
        <button class="btn btn-outline-danger mt-2" @click="clearAllFilters">
          Clear All Filters
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="filter-form">
        <!-- Search by keyword -->
        <div class="mb-3">
          <label for="keyword" class="form-label">Search</label>
          <input
            type="text"
            id="keyword"
            v-model="filters.keyword"
            class="form-control"
            placeholder="Search jobs by title or company"
          />
        </div>

        <!-- Location -->
        <div class="mb-3">
          <label for="location" class="form-label">Location</label>
          <select id="location" v-model="filters.location" class="form-select">
            <option value="">All Locations</option>
            <option
              v-for="location in jobsStore.filterOptions.locations"
              :key="location"
              :value="location"
            >
              {{ location }}
            </option>
          </select>
        </div>

        <!-- Category -->
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <select id="category" v-model="filters.category" class="form-select">
            <option value="">All Categories</option>
            <option
              v-for="category in jobsStore.filterOptions.categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Job Type -->
        <div class="mb-3">
          <label for="type" class="form-label">Job Type</label>
          <select id="type" v-model="filters.type" class="form-select">
            <option value="">Any Job Type</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <!-- Experience Level -->
        <div class="mb-3">
          <label for="experience" class="form-label">Experience Level</label>
          <select
            id="experience"
            v-model="filters.experience_level"
            class="form-select"
          >
            <option value="">Any Experience Level</option>
            <option
              v-for="level in jobsStore.filterOptions.experienceLevels"
              :key="level"
              :value="level"
            >
              {{ level }}
            </option>
          </select>
        </div>

        <!-- Featured Jobs -->
        <div class="mb-3">
          <div class="form-check">
            <input
              type="checkbox"
              id="featured"
              v-model="filters.is_featured"
              class="form-check-input"
            />
            <label class="form-check-label" for="featured">
              Featured Jobs Only
            </label>
          </div>
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary" :disabled="jobsStore.loading">
            <i class="fas fa-search me-2"></i>Apply Filters
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '@/stores/jobs';

export default {
  name: 'SearchFilter',
  
  emits: ['search', 'reset'],

  props: {
    initialFilters: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      filters: {
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        is_featured: false
      }
    };
  },

  computed: {
    jobsStore() {
      return useJobsStore();
    },

    activeFilters() {
      return Object.entries(this.filters)
        .filter(([key, value]) => {
          if (key === 'is_featured') return value === true;
          return value && value !== '';
        })
        .map(([key, value]) => ({
          key,
          label: this.formatFilterLabel(key, value)
        }));
    }
  },

  methods: {
    async handleSubmit() {
      try {
        // Map the filters to match the backend's expected format
        const mappedFilters = {
          keyword: this.filters.keyword,
          location: this.filters.location,
          category: this.filters.category,
          type: this.filters.type,
          experience_level: this.filters.experience_level,
          is_featured: this.filters.is_featured
        };

        // Update store filters
        await this.jobsStore.updateSearchFilters(mappedFilters);
        
        // Emit search event with filters
        this.$emit('search', mappedFilters);
      } catch (error) {
        console.error('Error applying filters:', error);
      }
    },

    removeFilter(key) {
      this.filters[key] = '';
      this.handleSubmit();
    },

    clearAllFilters() {
      this.filters = {
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        is_featured: false
      };
      
      this.jobsStore.resetState();
      this.$emit('reset');
    },

    formatFilterLabel(key, value) {
      const labels = {
        keyword: 'Search',
        location: 'Location',
        category: 'Category',
        type: 'Job Type',
        experience_level: 'Experience Level',
        is_featured: 'Featured Only'
      };

      return `${labels[key]}: ${value}`;
    }
  },

  created() {
    // Initialize with any provided filters
    if (this.initialFilters) {
      this.filters = {
        ...this.filters,
        ...this.initialFilters
      };
    }
  }
};
</script>

<style scoped>
.search-filter {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.filter-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 1;
}

.filter-content {
  padding: 1rem;
}

.active-filters {
  background-color: #f9fafb;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.filter-form label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-color: #e5e7eb;
  padding: 0.625rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25);
}

.btn-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  padding: 0.625rem 1rem;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}

.btn-close {
  font-size: 0.75rem;
}

.form-check-input:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

/* Scrollbar styling */
.search-filter::-webkit-scrollbar {
  width: 6px;
}

.search-filter::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.search-filter::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.search-filter::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Media Queries */
@media (max-width: 991.98px) {
  .search-filter {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1050;
    border-radius: 0;
    max-height: 100vh;
    display: none;
  }

  .search-filter.show {
    display: block;
  }

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .filter-header .close-button {
    font-size: 1.5rem;
    padding: 0.5rem;
    margin: -0.5rem -0.5rem -0.5rem auto;
  }
}
</style>