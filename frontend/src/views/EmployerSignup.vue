<template>
  <div class="container py-5">
    <h1 class="text-3xl font-bold">Employer Signup</h1>
    <form @submit.prevent="submitForm">
      <div class="mb-4">
        <label for="companyName" class="block">Company Name:</label>
        <input
          v-model="form.companyName"
          type="text"
          id="companyName"
          class="border rounded p-2 w-full"
        />
        <span v-if="errors.companyName" class="text-red-500">{{
          errors.companyName
        }}</span>
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
      <div class="mb-4">
        <label for="confirmPassword" class="block">Confirm Password:</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          id="confirmPassword"
          class="border rounded p-2 w-full"
        />
        <span v-if="errors.confirmPassword" class="text-red-500">{{
          errors.confirmPassword
        }}</span>
      </div>
      <button 
        type="submit" 
        class="bg-primary text-white rounded px-4 py-2"
        :disabled="authStore.loading"
      >
        {{ authStore.loading ? 'Signing Up...' : 'Sign Up' }}
      </button>
    </form>
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
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  methods: {
    validateForm() {
      // Reset previous errors
      this.errors = {
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

      let isValid = true;

      // Validate Company Name
      if (!this.form.companyName.trim()) {
        this.errors.companyName = "Company name is required.";
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email.trim()) {
        this.errors.email = "Email is required.";
        isValid = false;
      } else if (!emailPattern.test(this.form.email)) {
        this.errors.email = "Email is invalid.";
        isValid = false;
      }

      // Validate Password
      if (!this.form.password) {
        this.errors.password = "Password is required.";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters long.";
        isValid = false;
      }

      // Validate Confirm Password
      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match.";
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      // Prepare the data for registration
      const registrationData = {
        name: this.form.companyName, // Using name field from existing store method
        email: this.form.email,
        password: this.form.password,
        type: 'employer' // Optional: Add a type to distinguish user registration
      };

      if (this.validateForm()) {
        this.authStore.register(registrationData)
          .then((user) => {
            // Registration successful
            console.log("Employer registered:", user);
            this.$router.push("/login"); // Redirect to login page
          })
          .catch((error) => {
            // Handle registration error
            console.error("Registration failed:", error);
            
            // Set error message based on the error
            if (error.message === "Email already registered") {
              this.errors.email = "This email is already registered.";
            } else {
              this.errors.email = "Registration failed. Please try again.";
            }
          });
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