<template>
  <div>
    <h2>Jobs in {{ state }}</h2>
    <div v-if="filteredJobs.length === 0">No jobs found for this location.</div>
    <div v-else>
      <div v-for="job in filteredJobs" :key="job.id" class="job-card">
        <h5>{{ job.title }}</h5>
        <p>{{ job.company }}</p>
        <p>{{ job.location }}</p>
        <router-link :to="'/jobs/' + job.id">View Details</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useJobsStore } from "@/stores/jobs"; 

export default {
  data() {
    return {
      state: null,
    };
  },
  computed: {
    filteredJobs() {
      const jobsStore = useJobsStore(); 
      return jobsStore.jobs.filter(job => job.location === this.state); 
    },
  },
  methods: {
    getState() {
      this.state = this.$route.params.state; 
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.getState(); 
    this.scrollToTop();
  },
};
</script>

<style scoped>

</style> 