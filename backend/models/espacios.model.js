const db = require("../config/db");

// OBTENER ESPACIOS CON FILTROS
exports.getEspacios = (filters, callback) => {
  const { fecha, tipo, pago } = filters;

  let sql = `
    SELECT e.*, t.nombre AS tipo
    FROM espacios e
    JOIN tipos_espacio t ON e.tipo_id = t.id
    WHERE e.estado = 'activo'
  `;

  let params = [];

  // FILTRO: disponibilidad por fecha (evita espacios ya reservados)
  if (fecha) {
    sql += `
      AND e.id NOT IN (
        SELECT espacio_id
        FROM reservas
        WHERE fecha = ?
        AND estado = 'activa'
      )
    `;
    params.push(fecha);
  }

  // FILTRO: tipo de espacio
  if (tipo) {
    sql += " AND t.nombre = ?";
    params.push(tipo);
  }

  // FILTRO: si es de pago o gratis
  if (pago) {
    sql += " AND e.requiere_pago = ?";
    params.push(pago);
  }

  db.query(sql, params, callback);
};

// OBTENER TIPOS DE ESPACIOS
exports.getTipos = (callback) => {
  db.query("SELECT * FROM tipos_espacio", callback);
};

// CREAR ESPACIO
exports.createEspacio = (data, callback) => {
  db.query(
    `INSERT INTO espacios 
    (nombre, tipo_id, capacidad, ubicacion, descripcion, precio, requiere_pago, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.tipo_id,
      data.capacidad,
      data.ubicacion,
      data.descripcion,
      data.precio,
      data.requiere_pago,
      data.usuario_id
    ],
    callback
  );
};

// OBTENER ESPACIOS DE UN USUARIO
exports.getMisEspacios = (id, callback) => {
  db.query(
    `SELECT e.*, t.nombre AS tipo
     FROM espacios e
     JOIN tipos_espacio t ON e.tipo_id = t.id
     WHERE e.usuario_id = ?`,
    [id],
    callback
  );
};

// OBTENER UN ESPACIO POR ID
exports.getEspacio = (id, callback) => {
  db.query("SELECT * FROM espacios WHERE id = ?", [id], callback);
};

// ACTUALIZAR ESPACIO
exports.updateEspacio = (id, data, callback) => {
  db.query(
    `UPDATE espacios SET 
      nombre=?, tipo_id=?, capacidad=?, ubicacion=?, descripcion=?, 
      estado=?, requiere_pago=?, precio=?
     WHERE id=?`,
    [
      data.nombre,
      data.tipo_id,
      data.capacidad,
      data.ubicacion,
      data.descripcion,
      data.estado,
      data.requiere_pago,
      data.precio,
      id
    ],
    callback
  );
};

// ELIMINAR ESPACIO
exports.deleteEspacio = (id, callback) => {
  db.query("DELETE FROM espacios WHERE id = ?", [id], callback);
};

// OBTENER COMENTARIOS DE UN ESPACIO
exports.getComentarios = (id, callback) => {
  db.query(
    `SELECT c.*, u.nombre 
     FROM comentarios c
     JOIN usuarios u ON c.usuario_id = u.id
     WHERE c.espacio_id = ?
     ORDER BY c.fecha DESC`,
    [id],
    callback
  );
};

// CREAR COMENTARIO
exports.createComentario = (data, callback) => {
  db.query(
    `INSERT INTO comentarios (espacio_id, usuario_id, comentario, estrellas)
     VALUES (?, ?, ?, ?)`,
    [
      data.espacio_id,
      data.usuario_id,
      data.comentario,
      data.estrellas
    ],
    callback
  );
};