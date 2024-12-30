import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import JobSeekerSignup from "@/views/JobSeekerSignup.vue";
// import JobListings from "@/views/JobListings.vue";
import JobDetails from "@/views/JobDetails.vue";
import EmployerSignup from "@/views/EmployerSignup.vue";
import EmployerDashboard from "@/views/EmployerDashboard.vue";
import JobSeekerDashboard from "@/views/JobSeekerDashboard.vue";
import PostJob from '../views/PostJob.vue'
import Support from '../views/Support.vue'
import Categories from '../views/Categories.vue'
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
      path: "/jobs",
      name: "Jobs",
      component: () => import("../views/JobListings.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/signup.vue"),
    },
    {
      path: "/signup/jobseeker",
      name: "JobseekerSignup",
      component: JobSeekerSignup,
    },
    {
      path: "/signup/employer",
      name: "EmployerSignup",
      component: EmployerSignup,
    },
    {
      path: "/dashboard/employer",
      name: "EmployerDashboard",
      component: EmployerDashboard,
    },
    {
      path: "/dashboard/jobseeker",
      name: "JobSeekerDashboard",
      component: JobSeekerDashboard,
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
      path: "/jobs/category/:category",
      name: "JobsByCategory",
      component: () => import("@/views/JobsByCategory.vue"),
    },
    {
      path: '/post-job',
      name: 'PostJob',
      component: PostJob
    },
    {
      path: '/support',
      name: 'Support',
      component: Support
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
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
  const privatePages = ['/dashboard/employer', '/dashboard/jobseeker'];
  const authRequired = privatePages.includes(to.path);

  if (authRequired && !authStore.user) {
    return next('/login');
  }

  next();
});

export default router;
