const express = require("express");
const router = express.Router();
const controller = require("../controllers/espacios.controller");
const upload = require("../config/multer");
const {
  requireAuth,
  requireSelfOrAdmin,
  requireSpaceOwnerOrAdmin
} = require("../middlewares/auth.middleware");

// MIDDLEWARE GLOBAL DE AUTENTICACIÓN
router.use(requireAuth);

router.get("/", controller.getEspacios); //RUTA: OBTENER TODOS LOS ESPACIOS
router.get("/tipos", controller.getTipos); //RUTA: OBTENER TIPOS DE ESPACIOS
router.post("/", upload.array("fotos", 5), controller.createEspacio); //RUTA: CREAR ESPACIO
router.get("/mis-espacios/:id", requireSelfOrAdmin(), controller.getMisEspacios); //RUTA: OBTENER MIS ESPACIOS
router.get("/comentarios/:id", controller.getComentarios); //RUTA: OBTENER COMENTARIOS DE UN ESPACIO
router.get("/:id", controller.getEspacio); //RUTA: OBTENER UN ESPACIO POR ID
router.put("/:id", requireSpaceOwnerOrAdmin, controller.updateEspacio); //RUTA: ACTUALIZAR ESPACIO
router.delete("/:id", requireSpaceOwnerOrAdmin, controller.deleteEspacio); //RUTA: ELIMINAR ESPACIO
router.post("/comentarios", controller.createComentario); //RUTA: CREAR COMENTARIO

module.exports = router; //EXPORTACIÓN DEL ROUTER
