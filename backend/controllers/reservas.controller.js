// Controlador de reservas y disponibilidad de horarios.
const model = require("../models/reservas.model");
const {
  isValidDate,
  isValidTime,
  toPositiveInteger,
  validationError
} = require("../utils/requestValidators");

// Devuelve reservas de un espacio en una fecha concreta.
exports.getReservasPorEspacio = (req, res) => {
  const espacio_id = toPositiveInteger(req.query.espacio_id);
  const fecha = req.query.fecha;

  if (!espacio_id || !fecha) {
    return validationError(res, "Espacio y fecha son obligatorios", {
      espacio_id: !espacio_id ? ["Espacio invalido"] : undefined,
      fecha: !fecha ? ["La fecha es obligatoria"] : undefined
    });
  }

  if (!isValidDate(fecha)) {
    return validationError(res, "La fecha no tiene un formato valido", {
      fecha: ["Usa el formato YYYY-MM-DD"]
    });
  }

  model.getReservasPorEspacio(espacio_id, fecha, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Devuelve todas las reservas ligadas a un espacio.
exports.getReservasEspacio = (req, res) => {
  model.getReservasEspacio(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
};

// Crea una reserva nueva si los datos minimos son correctos.
exports.createReserva = (req, res) => {
  const espacio_id = toPositiveInteger(req.body.espacio_id);
  const fecha = req.body.fecha;
  const hora_inicio = req.body.hora_inicio;
  const hora_fin = req.body.hora_fin;

  if (!espacio_id || !fecha || !hora_inicio || !hora_fin) {
    return validationError(res, "Completa todos los campos de la reserva", {
      espacio_id: !espacio_id ? ["Espacio invalido"] : undefined,
      fecha: !fecha ? ["La fecha es obligatoria"] : undefined,
      hora_inicio: !hora_inicio ? ["La hora inicial es obligatoria"] : undefined,
      hora_fin: !hora_fin ? ["La hora final es obligatoria"] : undefined
    });
  }

  if (!isValidDate(fecha) || !isValidTime(hora_inicio) || !isValidTime(hora_fin)) {
    return validationError(res, "La fecha u hora no tienen un formato valido", {
      fecha: !isValidDate(fecha) ? ["Usa el formato YYYY-MM-DD"] : undefined,
      hora_inicio: !isValidTime(hora_inicio) ? ["Usa el formato HH:mm"] : undefined,
      hora_fin: !isValidTime(hora_fin) ? ["Usa el formato HH:mm"] : undefined
    });
  }

  if (hora_inicio >= hora_fin) {
    return validationError(res, "La hora fin debe ser mayor que la hora inicio", {
      hora_fin: ["La hora final debe ser posterior a la inicial"]
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

      if (result?.ocupado) {
        return res.json({ success: false, message: "Horario ocupado" });
      }

      res.json({ success: true });
    }
  );
};

// Devuelve las reservas del usuario actual.
exports.getMisReservas = (req, res) => {
  model.getMisReservas(req.params.id, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

// Cancela una reserva existente.
exports.cancelarReserva = (req, res) => {
  model.cancelarReserva(req.params.id, (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
};

// Reprograma una reserva validando fecha y rango horario.
exports.updateReserva = (req, res) => {
  const fecha = req.body.fecha;
  const hora_inicio = req.body.hora_inicio;
  const hora_fin = req.body.hora_fin;

  if (!fecha || !hora_inicio || !hora_fin) {
    return validationError(res, "Completa todos los campos", {
      fecha: !fecha ? ["La fecha es obligatoria"] : undefined,
      hora_inicio: !hora_inicio ? ["La hora inicial es obligatoria"] : undefined,
      hora_fin: !hora_fin ? ["La hora final es obligatoria"] : undefined
    });
  }

  if (!isValidDate(fecha) || !isValidTime(hora_inicio) || !isValidTime(hora_fin)) {
    return validationError(res, "La fecha u hora no tienen un formato valido", {
      fecha: !isValidDate(fecha) ? ["Usa el formato YYYY-MM-DD"] : undefined,
      hora_inicio: !isValidTime(hora_inicio) ? ["Usa el formato HH:mm"] : undefined,
      hora_fin: !isValidTime(hora_fin) ? ["Usa el formato HH:mm"] : undefined
    });
  }

  if (hora_inicio >= hora_fin) {
    return validationError(res, "La hora fin debe ser mayor que la hora inicio", {
      hora_fin: ["La hora final debe ser posterior a la inicial"]
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
