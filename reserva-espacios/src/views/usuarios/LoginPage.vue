<template>
  <ion-page>
    <ion-content>
      <!-- Layout principal de autenticacion para mantener la misma apariencia. -->
      <AuthLayout>
        <!-- Columna izquierda del layout. -->
        <template #left>
          BIENVENIDO
        </template>

        <!-- Encabezado principal de la vista. -->
        <h2>Iniciar Sesion</h2>
        <br>

        <!-- Formulario declarativo de acceso. -->
        <AuthForm
          :fields="fields"
          :external-errors="errors"
          button-text="Iniciar Sesion"
          @submit="login"
        />

        <!-- Acceso alterno hacia el registro. -->
        <div class="links">
          <router-link to="/register">Crear cuenta</router-link>
        </div>
      </AuthLayout>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones base de la vista de login.
import { reactive } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { useUserStore } from "@/stores/UserStore";

// Router y store para navegar y guardar la sesion.
const router = useRouter();
const userStore = useUserStore();

// Configuracion declarativa de campos del formulario.
const fields = [
  {
    model: "codigo",
    label: "Usuario (Correo)",
    placeholder: "ejemplo@gmail.com",
    autoEmail: true
  },
  {
    model: "password",
    label: "Contrasena",
    type: "password",
    placeholder: "Ingresa tu contrasena"
  }
];

// Errores del formulario para feedback rapido.
const errors = reactive({
  codigo: "",
  password: ""
});

// Valida y envia el login al backend.
const login = async (form) => {
  errors.codigo = form.codigo?.trim() ? "" : "El correo es obligatorio";
  errors.password = form.password ? "" : "La contrasena es obligatoria";

  if (errors.codigo || errors.password) {
    return;
  }

  const res = await api.post("/login", form);

  if (res.data.success) {
    userStore.setUser(res.data.user, res.data.token);
    router.push("/home");
    return;
  }

  alert(res.data.message || "Credenciales incorrectas");
};
</script>
