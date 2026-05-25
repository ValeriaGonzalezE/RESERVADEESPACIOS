<template>
  <div>

    <!-- FECHA -->
    <div class="input-group">
      <label>Fecha</label>
      <input type="date" v-model="fecha" @change="emitCambio" />
    </div>

    <!-- HORARIOS OCUPADOS -->
    <div v-if="horarios.length > 0" class="ocupados">
      <h4>Horarios ocupados</h4>

      <div class="bloques">
        <span v-for="h in horarios" :key="h.hora_inicio" class="bloque">
          {{ h.hora_inicio }} - {{ h.hora_fin }}
        </span>
      </div>
    </div>

    <!-- HORAS -->
    <div class="horas">
      <div class="input-group">
        <label>Hora inicio</label>
        <input type="time" v-model="horaInicio" @input="emitCambio" />
      </div>

      <div class="input-group">
        <label>Hora fin</label>
        <input type="time" v-model="horaFin" @input="emitCambio" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  horarios: Array
});

const emit = defineEmits(["update"]);

const fecha = ref("");
const horaInicio = ref("");
const horaFin = ref("");

const emitCambio = () => {
  emit("update", {
    fecha: fecha.value,
    horaInicio: horaInicio.value,
    horaFin: horaFin.value
  });
};

watch([fecha, horaInicio, horaFin], emitCambio);
</script>

<style scoped>
.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.horas {
  display: flex;
  gap: 10px;
}

input {
  padding: 8px;
  border-radius: 5px;
  border: none;
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