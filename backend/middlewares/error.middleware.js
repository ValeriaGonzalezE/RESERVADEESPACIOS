const errorHandler = (err, req, res, next) => {
  // Imprime el error en consola para depuración en desarrollo
  console.error(err);

  // Si ya se enviaron headers, delega el error al siguiente handler
  if (res.headersSent) {
    return next(err);
  }

  // Define el código de estado del error
  // Usa el que venga en el error o por defecto 500
  const status = err.statusCode || err.status || 500;

  // Respuesta estándar de error al cliente
  res.status(status).json({
    success: false,
    message: status === 500 ? "Error interno del servidor" : err.message
  });
};

module.exports = errorHandler;