<template>
  <button class="btn">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  margin-top: 20px;
  padding: 10px;
  background: #ff2e63;
  border: none;
  color: white;
  border-radius: 8px;
}
</style>