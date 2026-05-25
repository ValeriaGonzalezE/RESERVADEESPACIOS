<script setup>
const props = defineProps({
  espacio: Object,
  mostrarEditar: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["verReservas", "editar"]);

</script>

<template>
  <div class="card">

    <img v-if="mostrarEditar" src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" class="edit-btn"
      @click.stop="emit('editar', espacio.id)" />

    <div @click="emit('verReservas', espacio.id)">
      <img v-if="espacio.imagen" :src="espacio.imagen" class="img" />

      <h3>{{ espacio.nombre }}</h3>
      <p>{{ espacio.descripcion }}</p>

      <p>Tipo: {{ espacio.tipo }}</p>
      <p>📍 {{ espacio.ubicacion }}</p>
      <p>👥 {{ espacio.capacidad }}</p>

      <p v-if="espacio.requiere_pago === 'si'">
        💰 ${{ espacio.precio }}
      </p>
      <p v-else>🆓 Gratis</p>

      <p :class="espacio.estado === 'activo' ? 'ok' : 'bad'">
        {{ espacio.estado }}
      </p>
    </div>

  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: #1e1e1e;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 5px solid #ff2e63;
  border-radius: 8px;
  cursor: pointer;
}

.edit-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 25px;
  cursor: pointer;
  filter: invert(100%);
}

.img {
  width: 100%;
  border-radius: 10px;
}

.ok {
  color: #00ff9d;
}

.bad {
  color: #ff4d4d;
}
</style>