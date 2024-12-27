<template>
  <div class="job-details-container">
    <div v-if="job">
      <h1 class="job-title">{{ job.title }}</h1>
      <div class="job-info">
        <p class="company-name">{{ job.company }}</p>
        <p class="posted-date">
          <i class="bi bi-calendar"></i>
          <span>Posted on: {{ formatPostedDate(job.postedDate) }}</span>
        </p>
        <p class="salary">{{ job.salary }}/month</p>
        <p class="location">Location: {{ job.location }}</p>
      </div>

      <div class="job-description">
        <h2>Job Description</h2>
        <p>{{ job.description }}</p>

        <h2>Requirements</h2>
        <ul class="requirements-list">
          <li v-for="(req, index) in job.requirements" :key="index">
            {{ req }}
          </li>
        </ul>
      </div>

      <div class="apply-button-container">
        <button @click="handleApply" :disabled="isLoading" class="apply-button">
          <span v-if="isLoading">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Applying...
          </span>
          <span v-else>Apply Now</span>
        </button>
      </div>

      <Modal v-if="showSuccessModal" @close="showSuccessModal = false">
        <template #header>
          <h3 class="modal-title">Application Submitted!</h3>
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
      <div class="loading-container">
        <p>Loading job details...</p>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
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
    this.route = useRoute();
    this.router = useRouter();
    this.authStore = useAuthStore();
    this.jobsStore = useJobsStore();
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
      if (!this.authStore || !this.route || !this.router) {
        console.error("Stores or routes not initialized");
        return;
      }

      if (!this.authStore.isAuthenticated) {
        localStorage.setItem("redirectAfterLogin", this.route.fullPath);
        this.router.push("/login");
        return;
      }

      this.isLoading = true;

      setTimeout(() => {
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

<style scoped>
.job-details-container {
  padding: 2rem;
  background-color: #f8f9fa; /* Light background for contrast */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.job-title {
  font-size: 2rem;
  font-weight: bold;
  color: #343a40; /* Darker text color */
}

.job-info {
  margin-top: 1rem;
  color: #6c757d; /* Bootstrap secondary color */
}

.salary {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745; /* Green for salary */
}

.job-description {
  background-color: #ffffff; /* White background for description */
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.requirements-list {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.apply-button-container {
  margin-top: 2rem;
  text-align: center;
}

.apply-button {
  background-color: #007bff; /* Bootstrap primary color */
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.apply-button:hover {
  background-color: #0056b3; /* Darker shade on hover */
}

.loading-container {
  text-align: center;
  margin-top: 2rem;
}
</style>
