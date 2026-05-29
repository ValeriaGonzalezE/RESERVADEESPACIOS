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
import AuthForm from "../users/AuthForm.vue";

// Props para datos del formulario, tipos disponibles y errores de validacion.
defineProps({
  espacio: {
    type: Object,
    required: true
  },
  fields: {
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
</script>

<style scoped>
/* Contenedor simple para preservar el flujo actual del layout. */
.form {
  display: flex;
  flex-direction: column;
}
</style>
