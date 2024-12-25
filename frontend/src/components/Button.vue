<template>
  <router-link v-if="to" :to="to" class="btn" :class="buttonType" :size="size">
    {{ label }}
  </router-link>
  <button v-else :class="buttonType" :size="size" @click="handleClick($event)">
    {{ label }}
  </button>
</template>

<script>
export default {
  name: "Button",
  props: {
    to: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    buttonType: {
      type: String,
      default: "btn-primary",
    },
    size: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleClick(event) {
      event.stopPropagation();
    },
  },
};
</script>

<style scoped>

</style> 