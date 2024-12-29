<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="col-md-4">
      <div class="card shadow">
        <div class="card-body">
          <h1 class="text-center mb-4">Login</h1>
          <form @submit.prevent="handleLogin">
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
      const authStore = useAuthStore();
      try {
        console.log("Attempting to log in with:", this.form);
        const user = await authStore.login(this.form.email, this.form.password);

        // Verify that the user's type matches the selected role
        if (user.type !== this.selectedRole) {
          throw new Error("Selected role doesn't match your account type");
        }

        if (user.type === "employer") {
          this.$router.push("/dashboard/employer");
        } else if (user.type === "jobseeker") {
          this.$router.push("/dashboard/jobseeker");
        } else {
          throw new Error("Invalid user type");
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = error.message || "Failed to login. Please try again.";
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
