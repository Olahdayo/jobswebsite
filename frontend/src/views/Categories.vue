<template>
  <div class="categories-page">
    <!-- Hero Section with Interactive Background -->
    <section class="hero-section position-relative overflow-hidden">
      <div class="animated-bg"></div>
      <div class="container position-relative">
        <div class="row min-vh-50 align-items-center py-5">
          <div class="col-lg-8 text-center text-lg-start">
            <h1 class="display-4 fw-bold mb-4 text-white animate__animated animate__fadeInDown">
              Explore Job Categories
            </h1>
            <p class="lead text-white mb-4 animate__animated animate__fadeInUp">
              Discover opportunities across various industries and find your perfect career path
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search and Filter Section -->
    <section class="search-section py-4 bg-light">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="search-box bg-white p-3 rounded-4 shadow-sm">
              <div class="input-group">
                <input 
                  type="text" 
                  class="form-control form-control-lg border-0"
                  placeholder="Search categories..."
                  v-model="searchQuery"
                  @input="filterCategories"
                >
                <button class="btn btn-primary px-4">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Grid Section -->
    <section class="categories-grid py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Technology Category -->
          <div class="col-md-4 col-lg-3" v-for="category in filteredCategories" :key="category.name">
            <div class="category-card h-100 animate__animated animate__fadeIn">
              <router-link :to="'/jobs/category/' + category.name.toLowerCase()" class="text-decoration-none">
                <div class="card border-0 shadow-sm hover-lift">
                  <div class="card-body p-4">
                    <div class="icon-wrapper mb-3" :class="category.colorClass">
                      <i :class="category.icon"></i>
                    </div>
                    <h3 class="h5 mb-2">{{ category.name }}</h3>
                    <p class="text-muted small mb-3">{{ category.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="badge bg-light text-primary">{{ category.jobCount }} jobs</span>
                      <i class="bi bi-arrow-right text-primary"></i>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Categories Section -->
    <section class="trending-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Trending Categories</h2>
        <div class="row">
          <div class="col-12">
            <div class="trending-slider position-relative">
              <div class="trending-track d-flex gap-4 animate__animated animate__slideInRight">
                <div v-for="category in trendingCategories" :key="category.name" class="trending-item">
                  <div class="trend-card bg-white p-3 rounded-4 shadow-sm">
                    <div class="d-flex align-items-center gap-3">
                      <div class="trend-icon" :class="category.colorClass">
                        <i :class="category.icon"></i>
                      </div>
                      <div>
                        <h4 class="h6 mb-1">{{ category.name }}</h4>
                        <p class="small text-muted mb-0">{{ category.growth }}% growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4">
            <div class="stats-card text-center p-4 rounded-4 bg-primary bg-opacity-10">
              <h3 class="display-4 fw-bold text-primary mb-2">{{ totalJobs }}</h3>
              <p class="mb-0">Total Active Jobs</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stats-card text-center p-4 rounded-4 bg-success bg-opacity-10">
              <h3 class="display-4 fw-bold text-success mb-2">{{ totalCategories }}</h3>
              <p class="mb-0">Job Categories</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="stats-card text-center p-4 rounded-4 bg-info bg-opacity-10">
              <h3 class="display-4 fw-bold text-info mb-2">{{ totalCompanies }}</h3>
              <p class="mb-0">Active Companies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      searchQuery: '',
      categories: [
        {
          name: 'Technology',
          description: 'Software, IT, Data Science, and more',
          icon: 'bi bi-laptop',
          jobCount: 1250,
          colorClass: 'bg-primary-soft'
        },
        {
          name: 'Healthcare',
          description: 'Medical, Nursing, and Healthcare services',
          icon: 'bi bi-heart-pulse',
          jobCount: 850,
          colorClass: 'bg-danger-soft'
        },
        {
          name: 'Finance',
          description: 'Banking, Investment, and Financial services',
          icon: 'bi bi-cash-coin',
          jobCount: 720,
          colorClass: 'bg-success-soft'
        },
        {
          name: 'Education',
          description: 'Teaching, Training, and Educational roles',
          icon: 'bi bi-book',
          jobCount: 560,
          colorClass: 'bg-info-soft'
        },
        {
          name: 'Marketing',
          description: 'Digital Marketing, PR, and Advertising',
          icon: 'bi bi-graph-up',
          jobCount: 680,
          colorClass: 'bg-warning-soft'
        },
        {
          name: 'Design',
          description: 'UI/UX, Graphic Design, and Creative roles',
          icon: 'bi bi-palette',
          jobCount: 430,
          colorClass: 'bg-purple-soft'
        },
        {
          name: 'Sales',
          description: 'Sales, Business Development, and Account Management',
          icon: 'bi bi-cart',
          jobCount: 890,
          colorClass: 'bg-orange-soft'
        },
        {
          name: 'Engineering',
          description: 'Civil, Mechanical, and Engineering roles',
          icon: 'bi bi-gear',
          jobCount: 670,
          colorClass: 'bg-teal-soft'
        }
      ],
      trendingCategories: [
        { name: 'AI & Machine Learning', growth: 45, icon: 'bi bi-cpu', colorClass: 'bg-primary-soft' },
        { name: 'Remote Work', growth: 38, icon: 'bi bi-house', colorClass: 'bg-success-soft' },
        { name: 'Healthcare Tech', growth: 32, icon: 'bi bi-activity', colorClass: 'bg-danger-soft' },
        { name: 'Cybersecurity', growth: 28, icon: 'bi bi-shield', colorClass: 'bg-warning-soft' },
        { name: 'Data Science', growth: 25, icon: 'bi bi-graph-up', colorClass: 'bg-info-soft' }
      ],
      totalJobs: '5,280',
      totalCategories: '32',
      totalCompanies: '1,450'
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.categories;
      const query = this.searchQuery.toLowerCase();
      return this.categories.filter(category => 
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
      );
    }
  },
  mounted() {
    // Add animate.css classes dynamically for scroll animations
    const animatedElements = document.querySelectorAll('.animate__animated');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.visibility = 'visible';
          entry.target.style.opacity = '1';
        }
      });
    });

    animatedElements.forEach(el => {
      el.style.visibility = 'hidden';
      el.style.opacity = '0';
      observer.observe(el);
    });

    // Start the trending slider animation
    this.animateTrendingSlider();
  },
  methods: {
    filterCategories() {
      // The filtering is handled by the computed property
    },
    animateTrendingSlider() {
      const track = document.querySelector('.trending-track');
      if (track) {
        setInterval(() => {
          track.classList.remove('animate__slideInRight');
          void track.offsetWidth; // Trigger reflow
          track.classList.add('animate__slideInRight');
        }, 5000);
      }
    }
  }
}
</script>

<style scoped>
.categories-page {
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  min-height: 40vh;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
  z-index: 0;
}

.animated-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  animation: backgroundMove 30s linear infinite;
}

@keyframes backgroundMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

.search-box {
  transform: translateY(-30px);
}

.category-card {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

/* Soft background colors */
.bg-primary-soft { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.bg-danger-soft { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.bg-success-soft { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.bg-warning-soft { background: rgba(234, 179, 8, 0.1); color: #eab308; }
.bg-info-soft { background: rgba(6, 182, 212, 0.1); color: #06b6d4; }
.bg-purple-soft { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.bg-orange-soft { background: rgba(249, 115, 22, 0.1); color: #f97316; }
.bg-teal-soft { background: rgba(20, 184, 166, 0.1); color: #14b8a6; }

.trending-slider {
  overflow: hidden;
}

.trending-track {
  will-change: transform;
}

.trend-card {
  min-width: 200px;
}

.trend-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stats-card {
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 30vh;
  }

  .search-box {
    transform: translateY(-20px);
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }

  .trending-track {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
  }

  .trend-card {
    min-width: 160px;
  }
}
</style>
