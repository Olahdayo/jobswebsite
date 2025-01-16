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
            <router-link
              class="nav-link"
              to="/joblistings"
              @click="closeNavbar"
            >
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
            <router-link
              class="nav-link"
              to="/jobs/category"
              @click="closeNavbar"
            >
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
          <template v-if="!isAuthenticated">
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
                class="btn btn-light dropdown-toggle d-flex align-items-center"
                type="button"
                @click="toggleDropdown"
                ref="dropdownButton"
              >
                <div class="user-avatar me-2">{{ userInitials }}</div>
                <span>{{ userName }}</span>
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                :class="{ show: isDropdownOpen }"
              >
                <li>
                  <router-link
                    class="dropdown-item"
                    :to="dashboardRoute"
                    @click="closeDropdown"
                  >
                    <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="dropdown-item"
                    to="/profile"
                    @click="closeDropdown"
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

export default {
  name: "Navbar",

  data() {
    return {
      isScrolled: false,
      navbarCollapse: null,
      authStore: null,
      isDropdownOpen: false,
    };
  },

  computed: {
    isAuthenticated() {
      return this.authStore?.isAuthenticated || false;
    },

    userType() {
      return this.authStore?.userType;
    },

    dashboardRoute() {
      return this.userType === "employer"
        ? "/dashboard/employer"
        : "/dashboard/jobseeker";
    },

    userName() {
      const user = this.authStore?.user;
      return user ? `${user.first_name} ${user.last_name}` : "";
    },

    userInitials() {
      const user = this.authStore?.user;
      return user
        ? `${user.first_name?.charAt(0) || ""}${
            user.last_name?.charAt(0) || ""
          }`.toUpperCase()
        : "";
    },
  },

  created() {
    this.authStore = useAuthStore();
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
        if (!isClickInside && !this.navbarCollapse._isTransitioning) {
          this.closeNavbar();
        }
      });
    }

    // Handle dropdown clicks outside
    document.addEventListener("click", (event) => {
      if (this.$refs.dropdownButton && !this.$refs.dropdownButton.contains(event.target)) {
        this.closeDropdown();
      }
    });
  },

  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("click", this.handleClickOutside);
  },

  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },

    toggleNavbar() {
      if (this.navbarCollapse) {
        this.navbarCollapse.toggle();
      }
    },

    closeNavbar() {
      if (this.navbarCollapse && !this.navbarCollapse._isTransitioning) {
        this.navbarCollapse.hide();
      }
    },

    async handleLogoutAndClose() {
      this.closeDropdown();
      await this.handleLogout();
    },

    async handleLogout() {
      try {
        await this.authStore.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },

    closeDropdown() {
      this.isDropdownOpen = false;
    }
  },

  watch: {
    $route() {
      this.closeNavbar();
    }
  }
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

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}
</style>
