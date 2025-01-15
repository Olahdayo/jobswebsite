<template>
  <div class="app-wrapper">
    <Navbar />
    <router-view></router-view>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

router-view {
  flex: 1;
}

/* Prevent scroll when nav is open */
body.nav-open {
  overflow: hidden;
}

/* Add backdrop when nav is open */
@media (max-width: 991px) {
  body.nav-open::after {
    content: "";
    position: fixed;
    top: 56px; /* Match navbar height */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1029;
  }
}
</style>
