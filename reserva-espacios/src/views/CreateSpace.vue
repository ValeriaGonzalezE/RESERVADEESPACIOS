<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import SpaceForm from "@/components/espacios/SpaceForm.vue";

const router = useRouter();

const espacio = ref({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "",
  precio: "0"
});

const tipos = ref([]);
const fotos = ref([]);
const previews = ref([]);

onMounted(async () => {
  const res = await api.get("/espacios/tipos");
  tipos.value = res.data;
});

const crear = async () => {
  if (!espacio.value.nombre?.trim()) {
    return alert("Ingresa el nombre del espacio");
  }

  if (!espacio.value.tipo_id) {
    return alert("Selecciona el tipo de espacio");
  }

  if (!espacio.value.capacidad || Number(espacio.value.capacidad) <= 0) {
    return alert("La capacidad debe ser mayor a 0");
  }

  if (!espacio.value.ubicacion?.trim()) {
    return alert("Ingresa la ubicacion");
  }

  if (espacio.value.requiere_pago === "si" && Number(espacio.value.precio) < 0) {
    return alert("El precio no puede ser negativo");
  }

  const formData = new FormData();

  Object.entries(espacio.value).forEach(([key, value]) => {
    formData.append(key, value || "");
  });

  fotos.value.forEach((foto) => {
    formData.append("fotos", foto);
  });

  await api.post("/espacios", formData);
  alert("Espacio creado");
  router.push("/my-spaces");
};

const onFileChange = (event) => {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    const exists = fotos.value.some((item) => item.name === file.name);

    if (!exists && fotos.value.length < 5) {
      fotos.value.push(file);
      previews.value.push(URL.createObjectURL(file));
    }
  });

  event.target.value = "";
};

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
            <label>Fotos (max 5)</label>
            <input type="file" multiple @change="onFileChange" />

            <div class="preview">
              <div v-for="(img, index) in previews" :key="index" class="img-box">
                <img :src="img" />
                <button @click="eliminarFoto(index)">x</button>
              </div>
            </div>
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

.container {
  margin-top: 20px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 99, 0.2);
}

.upload {
  margin: 20px 0;
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
