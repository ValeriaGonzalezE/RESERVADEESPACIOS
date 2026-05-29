<template>
  <ion-page>
    <ion-content>
      <div class="layout">
        <div class="filters">
          <AuthForm
            :fields="fields"
            :initial-values="form"
            :external-errors="errors"
            button-text="Filtrar"
            @update="syncForm"
            @submit="filtrar"
          />

          <div class="actions">
            <button class="clear" @click="limpiarFiltros">Limpiar</button>
          </div>
        </div>

        <div v-if="form.fecha || form.tipo || form.pago" class="filtros-activos">
          <span v-if="form.fecha">Fecha: {{ form.fecha }}</span>
          <span v-if="form.tipo">Tipo: {{ form.tipo }}</span>
          <span v-if="form.pago">
            {{ form.pago === "si" ? "De pago" : "Gratis" }}
          </span>
        </div>

        <div class="content">
          <SpaceCard
            v-for="salon in salones"
            :key="salon.id"
            :espacio="salon"
            @verReservas="verDetalle"
          />

          <div v-if="salones.length === 0" class="no-results">
            No hay espacios disponibles con esos filtros
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, useIonRouter } from "@ionic/vue";
import { computed, reactive, ref, onMounted, onActivated } from "vue";
import api from "@/services/api";
import AuthForm from "@/components/users/AuthForm.vue";
import SpaceCard from "@/components/espacios/SpaceCard.vue";

const ionRouter = useIonRouter();

const tipos = ref([]);
const form = reactive({
  fecha: new Date().toISOString().split("T")[0],
  tipo: "",
  pago: ""
});

// Campos del filtro. Para agregar un input nuevo, se agrega aqui y luego en errors/filtrar.
const fields = computed(() => [
  {
    model: "fecha",
    label: "Fecha",
    type: "date"
  },
  {
    model: "tipo",
    label: "Tipo de espacio",
    type: "select",
    disabledOption: "Todo tipo de espacio",
    options: tipos.value.map((tipo) => ({
      value: tipo.nombre,
      label: tipo.nombre
    }))
  },
  {
    model: "pago",
    label: "Tipo de pago",
    type: "select",
    disabledOption: "Todo tipo de pago",
    options: [
      { value: "si", label: "De pago" },
      { value: "no", label: "Gratis" }
    ]
  }
]);

const errors = reactive({
  fecha: "",
  tipo: "",
  pago: ""
});

const salones = ref([]);

const syncForm = (values) => {
  Object.assign(form, values);
};

const obtenerEspacios = async () => {
  try {
    const res = await api.get("/espacios", {
      params: {
        fecha: form.fecha || undefined,
        tipo: form.tipo || null,
        pago: form.pago || null
      }
    });

    salones.value = res.data;
  } catch (err) {
    console.error("Error cargando espacios", err);
  }
};

const filtrar = async (payload) => {
  Object.assign(form, payload);

  errors.fecha = "";
  errors.tipo = "";
  errors.pago = "";

  await obtenerEspacios();
};

const cargarTipos = async () => {
  try {
    const res = await api.get("/espacios/tipos");
    tipos.value = res.data;
  } catch (err) {
    console.error("Error cargando tipos", err);
  }
};

const limpiarFiltros = () => {
  form.fecha = "";
  form.tipo = "";
  form.pago = "";

  obtenerEspacios();
};

onMounted(async () => {
  await cargarTipos();
  await obtenerEspacios();
});

onActivated(() => {
  obtenerEspacios();
});

const verDetalle = (id) => {
  ionRouter.push(`/space/${id}`);
};
</script>

<style scoped>
.layout {
  padding: 20px;
  color: white;
}

.filters {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions {
  display: flex;
  gap: 10px;
}

button {
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #ff2e63;
  color: white;
  cursor: pointer;
}

button.clear {
  background: #444;
}

.filtros-activos {
  display: flex;
  gap: 10px;
  padding: 0 15px;
  font-size: 12px;
  color: #ff2e63;
}

.content {
  padding: 20px;
}

.no-results {
  text-align: center;
  margin-top: 20px;
  color: #888;
}
</style>
