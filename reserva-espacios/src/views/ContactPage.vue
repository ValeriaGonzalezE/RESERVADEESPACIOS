<template>
  <ion-page>
    <ion-content>
      <div class="contact-page">
        <section class="contact-box">
          <h3>Contacto</h3>
          <p>Necesitas un ascesor? Envianos un mensaje</p>

          <AuthForm
            :fields="fields"
            :external-errors="errors"
            button-text="Enviar"
            @submit="enviarContacto"
          />

          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue";
import { reactive, ref } from "vue";
import AuthForm from "@/components/users/AuthForm.vue";
import api from "@/services/api";
import { isEmailValid, normalizeEmail, resetErrors } from "@/utils/formUtils";

const successMessage = ref("");
const fields = [
  {
    model: "nombre",
    label: "Nombre",
    placeholder: "Tu nombre"
  },
  {
    model: "telefono",
    label: "Numero de celular",
    type: "tel",
    placeholder: "3001234567"
  },
  {
    model: "email",
    label: "Correo electronico",
    placeholder: "ejemplo@gmail.com",
    autoEmail: true
  },
  {
    model: "mensaje",
    label: "Mensaje",
    type: "textarea",
    placeholder: "Escribe tu mensaje"
  },
  
  { model: "edad", label: "Edad", type: "number", placeholder: "Entre 16 y 24" },
];

const errors = reactive({
  nombre: "",
  telefono: "",
  email: "",
  mensaje: "",
  edad: "",
  
});

const validarFrontend = (payload) => {
  resetErrors(errors);

  errors.nombre = payload.nombre?.trim() ? "" : "El nombre es obligatorio";
  errors.telefono = payload.telefono?.trim() ? "" : "El telefono es obligatorio";
  errors.email = payload.email?.trim() ? "" : "El correo es obligatorio";
  errors.mensaje = payload.mensaje?.trim() ? "" : "El mensaje es obligatorio";
  
  if (!errors.email && !isEmailValid(payload.email)) {
    errors.email = "Ingresa un correo valido";
  }

  const edad = Number(payload.edad);
  errors.edad = edad >= 16 && edad <= 24 ? "" : "La edad debe estar entre 16 y 24";
     
  return !Object.values(errors).some(Boolean);
};

const enviarContacto = async (form) => {
  const payload = {
    ...form,
    email: normalizeEmail(form.email)
  };

  successMessage.value = "";

  if (!validarFrontend(payload)) {
    return;
  }

  try {
    const res = await api.post("/contacto", payload);

    if (res.data.success) {
      successMessage.value = res.data.message || "Mensaje enviado correctamente";
      return;
    }

    alert(res.data.message || "No se pudo enviar el mensaje");
  } catch (error) {
    alert(error.response?.data?.message || "Ocurrio un error");
  }
};
</script>

<style scoped>
.contact-page {
  width: 100%;
  min-height: calc(100vh - 70px);
  padding: 24px;
  color: white;
}

.contact-box {
  width: 100%;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.contact-box h3 {
  margin: 0 0 6px;
  font-size: 24px;
}

.contact-box p {
  margin: 0 0 18px;
  color: #b8b8b8;
  font-size: 14px;
}

.success-message {
  margin-top: 14px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(46, 204, 113, 0.14);
  color: #8ff0b6;
}

@media (max-width: 767px) {
  .contact-page {
    padding: 16px;
  }
}
</style>
