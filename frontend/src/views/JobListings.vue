<template>
  <div class="job-listings-container">
    <div class="container py-4">
      <!-- Mobile Search Toggle -->
      <button
        class="btn btn-primary d-lg-none w-100 mb-3"
        @click="toggleMobileSearch"
      >
        <i class="fas fa-filter me-2"></i>
        Filter Jobs
      </button>

      <div class="row">
        <!-- Main Content -->
        <div class="col-lg-9">
          <!-- Page Header -->
          <div class="page-header mb-4">
            <h1 class="display-6 fw-bold">Browse Jobs</h1>
            <p class="text-muted lead">Discover your next career opportunity</p>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Jobs List -->
          <div v-else>
            <!-- Results Summary -->
            <div
              class="results-summary mb-4 d-flex justify-content-between align-items-center"
            >
              <p class="text-muted mb-0">
                Showing {{ paginatedJobs.length }} of {{ jobs.length }} jobs
              </p>
              <div class="sort-options">
                <select class="form-select form-select-sm">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            <!-- Active Filters -->
            <div v-if="hasActiveFilters" class="active-filters mb-4">
              <div class="d-flex align-items-center gap-2 flex-wrap">
                <span class="text-muted">Active filters:</span>
                <template v-for="(value, key) in activeFilters">
                  <button
                    v-if="value"
                    @click="removeFilter(key)"
                    class="filter-badge"
                    :key="key"
                  >
                    {{ value }}
                    <i class="fas fa-times ms-2"></i>
                  </button>
                </template>
                <button
                  @click="clearAllFilters"
                  class="btn btn-sm btn-outline-secondary"
                >
                  Clear all
                </button>
              </div>
            </div>

            <!-- Jobs Grid -->
            <div class="jobs-grid">
              <div
                v-for="job in paginatedJobs"
                :key="job.id"
                class="job-card-wrapper"
              >
                <router-link :to="'/jobs/' + job.id" class="job-card">
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="d-flex align-items-start gap-3">
                        <img
                          :src="job.employer?.logo_url || '/images/dashboard-default.svg'"
                          :alt="job.employer?.company_name"
                          class="company-logo"
                          width="50"
                          height="50"
                        />
                        <div class="flex-grow-1">
                          <div class="d-flex justify-content-between">
                            <div>
                              <h5 class="card-title mb-1">{{ job.title }}</h5>
                              <p class="company-name mb-2">Company: {{ job.employer?.company_name }}</p>
                            </div>
                            <span v-if="job.is_featured" class="featured-badge">
                              <i class="fas fa-star"></i>
                              Featured
                            </span>
                          </div>

                          <div class="job-meta mb-3">
                            <span class="meta-item">
                              <i class="fas fa-map-marker-alt"></i>
                              Location: {{ job.location }}
                            </span>
                            <span class="meta-item">
                              <i class="fas fa-briefcase"></i>
                              Type: {{ job.type }}
                            </span>
                            <span class="meta-item">
                              <i class="fas fa-money-bill-wave"></i>
                              Salary: ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}
                            </span>
                          </div>

                          <p class="job-description mb-3">
                            Description: {{ job.description.substring(0, 150) }}...
                          </p>

                          <div class="job-tags mb-3">
                            <span class="tag">
                              <i class="fas fa-graduation-cap"></i>
                              Experience: {{ job.experience_level }}
                            </span>
                            <span class="tag">
                              <i class="fas fa-folder"></i>
                              Category: {{ job.category }}
                            </span>
                          </div>

                          <div class="d-flex justify-content-between align-items-center">
                            <div class="job-dates">
                              <span class="posted-date me-3">
                                <i class="fas fa-calendar"></i>
                                Posted: {{ formatDate(job.created_at) }}
                              </span>
                              <span class="deadline-date text-danger">
                                <i class="fas fa-clock"></i>
                                Deadline: {{ formatDate(job.deadline) }}
                              </span>
                            </div>
                            <button class="btn btn-primary btn-sm">
                              View Details <i class="fas fa-arrow-right ms-1"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>

            <!-- Pagination -->
            <nav
              v-if="totalPages > 1"
              class="mt-5"
              aria-label="Job listings pagination"
            >
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button
                    class="page-link"
                    @click="changePage(currentPage - 1)"
                    :disabled="currentPage === 1"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>

                <li
                  v-for="page in displayedPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button class="page-link" @click="changePage(page)">
                    {{ page }}
                  </button>
                </li>

                <li
                  class="page-item"
                  :class="{ disabled: currentPage === totalPages }"
                >
                  <button
                    class="page-link"
                    @click="changePage(currentPage + 1)"
                    :disabled="currentPage === totalPages"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Sidebar -->
        <div
          class="col-lg-3 search-sidebar-wrapper"
          :class="{ 'mobile-search-active': showMobileSearch }"
        >
          <div class="search-sidebar-overlay" @click="toggleMobileSearch"></div>
          <div class="search-sidebar">
            <div
              class="d-flex justify-content-between align-items-center d-lg-none mb-3"
            >
              <h5 class="mb-0">Filter Jobs</h5>
              <button class="btn-close" @click="toggleMobileSearch"></button>
            </div>
            <SearchFilter @filter-applied="applyFilters" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.job-listings-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-top: 2rem;
}

