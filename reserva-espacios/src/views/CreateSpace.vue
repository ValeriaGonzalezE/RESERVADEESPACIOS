<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";

import SpaceForm from "@/components/espacios/SpaceForm.vue";

const userStore = useUserStore();

const espacio = ref({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "",
  precio: 0
});

const tipos = ref([]);

// Carga los tipos de espacio que alimentan el formulario de creacion.
onMounted(async () => {
  const res = await api.get("/espacios/tipos");
  console.log("TIPOS RESPONSE:", res);
  console.log("TIPOS DATA:", res.data);
  tipos.value = res.data;
});

// Empaqueta datos e imagenes en FormData para crear el espacio.
const crear = async () => {

  console.log("CREAR EJECUTADO");

  const formData = new FormData();

  Object.keys(espacio.value).forEach(key => {
    formData.append(key, espacio.value[key]);
  });

  formData.append("usuario_id", userStore.user.id);

  fotos.value.forEach(f => {
    formData.append("fotos", f);
  });

  await api.post("/espacios", formData);

  alert("Espacio creado");
};

const fotos = ref([]);
const previews = ref([]);

// Agrega imagenes sin repetirlas y crea previews antes del envio.
const onFileChange = (e) => {
  const files = Array.from(e.target.files);

  files.forEach(file => {
    // evita duplicados por nombre
    const yaExiste = fotos.value.some(f => f.name === file.name);

    if (!yaExiste && fotos.value.length < 5) {
      fotos.value.push(file);
      previews.value.push(URL.createObjectURL(file));
    }
  });

  e.target.value = ""; // permite volver a seleccionar el mismo archivo
};

// Elimina una foto seleccionada tanto del arreglo como de la vista previa.
const eliminarFoto = (index) => {
  fotos.value.splice(index, 1);
  previews.value.splice(index, 1);
};
</script>

<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <div class="container">

          <h2>Crear Espacio</h2>

          <div class="upload">
            <br>
            <label>Fotos (máx 5)</label>

            <input type="file" multiple @change="onFileChange" />

            <div class="preview">

              <div v-for="(img, i) in previews" :key="i" class="img-box">

                <img :src="img" />

                <button @click="eliminarFoto(i)">✕</button>

              </div>

            </div>
            <br>
          </div>
          <SpaceForm :espacio="espacio" :tipos="tipos" @guardar="crear" />
        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<style>
.page {
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at top, #1a0005, #0f0f0f);
  color: white;
}

.form-container {
  margin-top: 40px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 99, 0.2);
}

.upload {
  margin-top: 20px;
}

.preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.img-box {
  position: relative;
}

.img-box img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

.img-box button {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
}
</style>
