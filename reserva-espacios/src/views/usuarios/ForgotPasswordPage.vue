<template>
    <ion-content>

      <AuthLayout>

        <template #left>
          RECUPERAR
        </template>

        <h2>Recuperar contraseña</h2>

        <AuthForm :fields="[
          { model: 'email', label: 'escribe tu correo', placeholder: 'Correo electrónico' }
        ]" buttonText="Enviar" @submit="send" />
        <br>
        <router-link to="/login">Volver al login</router-link>

      </AuthLayout>
    </ion-content>
</template>

<script setup>
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";

const send = async (form) => {
  const res = await api.post("/forgot-password", form);
  alert(res.data.message);
};
</script>
