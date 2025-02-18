<template>
  <div class="resume-viewer">
    <iframe v-if="resumeUrl" :src="resumeUrl + '?hideNavbar=true&hideFooter=true'" width="100%" height="600px"></iframe>
    <p v-else>No resume available to display.</p>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      resumeUrl: decodeURIComponent(this.url), // Decode the URL
    };
  },
};
</script>

<style scoped>
.resume-viewer {
  padding: 20px;
}
</style>
