<template>
  <div class="reservation-form">
    <BaseInput
      v-model="localForm.fecha"
      label="Fecha"
      type="date"
      @change="emitCambio"
    />

    <div v-if="horarios.length > 0" class="ocupados">
      <h4>Horarios ocupados</h4>

      <div class="bloques">
        <span v-for="h in horarios" :key="h.hora_inicio" class="bloque">
          {{ h.hora_inicio }} - {{ h.hora_fin }}
        </span>
      </div>
    </div>

    <div class="horas">
      <BaseInput
        v-model="localForm.horaInicio"
        label="Hora inicio"
        type="time"
        @change="emitCambio"
      />

      <BaseInput
        v-model="localForm.horaFin"
        label="Hora fin"
        type="time"
        @change="emitCambio"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import BaseInput from "../ui/BaseInput.vue";

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
  }
});

const emit = defineEmits(["update:modelValue", "update"]);

const localForm = reactive({
  fecha: props.modelValue.fecha || "",
  horaInicio: props.modelValue.horaInicio || "",
  horaFin: props.modelValue.horaFin || ""
});

const emitCambio = () => {
  const form = { ...localForm };
  emit("update:modelValue", form);
  emit("update", form);
};

watch(
  () => props.modelValue,
  (value) => {
    localForm.fecha = value?.fecha || "";
    localForm.horaInicio = value?.horaInicio || "";
    localForm.horaFin = value?.horaFin || "";
  },
  { deep: true }
);

watch(localForm, emitCambio, { deep: true });
</script>

<style scoped>
.reservation-form {
  display: flex;
  flex-direction: column;
}

.horas {
  display: flex;
  gap: 10px;
}

.ocupados {
  margin-top: 10px;
}

.bloques {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.bloque {
  background: #ff4d4d;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
}
</style>
