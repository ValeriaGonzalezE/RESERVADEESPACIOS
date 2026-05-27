const model = require("../models/espacios.model");
const db = require("../config/db");

// OBTENER TODOS LOS ESPACIOS
exports.getEspacios = (req, res) => {
  model.getEspacios(req.query, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// OBTENER UN ESPACIO POR ID
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

// OBTENER TIPOS DE ESPACIOS
exports.getTipos = (req, res) => {
  model.getTipos((err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// CREAR ESPACIO
exports.createEspacio = (req, res) => {
  const nombre = req.body.nombre?.trim();
  const tipo_id = req.body.tipo_id;
  const capacidad = Number(req.body.capacidad);
  const ubicacion = req.body.ubicacion?.trim();
  const descripcion = req.body.descripcion?.trim() || "";
  const requiere_pago = req.body.requiere_pago || "no";
  const precio = Number(req.body.precio || 0);

  // Validación de campos obligatorios
  if (!nombre || !tipo_id || !ubicacion) {
    return res.status(400).json({
      success: false,
      message: "Nombre, tipo y ubicacion son obligatorios"
    });
  }

  // Validación de capacidad
  if (!capacidad || capacidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "La capacidad debe ser mayor a 0"
    });
  }

  // Validación de precio si es de pago
  if (requiere_pago === "si" && precio < 0) {
    return res.status(400).json({
      success: false,
      message: "El precio no puede ser negativo"
    });
  }

  // Estructura final del espacio a guardar
  const data = {
    nombre,
    tipo_id,
    capacidad,
    ubicacion,
    descripcion,
    requiere_pago,
    precio,
    usuario_id: req.user.id
  };

  // Inserción del espacio en la base de datos
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

      // Si no hay imágenes, se termina aquí
      if (!req.files || req.files.length === 0) {
        return res.json({ success: true, message: "Espacio creado sin fotos" });
      }

      // Inserción de imágenes asociadas al espacio
      let guardadas = 0;

      req.files.forEach((file) => {
        const url = `/uploads/${file.filename}`;

        db.query(
          "INSERT INTO espacio_fotos (espacio_id, url) VALUES (?, ?)",
          [espacio_id, url],
          () => {
            guardadas++;

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

// OBTENER MIS ESPACIOS
exports.getMisEspacios = (req, res) => {
  model.getMisEspacios(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// ACTUALIZAR ESPACIO
exports.updateEspacio = (req, res) => {
  const nombre = req.body.nombre?.trim();
  const capacidad = Number(req.body.capacidad);
  const ubicacion = req.body.ubicacion?.trim();

  if (!nombre || !ubicacion) {
    return res.status(400).json({
      success: false,
      message: "Nombre y ubicacion son obligatorios"
    });
  }

  if (!capacidad || capacidad <= 0) {
    return res.status(400).json({
      success: false,
      message: "La capacidad debe ser mayor a 0"
    });
  }

  model.updateEspacio(
    req.params.id,
    {
      ...req.body,
      nombre,
      capacidad,
      ubicacion,
      descripcion: req.body.descripcion?.trim() || "",
      requiere_pago: req.body.requiere_pago || "no",
      precio: Number(req.body.precio || 0),
      estado: req.body.estado || "activo"
    },
    (err) => {
      if (err) return res.status(500).json({ success: false });
      res.json({ success: true });
    }
  );
};

// ELIMINAR ESPACIO
exports.deleteEspacio = (req, res) => {
  model.deleteEspacio(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// OBTENER COMENTARIOS DE UN ESPACIO
exports.getComentarios = (req, res) => {
  model.getComentarios(req.params.id, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// CREAR COMENTARIO
exports.createComentario = (req, res) => {
  const comentario = req.body.comentario?.trim();
  const estrellas = Number(req.body.estrellas);
  const espacio_id = req.body.espacio_id;

  if (!espacio_id || !comentario) {
    return res.status(400).json({
      success: false,
      message: "Espacio y comentario son obligatorios"
    });
  }

  if (!estrellas || estrellas < 1 || estrellas > 5) {
    return res.status(400).json({
      success: false,
      message: "Las estrellas deben estar entre 1 y 5"
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