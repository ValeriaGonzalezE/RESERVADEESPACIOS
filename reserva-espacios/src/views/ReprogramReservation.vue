<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general y boton de regreso. -->
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <!-- Resumen de la reserva actual. -->
          <div class="card">
            <h3>Reserva actual</h3>
            <p>{{ formatearFecha(reserva?.fecha) }}</p>
            <p>{{ reserva?.hora_inicio || "-" }} - {{ reserva?.hora_fin || "-" }}</p>
          </div>

          <!-- Formulario de reprogramacion. -->
          <div class="form">
            <ReservationForm
              v-model="reservaForm"
              :fields="fields"
              :horarios="horariosOcupados"
              :errors="errors"
              @update="cargarHorariosOcupados"
            />

            <BaseButton @click="guardar">Guardar cambios</BaseButton>

            <p class="cancelar-texto" @click="cancelar">Cancelar reserva</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones para reprogramar o cancelar una reserva.
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import ReservationForm from "@/components/reservations/ReservationForm.vue";

// Datos de ruta y navegacion.
const route = useRoute();
const router = useRouter();
const id = route.params.id;

// Estado de la reserva actual y del formulario editable.
const reserva = ref(null);
const horariosOcupados = ref([]);
const reservaForm = ref({
  fecha: "",
  horaInicio: "",
  horaFin: "",
  text: "" || undefined
});

// Campos del formulario. Para agregar otro input, se agrega aqui y luego en errors/validarReserva.
const fields = [
  {
    model: "fecha",
    label: "Fecha",
    type: "date"
  },
  {
    model: "horaInicio",
    label: "Hora inicio",
    type: "time"
  },
  {
    model: "horaFin",
    label: "Hora fin",
    type: "time"
  },
  {
    model: "text",
    label: "Motivo",
    type: "textarea"
  }
];

// Errores de frontend para apoyar la validacion.
const errors = reactive({
  fecha: "",
  horaInicio: "",
  horaFin: "",
  text: ""
});

// Convierte fechas a una salida amigable para la tarjeta superior.
const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const value = new Date(fecha);
  return Number.isNaN(value.getTime()) ? "-" : value.toLocaleDateString("es-CO");
};

// Carga la reserva del usuario y prepara el formulario.
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

// Consulta horarios ocupados del mismo espacio y fecha, excluyendo la reserva actual.
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

// Valida los campos minimos del formulario.
const validarReserva = () => {
  const { fecha, horaInicio, horaFin, text } = reservaForm.value;

  errors.fecha = fecha ? "" : "Selecciona una fecha";
  errors.horaInicio = horaInicio ? "" : "Selecciona la hora inicial";
  errors.horaFin = horaFin ? "" : "Selecciona la hora final";
  errors.text = text ? "": "obligatorio";
  if (!errors.horaInicio && !errors.horaFin && horaInicio >= horaFin) {
    errors.horaFin = "La hora fin debe ser mayor";
  }
  if (text && (text.length < 10 || text.length > 100)){
    return alert ("entre 10 a 100 caracteres");
  }

  return !errors.fecha && !errors.horaInicio && !errors.horaFin;
};

// Guarda la nueva fecha y rango horario.
const guardar = async () => {
  const { fecha, horaInicio, horaFin, text } = reservaForm.value;
  
  if (!validarReserva()) {
    return;
  }
  try{
    const res = await api.put(`/reservas/${id}`, {
      fecha,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      text: text
    });

    if (!res.data.success) {
      return alert(res.data.message || "No se pudo actualizar");
    }

    alert("Reserva reprogramada");
    router.back();
  }catch (err) {
    alert(err.response?.data?.message || "Error del servidor");
  }
};

// Cancela la reserva luego de confirmacion.
const cancelar = async () => {
  if (!confirm("Seguro que quieres cancelar la reserva?")) {
    return;
  }

  await api.put(`/reservas/cancelar/${id}`);
  alert("Reserva cancelada");
  router.back();
};
</script>

<style scoped>
/* Fondo general de la pantalla. */
.page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

/* Caja principal del contenido. */
.container {
  margin-top: 30px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 98, 0.6);
}

/* Tarjeta con la reserva vigente. */
.card {
  background: #232323;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 5px solid #ff2e63;
}

/* Columna para el formulario y acciones. */
.form {
  display: flex;
  flex-direction: column;
}

/* Posicion del boton de regreso. */
.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}

/* Texto accionable para cancelar. */
.cancelar-texto {
  margin-top: 10px;
  color: #ff2e63;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
}
</style>
