const express = require("express");
const router = express.Router();
const controller = require("../controllers/reservas.controller");
const validate = require("../middlewares/validate.middleware");
const {
  requireAuth,
  requireSelfOrAdmin,
  requireReservationOwnerOrAdmin
} = require("../middlewares/auth.middleware");
const {
  reservaDisponibilidadQuerySchema,
  reservaSchema,
  reservaUpdateSchema
} = require("../validators/schemas");

// Todas las rutas de reservas exigen autenticacion.
router.use(requireAuth);

// Endpoints para consultar disponibilidad y administrar reservas.
router.get("/por-espacio", validate(reservaDisponibilidadQuerySchema, "query"), controller.getReservasPorEspacio);
router.get("/espacio/:id", controller.getReservasEspacio);
router.post("/", validate(reservaSchema), controller.createReserva);
router.get("/mis-reservas/:id", requireSelfOrAdmin(), controller.getMisReservas);
router.put("/cancelar/:id", requireReservationOwnerOrAdmin(), controller.cancelarReserva);
router.put("/:id", requireReservationOwnerOrAdmin(), validate(reservaUpdateSchema), controller.updateReserva);

module.exports = router;