.page-header {
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 1rem;
}

.search-sidebar-wrapper {
  position: relative;
  z-index: 1030;
}

.search-sidebar {
  position: sticky;
  top: 2rem;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.jobs-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.job-card {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-4px);
}

.job-card .card {
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.job-card:hover .card {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.company-logo {
  border-radius: 8px;
  object-fit: cover;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-title {
  color: #1f2937;
  font-weight: 600;
}

.company-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.featured-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-badge i {
  color: #f59e0b;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4b5563;
  font-size: 0.875rem;
}

.meta-item i {
  color: #3b82f6;
  width: 16px;
}

.job-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag {
  background: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.tag i {
  color: #3b82f6;
}

.job-dates {
  font-size: 0.875rem;
  color: #6b7280;
}

.deadline-date {
  color: #ef4444;
}

.posted-date i,
.deadline-date i {
  margin-right: 0.5rem;
}

.pagination {
  margin-bottom: 2rem;
}

.page-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50% !important;
  margin: 0 0.25rem;
  color: #2c3e50;
  border: none;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.page-link:hover {
  background-color: #e9ecef;
  color: #2c3e50;
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.page-item.active .page-link {
  background-color: #2c3e50;
  color: white;
}

.page-item.disabled .page-link {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

@media (max-width: 991px) {
  .search-sidebar-wrapper {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .search-sidebar-wrapper.mobile-search-active {
    right: 0;
    visibility: visible;
  }

  .search-sidebar {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 100%;
    margin: 0;
    border-radius: 0;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .mobile-search-active .search-sidebar {
    transform: translateX(0);
  }

  .search-sidebar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

/* Responsive Job Cards */
.job-card {
  height: 100%;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.meta-item {
  font-size: 0.875rem;
  white-space: nowrap;
}

@media (max-width: 576px) {
  .job-card .company-logo {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 1rem;
  }

  .company-name {
    font-size: 0.875rem;
  }

  .job-meta {
    font-size: 0.75rem;
  }

  .posted-date {
    font-size: 0.75rem;
  }
}

/* Pagination Responsive */
@media (max-width: 576px) {
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .page-link {
    width: 35px;
    height: 35px;
    font-size: 0.875rem;
  }
}

/* Quick Actions Responsive */
@media (max-width: 768px) {
  .results-summary {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .sort-options {
    width: 100%;
  }

  .active-filters {
    justify-content: center;
  }

  .job-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .job-dates {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>

<script>
import SearchFilter from "@/components/SearchFilter.vue";
import { jobService } from "@/services/jobService";

export default {
  name: "JobListings",
  components: {
    SearchFilter,
  },

  data() {
    return {
      jobs: [],
      isLoading: false,
      currentPage: 1,
      itemsPerPage: 10,
      showMobileSearch: false,
      filters: {
        keyword: "",
        location: "",
        category: "",
        type: "",
        experience_level: "",
        min_salary: "",
        max_salary: "",
        is_featured: false
      }
    };
  },

  computed: {
    hasActiveFilters() {
      return Object.values(this.filters).some(value => 
        value !== "" && value !== false && value !== null
      );
    },

    activeFilters() {
      return Object.entries(this.filters)
        .filter(([_, value]) => value !== "" && value !== false && value !== null)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    },

    totalPages() {
      return Math.ceil(this.jobs.length / this.itemsPerPage);
    },

    paginatedJobs() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.jobs.slice(start, end);
    },

    displayedPages() {
      if (this.totalPages <= 7) {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
      }

      const pages = [];
      if (this.currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(this.totalPages);
      }
      return pages;
    }
  },

  methods: {
    async loadJobs() {
      this.isLoading = true;
      try {
        const response = await jobService.getAllJobs();
        this.jobs = response.data;
        // Reset to first page when loading new jobs
        this.currentPage = 1;
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async applyFilters(filters) {
      this.isLoading = true;
      try {
        const response = await jobService.searchJobs(filters);
        this.jobs = response.data;
        this.filters = { ...filters };
        // Reset to first page when applying filters
        this.currentPage = 1;
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        this.isLoading = false;
      }
    },

    changePage(page) {
      if (page === "..." || page === this.currentPage) return;
      this.currentPage = page;
      window.scrollTo(0, 0);
    },

    removeFilter(key) {
      const newFilters = { ...this.filters };
      newFilters[key] = "";
      this.applyFilters(newFilters);
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
      this.loadJobs();
    },

    toggleMobileSearch() {
      this.showMobileSearch = !this.showMobileSearch;
    },

    formatDate(date) {
      if (!date) return "";
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(date).toLocaleDateString("en-US", options);
    },

    formatSalary(salary) {
      if (!salary) return "0.00";
      return Number(salary).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  },
  
  mounted() {
    this.loadJobs();
  }
};
</script>
