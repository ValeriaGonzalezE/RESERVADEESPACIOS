<template>
  <!-- Formulario reutilizable para crear y reprogramar reservas. -->
  <div class="reservation-form">
    <!-- Campos principales de la reserva construidos con la estructura comun. -->
    <AuthForm
      :fields="fields"
      :initial-values="localForm"
      :external-errors="errors"
      :show-submit="false"
      @update="syncForm"
    />

    <!-- Resumen visual de bloques ocupados para evitar cruces. -->
    <div v-if="horarios.length > 0" class="ocupados">
      <h4>Horarios ocupados</h4>

      <div class="bloques">
        <span v-for="h in horarios" :key="h.hora_inicio" class="bloque">
          {{ h.hora_inicio }} - {{ h.hora_fin }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Mantiene una copia local para emitir cambios sin acoplar la vista a los inputs.
import { computed, reactive, watch } from "vue";
import AuthForm from "../users/AuthForm.vue";

// Props para horarios ocupados, modelo v-model y errores del formulario.
const props = defineProps({
  horarios: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Object,
    default: () => ({
      fecha: "",
      horaInicio: "",
      horaFin: ""
    })
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  fields: {
    type: Array,
    default: () => [
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
      }
    ]
  }
});

// Eventos para mantener la interfaz actual del componente.
const emit = defineEmits(["update:modelValue", "update"]);

// Estado local del formulario de reserva.
const localForm = reactive({
  fecha: props.modelValue.fecha || "",
  horaInicio: props.modelValue.horaInicio || "",
  horaFin: props.modelValue.horaFin || ""
});

// Definicion uniforme de campos para fecha y horas.
const fields = computed(() => props.fields);

// Emite el estado actual hacia la vista padre.
const emitCambio = () => {
  const form = { ...localForm };
  emit("update:modelValue", form);
  emit("update", form);
};

// Sincroniza cambios escritos en el formulario base.
const syncForm = (form) => {
  Object.keys(form).forEach((key) => {
    localForm[key] = form[key] || "";
  });
};

// Actualiza el estado local cuando el padre modifica el modelo.
watch(
  () => props.modelValue,
  (value) => {
    props.fields.forEach((field) => {
      localForm[field.model] = value?.[field.model] || "";
    });
  },
  { deep: true }
);

// Propaga cada cambio al padre para disponibilidad y validaciones.
watch(localForm, emitCambio, { deep: true });
</script>

<style scoped>
/* Estructura principal del formulario de reserva. */
.reservation-form {
  display: flex;
  flex-direction: column;
}

/* Bloque informativo de horarios ya reservados. */
.ocupados {
  margin-top: 10px;
}

/* Contenedor flexible de chips de horarios ocupados. */
.bloques {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* Apariencia de cada horario ocupado. */
.bloque {
  background: #ff4d4d;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
}
</style>
