<template>
  <ion-page>
    <ion-content>
      <!-- Fondo principal y boton de regreso. -->
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <!-- Nombre del espacio seleccionado. -->
          <h3 v-if="nombreEspacio">Espacio: {{ nombreEspacio }}</h3>

          <!-- Resumen de quien esta creando la reserva. -->
          <div class="user-info">
            <p><strong>Nombre:</strong> {{ usuario.nombre }}</p>
            <p><strong>Celular:</strong> {{ usuario.telefono }}</p>
            <p><strong>Correo:</strong> {{ usuario.correo }}</p>
          </div>

          <!-- Formulario de reserva encapsulado. -->
          <ReservationForm
            v-model="reservaForm"
            :horarios="horariosOcupados"
            :errors="errors"
          />

          <!-- Accion principal de confirmacion. -->
          <BaseButton @click="reservar">Reservar</BaseButton>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones necesarias para reservar un espacio.
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import api from "@/services/api";
import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";

// Store, router y route para leer usuario y espacio actual.
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// Estado de cabecera y disponibilidad del espacio.
const espacioSeleccionado = ref(route.query.espacio || "");
const nombreEspacio = ref("");
const horariosOcupados = ref([]);

// Datos informativos del usuario autenticado.
const usuario = ref({
  nombre: "",
  telefono: "",
  correo: ""
});

// Formulario base de reserva.
const reservaForm = ref({
  fecha: "",
  horaInicio: "",
  horaFin: ""
});

// Errores del formulario para validacion visual.
const errors = reactive({
  fecha: "",
  horaInicio: "",
  horaFin: ""
});

// Carga el espacio y precarga los datos del usuario.
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

// Cada vez que cambia la fecha se consultan horarios ocupados.
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

// Consulta al backend las reservas del dia para ese espacio.
const cargarHorariosOcupados = async () => {
  const res = await api.get("/reservas/por-espacio", {
    params: {
      espacio_id: espacioSeleccionado.value,
      fecha: reservaForm.value.fecha
    }
  });

  horariosOcupados.value = res.data;
};

// Convierte una hora tipo HH:mm en minutos.
const toMinutos = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

// Comprueba si el nuevo bloque cruza con una reserva existente.
const hayCruce = () => {
  const inicio = toMinutos(reservaForm.value.horaInicio);
  const fin = toMinutos(reservaForm.value.horaFin);

  return horariosOcupados.value.some((horario) => {
    const inicioOcupado = toMinutos(horario.hora_inicio);
    const finOcupado = toMinutos(horario.hora_fin);
    return inicio < finOcupado && fin > inicioOcupado;
  });
};

// Valida el formulario antes de enviarlo.
const validarReserva = () => {
  const { fecha, horaInicio, horaFin } = reservaForm.value;

  errors.fecha = fecha ? "" : "Selecciona una fecha";
  errors.horaInicio = horaInicio ? "" : "Selecciona la hora inicial";
  errors.horaFin = horaFin ? "" : "Selecciona la hora final";

  if (!errors.horaInicio && !errors.horaFin && horaInicio >= horaFin) {
    errors.horaFin = "La hora fin debe ser mayor que la hora inicio";
  }

  if (!errors.horaInicio && !errors.horaFin && !errors.fecha && hayCruce()) {
    errors.horaFin = "Ese horario ya esta ocupado";
  }

  return !errors.fecha && !errors.horaInicio && !errors.horaFin;
};

// Crea la reserva en backend.
const reservar = async () => {
  const { fecha, horaInicio, horaFin } = reservaForm.value;

  if (!validarReserva()) {
    return;
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

<style>
/* Fondo general de la vista. */
.page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

/* Caja principal de la reserva. */
.container {
  margin-top: 30px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 98, 0.6);
}

/* Bloque con datos del usuario autenticado. */
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

/* Posicion del boton de regreso. */
.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}
</style>
