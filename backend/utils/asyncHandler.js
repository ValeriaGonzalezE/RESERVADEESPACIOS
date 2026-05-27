const asyncHandler = (fn) => (req, res, next) => {

  // Ejecuta la función async y captura cualquier error automáticamente
  // Si hay error, lo envía al middleware de errores (next)
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;