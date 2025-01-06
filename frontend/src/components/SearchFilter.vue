<template>
  <div class="search-filter">
    <div class="filter-header" @click="toggleFilters">
      <h4 class="mb-0">Search Filters</h4>
      <i class="fas" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </div>

    <div class="filter-content" :class="{ show: isOpen }">
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

      <form @submit.prevent="applyFilters" class="filter-form">
        <div class="mb-3">
          <label for="keyword" class="form-label">Search</label>
          <input
            type="text"
            id="keyword"
            v-model="filters.keyword"
            class="form-control"
            placeholder="Search jobs by title, company, or keywords"
          />
        </div>

        <div class="mb-3">
          <label for="location" class="form-label">Location</label>
          <select id="location" v-model="filters.location" class="form-select">
            <option value="">All Locations</option>
            <option
              v-for="location in filterOptions.locations"
              :key="location"
              :value="location"
            >
              {{ location }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <select id="category" v-model="filters.category" class="form-select">
            <option value="">All Categories</option>
            <option
              v-for="category in filterOptions.categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="type" class="form-label">Job Type</label>
          <select id="type" v-model="filters.type" class="form-select">
            <option value="">Any Job Type</option>
            <option
              v-for="type in filterOptions.jobTypes"
              :key="type"
              :value="type"
            >
              {{ type }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label for="experience" class="form-label">Experience Level</label>
          <select
            id="experience"
            v-model="filters.experience_level"
            class="form-select"
          >
            <option value="">Any Experience Level</option>
            <option
              v-for="level in filterOptions.experienceLevels"
              :key="level"
              :value="level"
            >
              {{ level }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="form-label">Salary Range</label>
          <div class="row g-2">
            <div class="col">
              <input
                type="number"
                class="form-control"
                v-model.number="filters.min_salary"
                placeholder="Min Salary"
                min="0"
              />
            </div>
            <div class="col">
              <input
                type="number"
                class="form-control"
                v-model.number="filters.max_salary"
                placeholder="Max Salary"
                min="0"
              />
            </div>
          </div>
        </div>

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
          <button type="submit" class="btn btn-primary" :disabled="isLoading">
            <i class="fas fa-search me-2"></i>Apply Filters
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            @click="clearAllFilters"
          >
            <i class="fas fa-times me-2"></i>Clear All
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { jobService } from "@/services/jobService";

export default {
  props: {
    initialFilters: {
      type: Object,
      default: () => ({
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        min_salary: "",
        max_salary: "",
        is_featured: false
      })
    }
  },

  data() {
    return {
      filters: { ...this.initialFilters },
      filterOptions: {
        locations: [],
        categories: [],
        jobTypes: [
          "Full-time",
          "Part-time",
          "Contract",
          "Remote",
          "Internship",
          "Graduate Trainee"
        ],
        experienceLevels: [
          "Entry Level",
          "Junior Level",
          "Mid Level",
          "Senior Level",
          "Lead/Manager",
          "Executive"
        ]
      },
      activeFilters: [],
      isOpen: true,
      isLoading: false
    };
  },

  methods: {
    async loadFilterOptions() {
      this.isLoading = true;
      try {
        const options = await jobService.getFilterOptions();
        this.filterOptions = {
          ...this.filterOptions,
          locations: options.locations || [],
          categories: options.categories || []
        };
      } catch (error) {
        console.error("Error loading filter options:", error);
      } finally {
        this.isLoading = false;
      }
    },

    applyFilters() {
      const filters = { ...this.filters };
      if (filters.min_salary) filters.min_salary = Number(filters.min_salary);
      if (filters.max_salary) filters.max_salary = Number(filters.max_salary);
      
      this.$emit("filter-applied", filters);
      this.updateActiveFilters();
    },

    removeFilter(key) {
      this.filters[key] = key === "is_featured" ? false : "";
      this.applyFilters();
    },

    clearAllFilters() {
      this.filters = {
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        min_salary: "",
        max_salary: "",
        is_featured: false
      };
      this.applyFilters();
    },

    updateActiveFilters() {
      this.activeFilters = [];
      for (const [key, value] of Object.entries(this.filters)) {
        if (value && value !== "" && value !== false) {
          this.activeFilters.push({
            key,
            label: this.formatFilterLabel(key, value)
          });
        }
      }
    },

    formatFilterLabel(key, value) {
      const keyLabel = key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      if (key === 'is_featured') {
        return 'Featured Jobs';
      }
      
      if (key === 'min_salary') {
        return `Min Salary: $${Number(value).toLocaleString()}`;
      }
      
      if (key === 'max_salary') {
        return `Max Salary: $${Number(value).toLocaleString()}`;
      }
      
      return `${keyLabel}: ${value}`;
    },

    toggleFilters() {
      this.isOpen = !this.isOpen;
    }
  },

  watch: {
    initialFilters: {
      handler(newFilters) {
        this.filters = { ...newFilters };
        this.updateActiveFilters();
      },
      deep: true
    }
  },

  async mounted() {
    this.isOpen = window.innerWidth >= 992;
    await this.loadFilterOptions();
    if (Object.values(this.initialFilters).some(value => value !== "" && value !== false)) {
      this.updateActiveFilters();
    }
  }
};
</script>

<style scoped>
.search-filter {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;
  background: white;
  transition: background-color 0.2s;
}

.filter-header:hover {
  background-color: #f8f9fa;
}

.filter-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
  background-color: white;
}

.filter-content.show {
  max-height: 2000px;
}

.filter-form {
  padding: 1.25rem;
}

.active-filters {
  border-bottom: 1px solid #e9ecef;
}

.form-control,
.form-select {
  font-size: 0.875rem;
  border-radius: 0.5rem;
}

@media (max-width: 991px) {
  .search-filter {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .filter-content {
    flex: 1;
    overflow-y: auto;
  }
}

@media (max-width: 576px) {
  .form-control,
  .form-select {
    font-size: 1rem;
    padding: 0.75rem;
  }

  .filter-header {
    position: sticky;
    top: 0;
    z-index: 1;
  }
}
</style>
