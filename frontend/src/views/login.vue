<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="col-md-4">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Login</h1>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email:</label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                class="form-control"
                required
              />
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
            </div>
            <div class="mb-3">
              <label for="role" class="form-label">Select Role:</label>
              <select
                v-model="selectedRole"
                id="role"
                class="form-select"
                required
              >
                <option value="" disabled>Select your role</option>
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
            </div>
            <div v-if="errorMessage" class="text-danger mb-3">
              {{ errorMessage }}
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
          <p class="mt-3 text-center">
            Don't have an account?
            <router-link to="/signup" class="link-primary">Sign up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      selectedRole: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        await this.authStore.login(this.form);

        // Check for return URL
        const returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          this.$router.push(returnUrl);
        } else {
          // Default navigation based on role
          if (this.authStore.user.role === "employer") {
            this.$router.push("/dashboard/employer");
          } else {
            this.$router.push("/dashboard/jobseeker");
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        alert(error.message || "Failed to login. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
