<template>
  <div>
    <!-- Welcome hero section -->
    <section class="hero-section text-white position-relative">
      <div class="hero-overlay"></div>
      <div class="container position-relative">
        <div class="row min-vh-75 align-items-center py-5">
          <div class="col-lg-8 text-center text-lg-start">
            <h1 class="display-4 fw-bold mb-4">Pin down your next career move!</h1>
            <p class="lead mb-5">
              Dive into a world of opportunities and discover your perfect
              match! Easily browse, apply, and connect with top employers in
              your industry.
            </p>
            <div
              class="d-flex gap-3 justify-content-center justify-content-lg-start"
            >
              <button @click="scrollToJobSection" class="btn btn-primary btn-lg btn-glow">
                <span class="btn-content">
                  <i class="bi bi-search me-2"></i>See Jobs
                  <span class="btn-shine"></span>
                </span>
              </button>
              <Button
                to="/signup"
                label="Join Us"
                buttonType="btn-outline-light"
                size="btn-lg"
                class="btn-hover-slide"
              >
                <i class="bi bi-person-plus me-2"></i>
              </Button>
            </div>
          </div>
          <div class="col-lg-4 d-none d-lg-block">
            <div class="hero-stats p-4 bg-white text-dark rounded-3 shadow-lg">
              <div class="mb-4 d-flex justify-content-between align-items-center">
                <h4 class="m-0">Quick Stats</h4>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <div class="text-center stat-card">
                  <div class="stat-icon bg-success-subtle mb-2">
                    <i class="bi bi-briefcase"></i>
                  </div>
                  <h3 class="fw-bold text-success counter">
                    {{ stats.activeJobs }}
                  </h3>
                  <p class="text-muted mb-0">Active Jobs</p>
                </div>
                <div class="text-center stat-card">
                  <div class="stat-icon bg-primary-subtle mb-2">
                    <i class="bi bi-geo-alt"></i>
                  </div>
                  <h3 class="fw-bold text-primary counter">
                    {{ stats.totalLocations }}
                  </h3>
                  <p class="text-muted mb-0">Locations</p>
                </div>
                <div class="text-center stat-card">
                  <div class="stat-icon bg-info-subtle mb-2">
                    <i class="bi bi-grid"></i>
                  </div>
                  <h3 class="fw-bold text-info counter">
                    {{ stats.totalCategories }}
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
              class="featured-jobs-container border-0 rounded-4 bg-white p-4 shadow-hover"
            >
              <div class="mb-4 d-flex justify-content-between align-items-center">
                <h2 class="m-0 section-title">
                  <span class="highlight-text">Featured</span> Jobs
                  <div class="title-underline"></div>
                </h2>
                <div class="featured-badge">
                  <span class="badge-dot"></span>
                  <span class="ms-2">Live Updates</span>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-md-6" v-for="job in featuredJobs" :key="job.id">
                  <router-link 
                    :to="'/jobs/' + job.id" 
                    class="text-decoration-none"
                  >
                    <div class="job-card" :class="{ 'featured-job': job.is_featured }">
                      <div class="card-header">
                        <div class="company-info">
                          <img 
                            :src="job.employer?.logo_url || '/images/dashboard-default.svg'" 
                            :alt="job.employer?.company_name"
                            class="company-logo"
                          />
                          <div>
                            <h5 class="job-title">{{ job.title }}</h5>
                            <p class="company-name">{{ job.employer?.company_name }}</p>
                          </div>
                        </div>
                        <div class="featured-badge" v-if="job.is_featured">
                          <i class="fas fa-star"></i>
                          Featured
                        </div>
                      </div>
                      
                      <div class="card-body">
                        <div class="job-meta">
                          <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Location: {{ job.location }}</span>
                          </div>
                          <div class="meta-item">
                            <i class="fas fa-briefcase"></i>
                            <span>Job Type: {{ job.type }}</span>
                          </div>
                          <div class="meta-item">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>Salary: ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}</span>
                          </div>
                        </div>
                        
                        <p class="job-description">Description: {{ job.description.substring(0, 100) }}...</p>
                        
                        <div class="job-tags">
                          <span class="tag">Experience: {{ job.experience_level }}</span>
                          <span class="tag">Category: {{ job.category }}</span>
                        </div>
                      </div>

                      <div class="card-footer">
                        <div class="deadline">
                          <i class="fas fa-clock"></i>
                          <span>Deadline: {{ formatDate(job.deadline) }}</span>
                        </div>
                        <div class="posted-date">
                          <i class="fas fa-calendar"></i>
                          <span>Posted: {{ formatDate(job.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                  </router-link>
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
                <router-link 
                  :to="'/jobs/' + job.id" 
                  class="text-decoration-none"
                >
                  <div class="job-card" :class="{ 'featured-job': job.is_featured }">
                    <div class="card-header">
                      <div class="company-info">
                        <img 
                          :src="job.employer?.logo_url || '/images/dashboard-default.svg'" 
                          :alt="job.employer?.company_name"
                          class="company-logo"
                        />
                        <div>
                          <h5 class="job-title">{{ job.title }}</h5>
                          <p class="company-name">{{ job.employer?.company_name }}</p>
                        </div>
                      </div>
                      <div class="featured-badge" v-if="job.is_featured">
                        <i class="fas fa-star"></i>
                        Featured
                      </div>
                    </div>
                    
                    <div class="card-body">
                      <div class="job-meta">
                        <div class="meta-item">
                          <i class="fas fa-map-marker-alt"></i>
                          <span>Job Location: {{ job.location }}</span>
                        </div>
                        <div class="meta-item">
                          <i class="fas fa-briefcase"></i>
                          <span>Job Type: {{ job.type }}</span>
                        </div>
                        <div class="meta-item">
                          <i class="fas fa-money-bill-wave"></i>
                          <span>Job Salary: ₦{{ formatSalary(job.min_salary) }} - ₦{{ formatSalary(job.max_salary) }}</span>
                        </div>
                      </div>
                      
                      <p class="job-description">Job Description: {{ job.description.substring(0, 100) }}...</p>
                      
                      <div class="job-tags">
                        <span class="tag">Job Experience: {{ job.experience_level }}</span>
                        <span class="tag">Job Category: {{ job.category }}</span>
                      </div>
                    </div>

                    <div class="card-footer">
                      <div class="deadline">
                        <i class="fas fa-clock"></i>
                        <span>Job Deadline: {{ formatDate(job.deadline) }}</span>
                      </div>
                      <div class="posted-date">
                        <i class="fas fa-calendar"></i>
                        <span>Job Posted: {{ formatDate(job.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </router-link>
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
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { jobService } from '@/services/jobService';
import Sidebar from "@/components/Sidebar.vue";
import Button from "@/components/Button.vue";

export default {
  name: "Home",
  components: {
    Sidebar,
    Button,
  },

  data() {
    return {
      featuredJobs: [],
      latestJobs: [],
      isLoading: false,
      stats: {
        activeJobs: 0,
        totalLocations: 0,
        totalCategories: 0,
        featuredJobs: 0
      },
      jobsByState: {},
      jobsByField: {},
      recentPostings: [],
      defaultCompanyLogo: '/images/dashboard-default.svg'
    };
  },

  async created() {
    try {
      await Promise.all([
        this.loadJobs(),
        this.loadStats()
      ]);
    } catch (error) {
      console.error('Error initializing home page:', error);
    }
  },

  methods: {
    async loadStats() {
      try {
        const response = await jobService.getStats();
        if (response) {
          this.stats = {
            activeJobs: response.activeJobs || 0,
            totalLocations: response.totalLocations || 0,
            totalCategories: response.totalCategories || 0,
            featuredJobs: response.featuredJobs || 0
          };
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },

    async loadJobs() {
      this.isLoading = true;
      try {
        // Load latest jobs first
        const latestResponse = await jobService.getAllJobs();
        this.latestJobs = latestResponse.data ? latestResponse.data.slice(0, 5) : []; // Show top 5 latest jobs

        // Try to load featured jobs
        try {
          const featuredResponse = await jobService.getFeaturedJobs();
          // Check if featuredResponse has data property and it's an array
          if (featuredResponse && featuredResponse.data && Array.isArray(featuredResponse.data)) {
            this.featuredJobs = featuredResponse.data.slice(0, 6);
          } else if (Array.isArray(featuredResponse)) {
            this.featuredJobs = featuredResponse.slice(0, 6);
          } else {
            console.warn('Featured jobs response is not in expected format');
            this.featuredJobs = [];
          }
        } catch (error) {
          console.error('Error loading featured jobs:', error);
          // Use latest jobs as fallback for featured
          this.featuredJobs = this.latestJobs.slice(0, 6);
        }

        // Process jobs for sidebar stats
        if (latestResponse.data && Array.isArray(latestResponse.data)) {
          this.processJobStats(latestResponse.data);
        }
      } catch (error) {
        console.error('Error loading jobs:', error);
        this.latestJobs = [];
        this.featuredJobs = [];
      } finally {
        this.isLoading = false;
      }
    },

    processJobStats(jobs) {
      if (!Array.isArray(jobs)) {
        console.warn('Jobs data is not an array');
        return;
      }

      // Process jobs by state
      this.jobsByState = jobs.reduce((acc, job) => {
        if (job && job.location) {
          const state = job.location.split(',').pop()?.trim() || 'Unknown';
          acc[state] = (acc[state] || 0) + 1;
        }
        return acc;
      }, {});

      // Process jobs by field
      this.jobsByField = jobs.reduce((acc, job) => {
        if (job) {
          const field = job.category || 'Other';
          acc[field] = (acc[field] || 0) + 1;
        }
        return acc;
      }, {});

      // Get recent postings
      this.recentPostings = [...jobs]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    },

    formatJobDate(date) {
      const days = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      return this.formatDate(date);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    formatSalary(salary) {
      return salary.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    scrollToJobSection() {
      const jobSection = document.getElementById('job-section');
      if (jobSection) {
        jobSection.scrollIntoView({ behavior: 'smooth' });
      }
    },

    handleSearch() {
      this.$router.push('/jobs');
    }
  }
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
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  color: inherit;
}

.job-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.job-title {
  color: #1f2937;
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.job-company {
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.job-meta i {
  color: #3b82f6;
}

.job-description {
  color: #4b5563;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.job-tag {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.job-tag i {
  font-size: 0.75rem;
  color: #6b7280;
}

.job-deadline {
  color: #dc2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.featured-job {
  border-left: 4px solid #3b82f6;
  background-color: #f8fafc;
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

/* Enhanced button styles */
.btn-glow {
  position: relative;
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-glow .btn-content {
  position: relative;
  z-index: 1;
}

.btn-glow .btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

.btn-hover-slide {
  position: relative;
  overflow: hidden;
  border: 2px solid white;
  transition: all 0.3s ease;
}

.btn-hover-slide:hover {
  background: white;
  color: #4f46e5;
  transform: translateY(-2px);
}

/* Stats card animations */
.stat-card {
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

.counter {
  display: inline-block;
  animation: countUp 2s ease-out forwards;
  position: relative;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Featured Jobs section */
.section-title {
  position: relative;
  display: inline-block;
}

.highlight-text {
  background: linear-gradient(120deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-underline {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, #4f46e5, transparent);
}

.featured-badge {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 20px;
  font-weight: 500;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #4f46e5;
  border-radius: 50%;
  display: inline-block;
  position: relative;
}

.badge-dot::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.hover-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.hover-card:hover .card-shine {
  left: 100%;
}

.shadow-hover {
  transition: all 0.3s ease;
}

.shadow-hover:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stat-card {
    padding: 0.5rem;
  }
  
  .stat-icon {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
}
</style>
