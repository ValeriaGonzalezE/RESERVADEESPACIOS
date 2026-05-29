// Controlador de actualizacion de perfil de usuario.
const bcrypt = require("bcrypt");
const model = require("../models/usuarios.model");
const {
  cleanOptionalText,
  cleanText,
  isValidEmail,
  normalizeEmail,
  validationError
} = require("../utils/requestValidators");

// Actualiza los datos basicos del usuario y opcionalmente su foto y contrasena.
exports.updateUsuario = async (req, res) => {
  try {
    const nombre = cleanText(req.body.nombre);
    const apellido = cleanOptionalText(req.body.apellido);
    const email = normalizeEmail(req.body.email);
    const telefono = cleanOptionalText(req.body.telefono);
    const password = req.body.password || "";

    if (!nombre || !email) {
      return validationError(res, "Nombre y correo son obligatorios", {
        nombre: !nombre ? ["El nombre es obligatorio"] : undefined,
        email: !email ? ["El correo es obligatorio"] : undefined
      });
    }

    if (!isValidEmail(email)) {
      return validationError(res, "Ingresa un correo valido", {
        email: ["Correo invalido"]
      });
    }

    const data = {
      nombre,
      apellido,
      email,
      telefono,
      foto: req.body.foto || ""
    };

    if (req.file) {
      data.foto = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    if (password) {
      if (password.length < 8) {
        return validationError(res, "La contrasena debe tener al menos 8 caracteres", {
          password: ["Minimo 8 caracteres"]
        });
      }

      data.password = await bcrypt.hash(password, 10);
    }

    model.updateUsuario(req.params.id, data, (err) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      res.json({
        success: true,
        foto: data.foto
      });
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};
