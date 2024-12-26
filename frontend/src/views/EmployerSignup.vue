<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="col-md-4">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Employer Signup</h1>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="companyName" class="form-label">Company Name:</label>
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
            <div class="mb-3">
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
            <div class="mb-3">
              <label for="password" class="form-label">Password:</label>
              <input
                v-model="form.password"
                type="password"
                id="password"
                class="form-control"
                required
              />
              <span v-if="errors.password" class="text-danger">{{
                errors.password
              }}</span>
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label"
                >Confirm Password:</label
              >
              <input
                v-model="form.confirmPassword"
                type="password"
                id="confirmPassword"
                class="form-control"
                required
              />
              <span v-if="errors.confirmPassword" class="text-danger">{{
                errors.confirmPassword
              }}</span>
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
      },
      errors: {
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    validateForm() {
      this.errors.companyName = "";
      this.errors.email = "";
      this.errors.password = "";
      this.errors.confirmPassword = "";

      let isValid = true;

      if (!this.form.companyName.trim()) {
        this.errors.companyName = "Company name is required.";
        isValid = false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email.trim()) {
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

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      const registrationData = {
        companyName: this.form.companyName,
        email: this.form.email,
        password: this.form.password,
        type: "employer", // Set the type to employer
      };

      if (this.validateForm()) {
        const authStore = useAuthStore();
        try {
          authStore.signup(registrationData);
          this.$router.push("/login"); // Redirect to login page
        } catch (error) {
          if (error.message === "User already exists") {
            this.errors.email = "This email is already registered.";
          } else {
            this.errors.email = "Registration failed. Please try again.";
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.text-danger {
  color: #dc3545; /* Bootstrap danger color */
}
</style>
