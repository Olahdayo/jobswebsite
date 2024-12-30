<template>
  <div class="sidebar">
    <!-- Recent Postings -->
    <div class="sidebar-widget mb-4">
      <h4 class="mb-3">Recent Postings</h4>
      <div class="list-group">
        <router-link
          v-for="job in recentPostings"
          :key="job.id"
          :to="'/jobs/' + job.id "
          class="list-group-item list-group-item-action border-0 mb-2 rounded"
        >
          <h6 class="mb-1">{{ job.title }}</h6>
          <p class="mb-1 small text-muted">{{ job.company }}</p>
          <small class="text-muted">Posted {{ formatDate(job.postedDate) }}</small>
        </router-link>
      </div>
    </div>

    <!-- Jobs by State -->
    <div class="sidebar-widget mb-4">
      <h4 class="mb-3">Jobs by State</h4>
      <div class="list-group">
        <router-link
          v-for="(count, state) in jobsByState"
          :key="state"
          :to="'/jobs/state/' + state"
          class="list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center mb-2 rounded"
        >
          {{ state }}
          <span class="badge bg-primary rounded-pill">{{ count }}</span>
        </router-link>
      </div>
    </div>

    <!-- Popular Categories -->
    <div class="sidebar-widget">
      <h4 class="mb-3">Popular Categories</h4>
      <div class="list-group">
        <router-link
          v-for="(count, category) in jobsByField"
          :key="category"
          :to="'/jobs/category/' + category"
          class="list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center mb-2 rounded"
        >
          {{ category }}
          <span class="badge bg-primary rounded-pill">{{ count }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recentPostings: Array,
    jobsByState: Object,
    jobsByField: Object,
    formatDate: Function,
  },
};
</script>

<style scoped>
/* Sidebar styles */
.sidebar {
  position: relative;
  margin-top: 5px;
  max-height: calc(100vh - 40px);
  z-index: 1000;
}

/* Remove overflow property to show all content */
.sidebar-widget {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.list-group-item {
  background: #f8f9fa;
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background: #e9ecef;
}

@media (max-width: 767.98px) {
  .sidebar {
    margin-top: 0;
    max-height: none;
  }

  .sidebar-widget {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .sidebar-widget h4 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem !important;
  }

  .list-group-item {
    padding: 0.75rem;
    margin-bottom: 0.5rem !important;
  }

  .list-group-item h6 {
    font-size: 0.9rem;
    margin-bottom: 0.25rem !important;
  }

  .list-group-item p,
  .list-group-item small {
    font-size: 0.8rem;
    margin-bottom: 0.25rem !important;
  }

  .badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
  }

  /* Make the list more compact */
  .list-group {
    max-height: 200px;
    overflow-y: auto;
  }

  /* Add a subtle scrollbar for the list */
  .list-group::-webkit-scrollbar {
    width: 4px;
  }

  .list-group::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .list-group::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
}
</style>