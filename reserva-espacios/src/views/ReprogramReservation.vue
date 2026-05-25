<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";

const route = useRoute();
const router = useRouter();

const id = route.params.id;

const reserva = ref(null);

const nuevaFecha = ref("");
const nuevaHoraInicio = ref("");
const nuevaHoraFin = ref("");

// FORMATEO SEGURO
const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const f = new Date(fecha);
  return isNaN(f) ? "-" : f.toLocaleDateString("es-CO");
};

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await api.get(`/reservas/mis-reservas/${user.id}`);

    const encontrada = res.data.find(r => r.id == id);

    if (!encontrada) {
      alert("Reserva no encontrada");
      return router.back();
    }

    reserva.value = encontrada;

    nuevaFecha.value = encontrada.fecha?.split("T")[0] || "";
    nuevaHoraInicio.value = encontrada.hora_inicio || "";
    nuevaHoraFin.value = encontrada.hora_fin || "";

  } catch (err) {
    console.error(err);
  }
});

// VALIDACIÓN + GUARDAR
const guardar = async () => {

  if (!nuevaFecha.value || !nuevaHoraInicio.value || !nuevaHoraFin.value) {
    return alert("Completa todos los campos");
  }

  if (nuevaHoraInicio.value >= nuevaHoraFin.value) {
    return alert("Hora fin debe ser mayor");
  }

  const res = await api.put(`/reservas/${id}`, {
    fecha: nuevaFecha.value,
    hora_inicio: nuevaHoraInicio.value,
    hora_fin: nuevaHoraFin.value
  });

  if (res.data.success) {
    alert("Reserva reprogramada");
    router.back();
  } else {
    alert(res.data.message);
  }
};

// CANCELAR
const cancelar = async () => {
  if (!confirm("¿Seguro que quieres cancelar la reserva?")) return;

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

          <!-- INFO ACTUAL -->
          <div class="card">
            <h3>Reserva actual</h3>

            <p>📅 {{ formatearFecha(reserva?.fecha) }}</p>

            <p>
              ⏰
              {{ reserva?.hora_inicio || "-" }}
              -
              {{ reserva?.hora_fin || "-" }}
            </p>
          </div>

          <!-- FORM -->
          <div class="form">

            <BaseInput label="Nueva fecha" type="date" v-model="nuevaFecha" />
            <BaseInput label="Hora inicio" type="time" v-model="nuevaHoraInicio" />
            <BaseInput label="Hora fin" type="time" v-model="nuevaHoraFin" />

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

/* CARD ACTUAL */
.card {
  background: #232323;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 5px solid #ff2e63;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* BOTÓN CANCELAR */
.cancelar {
  background: #ff2e63;
  border: none;
  padding: 12px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
}

.cancelar:hover {
  background: #ff5f7e;
}

/* BACK */
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

.cancelar-texto:hover {
  text-decoration: underline;
}
</style>