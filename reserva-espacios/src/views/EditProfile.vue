<template>
  <ion-page>
    <ion-content>

      <div class="page">

        <BackButton class="back-floating" />

        <div class="container">

          <ProfileForm :user="user" @submit="guardar" />

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import ProfileForm from "@/components/users/ProfileForm.vue";

import BackButton from "@/components/ui/BackButton.vue";

import api from "@/services/api";

import { useUserStore } from "@/stores/UserStore";

const userStore = useUserStore();

const user = userStore.user;

// Envia el perfil al backend y sincroniza los cambios en el store y localStorage.
const guardar = async (formData) => {

  try {

    const res = await api.put(

      `/usuarios/${user.id}`,

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data"
        }
      }

    );

    if (res.data.success) {

      // actualizar foto
      if (res.data.foto) {

        userStore.user.foto =
          res.data.foto;

      }

      // actualizar demás datos
      userStore.user.nombre =
        formData.get("nombre");

      userStore.user.apellido =
        formData.get("apellido");

      userStore.user.email =
        formData.get("email");

      userStore.user.telefono =
        formData.get("telefono");

      // guardar localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(userStore.user)
      );

      alert("Perfil actualizado");

    }

  } catch (err) {

    console.error(err);

    alert("Error al actualizar");

  }

};
</script>

<style scoped>
.page {
  min-height: 100vh;
  background:
    linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
  z-index: 10;
}

.container {
  padding: 20px;
  padding-top: 20px;
}
</style>
