<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general del perfil. -->
      <div class="page">
        <div class="container">
          <!-- Tarjeta del usuario actual. -->
          <ProfileCard :user="user" />

          <!-- Acciones disponibles sobre el perfil. -->
          <div class="actions">
            <BaseButton @click="irEditar">Editar perfil</BaseButton>

            <button class="logout-btn" @click="logout">Cerrar sesion</button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones base de la vista de perfil.
import { useRouter } from "vue-router";
import ProfileCard from "@/components/users/ProfileCard.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useUserStore } from "@/stores/UserStore";

// Store y router para acciones del perfil.
const userStore = useUserStore();
const router = useRouter();

// Usuario actual mostrado en la tarjeta.
const user = userStore.user;

// Navega a la pantalla de edicion.
const irEditar = () => {
  router.push("/edit-profile");
};

// Cierra sesion y vuelve al login.
const logout = () => {
  userStore.logout();
  router.replace("/login");
};
</script>

<style scoped>
/* Fondo principal de la pantalla. */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

/* Contenedor con espaciado interno. */
.container {
  padding: 20px;
  padding-top: 20px;
}

/* Zona de botones del perfil. */
.actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Boton de cerrar sesion. */
.logout-btn {
  background: transparent;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  padding: 14px;
  border-radius: 14px;
  font-weight: bold;
}
</style>
