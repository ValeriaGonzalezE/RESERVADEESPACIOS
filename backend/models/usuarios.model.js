const db = require("../config/db");

exports.updateUsuario = (id, data, callback) => {

  // si NO cambia password
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

    // si cambia password
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