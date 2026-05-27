const db = require("../config/db");

// CREAR USUARIO
exports.createUser = (data, callback) => {
  const { nombre, apellido, email, telefono, codigo, password } = data;

  db.query(
    "INSERT INTO usuarios (nombre, apellido, email, telefono, codigo, password) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, apellido, email, telefono, codigo, password],
    callback
  );
};

// BUSCAR USUARIO (LOGIN / VALIDACIÓN)
exports.findUser = (codigo, callback) => {
  db.query(
    "SELECT * FROM usuarios WHERE codigo = ? OR email = ?",
    [codigo, codigo],
    callback
  );
};