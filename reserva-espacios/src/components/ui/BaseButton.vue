<script setup>
defineProps({
  type: {
    type: String,
    default: "button"
  },
  variant: {
    type: String,
    default: "primary"
  }
});
</script>

<template>
  <button class="btn" :class="`btn-${variant}`" :type="type">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  width: 100%;
  margin-top: 10px;
  padding: 12px 16px;
  border: none;
  color: white;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  background: #ff2e63;
}

.btn-secondary {
  background: #2c2c2c;
}
</style>
