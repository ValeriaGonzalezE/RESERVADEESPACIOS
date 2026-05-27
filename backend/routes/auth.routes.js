const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");

router.post("/register", controller.register); //RUTA: REGISTRO DE USUARIO - POST /register
router.post("/login", controller.login); //RUTA: LOGIN - POST /login
router.post("/forgot-password", controller.forgotPassword); //RUTA: RECUPERACIÓN DE CONTRASEÑA - POST /forgot-password

module.exports = router; //EXPORTACIÓN DEL ROUTER
