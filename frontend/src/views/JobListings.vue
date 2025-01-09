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
            <p class="mt-3">Searching for jobs...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>

          <!-- Jobs List -->
          <div v-else>
            <!-- Results Summary -->
            <div class="results-summary mb-4 d-flex justify-content-between align-items-center">
              <p class="text-muted mb-0">
                <span v-if="hasActiveFilters" class="badge bg-info me-2">Filtered Results</span>
                Showing {{ paginationInfo.from }} - {{ paginationInfo.to }} of {{ paginationInfo.total }} jobs
              </p>
              <div class="sort-options">
                <select class="form-select form-select-sm">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            <!-- No Results -->
            <div v-if="allJobs.length === 0" class="text-center py-5">
              <div class="alert alert-info" role="alert">
                No jobs found matching your criteria.
              </div>
            </div>

            <!-- Jobs Grid -->
            <div v-else class="jobs-grid">
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
            <div v-if="totalPages > 1" class="pagination-wrapper mt-4">
              <nav aria-label="Job listings pagination">
                <ul class="pagination justify-content-center">
                  <!-- First Page -->
                  <li :class="['page-item', { disabled: pagination.currentPage === 1 }]">
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(1)"
                      aria-label="First page"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>

                  <!-- Previous Page -->
                  <li :class="['page-item', { disabled: pagination.currentPage === 1 }]">
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(pagination.currentPage - 1)"
                      aria-label="Previous page"
                    >
                      <span aria-hidden="true">&lsaquo;</span>
                    </a>
                  </li>

                  <!-- Page Numbers -->
                  <li
                    v-for="page in totalPages"
                    :key="page"
                    :class="[
                      'page-item',
                      {
                        active: pagination.currentPage === page,
                      }
                    ]"
                  >
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(page)"
                    >
                      {{ page }}
                    </a>
                  </li>

                  <!-- Next Page -->
                  <li :class="['page-item', { disabled: pagination.currentPage === totalPages }]">
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(pagination.currentPage + 1)"
                      aria-label="Next page"
                    >
                      <span aria-hidden="true">&rsaquo;</span>
                    </a>
                  </li>

                  <!-- Last Page -->
                  <li :class="['page-item', { disabled: pagination.currentPage === totalPages }]">
                    <a
                      class="page-link"
                      href="#"
                      @click.prevent="changePage(totalPages)"
                      aria-label="Last page"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
              
              <!-- Pagination Info -->
              <div class="text-center mt-2">
                <small class="text-muted">
                  Page {{ paginationInfo.currentPage }} of {{ paginationInfo.lastPage }}
                  (Showing {{ paginationInfo.from }} - {{ paginationInfo.to }} of {{ paginationInfo.total }} jobs)
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div
          class="col-lg-3 search-sidebar-wrapper"
          :class="{ 'show-mobile': showMobileSearch }"
        >
          <SearchFilter
            :initial-filters="filters"
            @search="handleSearch"
            @reset="resetAndLoadAllJobs"
          />
        </div>
      </div>
    </div>
  </div>
</template>

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
      allJobs: [], // Store all jobs
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
      },
      isLoading: false,
      error: null,
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
    paginatedJobs() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.allJobs.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.allJobs.length / this.pagination.perPage);
    },

    paginationInfo() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage + 1;
      const end = Math.min(start + this.pagination.perPage - 1, this.allJobs.length);
      return {
        currentPage: this.pagination.currentPage,
        lastPage: this.totalPages,
        total: this.allJobs.length,
        from: start,
        to: end
      };
    },

    hasActiveFilters() {
      return Object.values(this.filters).some(value => {
        if (typeof value === 'boolean') {
          return value;
        }
        return value && value.length > 0;
      });
    }
  },

  methods: {
    async loadJobs() {
      try {
        this.isLoading = true;
        this.error = null;
        const response = await jobService.getAllJobs();
        
        if (response?.data) {
          this.allJobs = response.data;
          this.pagination.total = response.total || this.allJobs.length;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        this.error = 'Failed to load jobs. Please try again.';
        this.allJobs = [];
      } finally {
        this.isLoading = false;
      }
    },

    changePage(newPage) {
      const page = parseInt(newPage);
      if (!isNaN(page) && page >= 1 && page <= this.totalPages) {
        this.pagination.currentPage = page;
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
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
        maximumFractionDigits: 2,
        style: 'currency',
        currency: 'NGN'
      });
    },

    async handleSearch(searchFilters) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await jobService.searchJobs(searchFilters);
        
        if (response?.data) {
          this.allJobs = response.data;
          this.pagination = {
            currentPage: response.current_page || 1,
            perPage: response.per_page || 10,
            total: response.total || this.allJobs.length
          };
          this.filters = { ...searchFilters };
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error searching jobs:', error);
        this.error = error.response?.data?.message || 'Failed to search jobs. Please try again.';
        this.allJobs = [];
      } finally {
        this.isLoading = false;
        // Close mobile search if open
        if (this.showMobileSearch) {
          this.toggleMobileSearch();
        }
      }
    },

    async resetAndLoadAllJobs() {
      this.isLoading = true;
      this.error = null;

      try {
        // Reset filters
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

        // Load all jobs
        const response = await jobService.getAllJobs();
        if (response?.data) {
          this.allJobs = response.data;
          this.pagination.total = response.total || this.allJobs.length;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        this.error = 'Failed to load jobs. Please try again.';
        this.allJobs = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
  
  mounted() {
    this.loadJobs();
  }
};
</script>

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

  .search-sidebar-wrapper.show-mobile {
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

  .show-mobile .search-sidebar {
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