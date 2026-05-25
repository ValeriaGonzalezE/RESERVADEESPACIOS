<template>
  <ion-content>

    <AuthLayout>

      <template #left>
        REGÍSTRATE
      </template>
      <!-- if (condicionFrontendNoCumple) { return alert("mensaje"); } const res = await api.post("/ruta", datos); 
       if (!res.data.success) { return alert(res.data.message); } alert("Proceso exitoso"); -->

       
      <h2 class="layout">Crear Cuenta</h2>

      <p class="subtitle">
        Completa la información para crear tu cuenta
      </p>

      <AuthForm :fields="[
        {
          model: 'nombre',
          label: 'Nombre',
          placeholder: 'Ej: Valeria'
        },
        {
          model: 'apellido',
          label: 'Apellido',
          placeholder: 'Ej: González'
        },
        {
          model: 'email',
          label: 'Correo electrónico',
          placeholder: 'ejemplo@gmail.com'
        },
        {
          model: 'telefono',
          label: 'Número de celular',
          type: 'tel',
          placeholder: '3001234567'
        },
        {
          model: 'password',
          label: 'Contraseña',
          type: 'password',
          placeholder: 'Mínimo 8 caracteres'
        },
        {
          model: 'confirmPassword',
          label: 'Confirmar contraseña',
          type: 'password',
          placeholder: 'Repite tu contraseña'
        }
      ]" buttonText="Crear Cuenta" @submit="register" />

      <div class="links">
        <router-link to="/login">
          ¿Ya tienes cuenta? Inicia sesión
        </router-link>
      </div>

    </AuthLayout>

  </ion-content>
</template>

<script setup>
import AuthLayout from "@/components/users/AuthLayout.vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();

// Valida datos basicos del formulario antes de enviar el registro al backend.
const register = async (form) => {

  // VALIDAR CONTRASEÑAS
  if (form.password !== form.confirmPassword) {
    return alert("Las contraseñas no coinciden");
  }

  // AUTOCOMPLETAR GMAIL
  if (
    form.email &&
    !form.email.includes("@")
  ) {
    form.email += "@gmail.com";
  }
  if (!form.nombre?.trim()) {
    return alert("El nombre es obligatorio");
  }

  if (!form.email?.trim()) {
    return alert("El correo es obligatorio");
  }

  if (!form.password || form.password.length < 8) {
    return alert("La contraseña debe tener mínimo 8 caracteres");
  }

    try {
      // Envia la informacion del nuevo usuario al endpoint de registro.

      const res = await api.post("/register", form);
    
    if (res.data.success) {
      alert("Cuenta creada correctamente");
      router.push("/");
    } else {
      alert(res.data.message || "No se pudo crear la cuenta");
    }

  } catch (error) {
    alert("Ocurrió un error");
  }
};
</script>

<style scoped>
.layout {
  padding: 300px 30px 50px 30px;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.links {
  margin-top: 20px;
  text-align: center;
}

.links a {
  color: var(--ion-color-primary);
  font-weight: 600;
  text-decoration: none;
}
</style>
