<template>
  <div class="search-filter">
    <h4>Search Filters</h4>
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
    <form @submit.prevent="applyFilters">
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
        <select id="education" v-model="filters.education" class="form-select">
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
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0); 
    next();
  },
};
</script>

<style scoped>
.search-filter {
  position: sticky;
  top: 20px; /* Adjust as needed */
  background: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.active-filters {
  margin-bottom: 1rem;
}
</style>
