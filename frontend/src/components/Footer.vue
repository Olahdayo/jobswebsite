<template>
  <footer class="bg-dark text-light py-5 mt-5">
    <div class="container">
      <div class="row">
        <!-- Company Info -->
        <div class="col-md-4 mb-4">
          <h5 class="mb-3">
            <i class="bi bi-briefcase-fill me-2"></i>Pinify
          </h5>
          <p class="mb-3">Connecting talented professionals with amazing opportunities worldwide.</p>
          <div class="social-links">
            <a href="#" class="text-light me-3"><i class="bi bi-facebook"></i></a>
            <a href="#" class="text-light me-3"><i class="bi bi-twitter"></i></a>
            <a href="#" class="text-light me-3"><i class="bi bi-linkedin"></i></a>
            <a href="#" class="text-light"><i class="bi bi-instagram"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-md-2 mb-4">
          <h6 class="mb-3">Quick Links</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><router-link to="/jobs" class="text-light text-decoration-none">Find Jobs</router-link></li>
            <li class="mb-2"><router-link to="/create-job" class="text-light text-decoration-none">Post a Job</router-link></li>
            <li class="mb-2"><router-link to="/signup" class="text-light text-decoration-none">Sign Up</router-link></li>
            <li class="mb-2"><router-link to="/login" class="text-light text-decoration-none">Login</router-link></li>
          </ul>
        </div>

        <!-- Resources -->
        <div class="col-md-2 mb-4">
          <h6 class="mb-3">Resources</h6>
          <ul class="list-unstyled">
            <li class="mb-2"><router-link to="/faq" class="text-light text-decoration-none">FAQ</router-link></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Blog</a></li>
            <li class="mb-2"><a href="#" class="text-light text-decoration-none">Career Tips</a></li>
            <li class="mb-2"><router-link to="/contact" class="text-light text-decoration-none">Contact Us</router-link></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-md-4 mb-4">
          <h6 class="mb-3">Newsletter</h6>
          <p class="mb-3">Subscribe to our newsletter for the latest job updates</p>
          <form @submit.prevent="handleSubscribe" class="newsletter-form">
            <div class="input-group">
              <input 
                type="email" 
                class="form-control" 
                placeholder="Enter your email"
                v-model="email"
              >
              <button class="btn btn-primary" type="submit">Subscribe</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="row mt-4 pt-4 border-top">
        <div class="col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; {{ currentYear }} Pinify. All rights reserved.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <a href="#" class="text-light text-decoration-none me-3">Privacy Policy</a>
          <a href="#" class="text-light text-decoration-none">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: '',
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    handleSubscribe() {
      // Implement newsletter subscription functionality
      console.log('Newsletter subscription for:', this.email)
      this.email = '' // Clear the input after submission
    }
  }
}
</script>

<style scoped>
.social-links a {
  font-size: 1.2rem;
  transition: opacity 0.3s;
}

.social-links a:hover {
  opacity: 0.8;
}

.newsletter-form .input-group {
  max-width: 400px;
}

@media (max-width: 767.98px) {
  footer {
    padding: 2rem 0 !important;
  }

  h5, h6 {
    font-size: 1rem;
    margin-bottom: 0.75rem !important;
  }

  p {
    font-size: 0.875rem;
    margin-bottom: 0.5rem !important;
  }

  .mb-4 {
    margin-bottom: 1rem !important;
  }

  .list-unstyled li {
    margin-bottom: 0.5rem !important;
  }

  .mt-4 {
    margin-top: 1rem !important;
  }

  .pt-4 {
    padding-top: 1rem !important;
  }

  .newsletter-form .input-group {
    max-width: 100%;
  }

  .social-links {
    margin-bottom: 1rem;
  }

  .social-links a {
    font-size: 1rem;
  }
}
</style>
