import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

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
      component: () => import("@/views/JobDetails.vue"), 
    },
    {
      path: "/jobs/state/:state",
      name: "JobsByState",
      component: () => import("@/views/JobsByState.vue"), // Adjust the path as necessary
    },
    {
      path: "/jobs/category/:category",
      name: "JobsByCategory",
      component: () => import("@/views/JobsByCategory.vue"), // Adjust the path as necessary
    },
  ],
});

export default router
