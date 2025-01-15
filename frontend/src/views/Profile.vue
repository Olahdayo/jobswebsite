<template>
  <div class="profile-page bg-light min-vh-100">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div class="container">
        <router-link to="/dashboard/jobseeker" class="btn btn-link">
          <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
        </router-link>
        <h1 class="navbar-brand mb-0 h1">Profile Settings</h1>
      </div>
    </nav>

    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <div v-if="success" class="alert alert-success">
                {{ success }}
              </div>

              <form @submit.prevent="updateProfile">
                <div class="row mb-4">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">First Name</label>
                    <input
                      v-model="profileData.first_name"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Last Name</label>
                    <input
                      v-model="profileData.last_name"
                      type="text"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input
                      v-model="profileData.email"
                      type="email"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Phone</label>
                    <input
                      v-model="profileData.phone"
                      type="tel"
                      class="form-control"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">Address</label>
                    <input
                      v-model="profileData.address"
                      type="text"
                      class="form-control"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">Bio</label>
                    <textarea
                      v-model="profileData.bio"
                      class="form-control"
                      rows="4"
                    ></textarea>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :disabled="isLoading"
                  >
                    <span
                      v-if="isLoading"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    {{ isLoading ? "Updating..." : "Update Profile" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "@/services/authService";

export default {
  name: "Profile",

  data() {
    return {
      profileData: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        bio: "",
      },
      isLoading: false,
      error: null,
      success: null,
    };
  },

  created() {
    this.loadUserProfile();
  },

  methods: {
    loadUserProfile() {
      const user = authService.getCurrentUser();
      if (user) {
        this.profileData = {
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
        };
      }
    },

    async updateProfile() {
      try {
        this.isLoading = true;
        this.error = null;
        this.success = null;

        const response = await authService.updateProfile(this.profileData);
        this.success = "Profile updated successfully!";

        // Update local storage with new user data
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update profile";
        console.error("Profile update error:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
