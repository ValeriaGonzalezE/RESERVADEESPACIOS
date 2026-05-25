<template>
  <div class="layout">

    <AppSidebar :open="menuOpen" @close="menuOpen = false" />

    <div class="content">

      <div class="header">
        <button v-if="isMobile" class="menu-btn" @click="menuOpen = !menuOpen">
          ☰
        </button>

        <h2 class="title">{{ $route.meta.title }}</h2>

        <div class="right-space"></div>
      </div>

      <main class="view-shell">
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </router-view>
      </main>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import AppSidebar from "@/layouts/AppSidebar.vue";

const menuOpen = ref(false);
const width = ref(window.innerWidth);

const isMobile = computed(() => width.value < 1024);

const updateWidth = () => {
  width.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWidth);

  if (!isMobile.value) menuOpen.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});
</script>
<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #0f0f0f;
}

.content {
  flex: 1;
  min-width: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  overflow-x: hidden;
}

.view-shell {
  position: relative;
  min-height: calc(100vh - 70px);
}

.view-shell :deep(.ion-page) {
  position: relative;
  inset: auto;
  display: block;
  width: 100%;
  min-height: calc(100vh - 70px);
  contain: initial;
}

.view-shell :deep(ion-content) {
  --offset-top: 0px;
  --offset-bottom: 0px;
  height: auto;
  min-height: calc(100vh - 70px);
}

@media (max-width: 1023px) {
  .content {
    margin-left: 0;
  }
}

/* HEADER NUEVO */
.header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  position: sticky;
  top: 0;
  z-index: 900;

  background: #0f0f0f;
  border-bottom: 2px solid #ff2e63;
  /* línea roja */
  backdrop-filter: blur(10px);
  padding: 0 15px;
}

/* TITULO */
.title {
  color: white;
  font-size: 18px;
  margin: 0;
  text-align: center;
  flex: 1;
}

/* BOTÓN MENU */
.menu-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #ff2e63;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

/* evita choque con back button */
.right-space {
  width: 42px;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 998;
}
</style>
