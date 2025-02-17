import { defineStore } from "pinia";
import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useEmployerStore = defineStore("employer", {
  state: () => ({
    jobs: [],
  }),

  actions: {
    async getJobs() {
      try {
        const response = await api.get("/employer/jobs");
        if (response?.data?.data) {
          this.jobs = response.data.data;
          return { data: this.jobs };
        }
        return { data: [] };
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
    },
  },
});
