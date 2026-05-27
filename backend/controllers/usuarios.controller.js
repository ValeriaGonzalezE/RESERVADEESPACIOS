const bcrypt = require("bcrypt");
const model = require("../models/usuarios.model");

// ACTUALIZAR USUARIO
exports.updateUsuario = async (req, res) => {
  try {
    const nombre = req.body.nombre?.trim();
    const apellido = req.body.apellido?.trim() || "";
    const email = req.body.email?.trim();
    const telefono = req.body.telefono?.trim() || "";
    const password = req.body.password || "";

    // Validación de campos obligatorios
    if (!nombre || !email) {
      return res.status(400).json({
        success: false,
        message: "Nombre y correo son obligatorios"
      });
    }

    // Estructura base de datos a actualizar
    const data = {
      nombre,
      apellido,
      email,
      telefono,
      foto: req.body.foto || ""
    };

    // Si se sube una nueva imagen de perfil
    if (req.file) {
      data.foto = `http://localhost:3000/uploads/${req.file.filename}`;
    }

    // Si el usuario quiere cambiar contraseña
    if (password) {
      if (password.length < 4) {
        return res.status(400).json({
          success: false,
          message: "La contrasena debe tener al menos 4 caracteres"
        });
      }

      // Encriptación de contraseña antes de guardar
      data.password = await bcrypt.hash(password, 10);
    }

    // Llamada al modelo para actualizar en base de datos
    model.updateUsuario(req.params.id, data, (err) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      // Respuesta final exitosa
      res.json({
        success: true,
        foto: data.foto
      });
    });
  } catch (err) {
    // Manejo de errores inesperados del servidor
    res.status(500).json(err);
  }
};