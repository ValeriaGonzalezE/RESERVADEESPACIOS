const db = require("../config/db");

// ACTUALIZAR USUARIO
exports.updateUsuario = (id, data, callback) => {

  // CASO 1: NO SE ACTUALIZA LA CONTRASEÑA
  if (!data.password || data.password === "") {

    db.query(
      `UPDATE usuarios SET 
      nombre=?,
      apellido=?,
      email=?,
      telefono=?,
      foto=?
      WHERE id=?`,
      [
        data.nombre,
        data.apellido,
        data.email,
        data.telefono,
        data.foto,
        id
      ],
      callback
    );

  } else {

    // CASO 2: SE ACTUALIZA LA CONTRASEÑA
    db.query(
      `UPDATE usuarios SET 
      nombre=?,
      apellido=?,
      email=?,
      telefono=?,
      foto=?,
      password=?
      WHERE id=?`,
      [
        data.nombre,
        data.apellido,
        data.email,
        data.telefono,
        data.foto,
        data.password,
        id
      ],
      callback
    );

  }

};