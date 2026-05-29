<template>
  <ion-page>
    <ion-content>
      <!-- Fondo y estructura principal de la vista. -->
      <div class="page">
        <BackButton class="back-floating" />

        <div class="container">
          <div class="form-box">
            <!-- Formulario de edicion del espacio. -->
            <SpaceForm
              :espacio="espacio"
              :fields="fields"
              :errors="errors"
              @update:espacio="syncEspacio"
              @guardar="guardar"
            />

            <!-- Accion secundaria para activar o inactivar el espacio. -->
            <BaseButton variant="secondary" @click="toggleEstado">
              {{ espacio.estado === "activo" ? "Inhabilitar espacio" : "Activar espacio" }}
            </BaseButton>

            <!-- Accion destructiva para eliminar el espacio. -->
            <p class="delete-text" @click="eliminar">Eliminar espacio</p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones necesarias para editar un espacio.
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import BackButton from "@/components/ui/BackButton.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import SpaceForm from "@/components/espacios/SpaceForm.vue";

// Router y route para obtener el id y navegar.
const route = useRoute();
const router = useRouter();

// Estado editable del espacio.
const espacio = reactive({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "no",
  precio: "0",
  estado: "activo"
});

// Catalogo de tipos y errores del formulario.
const tipos = ref([]);
const errors = reactive({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "",
  precio: ""
});

// Campos del formulario. Para agregar un input nuevo, se agrega aqui y luego en errors/validacion.
const fields = computed(() => {
  const baseFields = [
    {
      model: "nombre",
      label: "Nombre",
      placeholder: "Ej: Salon principal"
    },
    {
      model: "tipo_id",
      label: "Tipo",
      type: "select",
      disabledOption: "Selecciona",
      options: tipos.value.map((tipo) => ({
        value: String(tipo.id),
        label: tipo.nombre
      }))
    },
    {
      model: "capacidad",
      label: "Capacidad",
      type: "number",
      min: "1",
      placeholder: "Ej: 30"
    },
    {
      model: "ubicacion",
      label: "Ubicacion",
      placeholder: "Ej: Calle 1 #1A-1, barrio"
    },
    {
      model: "descripcion",
      label: "Descripcion",
      type: "textarea",
      placeholder: "Describe el espacio"
    },
    {
      model: "requiere_pago",
      label: "Requiere pago",
      type: "select",
      disabledOption: "Selecciona",
      options: [
        { value: "no", label: "Gratis" },
        { value: "si", label: "De pago" }
      ]
    }
  ];

  if (espacio.requiere_pago === "si") {
    baseFields.push({
      model: "precio",
      label: "Precio",
      type: "number",
      min: "0",
      placeholder: "Ej: 50000"
    });
  }

  return baseFields;
});

// Carga el espacio actual y la lista de tipos disponibles.
onMounted(async () => {
  const [espacioRes, tiposRes] = await Promise.all([
    api.get(`/espacios/${route.params.id}`),
    api.get("/espacios/tipos")
  ]);

  Object.assign(espacio, {
    ...espacioRes.data,
    tipo_id: String(espacioRes.data.tipo_id || ""),
    capacidad: String(espacioRes.data.capacidad || ""),
    precio: String(espacioRes.data.precio || "0")
  });

  tipos.value = tiposRes.data;
});

// Sincroniza los cambios enviados por el formulario hijo.
const syncEspacio = (form) => {
  Object.assign(espacio, form);

  if (espacio.requiere_pago !== "si") {
    espacio.precio = "0";
    errors.precio = "";
  }
};

// Valida reglas basicas antes de guardar.
const validarEspacio = () => {
  errors.nombre = espacio.nombre?.trim() ? "" : "Ingresa el nombre del espacio";
  errors.tipo_id = espacio.tipo_id ? "" : "Selecciona el tipo de espacio";
  errors.capacidad = Number(espacio.capacidad) > 0 ? "" : "La capacidad debe ser mayor a 0";
  errors.ubicacion = espacio.ubicacion?.trim() ? "" : "Ingresa la ubicacion";
  errors.precio = espacio.requiere_pago === "si" && Number(espacio.precio) < 0
    ? "El precio no puede ser negativo"
    : "";

  return !errors.nombre && !errors.tipo_id && !errors.capacidad && !errors.ubicacion && !errors.precio;
};

// Guarda los cambios del espacio.
const guardar = async () => {
  if (!validarEspacio()) {
    return;
  }

  await api.put(`/espacios/${route.params.id}`, { ...espacio });
  alert("Espacio actualizado");
};

// Elimina el espacio despues de confirmacion.
const eliminar = async () => {
  if (!confirm("Eliminar espacio?")) {
    return;
  }

  await api.delete(`/espacios/${route.params.id}`);
  router.push("/my-spaces");
};

// Cambia el estado del espacio y reaprovecha el flujo de guardado.
const toggleEstado = async () => {
  espacio.estado = espacio.estado === "activo" ? "inactivo" : "activo";
  await guardar();
};
</script>

<style scoped>
/* Fondo general de la pantalla. */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f, #1a0005);
  color: white;
}

/* Boton flotante de regreso. */
.back-floating {
  position: absolute;
  top: 15px;
  left: 20px;
}

/* Contenedor con espacio interno. */
.container {
  padding: 20px;
}

/* Caja principal del formulario. */
.form-box {
  width: 100%;
  max-width: 1500px;
  margin: auto;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 24px;
  padding: 28px;
}

/* Accion visual para eliminar el registro. */
.delete-text {
  margin-top: 16px;
  text-align: center;
  color: #ff4d4d;
  font-weight: bold;
  cursor: pointer;
}
</style>
