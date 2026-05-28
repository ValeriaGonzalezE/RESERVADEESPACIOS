<template>
  <!-- Contenedor base para que todos los inputs compartan la misma estructura visual. -->
  <div class="input-group">
    <!-- Etiqueta opcional del campo. -->
    <label v-if="label" class="input-label">{{ label }}</label>

    <!-- Textarea reutilizable para campos de texto largo. -->
    <textarea
      v-if="type === 'textarea'"
      class="input-control"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    />

    <!-- Select reutilizable para listas configuradas por props. -->
    <select
      v-else-if="type === 'select'"
      class="input-control"
      :value="modelValue"
      @change="
        $emit('update:modelValue', $event.target.value);
        $emit('change', $event);
      "
    >
      <option v-if="disabledOption" disabled value="">
        {{ disabledOption }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Input general para texto, password, fecha, hora y numeros. -->
    <input
      v-else
      class="input-control"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />

    <!-- Mensaje de error opcional para validacion en frontend. -->
    <small v-if="error" class="input-error">{{ error }}</small>
  </div>
</template>

<script setup>
// Props compartidas por todos los campos del proyecto.
defineProps({
  label: String,
  type: {
    type: String,
    default: "text"
  },
  modelValue: {
    type: [String, Number],
    default: ""
  },
  placeholder: {
    type: String,
    default: ""
  },
  options: {
    type: Array,
    default: () => []
  },
  disabledOption: {
    type: String,
    default: ""
  },
  min: {
    type: [String, Number],
    default: undefined
  },
  error: {
    type: String,
    default: ""
  }
});

// Eventos base para integrarlo con v-model y validaciones.
defineEmits(["update:modelValue", "blur", "change"]);
</script>

<style scoped>
/* Estructura vertical del campo y su etiqueta. */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

/* Estilo de etiquetas compartido entre vistas. */
.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #ff2e63;
}

/* Apariencia principal de inputs, selects y textareas. */
.input-control {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: white;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* Resalta el foco sin alterar el lenguaje visual existente. */
.input-control:focus {
  border-color: rgba(255, 46, 99, 0.9);
  box-shadow: 0 0 0 3px rgba(255, 46, 99, 0.15);
}

/* Permite que el textarea conserve un alto comodo. */
textarea.input-control {
  min-height: 110px;
  resize: vertical;
}

/* Error ligero debajo del campo para guiar al usuario. */
.input-error {
  color: #ff8ea9;
  font-size: 12px;
}
</style>
