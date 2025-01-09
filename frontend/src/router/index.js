import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
// import JobSeekerSignup from "@/views/JobSeekerSignup.vue";
import JobDetails from "@/views/JobDetails.vue";
// import EmployerSignup from "@/views/EmployerSignup.vue";
import EmployerDashboard from "@/views/EmployerDashboard.vue";
import JobSeekerDashboard from "@/views/JobSeekerDashboard.vue";
import PostJob from '../views/PostJob.vue'
import Support from '../views/Support.vue'
import { useAuthStore } from "@/stores/auth";

const publicPages = [
  "/login",
  "/signup",
  "/signup/jobseeker",
  "/signup/employer",
  "/",
  "/jobs",
  "/featured-jobs",
  "/jobs/:id",
  "/Joblistings",
  "/jobs/state/:state",
  "/jobs/category/:category"
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        requiresGuest: true,
        title: 'Login'
      }
    },
    // {
    //   path: "/signup",
    //   name: "Signup",
    //   component: () => import("../views/signup.vue"),
    //   meta: {
    //     requiresGuest: true,
    //     title: 'Sign Up'
    //   }
    // },
    // {
    //   path: "/signup/jobseeker",
    //   name: "JobseekerSignup",
    //   component: JobSeekerSignup,
    //   meta: {
    //     requiresGuest: true,
    //     title: 'Job Seeker Sign Up'
    //   }
    // },
    // {
    //   path: "/signup/employer",
    //   name: "EmployerSignup",
    //   component: EmployerSignup,
    //   meta: {
    //     requiresGuest: true,
    //     title: 'Employer Sign Up'
    //   }
    // },
    {
      path: "/dashboard/employer",
      name: "EmployerDashboard",
      component: EmployerDashboard,
      meta: {
        requiresAuth: true,
        userType: 'employer',
        title: 'Employer Dashboard'
      }
    },
    {
      path: "/dashboard/jobseeker",
      name: "JobSeekerDashboard",
      component: JobSeekerDashboard,
      meta: {
        requiresAuth: true,
        userType: 'job_seeker',
        title: 'Job Seeker Dashboard'
      }
    },
    {
      path: "/featured-jobs",
      name: "FeaturedJobs",
      component: () => import("../views/FeaturedJobs.vue"),
    },
    {
      path: "/Joblistings",
      name: "Joblistings",
      component: () => import("@/views/JobListings.vue"),
    },
    {
      path: "/jobs/:id",
      name: "JobDetails",
      component: JobDetails,
      props: true,
    },
    {
      path: "/jobs/state/:state",
      name: "JobsByState",
      component: () => import("@/views/JobsByState.vue"),
    },
    {
      path: "/jobs/category/:category?",
      name: "JobsByCategory",
      component: () => import("@/views/JobsByCategory.vue"),
    },
    {
      path: '/post-job',
      name: 'PostJob',
      component: PostJob,
      meta: {
        requiresAuth: true,
        userType: 'employer',
        title: 'Post a Job'
      }
    },
    {
      path: '/support',
      name: 'Support',
      component: Support
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/Register.vue'),
      meta: {
        requiresGuest: true,
        title: 'Create Account'
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const userType = authStore.userType;

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      return next({ name: 'Login' });
    }

    // Check if route requires specific user type
    if (to.meta.userType && to.meta.userType !== userType) {
      // Wrong user type, redirect to appropriate dashboard
      return next({ name: userType === 'employer' ? 'EmployerDashboard' : 'JobSeekerDashboard' });
    }
  }

  // Check if route requires guest access
  if (to.meta.requiresGuest && isAuthenticated) {
    // Already authenticated, redirect to appropriate dashboard
    return next({ name: userType === 'employer' ? 'EmployerDashboard' : 'JobSeekerDashboard' });
  }

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - JobPortal` : 'JobPortal';
  
  next();
});

export default router;
