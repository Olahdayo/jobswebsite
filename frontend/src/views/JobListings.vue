<template>
  <div class="container py-5">
    <h1 class="mb-4">Jobs for you</h1>
    <div class="row">
      <div class="col-md-9">
        <div v-if="activeFilters.length" class="alert alert-info mb-3">
          <strong>Showing results for:</strong>
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
        
        <!-- Display message if no jobs found -->
        <div v-if="filteredJobs.length === 0" class="alert alert-warning">
          No jobs found matching your filters.
        </div>

        <div class="row">
          <div class="col-12 mb-4" v-for="job in paginatedJobs" :key="job.id">
            <router-link :to="{ name: 'JobDetails', params: { id: job.id } }" class="text-decoration-none">
              <div class="card border-0 shadow-sm h-100 job-card">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div>
                      <h5 class="card-title job-title">{{ job.title }}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">{{ job.company }}</h6>
                      <div class="d-flex align-items-center">
                        <i class="bi bi-calendar me-1"></i>
                        <small class="text-muted">{{ formatPostedDate(job.postedDate) }}</small>
                      </div>
                      <div class="d-flex align-items-center">
                        <span class="badge bg-info me-1">{{ job.jobType }}</span>
                        <span class="text-muted">Salary: {{ job.salary }} per month</span>
                      </div>
                    </div>
                  </div>
                  <p class="card-text">{{ job.description }}</p>
                  <p class="card-text"><small class="text-muted">Location: {{ job.location }}</small></p>
                  <p class="card-text"><small class="text-muted"> {{ job.type }}</small></p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="changePage(currentPage - 1)">Previous</a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
              <a class="page-link" @click="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" @click="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="col-md-3">
        <SearchFilter @filter-applied="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from '@/stores/jobs'
import SearchFilter from '@/components/SearchFilter.vue'

export default {
  name: 'JobListings',
  components: {
    SearchFilter
  },
  data() {
    return {
      currentPage: 1,
      jobsPerPage: 20,
    }
  },
  computed: {
    allJobs() {
      return this.jobsStore.getLatestJobs();
    },
    filteredJobs() {
      return this.jobsStore.filteredJobs;
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      return this.filteredJobs.slice(start, start + this.jobsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.jobsPerPage);
    },
    activeFilters() {
      return this.jobsStore.searchFilters;
    }
  },
  setup() {
    const jobsStore = useJobsStore();
    jobsStore.initializeJobs();
    return { jobsStore };
  },
  methods: {
    formatPostedDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    applyFilters(filters) {
      this.jobsStore.searchFilters = filters;
      this.jobsStore.filterJobs();
      this.currentPage = 1;
      window.scrollTo(0, 0);
    },
    removeFilter(key) {
      this.jobsStore.searchFilters[key] = '';
      this.jobsStore.filterJobs();
      this.currentPage = 1;
      window.scrollTo(0, 0);
    },
    clearAllFilters() {
      this.jobsStore.searchFilters = {
        query: '',
        location: '',
        field: '',
        education: '',
        jobType: ''
      };
      this.jobsStore.filterJobs();
      this.currentPage = 1;
      window.scrollTo(0, 0);
    }
  },
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0); 
    next();
  },
}
</script>

<style scoped>
.job-title {
  transition: text-decoration 0.3s;
}
.job-card:hover .job-title {
  text-decoration: underline;
  color: black;
}
.calendar-icon {
  width: 16px;
  height: 16px;
}
</style>