<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general de la vista. -->
      <div class="page">
        <div class="container">
          <!-- Estado de carga inicial. -->
          <div v-if="loading" class="loading">Cargando espacios...</div>

          <!-- Estado vacio cuando el usuario aun no tiene espacios. -->
          <div v-else-if="espacios.length === 0" class="empty">No tienes espacios registrados</div>

          <!-- Grilla principal de espacios del usuario. -->
          <div v-else class="grid">
            <SpaceCard
              v-for="espacio in espacios"
              :key="espacio.id"
              :espacio="espacio"
              :mostrarEditar="true"
              @editar="editarEspacio"
              @verReservas="verReservas"
            />
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones principales para listar espacios del usuario.
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";
import SpaceCard from "@/components/espacios/SpaceCard.vue";

// Router y store del usuario autenticado.
const router = useRouter();
const userStore = useUserStore();

// Estado principal de la pantalla.
const espacios = ref([]);
const loading = ref(true);

// Trae del backend los espacios creados por el usuario actual.
const cargarEspacios = async () => {
  try {
    if (!userStore.user?.id) return;

    const res = await api.get(`/espacios/mis-espacios/${userStore.user.id}`);
    espacios.value = res.data;
  } catch (err) {
    console.error("ERROR MIS ESPACIOS:", err);
  } finally {
    loading.value = false;
  }
};

// Navega a la pantalla de edicion del espacio.
const editarEspacio = (id) => {
  router.push(`/space-edit/${id}`);
};

// Navega a la vista que muestra las reservas del espacio.
const verReservas = (id) => {
  router.push(`/space-reservations/${id}`);
};

// Ejecuta la carga inicial al abrir la vista.
onMounted(async () => {
  await cargarEspacios();
});
</script>

<style scoped>
/* Fondo general de la pantalla. */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
  padding: 20px;
}

/* Espaciado interno del contenido. */
.container {
  padding: 20px;
  padding-top: 20px;
}

/* Grilla principal de tarjetas. */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

/* Estados vacio y cargando. */
.loading,
.empty {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
}
</style>
