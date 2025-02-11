<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-wrapper">
        <!-- Login Form Section -->
        <div class="login-form-section">
          <div class="login-form-content">
            <h2 class="text-center mb-4">Member Login</h2>
            <p class="text-center text-muted mb-4">Login to your Pinify account</p>

            <!-- Error Alert -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="needs-validation" novalidate>
              <div class="mb-3">
                <label class="form-label">
                </label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    :class="{ 'is-invalid': v$.formData.email.$error }"
                    required
                    placeholder="Email"
                  />
                  <div class="invalid-feedback" v-if="v$.formData.email.$error">
                    {{ v$.formData.email.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">
                  
                </label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-lock"></i>
                  </span>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="formData.password"
                    :class="{ 'is-invalid': v$.formData.password.$error }"
                    required
                    placeholder="Password"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                  <div class="invalid-feedback" v-if="v$.formData.password.$error">
                    {{ v$.formData.password.$errors[0].$message }}
                  </div>
                </div>
              </div>

              <div class="mb-3 d-flex justify-content-between align-items-center">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMe"
                    v-model="formData.remember"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" class="text-primary text-decoration-none">Forgot Password?</a>
              </div>

              <!-- Submit Button -->
              <div class="d-grid mb-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  <span
                    v-if="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  {{ isLoading ? "Logging in..." : "Login" }}
                </button>
              </div>

              <!-- Register Link -->
              <p class="text-center mb-0">
                Don't have an account?
                <router-link to="/register" class="text-primary">
                  Create one here
                </router-link>
              </p>
            </form>
          </div>
        </div>

        <!-- Login Info Section -->
        <div class="login-info-section">
          <div class="login-info-content">
            <div class="login-info-overlay"></div>
            <div class="login-info-text">
              <h3>Discover Your Dream Career</h3>
              <p>
                Pinify connects talented job seekers with innovative employers. 
                Join thousands of professionals finding their perfect opportunity.
              </p>
              <div class="login-info-features">
                <div class="feature">
                  <i class="fas fa-search"></i>
                  <span>Personalized Job Matching</span>
                </div>
                <div class="feature">
                  <i class="fas fa-chart-line"></i>
                  <span>Career Growth Insights</span>
                </div>
                <div class="feature">
                  <i class="fas fa-shield-alt"></i>
                  <span>Secure Professional Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Login",

  data() {
    return {
      isLoading: false,
      error: null,
      showPassword: false,
      authStore: null,
      v$: useVuelidate(),
      formData: {
        email: "",
        password: "",
        remember: false,
      },
    };
  },

  created() {
    // Initialize auth store
    this.authStore = useAuthStore();
  },

  validations() {
    return {
      formData: {
        email: { required, email },
        password: { required },
      },
    };
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async handleLogin() {
      try {
        // Validate form
        const isValid = await this.v$.$validate();
        if (!isValid) return;

        this.isLoading = true;
        this.error = null;

        // Login
        await this.authStore.login(this.formData);

        // Get redirect path from query parameters or use default based on user type
        const redirectPath = this.$route.query.redirect || 
          (this.authStore.userType === 'employer' 
            ? '/dashboard/employer' 
            : '/dashboard/jobseeker');

        // Navigate to the appropriate dashboard
        await this.$router.push(redirectPath);
      } catch (error) {
        console.error("Login error:", error);
        this.error = error.response?.data?.message || "Login failed. Please check your credentials.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background: linear-gradient(
    45deg, 
    rgba(66, 153, 225, 0.1), 
    rgba(56, 161, 105, 0.1)
  );
  overflow: hidden;
}

.login-page::before,
.login-page::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(26, 54, 93, 0.05) 0%, 
    rgba(45, 55, 72, 0.05) 100%
  );
  animation: move-background 15s ease infinite;
  background-size: 400% 400%;
}

.login-page::after {
  animation-direction: reverse;
  opacity: 0.5;
}

@keyframes move-background {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-wrapper {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.login-wrapper {
  display: flex;
  max-width: 900px; /* Reduced width */
  margin: 0 auto; /* Center the wrapper */
  width: 90%; /* Responsive width */
}

.login-info-section {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  order: -1; /* Move to the left */
}

.login-form-section {
  flex: 1;
  padding: 3rem 2rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form-content {
  width: 100%;
  max-width: 350px; /* Slightly reduced form width */
}

.login-info-content {
  position: relative;
  z-index: 2;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px; /* Added max-width for info section */
}

.login-info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-info-text h3 {
  margin-bottom: 1rem;
  font-weight: bold;
}

.login-info-features {
  margin-top: 2rem;
}

.feature {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.feature i {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    width: 95%; /* Full width on mobile */
  }

  .login-info-section {
    order: 0; /* Reset order on mobile */
    display: none; /* Hide info section on mobile */
  }

  .login-form-section {
    width: 100%;
  }
}

.login-page .particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float-particle 10s linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(0) rotate(360deg);
    opacity: 0.5;
  }
}

.login-page::before {
  content: "";
  position: absolute;
  top: 10%;
  left: 10%;
  width: 20px;
  height: 20px;
  background: rgba(66, 153, 225, 0.2);
  border-radius: 50%;
  animation: float-particle 15s linear infinite;
}

.login-page::after {
  content: "";
  position: absolute;
  bottom: 20%;
  right: 15%;
  width: 30px;
  height: 30px;
  background: rgba(56, 161, 105, 0.2);
  border-radius: 50%;
  animation: float-particle 20s linear infinite reverse;
}
</style>
