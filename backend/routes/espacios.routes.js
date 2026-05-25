const express = require("express");
const router = express.Router();
const controller = require("../controllers/espacios.controller");
const upload = require("../config/multer");
const validate = require("../middlewares/validate.middleware");
const {
  requireAuth,
  requireSelfOrAdmin,
  requireSpaceOwnerOrAdmin
} = require("../middlewares/auth.middleware");
const {
  espacioQuerySchema,
  espacioSchema,
  espacioUpdateSchema,
  comentarioSchema
} = require("../validators/schemas");


// Todas las rutas de espacios requieren sesion iniciada.
router.use(requireAuth);

// Endpoints para listar, crear, editar, eliminar y comentar espacios.
router.get("/", validate(espacioQuerySchema, "query"), controller.getEspacios);
router.get("/tipos", controller.getTipos);

router.post("/", upload.array("fotos", 5), validate(espacioSchema), controller.createEspacio);
router.get("/mis-espacios/:id", requireSelfOrAdmin(), controller.getMisEspacios);
router.get("/comentarios/:id", controller.getComentarios);
router.get("/:id", controller.getEspacio);
router.put("/:id", requireSpaceOwnerOrAdmin, validate(espacioUpdateSchema), controller.updateEspacio);
router.delete("/:id", requireSpaceOwnerOrAdmin, controller.deleteEspacio);
router.post("/comentarios", validate(comentarioSchema), controller.createComentario);

module.exports = router;
