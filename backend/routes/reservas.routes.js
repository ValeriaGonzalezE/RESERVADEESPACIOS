const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservas.controller");
const {
  requireAuth,
  requireSelfOrAdmin,
  requireReservationOwnerOrAdmin
} = require("../middlewares/auth.middleware");

// MIDDLEWARE GLOBAL DE AUTENTICACIÓN
router.use(requireAuth);

router.get("/por-espacio", controller.getReservasPorEspacio); //RUTA: VER RESERVAS POR ESPACIO Y FECHA
router.get("/espacio/:id", controller.getReservasEspacio); //RUTA: VER TODAS LAS RESERVAS DE UN ESPACIO
router.post("/", controller.createReserva); //RUTA: CREAR RESERVA
router.get("/mis-reservas/:id", requireSelfOrAdmin(), controller.getMisReservas); //RUTA: VER MIS RESERVAS
router.put("/cancelar/:id", requireReservationOwnerOrAdmin(), controller.cancelarReserva); //RUTA: CANCELAR RESERVA
router.put("/:id", requireReservationOwnerOrAdmin(), controller.updateReserva); //RUTA: ACTUALIZAR RESERVA

module.exports = router; //EXPORTACIÓN DEL ROUTER