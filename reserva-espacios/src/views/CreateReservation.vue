<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const espacioSeleccionado = ref(route.query.espacio || "");
const nombreEspacio = ref("");
const horariosOcupados = ref([]);
const usuario = ref({
  nombre: "",
  telefono: "",
  correo: ""
});

const reservaForm = ref({
  fecha: "",
  horaInicio: "",
  horaFin: ""
});

onMounted(async () => {
  const res = await api.get("/espacios");
  const espacio = res.data.find((item) => item.id == espacioSeleccionado.value);

  nombreEspacio.value = espacio?.nombre || "";
  usuario.value = {
    nombre: `${userStore.user.nombre} ${userStore.user.apellido || ""}`.trim(),
    telefono: userStore.user.telefono,
    correo: userStore.user.email
  };
});

watch(
  () => reservaForm.value.fecha,
  (fecha) => {
    if (fecha) {
      cargarHorariosOcupados();
    } else {
      horariosOcupados.value = [];
    }
  }
);

const cargarHorariosOcupados = async () => {
  const res = await api.get("/reservas/por-espacio", {
    params: {
      espacio_id: espacioSeleccionado.value,
      fecha: reservaForm.value.fecha
    }
  });

  horariosOcupados.value = res.data;
};

const toMinutos = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

const hayCruce = () => {
  const inicio = toMinutos(reservaForm.value.horaInicio);
  const fin = toMinutos(reservaForm.value.horaFin);

  return horariosOcupados.value.some((horario) => {
    const inicioOcupado = toMinutos(horario.hora_inicio);
    const finOcupado = toMinutos(horario.hora_fin);
    return inicio < finOcupado && fin > inicioOcupado;
  });
};

const reservar = async () => {
  const { fecha, horaInicio, horaFin } = reservaForm.value;

  if (!fecha || !horaInicio || !horaFin) {
    return alert("Completa todos los campos");
  }

  if (horaInicio >= horaFin) {
    return alert("La hora fin debe ser mayor que la hora inicio");
  }

  if (hayCruce()) {
    return alert("Ese horario ya esta ocupado");
  }

  const res = await api.post("/reservas", {
    espacio_id: espacioSeleccionado.value,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin
  });

  if (!res.data.success) {
    return alert(res.data.message || "No se pudo crear la reserva");
  }

  alert("Reserva creada");
  router.back();
};
</script>

<template>
  <ion-page>
    <ion-content>
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <h3 v-if="nombreEspacio">Espacio: {{ nombreEspacio }}</h3>

          <div class="user-info">
            <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
            <p><strong>Celular:</strong> {{ usuario.telefono }}</p>
            <p><strong>Correo:</strong> {{ usuario.correo }}</p>
          </div>

          <ReservationForm
            v-model="reservaForm"
            :horarios="horariosOcupados"
          />

          <BaseButton @click="reservar">Reservar</BaseButton>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style>
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

.user-info {
  background: #2323233d;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #e5e3e4f5;
  display: grid;
  gap: 8px;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}
</style>
