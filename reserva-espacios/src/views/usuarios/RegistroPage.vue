<template>
  <ion-content>
    <!-- Layout principal compartido por las pantallas de autenticacion. -->
    <AuthLayout>
      <!-- Columna visual izquierda. -->
      <template #left>
        REGISTRATE
      </template>

      <!-- Encabezado y contexto de la pantalla. -->
      <h2 class="layout">Crear Cuenta</h2>
      <p class="subtitle">Completa la informacion para crear tu cuenta</p>

      <!-- Formulario configurado por campos para mantener una estructura uniforme. -->
      <AuthForm
        :fields="fields"
        :external-errors="errors"
        button-text="Crear Cuenta"
        @submit="register"
      />

      <!-- Enlace de regreso al login. -->
      <div class="links">
        <router-link to="/login">Ya tienes cuenta? Inicia sesion</router-link>
      </div>
    </AuthLayout>
  </ion-content>
</template>

<script setup>
// Importaciones principales de la vista.
import { reactive } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { isEmailValid, normalizeEmail } from "@/utils/formUtils";

// Router para redirigir al usuario tras completar el registro.
// const fecha = new Date(form.fecha);
const router = useRouter();

// Estructura declarativa del formulario.
const fields = [
  { 
    model: "nombre", 
    label: "Nombre", 
    placeholder: "" 
  },
  { 
    model: "apellido", 
    label: "Apellido", 
    placeholder: "" 
  },
  {
    model: "email",
    label: "Correo electronico",
    placeholder: "ejemplo@gmail.com",
    autoEmail: true
  },
  {
    model: "telefono",
    label: "Numero de celular",
    type: "tel",
    placeholder: ""
  },
  {
    model: "password",
    label: "Contrasena",
    type: "password",
    placeholder: "Minimo 8 caracteres"
  },
  {
    model: "confirmPassword",
    label: "Confirmar contrasena",
    type: "password",
    placeholder: "Repite tu contrasena"
  },
];

// Mapa simple de errores por campo.
const errors = reactive({
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  password: "",
  confirmPassword: "",
});

// Ejecuta validaciones simples y registra al usuario.
const register = async (form) => {
  const payload = {
    ...form,
    email: normalizeEmail(form.email)
  };

  errors.nombre = payload.nombre?.trim() ? "" : "El nombre es obligatorio";
  errors.email = payload.email?.trim() ? "" : "El correo es obligatorio";
  errors.password = payload.password?.length >= 8 ? "" : "La contrasena debe tener minimo 8 caracteres";
  errors.confirmPassword = payload.password === payload.confirmPassword ? "" : "Las contrasenas no coinciden";

  if (!errors.email && !isEmailValid(payload.email)) {
    errors.email = "Ingresa un correo valido";
  }

  if (errors.nombre || errors.email || errors.password || errors.confirmPassword) {
    return;
  }

  try {
    const res = await api.post("/register", payload);

    if (res.data.success) {
      alert("Cuenta creada correctamente");
      router.push("/");
      return;
    }

    alert(res.data.message || "No se pudo crear la cuenta");
  } catch (error) {
    alert(error.response?.data?.message || "Ocurrio un error");
  }
};
</script>

<style scoped>
/* Ajuste visual del titulo dentro del layout actual. */
.layout {
  padding: 400px 30px 30px 20px;
}

/* Texto secundario debajo del titulo. */
.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

/* Contenedor del enlace de ayuda. */
.links {
  margin-top: 20px;
  text-align: center;
}

/* Estilo del enlace hacia login. */
.links a {
  color: var(--ion-color-primary);
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 767px) {
  .layout{
    padding: 250px 50px 10px 5px;
  }
}
</style>
