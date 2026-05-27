const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarios.controller");
const upload = require("../config/multer");
const {
  requireAuth,
  requireSelfOrAdmin
} = require("../middlewares/auth.middleware");

// MIDDLEWARE GLOBAL DE AUTENTICACIÓN
router.use(requireAuth);

// RUTA: ACTUALIZAR USUARIO
router.put("/:id", requireSelfOrAdmin(), upload.single("foto"), controller.updateUsuario);

//EXPORTACIÓN DEL ROUTER
module.exports = router;