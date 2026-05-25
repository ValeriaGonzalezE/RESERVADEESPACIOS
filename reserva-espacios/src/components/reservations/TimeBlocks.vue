<script setup>
defineProps(["horarios"]);
</script>

<template>
  <div v-if="horarios.length" class="ocupados">
    <h4>Horarios ocupados:</h4>

    <div class="bloques">
      <span v-for="h in horarios" :key="h.hora_inicio" class="bloque">
        {{ h.hora_inicio }} - {{ h.hora_fin }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.bloques {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bloque {
  background: #ff4d4d;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
}
</style>