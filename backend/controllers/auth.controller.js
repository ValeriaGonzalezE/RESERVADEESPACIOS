// dependencias principales
const bcrypt = require("bcrypt"); // encriptar
const jwt = require("jsonwebtoken"); // tokens de autenticación
const authModel = require("../models/auth.model"); // consultar la base de datos
const asyncHandler = require("../utils/asyncHandler"); // Maneja errores

// funcion para obtener secret del JWT
const getJwtSecret = () => process.env.JWT_SECRET || "clave_desarrollo_reservas";

// REGISTRO DE USUARIOS
exports.register = asyncHandler(async (req, res) => {
  
  // Obtener datos del body
  const nombre = req.body.nombre?.trim();
  const apellido = req.body.apellido?.trim() || "";
  const email = req.body.email?.trim();
  const telefono = req.body.telefono?.trim() || "";
  const password = req.body.password || "";

  // Validación de campos obligatorios
  if (!nombre || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nombre, correo y contrasena son obligatorios"
    });
  }

  // Validación mínima de contraseña
  if (password.length < 4) {
    return res.status(400).json({
      success: false,
      message: "La contrasena debe tener al menos 4 caracteres"
    });
  }

  // Si no tiene @, se asume gmail
  const codigo = email.includes("@") ? email : `${email}@gmail.com`;
  // Encriptación de contraseña
  const hashed = await bcrypt.hash(password, 8);

  // Creación del usuario en base de datos
  authModel.createUser(
    { nombre, apellido, email: codigo, telefono, codigo, password: hashed },
    (err) => {

      // Manejo de errores de base de datos
      if (err) {
        const isDuplicate = err.code === "ER_DUP_ENTRY";

        return res.status(isDuplicate ? 409 : 500).json({
          success: false,
          message: isDuplicate ? "El correo ya esta registrado" : "No se pudo crear la cuenta"
        });
      }

      // Registro exitoso
      res.json({ success: true });
    }
  );
});

// LOGIN DE USUARIOS
exports.login = (req, res) => {

  // Datos de entrada
  const codigo = req.body.codigo?.trim();
  const password = req.body.password || "";

  // Validación de campos
  if (!codigo || !password) {
    return res.status(400).json({
      success: false,
      message: "Usuario y contrasena son obligatorios"
    });
  }

  // Buscar usuario en la base de datos
  authModel.findUser(codigo, async (err, result) => {
    
    // Error en consulta
    if (err) {
      return res.status(500).json({ success: false, message: "Error al iniciar sesion" });
    }

    // Usuario no encontrado
    if (result.length === 0) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    const user = result[0];
    // Comparar contraseña ingresada con la encriptada
    const valid = await bcrypt.compare(password, user.password);

    // Contraseña incorrecta
    if (!valid) {
      return res.json({ success: false, message: "Credenciales incorrectas" });
    }

    // Generación de token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      getJwtSecret(),
      { expiresIn: "8h" }
    );

    // Eliminar password antes de enviar respuesta
    delete user.password;

    // Login exitoso
    res.json({ success: true, token, user });
  });
};

//RECUPERACION DE CONTRASEÑA SIMULADA (NO IMPLEMETADO)
exports.forgotPassword = (req, res) => {
  const email = req.body.email?.trim();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Ingresa un correo"
    });
  }

  res.json({
    success: true,
    message: "Si el correo existe, se enviaran instrucciones de recuperacion"
  });
};