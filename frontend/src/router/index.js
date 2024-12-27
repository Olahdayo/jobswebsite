import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import JobSeekerSignup from "@/views/JobSeekerSignup.vue";
// import JobListings from "@/views/JobListings.vue";
import JobDetails from "@/views/JobDetails.vue";
import EmployerSignup from "@/views/EmployerSignup.vue";
import EmployerDashboard from "@/views/EmployerDashboard.vue";
import JobSeekerDashboard from "@/views/JobSeekerDashboard.vue";
import { useAuthStore } from "@/stores/auth";

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
      // path: '/create-job',
      // name: 'CreateJob',
      // component: () => import('../views/CreateJob.vue')
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
      // path: '/faq',
      // name: 'FAQ',
      // component: () => import('../views/FAQ.vue')
    },
    {
      // path: '/contact',
      // name: 'Contact',
      // component: () => import('../views/Contact.vue')
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
  ],
});

// Global navigation guard to scroll to the top on route change
router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  const authStore = useAuthStore();
  const publicPages = [
    "/login",
    "/signup",
    "/",
    "/jobs",
    "/featured-jobs",
    "/jobs/:id",
  ];
  const authRequired =
    !publicPages.includes(to.path) && !to.path.match(/^\/jobs\/\d+$/); // Allow job detail pages

  if (authRequired && !authStore.user) {
    return next("/login");
  }

  if (
    to.path === "/employer-dashboard" &&
    authStore.user?.role !== "employer"
  ) {
    return next("/login");
  }

  next();
});

export default router;
