const express = require("express");
const router = express.Router();
const controller = require("../controllers/contacto.controller");

router.post("/", controller.enviarContacto);

module.exports = router;
