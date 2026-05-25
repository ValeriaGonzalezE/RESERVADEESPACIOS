import { defineStore } from "pinia";

// Recupera el usuario persistido y evita errores si localStorage tiene JSON invalido.
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const useUserStore = defineStore("user", {
  state: () => ({
    user: getStoredUser(),
    token: localStorage.getItem("token") || null
  }),

  actions: {
    // Guarda usuario y token tanto en el estado global como en localStorage.
    setUser(user, token) {
      this.user = user;
      this.token = token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    // Elimina la sesion activa del store y del almacenamiento local.
    logout() {
      this.user = null;
      this.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});
