<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Role Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              v-model="form.role"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span v-if="authStore.loading">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </span>
              <span v-else>Sign in</span>
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Don't have an account?
                <router-link
                  :to="'/signup/' + form.role"
                  class="font-medium text-primary hover:text-primary-dark"
                >
                  Sign up
                </router-link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  email: "",
  password: "",
  role: "jobseeker",
});

const handleSubmit = async () => {
  try {
    await authStore.login(form.value);

    // Check for redirect after login
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectPath);
    } else {
      router.push(`/dashboard/${form.value.role}`);
    }
  } catch (error) {
    alert(error.message);
  }
};
</script>
