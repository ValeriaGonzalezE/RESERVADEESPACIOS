<template>
  <!-- Formulario de perfil con preview de foto y campos reutilizables. -->
  <div class="form-box">
    <!-- Campos principales del perfil usando la misma estructura declarativa del proyecto. -->
    <AuthForm
      :fields="fields"
      :initial-values="form"
      :external-errors="errors"
      button-text="Guardar cambios"
      @update="syncForm"
      @blur="handleBlur"
      @submit="guardar"
    >
      <template #default>
        <!-- Seccion dedicada a la imagen del perfil. -->
        <div class="photo-section">
          <img :src="preview || form.foto || defaultImg" class="avatar" />

          <input type="file" accept="image/*" @change="seleccionarFoto" />

          <p class="or">o</p>

          <BaseInput
            v-model="form.foto"
            label="URL de imagen"
            placeholder="https://..."
            :error="errors.foto"
          />
        </div>
      </template>
    </AuthForm>
  </div>
</template>

<script setup>
// Este componente encapsula todo el flujo de edicion del perfil.
import { reactive, ref, watch } from "vue";
import AuthForm from "./AuthForm.vue";
import BaseInput from "../ui/BaseInput.vue";
import { normalizeEmail } from "@/utils/formUtils";

// Usuario actual recibido desde la vista.
const props = defineProps({
  user: Object,
  fields: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

// Evento que sube el FormData listo para enviar.
const emit = defineEmits(["submit", "update"]);

// Imagen de respaldo para usuarios sin foto.
const defaultImg =
  "https://cdn-icons-png.flaticon.com/128/13464/13464146.png";

// Preview temporal para archivo local.
const preview = ref("");

// Estado editable del perfil.
const form = reactive({
  ...props.user,
  password: "",
  fotoFile: null
});

// Cuando cambia la URL de foto se mantiene el preview visible.
watch(() => form.foto, (value) => {
  if (value && !form.fotoFile) {
    preview.value = value;
  }
});

// Carga la imagen seleccionada desde el dispositivo.
const seleccionarFoto = (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  form.fotoFile = file;
  preview.value = URL.createObjectURL(file);
};

// Sincroniza cambios emitidos desde AuthForm.
const syncForm = (values) => {
  Object.assign(form, values);
  emit("update", { ...form });
};

// Valida campos al salir de cada input para darle feedback rapido al usuario.
const handleBlur = ({ field, form: currentForm }) => {
  if (field.model === "email") {
    form.email = normalizeEmail(currentForm.email);
  }
};

// Entrega el estado editable para que la vista valide como en login y registro.
const guardar = () => {
  emit("submit", { ...form });
};
</script>

<style scoped>
/* Caja principal del formulario de perfil. */
.form-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

/* Zona visual de la foto, input de archivo y url externa. */
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

/* Avatar redondo con borde en color principal. */
.avatar {
  width: 115px;
  height: 115px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ff2e63;
}

/* Separador entre archivo local y url remota. */
.or {
  color: #888;
  margin: 0;
}
</style>
