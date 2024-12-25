<template>
  <div class="container py-5">
    <h1 class="mb-4">Featured Jobs</h1>
    <div class="row">
      <div class="col-md-6 mb-4" v-for="job in paginatedJobs" :key="job.id">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <img
                :src="job.companyLogo"
                alt="Company Logo"
                class="company-logo me-3"
              />
              <div>
                <h5 class="card-title mb-1">{{ job.title }}</h5>
                <h6 class="text-muted">{{ job.company }}</h6>
              </div>
            </div>
            <p class="card-text">{{ job.description }}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-light text-dark">{{ job.location }}</span>
              <span class="text-primary">{{ job.salary }}/year</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click="changePage(currentPage - 1)">Previous</a>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" @click="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" @click="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useJobsStore } from "@/stores/jobs";

export default {
  name: "FeaturedJobs",
  data() {
    return {
      currentPage: 1,
      jobsPerPage: 10,
    };
  },
  computed: {
    featuredJobs() {
      return this.jobsStore.getAllFeaturedJobs();
    },
    paginatedJobs() {
      const start = (this.currentPage - 1) * this.jobsPerPage;
      return this.featuredJobs.slice(start, start + this.jobsPerPage);
    },
    totalPages() {
      return Math.ceil(this.featuredJobs.length / this.jobsPerPage);
    },
  },
  setup() {
    const jobsStore = useJobsStore();
    return { jobsStore };
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
</script>

<style scoped>
.company-logo {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Add this CSS rule for pagination */
.pagination .page-link {
  cursor: pointer; /* Change cursor to pointer on hover */
}
</style>
