const model = require("../models/espacios.model");
const db = require("../config/db");

// Devuelve la lista de espacios aplicando los filtros enviados por query.
exports.getEspacios = (req, res) => {
  model.getEspacios(req.query, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Obtiene un espacio especifico junto con su tipo y sus fotos registradas.
exports.getEspacio = (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT e.*, t.nombre AS tipo
     FROM espacios e
     JOIN tipos_espacio t ON e.tipo_id = t.id
     WHERE e.id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const espacio = result[0];
      if (!espacio) {
        return res.status(404).json({
          success: false,
          message: "Espacio no encontrado"
        });
      }

      db.query(
        "SELECT url FROM espacio_fotos WHERE espacio_id = ?",
        [id],
        (err2, fotos) => {
          if (err2) return res.status(500).json(err2);

          espacio.fotos = fotos.map(f => f.url);

          res.json(espacio);
        }
      );
    }
  );
};

// Entrega al frontend las categorias disponibles de espacios.
exports.getTipos = (req, res) => {
  model.getTipos((err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Crea el espacio usando al usuario autenticado como propietario y guarda sus fotos.
exports.createEspacio = (req, res) => {
  const data = {
    ...req.body,
    usuario_id: req.user.id
  };

  db.query(
    `INSERT INTO espacios 
    (nombre, tipo_id, capacidad, ubicacion, descripcion, requiere_pago, precio, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.tipo_id,
      data.capacidad,
      data.ubicacion,
      data.descripcion,
      data.requiere_pago,
      data.precio,
      data.usuario_id
    ],
    (err, result) => {
      if (err) {
        console.error("ERROR ESPACIO:", err);
        return res.status(500).json(err);
      }

      const espacio_id = result.insertId;

      // SI NO HAY FOTOS
      if (!req.files || req.files.length === 0) {
        return res.json({ message: "Espacio creado sin fotos" });
      }

      // GUARDAR FOTOS
      let guardadas = 0;

      req.files.forEach(file => {
        const url = `/uploads/${file.filename}`;

        db.query(
          "INSERT INTO espacio_fotos (espacio_id, url) VALUES (?, ?)",
          [espacio_id, url],
          (err2) => {
            if (err2) {
              console.error("ERROR FOTO:", err2);
            }

            guardadas++;

            // cuando termine de guardar todas
            if (guardadas === req.files.length) {
              res.json({
                message: "Espacio creado con fotos",
                fotos: guardadas
              });
            }
          }
        );
      });
    }
  );
};

// Retorna los espacios que pertenecen al usuario indicado.
exports.getMisEspacios = (req, res) => {
  model.getMisEspacios(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Actualiza la informacion editable de un espacio.
exports.updateEspacio = (req, res) => {
  model.updateEspacio(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// Elimina un espacio cuando el usuario tiene permisos sobre el recurso.
exports.deleteEspacio = (req, res) => {
  model.deleteEspacio(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// Lista los comentarios asociados a un espacio.
exports.getComentarios = (req, res) => {
  model.getComentarios(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Crea un comentario tomando el usuario desde la sesion y no desde el body.
exports.createComentario = (req, res) => {
  const data = {
    ...req.body,
    usuario_id: req.user.id
  };

  model.createComentario(data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Comentario creado" });
  });
};
