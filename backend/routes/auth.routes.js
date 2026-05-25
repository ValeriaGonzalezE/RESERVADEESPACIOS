const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema
} = require("../validators/schemas");

// Rutas publicas de autenticacion con validacion previa del body.
router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/forgot-password", validate(forgotPasswordSchema), controller.forgotPassword);

module.exports = router;
