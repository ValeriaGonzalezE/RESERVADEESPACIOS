<template>
  <ion-page>
    <ion-content>
      <!-- Fondo general de la edicion de perfil. -->
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <!-- Formulario de perfil aislado en su propio componente. -->
          <ProfileForm :user="user" @submit="guardar" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones de la vista de edicion de perfil.
import ProfileForm from "@/components/users/ProfileForm.vue";
import BackButton from "@/components/ui/BackButton.vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";

// Store del usuario actual.
const userStore = useUserStore();
const user = userStore.user;

// Envia el perfil al backend y sincroniza el store local.
const guardar = async (formData) => {
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
}
</style>
