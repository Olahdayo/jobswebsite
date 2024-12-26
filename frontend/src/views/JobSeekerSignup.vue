<template>
  <div class="container py-5">
    <h1 class="text-3xl font-bold">Job Seeker Signup</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="name" class="block">Name:</label>
        <input
          v-model="form.name"
          type="text"
          id="name"
          class="border rounded p-2 w-full"
        />
        <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
      </div>
      <div class="mb-4">
        <label for="email" class="block">Email:</label>
        <input
          v-model="form.email"
          type="email"
          id="email"
          class="border rounded p-2 w-full"
        />
        <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
      </div>
      <div class="mb-4">
        <label for="password" class="block">Password:</label>
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="border rounded p-2 w-full"
        />
        <span v-if="errors.password" class="text-red-500">{{
          errors.password
        }}</span>
      </div>
      <button type="submit" class="bg-primary text-white rounded px-4 py-2">
        Sign Up
      </button>
    </form>
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
          role: "jobseeker",
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
/* Add any specific styles here */
.text-red-500 {
  color: red;
}
</style>
