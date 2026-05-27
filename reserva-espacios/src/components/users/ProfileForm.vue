<template>
  <form class="form-box" @submit.prevent="guardar">
    <div class="photo-section">
      <img :src="preview || form.foto || defaultImg" class="avatar" />

      <input type="file" accept="image/*" @change="seleccionarFoto" />

      <p class="or">o</p>

      <BaseInput
        v-model="form.foto"
        label="URL de imagen"
        placeholder="https://..."
      />
    </div>

    <BaseInput v-model="form.nombre" label="Nombre" />
    <BaseInput v-model="form.apellido" label="Apellido" />
    <BaseInput v-model="form.email" label="Email" />
    <BaseInput v-model="form.telefono" label="Telefono" />
    <BaseInput
      type="password"
      v-model="form.password"
      label="Nueva contrasena"
      placeholder="Opcional"
    />

    <BaseButton type="submit">
      Guardar cambios
    </BaseButton>
  </form>
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

const form = reactive({
  ...props.user,
  password: "",
  fotoFile: null
});

watch(() => form.foto, (value) => {
  if (value && !form.fotoFile) {
    preview.value = value;
  }
});

const seleccionarFoto = (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  form.fotoFile = file;
  preview.value = URL.createObjectURL(file);
};

const guardar = () => {
  const data = new FormData();

  data.append("nombre", form.nombre || "");
  data.append("apellido", form.apellido || "");
  data.append("email", form.email || "");
  data.append("telefono", form.telefono || "");
  data.append("password", form.password || "");

  if (form.fotoFile) {
    data.append("foto", form.fotoFile);
  } else {
    data.append("foto", form.foto || "");
  }

  emit("submit", data);
};
</script>

<style scoped>
.form-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
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
</style>
