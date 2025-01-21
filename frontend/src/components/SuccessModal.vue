<template>
  <div 
    class="modal fade" 
    ref="modal" 
    tabindex="-1" 
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <button
            type="button"
            class="btn-close"
            @click="closeModal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-center pb-5">
          <div class="success-icon mb-4">
            <i class="fas fa-check-circle text-success"></i>
          </div>
          <h4 class="modal-title mb-3">Success!</h4>
          <p class="text-muted mb-4">{{ message }}</p>
          <button 
            @click="closeModal" 
            class="btn btn-primary px-4"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from 'bootstrap';

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
      modalInstance: null,
      modalElement: null
    };
  },

  methods: {
    closeModal() {
      try {
        // Attempt to hide the modal
        if (this.modalInstance) {
          this.modalInstance.hide();
        } else if (this.modalElement) {
          // Fallback method if modal instance is not available
          const modalInstance = bootstrap.Modal.getInstance(this.modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        }

        // Emit close event after a short delay
        setTimeout(() => {
          this.$emit('close');
        }, 300);
      } catch (error) {
        console.error('Error closing modal:', error);
        // Fallback emit close event
        this.$emit('close');
      }
    },

    initModal() {
      try {
        // Store the modal element reference
        this.modalElement = this.$refs.modal;

        // Create modal instance
        this.modalInstance = new bootstrap.Modal(this.modalElement, {
          backdrop: 'static',
          keyboard: false
        });

        // Show the modal
        this.modalInstance.show();
      } catch (error) {
        console.error('Error initializing modal:', error);
        
        // Alternative method to show modal
        try {
          const modalElement = this.$refs.modal;
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
          document.body.classList.add('modal-open');
          
          const backdrop = document.createElement('div');
          backdrop.classList.add('modal-backdrop', 'fade', 'show');
          document.body.appendChild(backdrop);
        } catch (fallbackError) {
          console.error('Fallback modal display failed:', fallbackError);
        }

        // Fallback to emit close event if modal fails
        this.$emit('close');
      }
    }
  },

  mounted() {
    // Use nextTick to ensure DOM is updated
    this.$nextTick(() => {
      this.initModal();
    });
  },

  beforeUnmount() {
    try {
      // Dispose of the modal instance
      if (this.modalInstance) {
        this.modalInstance.dispose();
      }

      // Remove any lingering modal-related classes or elements
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    } catch (error) {
      console.error('Error disposing modal:', error);
    }
  }
}
</script>

<style scoped>
.success-icon {
  font-size: 4rem;
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
