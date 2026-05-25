const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    success: false,
    message: status === 500 ? "Error interno del servidor" : err.message
  });
};

module.exports = errorHandler;
