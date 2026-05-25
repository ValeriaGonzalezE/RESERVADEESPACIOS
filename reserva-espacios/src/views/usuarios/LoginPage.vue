<template>
  <ion-page>
    <ion-content>

      <AuthLayout>

        <template #left>
          BIENVENIDO
        </template>

        <h2>Iniciar Sesión</h2>
        <br>

        <AuthForm :fields="[
          {
            model: 'codigo',
            label: 'Usuario (Correo)',
            placeholder: 'ejemplo@gmail.com'
          },
          {
            model: 'password',
            label: 'Contraseña',
            type: 'password',
            placeholder: 'Ingresa tu contraseña'
          }
        ]" buttonText="Iniciar Sesión" @submit="login" />
        <div class="links">
          <router-link to="/register"> Crear cuenta</router-link>
        </div>

      </AuthLayout>
    </ion-content>
  </ion-page>
</template>

<script setup>
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { IonPage, IonContent } from '@ionic/vue';

const router = useRouter();
const userStore = useUserStore();

// Autentica al usuario, guarda la sesion y redirige al inicio si todo sale bien.
const login = async (form) => {
  const res = await api.post("/login", form);

  if (res.data.success) {
    userStore.setUser(res.data.user, res.data.token);
    router.push("/home");
  } else {
    alert("Credenciales incorrectas");
  }
};
</script>
