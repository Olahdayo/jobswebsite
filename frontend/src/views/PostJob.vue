<template>
  <div class="post-job-page">
    <!-- Hero Section -->
    <section class="hero-section text-center py-5">
      <div class="container">
        <h1 class="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
          Post Your Job with Pinify
        </h1>
        <p class="lead mb-4 animate__animated animate__fadeInUp">
          Connect with the best talent and grow your team with our powerful job posting platform
        </p>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="benefits-section py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Benefit 1 -->
          <div class="col-md-4 animate__animated animate__fadeInLeft">
            <div class="benefit-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-graph-up-arrow display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">Maximum Visibility</h3>
                  <p class="text-muted">
                    Your job posts reach millions of qualified candidates through our extensive network and smart distribution channels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefit 2 -->
          <div class="col-md-4 animate__animated animate__fadeInUp">
            <div class="benefit-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-lightning-charge display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">Smart Matching</h3>
                  <p class="text-muted">
                    Our AI-powered matching system connects you with the most relevant candidates for your position.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Benefit 3 -->
          <div class="col-md-4 animate__animated animate__fadeInRight">
            <div class="benefit-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-shield-check display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">Quality Applicants</h3>
                  <p class="text-muted">
                    Access pre-screened, qualified candidates who match your requirements and company culture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Why Choose Pinify?</h2>
        <div class="row g-4">
          <div class="col-md-6 animate__animated animate__fadeInLeft">
            <div class="feature-item d-flex align-items-start mb-4">
              <div class="feature-icon me-3">
                <i class="bi bi-clock text-primary h3"></i>
              </div>
              <div>
                <h4>Quick & Easy Posting</h4>
                <p>Post your job in minutes with our streamlined process.</p>
              </div>
            </div>
            <div class="feature-item d-flex align-items-start mb-4">
              <div class="feature-icon me-3">
                <i class="bi bi-graph-up text-primary h3"></i>
              </div>
              <div>
                <h4>Analytics & Insights</h4>
                <p>Track your job performance with detailed analytics.</p>
              </div>
            </div>
          </div>
          <div class="col-md-6 animate__animated animate__fadeInRight">
            <div class="feature-item d-flex align-items-start mb-4">
              <div class="feature-icon me-3">
                <i class="bi bi-people text-primary h3"></i>
              </div>
              <div>
                <h4>Targeted Reach</h4>
                <p>Reach the right candidates in your industry and location.</p>
              </div>
            </div>
            <div class="feature-item d-flex align-items-start mb-4">
              <div class="feature-icon me-3">
                <i class="bi bi-headset text-primary h3"></i>
              </div>
              <div>
                <h4>24/7 Support</h4>
                <p>Get help whenever you need it from our dedicated support team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section py-5">
      <div class="container text-center">
        <h2 class="mb-4 animate__animated animate__pulse">Ready to Find Your Perfect Candidate?</h2>
        <p class="lead mb-4">Join thousands of companies who trust Pinify for their hiring needs</p>
        <router-link to="/register" class="btn btn-primary btn-lg animate__animated animate__bounceIn">
          Get Started Now
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'PostJob',
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
  }
}
</script>

<style scoped>
.post-job-page {
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6rem 0;
}

.benefit-card {
  transition: transform 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-10px);
}

.icon-wrapper {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon {
  width: 50px;
  text-align: center;
}

.animate__animated {
  transition: opacity 0.5s ease-in-out;
}

/* Animation durations */
.animate__fadeInLeft, .animate__fadeInRight {
  animation-duration: 1s;
}

.animate__fadeInUp, .animate__fadeInDown {
  animation-duration: 0.8s;
}

.animate__pulse {
  animation-duration: 1.5s;
}

.animate__bounceIn {
  animation-duration: 0.8s;
}

.cta-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
  }

  .feature-item {
    margin-bottom: 2rem;
  }
}
</style>
