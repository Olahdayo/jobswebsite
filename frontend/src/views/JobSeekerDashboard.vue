<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Dashboard Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            @click="authStore.logout"
            class="text-gray-600 hover:text-gray-900"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-paper-plane text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Applications Sent
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ applications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock text-2xl text-yellow-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Pending Reviews
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ pendingApplications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-check-circle text-2xl text-green-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Approved Applications
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ approvedApplications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="bg-white shadow rounded-lg mb-8">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Recent Applications
          </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="application in recentApplications"
            :key="application.jobId"
            class="px-4 py-4 sm:px-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-primary truncate">
                  {{ getJobDetails(application.jobId).title }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ getJobDetails(application.jobId).company }}
                </p>
              </div>
              <div class="flex items-center">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    {
                      'bg-yellow-100 text-yellow-800':
                        application.status === 'pending',
                      'bg-green-100 text-green-800':
                        application.status === 'approved',
                      'bg-red-100 text-red-800':
                        application.status === 'rejected',
                    },
                  ]"
                >
                  {{ application.status }}
                </span>
                <p class="ml-4 text-sm text-gray-500">
                  Applied {{ formatDate(application.appliedDate) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Find More Jobs CTA -->
      <div class="bg-primary rounded-lg shadow-lg">
        <div
          class="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            <span class="block">Ready to find your next opportunity?</span>
          </h2>
          <div class="mt-8 flex justify-center">
            <div class="inline-flex rounded-md shadow">
              <router-link
                to="/jobs"
                class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Browse Jobs
                <i class="fas fa-arrow-right ml-3"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";

const authStore = useAuthStore();
const jobsStore = useJobsStore();

const applications = ref([]);

onMounted(() => {
  // Load applications from localStorage
  applications.value = JSON.parse(
    localStorage.getItem("jobApplications") || "[]"
  ).filter((app) => app.userId === authStore.user.id);
});

const pendingApplications = computed(() =>
  applications.value.filter((app) => app.status === "pending")
);

const approvedApplications = computed(() =>
  applications.value.filter((app) => app.status === "approved")
);

const recentApplications = computed(() =>
  [...applications.value].sort(
    (a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)
  )
);

const getJobDetails = (jobId) => {
  return jobsStore.jobs.find((job) => job.id === jobId) || {};
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
