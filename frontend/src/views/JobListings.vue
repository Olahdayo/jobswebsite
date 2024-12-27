<template>
  <div class="job-listings-container">
    <div class="container py-4">
      <div class="row">
        <!-- Main Content -->
        <div class="col-md-9">
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
                          :src="job.companyLogo || '/path/to/default-logo.png'"
                          :alt="job.company"
                          class="company-logo"
                          width="50"
                          height="50"
                        />
                        <div class="flex-grow-1">
                          <div class="d-flex justify-content-between">
                            <div>
                              <h5 class="card-title mb-1">{{ job.title }}</h5>
                              <p class="company-name mb-2">{{ job.company }}</p>
                            </div>
                            <span v-if="job.featured" class="featured-badge">
                              <i class="fas fa-star"></i>
                            </span>
                          </div>
                          <div class="job-meta mb-3">
                            <span class="meta-item">
                              <i class="fas fa-map-marker-alt"></i>
                              {{ job.location }}
                            </span>
                            <span class="meta-item">
                              <i class="fas fa-briefcase"></i>
                              {{ job.type }}
                            </span>
                            <span class="meta-item salary">
                              <i class="fas fa-money-bill-wave"></i>
                              {{ job.salary }}
                            </span>
                          </div>
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <span class="posted-date">
                              <i class="fas fa-clock"></i>
                              {{ formatPostedDate(job.postedDate) }}
                            </span>
                            <button class="btn btn-outline-primary btn-sm">
                              View Details
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
        <div class="col-md-3">
          <div class="search-sidebar">
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

.search-sidebar {
  position: sticky;
  top: 2rem;
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
  transition: all 0.3s ease;
}

.job-card:hover {
  transform: translateY(-3px);
}

.job-card .card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.job-card:hover .card {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.company-logo {
  object-fit: cover;
  border-radius: 8px;
}

.company-name {
  color: #6c757d;
  font-size: 0.9rem;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
}

.meta-item {
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-item.salary {
  color: #28a745;
  font-weight: 500;
}

.featured-badge {
  color: #ffc107;
  font-size: 1.2rem;
}

.posted-date {
  font-size: 0.85rem;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-badge {
  background-color: #e9ecef;
  border: none;
  border-radius: 20px;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  color: #495057;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.filter-badge:hover {
  background-color: #dee2e6;
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

@media (max-width: 768px) {
  .search-sidebar {
    position: static;
    margin-top: 2rem;
  }
}

@media (min-width: 992px) {
  .jobs-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>

<script>
import { ref, computed, onMounted } from "vue";
import { useJobsStore } from "@/stores/jobs";
import SearchFilter from "@/components/SearchFilter.vue";

export default {
  name: "JobListings",
  components: {
    SearchFilter,
  },

  setup() {
    const jobsStore = useJobsStore();
    const isLoading = ref(true);
    const currentPage = ref(1);
    const jobsPerPage = 20;

    const jobs = computed(() => jobsStore?.filteredJobs || []);

    const totalPages = computed(() =>
      Math.ceil(jobs.value.length / jobsPerPage)
    );

    const paginatedJobs = computed(() => {
      const startIndex = (currentPage.value - 1) * jobsPerPage;
      const endIndex = startIndex + jobsPerPage;
      return jobs.value.slice(startIndex, endIndex);
    });

    const displayedPages = computed(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages.value; i++) {
        if (
          i === 1 ||
          i === totalPages.value ||
          (i >= currentPage.value - delta && i <= currentPage.value + delta)
        ) {
          range.push(i);
        }
      }

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      });

      return rangeWithDots;
    });

    const hasActiveFilters = computed(() => {
      return Object.values(jobsStore?.searchFilters || {}).some(
        (value) => value
      );
    });

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const formatPostedDate = (date) => {
      const days = Math.floor(
        (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
      );
      if (days === 0) return "Today";
      if (days === 1) return "Yesterday";
      if (days < 7) return `${days} days ago`;
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    const applyFilters = (filters) => {
      if (jobsStore) {
        jobsStore.searchFilters = filters;
        jobsStore.filterJobs();
        currentPage.value = 1;
      }
    };

    const removeFilter = (key) => {
      if (jobsStore) {
        jobsStore.searchFilters[key] = "";
        jobsStore.filterJobs();
        currentPage.value = 1;
      }
    };

    const clearAllFilters = () => {
      if (jobsStore) {
        jobsStore.searchFilters = {
          query: "",
          location: "",
          field: "",
          education: "",
          jobType: "",
        };
        jobsStore.filterJobs();
        currentPage.value = 1;
      }
    };

    onMounted(async () => {
      try {
        await jobsStore.initializeJobs();
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      jobs,
      paginatedJobs,
      isLoading,
      currentPage,
      totalPages,
      displayedPages,
      hasActiveFilters,
      activeFilters: jobsStore?.searchFilters,
      formatPostedDate,
      changePage,
      applyFilters,
      removeFilter,
      clearAllFilters,
    };
  },
};
</script>
