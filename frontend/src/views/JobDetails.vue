<template>
  <div class="container py-5">
    <div v-if="job">
      <h1 class="text-3xl font-bold">{{ job.title }}</h1>
      <div class="mt-2 text-gray-600">
        <p class="text-lg">{{ job.company }}</p>
        <p class="flex items-center gap-2 mt-1">
          <i class="bi bi-calendar"></i>
          <span>Posted on: {{ formatPostedDate(job.postedDate) }}</span>
        </p>
        <p class="text-2xl font-bold text-primary">{{ job.salary }}/month</p>
        <p class="text-sm text-gray-500">Location: {{ job.location }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 mt-4">
        <h2 class="text-xl font-bold mb-4">Job Description</h2>
        <p class="text-gray-700">{{ job.description }}</p>

        <h2 class="text-xl font-bold mt-6 mb-4">Requirements</h2>
        <ul class="list-disc pl-5 text-gray-700">
          <li v-for="(req, index) in job.requirements" :key="index">
            {{ req }}
          </li>
        </ul>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t"
      >
        <div class="max-w-6xl mx-auto">
          <button
            @click="handleApply"
            :disabled="isLoading"
            class="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <span v-if="isLoading">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Applying...
            </span>
            <span v-else>Apply Now</span>
          </button>
        </div>
      </div>

      <Modal v-if="showSuccessModal" @close="showSuccessModal = false">
        <template #header>
          <h3 class="text-xl font-bold">Application Submitted!</h3>
        </template>
        <template #body>
          <p>
            Your application for {{ job.title }} at {{ job.company }} has been
            submitted successfully.
          </p>
        </template>
        <template #footer>
          <Button @click="showSuccessModal = false">Close</Button>
        </template>
      </Modal>
    </div>
    <div v-else>
      <p>Loading job details...</p>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { useJobsStore } from "@/stores/jobs";
import { useAuthStore } from "@/stores/auth";
import Modal from "@/components/Modal.vue";
import Button from "@/components/Button.vue";

export default {
  name: "JobDetails",
  components: {
    Modal,
    Button,
  },
  data() {
    return {
      job: null,
      isLoading: false,
      showSuccessModal: false,
      route: null,
      router: null,
      authStore: null,
      jobsStore: null,
    };
  },
  created() {
    // Initialize route, router, and stores in created hook
    this.route = useRoute();
    this.router = useRouter();
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();

    // Load job details
    this.loadJobDetails();
  },
  methods: {
    loadJobDetails() {
      if (!this.route) return;

      const jobId = parseInt(this.route.params.id);
      this.job = this.jobsStore.jobs.find((j) => j.id === jobId);
      
      if (!this.job) {
        this.router.push("/jobs");
      }
    },
    formatPostedDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString("en-NG", options);
    },
    handleApply() {
      // Ensure all necessary stores and routes are initialized
      if (!this.authStore || !this.route || !this.router) {
        console.error("Stores or routes not initialized");
        return;
      }

      // Check if user is authenticated
      if (!this.authStore.isAuthenticated) {
        // Store the current route to redirect back after login
        localStorage.setItem("redirectAfterLogin", this.route.fullPath);
        this.router.push("/login");
        return;
      }

      this.isLoading = true;

      // Simulate API call
      setTimeout(() => {
        // Save application to localStorage
        const applications = JSON.parse(
          localStorage.getItem("jobApplications") || "[]"
        );
        applications.push({
          jobId: this.job.id,
          userId: this.authStore.user.id,
          appliedDate: new Date().toISOString(),
          status: "pending",
        });
        localStorage.setItem("jobApplications", JSON.stringify(applications));

        this.isLoading = false;
        this.showSuccessModal = true;
      }, 1500);
    },
  },
};
</script>