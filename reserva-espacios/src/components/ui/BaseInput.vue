<script setup>
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
  }
});

defineEmits(["update:modelValue", "blur", "change"]);
</script>

<template>
  <div class="input-group">
    <label v-if="label" class="input-label">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      class="input-control"
      :value="modelValue"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    />

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
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #ff2e63;
}

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

.input-control:focus {
  border-color: rgba(255, 46, 99, 0.9);
  box-shadow: 0 0 0 3px rgba(255, 46, 99, 0.15);
}

textarea.input-control {
  min-height: 110px;
  resize: vertical;
}
</style>
