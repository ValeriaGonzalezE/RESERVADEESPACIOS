const model = require("../models/reservas.model");

// OBTENER RESERVAS POR ESPACIO Y FECHA
exports.getReservasPorEspacio = (req, res) => {
  const espacio_id = req.query.espacio_id;
  const fecha = req.query.fecha;

  // Validación de parámetros obligatorios
  if (!espacio_id || !fecha) {
    return res.status(400).json({
      success: false,
      message: "Espacio y fecha son obligatorios"
    });
  }

  model.getReservasPorEspacio(espacio_id, fecha, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// OBTENER RESERVAS DE UN ESPACIO (SIN FILTRO DE FECHA)
exports.getReservasEspacio = (req, res) => {
  model.getReservasEspacio(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// CREAR RESERVA
exports.createReserva = (req, res) => {
  const espacio_id = req.body.espacio_id;
  const fecha = req.body.fecha;
  const hora_inicio = req.body.hora_inicio;
  const hora_fin = req.body.hora_fin;

  // Validación de campos obligatorios
  if (!espacio_id || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({
      success: false,
      message: "Completa todos los campos de la reserva"
    });
  }

  if (hora_inicio >= hora_fin) {
    return res.status(400).json({
      success: false,
      message: "La hora fin debe ser mayor que la hora inicio"
    });
  }

  model.createReserva(
    {
      espacio_id,
      fecha,
      hora_inicio,
      hora_fin,
      usuario_id: req.user.id
    },
    (err, result) => {
      if (err) return res.status(500).json({ success: false });

      // Caso especial: el modelo indica que el horario está ocupado
      if (result?.ocupado) {
        return res.json({ success: false, message: "Horario ocupado" });
      }

      res.json({ success: true });
    }
  );
};

// OBTENER MIS RESERVAS
exports.getMisReservas = (req, res) => {
  model.getMisReservas(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// CANCELAR RESERVA
exports.cancelarReserva = (req, res) => {
  model.cancelarReserva(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// ACTUALIZAR RESERVA
exports.updateReserva = (req, res) => {
  const fecha = req.body.fecha;
  const hora_inicio = req.body.hora_inicio;
  const hora_fin = req.body.hora_fin;

  // Validación de campos obligatorios
  if (!fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({
      success: false,
      message: "Completa todos los campos"
    });
  }

  // Validación de lógica de horarios
  if (hora_inicio >= hora_fin) {
    return res.status(400).json({
      success: false,
      message: "La hora fin debe ser mayor que la hora inicio"
    });
  }

  model.updateReserva(
    req.params.id,
    { fecha, hora_inicio, hora_fin },
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
};