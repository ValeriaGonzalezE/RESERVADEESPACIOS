<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";

import ReservationCard from "@/components/reservations/ReservationCard.vue";
import CalendarStrip from "@/components/reservations/CalendarStrip.vue";

const router = useRouter();
const userStore = useUserStore();

const reservas = ref([]);
const fechaSeleccionada = ref(new Date().toISOString().split("T")[0]);

// Carga todas las reservas asociadas al usuario autenticado.
const cargar = async () => {
  try {
    const res = await api.get(`/reservas/mis-reservas/${userStore.user.id}`);

    console.log("RESERVAS BACK:", res.data);

    reservas.value = res.data;
  } catch (err) {
    console.error("ERROR:", err);
  }
};

// Filtra en frontend las reservas para mostrar solo las del dia seleccionado.
const reservasFiltradas = computed(() => {
  return reservas.value.filter(r => {
    if (!r.fecha) return false;
    return r.fecha.split("T")[0] === fechaSeleccionada.value;
  });
});

// Cancela una reserva, confirma con el usuario y recarga la lista.
const cancelar = async (id) => {
  if (!confirm("¿Cancelar reserva?")) return;

  await api.put(`/reservas/cancelar/${id}`);
  alert("Reserva cancelada");
  cargar();
};

// Redirige a la vista de edicion o reprogramacion de la reserva.
const editar = (reserva) => {
  router.push(`/edit-reservation/${reserva.id}`);
};

// Ejecuta la carga inicial de reservas al montar la vista.
onMounted(cargar);
</script>

<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <div class="container">

          <!-- CALENDARIO -->
          <CalendarStrip :eventos="reservas" v-model="fechaSeleccionada" />
          <br><br>
          <!-- LISTA -->
          <div v-if="reservasFiltradas.length">

            <ReservationCard v-for="r in reservasFiltradas" :key="r.id" :reserva="r" @editar="editar"
              @cancelar="cancelar" />

          </div>

          <div v-else class="no-results">
            No tienes reservas para este día
          </div>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at top, #1a0005, #0f0f0f);
  color: white;
}

/* CONTENEDOR */
.container {
  margin-top: 30px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 99, 0.3);
}

/* NO RESULTADOS */
.no-results {
  text-align: center;
  color: #888;
  margin-top: 20px;
}
</style>
