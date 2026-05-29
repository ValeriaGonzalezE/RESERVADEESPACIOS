//const fecha = new Date(req.body.fecha);
// Dependencias principales del modulo de autenticacion.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const asyncHandler = require("../utils/asyncHandler");
const {
  cleanOptionalText,
  cleanText,
  isValidEmail,
  normalizeEmail,
  validationError
} = require("../utils/requestValidators");

// Toma el secreto del entorno y deja un fallback para desarrollo local.
const getJwtSecret = () => process.env.JWT_SECRET || "clave_desarrollo_reservas";

// Registra un nuevo usuario validando datos
exports.register = asyncHandler(async (req, res) => {
  const nombre = cleanText(req.body.nombre);
  const apellido = cleanOptionalText(req.body.apellido);
  const email = normalizeEmail(req.body.email);
  const telefono = cleanOptionalText(req.body.telefono);
  const password = req.body.password || "";

  if (!nombre || !email || !password) {
    return validationError(res, "Nombre, correo y contrasena son obligatorios", {
      nombre: !nombre ? ["El nombre es obligatorio"] : undefined,
      email: !email ? ["El correo es obligatorio"] : undefined,
      password: !password ? ["La contrasena es obligatoria"] : undefined
    });
  }

  if (!isValidEmail(email)) {
    return validationError(res, "Ingresa un correo valido", {
      email: ["Correo invalido"]
    });
  }

  if (password.length < 8) {
    return validationError(res, "La contrasena debe tener al menos 8 caracteres", {
      password: ["Minimo 8 caracteres"]
    });
  }

  const codigo = email;
  const hashed = await bcrypt.hash(password, 8);

  authModel.createUser(
    { nombre, apellido, email: codigo, telefono, codigo, password: hashed },
    (err) => {
      if (err) {
        const isDuplicate = err.code === "ER_DUP_ENTRY";

        return res.status(isDuplicate ? 409 : 500).json({
          success: false,
          message: isDuplicate ? "El correo ya esta registrado" : "No se pudo crear la cuenta"
        });
      }

      res.json({ success: true });
    }
  );
});

// Inicia sesion usando correo normalizado y contrasena.
exports.login = (req, res) => {
  const codigo = normalizeEmail(req.body.codigo);
  const password = req.body.password || "";

  if (!codigo || !password) {
    return validationError(res, "Usuario y contrasena son obligatorios", {
      codigo: !codigo ? ["El usuario es obligatorio"] : undefined,
      password: !password ? ["La contrasena es obligatoria"] : undefined
    });
  }

  authModel.findUser(codigo, async (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Error al iniciar sesion" });
    }

    if (result.length === 0) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      getJwtSecret(),
      { expiresIn: "8h" }
    );

    delete user.password;
    res.json({ success: true, token, user });
  });
};

// Simula recuperacion de contrasena y mantiene la puerta lista para implementacion real.
exports.forgotPassword = (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) {
    return validationError(res, "Ingresa un correo", {
      email: ["El correo es obligatorio"]
    });
  }

  if (!isValidEmail(email)) {
    return validationError(res, "Ingresa un correo valido", {
      email: ["Correo invalido"]
    });
  }

  res.json({
    success: true,
    message: "Si el correo existe, se enviaran instrucciones de recuperacion"
  });
};
