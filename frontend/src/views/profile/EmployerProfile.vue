<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card profile-card">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <h3 class="mb-0">Company Profile</h3>
            <button
              @click="toggleEdit"
              class="btn btn-light btn-sm"
              v-if="!loading"
            >
              <i :class="isEditing ? 'fas fa-times' : 'fas fa-edit'"></i>
              {{ isEditing ? "Cancel" : "Edit Profile" }}
            </button>
          </div>

          <div class="card-body">
            <!-- Loading Spinner -->
            <div v-if="loading" class="text-center p-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <!-- View Mode -->
            <div v-else-if="!isEditing" class="view-mode">
              <div class="text-center mb-4">
                <div class="logo-container">
                  <img
                    :src="getLogoUrl(formData.logo_url)"
                    class="company-logo"
                    alt="Company Logo"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <div class="profile-info">
                <div class="info-section">
                  <h4 class="company-name">{{ formData.company_name }}</h4>
                  <div class="info-grid">
                    <div class="info-item">
                      <i class="fas fa-phone text-primary"></i>
                      <span>{{ formData.phone || "No phone number" }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-globe text-primary"></i>
                      <a
                        :href="formData.website"
                        target="_blank"
                        class="website-link"
                      >
                        {{ formData.website || "No website" }}
                      </a>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-industry text-primary"></i>
                      <span>{{
                        formData.industry || "Industry not specified"
                      }}</span>
                    </div>
                    <div class="info-item">
                      <i class="fas fa-map-marker-alt text-primary"></i>
                      <span>{{
                        formData.location || "Location not specified"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="description-section">
                  <h5 class="section-title">About Company</h5>
                  <p class="company-description">
                    {{
                      formData.company_description ||
                      "No company description available."
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Edit Mode -->
            <form @submit.prevent="handleSubmit" v-else>
              <!-- Company Logo Section -->
              <div class="text-center mb-4">
                <div class="logo-container">
                  <img
                    :src="logoPreview || getLogoUrl(formData.logo_url)"
                    class="company-logo"
                    alt="Company Logo"
                    @error="handleImageError"
                  />
                  <div class="logo-upload-overlay">
                    <label for="logo-upload" class="upload-label">
                      <i class="fas fa-camera"></i>
                      Change Logo
                    </label>
                    <input
                      type="file"
                      id="logo-upload"
                      class="d-none"
                      accept="image/*"
                      @change="handleLogoUpload"
                    />
                  </div>
                </div>
              </div>

              <!-- Company Details Form -->
              <div class="form-section">
                <div class="mb-3">
                  <label class="form-label">Company Name</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    v-model="formData.company_name"
                    placeholder="Enter company name"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    v-model="formData.phone"
                    placeholder="Enter phone number"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Company Description</label>
                  <textarea
                    class="form-control custom-textarea"
                    v-model="formData.company_description"
                    rows="4"
                    placeholder="Describe your company"
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Website</label>
                  <input
                    type="url"
                    class="form-control custom-input"
                    v-model="formData.website"
                    placeholder="https://example.com"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Industry</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    v-model="formData.industry"
                    placeholder="Enter industry"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Location</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    v-model="formData.location"
                    placeholder="Enter location"
                  />
                </div>

                <div class="text-center mt-4">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg submit-btn"
                  >
                    <i class="fas fa-save me-2"></i>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useEmployerStore } from "@/stores/employer";
import { mapState, mapActions } from "pinia";

export default {
  name: "EmployerProfile",

  data() {
    return {
      loading: false,
      logoPreview: null,
      isEditing: false,
      formData: {
        company_name: "",
        phone: "",
        company_description: "",
        website: "",
        industry: "",
        location: "",
        logo_url: "",
      },
    };
  },

  computed: {
    ...mapState(useEmployerStore, ["profile", "loading", "error"]),
  },

  methods: {
    ...mapActions(useEmployerStore, [
      "fetchProfile",
      "updateProfile",
      "uploadLogo",
    ]),

    toggleEdit() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.updateFormData();
      }
    },

    async handleLogoUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Show preview immediately
      this.logoPreview = URL.createObjectURL(file);

      const formData = new FormData();
      formData.append("logo", file);

      try {
        const response = await this.uploadLogo(formData);

        if (response.employer && response.employer.logo_url) {
          this.formData.logo_url = response.employer.logo_url;
          // Clear the preview after successful upload
          URL.revokeObjectURL(this.logoPreview);
          this.logoPreview = null;
        }
      } catch (error) {
        console.error("Failed to upload logo:", error);
        alert(error.response?.data?.message || "Failed to upload company logo");
        // Revert preview on error
        URL.revokeObjectURL(this.logoPreview);
        this.logoPreview = null;
      }
    },

    updateFormData() {
      if (this.profile) {
        Object.assign(this.formData, {
          company_name: this.profile.company_name || "",
          phone: this.profile.phone || "",
          company_description: this.profile.company_description || "",
          website: this.profile.website || "",
          industry: this.profile.industry || "",
          location: this.profile.location || "",
          logo_url: this.profile.logo_url || "",
        });
      }
    },

    async handleSubmit() {
      try {
        // Validate required fields
        const requiredFields = ["company_name", "industry", "location"];
        const missingFields = requiredFields.filter(
          (field) => !this.formData[field]
        );

        if (missingFields.length > 0) {
          throw new Error(
            `Please fill in the following required fields: ${missingFields.join(
              ", "
            )}`
          );
        }

        // Clean up the form data
        const profileData = {
          company_name: this.formData.company_name.trim(),
          phone: this.formData.phone?.trim() || null,
          company_description:
            this.formData.company_description?.trim() || null,
          website: this.formData.website?.trim() || null,
          industry: this.formData.industry.trim(),
          location: this.formData.location.trim(),
          logo_url: this.formData.logo_url || null,
        };

        const response = await this.updateProfile(profileData);

        if (response) {
          this.isEditing = false;
          alert("Profile updated successfully!");
        }
      } catch (error) {
        console.error("Profile update error:", error);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to update profile"
        );
      }
    },

    getLogoUrl(logoUrl) {
      if (!logoUrl) return "/images/dashboard-default.svg";
      if (logoUrl.startsWith("http")) return logoUrl;
      return `http://localhost:8000/storage/${logoUrl}`;
    },

    handleImageError(event) {
      event.target.src = "/images/dashboard-default.svg";
      event.target.removeEventListener("error", this.handleImageError);
    },
  },

  watch: {
    profile: {
      handler(newProfile) {
        if (newProfile) {
          this.updateFormData();
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.fetchProfile();
  },
};
</script>

<style scoped>
.profile-card {
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: none;
}

.logo-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.company-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.logo-upload-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-container:hover .logo-upload-overlay {
  opacity: 1;
}

.upload-label {
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  margin: 0;
}

/* View Mode Styles */
.view-mode {
  padding: 1rem;
}

.company-name {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
}

.info-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item i {
  font-size: 1.2rem;
  width: 24px;
}

.description-section {
  padding: 1rem;
}

.section-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-weight: 600;
}

.company-description {
  line-height: 1.6;
  color: #666;
}

.website-link {
  color: #4a90e2;
  text-decoration: none;
}

.website-link:hover {
  text-decoration: underline;
}

/* Form Styles */
.form-section {
  padding: 1rem;
}

.custom-input,
.custom-textarea {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.custom-input:focus,
.custom-textarea:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.submit-btn {
  padding: 12px 40px;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .logo-container {
    width: 120px;
    height: 120px;
  }

  .card-body {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .company-name {
    font-size: 1.5rem;
  }
}
</style>
