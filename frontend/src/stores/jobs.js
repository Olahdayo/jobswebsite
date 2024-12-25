import { defineStore } from 'pinia'
import jobsData from '@/data/jobs.json'
import filterOptions from '@/data/filterOptions.json'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: [],
    filteredJobs: [],
    filterOptions: filterOptions,
    searchFilters: {
      query: '',
      location: '',
      field: '',
      education: '',
      jobType: ''
    }
  }),

  actions: {
    initializeJobs() {
      this.jobs = jobsData.jobs
      this.filteredJobs = [...this.jobs]
    },

    filterJobs() {
      this.filteredJobs = this.jobs.filter(job => {
        const matchQuery = !this.searchFilters.query || 
          job.title.toLowerCase().includes(this.searchFilters.query.toLowerCase()) ||
          job.company.toLowerCase().includes(this.searchFilters.query.toLowerCase())
        
        const matchLocation = !this.searchFilters.location ||
          job.location === this.searchFilters.location
        
        const matchField = !this.searchFilters.field ||
          job.field === this.searchFilters.field
        
        const matchType = !this.searchFilters.jobType ||
          job.type === this.searchFilters.jobType
        
        const matchEducation = !this.searchFilters.education ||
          job.educationLevel === this.searchFilters.education
        
        return matchQuery && matchLocation && matchField && matchType && matchEducation
      })
    },

    getFeaturedJobs() {
      return this.jobs
        .filter(job => job.featured)
        .slice(0, 6)
    },

    getAllFeaturedJobs() {
      return this.jobs.filter(job => job.featured)
    },

    getLatestJobs() {
      return [...this.jobs]
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
    }
  }
}) 