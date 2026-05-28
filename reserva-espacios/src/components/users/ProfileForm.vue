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
import { isEmailValid, normalizeEmail } from "@/utils/formUtils";

// Usuario actual recibido desde la vista.
const props = defineProps({
  user: Object
});

// Evento que sube el FormData listo para enviar.
const emit = defineEmits(["submit"]);

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

// Errores simples para hacer mas clara la validacion del frontend.
const errors = reactive({
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
  foto: ""
});

// Configuracion de los campos que renderiza AuthForm.
const fields = [
  { model: "nombre", label: "Nombre", placeholder: "Ingresa tu nombre" },
  { model: "apellido", label: "Apellido", placeholder: "Ingresa tu apellido" },
  { model: "email", label: "Email", placeholder: "ejemplo@gmail.com", autoEmail: true },
  { model: "telefono", label: "Telefono", type: "tel", placeholder: "3001234567" },
  {
    model: "password",
    label: "Nueva contrasena",
    type: "password",
    placeholder: "Opcional"
  }
];

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
};

// Valida campos al salir de cada input para darle feedback rapido al usuario.
const handleBlur = ({ field, form: currentForm }) => {
  if (field.model === "email") {
    form.email = normalizeEmail(currentForm.email);
  }
};

// Valida el formulario antes de crear el FormData final.
const validar = () => {
  errors.nombre = form.nombre?.trim() ? "" : "El nombre es obligatorio";
  errors.email = form.email?.trim() ? "" : "El correo es obligatorio";

  if (!errors.email && !isEmailValid(form.email)) {
    errors.email = "Ingresa un correo valido";
  }

  if (form.password && form.password.length < 8) {
    errors.password = "La contrasena debe tener minimo 8 caracteres";
  } else {
    errors.password = "";
  }

  return !errors.nombre && !errors.email && !errors.password;
};

// Empaqueta los datos del perfil para mantener el upload actual.
const guardar = () => {
  if (!validar()) {
    return;
  }

  const data = new FormData();

  data.append("nombre", form.nombre || "");
  data.append("apellido", form.apellido || "");
  data.append("email", normalizeEmail(form.email || ""));
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
/* Caja principal del formulario de perfil. */
.form-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
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
