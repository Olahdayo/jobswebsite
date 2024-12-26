<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="col-md-4">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Job Seeker Signup</h1>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="name" class="form-label">Name:</label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                class="form-control"
                required
              />
              <span v-if="errors.name" class="text-danger">{{
                errors.name
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
        name: "",
        email: "",
        password: "",
      },
      errors: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    validateForm() {
      this.errors.name = "";
      this.errors.email = "";
      this.errors.password = "";

      let isValid = true;

      if (!this.form.name) {
        this.errors.name = "Name is required.";
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

      return isValid;
    },
    submitForm() {
      if (this.validateForm()) {
        const authStore = useAuthStore();
        const newUser = {
          email: this.form.email,
          password: this.form.password,
          type: "jobseeker",
          name: this.form.name,
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
.text-danger {
  color: #dc3545; /* Bootstrap danger color */
}
</style>
