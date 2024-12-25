<template>
  <div>
    <!-- Welcome hero section -->
    <section class="hero-section text-white position-relative">
      <div class="hero-overlay"></div>
      <div class="container position-relative">
        <div class="row min-vh-75 align-items-center py-5">
          <div class="col-lg-8 text-center text-lg-start">
            <h1 class="display-4 fw-bold mb-4">Unlock Your Future</h1>
            <p class="lead mb-5">
              Dive into a world of opportunities and discover your perfect
              match! Easily browse, apply, and connect with top employers in
              your industry.
            </p>
            <div
              class="d-flex gap-3 justify-content-center justify-content-lg-start"
            >
              <button @click="scrollToJobSection" class="btn btn-light btn-lg">
                See Jobs
              </button>
              <Button
                to="/signup"
                label="Join Us"
                buttonType="btn-outline-light"
                size="btn-lg"
              >
                <i class="bi bi-person-plus me-2"></i>
              </Button>
            </div>
          </div>
          <div class="col-lg-4 d-none d-lg-block">
            <div class="hero-stats p-4 bg-white text-dark rounded-3 shadow">
              <h4 class="mb-3">Quick Stats</h4>
              <div class="d-flex justify-content-between mb-3">
                <div class="text-center">
                  <h3 class="fw-bold text-success">
                    {{ jobsStore.jobs.length }}
                  </h3>
                  <p class="text-muted mb-0">Active Jobs</p>
                </div>
                <div class="text-center">
                  <h3 class="fw-bold text-dark">
                    {{ Object.keys(jobsByState).length }}
                  </h3>
                  <p class="text-muted mb-0">Locations</p>
                </div>
                <div class="text-center">
                  <h3 class="fw-bold text-info">
                    {{ Object.keys(jobsByField).length }}
                  </h3>
                  <p class="text-muted mb-0">Categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div id="job-section" class="container py-5">
      <div class="row">
        <div class="col-lg-8">
          <!-- Featured Jobs -->
          <section class="mb-5">
            <div
              id="featured-jobs"
              class="featured-jobs-container border rounded-3 bg-white p-4"
            >
              <div class="mb-4">
                <h2 class="m-0">Featured Jobs</h2>
              </div>
              <div class="row g-3">
                <div class="col-md-6" v-for="job in featuredJobs" :key="job.id">
                  <div class="job-card border-0 shadow-sm p-3 bg-white">
                    <router-link :to="'/jobs/' + job.id">
                      <div class="d-flex align-items-start gap-3">
                        <img
                          :src="
                            job.companyLogo
                              ? job.companyLogo
                              : defaultCompanyLogo
                          "
                          alt="Company Logo"
                          class="company-logo flex-shrink-0"
                          width="40"
                          height="40"
                        />
                        <div>
                          <h5 class="mb-1">{{ job.title }}</h5>
                          <p class="text-muted mb-2 small">{{ job.company }}</p>
                          <div class="d-flex gap-2">
                            <span class="badge bg-light text-dark">{{
                              job.location
                            }}</span>
                            <span class="badge bg-light text-dark">{{
                              job.type
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="text-center mt-4 pt-3 border-top">
                <Button
                  to="/featured-jobs"
                  label="See All Featured Jobs"
                  buttonType="btn btn-outline-primary"
                />
              </div>
            </div>
          </section>

          <!-- Latest Jobs -->
          <section>
            <h2 class="mb-4">Latest Jobs</h2>
            <div class="row g-3">
              <div class="col-12" v-for="job in latestJobs" :key="job.id">
                <div class="job-card border-0 shadow-sm p-4 bg-white">
                  <div class="d-flex align-items-start gap-4">
                    <img
                      :src="
                        job.companyLogo ? job.companyLogo : defaultCompanyLogo
                      "
                      alt="Company Logo"
                      class="company-logo flex-shrink-0"
                      width="60"
                      height="60"
                    />
                    <div>
                      <h5 class="mb-1">{{ job.title }}</h5>
                      <p class="text-muted mb-2 small">{{ job.company }}</p>
                      <p class="text-muted mb-2 small">
                        <i class="bi bi-calendar3 me-2"></i>
                        {{ formatJobDate(job.postedDate) }}
                      </p>
                      <p class="mb-3">{{ job.description }}</p>
                      <div class="d-flex gap-2">
                        <span class="badge bg-light text-dark">{{
                          job.location
                        }}</span>
                        <span class="badge bg-light text-dark">{{
                          job.type
                        }}</span>
                        <span class="badge bg-light text-dark"
                          >{{ job.salary }}/month</span
                        >
                      </div>
                      <div class="mt-3">
                        <Button
                          :to="'/jobs/' + job.id"
                          label="View Details"
                          buttonType="btn btn-outline-primary btn-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center mt-4">
              <Button
                to="/JobListings"
                label="Load More"
                buttonType="btn btn-outline-primary"
              />
            </div>
          </section>
        </div>

        <!-- Right side - Sidebar -->
        <div class="col-lg-4">
          <Sidebar
            :recentPostings="recentPostings"
            :jobsByState="jobsByState"
            :jobsByField="jobsByField"
            :formatDate="formatDate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from "@/stores/jobs";
import Sidebar from "@/components/Sidebar.vue";
import Button from "@/components/Button.vue";
import Navbar from "@/components/Navbar.vue";
// import { useRouter } from "vue-router";

export default {
  name: "Home",
  components: {
    Sidebar,
    Button,
    Navbar,
  },
  data() {
    return {
      // These are the filters to find  job
      searchFilters: {
        query: "",
        location: "",
        field: "",
        education: "",
        jobType: "",
      },
      showMobileFilters: false,
      isScrolled: false,
      showSearchFilters: false,
      defaultCompanyLogo: "/images/dashboard-default.svg",
      jobsToShow: 10,
    };
  },
  computed: {
    featuredJobs() {
      return this.jobsStore.getFeaturedJobs();
    },
    // Gets the newest jobs
    latestJobs() {
      return this.jobsStore.getLatestJobs().slice(0, this.jobsToShow);
    },
  },
  methods: {
    // search button find jobs!
    handleSearch() {
      try {
        this.jobsStore.searchFilters = { ...this.searchFilters };
        this.jobsStore.filterJobs();
        this.router.push("/jobs");
      } catch (error) {}
    },
    // Handles the mobile filter menu submission
    applyMobileFilters() {
      this.showMobileFilters = false;
      this.handleSearch();
    },
    // Formats the date
    formatJobDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      return `${day} ${month}`;
    },

    formatDate(dateString) {
      const days = Math.floor(
        (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)
      );
      return days === 0
        ? "Today"
        : days === 1
        ? "Yesterday"
        : `${days} days ago`;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 100;
    },
    scrollToFeaturedJobs() {
      const featuredJobsSection = document.getElementById("featured-jobs");
      if (featuredJobsSection) {
        featuredJobsSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    scrollToJobSection() {
      const jobSection = document.getElementById("job-section");
      if (jobSection) {
        jobSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    toggleSearchFilters() {
      this.showSearchFilters = !this.showSearchFilters;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  setup() {
    const jobsStore = useJobsStore();
    jobsStore.initializeJobs();
    return {
      jobsStore,
      recentPostings: [...jobsStore.jobs]
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, 5),
      jobsByState: jobsStore.jobs.reduce((acc, job) => {
        acc[job.location] = (acc[job.location] || 0) + 1;
        return acc;
      }, {}),
      jobsByField: jobsStore.jobs.reduce((acc, job) => {
        acc[job.field] = (acc[job.field] || 0) + 1;
        return acc;
      }, {}),
      formatDate: (dateString) => {
        const days = Math.floor(
          (new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24)
        );
        return days === 0
          ? "Today"
          : days === 1
          ? "Yesterday"
          : `${days} days ago`;
      },
    };
  },
};
</script>

<style scoped>
/* Hero section styles */
.hero-section {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: url(images/Jobigrid.jpg) center center / cover;
  position: relative;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(22, 60, 104, 0.9);
}

.hero-section .container {
  padding: 0;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-stats {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

.search-section {
  padding: 1rem 0;
  z-index: 1020;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: rgba(248, 249, 250, 0.95);
  backdrop-filter: blur(8px);
  margin-top: 72px;
  transition: all 0.3s ease;
}

.search-section.search-scrolled {
  padding: 0.25rem 0;
  margin-top: 56px;
}

.search-section.sticky-top {
  margin-top: 0;
  transform: translateY(72px);
}

.search-section.sticky-top.search-scrolled {
  transform: translateY(56px);
}

.search-section.search-scrolled .form-control,
.search-section.search-scrolled .form-select {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  height: 30px;
  font-size: 0.875rem;
}

.company-logo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}

.form-control {
  padding-right: 2.5rem;
}

.btn-link:hover {
  background: none;
}

.btn-link i {
  font-size: 1rem;
}

.btn i {
  font-size: 1rem;
}

.btn.rounded-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.job-card {
  transition: transform 0.2s;
  cursor: pointer;
  border-radius: 8px;
}

.job-card:hover {
  transform: translateY(-2px);
}

/* Sidebar styles */
.sticky-sidebar {
  position: sticky;
  top: 140px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.sidebar-widget {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.list-group-item {
  background: #f8f9fa;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background: #e9ecef;
}

.featured-jobs-container {
  border: 1px solid #e5e5e5;
}

.custom-scrollbar {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.search-section.sticky-top {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transform: translateY(72px);
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.job-card a {
  text-decoration: none;
  color: #000;
}

.job-card a:hover {
  color: #000;
}

@media (max-width: 991.98px) {
  .sticky-sidebar {
    position: static;
    max-height: none;
    margin-top: 2rem;
  }
  .search-section {
    margin-top: 56px;
  }
  .search-section.sticky-top {
    margin-top: 0;
    transform: translateY(56px);
  }
  .search-section.search-scrolled {
    transform: translateY(56px);
    padding: 0.25rem 0;
  }
}
</style>
