<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Job Details</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="job" class="job-details">
            <h4 class="mb-4">{{ job.title }}</h4>
            
            <div class="row mb-4">
              <div class="col-md-6">
                <p class="mb-3"><strong>Location:</strong> {{ job.location }}</p>
                <p class="mb-3"><strong>Type:</strong> {{ job.type }}</p>
                <p class="mb-3"><strong>Experience Level:</strong> {{ job.experience_level }}</p>
              </div>
              <div class="col-md-6">
                <p class="mb-3">
                  <strong>Status:</strong> 
                  <span :class="['badge', job.is_active ? 'bg-success' : 'bg-secondary']">
                    {{ job.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </p>
                <p class="mb-3"><strong>Posted Date:</strong> {{ job.created_at }}</p>
                <p class="mb-3"><strong>Total Applications:</strong> {{ job.applications_count?.total || 0 }}</p>
                <p class="mb-3">
                  <strong>Application Deadline:</strong>
                  <span :class="{ 'text-danger': isDeadlinePassed }">
                    {{ job.deadline || 'No deadline set' }}
                  </span>
                </p>
              </div>
            </div>

            <div class="mb-4">
              <h5 class="border-bottom pb-2">Description</h5>
              <p class="text-muted mt-3">{{ job.description }}</p>
            </div>

            <div class="mb-4" v-if="hasRequirements">
              <h5 class="border-bottom pb-2">Requirements</h5>
              <ul class="list-unstyled mt-3">
                <li v-for="(req, index) in displayRequirements" :key="index" class="mb-2">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  {{ req }}
                </li>
              </ul>
            </div>

            <div class="mb-4" v-if="hasResponsibilities">
              <h5 class="border-bottom pb-2">Responsibilities</h5>
              <ul class="list-unstyled mt-3">
                <li v-for="(resp, index) in displayResponsibilities" :key="index" class="mb-2">
                  <i class="fas fa-tasks text-primary me-2"></i>
                  {{ resp }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobDetailsModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    job: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasRequirements() {
      return Array.isArray(this.job.requirements) && this.job.requirements.length > 0;
    },
    hasResponsibilities() {
      return Array.isArray(this.job.responsibilities) && this.job.responsibilities.length > 0;
    },
    displayRequirements() {
      return this.hasRequirements ? this.job.requirements : [];
    },
    displayResponsibilities() {
      return this.hasResponsibilities ? this.job.responsibilities : [];
    },
    isDeadlinePassed() {
      if (!this.job.deadline) return false;
      const deadline = new Date(this.job.deadline);
      const today = new Date();
      return deadline < today;
    }
  },
  emits: ['close'],
  mounted() {
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-dialog {
  width: 90%;
  max-width: 800px;
  margin: 1.75rem auto;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 3.5rem);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.5rem - 1px);
  border-top-right-radius: calc(0.5rem - 1px);
  background-color: #f8f9fa;
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.job-details h5 {
  color: #2c3e50;
  font-weight: 600;
}

.badge {
  font-size: 0.875rem;
  padding: 0.4em 0.8em;
}

/* Custom scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive styles */
@media (max-width: 768px) {
  .modal-dialog {
    width: 95%;
    margin: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-header,
  .modal-footer {
    padding: 0.75rem 1rem;
  }
}

.text-danger {
  color: #dc3545 !important;
}
</style> 