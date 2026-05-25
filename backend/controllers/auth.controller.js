const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const asyncHandler = require("../utils/asyncHandler");

//if (condicionBackendNoCumple) { return res.status(400).json({ success: false, message: "mensaje backend" }); }
// guardar o consultar en modelo res.json({ success: true });

const getJwtSecret = () => process.env.JWT_SECRET || "clave_desarrollo_reservas";

// Registra un usuario nuevo, cifra la contrasena y controla correos duplicados.
exports.register = asyncHandler(async (req, res) => {

  const { nombre, apellido, email, telefono, password } = req.body;

  const codigo = email;

  const hashed = await bcrypt.hash(password, 10);

  authModel.createUser(
    { nombre, apellido, email, telefono, codigo, password: hashed }, (err) => {

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

// Busca el usuario, compara la contrasena y devuelve token mas datos de sesion.
exports.login = (req, res) => {
  const { codigo, password } = req.body;

  authModel.findUser(codigo, async (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result.length === 0) return res.json({ success: false });

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.json({ success: false });

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      getJwtSecret(),
      { expiresIn: "8h" }
    );

    delete user.password;

    res.json({ success: true, token, user });
  });
};

// Responde de forma generica para no revelar si el correo existe en el sistema.
exports.forgotPassword = (req, res) => {
  res.json({
    success: true,
    message: "Si el correo existe, se enviaran instrucciones de recuperacion"
  });
};
