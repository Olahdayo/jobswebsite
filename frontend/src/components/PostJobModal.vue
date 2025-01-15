<template>
  <div class="modal fade" ref="modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Post New Job</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form
            @submit.prevent="handleSubmit"
            class="needs-validation"
            novalidate
          >
            <div class="row g-3">
              <!-- Job Title -->
              <div class="col-12">
                <label class="form-label">Job Title*</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  required
                />
                <div class="invalid-feedback">Please provide a job title.</div>
              </div>

              <!-- Job Type -->
              <div class="col-md-6">
                <label class="form-label">Job Type*</label>
                <select v-model="form.type" class="form-select" required>
                  <option value="">Select job type</option>
                  <option
                    v-for="type in formOptionsStore.jobTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
                <div class="invalid-feedback">Please select a job type.</div>
              </div>

              <!-- Field -->
              <div class="col-md-6">
                <label class="form-label">Field*</label>
                <select v-model="form.field" class="form-select" required>
                  <option value="">Select field</option>
                  <option
                    v-for="field in formOptionsStore.fields"
                    :key="field"
                    :value="field"
                  >
                    {{ field }}
                  </option>
                </select>
                <div class="invalid-feedback">Please select a field.</div>
              </div>

              <!-- Location -->
              <div class="col-md-6">
                <label class="form-label">Location*</label>
                <select v-model="form.location" class="form-select" required>
                  <option value="">Select location</option>
                  <option
                    v-for="location in formOptionsStore.locations"
                    :key="location"
                    :value="location"
                  >
                    {{ location }}
                  </option>
                </select>
                <div class="invalid-feedback">Please select a location.</div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Monthly Salary*</label>
                <div class="input-group">
                  <span class="input-group-text">₦</span>
                  <input
                    v-model="form.salary"
                    type="text"
                    class="form-control"
                    placeholder="e.g., 250,000"
                    required
                  />
                </div>
                <div class="invalid-feedback">
                  Please provide a salary amount.
                </div>
              </div>

              <!-- Education Level -->
              <div class="col-12">
                <label class="form-label">Required Education Level*</label>
                <select
                  v-model="form.educationLevel"
                  class="form-select"
                  required
                >
                  <option value="">Select education level</option>
                  <option
                    v-for="level in formOptionsStore.educationLevels"
                    :key="level"
                    :value="level"
                  >
                    {{ level }}
                  </option>
                </select>
                <div class="invalid-feedback">
                  Please select required education level.
                </div>
              </div>

              <!-- Job Description -->
              <div class="col-12">
                <label class="form-label">Job Description*</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="4"
                  required
                ></textarea>
                <div class="invalid-feedback">
                  Please provide a job description.
                </div>
              </div>

              <!-- Requirements -->
              <div class="col-12">
                <label class="form-label">Requirements*</label>
                <div
                  v-for="(req, index) in form.requirements"
                  :key="index"
                  class="mb-2"
                >
                  <div class="input-group">
                    <input
                      v-model="form.requirements[index]"
                      type="text"
                      class="form-control"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="removeRequirement(index)"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-primary btn-sm mt-2"
                  @click="addRequirement"
                >
                  <i class="fas fa-plus me-1"></i>
                  Add Requirement
                </button>
              </div>

              <!-- Add this after the Education Level field -->
              <div class="col-12">
                <div class="form-check">
                  <input
                    v-model="form.featured"
                    type="checkbox"
                    class="form-check-input"
                    id="featuredJob"
                  />
                  <label class="form-check-label" for="featuredJob">
                    Feature this job posting
                    <span class="badge bg-warning text-dark ms-2">Premium</span>
                  </label>
                  <div class="text-muted small mt-1">
                    Featured jobs appear prominently on the homepage and receive
                    higher visibility
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer mt-4">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
                :disabled="isSubmitting"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">
                  <i class="fas fa-spinner fa-spin me-2"></i>
                  Posting...
                </span>
                <span v-else>Post Job</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal as bootstrap } from "bootstrap";
import { useFormOptionsStore } from "@/stores/formOptions";

export default {
  name: "PostJobModal",

  data() {
    return {
      isSubmitting: false,
      modal: null,
      formOptionsStore: null,
      form: {
        title: "",
        type: "",
        field: "",
        location: "",
        salary: "",
        educationLevel: "",
        description: "",
        requirements: [""],
        featured: false,
      },
    };
  },

  created() {
    this.formOptionsStore = useFormOptionsStore();
  },

  methods: {
    addRequirement() {
      this.form.requirements.push("");
    },

    removeRequirement(index) {
      this.form.requirements.splice(index, 1);
    },

    async handleSubmit() {
      if (!this.validateForm()) return;
      if (this.isSubmitting) return;

      this.isSubmitting = true;
      try {
        const jobData = {
          ...this.form,
          salary: `₦${this.form.salary}`,
          requirements: this.form.requirements.filter(
            (req) => req.trim() !== ""
          ),
        };

        await this.$emit("submit", jobData);
        this.resetForm();
        this.closeModal();
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        this.isSubmitting = false;
      }
    },

    validateForm() {
      const form = document.querySelector(".needs-validation");
      form.classList.add("was-validated");
      return form.checkValidity();
    },

    resetForm() {
      this.form = {
        title: "",
        type: "",
        field: "",
        location: "",
        salary: "",
        educationLevel: "",
        description: "",
        requirements: [""],
        featured: false,
      };
      document
        .querySelector(".needs-validation")
        .classList.remove("was-validated");
    },

    closeModal() {
      if (this.isSubmitting) return;

      if (this.modal) {
        this.modal.hide();
        // Wait for modal hide animation
        setTimeout(() => {
          this.cleanupModal();
          this.$emit("close");
        }, 300);
      }
    },

    cleanupModal() {
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
    },
  },

  mounted() {
    // Initialize Bootstrap modal
    this.modal = new bootstrap(this.$refs.modal);
    this.modal.show();
  },

  beforeDestroy() {
    if (this.modal) {
      this.modal.dispose();
    }
    this.cleanupModal();
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 700px;
}

.form-label {
  font-weight: 500;
}

textarea {
  resize: vertical;
}

.invalid-feedback {
  font-size: 0.875em;
}

.btn-outline-danger {
  padding: 0.375rem 0.75rem;
}

.input-group > .btn-outline-danger {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
