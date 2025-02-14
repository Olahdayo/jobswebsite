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
        } else {
          await this.authStore.registerEmployer(this.formData);
          this.showSuccessModal = true;
          // Clear auth state before redirecting
          this.authStore.clearAuthData();
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
      // Ensure modal backdrop is removed
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      // Clear auth state when modal is closed
      this.authStore.clearAuthData();
      
      // Navigate to login page after modal is closed
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.register-page {
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

.register-page::before,
.register-page::after {
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

.register-page::after {
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

.card {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  width: 90%;
  margin: 0 auto;
}

.account-type-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.account-type-selector .btn-group {
  max-width: 400px;
}

.account-type-selector .btn-outline-primary {
  transition: all 0.3s ease;
}

.account-type-selector .btn-outline-primary:hover {
  background-color: rgba(66, 153, 225, 0.1);
}

.form-label {
  font-weight: 500;
  color: #2d3748;
}

.input-group .form-control {
  border-right: none;
}

.input-group .input-group-text {
  background-color: transparent;
  border-left: none;
}

.btn-submit {
  background-color: #3182ce;
  color: white;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background-color: #2c5282;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .card {
    width: 95%;
  }

  .account-type-selector .btn-group {
    flex-direction: column;
  }

  .account-type-selector .btn-group label {
    margin-bottom: 0.5rem;
  }
}

/* Particle-like effects */
.register-page::before {
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

.register-page::after {
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
</style>
