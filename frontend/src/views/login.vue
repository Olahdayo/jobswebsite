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
    submitForm() {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      console.log("Users:", users);

      const user = users.find(
        (u) => u.email === this.form.email && u.password === this.form.password
      );

      if (user) {
        if (user.type === this.selectedRole) {
          const authStore = useAuthStore();
          authStore.user = user;
          localStorage.setItem("currentUser", JSON.stringify(user));

          // Redirect based on user type
          if (user.type === "jobseeker") {
            this.$router.push("/dashboard/jobseeker");
          } else if (user.type === "employer") {
            this.$router.push("/dashboard/employer");
          }
        } else {
          this.errorMessage = "Invalid credentials";
          //   console.log("Type mismatch:", user.type, this.selectedRole);
        }
      } else {
        this.errorMessage = "Invalid credentials";
        // console.log("User not found for the provided credentials.");
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
