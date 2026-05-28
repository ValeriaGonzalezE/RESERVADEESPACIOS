// Controlador principal de espacios y comentarios.
const model = require("../models/espacios.model");
const db = require("../config/db");
const {
  cleanOptionalText,
  cleanText,
  toNonNegativeNumber,
  toPositiveInteger,
  validationError
} = require("../utils/requestValidators");

// Devuelve todos los espacios con los filtros enviados por query.
exports.getEspacios = (req, res) => {
  model.getEspacios(req.query, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Devuelve el detalle de un espacio y su galeria asociada.
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

          espacio.fotos = fotos.map((foto) => foto.url);
          res.json(espacio);
        }
      );
    }
  );
};

// Devuelve el catalogo de tipos de espacio.
exports.getTipos = (req, res) => {
  model.getTipos((err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Crea un espacio nuevo y registra sus fotos si fueron enviadas.
exports.createEspacio = (req, res) => {
  const nombre = cleanText(req.body.nombre);
  const tipo_id = toPositiveInteger(req.body.tipo_id);
  const capacidad = toPositiveInteger(req.body.capacidad);
  const ubicacion = cleanText(req.body.ubicacion);
  const descripcion = cleanOptionalText(req.body.descripcion);
  const requiere_pago = req.body.requiere_pago || "no";
  const precio = toNonNegativeNumber(req.body.precio || 0);

  if (!nombre || !tipo_id || !ubicacion) {
    return validationError(res, "Nombre, tipo y ubicacion son obligatorios", {
      nombre: !nombre ? ["El nombre es obligatorio"] : undefined,
      tipo_id: !tipo_id ? ["Selecciona un tipo valido"] : undefined,
      ubicacion: !ubicacion ? ["La ubicacion es obligatoria"] : undefined
    });
  }

  if (!capacidad) {
    return validationError(res, "La capacidad debe ser mayor a 0", {
      capacidad: ["Capacidad invalida"]
    });
  }

  if (requiere_pago === "si" && precio === null) {
    return validationError(res, "El precio no puede ser negativo", {
      precio: ["Precio invalido"]
    });
  }

  const data = {
    nombre,
    tipo_id,
    capacidad,
    ubicacion,
    descripcion,
    requiere_pago,
    precio: precio ?? 0,
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
        return res.status(500).json({ success: false, message: "No se pudo crear el espacio" });
      }

      const espacio_id = result.insertId;

      if (!req.files || req.files.length === 0) {
        return res.json({ success: true, message: "Espacio creado sin fotos" });
      }

      let guardadas = 0;

      req.files.forEach((file) => {
        const url = `/uploads/${file.filename}`;

        db.query(
          "INSERT INTO espacio_fotos (espacio_id, url) VALUES (?, ?)",
          [espacio_id, url],
          () => {
            guardadas += 1;

            if (guardadas === req.files.length) {
              res.json({
                success: true,
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

// Devuelve solo los espacios creados por el usuario actual.
exports.getMisEspacios = (req, res) => {
  model.getMisEspacios(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Actualiza un espacio existente con validaciones manuales simples.
exports.updateEspacio = (req, res) => {
  const nombre = cleanText(req.body.nombre);
  const tipo_id = toPositiveInteger(req.body.tipo_id);
  const capacidad = toPositiveInteger(req.body.capacidad);
  const ubicacion = cleanText(req.body.ubicacion);
  const precio = toNonNegativeNumber(req.body.precio || 0);

  if (!nombre || !ubicacion) {
    return validationError(res, "Nombre y ubicacion son obligatorios", {
      nombre: !nombre ? ["El nombre es obligatorio"] : undefined,
      ubicacion: !ubicacion ? ["La ubicacion es obligatoria"] : undefined
    });
  }

  if (!tipo_id) {
    return validationError(res, "Selecciona un tipo valido", {
      tipo_id: ["Tipo invalido"]
    });
  }

  if (!capacidad) {
    return validationError(res, "La capacidad debe ser mayor a 0", {
      capacidad: ["Capacidad invalida"]
    });
  }

  if (req.body.requiere_pago === "si" && precio === null) {
    return validationError(res, "El precio no puede ser negativo", {
      precio: ["Precio invalido"]
    });
  }

  model.updateEspacio(
    req.params.id,
    {
      ...req.body,
      nombre,
      tipo_id,
      capacidad,
      ubicacion,
      descripcion: cleanOptionalText(req.body.descripcion),
      requiere_pago: req.body.requiere_pago || "no",
      precio: precio ?? 0,
      estado: req.body.estado || "activo"
    },
    (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
};

// Elimina un espacio.
exports.deleteEspacio = (req, res) => {
  model.deleteEspacio(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// Devuelve comentarios asociados a un espacio.
exports.getComentarios = (req, res) => {
  model.getComentarios(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Crea un comentario con calificacion de 1 a 5 estrellas.
exports.createComentario = (req, res) => {
  const comentario = cleanText(req.body.comentario);
  const estrellas = toPositiveInteger(req.body.estrellas);
  const espacio_id = toPositiveInteger(req.body.espacio_id);

  if (!espacio_id || !comentario) {
    return validationError(res, "Espacio y comentario son obligatorios", {
      espacio_id: !espacio_id ? ["Espacio invalido"] : undefined,
      comentario: !comentario ? ["El comentario es obligatorio"] : undefined
    });
  }

  if (!estrellas || estrellas < 1 || estrellas > 5) {
    return validationError(res, "Las estrellas deben estar entre 1 y 5", {
      estrellas: ["Valor invalido"]
    });
  }

  model.createComentario(
    {
      espacio_id,
      comentario,
      estrellas,
      usuario_id: req.user.id
    },
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true, message: "Comentario creado" });
    }
  );
};
