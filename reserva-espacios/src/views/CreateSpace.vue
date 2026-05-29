<template>
  <ion-page>
    <ion-content>
      <!-- Contenedor general de la vista. -->
      <div class="page">
        <div class="container">
          <!-- Titulo principal. -->
          <h2>Crear Espacio</h2>

          <!-- Seccion separada para carga de imagenes. -->
          <div class="upload">
            <label>Fotos (max 5)</label>
            <input type="file" multiple @change="onFileChange" />

            <div class="preview">
              <div v-for="(img, index) in previews" :key="index" class="img-box">
                <img :src="img" />
                <button @click="eliminarFoto(index)">x</button>
              </div>
            </div>
          </div>

          <!-- Formulario del espacio encapsulado en componente. -->
          <SpaceForm
            :espacio="espacio"
            :fields="fields"
            :errors="errors"
            @update:espacio="syncEspacio"
            @guardar="crear"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones principales para crear espacios.
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import SpaceForm from "@/components/espacios/SpaceForm.vue";

// Router para regresar a la lista del usuario.
const router = useRouter();

// Estado editable del espacio.
const espacio = reactive({
  nombre: "",
  tipo_id: "",
  capacidad: "",
  ubicacion: "",
  descripcion: "",
  requiere_pago: "",
  precio: "0"
});

// Catalogo de tipos y control de imagenes seleccionadas.
const tipos = ref([]);
const fotos = ref([]);
const previews = ref([]);

// Errores por campo para frontend.
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

// Carga los tipos de espacio al iniciar la vista.
onMounted(async () => {
  const res = await api.get("/espacios/tipos");
  tipos.value = res.data;
});

// Sincroniza el estado recibido desde el formulario hijo.
const syncEspacio = (form) => {
  Object.assign(espacio, form);

  if (espacio.requiere_pago !== "si") {
    espacio.precio = "0";
    errors.precio = "";
  }
};

// Valida el formulario antes de enviarlo al backend.
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

// Crea el espacio y sube las imagenes seleccionadas.
const crear = async () => {
  if (!validarEspacio()) {
    return;
  }

  const formData = new FormData();

  Object.entries(espacio).forEach(([key, value]) => {
    formData.append(key, value || "");
  });

  fotos.value.forEach((foto) => {
    formData.append("fotos", foto);
  });

  await api.post("/espacios", formData);
  alert("Espacio creado");
  router.push("/my-spaces");
};

// Agrega archivos nuevos evitando duplicados y limite mayor a 5.
const onFileChange = (event) => {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    const exists = fotos.value.some((item) => item.name === file.name);

    if (!exists && fotos.value.length < 5) {
      fotos.value.push(file);
      previews.value.push(URL.createObjectURL(file));
    }
  });

  event.target.value = "";
};

// Elimina una foto del listado temporal.
const eliminarFoto = (index) => {
  fotos.value.splice(index, 1);
  previews.value.splice(index, 1);
};
</script>

<style>
/* Fondo general de la pantalla. */
.page {
  min-height: 100vh;
  padding: 20px;
  background: radial-gradient(circle at top, #1a0005, #0f0f0f);
  color: white;
}

/* Tarjeta principal de contenido. */
.container {
  margin-top: 20px;
  background: #1e1e1e;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 25px rgba(255, 46, 99, 0.2);
}

/* Zona de carga de imagenes. */
.upload {
  margin: 20px 0;
}

/* Galeria previa de imagenes elegidas. */
.preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* Caja individual de cada preview. */
.img-box {
  position: relative;
}

/* Imagen miniatura del preview. */
.img-box img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
}

/* Boton para eliminar una preview. */
.img-box button {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  border: none;
  color: white;
  border-radius: 50%;
  cursor: pointer;
}
</style>
