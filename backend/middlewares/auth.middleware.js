const jwt = require("jsonwebtoken");
const db = require("../config/db");

// FUNCIÓN AUXILIAR
const getJwtSecret = () => process.env.JWT_SECRET || "clave_desarrollo_reservas";

// MIDDLEWARE: requireAuth
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  // Validación del formato Bearer token
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Token requerido"
    });
  }

  try {
    // Verificación del token JWT
    req.user = jwt.verify(token, getJwtSecret());
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token invalido o expirado"
    });
  }
};

// MIDDLEWARE: requireRole
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({
      success: false,
      message: "No autorizado"
    });
  }

  next();
};

// MIDDLEWARE: requireSelfOrAdmin
const requireSelfOrAdmin = (param = "id") => (req, res, next) => {
  const requestedId = Number(req.params[param]);

  if (req.user?.rol === "admin" || Number(req.user?.id) === requestedId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "No autorizado"
  });
};

// MIDDLEWARE: requireSpaceOwnerOrAdmin
const requireSpaceOwnerOrAdmin = (req, res, next) => {
  if (req.user?.rol === "admin") {
    return next();
  }

  db.query(
    "SELECT usuario_id FROM espacios WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return next(err);

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: "Espacio no encontrado"
        });
      }

      if (Number(result[0].usuario_id) !== Number(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "No autorizado"
        });
      }

      next();
    }
  );
};

// MIDDLEWARE: requireReservationOwnerOrAdmin
const requireReservationOwnerOrAdmin = (param = "id") => (req, res, next) => {
  if (req.user?.rol === "admin") {
    return next();
  }

  db.query(
    "SELECT usuario_id FROM reservas WHERE id = ?",
    [req.params[param]],
    (err, result) => {
      if (err) return next(err);

      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: "Reserva no encontrada"
        });
      }

      if (Number(result[0].usuario_id) !== Number(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "No autorizado"
        });
      }

      next();
    }
  );
};

// EXPORTACIÓN DE MIDDLEWARES
module.exports = {
  requireAuth,
  requireRole,
  requireSelfOrAdmin,
  requireSpaceOwnerOrAdmin,
  requireReservationOwnerOrAdmin
};