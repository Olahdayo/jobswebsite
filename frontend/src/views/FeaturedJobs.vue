<template>
  <div class="container py-4">
    <h1 class="mb-4">Featured Jobs</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- No Featured Jobs -->
    <div v-else-if="!featuredJobs.length" class="text-center py-5">
      <div class="alert alert-info">
        <i class="fas fa-info-circle me-2"></i>
        No featured jobs available at the moment.
      </div>
    </div>

    <!-- Featured Jobs List -->
    <div v-else>
      <p class="text-muted mb-4">
        Showing {{ paginatedJobs.length }} of {{ featuredJobs.length }} featured
        jobs
      </p>

      <div class="row g-4">
        <div v-for="job in paginatedJobs" :key="job.id" class="col-12">
          <div class="card job-card h-100">
            <div class="card-body">
              <div class="d-flex align-items-start gap-3">
                <img
                  :src="job.companyLogo || '/images/dashboard-default.svg'"
                  :alt="job.company"
                  class="company-logo"
                  width="60"
                  height="60"
                />
                <div class="flex-grow-1">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 class="card-title mb-1">{{ job.title }}</h5>
                      <p class="text-muted mb-2">{{ job.company }}</p>
                    </div>
                    <span class="badge bg-warning text-dark">
                      <i class="fas fa-star me-1"></i>
                      Featured
                    </span>
                  </div>
                  <p class="card-text mb-3">{{ job.description }}</p>
                  <div class="d-flex flex-wrap gap-2 mb-3">
                    <span class="badge bg-light text-dark">
                      <i class="fas fa-map-marker-alt me-1"></i>
                      {{ job.location }}
                    </span>
                    <span class="badge bg-light text-dark">
                      <i class="fas fa-briefcase me-1"></i>
                      {{ job.type }}
                    </span>
                    <span class="badge bg-light text-dark">
                      <i class="fas fa-graduation-cap me-1"></i>
                      {{ job.educationLevel }}
                    </span>
                    <span class="badge bg-light text-success">
                      <i class="fas fa-money-bill-wave me-1"></i>
                      {{ job.salary }}/month
                    </span>
                  </div>
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <small class="text-muted">
                      <i class="fas fa-clock me-1"></i>
                      Posted {{ formatDate(job.postedDate) }}
                    </small>
                    <router-link
                      :to="`/jobs/${job.id}`"
                      class="btn btn-primary btn-sm"
                    >
                      View Details
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav
        v-if="totalPages > 1"
        class="mt-4"
        aria-label="Featured jobs pagination"
      >
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>

          <li
            v-for="page in totalPages"
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
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useJobsStore } from "@/stores/jobs";

export default {
  name: "FeaturedJobs",

  setup() {
    const jobsStore = useJobsStore();
    const isLoading = ref(true);
    const featuredJobs = ref([]);
    const currentPage = ref(1);
    const jobsPerPage = 20;

    const totalPages = computed(() =>
      Math.ceil(featuredJobs.value.length / jobsPerPage)
    );

    const paginatedJobs = computed(() => {
      const startIndex = (currentPage.value - 1) * jobsPerPage;
      const endIndex = startIndex + jobsPerPage;
      return featuredJobs.value.slice(startIndex, endIndex);
    });

    const loadFeaturedJobs = () => {
      featuredJobs.value = jobsStore.featuredActiveJobs;
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    onMounted(async () => {
      try {
        await jobsStore.initializeJobs();
        loadFeaturedJobs();
      } catch (error) {
        console.error("Error loading featured jobs:", error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      featuredJobs,
      paginatedJobs,
      isLoading,
      currentPage,
      totalPages,
      formatDate,
      changePage,
    };
  },
};
</script>

<style scoped>
.job-card {
  transition: transform 0.2s;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.company-logo {
  object-fit: cover;
  border-radius: 8px;
}

.badge {
  font-weight: 500;
  padding: 0.5em 1em;
}

.card-title {
  color: #2c3e50;
  font-weight: 600;
}

.text-muted {
  color: #6c757d !important;
}

.btn-primary {
  padding: 0.5rem 1.5rem;
}

.alert {
  max-width: 500px;
  margin: 0 auto;
}

.pagination {
  margin-bottom: 2rem;
}

.page-link {
  color: #2c3e50;
  border-color: #dee2e6;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.page-item.active .page-link {
  background-color: #2c3e50;
  border-color: #2c3e50;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  cursor: not-allowed;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #2c3e50;
}

.page-item.active .page-link:hover {
  background-color: #2c3e50;
  color: white;
}
</style>
