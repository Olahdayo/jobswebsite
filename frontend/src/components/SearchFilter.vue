<template>
  <div class="search-filter">
    <!-- Filter Header -->
    <div class="filter-header" @click="toggleFilters">
      <h4 class="mb-0">Search Filters</h4>
      <i class="fas" :class="isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
    </div>

    <!-- Collapsible Content -->
    <div class="filter-content" :class="{ show: isOpen }">
      <div v-if="activeFilters.length" class="active-filters mb-3">
        <h5>Active Filters:</h5>
        <div class="d-flex flex-wrap">
          <div
            class="badge bg-secondary me-2 mb-2"
            v-for="(filter, index) in activeFilters"
            :key="index"
          >
            {{ filter.label }}
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="removeFilter(filter.key)"
              aria-label="Close"
            ></button>
          </div>
        </div>
        <button class="btn btn-outline-danger" @click="clearAllFilters">
          Clear All Filters
        </button>
      </div>
      <form @submit.prevent="applyFilters" class="filter-form">
        <div class="mb-3">
          <label for="query" class="form-label">Search</label>
          <input
            type="text"
            id="query"
            v-model="filters.query"
            class="form-control"
            placeholder="Job title or company"
          />
        </div>
        <div class="mb-3">
          <label for="location" class="form-label">Location</label>
          <select id="location" v-model="filters.location" class="form-select">
            <option value="">All Locations</option>
            <option
              v-for="location in locations"
              :key="location"
              :value="location"
            >
              {{ location }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="field" class="form-label">Field</label>
          <select id="field" v-model="filters.field" class="form-select">
            <option value="">All Fields</option>
            <option v-for="field in fields" :key="field" :value="field">
              {{ field }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="education" class="form-label">Education Level</label>
          <select
            id="education"
            v-model="filters.education"
            class="form-select"
          >
            <option value="">Any Education Level</option>
            <option
              v-for="education in educationLevels"
              :key="education"
              :value="education"
            >
              {{ education }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label for="jobType" class="form-label">Job Type</label>
          <select id="jobType" v-model="filters.jobType" class="form-select">
            <option value="">Any Job Type</option>
            <option v-for="jobType in jobTypes" :key="jobType" :value="jobType">
              {{ jobType }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Apply Filters</button>
      </form>
    </div>
  </div>
</template>

<script>
import filterOptions from "@/data/filterOptions.json";

export default {
  data() {
    return {
      filters: {
        query: "",
        location: "",
        field: "",
        education: "",
        jobType: "",
      },
      locations: filterOptions.locations,
      fields: filterOptions.fields,
      educationLevels: filterOptions.educationLevels,
      jobTypes: filterOptions.jobTypes,
      activeFilters: [],
      isOpen: true, // Default to open on desktop
    };
  },
  methods: {
    applyFilters() {
      this.$emit("filter-applied", this.filters);
      this.updateActiveFilters();
    },
    removeFilter(key) {
      this.filters[key] = "";
      this.applyFilters();
    },
    clearAllFilters() {
      this.filters = {
        query: "",
        location: "",
        field: "",
        education: "",
        jobType: "",
      };
      this.applyFilters();
    },
    updateActiveFilters() {
      this.activeFilters = [];
      for (const [key, value] of Object.entries(this.filters)) {
        if (value) {
          this.activeFilters.push({
            key,
            label: `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
          });
        }
      }
    },
    toggleFilters() {
      this.isOpen = !this.isOpen;
    },
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  mounted() {
    // Close by default on mobile
    this.isOpen = window.innerWidth >= 992;
  },
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
  max-height: 2000px; /* Arbitrary large height */
}

.filter-form {
  padding: 1.25rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
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

  .filter-actions {
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
    margin-top: auto;
    padding: 1.25rem;
    background-color: white;
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
