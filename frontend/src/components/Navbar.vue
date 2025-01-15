<template>
  <nav
    class="navbar navbar-expand-lg sticky-top"
    :class="{ 'navbar-scrolled': isScrolled }"
  >
    <div class="container">
      <router-link class="navbar-brand" to="/">
        <span class="brand-icon"><i class="bi bi-briefcase-fill"></i></span>
        <span class="brand-text">Pinify</span>
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNavbar"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-bars"></i>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/joblistings" @click="closeNavbar">
              <i class="fas fa-search me-1"></i>Find Jobs
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              to="/featured-jobs"
              @click="closeNavbar"
            >
              <i class="fas fa-star me-1"></i>Featured
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/jobs/category" @click="closeNavbar">
              <i class="fas fa-th-large me-1"></i>Categories
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/post-job">
              <i class="bi bi-plus-circle me-1"></i>Post a Job
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/support">
              <i class="bi bi-headset me-1"></i>Support
            </router-link>
          </li>
        </ul>

        <div class="nav-buttons d-flex align-items-center gap-2">
          <template v-if="!authStore?.user">
            <router-link
              to="/login"
              class="btn btn-outline-primary"
              @click="closeNavbar"
            >
              <i class="fas fa-sign-in-alt me-1"></i>Login
            </router-link>
            <router-link
              to="/register"
              class="btn btn-primary"
              @click="closeNavbar"
            >
              <i class="fas fa-user-plus me-1"></i>Sign Up
            </router-link>
          </template>
          <template v-else>
            <div class="dropdown">
              <button
                class="btn btn-light dropdown-toggle"
                type="button"
                id="userDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="fas fa-user-circle me-1"></i>
                {{ authStore.user.name }}
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="userDropdown"
              >
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="
                      authStore.user.type === 'employer'
                        ? '/dashboard/employer'
                        : '/dashboard/jobseeker'
                    "
                    @click="closeNavbar"
                  >
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/profile"
                    @click="closeNavbar"
                  >
                    <i class="fas fa-user-cog me-2"></i>Profile
                  </router-link>
                </li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <a
                    class="dropdown-item text-danger"
                    href="#"
                    @click.prevent="handleLogoutAndClose"
                  >
                    <i class="fas fa-sign-out-alt me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { Collapse } from "bootstrap";

export default {
  name: "Navbar",

  data() {
    return {
      isScrolled: false,
      navbarCollapse: null,
    };
  },

  created() {
    this.authStore = useAuthStore();
    this.router = useRouter();
  },

  mounted() {
    window.addEventListener("scroll", this.handleScroll);

    // Initialize Bootstrap collapse
    const navbarToggler = this.$el.querySelector(".navbar-toggler");
    const navbarContent = this.$el.querySelector("#navbarContent");

    if (navbarToggler && navbarContent) {
      this.navbarCollapse = new Collapse(navbarContent, {
        toggle: false,
      });

      // Close navbar when clicking outside
      document.addEventListener("click", (event) => {
        const isClickInside =
          navbarToggler.contains(event.target) ||
          navbarContent.contains(event.target);

        if (!isClickInside && navbarContent.classList.contains("show")) {
          this.navbarCollapse.hide();
        }
      });

      // Close navbar when clicking on a nav link
      const navLinks = navbarContent.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth < 992) {
            // Only on mobile
            this.navbarCollapse.hide();
          }
        });
      });
    }
  },

  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
    // Clean up event listeners
    const navbarContent = this.$el.querySelector("#navbarContent");
    if (navbarContent) {
      const navLinks = navbarContent.querySelectorAll(".nav-link");
      navLinks.forEach((link) => {
        link.removeEventListener("click", () => {});
      });
    }
    document.removeEventListener("click", () => {});
  },

  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },

    toggleNavbar() {
      if (this.navbarCollapse) {
        this.navbarCollapse.toggle();
      }
    },

    closeNavbar() {
      if (window.innerWidth < 992 && this.navbarCollapse) {
        // Only on mobile
        this.navbarCollapse.hide();
      }
    },

    handleLogoutAndClose() {
      this.closeNavbar();
      this.handleLogout();
    },

    handleLogout() {
      this.authStore.logout();
      this.router.push("/login");
    },
  },
};
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  z-index: 2000;
}

.navbar-scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: #2563eb;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  font-size: 1.2rem;
}

.brand-text {
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.navbar-toggler {
  border: none;
  padding: 0.5rem;
  color: #2563eb;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.nav-link {
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #2563eb;
}

.nav-buttons {
  margin-left: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-outline-primary {
  color: #2563eb;
  border-color: #2563eb;
}

.btn-outline-primary:hover {
  background: #2563eb;
  color: white;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  padding: 0.5rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #4b5563;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #2563eb;
}

.dropdown-item.text-danger:hover {
  background: #fee2e2;
  color: #dc2626;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .nav-buttons {
    margin: 1rem 0 0 0;
    justify-content: center;
  }

  .navbar-nav {
    text-align: center;
  }

  .nav-link {
    padding: 0.75rem;
  }
}
</style>
