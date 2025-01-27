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
                          width="80"
                          height="80"
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
            :initial-filters="jobsStore.searchFilters"
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
import { useJobsStore } from '@/stores/jobs';

export default {
  name: "JobListings",
  
  components: {
    SearchFilter,
  },

  data() {
    return {
      showMobileSearch: false,
      pagination: {
        currentPage: 1,
        perPage: 10,
      },
      error: null
    };
  },

  computed: {
    jobsStore() {
      return useJobsStore();
    },

    isLoading() {
      return this.jobsStore.loading;
    },

    error() {
      return this.jobsStore.error;
    },

    allJobs() {
      // Use filteredJobs from store
      return this.jobsStore.filteredJobs || [];
    },

    paginatedJobs() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = start + this.pagination.perPage;
      return this.allJobs.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.allJobs.length / this.pagination.perPage);
    },

    paginationInfo() {
      const start = (this.pagination.currentPage - 1) * this.pagination.perPage;
      const end = Math.min(start + this.pagination.perPage, this.allJobs.length);
      return {
        from: this.allJobs.length ? start + 1 : 0,
        to: end,
        total: this.allJobs.length
      };
    },

    hasActiveFilters() {
      return Object.values(this.jobsStore.searchFilters).some(value => {
        if (typeof value === 'boolean') return value;
        return value && value !== '';
      });
    }
  },

  methods: {
    async loadJobs() {
      try {
        await this.jobsStore.fetchJobs();
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.pagination.currentPage = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    toggleMobileSearch() {
      this.showMobileSearch = !this.showMobileSearch;
      const searchFilter = document.querySelector('.search-filter');
      if (searchFilter) {
        searchFilter.classList.toggle('show');
      }
    },

    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    formatSalary(salary) {
      if (!salary) return 'Not specified';
      return new Intl.NumberFormat('en-NG', {
        maximumFractionDigits: 0
      }).format(salary);
    },

    async handleSearch(searchFilters) {
      this.pagination.currentPage = 1;
      try {
        await this.jobsStore.updateSearchFilters(searchFilters);
      } catch (error) {
        console.error('Error searching jobs:', error);
      }
      if (window.innerWidth < 992) {
        this.toggleMobileSearch();
      }
    },

    async resetAndLoadAllJobs() {
      this.pagination.currentPage = 1;
      try {
        await this.jobsStore.resetState();
      } catch (error) {
        console.error('Error resetting search:', error);
      }
    }
  },
  
  async created() {
    await this.jobsStore.initialize();
  }
};
</script>

<style scoped>
.job-listings-container {
  background-color: #f9fafb;
  min-height: 100vh;
}

.page-header h1 {
  color: #1f2937;
}

.search-sidebar-wrapper {
  position: relative;
}

.job-card {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.2s;
}

.job-card:hover {
  transform: translateY(-2px);
}

.job-card .card {
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
}

.job-card:hover .card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.company-logo {
  object-fit: cover;
  border-radius: 8px;
}

.company-name {
  color: #6b7280;
  font-size: 0.875rem;
}

.featured-badge {
  background-color: #fef3c7;
  color: #d97706;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.job-description {
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.job-dates {
  font-size: 0.75rem;
  color: #6b7280;
}

.posted-date,
.deadline-date {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-wrapper {
  margin-top: 2rem;
}

.page-link {
  color: #3b82f6;
  padding: 0.5rem 0.75rem;
}

.page-item.active .page-link {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.results-summary {
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 991.98px) {
  .search-sidebar-wrapper {
    margin-bottom: 2rem;
  }
}
</style>