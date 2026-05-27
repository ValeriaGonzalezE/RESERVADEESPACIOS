<script setup>
import BaseButton from "../ui/BaseButton.vue";
import BaseInput from "../ui/BaseInput.vue";

defineProps({
  espacio: Object,
  tipos: Array
});

const emit = defineEmits(["guardar"]);
</script>

<template>
  <form class="form" @submit.prevent="emit('guardar')">
    <BaseInput
      v-model="espacio.nombre"
      label="Nombre"
      placeholder="Ej: Salon principal"
    />

    <BaseInput
      v-model="espacio.tipo_id"
      label="Tipo"
      type="select"
      disabled-option="Selecciona"
      :options="tipos.map((tipo) => ({ value: String(tipo.id), label: tipo.nombre }))"
    />

    <BaseInput
      v-model="espacio.capacidad"
      label="Capacidad"
      type="number"
      min="1"
      placeholder="Ej: 30"
    />

    <BaseInput
      v-model="espacio.ubicacion"
      label="Ubicacion"
      placeholder="Ej: Calle 1 #1A-1, barrio"
    />

    <BaseInput
      v-model="espacio.descripcion"
      label="Descripcion"
      type="textarea"
      placeholder="Describe el espacio"
    />

    <BaseInput
      v-model="espacio.requiere_pago"
      label="Requiere pago"
      type="select"
      disabled-option="Selecciona"
      :options="[
        { value: 'no', label: 'Gratis' },
        { value: 'si', label: 'De pago' }
      ]"
    />

    <BaseInput
      v-if="espacio.requiere_pago === 'si'"
      v-model="espacio.precio"
      label="Precio"
      type="number"
      min="0"
      placeholder="Ej: 50000"
    />

    <BaseButton type="submit">
      Guardar
    </BaseButton>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
}
</style>
