<template>
  <div class="register-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h2 class="text-center mb-4">Create an Account</h2>
              
              <!-- Account Type Selection -->
              <div class="account-type-selector mb-4">
                <div class="btn-group w-100" role="group">
                  <input
                    type="radio"
                    class="btn-check"
                    name="accountType"
                    id="jobseeker"
                    value="jobseeker"
                    v-model="accountType"
                    autocomplete="off"
                  />
                  <label class="btn btn-outline-primary" for="jobseeker">
                    <i class="fas fa-user me-2"></i>Job Seeker
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="accountType"
                    id="employer"
                    value="employer"
                    v-model="accountType"
                    autocomplete="off"
                  />
                  <label class="btn btn-outline-primary" for="employer">
                    <i class="fas fa-building me-2"></i>Employer
                  </label>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger" role="alert">
                {{ error }}
              </div>

              <!-- Registration Form -->
              <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
                <!-- Job Seeker Form -->
                <template v-if="accountType === 'jobseeker'">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">First Name <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.first_name"
                        :class="{ 'is-invalid': v$.formData.first_name.$error }"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.formData.first_name.$error">
                        {{ v$.formData.first_name.$errors[0].$message }}
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Last Name <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.last_name"
                        :class="{ 'is-invalid': v$.formData.last_name.$error }"
                        required
                      />
                      <div class="invalid-feedback" v-if="v$.formData.last_name.$error">
                        {{ v$.formData.last_name.$errors[0].$message }}
                      </div>
                    </div>
                  </div>

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

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          v-model="formData.password"
                          :class="{ 'is-invalid': v$.formData.password.$error }"
                          required
                          minlength="8"
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
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input
                          :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control"
                          v-model="formData.password_confirmation"
                          :class="{ 'is-invalid': v$.formData.password_confirmation.$error }"
                          required
                        />
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button"
                          @click="toggleConfirmPassword"
                        >
                          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                        <div class="invalid-feedback" v-if="v$.formData.password_confirmation.$error">
                          {{ v$.formData.password_confirmation.$errors[0].$message }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Phone (Optional)</label>
                    <input
                      type="tel"
                      class="form-control"
                      v-model="formData.phone"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Education Level <span class="text-danger">*</span></label>
                    <select class="form-select" v-model="formData.education_level" :class="{ 'is-invalid': v$.formData.education_level.$error }" required>
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                    </select>
                    <div class="invalid-feedback" v-if="v$.formData.education_level.$error">
                      {{ v$.formData.education_level.$errors[0].$message }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Location <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.location"
                      :class="{ 'is-invalid': v$.formData.location.$error }"
                      required
                    />
                    <div class="invalid-feedback" v-if="v$.formData.location.$error">
                      {{ v$.formData.location.$errors[0].$message }}
                    </div>
                  </div>
                </template>

                <!-- Employer Form -->
                <template v-else>
                  <div class="mb-3">
                    <label class="form-label">Company Name <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.company_name"
                      :class="{ 'is-invalid': v$.formData.company_name.$error }"
                      required
                    />
                    <div class="invalid-feedback" v-if="v$.formData.company_name.$error">
                      {{ v$.formData.company_name.$errors[0].$message }}
                    </div>
                  </div>

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

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input
                          :type="showPassword ? 'text' : 'password'"
                          class="form-control"
                          v-model="formData.password"
                          :class="{ 'is-invalid': v$.formData.password.$error }"
                          required
                          minlength="8"
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
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Confirm Password <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input
                          :type="showConfirmPassword ? 'text' : 'password'"
                          class="form-control"
                          v-model="formData.password_confirmation"
                          :class="{ 'is-invalid': v$.formData.password_confirmation.$error }"
                          required
                        />
                        <button 
                          class="btn btn-outline-secondary" 
                          type="button"
                          @click="toggleConfirmPassword"
                        >
                          <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                        </button>
                        <div class="invalid-feedback" v-if="v$.formData.password_confirmation.$error">
                          {{ v$.formData.password_confirmation.$errors[0].$message }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Company Description <span class="text-danger">*</span></label>
                    <textarea
                      class="form-control"
                      v-model="formData.company_description"
                      rows="3"
                      :class="{ 'is-invalid': v$.formData.company_description.$error }"
                      required
                    ></textarea>
                    <div class="invalid-feedback" v-if="v$.formData.company_description.$error">
                      {{ v$.formData.company_description.$errors[0].$message }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Industry <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.industry"
                      :class="{ 'is-invalid': v$.formData.industry.$error }"
                      required
                    />
                    <div class="invalid-feedback" v-if="v$.formData.industry.$error">
                      {{ v$.formData.industry.$errors[0].$message }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Location <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="formData.location"
                      :class="{ 'is-invalid': v$.formData.location.$error }"
                      required
                    />
                    <div class="invalid-feedback" v-if="v$.formData.location.$error">
                      {{ v$.formData.location.$errors[0].$message }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Website (Optional)</label>
                    <input
                      type="url"
                      class="form-control"
                      v-model="formData.website"
                    />
                  </div>
                </template>

                <!-- Remember Me Checkbox -->
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
                <div class="d-grid">
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
                    {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                  </button>
                </div>

                <!-- Login Link -->
                <p class="text-center mt-3">
                  Already have an account?
                  <router-link to="/login">Login here</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      v-if="showSuccessModal"
      :message="'Your account has been created successfully! You can now log in.'"
      @close="handleSuccessModalClose"
    />
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import SuccessModal from '@/components/SuccessModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  components: {
    SuccessModal
  },

  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    return { v$: useVuelidate(), authStore, router };
  },

  data() {
    return {
      accountType: 'jobseeker',
      isLoading: false,
      error: null,
      showPassword: false,
      showConfirmPassword: false,
      showSuccessModal: false,
      formData: {
        // Common fields
        email: '',
        password: '',
        password_confirmation: '',
        location: '',
        remember: false,

        // Job seeker specific fields
        first_name: '',
        last_name: '',
        phone: '',
        education_level: '',

        // Employer specific fields
        company_name: '',
        company_description: '',
        industry: '',
        website: ''
      }
    };
  },

  validations() {
    const commonValidations = {
      formData: {
        email: { required, email },
        password: { required, minLength: minLength(8) },
        password_confirmation: { required, sameAs: sameAs(this.formData.password) },
        location: { required }
      }
    };

    if (this.accountType === 'jobseeker') {
      return {
        formData: {
          ...commonValidations.formData,
          first_name: { required },
          last_name: { required },
          education_level: { required }
        }
      };
    } else {
      return {
        formData: {
          ...commonValidations.formData,
          company_name: { required },
          company_description: { required },
          industry: { required }
        }
      };
    }
  },

  watch: {
    accountType() {
      this.resetForm();
      this.v$.$reset();
    }
  },

  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    resetForm() {
      this.formData = {
        email: '',
        password: '',
        password_confirmation: '',
        location: '',
        remember: false,
        first_name: '',
        last_name: '',
        phone: '',
        education_level: '',
        company_name: '',
        company_description: '',
        industry: '',
        website: ''
      };
      this.error = null;
    },

    async handleSubmit() {
      try {
        // Validate form
        const isValid = await this.v$.$validate();
        if (!isValid) return;

        this.isLoading = true;
        this.error = null;

        // Register based on account type
        if (this.accountType === 'jobseeker') {
          await this.authStore.registerJobSeeker(this.formData);
          this.showSuccessModal = true;
          // Clear auth state before redirecting
          this.authStore.clearAuthData();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        } else {
          await this.authStore.registerEmployer(this.formData);
          this.showSuccessModal = true;
          // Clear auth state before redirecting
          this.authStore.clearAuthData();
          setTimeout(() => {
            this.$router.push('/login');
          }, 1000);
        }
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error.response?.data?.message || 'Registration failed. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    handleSuccessModalClose() {
      this.showSuccessModal = false;
      this.resetForm();
      // Clear auth state when modal is closed
      this.authStore.clearAuthData();
    }
  }
};
</script>

<style scoped>
.register-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  border-radius: 15px;
}

.btn-check:checked + .btn-outline-primary {
  background-color: #0d6efd;
  color: white;
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

.account-type-selector .btn {
  padding: 1rem;
  flex: 1;
}

.account-type-selector .btn i {
  font-size: 1.2rem;
}

.input-group .btn-outline-secondary {
  border-color: #ced4da;
}

.input-group .btn-outline-secondary:hover {
  background-color: #f8f9fa;
  border-color: #ced4da;
}
</style>
