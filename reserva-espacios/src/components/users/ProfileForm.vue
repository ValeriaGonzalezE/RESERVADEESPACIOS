<template>

  <div class="form-box">

    <!-- FOTO -->
    <div class="photo-section">

      <img :src="preview || form.foto || defaultImg" class="avatar" />

      <!-- SUBIR ARCHIVO -->
      <input type="file" accept="image/*" @change="seleccionarFoto" />

      <p class="or">o</p>
      URL
      <!-- URL -->
      <BaseInput v-model="form.foto" placeholder="URL de imagen" />
      
    </div>

    <label>Nombre</label>
    <BaseInput v-model="form.nombre" />

    <label>Apellido</label>
    <BaseInput v-model="form.apellido" />

    <label>Email</label>
    <BaseInput v-model="form.email" />

    <label>Teléfono</label>
    <BaseInput v-model="form.telefono" />

    <label>Nueva contraseña</label>

    <BaseInput type="password" v-model="form.password" placeholder="Opcional" />

    <BaseButton @click="guardar">
      Guardar cambios
    </BaseButton>

  </div>

</template>

<script setup>
import { reactive, ref, watch } from "vue";

import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps({
  user: Object
});

const emit = defineEmits(["submit"]);

const defaultImg =
  "https://cdn-icons-png.flaticon.com/128/13464/13464146.png";

const preview = ref("");

// Crea una copia editable del usuario y separa la foto temporal de la contrasena nueva.
const form = reactive({
  ...props.user,
  password: "",
  fotoFile: null
});

// Si el usuario escribe una URL de imagen, la muestra de inmediato en la preview.
watch(() => form.foto, (val) => {
  if (val && !form.fotoFile) {
    preview.value = val;
  }
});

// Guarda el archivo seleccionado y genera una vista previa local.
const seleccionarFoto = (e) => {

  const file = e.target.files[0];
  if (!file) return;
  form.fotoFile = file;
  preview.value =
    URL.createObjectURL(file);

};

// Empaqueta texto e imagen en FormData antes de emitir el envio al padre.
const guardar = () => {

  const data = new FormData();

  data.append("nombre", form.nombre);
  data.append("apellido", form.apellido);
  data.append("email", form.email);
  data.append("telefono", form.telefono);
  data.append("password", form.password);

  // si seleccionó archivo
  if (form.fotoFile) {
    data.append("foto", form.fotoFile);
  } else {
    // si usa URL
    data.append("foto", form.foto || "");
  }
  emit("submit", data);
};
</script>

<style scoped>
.form-box {
  background:
    rgba(255, 255, 255, 0.04);
  border:
    1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.avatar {
  width: 115px;
  height: 115px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff2e63;
}

.or {
  color: #888;
  margin: 0;
}

label {
  color: #ff2e63;
  font-weight: bold;
}
</style>
