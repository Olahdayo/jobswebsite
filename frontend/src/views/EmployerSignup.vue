<template>
  <div class="signup-container">
    <div class="col-md-6 mx-auto">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Employer Signup</h1>
          <form @submit.prevent="submitForm">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="companyName" class="form-label"
                  >Company Name:</label
                >
                <input
                  v-model="form.companyName"
                  type="text"
                  id="companyName"
                  class="form-control"
                  required
                />
                <span v-if="errors.companyName" class="text-danger">{{
                  errors.companyName
                }}</span>
              </div>
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
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="companyWebsite" class="form-label"
                  >Company Website:</label
                >
                <input
                  v-model="form.companyWebsite"
                  type="url"
                  id="companyWebsite"
                  class="form-control"
                  required
                />
                <span v-if="errors.companyWebsite" class="text-danger">{{
                  errors.companyWebsite
                }}</span>
              </div>
              <div class="col-md-6">
                <label for="phoneNumber" class="form-label"
                  >Phone Number:</label
                >
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  id="phoneNumber"
                  class="form-control"
                  required
                />
                <span v-if="errors.phoneNumber" class="text-danger">{{
                  errors.phoneNumber
                }}</span>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="companyDescription" class="form-label"
                  >Company Description:</label
                >
                <textarea
                  v-model="form.companyDescription"
                  id="companyDescription"
                  class="form-control"
                  required
                ></textarea>
                <span v-if="errors.companyDescription" class="text-danger">{{
                  errors.companyDescription
                }}</span>
              </div>
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
  name: "EmployerSignup",
  data() {
    return {
      form: {
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyWebsite: "",
        phoneNumber: "",
        companyDescription: "",
      },
      errors: {
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyWebsite: "",
        phoneNumber: "",
        companyDescription: "",
      },
      passwordFieldType: "password", // Default to password type
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    validateForm() {
      this.errors.companyName = "";
      this.errors.email = "";
      this.errors.password = "";
      this.errors.companyWebsite = "";
      this.errors.phoneNumber = "";
      this.errors.companyDescription = "";

      let isValid = true;

      if (!this.form.companyName) {
        this.errors.companyName = "Company name is required.";
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

      if (!this.form.password) {
        this.errors.password = "Password is required.";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters long.";
        isValid = false;
      }

      if (!this.form.companyWebsite) {
        this.errors.companyWebsite = "Company website is required.";
        isValid = false;
      }

      if (!this.form.phoneNumber) {
        this.errors.phoneNumber = "Phone number is required.";
        isValid = false;
      }

      if (!this.form.companyDescription) {
        this.errors.companyDescription = "Company description is required.";
        isValid = false;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
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
          type: "employer",
          companyName: this.form.companyName,
          companyWebsite: this.form.companyWebsite,
          phoneNumber: this.form.phoneNumber,
          companyDescription: this.form.companyDescription,
        };

        try {
          authStore.signup(newUser);
          this.$router.push("/dashboard/employer");
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
  right: 17px;
  top: 39px; /* Adjust based on your input height */
  cursor: pointer;
}
</style>
