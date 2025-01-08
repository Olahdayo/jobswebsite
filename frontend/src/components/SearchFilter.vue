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
      isLoading: false
    };
  },

  methods: {
    async loadFilterOptions() {
      try {
        const [locations, categories] = await Promise.all([
          jobService.getLocations(),
          jobService.getCategories()
        ]);
        this.filterOptions.locations = locations;
        this.filterOptions.categories = categories;
      } catch (error) {
        console.error("Error loading filter options:", error);
      }
    },

    async applyFilters() {
      this.isLoading = true;
      this.updateActiveFilters();
      const filters = Object.fromEntries(
        Object.entries(this.filters).filter(([_, value]) => value !== "" && value !== null)
      );
      this.$emit("filter-change", filters);
      this.isLoading = false;
    },

    removeFilter(key) {
      this.filters[key] = "";
      this.applyFilters();
    },

    clearAllFilters() {
      Object.keys(this.filters).forEach(key => {
        if (typeof this.filters[key] === "boolean") {
          this.filters[key] = false;
        } else {
          this.filters[key] = "";
        }
      });
      this.activeFilters = [];
      this.applyFilters();
    },

    updateActiveFilters() {
      this.activeFilters = Object.entries(this.filters)
        .filter(([key, value]) => value !== "" && value !== null && value !== false)
        .map(([key, value]) => ({
          key,
          value,
          label: this.formatFilterLabel(key, value)
        }));
    },

    formatFilterLabel(key, value) {
      switch (key) {
        case "keyword":
          return `Search: ${value}`;
        case "min_salary":
          return `Min Salary: $${value}`;
        case "max_salary":
          return `Max Salary: $${value}`;
        case "is_featured":
          return "Featured Jobs";
        default:
          return `${key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}: ${value}`;
      }
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

  mounted() {
    this.loadFilterOptions();
    if (Object.values(this.filters).some(value => value !== "" && value !== false)) {
      this.updateActiveFilters();
    }
  }
};
</script>

<style scoped>
.search-filter {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
  max-height: calc(100vh - 100px);
  position: sticky;
  top: 20px;
}

.filter-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.filter-content {
  padding: 1.5rem;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f8fafc;
}

.filter-content::-webkit-scrollbar {
  width: 6px;
}

.filter-content::-webkit-scrollbar-track {
  background: #f8fafc;
}

.filter-content::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.active-filters {
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.badge {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-close {
  font-size: 0.75rem;
  padding: 0.25rem;
}

.filter-form label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-color: #e2e8f0;
  padding: 0.625rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px #3182ce;
}

.btn-primary {
  background-color: #3182ce;
  border-color: #3182ce;
  padding: 0.625rem 1rem;
}

.btn-primary:hover {
  background-color: #2c5282;
  border-color: #2c5282;
}

.btn-outline-secondary {
  color: #4a5568;
  border-color: #e2e8f0;
}

.btn-outline-secondary:hover {
  background-color: #f8fafc;
  color: #2d3748;
}

.form-check-input:checked {
  background-color: #3182ce;
  border-color: #3182ce;
}

@media (max-width: 768px) {
  .search-filter {
    position: relative;
    top: 0;
    max-height: none;
  }

  .filter-content {
    max-height: 400px;
  }
}
</style>
