<template>

  <aside
    class="sidebar"
    :class="{ open }"
  >

    <!-- LOGO -->
    <div class="logo">

      <div class="logo-box">
        

        <div>
          <h2>RESERVAS</h2>
          <p>Gestión de espacios</p>
        </div>
      </div>

    </div>
    <br><br><br><br><br><br>
    <!-- MENU -->
    <div class="menu">

      <div
        class="item"
        @click="go('/home')"
      >
        <span class="icon">🏠</span>
        <span>Inicio</span>
      </div>

      <div
        class="item"
        @click="go('/create-space')"
      >
        <span class="icon">➕</span>
        <span>Crear espacio</span>
      </div>

      <div
        class="item"
        @click="go('/my-reservations')"
      >
        <span class="icon">📖</span>
        <span>Mis reservas</span>
      </div>

      <div
        class="item"
        @click="go('/my-spaces')"
      >
        <span class="icon">🏢</span>
        <span>Mis espacios</span>
      </div>

      <div
        class="item"
        @click="go('/profile')"
      >
        <span class="icon">👤</span>
        <span>Perfil</span>
      </div>

      <div
        class="item"
        @click="go('/contacto')"
      >
        <span class="icon">@</span>
        <span>Contacto</span>
      </div>

    </div>

    <!-- FOOTER -->
    <div class="logout">

      <div
        class="item logout-btn"
        @click="logout"
      >
        <span class="icon">🚪</span>
        <span>Cerrar sesión</span>
      </div>

    </div>

  </aside>

</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";

defineProps({
  open: Boolean
});

const emit = defineEmits([
  "close"
]);

const router = useRouter();

const userStore = useUserStore();

const go = (path) => {

  router.push(path);

  emit("close");

};

const logout = () => {

  userStore.logout();

  router.push("/login");

};
</script>

<style scoped>

.sidebar {
  width: 260px;
  flex: 0 0 260px;
  background:
    linear-gradient(
      180deg,
      #111111,
      #161616
    );

  border-right:
    1px solid #2d2d2d;

  position: sticky;
  top: 0;
  height: 100vh;

  z-index: 999;

  transition: .3s;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* LOGO */

.logo {
  padding: 28px 22px 18px;
  border-bottom: 1px solid #2d2d2d;
  position: relative;
  z-index: 2;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;

  background:
    linear-gradient(
      135deg,
      #ffdfe1,
      #ababab
    );

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
}

.logo h2 {
  margin: 0;
  color: white;
  font-size: 22px;
}

.logo p {
  margin: 3px 0 0;
  color: #888;
  font-size: 13px;
}

/* MENU */

.menu {
  padding: 30px 20px 20px;
  margin-top: 50px;

  background: #1414145b;
  border: 0px solid #2d2d2d;

  border-radius: 24px;

  box-shadow:
    0 0 20px rgba(255, 46, 98, 0);

  margin-left: 12px;
  margin-right: 12px;
}

.item {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 15px;
  margin-bottom: 8px;

  border-radius: 16px;

  color: #d0d0d0;
  cursor: pointer;

  transition: .2s;
  font-size: 15px;
  font-weight: 500;
}

.item:hover {
  background: #1d1d1d;
  color: white;
  transform: translateX(4px);
}

.icon {
  width: 22px;
  text-align: center;
  font-size: 18px;
}

/* LOGOUT */

.logout {
  padding: 18px 14px;
  border-top:
    1px solid #2d2d2d;
}

.logout-btn:hover {
  background:
    rgba(255, 46, 99, .15);
}

/* MOBILE */

@media(max-width: 1023px) {

  .sidebar {
    position: fixed;
    left: 0;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

}

</style>
