<template>
  <div class="modal fade" ref="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0">
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center pb-5">
          <div class="success-icon mb-4">
            <i class="fas fa-check-circle"></i>
          </div>
          <h4 class="modal-title mb-3">Success!</h4>
          <p class="text-muted mb-4">{{ message }}</p>
          <button @click="closeModal" class="btn btn-primary px-4">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal as bootstrap } from "bootstrap";

export default {
  name: "SuccessModal",

  props: {
    message: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      modal: null,
    };
  },

  methods: {
    closeModal() {
      if (this.modal) {
        this.modal.hide();
        setTimeout(() => {
          this.cleanupModal();
          this.$emit("close");
        }, 300);
      }
    },

    cleanupModal() {
      // Remove all modal-related elements and classes
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
      
      // Remove all modal-related classes from body
      document.body.classList.remove('modal-open');
      document.body.classList.remove('overflow-hidden');
      
      // Remove any inline styles added by Bootstrap
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      
      // Ensure all modal-related classes are removed
      const modalElements = document.querySelectorAll('.modal, .modal-backdrop');
      modalElements.forEach(el => el.remove());
    },
  },

  mounted() {
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
.success-icon {
  font-size: 4rem;
  color: #198754;
}

.modal-dialog {
  max-width: 400px;
}

.modal-content {
  border-radius: 1rem;
}

.modal-title {
  color: #2c3e50;
}
</style>
