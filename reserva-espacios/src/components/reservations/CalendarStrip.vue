<template>
  <div>

    <!-- MES -->
    <h3 class="mes">{{ mesActual }}</h3>

    <!-- CALENDARIO -->
    <div class="calendar-wrapper">

      <button class="nav-btn" @click="moverDias(-1)">‹</button>

      <transition-group name="slide" tag="div" class="dias">
        <div
          v-for="dia in dias"
          :key="dia.fecha"
          class="dia"
          :class="{
            activo: dia.fecha === modelValue,
            hoy: dia.fecha === hoyISO
          }"
          @click="$emit('update:modelValue', dia.fecha)"
        >
          <span class="nombre">{{ dia.nombre }}</span>
          <span class="numero">{{ dia.numero }}</span>

          <div v-if="dia.tieneEventos" class="dot"></div>
        </div>
      </transition-group>

      <button class="nav-btn" @click="moverDias(1)">›</button>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

const props = defineProps({
  eventos: Array,
  modelValue: String
});

const emit = defineEmits(["update:modelValue"]);

const dias = ref([]);
const cantidadDias = ref(7);

const hoy = new Date();
const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

let baseDate = new Date();

// RESPONSIVE
const calcularDiasVisibles = () => {
  const width = window.innerWidth;

  if (width < 480) cantidadDias.value = 3;     // 📱 móvil
  else if (width < 768) cantidadDias.value = 6; // 📲 tablet pequeña
  else if (width < 1200) cantidadDias.value = 8; // tablet grande
  else cantidadDias.value = 11; // 💻 desktop
};

// MES
const mesActual = computed(() => {
  if (dias.value.length === 0) return "";

  const medio = dias.value[Math.floor(dias.value.length / 2)];
  const fecha = new Date(medio.fecha);

  return fecha.toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric"
  });
});

// GENERAR
const generarDias = () => {
  const lista = [];
  const mitad = Math.floor(cantidadDias.value / 2);

  for (let i = -mitad; i <= mitad; i++) {
    const fecha = new Date(baseDate);
    fecha.setDate(baseDate.getDate() + i);

    const fechaISO = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

    lista.push({
      fecha: fechaISO,
      nombre: fecha.toLocaleDateString("es-CO", { weekday: "short" }),
      numero: fecha.getDate(),
      tieneEventos: false
    });
  }

  dias.value = lista;
  marcarEventos();
};

// EVENTOS
const marcarEventos = () => {
  dias.value.forEach(dia => {
    dia.tieneEventos = props.eventos?.some(r =>
      r.fecha.split("T")[0] === dia.fecha
    );
  });
};

// MOVER
const moverDias = (direccion) => {
  baseDate.setDate(baseDate.getDate() + direccion * cantidadDias.value);
  generarDias();
};

watch(() => props.eventos, marcarEventos);

onMounted(() => {
  calcularDiasVisibles();
  generarDias();

  window.addEventListener("resize", () => {
    calcularDiasVisibles();
    generarDias();
  });
});
</script>

<style scoped>
.mes {
  text-align: center;
  color: #ff2e63;
  margin: 10px 0;
  text-transform: capitalize;
}

.calendar-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  position: relative;
}

.dias {
  display: flex;
  gap: 10px;
  flex: 1; /*ocupa el espacio central */
  justify-content: center;
  overflow: hidden;
}

.dia {
  width: 70px;
  height: 85px;
  padding: 8px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  background: #111111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  border: 1px solid #444;
}

.dia:hover {
  transform: scale(1.05);
}

/* ACTIVO */
.dia.activo {
  background: #ff2e63;
  border: 1px solid #ff547e;
  color: white;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.7);
}

/* HOY */
.dia.hoy {
  border: 1px solid #ff2e63;
}

/* TEXTO */
.nombre {
  font-size: 12px;
  text-transform: uppercase;
  color: #aaa;
}

.numero {
  font-size: 20px;
  font-weight: bold;
  margin-top: 5px;
}

/* PUNTITO */
.dot {
  width: 6px;
  height: 6px;
  background: #00ff9d;
  border-radius: 50%;
  margin-top: 6px;
}

.nav-btn {
  background: #ff2e63;
  border: none;
  color: white;
  font-size: 20px;
  padding: 6px 10px;
  border-radius: 10px;
  cursor: pointer;
}

/* celular */
@media (max-width: 480px) {

  .dia {
    min-width: 55px;
    padding: 10px 6px;
  }

  .nombre {
    font-size: 10px;
  }

  .numero {
    font-size: 16px;
  }

  .nav-btn {
    font-size: 16px;
    padding: 5px 8px;
  }
}
/* tablet */ 
@media (min-width: 481px) and (max-width: 768px) {

  .dia {
    min-width: 60px;
  }

}

/* desktop */
@media (min-width: 1200px) {

  .dia {
    min-width: 70px;
  }

}
</style>