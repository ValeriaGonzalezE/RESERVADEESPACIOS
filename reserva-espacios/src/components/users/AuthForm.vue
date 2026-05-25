<template>
  <div>

    <div v-for="f in fields" :key="f.model" class="input-group">
      <label class="input-label">
        {{ f.label }}
      </label>

      <BaseInput v-model="form[f.model]" :type="f.type || 'text'" :placeholder="f.placeholder"
        @blur="handleEmail(f.model)" />
    </div>

    <BaseButton @click="$emit('submit', form)">
      {{ buttonText }}
    </BaseButton>

  </div>
</template>

<script setup>
import { reactive } from "vue";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps({
  fields: Array,
  buttonText: String
});

// Guarda dinamicamente los valores escritos en los campos definidos por el componente padre.
const form = reactive({});

// AGREGA @gmail.com SI EL USUARIO NO ESCRIBE DOMINIO
const handleEmail = (model) => {
  const value = form[model];

  if (
    model === "codigo" &&
    value &&
    !value.includes("@")
  ) {
    form[model] = value + "@gmail.com";
  }
};
</script>

<style scoped>
.input-group {
  margin-bottom: 18px;
}

.input-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #444;
}
</style>
