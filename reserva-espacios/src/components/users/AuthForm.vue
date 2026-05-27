<template>
  <form class="form-box" @submit.prevent="$emit('submit', { ...form })">
    <BaseInput
      v-for="field in fields"
      :key="field.model"
      v-model="form[field.model]"
      :label="field.label"
      :type="field.type || 'text'"
      :placeholder="field.placeholder || ''"
      @blur="handleEmail(field.model)"
    />

    <BaseButton type="submit">
      {{ buttonText }}
    </BaseButton>
  </form>
</template>

<script setup>
import { reactive, watchEffect } from "vue";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps({
  fields: {
    type: Array,
    default: () => []
  },
  buttonText: {
    type: String,
    default: "Guardar"
  }
});

const form = reactive({});

watchEffect(() => {
  props.fields.forEach((field) => {
    if (!(field.model in form)) {
      form[field.model] = field.initialValue || "";
    }
  });
});

const handleEmail = (model) => {
  const value = form[model];

  if ((model === "codigo" || model === "email") && value && !value.includes("@")) {
    form[model] = value + "@gmail.com";
  }
};
</script>

<style scoped>
.form-box {
  display: flex;
  flex-direction: column;
}
</style>
