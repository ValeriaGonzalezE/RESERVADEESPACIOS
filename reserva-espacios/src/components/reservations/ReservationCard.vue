<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps(["reserva"]);
defineEmits(["editar", "cancelar"]);

const current = ref(0);
let interval = null;

// siguiente
const next = () => {
  current.value = (current.value + 1) % props.reserva.fotos.length;
};

// anterior
const prev = () => {
  current.value =
    (current.value - 1 + props.reserva.fotos.length) %
    props.reserva.fotos.length;
};

// autoplay
onMounted(() => {
  if (props.reserva.fotos?.length > 1) {
    interval = setInterval(next, 3000);
  }
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div class="card">

    <!-- INFO (IZQUIERDA) -->
    <div class="info">

      <h4>{{ reserva.nombre }}</h4>

      <p>📅 {{ new Date(reserva.fecha).toLocaleDateString("es-CO") }}</p>
      <p>📝 {{ reserva.descripcion || "-" }}</p>
      <p>📍 {{ reserva.ubicacion }}</p>
      <p>⏰ {{ reserva.hora_inicio }} - {{ reserva.hora_fin }}</p>
      <p>👥 {{ reserva.capacidad || "No definida" }}</p>

      <p v-if="reserva.requiere_pago === 'si'">
        💰 ${{ reserva.precio }}
      </p>
      <p v-else>🆓 Gratis</p>

      <div class="acciones">
        <button @click="$emit('editar', reserva)">Editar ✏️</button>
        <button @click="$emit('cancelar', reserva.id)">Cancelar ❌</button>
      </div>

    </div>

    <!-- IMAGEN (DERECHA) -->
    <div v-if="reserva.fotos?.length" class="image-container">

      <!-- CARRUSEL -->
      <div class="slider" :style="{ transform: `translateX(-${current * 100}%)` }">
        <img
          v-for="(f, i) in reserva.fotos"
          :key="i"
          :src="f"
        />
      </div>

      <!-- BOTONES -->
      <button v-if="reserva.fotos.length > 1" class="nav left" @click="prev">‹</button>
      <button v-if="reserva.fotos.length > 1" class="nav right" @click="next">›</button>

      <!-- INDICADORES -->
      <div v-if="reserva.fotos.length > 1" class="lines">
        <span
          v-for="(f, i) in reserva.fotos"
          :key="i"
          :class="{ active: i === current }"
        ></span>
      </div>

    </div>

  </div>
</template>

<style scoped>
.card {
  display: flex;
  background: #1e1e1e;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 0 20px rgba(255, 46, 99, 0.3);
}

/* INFO */
.info {
  width: 60%;
  padding: 15px;
}

/* IMAGEN */
.image-container {
  position: relative;
  width: 40%;
  display: flex;
  align-items: center;   /* centra vertical */
  justify-content: center; /* centra horizontal */
  overflow: hidden;
}

/* SLIDER */
.slider {
  display: flex;
  transition: transform 0.9s ease-in-out;
  width: 100%;
  height: 100%; /* ocupa todo el alto */
}

.slider img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

/* BOTONES */
.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}

.left { left: 5px; }
.right { right: 5px; }

/* INDICADORES tipo _ _ _ */
.lines {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.lines span {
  width: 20px;
  height: 3px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  transition: 0.3s;
}

.lines span.active {
  background: #ff2e63;
  width: 30px;
}

/* ACCIONES */
.acciones {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.acciones button {
  background: #ff2e63;
  border: none;
  padding: 10px 50px 10px;
  border-radius: 7px;
  color: white;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* tablet */
@media (min-width: 768px) and (max-width: 1081px) {

  .acciones button {
    padding: 10px 50px 10px;
  }

}

/* tablet */
@media (min-width: 551px) and (max-width: 768px) {

  .acciones button {
    padding: 10px 30px 10px;
  }

}

/* celular */
@media (max-width: 551px) {

  .acciones button {
    padding: 10px 10px 10px;
  }

}

</style>