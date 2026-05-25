const bcrypt = require("bcrypt");

const model =
  require("../models/usuarios.model");

// Actualiza datos del perfil, procesa foto opcional y cifra la nueva contrasena.
exports.updateUsuario = async (req, res) => {

  try {

    const { password } = req.body;

    let data = { ...req.body };

    // FOTO
    if (req.file) {

      data.foto =
        `http://localhost:3000/uploads/${req.file.filename}`;

    }

    // PASSWORD
    if (password && password !== "") {

      data.password =
        await bcrypt.hash(password, 10);

    }

    model.updateUsuario(

      req.params.id,

      data,

      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            success: false
          });

        }

        res.json({
          success: true,
          foto: data.foto
        });

      }

    );

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }

};
