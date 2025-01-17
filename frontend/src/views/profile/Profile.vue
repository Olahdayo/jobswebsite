<template>
  <div class="profile-page">
    <div class="container py-5">
      <div class="row">
        <!-- Profile Card -->
        <div class="col-md-4">
          <div class="profile-card card">
            <div class="card-body text-center">
              <!-- Profile Picture -->
              <div class="profile-picture-container mb-4">
                <img 
                  :src="profileStore.profilePictureUrl" 
                  :alt="profileStore.userProfile?.first_name"
                  class="profile-picture"
                >
                <div class="upload-overlay" @click="triggerImageUpload" :class="{ 'uploading': isUploading }">
                  <span v-if="!isUploading">
                    <i class="fas fa-camera"></i> Change Photo
                  </span>
                  <span v-else>
                    <i class="fas fa-spinner fa-spin"></i> Uploading...
                  </span>
                </div>
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleImageChange" 
                  accept="image/jpeg,image/png,image/gif" 
                  class="d-none"
                >
              </div>

              <!-- Profile Info -->
              <h3 class="mb-3">{{ profileStore.userProfile?.first_name }} {{ profileStore.userProfile?.last_name }}</h3>
              <p class="text-muted mb-2">
                <i class="fas fa-envelope me-2"></i>{{ profileStore.userProfile?.email }}
              </p>
              <p class="text-muted mb-3">
                <i class="fas fa-phone me-2"></i>{{ profileStore.userProfile?.phone || 'No phone number' }}
              </p>
              
              <button class="btn btn-primary w-100" @click="showEditModal = true">
                <i class="fas fa-edit me-2"></i>Edit Profile
              </button>
            </div>
          </div>

          <!-- Skills Card -->
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title mb-3">Skills</h5>
              <div class="skills-container">
                <span 
                  v-for="skill in profileStore.userProfile?.skills" 
                  :key="skill" 
                  class="skill-badge"
                >
                  {{ skill }}
                </span>
                <p v-if="!profileStore.userProfile?.skills?.length" class="text-muted">
                  No skills added yet
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-8">
          <!-- Career Overview Card -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-0">Career Overview</h5>
                <button class="btn btn-sm btn-outline-primary" @click="showEditModal = true">
                  <i class="fas fa-edit me-1"></i>Edit
                </button>
              </div>
              
              <!-- Current Position -->
              <div class="current-position mb-4">
                <div class="d-flex align-items-center">
                  <div class="position-icon me-3">
                    <i class="fas fa-briefcase fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h6 class="mb-1">Current Position</h6>
                    <p class="text-primary mb-0 fw-bold">{{ profileStore.userProfile?.current_job_title || 'Not specified' }}</p>
                  </div>
                </div>
              </div>

              <!-- Experience Level -->
              <div class="experience-level mb-4">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="info-card">
                      <i class="fas fa-clock text-info me-2"></i>
                      <div>
                        <small class="text-muted d-block">Years of Experience</small>
                        <strong>{{ profileStore.userProfile?.years_of_experience || '0' }} Years</strong>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="info-card">
                      <i class="fas fa-graduation-cap text-success me-2"></i>
                      <div>
                        <small class="text-muted d-block">Education Level</small>
                        <strong>{{ profileStore.userProfile?.education_level || 'Not specified' }}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Education & Skills Card -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-4">Education & Expertise</h5>
              
              <!-- Education -->
              <div class="education-section mb-4">
                <h6 class="section-title">
                  <i class="fas fa-book-reader text-primary me-2"></i>
                  Academic Background
                </h6>
                <div class="education-content p-3 bg-light rounded">
                  <div class="row">
                    <div class="col-md-6">
                      <p class="mb-2">
                        <strong class="text-muted">Field of Study:</strong><br>
                        {{ profileStore.userProfile?.field_of_study || 'Not specified' }}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <p class="mb-2">
                        <strong class="text-muted">Education Level:</strong><br>
                        {{ profileStore.userProfile?.education_level || 'Not specified' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Skills -->
              <div class="skills-section">
                <h6 class="section-title">
                  <i class="fas fa-tools text-primary me-2"></i>
                  Professional Skills
                </h6>
                <div class="skills-content">
                  <div v-if="profileStore.userProfile?.skills?.length" class="skills-grid">
                    <div 
                      v-for="skill in profileStore.userProfile.skills" 
                      :key="skill" 
                      class="skill-badge"
                    >
                      <i class="fas fa-check-circle me-1"></i>
                      {{ skill }}
                    </div>
                  </div>
                  <p v-else class="text-muted">No skills added yet</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Professional Stats Card -->
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title mb-4">Professional Stats</h5>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-chart-line text-primary"></i>
                  </div>
                  <div class="stat-info">
                    <h3 class="mb-1">{{ profileStore.userProfile?.years_of_experience || '0' }}</h3>
                    <p class="text-muted mb-0">Years Experience</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-certificate text-warning"></i>
                  </div>
                  <div class="stat-info">
                    <h3 class="mb-1">{{ (profileStore.userProfile?.skills || []).length }}</h3>
                    <p class="text-muted mb-0">Skills</p>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon">
                    <i class="fas fa-user-graduate text-success"></i>
                  </div>
                  <div class="stat-info">
                    <h3 class="mb-1">{{ profileStore.userProfile?.education_level || 'N/A' }}</h3>
                    <p class="text-muted mb-0">Education</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" :class="{ show: showEditModal }" v-if="showEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Profile</h5>
            <button type="button" class="btn-close" @click="showEditModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleProfileUpdate">
              <!-- Basic Information -->
              <div class="mb-4">
                <h6 class="form-section-title">Basic Information</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-control" v-model="editForm.first_name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-control" v-model="editForm.last_name" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-control" v-model="editForm.phone">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Current Job Title</label>
                    <input type="text" class="form-control" v-model="editForm.current_job_title">
                  </div>
                </div>
              </div>

              <!-- Professional Information -->
              <div class="mb-4">
                <h6 class="form-section-title">Professional Information</h6>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Years of Experience</label>
                    <input type="number" class="form-control" v-model="editForm.years_of_experience" min="0">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Education Level</label>
                    <select class="form-select" v-model="editForm.education_level">
                      <option value="">Select education level</option>
                      <option value="High School">High School</option>
                      <option value="Bachelor's Degree">Bachelor's Degree</option>
                      <option value="Master's Degree">Master's Degree</option>
                      <option value="PhD">PhD</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Field of Study</label>
                    <input type="text" class="form-control" v-model="editForm.field_of_study">
                  </div>
                  <div class="col-12">
                    <label class="form-label">Skills (comma-separated)</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      v-model="editForm.skills"
                      placeholder="e.g. JavaScript, Vue.js, PHP"
                    >
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="showEditModal = false">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary" :disabled="profileStore.isLoading">
                  <span v-if="profileStore.isLoading" class="spinner-border spinner-border-sm me-1"></span>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useProfileStore } from '@/stores/profile';

export default {
  name: 'Profile',

  data() {
    return {
      showEditModal: false,
      isUploading: false,
      editForm: {
        first_name: '',
        last_name: '',
        phone: '',
        current_job_title: '',
        years_of_experience: '',
        education_level: '',
        field_of_study: '',
        skills: ''
      },
      profileStore: null
    };
  },

  created() {
    this.profileStore = useProfileStore();
    this.loadProfileData();
  },

  methods: {
    async loadProfileData() {
      await this.profileStore.fetchProfile();
      this.initializeEditForm();
    },

    initializeEditForm() {
      const profile = this.profileStore.userProfile;
      if (profile) {
        this.editForm = {
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          current_job_title: profile.current_job_title || '',
          years_of_experience: profile.years_of_experience || '',
          education_level: profile.education_level || '',
          field_of_study: profile.field_of_study || '',
          skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || ''
        };
      }
    },

    triggerImageUpload() {
      if (!this.isUploading) {
        this.$refs.fileInput.click();
      }
    },

    async handleImageChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('Image size should not exceed 10MB');
        return;
      }

      try {
        this.isUploading = true;
        const formData = new FormData();
        formData.append('profile_picture', file);
        
        const success = await this.profileStore.uploadProfilePicture(formData);
        if (!success) {
          throw new Error('Failed to upload profile picture');
        }
      } catch (error) {
        alert(error.message || 'Failed to upload profile picture');
      } finally {
        this.isUploading = false;
        // Clear the input to allow uploading the same file again
        event.target.value = '';
      }
    },

    async handleProfileUpdate() {
      if (await this.profileStore.updateProfile(this.editForm)) {
        this.showEditModal = false;
      }
    }
  }
};
</script>

<style scoped>
.profile-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.profile-card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.profile-picture-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
}

.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, background-color 0.3s;
}

.upload-overlay.uploading {
  opacity: 1;
  background: rgba(0, 0, 0, 0.8);
  cursor: not-allowed;
}

.profile-picture-container:hover .upload-overlay:not(.uploading) {
  opacity: 1;
}

.info-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.section-title {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 1rem;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  transition: all 0.3s;
}

.skill-badge:hover {
  background-color: #0d6efd;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  font-size: 1.5rem;
}

.stat-info h3 {
  font-size: 1.5rem;
  margin: 0;
}

.form-section-title {
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
  padding-top: 70px;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}

.modal-dialog {
  margin: 1.75rem auto;
  max-width: 600px;
}

.modal-content {
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  position: relative;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.current-position {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.position-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}
</style>