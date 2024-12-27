<template>
  <div class="signup-container">
    <div class="col-md-6 mx-auto">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Job Seeker Signup</h1>
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="firstName" class="form-label">First Name:</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  id="firstName"
                  class="form-control"
                  required
                />
                <span v-if="errors.firstName" class="text-danger">{{
                  errors.firstName
                }}</span>
              </div>
              <div class="col-md-6">
                <label for="lastName" class="form-label">Last Name:</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  id="lastName"
                  class="form-control"
                  required
                />
                <span v-if="errors.lastName" class="text-danger">{{
                  errors.lastName
                }}</span>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="email" class="form-label">Email:</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  class="form-control"
                  required
                />
                <span v-if="errors.email" class="text-danger">{{
                  errors.email
                }}</span>
              </div>
              <div class="col-md-6 position-relative">
                <label for="phone" class="form-label">Phone Number:</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  id="phone"
                  class="form-control"
                  required
                />
                <span v-if="errors.phone" class="text-danger">{{
                  errors.phone
                }}</span>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6 position-relative">
                <label for="password" class="form-label">Password:</label>
                <input
                  v-model="form.password"
                  :type="passwordFieldType"
                  id="password"
                  class="form-control"
                  required
                />
                <span @click="togglePasswordVisibility" class="password-toggle">
                  <i
                    :class="
                      passwordFieldType === 'password'
                        ? 'bi bi-eye-slash'
                        : 'bi bi-eye'
                    "
                  ></i>
                </span>
                <span v-if="errors.password" class="text-danger">{{
                  errors.password
                }}</span>
              </div>
              <div class="col-md-6 position-relative">
                <label for="confirmPassword" class="form-label"
                  >Confirm Password:</label
                >
                <input
                  v-model="form.confirmPassword"
                  :type="passwordFieldType"
                  id="confirmPassword"
                  class="form-control"
                  required
                />
                <span @click="togglePasswordVisibility" class="password-toggle">
                  <i
                    :class="
                      passwordFieldType === 'password'
                        ? 'bi bi-eye-slash'
                        : 'bi bi-eye'
                    "
                  ></i>
                </span>
                <span v-if="errors.confirmPassword" class="text-danger">{{
                  errors.confirmPassword
                }}</span>
              </div>
            </div>
            <div class="mb-3">
              <label for="cv" class="form-label">Upload CV:</label>
              <input
                type="file"
                id="cv"
                class="form-control"
                @change="handleFileUpload"
                required
              />
              <span v-if="errors.cv" class="text-danger">{{ errors.cv }}</span>
            </div>
            <button type="submit" class="btn btn-primary w-100">Sign Up</button>
          </form>
          <p class="mt-3 text-center">
            Already have an account?
            <router-link to="/login" class="link-primary">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "JobSeekerSignup",
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        cv: null,
      },
      errors: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        cv: "",
      },
      passwordFieldType: "password", // Default to password type
    };
  },
  methods: {
    handleFileUpload(event) {
      this.form.cv = event.target.files[0];
    },
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    validateForm() {
      this.errors.firstName = "";
      this.errors.lastName = "";
      this.errors.email = "";
      this.errors.phone = "";
      this.errors.password = "";
      this.errors.confirmPassword = "";
      this.errors.cv = "";

      let isValid = true;

      if (!this.form.firstName) {
        this.errors.firstName = "First name is required.";
        isValid = false;
      }

      if (!this.form.lastName) {
        this.errors.lastName = "Last name is required.";
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        this.errors.email = "Email is required.";
        isValid = false;
      } else if (!emailPattern.test(this.form.email)) {
        this.errors.email = "Email is invalid.";
        isValid = false;
      }

      if (!this.form.phone) {
        this.errors.phone = "Phone number is required.";
        isValid = false;
      }

      if (!this.form.password) {
        this.errors.password = "Password is required.";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters long.";
        isValid = false;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }

      if (!this.form.cv) {
        this.errors.cv = "CV upload is required.";
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      if (this.validateForm()) {
        const authStore = useAuthStore();
        const newUser = {
          email: this.form.email,
          password: this.form.password,
          type: "jobseeker",
          name: `${this.form.firstName} ${this.form.lastName}`,
          phone: this.form.phone,
          cv: this.form.cv,
        };

        try {
          authStore.signup(newUser);
          this.$router.push("/dashboard/jobseeker");
        } catch (error) {
          this.errors.email = error.message;
        }
      }
    },
  },
};
</script>

<style scoped>
.signup-container {
  padding: 2rem;
  background-color: #f8f9fa; /* Light background for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-danger {
  color: #dc3545; /* Bootstrap danger color */
}

.password-toggle {
  position: absolute;
  right: 18px;
  top: 39px; /* Adjust based on your input height */
  cursor: pointer;
}
</style>
