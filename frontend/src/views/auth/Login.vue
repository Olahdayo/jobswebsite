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
              <form
                @submit.prevent="handleLogin"
                class="needs-validation"
                novalidate
              >
                <div class="mb-3">
                  <label class="form-label"
                    >Email <span class="text-danger">*</span></label
                  >
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
                  <label class="form-label"
                    >Password <span class="text-danger">*</span></label
                  >
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
                      <i
                        :class="
                          showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'
                        "
                      ></i>
                    </button>
                    <div
                      class="invalid-feedback"
                      v-if="v$.formData.password.$error"
                    >
                      {{ v$.formData.password.$errors[0].$message }}
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label"
                    >Account Type <span class="text-danger">*</span></label
                  >
                  <select
                    class="form-select"
                    v-model="formData.accountType"
                    :class="{ 'is-invalid': v$.formData.accountType.$error }"
                    required
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                  <div
                    class="invalid-feedback"
                    v-if="v$.formData.accountType.$error"
                  >
                    {{ v$.formData.accountType.$errors[0].$message }}
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMe"
                    v-model="formData.remember"
                  />
                  <label class="form-check-label" for="rememberMe"
                    >Remember me</label
                  >
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
        accountType: "jobseeker", 
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
        accountType: { required },
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

        // Login based on account type
        if (this.formData.accountType === "employer") {
          await this.authStore.loginAsEmployer(this.formData);
        } else {
          await this.authStore.loginAsJobSeeker(this.formData);
        }

        // Get redirect path from query parameters or use default
        const redirectPath = this.$route.query.redirect ||
          (this.authStore.userType === "employer"
            ? "/dashboard/employer"
            : "/dashboard/jobseeker");

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
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  padding: 0.75rem;
  font-weight: 500;
}

.form-select {
  padding: 0.75rem;
  border-radius: 8px;
}

.invalid-feedback {
  display: block;
}
</style>
