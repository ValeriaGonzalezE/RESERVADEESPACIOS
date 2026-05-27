<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const reserva = ref(null);
const horariosOcupados = ref([]);
const reservaForm = ref({
  fecha: "",
  horaInicio: "",
  horaFin: ""
});

const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const value = new Date(fecha);
  return Number.isNaN(value.getTime()) ? "-" : value.toLocaleDateString("es-CO");
};

onMounted(async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const res = await api.get(`/reservas/mis-reservas/${user.id}`);
  const encontrada = res.data.find((item) => item.id == id);

  if (!encontrada) {
    alert("Reserva no encontrada");
    router.back();
    return;
  }

  reserva.value = encontrada;
  reservaForm.value = {
    fecha: encontrada.fecha?.split("T")[0] || "",
    horaInicio: encontrada.hora_inicio || "",
    horaFin: encontrada.hora_fin || ""
  };

  await cargarHorariosOcupados();
});

const cargarHorariosOcupados = async () => {
  if (!reserva.value?.espacio_id || !reservaForm.value.fecha) {
    horariosOcupados.value = [];
    return;
  }

  const res = await api.get("/reservas/por-espacio", {
    params: {
      espacio_id: reserva.value.espacio_id,
      fecha: reservaForm.value.fecha
    }
  });

  horariosOcupados.value = res.data.filter((item) => item.id !== Number(id));
};

const guardar = async () => {
  const { fecha, horaInicio, horaFin } = reservaForm.value;

  if (!fecha || !horaInicio || !horaFin) {
    return alert("Completa todos los campos");
  }

  if (horaInicio >= horaFin) {
    return alert("La hora fin debe ser mayor");
  }

  const res = await api.put(`/reservas/${id}`, {
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin
  });

  if (!res.data.success) {
    return alert(res.data.message || "No se pudo actualizar");
  }

  alert("Reserva reprogramada");
  router.back();
};

const cancelar = async () => {
  if (!confirm("Seguro que quieres cancelar la reserva?")) {
    return;
  }

  await api.put(`/reservas/cancelar/${id}`);
  alert("Reserva cancelada");
  router.back();
};
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <div class="card">
            <h3>Reserva actual</h3>
            <p>{{ formatearFecha(reserva?.fecha) }}</p>
            <p>{{ reserva?.hora_inicio || "-" }} - {{ reserva?.hora_fin || "-" }}</p>
          </div>

          <div class="form">
            <ReservationForm
              v-model="reservaForm"
              :horarios="horariosOcupados"
              @update="cargarHorariosOcupados"
            />

            <BaseButton @click="guardar">
              Guardar cambios
            </BaseButton>

            <p class="cancelar-texto" @click="cancelar">
              Cancelar reserva
            </p>
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
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

.container {
  margin-top: 30px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 98, 0.6);
}

.card {
  background: #232323;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 5px solid #ff2e63;
}

.form {
  display: flex;
  flex-direction: column;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}

.cancelar-texto {
  margin-top: 10px;
  color: #ff2e63;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
}
</style>
