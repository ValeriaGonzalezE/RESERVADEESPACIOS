<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import TimeBlocks from "@/components/reservations/TimeBlocks.vue";

const userStore = useUserStore();
const route = useRoute();

const espacioSeleccionado = ref(route.query.espacio || "");
const fecha = ref("");
const horaInicio = ref("");
const horaFin = ref("");
const nombreEspacio = ref("");
const horariosOcupados = ref([]);
const usuario = ref({
  nombre: "",
  telefono: "",
  correo: ""
});

// Precarga el nombre del espacio y los datos del usuario autenticado al abrir la vista.
onMounted(async () => {
  const res = await api.get("/espacios");
  const e = res.data.find(x => x.id == espacioSeleccionado.value);
  nombreEspacio.value = e?.nombre;

  usuario.value = {
    nombre: userStore.user.nombre + " " + userStore.user.apellido,
    telefono: userStore.user.telefono,
    correo: userStore.user.email
  };
});

// Cada vez que cambia la fecha consulta los horarios ya ocupados para ese espacio.
watch(fecha, (newVal) => {
  if (newVal) {
    cargarHorariosOcupados();
  }
});

// Trae desde el backend las reservas ya existentes del espacio en esa fecha.
const cargarHorariosOcupados = async () => {
  const res = await api.get("/reservas/por-espacio", {
    params: { espacio_id: espacioSeleccionado.value, fecha: fecha.value }
  });
  horariosOcupados.value = res.data;
};

// Verifica si el nuevo rango horario se cruza con alguna reserva existente.
const hayCruce = () => {
  const inicio = toMinutos(horaInicio.value);
  const fin = toMinutos(horaFin.value);

  return horariosOcupados.value.some(h => {
    const hInicio = toMinutos(h.hora_inicio);
    const hFin = toMinutos(h.hora_fin);

    return inicio < hFin && fin > hInicio;
  });
};

// Valida campos y horario antes de enviar la nueva reserva al backend.
const reservar = async () => {

  if (!fecha.value || !horaInicio.value || !horaFin.value) {
    return alert("Completa todos los campos");
  }

  if (horaInicio.value >= horaFin.value) {
    return alert("Hora fin debe ser mayor que hora inicio");
  }

  if (hayCruce()) {
    return alert("Ese horario ya está ocupado");
  }

  const res = await api.post("/reservas", {
    usuario_id: userStore.user.id,
    espacio_id: espacioSeleccionado.value,
    fecha: fecha.value,
    hora_inicio: horaInicio.value,
    hora_fin: horaFin.value
  });

  if (!res.data.success) return alert(res.data.message);

  alert("Reserva creada");
};

// Convierte una hora en minutos para facilitar la comparacion de rangos.
const toMinutos = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};
</script>

<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <BackButton class="back-floating" />

        <div class="container">

          <h3 v-if="nombreEspacio">Espacio: {{ nombreEspacio }}</h3>

          <!-- INFO USUARIO -->
          <div class="user-info">
            <p><strong>Nombre:</strong> {{ usuario.nombre }}</p><br>
            <p><strong>Celular:</strong> {{ usuario.telefono }}</p><br>
            <p><strong>Correo:</strong> {{ usuario.correo }} </p>
          </div>

          <BaseInput label="Fecha" type="date" v-model="fecha" />

          <TimeBlocks :horarios="horariosOcupados" />

          <BaseInput label="Hora inicio" type="time" v-model="horaInicio" />
          <BaseInput label="Hora fin" type="time" v-model="horaFin" />

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
  color: #e5e3e4f5
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}
</style>
