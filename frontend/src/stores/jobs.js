import { defineStore } from "pinia";
import jobsData from "@/data/jobs.json";
import filterOptions from "@/data/filterOptions.json";

export const useJobsStore = defineStore("jobs", {
  state: () => ({
    jobs: [],
    filteredJobs: [],
    filterOptions: filterOptions,
    searchFilters: {
      query: "",
      location: "",
      field: "",
      education: "",
      jobType: "",
    },
    editingJob: null,
  }),

  getters: {
    activeJobs() {
      return this.jobs.filter((job) => job.status === "active");
    },

    featuredActiveJobs() {
      return this.activeJobs.filter((job) => job.featured);
    },

    latestActiveJobs() {
      return [...this.activeJobs].sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      );
    },
  },

  actions: {
    initializeJobs() {
      this.jobs = JSON.parse(localStorage.getItem("jobs")) || jobsData.jobs;
      this.filterJobs();
    },

    addJob(job) {
      const isDuplicate = this.jobs.some(
        (existingJob) =>
          existingJob.title === job.title &&
          existingJob.company === job.company &&
          Math.abs(
            new Date(existingJob.postedDate) - new Date(job.postedDate)
          ) < 60000
      );

      if (isDuplicate) {
        throw new Error(
          "A similar job was just posted. Please wait a moment before posting again."
        );
      }

      this.jobs = [...this.jobs, job];

      localStorage.setItem("jobs", JSON.stringify(this.jobs));

      this.filterJobs();
    },

    filterJobs() {
      this.filteredJobs = this.jobs.filter((job) => job.status === "active");

      this.filteredJobs = this.filteredJobs.filter((job) => {
        const matchQuery =
          !this.searchFilters.query ||
          job.title
            .toLowerCase()
            .includes(this.searchFilters.query.toLowerCase()) ||
          job.company
            .toLowerCase()
            .includes(this.searchFilters.query.toLowerCase());

        const matchLocation =
          !this.searchFilters.location ||
          job.location === this.searchFilters.location;

        const matchField =
          !this.searchFilters.field || job.field === this.searchFilters.field;

        const matchType =
          !this.searchFilters.jobType ||
          job.type === this.searchFilters.jobType;

        const matchEducation =
          !this.searchFilters.education ||
          job.educationLevel === this.searchFilters.education;

        return (
          matchQuery &&
          matchLocation &&
          matchField &&
          matchType &&
          matchEducation
        );
      });
    },

    getFeaturedJobs() {
      return this.featuredActiveJobs.slice(0, 6);
    },

    getAllFeaturedJobs() {
      return this.featuredActiveJobs;
    },

    getLatestJobs() {
      return this.latestActiveJobs;
    },

    setEditingJob(job) {
      this.editingJob = job;
    },

    clearEditingJob() {
      this.editingJob = null;
    },

    updateJob(updatedJob) {
      const index = this.jobs.findIndex((job) => job.id === updatedJob.id);
      if (index !== -1) {
        this.jobs[index] = updatedJob;
        localStorage.setItem("jobs", JSON.stringify(this.jobs));
      }
    },
  },
});
