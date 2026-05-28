<template>
  <!-- Formulario base que dibuja campos dinamicos desde una configuracion comun. -->
  <form class="form-box" @submit.prevent="enviarFormulario">
    <!-- Lista de campos renderizada de forma uniforme en todas las vistas. -->
    <BaseInput
      v-for="field in normalizedFields"
      :key="field.model"
      v-model="form[field.model]"
      :label="field.label"
      :type="field.type || 'text'"
      :placeholder="field.placeholder || ''"
      :options="field.options || []"
      :disabled-option="field.disabledOption || ''"
      :min="field.min"
      :error="errors[field.model] || ''"
      @blur="handleBlur(field)"
      @change="field.onChange ? field.onChange($event, { form }) : null"
    />

    <!-- Slot extra para casos como imagenes, previews o bloques auxiliares. -->
    <slot :form="form" />

    <!-- Boton opcional para reutilizar el mismo componente en formularios embebidos. -->
    <BaseButton v-if="showSubmit" type="submit">
      {{ buttonText }}
    </BaseButton>
  </form>
</template>

<script setup>
// Se usa estado reactivo interno para mantener simple el consumo desde las vistas.
import { computed, reactive, watch } from "vue";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";
import {
  createErrorState,
  createFormState,
  normalizeEmail as normalizeEmailValue,
  resetErrors
} from "@/utils/formUtils";

// Configuracion base del formulario dinamico.
const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  buttonText: {
    type: String,
    default: "Guardar"
  },
  initialValues: {
    type: Object,
    default: () => ({})
  },
  externalErrors: {
    type: Object,
    default: () => ({})
  },
  showSubmit: {
    type: Boolean,
    default: true
  }
});

// Eventos para entregar el formulario, sincronizar cambios y blur por campo.
const emit = defineEmits(["submit", "update", "blur"]);

// Campos normalizados para asegurar que siempre exista un valor inicial.
const normalizedFields = computed(() => {
  return props.fields.map((field) => ({
    ...field,
    initialValue: props.initialValues[field.model] ?? field.initialValue ?? ""
  }));
});

// Estado interno comun que usan todas las pantallas.
const form = reactive(createFormState(normalizedFields.value));
const errors = reactive(createErrorState(normalizedFields.value));

// Sincroniza datos externos cuando una vista reutiliza el formulario para editar.
watch(
  () => props.initialValues,
  (values) => {
    normalizedFields.value.forEach((field) => {
      form[field.model] = values[field.model] ?? field.initialValue ?? "";
    });
  },
  { deep: true, immediate: true }
);

// Sincroniza errores calculados desde la vista.
watch(
  () => props.externalErrors,
  (incomingErrors) => {
    resetErrors(errors);
    Object.entries(incomingErrors || {}).forEach(([key, value]) => {
      if (key in errors) {
        errors[key] = value || "";
      }
    });
  },
  { deep: true, immediate: true }
);

// Notifica cambios para validaciones reactivas desde la vista padre.
watch(
  form,
  () => {
    emit("update", { ...form });
  },
  { deep: true }
);

// Aplica transformaciones por campo al perder foco.
const handleBlur = (field) => {
  if (field.autoEmail) {
    form[field.model] = normalizeEmailValue(form[field.model]);
  }

  emit("blur", {
    field,
    form: { ...form }
  });
};

// Entrega una copia limpia del estado actual al enviar.
const enviarFormulario = () => {
  emit("submit", { ...form });
};
</script>

<style scoped>
/* Contenedor vertical neutro que conserva la maquetacion existente. */
.form-box {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
