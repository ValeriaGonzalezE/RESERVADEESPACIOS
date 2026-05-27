<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import SpaceForm from "@/components/espacios/SpaceForm.vue";

const route = useRoute();
const router = useRouter();

const espacio = ref({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "no",
  precio: "0",
  estado: "activo"
});

const tipos = ref([]);

onMounted(async () => {
  const [espacioRes, tiposRes] = await Promise.all([
    api.get(`/espacios/${route.params.id}`),
    api.get("/espacios/tipos")
  ]);

  espacio.value = {
    ...espacio.value,
    ...espacioRes.data,
    tipo_id: String(espacioRes.data.tipo_id || ""),
    capacidad: String(espacioRes.data.capacidad || ""),
    precio: String(espacioRes.data.precio || "0")
  };
  tipos.value = tiposRes.data;
});

const guardar = async () => {
  if (!espacio.value.nombre?.trim()) {
    return alert("Ingresa el nombre del espacio");
  }

  if (!espacio.value.ubicacion?.trim()) {
    return alert("Ingresa la ubicacion");
  }

  if (!espacio.value.capacidad || Number(espacio.value.capacidad) <= 0) {
    return alert("La capacidad debe ser mayor a 0");
  }

  await api.put(`/espacios/${route.params.id}`, espacio.value);
  alert("Espacio actualizado");
};

const eliminar = async () => {
  if (!confirm("Eliminar espacio?")) {
    return;
  }

  await api.delete(`/espacios/${route.params.id}`);
  router.push("/my-spaces");
};

const toggleEstado = async () => {
  espacio.value.estado = espacio.value.estado === "activo" ? "inactivo" : "activo";
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
            <SpaceForm :espacio="espacio" :tipos="tipos" @guardar="guardar" />

            <BaseButton variant="secondary" @click="toggleEstado">
              {{ espacio.estado === "activo" ? "Inhabilitar espacio" : "Activar espacio" }}
            </BaseButton>

            <p class="delete-text" @click="eliminar">Eliminar espacio</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
}

.container {
  padding: 20px;
}

.form-box {
  width: 100%;
  max-width: 1500px;
  margin: auto;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 24px;
  padding: 28px;
}

.delete-text {
  margin-top: 16px;
  text-align: center;
  color: #ff4d4d;
  font-weight: bold;
  cursor: pointer;
}
</style>
