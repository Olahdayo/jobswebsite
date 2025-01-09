<template>
  <div class="login-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Login</h2>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                <div class="mb-3">
                  <label class="form-label">Email <span class="text-danger">*</span></label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="formData.email"
                    :class="{ 'is-invalid': v$.formData.email.$error }"
                    required
                  />
                  <div class="invalid-feedback" v-if="v$.formData.email.$error">
                    {{ v$.formData.email.$errors[0].$message }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Password <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control"
                      v-model="formData.password"
                      :class="{ 'is-invalid': v$.formData.password.$error }"
                      required
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

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMe"
                    v-model="formData.remember"
                  />
                  <label class="form-check-label" for="rememberMe">Remember me</label>
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
                    {{ isLoading ? 'Logging in...' : 'Login' }}
                  </button>
                </div>

                <!-- Register Link -->
                <p class="text-center mb-0">
                  Don't have an account?
                  <router-link to="/register">Create one here</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    return { v$: useVuelidate(), router, authStore };
  },

  data() {
    return {
      isLoading: false,
      error: null,
      showPassword: false,
      formData: {
        email: '',
        password: '',
        remember: false
      }
    };
  },

  validations() {
    return {
      formData: {
        email: { required, email },
        password: { required }
      }
    };
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async handleSubmit() {
      try {
        // Validate form
        const isValid = await this.v$.$validate();
        if (!isValid) return;

        this.isLoading = true;
        this.error = null;

        // Try job seeker login first
        try {
          await this.authStore.loginAsJobSeeker(this.formData);
          this.router.push({ name: 'JobSeekerDashboard' });
          return;
        } catch (error) {
          // If it's not a 422 error (validation error), try employer login
          if (error.response?.status !== 422) {
            try {
              await this.authStore.loginAsEmployer(this.formData);
              this.router.push({ name: 'EmployerDashboard' });
              return;
            } catch (employerError) {
              // If both logins fail, show error
              if (employerError.response?.status === 422) {
                this.error = 'Invalid email or password';
              } else {
                this.error = employerError.response?.data?.message || 'Login failed';
              }
            }
          } else {
            this.error = error.response?.data?.message || 'Invalid credentials';
          }
        }
      } catch (error) {
        console.error('Login error:', error);
        this.error = error.response?.data?.message || error.message || 'Login failed';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 500;
}

.input-group .btn-outline-secondary {
  border-color: #ced4da;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
}
</style>
