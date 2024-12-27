<template>
  <div class="container py-5">
    <h2 class="mb-4">Jobs in {{ state }}</h2>
    <div v-if="filteredJobs.length === 0" class="alert alert-warning">
      No jobs found for this location.
    </div>
    <div v-else>
      <div class="row">
        <div class="col-md-6 mb-4" v-for="job in paginatedJobs" :key="job.id">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ job.title }}</h5>
              <p class="card-text">{{ job.company }}</p>
              <p class="card-text">{{ job.location }}</p>
              <router-link :to="'/jobs/' + job.id" class="btn btn-primary"
                >View Details</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" @click.prevent="changePage(currentPage - 1)"
              >Previous</a
            >
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <a class="page-link" @click.prevent="changePage(page)">{{
              page
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <a class="page-link" @click.prevent="changePage(currentPage + 1)"
              >Next</a
            >
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from "@/stores/jobs";

export default {
  data() {
    return {
      state: null,
      currentPage: 1,
      jobsPerPage: 20, // Show 2 jobs per page
    };
  },
  computed: {
    filteredJobs() {
      const jobsStore = useJobsStore();
      return jobsStore.jobs.filter((job) => job.location === this.state);
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      return this.filteredJobs.slice(start, start + this.jobsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredJobs.length / this.jobsPerPage);
    },
  },
  methods: {
    getState() {
      this.state = this.$route.params.state;
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.scrollToTop(); // Scroll to the top when changing pages
      }
    },
  },
  mounted() {
    this.getState();
    this.scrollToTop();
  },
};
</script>

<style scoped>
.job-card {
  margin-bottom: 20px;
}
</style>
