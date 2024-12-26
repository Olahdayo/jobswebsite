<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Dashboard Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
          <div class="flex items-center gap-4">
            <button
              @click="showPostJobModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
            >
              <i class="fas fa-plus-circle mr-2"></i>
              Post New Job
            </button>
            <button
              @click="authStore.logout"
              class="text-gray-600 hover:text-gray-900"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-briefcase text-2xl text-primary"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Active Jobs
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ postedJobs.length }}
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
                <i class="fas fa-users text-2xl text-blue-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Applicants
                  </dt>
                  <dd class="text-lg font-semibold text-gray-900">
                    {{ totalApplications }}
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
                    Pending Review
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
                    Approved
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

      <!-- Applications Chart -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Application Trends
        </h3>
        <canvas ref="chartCanvas" height="100"></canvas>
      </div>

      <!-- Job Listings with Applications -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Posted Jobs & Applications
          </h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="job in postedJobs"
            :key="job.id"
            class="px-4 py-4 sm:px-6 hover:bg-gray-50"
          >
            <div class="flex items-center justify-between mb-4">
              <div>
                <h4 class="text-lg font-medium text-primary">
                  {{ job.title }}
                </h4>
                <p class="text-sm text-gray-500">
                  Posted {{ formatDate(job.postedDate) }}
                </p>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-800': job.status === 'active',
                    'bg-gray-100 text-gray-800': job.status === 'closed',
                  }"
                >
                  {{ job.status }}
                </span>
                <button
                  @click="toggleJobStatus(job)"
                  class="text-sm text-gray-600 hover:text-gray-900"
                >
                  {{ job.status === "active" ? "Close" : "Reopen" }}
                </button>
              </div>
            </div>

            <!-- Applications for this job -->
            <div class="mt-4">
              <h5 class="text-sm font-medium text-gray-700 mb-2">
                Applications ({{ getJobApplications(job.id).length }})
              </h5>
              <div class="space-y-3">
                <div
                  v-for="application in getJobApplications(job.id)"
                  :key="application.id"
                  class="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ getApplicantName(application.userId) }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Applied {{ formatDate(application.appliedDate) }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="application.status === 'pending'"
                      @click="updateApplicationStatus(application, 'approved')"
                      class="text-sm text-green-600 hover:text-green-800"
                    >
                      Approve
                    </button>
                    <button
                      v-if="application.status === 'pending'"
                      @click="updateApplicationStatus(application, 'rejected')"
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                    <span
                      v-else
                      :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        {
                          'bg-green-100 text-green-800':
                            application.status === 'approved',
                          'bg-red-100 text-red-800':
                            application.status === 'rejected',
                        },
                      ]"
                    >
                      {{ application.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Post Job Modal -->
    <Modal v-if="showPostJobModal" @close="showPostJobModal = false">
      <template #header>
        <h3 class="text-xl font-bold">Post New Job</h3>
      </template>
      <template #body>
        <form @submit.prevent="handlePostJob" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              v-model="newJob.title"
              type="text"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              v-model="newJob.description"
              rows="4"
              required
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                v-model="newJob.location"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Salary
              </label>
              <input
                v-model="newJob.salary"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Job Type
              </label>
              <select
                v-model="newJob.type"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Field
              </label>
              <input
                v-model="newJob.field"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          </div>
        </form>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="secondary" @click="showPostJobModal = false">
            Cancel
          </Button>
          <Button :loading="isPosting" @click="handlePostJob">
            Post Job
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useJobsStore } from "@/stores/jobs";
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";
import Chart from "chart.js/auto";

const authStore = useAuthStore();
const jobsStore = useJobsStore();

const showPostJobModal = ref(false);
const isPosting = ref(false);
const chartCanvas = ref(null);
let chart = null;

const newJob = ref({
  title: "",
  description: "",
  location: "",
  salary: "",
  type: "Full-time",
  field: "",
});

// Get jobs posted by current employer
const postedJobs = computed(() =>
  jobsStore.jobs.filter((job) => job.company === authStore.user.companyName)
);

// Get all applications for employer's jobs
const applications = computed(() => {
  const allApplications = JSON.parse(
    localStorage.getItem("jobApplications") || "[]"
  );
  return allApplications.filter((app) =>
    postedJobs.value.some((job) => job.id === app.jobId)
  );
});

const totalApplications = computed(() => applications.value.length);

const pendingApplications = computed(() =>
  applications.value.filter((app) => app.status === "pending")
);

const approvedApplications = computed(() =>
  applications.value.filter((app) => app.status === "approved")
);

const getJobApplications = (jobId) => {
  return applications.value.filter((app) => app.jobId === jobId);
};

const getApplicantName = (userId) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);
  return user ? user.fullName : "Unknown Applicant";
};

const updateApplicationStatus = (application, newStatus) => {
  const applications = JSON.parse(
    localStorage.getItem("jobApplications") || "[]"
  );
  const index = applications.findIndex(
    (app) =>
      app.jobId === application.jobId && app.userId === application.userId
  );

  if (index !== -1) {
    applications[index].status = newStatus;
    localStorage.setItem("jobApplications", JSON.stringify(applications));
    // Refresh the applications
    location.reload();
  }
};

const toggleJobStatus = (job) => {
  job.status = job.status === "active" ? "closed" : "active";
  // Update in localStorage
  const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
  const index = jobs.findIndex((j) => j.id === job.id);
  if (index !== -1) {
    jobs[index].status = job.status;
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }
};

const handlePostJob = async () => {
  isPosting.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newJobData = {
      id: Date.now(),
      ...newJob.value,
      company: authStore.user.companyName,
      companyLogo: "",
      postedDate: new Date().toISOString(),
      status: "active",
      featured: false,
    };

    // Add to jobs store
    jobsStore.jobs.push(newJobData);

    // Update localStorage
    const jobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    jobs.push(newJobData);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    showPostJobModal.value = false;
    newJob.value = {
      title: "",
      description: "",
      location: "",
      salary: "",
      type: "Full-time",
      field: "",
    };
  } finally {
    isPosting.value = false;
  }
};

onMounted(() => {
  // Initialize chart
  const ctx = chartCanvas.value.getContext("2d");
  const dates = [
    ...new Set(
      applications.value.map((app) =>
        new Date(app.appliedDate).toLocaleDateString()
      )
    ),
  ];

  const applicationCounts = dates.map(
    (date) =>
      applications.value.filter(
        (app) => new Date(app.appliedDate).toLocaleDateString() === date
      ).length
  );

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: "Applications",
          data: applicationCounts,
          borderColor: "rgb(59, 130, 246)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
