<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card">
          <div class="card-header">
            <h3>Company Profile</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit" v-if="!loading">
              <div class="mb-3">
                <label class="form-label">Company Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.company_name"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Phone</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.phone"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Company Description</label>
                <textarea
                  class="form-control"
                  v-model="formData.company_description"
                  rows="4"
                ></textarea>
              </div>

              <div class="mb-3">
                <label class="form-label">Website</label>
                <input
                  type="url"
                  class="form-control"
                  v-model="formData.website"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Industry</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.industry"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Location</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.location"
                />
              </div>

              <button type="submit" class="btn btn-primary">
                Update Profile
              </button>
            </form>
            <div v-else class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useEmployerStore } from "@/stores/employer";
import { ref, onMounted } from "vue";

export default {
  name: "EmployerProfile",
  setup() {
    const employerStore = useEmployerStore();
    const loading = ref(false);
    const formData = ref({
      company_name: "",
      phone: "",
      company_description: "",
      website: "",
      industry: "",
      location: "",
      logo_url: "",
    });

    const loadProfile = async () => {
      loading.value = true;
      try {
        await employerStore.fetchProfile();
        const profile = employerStore.profile;
        Object.assign(formData.value, profile);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      loading.value = true;
      try {
        await employerStore.updateProfile(formData.value);
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile");
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadProfile();
    });

    return {
      formData,
      loading,
      handleSubmit,
    };
  },
};
</script>
