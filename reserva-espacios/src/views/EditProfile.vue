<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general de la edicion de perfil. -->
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <!-- Formulario de perfil aislado en su propio componente. -->
          <ProfileForm
            :user="user"
            :fields="fields"
            :errors="errors"
            @update="syncForm"
            @submit="guardar"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones de la vista de edicion de perfil.
import { reactive } from "vue";
import ProfileForm from "@/components/users/ProfileForm.vue";
import BackButton from "@/components/ui/BackButton.vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";
import { isEmailValid, normalizeEmail } from "@/utils/formUtils";

// Store del usuario actual.
const userStore = useUserStore();
const user = userStore.user;

// Estado editable que usa la vista para validar como en login y registro.
const form = reactive({
  ...user,
  password: "",
  fotoFile: null
});

// Campos del formulario. Para agregar un input nuevo, se agrega aqui y luego en errors/guardar.
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
  },
];

// Errores visibles dentro del mismo formulario.
const errors = reactive({
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
  foto: "",
});

const syncForm = (values) => {
  Object.assign(form, values);
};

const validarPerfil = (payload) => {
  errors.nombre = payload.nombre?.trim() ? "" : "El nombre es obligatorio";
  errors.email = payload.email?.trim() ? "" : "El correo es obligatorio";

  if (!errors.email && !isEmailValid(payload.email)) {
    errors.email = "Ingresa un correo valido";
  }

  errors.password = payload.password && payload.password.length < 8
    ? "La contrasena debe tener minimo 8 caracteres"
    : "";

  return !errors.nombre && !errors.email && !errors.password;
};

// Envia el perfil al backend y sincroniza el store local.
const guardar = async (payload) => {
  Object.assign(form, payload);

  if (!validarPerfil(form)) {
    return;
  }

  const formData = new FormData();

  formData.append("nombre", form.nombre || "");
  formData.append("apellido", form.apellido || "");
  formData.append("email", normalizeEmail(form.email || ""));
  formData.append("telefono", form.telefono || "");
  formData.append("password", form.password || "");

  if (form.fotoFile) {
    formData.append("foto", form.fotoFile);
  } else {
    formData.append("foto", form.foto || "");
  }

  try {
    const res = await api.put(`/usuarios/${user.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (res.data.success) {
      if (res.data.foto) {
        userStore.user.foto = res.data.foto;
      }

      userStore.user.nombre = formData.get("nombre");
      userStore.user.apellido = formData.get("apellido");
      userStore.user.email = formData.get("email");
      userStore.user.telefono = formData.get("telefono");

      localStorage.setItem("user", JSON.stringify(userStore.user));
      alert("Perfil actualizado");
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error al actualizar");
  }
};
</script>

<style scoped>
/* Fondo general del perfil. */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
  width: 100%;
}

/* Posicion del boton de regreso. */
.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}

/* Espaciado del contenedor principal. */
.container {
  padding: 20px;
  padding-top: 20px;
  width: 100%;
}
</style>
