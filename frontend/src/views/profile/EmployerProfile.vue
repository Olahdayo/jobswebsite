<template>
  <div class="profile container mt-5">
    <h1 class="text-center mb-4">Employer Profile</h1>
    <div class="profile-header text-center">
      <img :src="companyLogo" alt="Company Logo" class="profile-picture img-fluid rounded-circle mb-3" />
      <h2 class="mb-2">{{ employer.name }}</h2>
      <p class="text-muted">{{ employer.description }}</p>
    </div>
    <div class="profile-details mt-4">
      <h3>Contact Information</h3>
      <ul class="list-group">
        <li class="list-group-item">Email: <strong>{{ employer.email }}</strong></li>
        <li class="list-group-item">Phone: <strong>{{ employer.phone }}</strong></li>
        <li class="list-group-item">Website: <strong><a :href="employer.website" target="_blank">{{ employer.website }}</a></strong></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employer: {},
      companyLogo: '',
    };
  },
  created() {
    this.fetchEmployerData();
  },
  methods: {
    async fetchEmployerData() {
      try {
        const response = await fetch('/api/employer/profile');
        if (!response.ok) throw new Error('Failed to fetch employer data');
        const data = await response.json();
        this.employer = data;
        this.companyLogo = data.logo;
      } catch (error) {
        console.error('Error fetching employer data:', error);
      }
    },
  },
};
</script>

<style scoped>
.profile {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background-color: #f8f9fa;
}
.profile-picture {
  width: 150px;
  height: auto;
  border-radius: 50%;
  border: 2px solid #007bff;
}
.list-group-item {
  background-color: #ffffff;
}
</style>
