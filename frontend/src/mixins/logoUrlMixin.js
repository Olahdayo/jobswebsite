export const logoUrlMixin = {
  methods: {
    getLogoUrl(logoUrl) {
      if (!logoUrl) return "/images/dashboard-default.svg";
      if (logoUrl.startsWith("http")) return logoUrl;
      return `http://localhost:8000/storage/${logoUrl}`;
    },

    handleImageError(event) {
      event.target.src = "/images/dashboard-default.svg";
      event.target.removeEventListener("error", this.handleImageError);
    },
  },
};
