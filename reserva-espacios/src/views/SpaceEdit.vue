<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import api from "@/services/api";

import BackButton from "@/components/ui/BackButton.vue";

const route = useRoute();
const router = useRouter();

const espacio = ref({});
const tipos = ref([]);

onMounted(async () => {

  const res =
    await api.get(`/espacios/${route.params.id}`);

  espacio.value = res.data;

  const tiposRes =
    await api.get("/espacios/tipos");

  tipos.value = tiposRes.data;

});

// guardar
const guardar = async () => {

  await api.put(
    `/espacios/${route.params.id}`,
    espacio.value
  );

  alert("Espacio actualizado");

};

// eliminar
const eliminar = async () => {

  if (!confirm("¿Eliminar espacio?")) return;

  await api.delete(
    `/espacios/${route.params.id}`
  );

  router.push("/my-spaces");

};

// activar/inactivar
const toggleEstado = async () => {

  espacio.value.estado =
    espacio.value.estado === "activo"
      ? "inactivo"
      : "activo";

  await guardar();

};
</script>

<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <BackButton class="back-floating" />

        <div class="container">

          <div class="form-box">

            <label>Nombre</label>
            <input v-model="espacio.nombre" />

            <label>Descripción</label>
            <textarea v-model="espacio.descripcion"></textarea>

            <label>Ubicación</label>
            <input v-model="espacio.ubicacion" />

            <label>Capacidad</label>
            <input
              type="number"
              v-model="espacio.capacidad"
            />

            <label>Tipo</label>

            <select v-model="espacio.tipo_id">

              <option
                v-for="t in tipos"
                :key="t.id"
                :value="t.id"
              >
                {{ t.nombre }}
              </option>

            </select>

            <label>Precio</label>

            <input
              type="number"
              v-model="espacio.precio"
            />

            <button
              class="save-btn"
              @click="guardar"
            >
              Guardar cambios
            </button>

            <button
              class="state-btn"
              @click="toggleEstado"
            >
              {{
                espacio.estado === "activo"
                  ? "Inhabilitar espacio"
                  : "Activar espacio"
              }}
            </button>

            <p
              class="delete-text"
              @click="eliminar"
            >
              Eliminar espacio
            </p>

          </div>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style scoped>

.page {
  min-height: 100vh;
  background:
    linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
}

.container {
  padding: 20px;
  padding-top: 20px;
}

.form-box {
  width: 100%;
  max-width: 1500px;
  margin: auto;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  color: #ff2e63;
  font-weight: bold;
}

input,
textarea,
select {
  background: #111;
  border: 1px solid #333;
  color: white;
  padding: 12px;
  border-radius: 12px;
}

textarea {
  min-height: 100px;
}

.save-btn {
  margin-top: 10px;
  background: #ff2e63;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: bold;
  cursor: pointer;
}

.state-btn {
  background: #2c2c2c;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  cursor: pointer;
}

.delete-text {
  margin-top: 10px;
  text-align: center;
  color: #ff4d4d;
  font-weight: bold;
  cursor: pointer;
}

</style>