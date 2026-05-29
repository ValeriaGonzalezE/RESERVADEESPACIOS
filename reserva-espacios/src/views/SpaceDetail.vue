<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";
import AuthForm from "@/components/users/AuthForm.vue";

const route = useRoute();
const router = useRouter();

const espacio = ref(null);
const comentarios = ref([]);

const form = reactive({
  comentario: ""
});

// Campos del formulario. Para agregar un input nuevo, se agrega aqui y luego en errors/enviarComentario.
const fields = [
  {
    model: "comentario",
    label: "Comentario",
    type: "textarea",
    placeholder: "Escribe tu comentario..."
  }
];

// Errores visibles dentro del mismo formulario.
const errors = reactive({
  comentario: ""
});

const estrellas = ref(0);
const hover = ref(0);

// CARGAR ESPACIO

onMounted(async () => {
  const res = await api.get(`/espacios/${route.params.id}`);
  console.log("ESPACIO:", res.data);
  espacio.value = res.data;

  console.log("ESPACIO:", espacio.value);

  cargarComentarios();
});

// MAPA (FUNCIONA CON TODO)

const mapaUrl = computed(() => {
  if (!espacio.value?.ubicacion) return "";

  const u = espacio.value.ubicacion.trim();

  // Si es un link
  if (u.startsWith("http")) {
    try {
      const url = new URL(u);

      // Caso: tiene coordenadas en el link
      const coordsMatch = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (coordsMatch) {
        const lat = coordsMatch[1];
        const lng = coordsMatch[2];
        return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
      }

      // Caso fallback: usar todo como búsqueda
      return `https://www.google.com/maps?q=${encodeURIComponent(u)}&output=embed`;

    } catch {
      return `https://www.google.com/maps?q=${encodeURIComponent(u)}&output=embed`;
    }
  }

  // Si es texto normal
  return `https://www.google.com/maps?q=${encodeURIComponent(u)}&output=embed`;
});

// RESERVAR

const reservar = () => {
  router.push(`/create?espacio=${espacio.value.id}`);
};

// GALERÍA

const current = ref(0);

const next = () => {
  current.value = (current.value + 1) % espacio.value.fotos.length;
};

const prev = () => {
  current.value =
    (current.value - 1 + espacio.value.fotos.length) %
    espacio.value.fotos.length;
};

// COMENTARIOS

const cargarComentarios = async () => {
  const res = await api.get(`/espacios/comentarios/${route.params.id}`);
  comentarios.value = res.data;
};

const syncForm = (values) => {
  Object.assign(form, values);
};

const enviarComentario = async (payload) => {
  Object.assign(form, payload);

  errors.comentario = form.comentario?.trim() ? "" : "El comentario es obligatorio";

  if (errors.comentario) {
    return;
  }

  if (!estrellas.value) return alert("Selecciona estrellas");

  await api.post("/espacios/comentarios", {
    espacio_id: espacio.value.id,
    usuario_id: 1,
    comentario: form.comentario,
    estrellas: estrellas.value
  });

  form.comentario = "";
  estrellas.value = 0;

  cargarComentarios();
};

// PROMEDIO

const promedio = computed(() => {
  if (!comentarios.value.length) return null;

  const total = comentarios.value.reduce((sum, c) => sum + c.estrellas, 0);
  return (total / comentarios.value.length).toFixed(1);
});

// DISTRIBUCIÓN

const distribucion = computed(() => {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  comentarios.value.forEach(c => {
    dist[c.estrellas]++;
  });

  return dist;
});
</script>

<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <BackButton class="back-floating" />

        <!-- TOP -->
        <div class="layout">

          <!-- INFO -->
          <div class="info-card">
            <h1>{{ espacio?.nombre }}</h1>

            <div class="info">
              <p>📍 {{ espacio?.ubicacion }}</p>
              <p>🏷 {{ espacio?.tipo }}</p>
              <p>👥 {{ espacio?.capacidad }} personas</p>

              <p>
                💰
                <span v-if="espacio?.requiere_pago === 'si'">
                  ${{ espacio?.precio }}
                </span>
                <span v-else>Gratis</span>
              </p>
            </div>
          </div>

          <!-- MAPA -->
          <div class="map-container">
            <iframe v-if="mapaUrl" :src="mapaUrl" width="100%" height="300" style="border:0;" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade" allowfullscreen>
            </iframe>
          </div>

        </div>

        <!-- GALERÍA -->
        <div v-if="espacio?.fotos?.length" class="carousel">

          <button v-if="espacio.fotos.length > 1" @click="prev">‹</button>

          <img :src="espacio.fotos[current]" />
          
          <button v-if="espacio.fotos.length > 1" @click="next">›</button>

        </div>

        <!-- BOTÓN -->
        <button class="btn-reservar" @click="reservar">
          Reservar espacio
        </button>

        <!-- RATING -->
        <div class="rating">

          <h2 v-if="promedio">★ {{ promedio }} / 5</h2>
          <h2 v-else class="sin-opiniones">Sin calificaciones</h2>

          <p>{{ comentarios.length }} opiniones</p>

          <div v-for="n in 5" :key="n" class="bar">

            <span>{{ 6 - n }} ★</span>

            <div class="progress">
              <div class="fill" :style="{
                width: comentarios.length
                  ? ((distribucion[6 - n] / comentarios.length) * 100) + '%'
                  : '0%',
                background: comentarios.length ? '#ff2e63' : '#555'
              }"></div>
            </div>

            <span>{{ distribucion[6 - n] }}</span>

          </div>

        </div>

        <!-- COMENTARIOS -->
        <div class="comentarios">

          <h3>Califica este espacio</h3>

          <!-- ESTRELLAS -->
          <div class="stars">
            <span v-for="n in 5" :key="n" @click="estrellas = n" @mouseover="hover = n" @mouseleave="hover = 0"
              :class="{ active: n <= (hover || estrellas) }">
              ★
            </span>
          </div>

          <AuthForm
            :fields="fields"
            :initial-values="form"
            :external-errors="errors"
            button-text="Enviar"
            @update="syncForm"
            @submit="enviarComentario"
          />

          <h3>Opiniones</h3>

          <div v-for="c in comentarios" :key="c.id" class="comentario">
            <strong>{{ c.nombre }}</strong>

            <div>
              <span v-for="i in c.estrellas" :key="i">★</span>
            </div>

            <p>{{ c.comentario }}</p>
          </div>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #0f0f0f 60%, #1a0005 100%);
  color: white;
}

.layout {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.info-card {
  flex: 0 0 40%;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 46, 99, 0.2);
}

.map-container {
  flex: 0 0 60%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
}

.map-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.carousel {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.carousel img {
  width: 60%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.btn-reservar {
  width: 100%;
  margin-top: 25px;
  padding: 15px;
  border-radius: 10px;
  background: linear-gradient(90deg, #ff2e63, #ff5f7e);
  color: white;
  border: none;
}

.rating {
  margin-top: 40px;
}

.bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  flex: 1;
  height: 8px;
  background: #333;
  border-radius: 5px;
}

.fill {
  height: 100%;
  border-radius: 5px;
}

.sin-opiniones {
  color: #888;
}

.stars span {
  font-size: 30px;
  cursor: pointer;
  color: #555;
}

.stars span.active {
  color: gold;
  transform: scale(1.2);
}

.comentario {
  margin-top: 15px;
  padding: 10px;
  background: #1e1e1e;
  border-radius: 10px;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
}
</style>
