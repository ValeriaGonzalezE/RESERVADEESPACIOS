<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general y boton de regreso. -->
      <div class="page">
        <BackButton class="back-floating" />

        <!-- Informacion principal del espacio. -->
        <div class="space-info">
          <h2>{{ espacio.nombre }}</h2>
          <p>{{ espacio.descripcion }}</p>
          <br>
          <p>Ubicacion: {{ espacio.ubicacion }}</p>
          <p>Capacidad: {{ espacio.capacidad }}</p>
          <br>

          <!-- Seccion plegable de comentarios recibidos. -->
          <div class="comments-box">
            <div class="comments-header" @click="mostrarComentarios = !mostrarComentarios">
              <h3>Ver comentarios ({{ comentarios.length }}) {{ mostrarComentarios ? "-" : "+" }}</h3>
              <br>
            </div>

            <transition name="fade">
              <div v-if="mostrarComentarios" class="comments-content">
                <div v-if="comentarios.length === 0" class="empty-comments">Aun no hay comentarios</div>

                <div v-for="c in comentarios" :key="c.id" class="comment-card">
                  <div class="comment-top">
                    <h4>{{ c.nombre }}</h4>
                    <span class="stars">{{ estrellas(c.estrellas) }}</span>
                  </div>
                  <p>{{ c.comentario }}</p>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Calendario de reservas del espacio. -->
        <div class="calendar-box">
          <CalendarStrip v-model="fecha" :eventos="todasReservas" />
        </div>

        <!-- Lista de reservas del dia seleccionado. -->
        <div class="container">
          <div v-if="reservasFiltradas.length === 0" class="empty">No hay reservas este dia</div>

          <div v-for="r in reservasFiltradas" :key="r.id" class="card">
            <div class="avatar">{{ r.usuario_nombre?.charAt(0) }}</div>

            <div class="info">
              <h3>{{ r.usuario_nombre }} {{ r.apellido }}</h3>
              <p>Telefono: {{ r.telefono || "Sin telefono" }}</p>
              <p>Correo: {{ r.email || "Sin correo" }}</p>
              <p>Hora: {{ r.hora_inicio }} - {{ r.hora_fin }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones necesarias para ver reservas de un espacio.
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";
import BackButton from "@/components/ui/BackButton.vue";
import CalendarStrip from "@/components/reservations/CalendarStrip.vue";

// Parametro del espacio actual.
const route = useRoute();
const espacioId = route.params.id;

// Estado principal de la vista.
const fecha = ref("");
const todasReservas = ref([]);
const espacio = ref({});
const comentarios = ref([]);
const mostrarComentarios = ref(false);

// Fecha inicial igual al dia actual.
const hoy = new Date();
fecha.value = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;

// Carga espacio, reservas y comentarios al entrar.
onMounted(async () => {
  const espacioRes = await api.get(`/espacios/${espacioId}`);
  espacio.value = espacioRes.data;

  const reservasRes = await api.get(`/reservas/espacio/${espacioId}`);
  todasReservas.value = reservasRes.data;

  const comentariosRes = await api.get(`/espacios/comentarios/${espacioId}`);
  comentarios.value = comentariosRes.data;
});

// Filtra las reservas del espacio por la fecha seleccionada.
const reservasFiltradas = computed(() => {
  return todasReservas.value.filter((r) => {
    const fechaReserva = r.fecha.split("T")[0];
    return fechaReserva === fecha.value;
  });
});

// Genera una representacion simple de estrellas.
const estrellas = (n) => {
  return "*".repeat(n || 0);
};
</script>

<style scoped>
/* Fondo general de la pantalla. */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
  padding-bottom: 40px;
}

/* Posicion del boton de regreso. */
.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
}

/* Bloque descriptivo del espacio. */
.space-info {
  margin: 20px;
  margin-top: 30px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  border-radius: 18px;
  backdrop-filter: blur(10px);
}

/* Titulo del espacio. */
.space-info h2 {
  color: #ff2e63;
  margin-bottom: 10px;
}

/* Separacion del calendario. */
.calendar-box {
  margin-top: 10px;
}

/* Contenedor de la lista de reservas. */
.container {
  padding: 20px;
}

/* Tarjeta de cada reserva. */
.card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-left: 5px solid #ff2e63;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.2s;
}

/* Elevacion ligera al pasar el mouse. */
.card:hover {
  transform: translateY(-2px);
}

/* Avatar circular del usuario. */
.avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #ff2e63;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  color: white;
}

/* Titulo de cada reserva. */
.info h3 {
  margin: 0;
  margin-bottom: 5px;
}

/* Texto secundario de cada reserva. */
.info p {
  margin: 4px 0;
  color: #ccc;
}

/* Estado vacio para dias sin reservas. */
.empty {
  text-align: center;
  color: #888;
  margin-top: 40px;
}

/* Caja de comentarios plegable. */
.comments-box {
  margin: 0;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

/* Cabecera clickeable de comentarios. */
.comments-header {
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

/* Titulo de comentarios. */
.comments-header h3 {
  margin: 0;
  color: #ff2e63;
}

/* Contenido expandible de comentarios. */
.comments-content {
  padding: 0 18px 18px;
}

/* Tarjeta de comentario individual. */
.comment-card {
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 14px;
  padding: 15px;
  margin-top: 12px;
}

/* Cabecera interna del comentario. */
.comment-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* Titulo del comentario. */
.comment-top h4 {
  margin: 0;
}

/* Colorea las estrellas. */
.stars {
  color: #ffd54a;
}

/* Estado vacio de comentarios. */
.empty-comments {
  text-align: center;
  color: #888;
  padding: 20px 0;
}

/* Animacion de entrada y salida. */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

/* Estado inicial y final de la animacion. */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
