const model = require("../models/reservas.model");

// Entrega los horarios ocupados de un espacio en una fecha determinada.
exports.getReservasPorEspacio = (req, res) => {
  model.getReservasPorEspacio(
    req.query.espacio_id,
    req.query.fecha,
    (err, result) => {
      if (err) return res.status(500).json({ success: false });
      res.json(result);
    }
  );
};

// Devuelve todas las reservas relacionadas con un espacio especifico.
exports.getReservasEspacio = (req, res) => {
  model.getReservasEspacio(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Intenta crear la reserva y avisa si el horario ya se encuentra ocupado.
exports.createReserva = (req, res) => {
  const data = {
    ...req.body,
    usuario_id: req.user.id
  };

  model.createReserva(data, (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result?.ocupado) {
      return res.json({ success: false, message: "Horario ocupado" });
    }
    res.json({ success: true });
  });
};

// Carga las reservas del usuario para mostrarlas en su panel personal.
exports.getMisReservas = (req, res) => {
  model.getMisReservas(req.params.id, (err, result) => {

    if (err) {
      console.error("ERROR RESERVAS:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// Cancela una reserva ya existente.
exports.cancelarReserva = (req, res) => {
  model.cancelarReserva(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// Actualiza fecha u horas de una reserva existente.
exports.updateReserva = (req, res) => {
  model.updateReserva(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true });
  });
};
