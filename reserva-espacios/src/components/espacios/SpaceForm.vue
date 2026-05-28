<template>
  <!-- Formulario de espacios construido a partir de una estructura comun de campos. -->
  <div class="form">
    <AuthForm
      :fields="fields"
      :initial-values="espacio"
      :external-errors="errors"
      button-text="Guardar"
      @update="emit('update:espacio', $event)"
      @submit="emit('guardar', $event)"
    />
  </div>
</template>

<script setup>
// Este componente encapsula los campos de crear y editar espacio.
import { computed } from "vue";
import AuthForm from "../users/AuthForm.vue";

// Props para datos del formulario, tipos disponibles y errores de validacion.
const props = defineProps({
  espacio: {
    type: Object,
    required: true
  },
  tipos: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

// Eventos para subir cambios y enviar el formulario al padre.
const emit = defineEmits(["guardar", "update:espacio"]);

// Configuracion declarativa de los campos del formulario.
const fields = computed(() => {
  const baseFields = [
    {
      model: "nombre",
      label: "Nombre",
      placeholder: "Ej: Salon principal"
    },
    {
      model: "tipo_id",
      label: "Tipo",
      type: "select",
      disabledOption: "Selecciona",
      options: props.tipos.map((tipo) => ({
        value: String(tipo.id),
        label: tipo.nombre
      }))
    },
    {
      model: "capacidad",
      label: "Capacidad",
      type: "number",
      min: "1",
      placeholder: "Ej: 30"
    },
    {
      model: "ubicacion",
      label: "Ubicacion",
      placeholder: "Ej: Calle 1 #1A-1, barrio"
    },
    {
      model: "descripcion",
      label: "Descripcion",
      type: "textarea",
      placeholder: "Describe el espacio"
    },
    {
      model: "requiere_pago",
      label: "Requiere pago",
      type: "select",
      disabledOption: "Selecciona",
      options: [
        { value: "no", label: "Gratis" },
        { value: "si", label: "De pago" }
      ]
    }
  ];

  if (props.espacio?.requiere_pago === "si") {
    baseFields.push({
      model: "precio",
      label: "Precio",
      type: "number",
      min: "0",
      placeholder: "Ej: 50000"
    });
  }

  return baseFields;
});
</script>

<style scoped>
/* Contenedor simple para preservar el flujo actual del layout. */
.form {
  display: flex;
  flex-direction: column;
}
</style>
