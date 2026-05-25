<template>
  <ion-page>
    <ion-content>
      <div class="layout">

        <!-- FILTROS -->
        <div class="filters">

          <input type="date" v-model="fecha" />

          <select v-model="tipo">
            <option value="">Todo tipo de espacio</option>
            <option v-for="t in tipos" :key="t.id" :value="t.nombre">
              {{ t.nombre }}
            </option>
          </select>

          <select v-model="pago">
            <option value="">Todo tipo de pago</option>
            <option value="si">De pago 💰</option>
            <option value="no">Gratis 🆓</option>
          </select>

          <div class="actions">
            <button @click="obtenerEspacios">Filtrar</button>
            <button class="clear" @click="limpiarFiltros">Limpiar</button>
          </div>

        </div>

        <!-- FILTROS ACTIVOS -->
        <div v-if="fecha || tipo || pago" class="filtros-activos">
          <span v-if="fecha">📅 {{ fecha }}</span>
          <span v-if="tipo">🏢 {{ tipo }}</span>
          <span v-if="pago">
            {{ pago === 'si' ? '💰 De pago' : '🆓 Gratis' }}
          </span>
        </div>

        <!-- LISTA -->
        <div class="content">

          <SpaceCard v-for="salon in salones" :key="salon.id" :espacio="salon" @verReservas="verDetalle" />

          <!-- SIN RESULTADOS -->
          <div v-if="salones.length === 0" class="no-results">
            No hay espacios disponibles con esos filtros
          </div>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, useIonRouter } from '@ionic/vue'
import { ref, onMounted, onActivated } from "vue";
import { useUserStore } from "@/stores/UserStore";
import api from "@/services/api";

import SpaceCard from "@/components/espacios/SpaceCard.vue";

// ===== ROUTER =====
const ionRouter = useIonRouter();
const userStore = useUserStore();

// ===== FILTROS =====
const tipos = ref([]);
const tipo = ref("");
const pago = ref("");
const fecha = ref(new Date().toISOString().split("T")[0]);

// ===== LISTA =====
const salones = ref([]);

// ===== OBTENER ESPACIOS (FILTRO + GENERAL) =====
// Consulta al backend los espacios disponibles usando los filtros seleccionados.
const obtenerEspacios = async () => {
  try {

    console.log("TIPO ENVIADO:", tipo.value);

    const res = await api.get("/espacios", {
      params: {
        fecha: fecha.value || undefined,
        tipo: tipo.value || null,
        pago: pago.value || null
      }
    });

    salones.value = res.data;

  } catch (err) {
    console.error("Error cargando espacios", err);
  }
};

// ===== CARGAR TIPOS =====
// Carga desde el backend las categorias de espacios para el select de filtros.
const cargarTipos = async () => {
  try {
    const res = await api.get("/espacios/tipos");

    console.log("TIPOS DESDE BACK:", res.data);

    tipos.value = res.data;

  } catch (err) {
    console.error("Error cargando tipos", err);
  }
};

// ===== LIMPIAR FILTROS =====
// Reinicia filtros visuales y vuelve a pedir la lista general de espacios.
const limpiarFiltros = () => {
  fecha.value = null;
  tipo.value = "";
  pago.value = "";

  obtenerEspacios();
};

// ===== CICLO DE VIDA =====
// Al entrar a la vista carga tipos de espacios y resultados iniciales.
onMounted(async () => {
  await cargarTipos();
  await obtenerEspacios();
});

// Si la vista se reactiva, refresca la lista de espacios.
onActivated(() => {
  obtenerEspacios();
});

// ===== NAVEGACIÓN =====
// Abre el detalle del espacio seleccionado.
const verDetalle = (id) => {
  ionRouter.push(`/space/${id}`);
};
</script>

<style scoped>
.layout {
  padding: 20px;
  color: white;
}

/* FILTROS */
.filters {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filters input,
.filters select {
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #1e1e1e;
  color: white;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #ff2e63;
  color: white;
  cursor: pointer;
}

button.clear {
  background: #444;
}

/* FILTROS ACTIVOS */
.filtros-activos {
  display: flex;
  gap: 10px;
  padding: 0 15px;
  font-size: 12px;
  color: #ff2e63;
}

/* CONTENT */
.content {
  padding: 20px;
}

/* NO RESULTS */
.no-results {
  text-align: center;
  margin-top: 20px;
  color: #888;
}

</style>
