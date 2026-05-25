const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/usuarios.controller");

const upload =
  require("../config/multer");
const validate =
  require("../middlewares/validate.middleware");
const {
  requireAuth,
  requireSelfOrAdmin
} = require("../middlewares/auth.middleware");
const {
  usuarioUpdateSchema
} = require("../validators/schemas");

// Protege las rutas de usuario y valida permisos sobre el perfil editado.
router.use(requireAuth);

router.put(
  "/:id",
  requireSelfOrAdmin(),
  upload.single("foto"),
  validate(usuarioUpdateSchema),
  controller.updateUsuario
);

module.exports = router;
