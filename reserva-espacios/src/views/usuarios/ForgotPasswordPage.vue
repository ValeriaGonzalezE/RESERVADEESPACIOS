<template>
  <ion-content>
    <!-- Layout comun de autenticacion. -->
    <AuthLayout>
      <!-- Lado izquierdo del layout. -->
      <template #left>
        RECUPERAR
      </template>

      <!-- Titulo principal de la vista. -->
      <h2>Recuperar contrasena</h2>

      <!-- Formulario minimo construido desde la misma base compartida. -->
      <AuthForm
        :fields="fields"
        :external-errors="errors"
        button-text="Enviar"
        @submit="send"
      />

      <br>
      <router-link to="/login">Volver al login</router-link>
    </AuthLayout>
  </ion-content>
</template>

<script setup>
// Importaciones base de la vista.
import { reactive } from "vue";
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { isEmailValid, normalizeEmail } from "@/utils/formUtils";

// Campo declarativo del formulario.
const fields = [
  {
    model: "email",
    label: "Escribe tu correo",
    placeholder: "Correo electronico",
    autoEmail: true
  }
];

// Errores asociados al campo de correo.
const errors = reactive({
  email: ""
});

// Valida y envia la solicitud de recuperacion.
const send = async (form) => {
  const payload = {
    ...form,
    email: normalizeEmail(form.email)
  };

  errors.email = payload.email?.trim() ? "" : "El correo es obligatorio";

  if (!errors.email && !isEmailValid(payload.email)) {
    errors.email = "Ingresa un correo valido";
  }

  if (errors.email) {
    return;
  }

  const res = await api.post("/forgot-password", payload);
  alert(res.data.message);
};
</script>
