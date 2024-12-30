<template>
  <div class="support-page">
    <!-- Hero Section -->
    <section class="hero-section text-center py-5">
      <div class="container">
        <h1 class="display-4 fw-bold mb-4 animate__animated animate__fadeInDown">
          How Can We Help You?
        </h1>
        <p class="lead mb-4 animate__animated animate__fadeInUp">
          We're here to support you every step of the way
        </p>
        <!-- Search Bar -->
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6">
            <div class="search-wrapper animate__animated animate__fadeIn">
              <div class="input-group mb-3">
                <input 
                  type="text" 
                  class="form-control form-control-lg" 
                  placeholder="Search for help..."
                  v-model="searchQuery"
                >
                <button class="btn btn-primary btn-lg" type="button">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Help Section -->
    <section class="quick-help py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Contact Card -->
          <div class="col-md-4 animate__animated animate__fadeInLeft">
            <div class="support-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-headset display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">24/7 Support</h3>
                  <p class="text-muted mb-4">
                    Get in touch with our support team anytime, anywhere
                  </p>
                  <button class="btn btn-outline-primary">Contact Support</button>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Card -->
          <div class="col-md-4 animate__animated animate__fadeInUp">
            <div class="support-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-question-circle display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">FAQ</h3>
                  <p class="text-muted mb-4">
                    Find answers to commonly asked questions
                  </p>
                  <button class="btn btn-outline-primary">View FAQ</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Documentation Card -->
          <div class="col-md-4 animate__animated animate__fadeInRight">
            <div class="support-card h-100">
              <div class="card shadow-sm">
                <div class="card-body text-center p-4">
                  <div class="icon-wrapper mb-3">
                    <i class="bi bi-book display-4 text-primary"></i>
                  </div>
                  <h3 class="h4 mb-3">Documentation</h3>
                  <p class="text-muted mb-4">
                    Detailed guides and documentation for all features
                  </p>
                  <button class="btn btn-outline-primary">Read Docs</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Frequently Asked Questions</h2>
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="accordion" id="faqAccordion">
              <div class="accordion-item mb-3 animate__animated animate__fadeInUp">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    How do I post a job?
                  </button>
                </h2>
                <div id="faq1" class="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Sign up as an employer, navigate to your dashboard, and click on "Post a Job". Fill in the required details and submit.
                  </div>
                </div>
              </div>

              <div class="accordion-item mb-3 animate__animated animate__fadeInUp">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    How do I search for jobs?
                  </button>
                </h2>
                <div id="faq2" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Use our search bar on the homepage or job listings page. Filter by location, job type, and category.
                  </div>
                </div>
              </div>

              <div class="accordion-item mb-3 animate__animated animate__fadeInUp">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    How do I contact support?
                  </button>
                </h2>
                <div id="faq3" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                  <div class="accordion-body">
                    Click on the "Contact Support" button above or email us at support@jobhunter.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center">
            <h2 class="mb-4 animate__animated animate__fadeInDown">Still Need Help?</h2>
            <p class="lead mb-5 animate__animated animate__fadeInUp">
              Our support team is available 24/7 to assist you with any questions
            </p>
            <div class="d-flex justify-content-center gap-3 animate__animated animate__fadeIn">
              <button class="btn btn-primary btn-lg">
                <i class="bi bi-chat-dots me-2"></i>Live Chat
              </button>
              <button class="btn btn-outline-primary btn-lg">
                <i class="bi bi-envelope me-2"></i>Email Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Support',
  data() {
    return {
      searchQuery: ''
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
  }
}
</script>

<style scoped>
.support-page {
  overflow-x: hidden;
}

.hero-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6rem 0;
}

.support-card {
  transition: transform 0.3s ease;
}

.support-card:hover {
  transform: translateY(-10px);
}

.icon-wrapper {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.accordion-button:not(.collapsed) {
  background-color: #f8f9fa;
  color: #6366f1;
}

.accordion-button:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
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

.animate__fadeIn {
  animation-duration: 1.2s;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
  }

  .support-card {
    margin-bottom: 1rem;
  }

  .btn-lg {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}
</style>
