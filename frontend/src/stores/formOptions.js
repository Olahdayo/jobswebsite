import { defineStore } from "pinia";
import filterOptions from "@/data/filterOptions.json";

export const useFormOptionsStore = defineStore("formOptions", {
  state: () => ({
    jobTypes: filterOptions.jobTypes,
    fields: filterOptions.fields,
    locations: filterOptions.locations,
    educationLevels: filterOptions.educationLevels,
  }),

  actions: {
    getJobTypes() {
      return this.jobTypes;
    },

    getFields() {
      return this.fields;
    },

    getLocations() {
      return this.locations;
    },

    getEducationLevels() {
      return this.educationLevels;
    },
  },
});
