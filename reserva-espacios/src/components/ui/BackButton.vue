<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="back-btn" @click="router.back()">
    <img src="https://cdn-icons-png.flaticon.com/128/318/318276.png" />
  </div>
</template>

<style scoped>
.back-btn {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.back-btn img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: 0.2s;
  filter: brightness(0) invert(1);
}

.back-btn img:hover {
  transform: scale(1.1);
}
</style>