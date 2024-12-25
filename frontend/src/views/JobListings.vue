<template>
  <div class="container py-5">
    <h1 class="mb-4">Job Listings</h1>
    <div class="row">
      <div class="col-md-9">
        <div class="row">
          <div class="col-12 mb-4" v-for="job in paginatedJobs" :key="job.id">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div>
                    <h5 class="card-title">{{ job.title }}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">
                      {{ job.company }}
                    </h6>
                  </div>
                </div>
                <p class="card-text">{{ job.description }}</p>
                <p class="card-text">
                  <small class="text-muted">Location: {{ job.location }}</small>
                </p>
                <p class="card-text">
                  <small class="text-muted"
                    >Posted on: {{ job.postedDate }}</small
                  >
                </p>
                <router-link
                  :to="{ name: 'JobDetails', params: { id: job.id } }"
                  class="btn btn-primary"
                  >View Details</router-link
                >
              </div>
            </div>
          </div>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" @click="changePage(currentPage - 1)"
                >Previous</a
              >
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" @click="changePage(page)">{{ page }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
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
import { useJobsStore } from "@/stores/jobs";
import SearchFilter from "@/components/SearchFilter.vue";

export default {
  name: "JobListings",
  components: {
    SearchFilter,
  },
  data() {
    return {
      currentPage: 1,
      jobsPerPage: 20,
    };
  },
  computed: {
    allJobs() {
      const jobs = this.jobsStore.getLatestJobs();
      return jobs;
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      return this.allJobs.slice(start, start + this.jobsPerPage);
    },
    totalPages() {
      return Math.ceil(this.allJobs.length / this.jobsPerPage);
    },
    filteredJobs() {
      return this.jobsStore.filteredJobs;
    },
  },
  setup() {
    const jobsStore = useJobsStore();
    jobsStore.initializeJobs();
    return { jobsStore };
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    applyFilters(filters) {
      this.jobsStore.searchFilters = filters;
      this.jobsStore.filterJobs();
      this.currentPage = 1;
      console.log("Filtered Jobs:", this.jobsStore.filteredJobs);
    },
  },
};
</script>

<style scoped></style>
