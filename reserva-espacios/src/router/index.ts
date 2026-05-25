import { createRouter, createWebHistory } from '@ionic/vue-router';

import { RouteRecordRaw } from 'vue-router';

// LAYOUT
import AppLayout from '@/layouts/AppLayout.vue';

// PUBLICAS
import LoginPage from '@/views/usuarios/LoginPage.vue';
import RegistroPage from '@/views/usuarios/RegistroPage.vue';
import ForgotPasswordPage from '@/views/usuarios/ForgotPasswordPage.vue';

// PRIVADAS
import HomePage from "@/views/HomePage.vue";
import CreateReservation from "@/views/CreateReservation.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import CreateSpace from "@/views/CreateSpace.vue";
import MyReservations from "@/views/MyReservations.vue";
import MySpaces from "@/views/MySpaces.vue";
import SpaceDetail from "@/views/SpaceDetail.vue";
import SpaceReservations from "@/views/SpaceReservations.vue";
import EditProfile from "@/views/EditProfile.vue";
import SpaceEdit from "@/views/SpaceEdit.vue";
import ReprogramReservation from "@/views/ReprogramReservation.vue";

const routes: Array<RouteRecordRaw> = [

  {
    path: "/",
    redirect: "/login"
  },

  // PUBLICAS
  {
    path: "/login",
    component: LoginPage,
    meta: { public: true }
  },

  {
    path: "/register",
    component: RegistroPage,
    meta: { public: true }
  },

  {
    path: "/forgot",
    component: ForgotPasswordPage,
    meta: { public: true }
  },

  // LAYOUT PRIVADO
  {
    path: "/",
    component: AppLayout,

    children: [

      {
        path: "home",
        component: HomePage,
        meta: { title: "INICIO" }
      },

      {
        path: "create",
        component: CreateReservation,
        meta: { title: "CREAR RESERVA" }
      },

      {
        path: "profile",
        component: ProfilePage,
        meta: { title: "PERFIL" }
      },

      {
        path: "create-space",
        component: CreateSpace,
        meta: { title: "CREAR ESPACIO" }
      },

      {
        path: "my-reservations",
        component: MyReservations,
        meta: { title: "MIS RESERVAS" }
      },

      {
        path: "my-spaces",
        component: MySpaces,
        meta: { title: "MIS ESPACIOS" }
      },

      {
        path: "space/:id",
        component: SpaceDetail,
        meta: { title: "DETALLE DEL ESPACIO" }
      },

      {
        path: "space-edit/:id",
        component: SpaceEdit,
        meta: { title: "EDITAR ESPACIO" }
      },

      {
        path: "space-reservations/:id",
        component: SpaceReservations,
        meta: { title: "RESERVAR ESPACIO" }
      },

      {
        path: "edit-profile",
        component: EditProfile,
        meta: { title: "EDITAR PERFIL" }
      },

      {
        path: "edit-reservation/:id",
        component: ReprogramReservation,
        meta: { title: "REPROGRAMAR RESERVACION" }
      }

    ]
  }
];

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),
  routes
});

// PROTECCION
router.beforeEach((to, from, next) => {

  const isPublic = to.meta.public;

  const token = localStorage.getItem("token");

  if (!isPublic && !token) {
    return next("/login");
  }

  next();

});

export default router;