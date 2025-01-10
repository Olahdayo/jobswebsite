import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import JobDetails from "@/views/JobDetails.vue";
import EmployerDashboard from "@/views/EmployerDashboard.vue";
import JobSeekerDashboard from "@/views/JobSeekerDashboard.vue";
import PostJob from '../views/PostJob.vue'
import Support from '../views/Support.vue'
import { useAuthStore } from "@/stores/auth";

const publicPages = [
  "/login",
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
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: { public: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: { public: true }
    },
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
      meta: { public: true }
    },
    {
      path: "/Joblistings",
      name: "Joblistings",
      component: () => import("@/views/JobListings.vue"),
      meta: { public: true }
    },
    {
      path: "/jobs/:id",
      name: "JobDetails",
      component: JobDetails,
      props: true,
      meta: { public: true }
    },
    {
      path: "/jobs/state/:state",
      name: "JobsByState",
      component: () => import("@/views/JobsByState.vue"),
      meta: { public: true }
    },
    {
      path: "/jobs/category/:category?",
      name: "JobsByCategory",
      component: () => import("@/views/JobsByCategory.vue"),
      meta: { public: true }
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
      component: Support,
      meta: { public: true }
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
  const isPublicRoute = to.matched.some((record) => record.meta.public);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  // Allow access to public routes or guest-only routes for unauthenticated users
  if (isPublicRoute || (requiresGuest && !isAuthenticated)) {
    return next();
  }

  // Redirect to login if the route is not public and the user is not authenticated
  if (!isPublicRoute && !isAuthenticated) {
    return next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  }

  // Redirect to appropriate dashboard if the user is authenticated but tries to access a guest-only route
  if (requiresGuest && isAuthenticated) {
    return next({
      name:
        userType === "employer" ? "EmployerDashboard" : "JobSeekerDashboard",
    });
  }

  // Redirect to appropriate dashboard if the user is authenticated but tries to access a route requiring a different user type
  if (
    to.meta.requiresAuth &&
    to.meta.userType &&
    to.meta.userType !== userType
  ) {
    return next({
      name:
        userType === "employer" ? "EmployerDashboard" : "JobSeekerDashboard",
    });
  }

  // Set page title
  document.title = to.meta.title ? `${to.meta.title} - JobPortal` : "JobPortal";

  // Allow navigation
  next();
});

export default router;
