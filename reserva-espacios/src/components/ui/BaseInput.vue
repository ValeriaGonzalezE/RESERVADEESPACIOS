<script setup>
defineProps(["label", "type", "modelValue"]);
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

input {
  padding: 8px;
  border-radius: 5px;
  border: none;
}
</style>